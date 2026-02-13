from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def root():
  return {"status": "AI Assistant API is running"}


@router.get("/health")
def health():
  return {"status": "ok"}

