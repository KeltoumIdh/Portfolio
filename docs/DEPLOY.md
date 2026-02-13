# Deploying the Portfolio

You have a **frontend** (React/Vite) and a **backend** (FastAPI). Deploy them separately, then connect the frontend to the backend URL.

---

## 1. Push your code (Git)

From the project root:

```bash
git add .
git status
git commit -m "Portfolio updates: projects, chatbot, UI"
git push origin main
```

(Use your real branch name if it’s not `main`, e.g. `git push origin master`.)

---

## 2. Deploy frontend (e.g. Vercel or Netlify)

### Option A – Vercel (recommended for Vite)

1. Go to [vercel.com](https://vercel.com), sign in, and **Import** your Git repo.
2. Set **Root Directory** to `frontend`.
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Add an **Environment Variable** (Production):
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.com` (you’ll set this after deploying the backend)
6. Deploy. Your site will be at `https://your-project.vercel.app`.

### Option B – Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
2. Set **Base directory** to `frontend`.
3. **Build command:** `npm run build`
4. **Publish directory:** `frontend/dist`
5. In **Site settings → Environment variables**, add:
   - `VITE_API_URL` = `https://YOUR-BACKEND-URL.com`
6. Redeploy after adding the variable.

---

## 3. Deploy backend (e.g. Render or Railway)

The backend needs **Python 3.9–3.12**, env vars (e.g. `GROQ_API_KEY`), and to run `python app.py` (or `uvicorn`). It also reads `backend/data/projects.json` and can write `backend/faiss_index_free/` (allow writable filesystem or prebuild index).

**Why we avoid tiktoken on Render (free tier):** The default `requirements.txt` does **not** include `openai` or `langchain-openai`. Those packages pull in **tiktoken**, which often fails to build on Render’s free tier (Rust/build tooling). The app is set up to use **Groq only** by default; set `GROQ_API_KEY` in the backend env. If you add `openai` and `langchain-openai` for OpenAI support, installs may fail on Render; use Groq for a reliable free deploy.

### Option A – Render (free tier)

1. Go to [render.com](https://render.com) → **New** → **Web Service**.
2. Connect your repo.
3. **Root Directory:** leave empty (repo root).
4. **Runtime:** Python 3.
5. **Build command:**
   ```bash
   cd backend && pip install -r requirements.txt
   ```
6. **Start command:**
   ```bash
   cd backend && python app.py
   ```
   Or, if Render expects the app in root:
   ```bash
   cd backend && uvicorn src.main:app --host 0.0.0.0 --port $PORT
   ```
   (Use `$PORT` so Render can set the port.)
7. **Environment variables** (in Render dashboard):
   - `GROQ_API_KEY` = your Groq key
   - `HUGGINGFACEHUB_API_TOKEN` = your HF token (optional; can use local embeddings)
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app,https://your-frontend.netlify.app`
   - `PORT` is set by Render; keep it.
8. Deploy. Note the backend URL (e.g. `https://your-app.onrender.com`).

### Option B – Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**.
2. Select your repo.
3. Set **Root Directory** to `backend` (or configure build/start from `backend`).
4. **Build:** Railway often auto-detects Python. If not, set build to `pip install -r requirements.txt` in `backend`.
5. **Start:** `python app.py` or `uvicorn src.main:app --host 0.0.0.0 --port $PORT`.
6. In **Variables**, add:
   - `GROQ_API_KEY`
   - `HUGGINGFACEHUB_API_TOKEN` (optional)
   - `CORS_ORIGINS` = `https://your-frontend-url.com`
7. Deploy and copy the public backend URL.

---

## 4. Connect frontend to backend

1. Copy your **backend URL** (e.g. `https://your-backend.onrender.com`).
2. In **Vercel** or **Netlify**, set (or update) the env var:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
3. **Redeploy the frontend** so the new `VITE_API_URL` is baked into the build.

The chatbot will then call your deployed API. If the backend is on a free tier and sleeps, the first request after idle may be slow.

---

## 5. Backend CORS

The backend reads `CORS_ORIGINS` from the environment. In production set it to your frontend origin(s), e.g.:

```env
CORS_ORIGINS=https://your-site.vercel.app,https://www.yourdomain.com
```

No trailing slash. Multiple origins separated by commas.

---

## Quick checklist

| Step | Action |
|------|--------|
| 1 | Push code: `git add . && git commit -m "..." && git push` |
| 2 | Deploy backend (Render/Railway), add `GROQ_API_KEY` and `CORS_ORIGINS` |
| 3 | Deploy frontend (Vercel/Netlify), set `VITE_API_URL` to backend URL |
| 4 | Set backend `CORS_ORIGINS` to your frontend URL |
| 5 | Test the chatbot on the live site |
