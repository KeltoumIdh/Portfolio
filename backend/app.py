import sys
if sys.version_info >= (3, 14) or sys.version_info < (3, 9):
    print("This backend requires Python 3.9, 3.10, 3.11, or 3.12 (not 3.14+).")
    print("Current:", sys.version)
    print("On Windows, use: py -3.12 -m venv venv   then  venv\\Scripts\\activate")
    sys.exit(1)

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import query_portfolio
import uvicorn

app = FastAPI(title="Portfolio AI Assistant")

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://your-portfolio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    sources: list = []  # Could add source projects here

@app.get("/")
def health_check():
    return {"status": "AI Assistant API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Get response from RAG system
        reply = query_portfolio(request.message)

        # You could enhance this to return which projects were referenced
        return ChatResponse(reply=reply, sources=[])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)