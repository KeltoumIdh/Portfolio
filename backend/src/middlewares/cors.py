from fastapi.middleware.cors import CORSMiddleware


def add_cors(app, origins: tuple[str, ...]):
  app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

