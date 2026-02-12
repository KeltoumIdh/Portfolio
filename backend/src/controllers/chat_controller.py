from ..services.rag_service import answer


async def chat(message: str) -> str:
  return answer(message)

