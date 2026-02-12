# Backend (FastAPI + RAG)

Use **Python 3.12** (or 3.9–3.11). **Do not use Python 3.14** — many dependencies (NumPy, FAISS, etc.) have no pre-built wheels yet, so `pip install` will try to compile from source and fail on Windows without Visual Studio.

## Quick setup (Windows)

```bash
# 1. Create a venv with Python 3.12 (skip if you already have one)
py -3.12 -m venv venv

# 2. Activate it (required before pip install)
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy env and add your keys
copy .env.example .env
# Edit .env: GROQ_API_KEY, HUGGINGFACEHUB_API_TOKEN (or OPENAI_API_KEY)

# 5. Run the API
python app.py
```

If you only have Python 3.14 installed, install Python 3.12 from [python.org](https://www.python.org/downloads/) and use `py -3.12 -m venv venv` so the venv uses 3.12.

## Verify your Python before installing

```bash
python --version
# Must show 3.9, 3.10, 3.11, or 3.12 — not 3.14.
```

If it shows 3.14, activate the correct venv or create one with `py -3.12 -m venv venv` and `venv\Scripts\activate`.
