from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health_check():
  return {"status": "AI Assistant API is running"}

