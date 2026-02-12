from __future__ import annotations

import json
from pathlib import Path
from typing import List, Optional, Tuple
from uuid import uuid4

from .rag_pipeline import query_portfolio

_BACKEND_DIR = Path(__file__).resolve().parents[2]  # .../backend
_PROJECTS_PATH = _BACKEND_DIR / "data" / "projects.json"


SYSTEM_PROMPT = """
You are Keltoum, speaking in first person. Professional, warm, recruiter-friendly.

Brevity and structure (strict):
- Keep answers to 5–8 lines max by default. Easy to scan.
- Structure: (1) One short intro sentence. (2) Key Highlights: bullet points. (3) Optional one-line closer: "Want more details? Just ask."
- For project questions use this format:
  Short intro sentence.
  Key Highlights:
  • Challenge:
  • Tech used:
  • Result:
  • Impact:
- Do not write long essays unless the user explicitly asks for more detail or a deep dive.
- Do not repeat who you are or "I'm Keltoum's assistant" in every reply.

Truthfulness:
- Use only the provided portfolio context and retrieved snippets. If something isn’t there, say so briefly and point to what you can answer.

Scope:
- If the question is unrelated, one short line redirecting to portfolio (e.g., "I can help with my projects and experience—what would you like to know?").

Tone:
- Confident, natural, skimmable. No filler.
""".strip()


def _build_portfolio_context() -> str:
    try:
        with open(_PROJECTS_PATH, encoding="utf-8") as f:
            projects = json.load(f)
    except Exception:
        projects = []

    if not isinstance(projects, list):
        projects = []

    categories = sorted({(p.get("category") or "").strip() for p in projects if (p.get("category") or "").strip()})
    tech_set = []
    for p in projects:
        tech = p.get("technologies") or []
        if isinstance(tech, list):
            tech_set.extend([t for t in tech if isinstance(t, str) and t.strip()])
    tech_stack = sorted(set(tech_set))

    lines: List[str] = []
    lines.append("PROFILE")
    lines.append("- Name: Keltoum")
    lines.append("- Location: Morocco")
    lines.append("- Availability: Open to opportunities")
    if categories:
        lines.append("- Focus areas: " + ", ".join(categories))
    lines.append("- Strengths: Product-minded UI, clean architecture, practical ML")
    lines.append("- Interests: LLM apps, computer vision pipelines, full-stack systems, UX polish")
    lines.append("- Goal: Build reliable, well-designed software powered by intelligent systems (ML/GenAI)")
    lines.append("")
    lines.append("SKILLS / TECH STACK (from projects)")
    lines.append("- " + (", ".join(tech_stack) if tech_stack else "Not specified yet"))
    lines.append("")
    lines.append("KEY PROJECTS")
    for p in projects[:8]:
        title = (p.get("title") or "").strip()
        desc = (p.get("description") or "").strip()
        cat = (p.get("category") or "").strip()
        tech = p.get("technologies") or []
        tech_str = ", ".join(tech[:12]) if isinstance(tech, list) else ""
        gh = (p.get("github_url") or "").strip()
        lines.append(f"- Title: {title}")
        if cat:
            lines.append(f"  Category: {cat}")
        if desc:
            lines.append(f"  Summary: {desc}")
        if tech_str:
            lines.append(f"  Tech: {tech_str}")
        if gh:
            lines.append(f"  Repo: {gh}")
    return "\n".join(lines).strip()


_PORTFOLIO_CONTEXT = _build_portfolio_context()

# Simple in-memory session store: session_id -> [(user, assistant), ...]
_SESSIONS: dict = {}
_MAX_TURNS = 10


def _get_session_id(session_id: Optional[str]) -> str:
    sid = (session_id or "").strip()
    return sid if sid else str(uuid4())


def _format_history(history: List[Tuple[str, str]], max_turns: int = 8) -> str:
    trimmed = history[-max_turns:] if history else []
    parts: List[str] = []
    for u, a in trimmed:
        parts.append(f"User: {u}")
        parts.append(f"Assistant: {a}")
    return "\n".join(parts).strip()


def answer(message: str, session_id: Optional[str] = None):
    sid = _get_session_id(session_id)
    history: List[Tuple[str, str]] = _SESSIONS.get(sid, [])

    reply = query_portfolio(
        message,
        system_prompt=SYSTEM_PROMPT,
        portfolio_summary=_PORTFOLIO_CONTEXT,
        chat_history=_format_history(history),
    )

    history = (history + [(message, reply)])[-_MAX_TURNS:]
    _SESSIONS[sid] = history

    sources = []
    return reply, sid, sources

