# Repository structure

This repo is organized as a small monorepo:

- `frontend/` — React + Vite (Tailwind build pipeline)
- `backend/` — FastAPI + LangChain RAG API
- `docs/` — documentation

## Backend architecture (`backend/src`)

- `config/` — settings / env configuration
- `routes/` — FastAPI routers
- `controllers/` — request handlers / orchestration
- `services/` — business logic (RAG)
- `repositories/` — data access layer (reserved / future)
- `middlewares/` — middleware setup (CORS, etc.)
- `validators/` — Pydantic models
- `utils/` — shared utilities
- `tests/` — backend tests (`backend/tests`)

## Frontend architecture (`frontend/src`)

- `components/` — shared UI + layout components
  - `ui/` — small UI primitives (Container, SectionHeading)
  - `background/`, `cursor/`, `sidebars/`, `chatbot/` — grouped UI components
- `features/` — feature modules (projects, tech-stack)
- `styles/` — CSS (Tailwind entry + legacy styles)
- `lib/`, `hooks/`, `types/` — reserved for scaling

