from app.rag.portfolio_store import get_vector_store

def search_portfolio(query: str, k: int = 4) -> list[str]:
    store = get_vector_store()
    docs = store.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]
