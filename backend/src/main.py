from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

# IMPORTANT: load backend/.env BEFORE importing modules that read os.getenv at import-time.
_BACKEND_DIR = Path(__file__).resolve().parents[1]  # .../backend
_DOTENV_PATH = _BACKEND_DIR.resolve() / ".env"
load_dotenv(dotenv_path=str(_DOTENV_PATH), override=False)
if _DOTENV_PATH.exists():
    print("[backend] Loaded .env from:", _DOTENV_PATH)

from fastapi import FastAPI  # noqa: E402

from .config.settings import settings  # noqa: E402
from .middlewares.cors import add_cors  # noqa: E402
from .routes.router import build_router  # noqa: E402

app = FastAPI(title=settings.app_name)
add_cors(app, origins=settings.cors_origins)
app.include_router(build_router())

