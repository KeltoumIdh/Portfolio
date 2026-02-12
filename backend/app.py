import sys

import uvicorn

from src.config.settings import settings


if sys.version_info >= (3, 14) or sys.version_info < (3, 9):
  print("This backend requires Python 3.9, 3.10, 3.11, or 3.12 (not 3.14+).")
  print("Current:", sys.version)
  print("On Windows, use: py -3.12 -m venv venv   then  venv\\Scripts\\activate")
  sys.exit(1)


if __name__ == "__main__":
  uvicorn.run("src.main:app", host=settings.host, port=settings.port, reload=True)