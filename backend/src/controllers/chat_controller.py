from ..services.rag_service import answer
from typing import Optional


async def chat(message: str, session_id: Optional[str] = None):
  return answer(message, session_id=session_id)

