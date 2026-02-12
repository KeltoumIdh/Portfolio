"""
Compatibility shim.

The RAG implementation lives in `backend/src/services/rag_pipeline.py`.
This module re-exports `query_portfolio` to avoid breaking older imports.
"""

from src.services.rag_pipeline import query_portfolio  # noqa: F401

