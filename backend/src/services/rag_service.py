from .rag_pipeline import query_portfolio


def answer(message: str) -> str:
  return query_portfolio(message)

