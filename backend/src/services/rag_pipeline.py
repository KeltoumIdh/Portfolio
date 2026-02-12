"""
RAG pipeline: uses free APIs (Hugging Face + Groq) by default, or OpenAI if you set OPENAI_API_KEY.
"""
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings.base import Embeddings
import json
import os
from pathlib import Path
from typing import Optional

from ..utils.groq_debug import (
    get_groq_key_stripped,
    log_groq_key_safe,
    GROQ_CHAT_URL,
    GROQ_HEADER_AUTH,
    GROQ_HEADER_BEARER,
    GROQ_USER_AGENT,
)

# Paths relative to backend root (…/backend)
_BACKEND_DIR = Path(__file__).resolve().parents[2]
_DATA_PATH = _BACKEND_DIR / "data" / "projects.json"
_FAISS_INDEX_FREE = _BACKEND_DIR / "faiss_index_free"   # Hugging Face embeddings
_FAISS_INDEX_OPENAI = _BACKEND_DIR / "faiss_index"       # OpenAI embeddings


def _mask_secret(value: str, keep: int = 4) -> str:
    v = (value or "").strip()
    if not v:
        return ""
    if len(v) <= keep * 2:
        return "*" * len(v)
    return f"{v[:keep]}…{v[-keep:]}"


