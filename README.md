# Portfolio with AI Assistant

A portfolio site with a chatbot that answers questions about your projects using a RAG (Retrieval-Augmented Generation) pipeline. **Backend**: FastAPI + LangChain. **Frontend**: React + Vite.

You can use **free APIs** (Groq + Hugging Face) or **OpenAI** (paid).

---

## Prerequisites

- **Python 3.9, 3.10, 3.11, or 3.12** for the backend (**do not use Python 3.14**)
- **Node.js 18+** (for frontend)
- **Free API keys** (recommended): Groq + Hugging Face token. Or an OpenAI API key (paid).

---

## 1. Backend setup

```bash
cd backend
```

Create a virtual environment with a supported Python version:

**Windows (use 3.12 if you have it):**
```bash
py -3.12 -m venv venv
# then activate:
venv\Scripts\activate
# or in Git Bash:
source venv/Scripts/activate
```

**If you only have one Python and it’s 3.14:** install Python 3.12 from [python.org](https://www.python.org/downloads/) and then run `py -3.12 -m venv venv` above.

**macOS/Linux:**
```bash
python3.12 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment (use **free** or OpenAI):

**Option A – Free tier (recommended)**  
Create or edit `backend/.env` and add:
```env
GROQ_API_KEY=your-groq-api-key
HUGGINGFACEHUB_API_TOKEN=your-hf-token
```
- **Groq** (free): sign up at https://console.groq.com → API Keys → Create. Used for the chat model (Llama).
- **Hugging Face** (free): go to https://huggingface.co/settings/tokens → New token (read). Used for embeddings.

**Option B – OpenAI (paid / quota limits)**  
If you don’t set the two keys above, you can use OpenAI instead:
```env
OPENAI_API_KEY=sk-your-openai-key
```
Get a key from https://platform.openai.com/api-keys.

Run the API:

```bash
python app.py
```

Or with uvicorn directly:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be at **http://localhost:8000**. You can check **http://localhost:8000** in the browser to see the health message.

---

## 2. Frontend setup

Open a **new terminal** and run:

```bash
cd frontend
```

Install dependencies (includes React, Vite, axios, etc.):

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app will open at **http://localhost:5173**. You should see the portfolio page with the **Portfolio Assistant** chatbot in the bottom-right.

---

## 3. How to run everything (quick reference)

1. **Terminal 1 – Backend**
   ```bash
   cd backend
   source venv/Scripts/activate   # Git Bash/WSL; use venv\Scripts\activate.bat in CMD
   pip install -r requirements.txt
   python app.py
   ```

2. **Terminal 2 – Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser and use the chatbot to ask about your projects (e.g. “What projects do you have?” or “Tell me about the rust detection project”).

---

## Optional: Frontend env for production API

To point the frontend at a different backend (e.g. in production), create `frontend/.env`:

```env
VITE_API_URL=https://your-backend-api.com
```

For local development you can leave this unset; the app uses `http://localhost:8000` by default.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| “Sorry, I'm having trouble connecting” in the chatbot | Ensure the backend is running on port 8000 and CORS is enabled (already set for `http://localhost:5173`). |
| Backend error on startup about OpenAI / API key | Set a valid `OPENAI_API_KEY` in `backend/.env` (key should start with `sk-`). |
| First chat request is slow | The first request builds the vector store from `backend/data/projects.json`; later requests are faster. |
| Port 8000 or 5173 already in use | Change the port in `python app.py` (e.g. `uvicorn.run(..., port=8001)`) or in `frontend/vite.config.js` (`server.port`). |
| Backend: `Preparing metadata (pydantic-core) ... error` / Rust / Python 3.14 | Use **Python 3.11 or 3.12** (e.g. install from python.org or use `py -3.12 -m venv venv`). Python 3.14 often has no pre-built wheels yet. |
| Backend: NumPy "Unknown compiler" / "Failed to activate VS environment" / metadata-generation-failed | You're on **Python 3.14**; NumPy and other deps have no Windows wheels for it. Use **Python 3.12**: install from python.org, then `cd backend`, remove the old venv (`rm -rf venv` or delete the folder), run `py -3.12 -m venv venv`, activate, then `pip install -r requirements.txt`. |
| Frontend: `Cannot find module '...vite\bin\vite.js'` or `node_modules\.bin\` not recognized | The dev script now runs Vite via `node ./node_modules/vite/bin/vite.js`. If your project path contains `&` (e.g. `genAi_&_ML`), Windows may break the path—try moving the project to a path without `&`, or run from the frontend folder: `node node_modules/vite/bin/vite.js`. |
| Backend: `chroma-hnswlib` / "Microsoft Visual C++ 14.0 or greater is required" | The project now uses **FAISS** instead of Chroma (no C++ build needed). Re-run `pip install -r requirements.txt`. If you still see this, you have an old cached install—delete the `venv` folder and create a new one, then install again. |

---

## Project layout

- **backend/** – FastAPI app, RAG pipeline (LangChain + FAISS + OpenAI), `data/projects.json`.
- **frontend/** – React app (Vite), `Chatbot.jsx` talks to `POST /chat` on the backend.
