"""Connection to Qdrant, the vector database holding the portfolio content.

"Vector database" just means: the portfolio text is converted into lists of numbers
(embeddings) that capture meaning, so we can search by *what a question means*
rather than by exact keyword matching.

The embedding model itself lives in services/gemini_client.py, since that's where
all the Gemini setup is kept.
"""

from functools import lru_cache

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

from app.config import settings
from app.services.gemini_client import get_embeddings

# Name of the collection (like a table) inside Qdrant.
COLLECTION_NAME = "portfolio"


# lru_cache means these are built once and reused, instead of opening a fresh
# connection on every single search.
@lru_cache(maxsize=1)
def get_qdrant_client() -> QdrantClient:
    return QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)


@lru_cache(maxsize=1)
def get_vector_store() -> QdrantVectorStore:
    """The searchable store — combines the database connection and the embedding model."""
    return QdrantVectorStore(
        client=get_qdrant_client(),
        collection_name=COLLECTION_NAME,
        embedding=get_embeddings(),
    )
