from fastapi import APIRouter

from .chat import router as chat_router
from .health import router as health_router


def build_router() -> APIRouter:
  api = APIRouter()
  api.include_router(health_router)
  api.include_router(chat_router)
  return api

