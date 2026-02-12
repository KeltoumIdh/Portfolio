from dotenv import load_dotenv
from fastapi import FastAPI

from .config.settings import settings
from .middlewares.cors import add_cors
from .routes.router import build_router

load_dotenv()

app = FastAPI(title=settings.app_name)
add_cors(app, origins=settings.cors_origins)
app.include_router(build_router())

