"""
Temporary debug endpoints for diagnosing API key / provider issues.
Do not expose in production or remove after debugging.
"""
from fastapi import APIRouter

from ..utils.groq_debug import groq_test_request

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/groq-test")
def groq_test():
    """
    Make a minimal Groq request and return ok/error and raw response.
    Use to verify GROQ_API_KEY and see exact Groq error. No secrets in response.
    """
    result = groq_test_request()
    return result
