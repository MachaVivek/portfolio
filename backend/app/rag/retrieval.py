"""Searching the portfolio content — the "R" (retrieval) in RAG."""

from app.rag.portfolio_store import get_vector_store


def search_portfolio(query: str, k: int = 4) -> list[str]:
    """Find the portfolio chunks that best match a question.

    k=4 means "give me the 4 closest matches". Enough context for a good answer
    without stuffing the prompt with barely-relevant text.
    """
    store = get_vector_store()
    docs = store.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]
