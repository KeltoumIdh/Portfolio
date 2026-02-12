"""
Groq key handling and safe debug helpers. Never log or return full secrets.
"""
import json
import os
import urllib.error
import urllib.request

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_HEADER_AUTH = "Authorization"
GROQ_HEADER_BEARER = "Bearer "
# Cloudflare (in front of Groq) can return 403/1010 for default Python User-Agent; use a standard one.
GROQ_USER_AGENT = "Groq-API-Client/1.0 (Python; portfolio-backend)"


def get_groq_key_stripped() -> str:
    """Read GROQ_API_KEY from env and strip whitespace/newlines."""
    return (os.getenv("GROQ_API_KEY") or "").strip()


def log_groq_key_safe(key: str) -> None:
    """
    Log safe diagnostics only: length, first4+last4, repr tail for hidden chars.
    Never logs the full key.
    """
    if not key:
        print("[groq] GROQ_API_KEY is not set or empty.")
        return
    length = len(key)
    if length > 8:
        preview = f"{key[:4]}...{key[-4:]}"
    else:
        preview = "***"
    repr_key = repr(key)
    repr_tail = repr_key[-8:] if len(repr_key) >= 8 else repr_key
    raw_env = os.getenv("GROQ_API_KEY") or ""
    strip_changed = raw_env != raw_env.strip()
    print(
        "[groq] GROQ_API_KEY: length=%d, preview=%s, repr_tail=%r, strip_changed=%s"
        % (length, preview, repr_tail, strip_changed)
    )


def groq_test_request() -> dict:
    """
    Make a minimal Groq chat request. Returns dict with ok, error, raw_response.
    Never includes the API key in the response.
    """
    key = get_groq_key_stripped()
    if not key:
        return {
            "ok": False,
            "error": "GROQ_API_KEY is not set or empty",
            "raw_response": None,
        }
    log_groq_key_safe(key)

    req = urllib.request.Request(
        GROQ_CHAT_URL,
        data=json.dumps({
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": "Say OK"}],
            "max_tokens": 10,
        }).encode("utf-8"),
        headers={
            GROQ_HEADER_AUTH: GROQ_HEADER_BEARER + key,
            "Content-Type": "application/json",
            "User-Agent": GROQ_USER_AGENT,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode()
            data = json.loads(body)
            if data.get("choices") and len(data["choices"]) > 0:
                return {"ok": True, "error": None, "raw_response": body[:500]}
            return {"ok": False, "error": "Unexpected response shape", "raw_response": body[:500]}
    except urllib.error.HTTPError as e:
        raw = e.read().decode() if e.fp else ""
        out = {
            "ok": False,
            "error": f"HTTP {e.code}: {raw}",
            "raw_response": raw[:1000],
        }
        if e.code == 403 and "1010" in raw:
            out["hint"] = (
                "Cloudflare 1010 = access denied (often region/network or blocked User-Agent). "
                "Try: different network, disable VPN, or run from another machine. "
                "Backend sends User-Agent: Groq-API-Client/1.0; restart and retry."
            )
        return out
    except Exception as e:
        return {
            "ok": False,
            "error": str(e),
            "raw_response": None,
        }
