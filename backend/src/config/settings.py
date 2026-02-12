import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
  app_name: str = "Portfolio AI Assistant API"
  host: str = "0.0.0.0"
  port: int = int(os.getenv("PORT", "8000"))
  # Comma-separated list of origins
  cors_origins: tuple[str, ...] = tuple(
    o.strip()
    for o in os.getenv(
      "CORS_ORIGINS",
      "http://localhost:3000,http://localhost:5173",
    ).split(",")
    if o.strip()
  )


settings = Settings()

