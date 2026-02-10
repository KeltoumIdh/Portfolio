"""
RAG pipeline: uses free APIs (Hugging Face + Groq) by default, or OpenAI if you set OPENAI_API_KEY.
"""
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.embeddings.base import Embeddings
import json
import os

# Paths relative to this file
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_DATA_PATH = os.path.join(_BASE_DIR, "data", "projects.json")
_FAISS_INDEX_FREE = os.path.join(_BASE_DIR, "faiss_index_free")   # Hugging Face embeddings
_FAISS_INDEX_OPENAI = os.path.join(_BASE_DIR, "faiss_index")       # OpenAI embeddings

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
    def __init__(self, api_key: str, model: str = "llama-3.1-8b-instant", temperature: float = 0.3):
        self.api_key = api_key
        self.model = model
        self.temperature = temperature

    def __call__(self, prompt: str) -> str:
        import urllib.request
        import urllib.error
        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/chat/completions",
            data=json.dumps({
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": self.temperature,
            }).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
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
    """Use free APIs: Hugging Face (embeddings) + Groq (LLM). No huggingface_hub required."""
    documents = _load_projects_as_documents()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    # Embeddings: try HF API (multiple models), fall back to local sentence-transformers on 410
    hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
    embeddings = _get_free_embeddings(hf_token)

    if os.path.exists(_FAISS_INDEX_FREE):
        vector_store = FAISS.load_local(_FAISS_INDEX_FREE, embeddings)
    else:
        vector_store = FAISS.from_documents(chunks, embeddings)
        vector_store.save_local(_FAISS_INDEX_FREE)

    groq_key = os.getenv("GROQ_API_KEY")
    try:
        from langchain_groq import ChatGroq
        llm = ChatGroq(api_key=groq_key, model="llama-3.1-8b-instant", temperature=0.3)
    except ImportError:
        from langchain.llms.base import LLM
        from typing import Optional, List, Any, Mapping

        class _GroqLLM(LLM):
            api_key: str
            model: str = "llama-3.1-8b-instant"
            temperature: float = 0.3

            @property
            def _llm_type(self) -> str:
                return "groq"

            def _call(self, prompt: str, stop: Optional[List[str]] = None, **kwargs: Any) -> str:
                return _GroqLLMFallback(self.api_key, self.model, self.temperature)(prompt)

            @property
            def _identifying_params(self) -> Mapping[str, Any]:
                return {"model": self.model}
        llm = _GroqLLM(api_key=groq_key)

    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
    )

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
        temperature=0.3,
    )

    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
    )

def create_rag_system():
    """Prefer free APIs if keys are set, else OpenAI."""
    groq = os.getenv("GROQ_API_KEY", "").strip()
    hf = os.getenv("HUGGINGFACEHUB_API_TOKEN", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    if groq and hf:
        return _create_rag_with_free_apis()
    if openai_key:
        return _create_rag_with_openai()
    raise RuntimeError(
        "No API keys set. For free tier: set GROQ_API_KEY and HUGGINGFACEHUB_API_TOKEN in backend/.env. "
        "Get Groq key at https://console.groq.com and HF token at https://huggingface.co/settings/tokens. "
        "Or set OPENAI_API_KEY for OpenAI (paid)."
    )

# Initialize once; on failure app still starts and chat returns a message
rag_qa = None
_rag_error = None
try:
    rag_qa = create_rag_system()
except Exception as e:
    _rag_error = str(e)

def query_portfolio(question: str) -> str:
    """Query the RAG system about portfolio."""
    if rag_qa is None:
        err = _rag_error or "RAG not initialized"
        if "quota" in err.lower() or "429" in err or "insufficient_quota" in err.lower():
            return (
                "The AI assistant is temporarily unavailable: your OpenAI account has exceeded its quota. "
                "Use free APIs instead: set GROQ_API_KEY and HUGGINGFACEHUB_API_TOKEN in backend/.env (see README)."
            )
        if "401" in err or "invalid" in err.lower() or "authentication" in err.lower():
            return "Invalid API key. For free tier set GROQ_API_KEY and HUGGINGFACEHUB_API_TOKEN in backend/.env. See README."
        return f"The AI assistant could not start: {err}"
    return rag_qa.run(question)
