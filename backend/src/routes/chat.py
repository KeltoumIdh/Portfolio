from fastapi import APIRouter, HTTPException

from ..controllers.chat_controller import chat as chat_handler
from ..validators.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
  try:
    reply, session_id, sources = await chat_handler(request.message, session_id=request.session_id)
    return ChatResponse(reply=reply, session_id=session_id, sources=sources)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

