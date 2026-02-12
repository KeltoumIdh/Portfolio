from fastapi import APIRouter, HTTPException

from ..controllers.chat_controller import chat as chat_handler
from ..validators.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
  try:
    reply = await chat_handler(request.message)
    return ChatResponse(reply=reply, sources=[])
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