def _debug_env_state() -> None:
    """Print a SAFE env snapshot when ENV_DEBUG=1 (never prints full secrets)."""
    if os.getenv("ENV_DEBUG", "").strip() != "1":
        return
    groq = os.getenv("GROQ_API_KEY", "").strip()
    hf = (os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN") or "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    print("[env] GROQ_API_KEY:", _mask_secret(groq))
    print("[env] HUGGINGFACEHUB_API_TOKEN/HF_TOKEN:", _mask_secret(hf))
    print("[env] OPENAI_API_KEY:", _mask_secret(openai_key))

def _load_projects_as_documents():
    """Load projects.json and convert to LangChain Documents."""
    with open(_DATA_PATH, encoding="utf-8") as f:
        projects = json.load(f)
    documents = []
    for p in projects:
        text = (
            f"Project: {p.get('title', '')}. "
            f"Description: {p.get('description', '')}. "
            f"Technologies: {', '.join(p.get('technologies', []))}."
        )
        documents.append(Document(page_content=text, metadata={"title": p.get("title", "")}))
    return documents

class _HFEmbeddingsViaAPI(Embeddings):
    """Hugging Face embeddings via Inference API."""
    def __init__(self, token: str, model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.token = token
        self.url = f"https://api-inference.huggingface.co/models/{model}"

    def _embed(self, texts):
        import urllib.request
        import urllib.error
        single = isinstance(texts, str)
        if single:
            texts = [texts]
        body = json.dumps({"inputs": texts if len(texts) > 1 else texts[0]}).encode("utf-8")
        req = urllib.request.Request(
            self.url,
            data=body,
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                out = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 410:
                raise RuntimeError(
                    "HTTP 410: Hugging Face serverless API for this model is no longer available. "
                    "Install local embeddings: pip install sentence-transformers then restart."
                ) from e
            raise
        if isinstance(out, list):
            if out and isinstance(out[0], (int, float)):
                return [out]
            return out
        raise RuntimeError(f"Unexpected HF API response: {type(out)}")

    def embed_documents(self, texts: list) -> list:
        result = []
        for i in range(0, len(texts), 8):
            chunk = texts[i : i + 8]
            result.extend(self._embed(chunk))
        return result

    def embed_query(self, text: str) -> list:
        return self._embed(text)[0]


def _get_free_embeddings(hf_token: str):
    """Return embeddings: try HF API, on 410 try local sentence-transformers."""
    hf_token = (hf_token or "").strip()
    if not hf_token:
        # No HF token set: use local sentence-transformers (no external API key needed).
        try:
            from langchain.embeddings import HuggingFaceEmbeddings
            return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        except Exception as e:
            raise RuntimeError(
                "Missing HUGGINGFACEHUB_API_TOKEN and local embeddings are unavailable. "
                "Fix: set HUGGINGFACEHUB_API_TOKEN in backend/.env OR install local embeddings: "
                "pip install sentence-transformers"
            ) from e
    # 1) Try HF API (alternative model in case all-MiniLM is gone)
    for model in ("BAAI/bge-small-en-v1.5", "sentence-transformers/all-MiniLM-L6-v2", "intfloat/e5-small-v2"):
        try:
            emb = _HFEmbeddingsViaAPI(token=hf_token, model=model)
            emb.embed_query("probe")
            return emb
        except RuntimeError as e:
            if "410" in str(e):
                continue
            raise
        except Exception:
            continue
    # 2) Fallback: local sentence-transformers (no API, runs on your machine)
    try:
        from langchain.embeddings import HuggingFaceEmbeddings
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    except Exception as e:
        raise RuntimeError(
            "Hugging Face embedding API returned 410 (no longer available). "
            "Use local embeddings: run 'pip install sentence-transformers' in your backend venv, then restart."
        ) from e


class _GroqLLMFallback:
    """Minimal LLM that calls Groq API directly (used when langchain_groq is not installed)."""
    def __init__(
        self,
        api_key: str,
        model: str = "llama-3.3-70b-versatile",
        temperature: float = 0.7,
        max_tokens: int = 800,
    ):
        self.api_key = (api_key or "").strip()
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    def __call__(self, prompt: str) -> str:
        import urllib.request
        import urllib.error
        req = urllib.request.Request(
            GROQ_CHAT_URL,
            data=json.dumps({
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": self.temperature,
                "max_tokens": self.max_tokens,
            }).encode("utf-8"),
            headers={
                GROQ_HEADER_AUTH: GROQ_HEADER_BEARER + self.api_key,
                "Content-Type": "application/json",
                "User-Agent": GROQ_USER_AGENT,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                out = json.loads(resp.read().decode())
                return out["choices"][0]["message"]["content"].strip()
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else ""
            raise RuntimeError(f"Groq API error {e.code}: {body}") from e
        except (KeyError, IndexError) as e:
            raise RuntimeError("Unexpected Groq API response") from e

def _create_rag_with_free_apis():
    """
    Use Groq for chat + embeddings via:
    - Hugging Face Inference API if HUGGINGFACEHUB_API_TOKEN is set, otherwise
    - local sentence-transformers (no API key) if installed.
    """
    documents = _load_projects_as_documents()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    # Embeddings: HF API if token is set, otherwise local sentence-transformers
    hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
    embeddings = _get_free_embeddings(hf_token)

    if os.path.exists(_FAISS_INDEX_FREE):
        vector_store = FAISS.load_local(_FAISS_INDEX_FREE, embeddings)
    else:
        vector_store = FAISS.from_documents(chunks, embeddings)
        vector_store.save_local(_FAISS_INDEX_FREE)

    groq_key = get_groq_key_stripped()
    if not groq_key:
        raise RuntimeError("GROQ_API_KEY is empty. Set it in backend/.env (no quotes, no spaces around =).")
    log_groq_key_safe(groq_key)
    model = (os.getenv("GROQ_MODEL") or "").strip() or "llama-3.3-70b-versatile"
    temperature = float(os.getenv("GROQ_TEMPERATURE", "0.7"))
    max_tokens = int(os.getenv("GROQ_MAX_TOKENS", "800"))
    try:
        from langchain_groq import ChatGroq
        try:
            llm = ChatGroq(
                api_key=groq_key,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except TypeError:
            # Older ChatGroq versions may not support max_tokens
            llm = ChatGroq(api_key=groq_key, model=model, temperature=temperature)
    except ImportError:
        from langchain.llms.base import LLM
        from typing import Optional, List, Any, Mapping

        _gmodel = model
        _gtemp = temperature
        _gmax = max_tokens

        class _GroqLLM(LLM):
            api_key: str
            model: str = _gmodel
            temperature: float = _gtemp
            max_tokens: int = _gmax

            @property
            def _llm_type(self) -> str:
                return "groq"

            def _call(self, prompt: str, stop: Optional[List[str]] = None, **kwargs: Any) -> str:
                return _GroqLLMFallback(
                    api_key=self.api_key,
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                )(prompt)

            @property
            def _identifying_params(self) -> Mapping[str, Any]:
                return {"model": self.model}
        llm = _GroqLLM(api_key=groq_key)

    return {
        "llm": llm,
        "retriever": vector_store.as_retriever(search_kwargs={"k": 3}),
    }

def _create_rag_with_openai():
    """Use OpenAI (paid / quota-limited)."""
    from langchain.embeddings import OpenAIEmbeddings
    from langchain.chat_models import ChatOpenAI

    documents = _load_projects_as_documents()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

    if os.path.exists(_FAISS_INDEX_OPENAI):
        vector_store = FAISS.load_local(_FAISS_INDEX_OPENAI, embeddings)
    else:
        vector_store = FAISS.from_documents(chunks, embeddings)
        vector_store.save_local(_FAISS_INDEX_OPENAI)

    llm = ChatOpenAI(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-3.5-turbo",
        temperature=0.7,
        max_tokens=800,
    )

    return {
        "llm": llm,
        "retriever": vector_store.as_retriever(search_kwargs={"k": 3}),
    }

def create_rag_system():
    """Prefer Groq if set, else OpenAI. Embeddings can be HF-token, OpenAI, or local."""
    groq = get_groq_key_stripped()
    hf = os.getenv("HUGGINGFACEHUB_API_TOKEN", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    if groq:
        return _create_rag_with_free_apis()
    if openai_key:
        return _create_rag_with_openai()
    if hf:
        raise RuntimeError(
            "HUGGINGFACEHUB_API_TOKEN is set, but no chat model key was found. "
            "Set GROQ_API_KEY (recommended) or OPENAI_API_KEY to enable chat."
        )
    raise RuntimeError(
        "No API keys set. Set at least one of: GROQ_API_KEY (recommended) or OPENAI_API_KEY. "
        "Optional: set HUGGINGFACEHUB_API_TOKEN for HF API embeddings; otherwise local embeddings are used."
    )

_rag_runtime = None
_rag_error: Optional[str] = None
_rag_initialized = False


def _init_rag_once() -> None:
    """Lazy-init so env vars can load before we read them."""
    global _rag_initialized, _rag_runtime, _rag_error
    if _rag_initialized:
        return
    _rag_initialized = True
    _debug_env_state()
    try:
        _rag_runtime = create_rag_system()
    except Exception as e:
        _rag_error = str(e)

def query_portfolio(
    question: str,
    *,
    system_prompt: str = "",
    portfolio_summary: str = "",
    chat_history: str = "",
) -> str:
    """Query the RAG system about the portfolio with optional guardrails + memory."""
    _init_rag_once()
    if _rag_runtime is None:
        err = _rag_error or "RAG not initialized"
        if "quota" in err.lower() or "429" in err or "insufficient_quota" in err.lower():
            return (
                "The AI assistant is temporarily unavailable: your OpenAI account has exceeded its quota. "
                "Use free APIs instead: set GROQ_API_KEY and HUGGINGFACEHUB_API_TOKEN in backend/.env (see README)."
            )
        if "401" in err or "invalid" in err.lower() or "authentication" in err.lower():
            return (
                "Invalid API key for the configured provider. "
                "Check GROQ_API_KEY / OPENAI_API_KEY in backend/.env and restart the backend."
            )
        return f"The AI assistant could not start: {err}"
    try:
        retriever = _rag_runtime["retriever"]
        llm = _rag_runtime["llm"]

        docs = retriever.get_relevant_documents(question)
        context = "\n\n".join(d.page_content for d in docs) if docs else ""

        prompt_parts = []
        if system_prompt.strip():
            prompt_parts.append(system_prompt.strip())
        if portfolio_summary.strip():
            prompt_parts.append("PORTFOLIO SUMMARY:\n" + portfolio_summary.strip())
        if chat_history.strip():
            prompt_parts.append("CONVERSATION HISTORY:\n" + chat_history.strip())
        prompt_parts.append("RETRIEVED CONTEXT:\n" + (context or "(no relevant snippets retrieved)"))
        prompt_parts.append("USER QUESTION:\n" + question.strip())
        prompt_parts.append(
            "RESPONSE STYLE (follow strictly):\n"
            "- 5–8 lines max. Short intro sentence, then Key Highlights (bullets), then optional 'Want more details? Just ask.'\n"
            "- For projects: intro, then Key Highlights with • Challenge: • Tech used: • Result: • Impact:\n"
            "- Recruiter-friendly and skimmable. No long essays unless the user asks for more.\n"
            "- Do not repeat your identity. Keep tone professional and natural.\n"
        )
        full_prompt = "\n\n".join(prompt_parts).strip()

        # Works for both LLM and ChatModel implementations in LangChain 0.0.340
        return llm.predict(full_prompt).strip()
    except Exception as e:
        msg = str(e)
        if "api.groq.com" in msg.lower() or "groq" in msg.lower():
            if "invalid" in msg.lower() or "401" in msg or "403" in msg or "invalid_api_key" in msg:
                return (
                    "Groq says this API key is invalid. Fix: 1) In backend/.env use exactly: GROQ_API_KEY=gsk_your_key "
                    "(no quotes, no spaces around =). 2) Copy the key again from https://console.groq.com/keys "
                    "(Create API Key → copy the secret once). 3) Restart the backend."
                )
            return f"Groq provider error: {msg}"
        if "openai" in msg.lower():
            return f"OpenAI provider error: {msg}"
        return f"The AI assistant encountered an error: {msg}"
