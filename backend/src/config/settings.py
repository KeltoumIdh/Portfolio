import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
  app_name: str = "Portfolio AI Assistant API"
  host: str = "0.0.0.0"
  port: int = int(os.getenv("PORT", "8000"))
  # Comma-separated list of origins; use CORS_ORIGINS env or fallback to localhost + Vercel
  cors_origins: tuple[str, ...] = tuple(
    o.strip()
    for o in os.getenv(
      "CORS_ORIGINS",
      "http://localhost:3000,http://localhost:5173,https://portfolio-sand-mu-68.vercel.app",
    ).split(",")
    if o.strip()
  )


settings = Settings()

