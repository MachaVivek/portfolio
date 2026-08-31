"""Loads the portfolio content into Qdrant so the chatbot can search it.

Run this once at setup, and again any time you edit the files in data/portfolio:

    docker compose exec api python scripts/ingest_portfolio.py

What it does: reads every .md file, cuts them into overlapping chunks, converts each
chunk into an embedding, and stores them in Qdrant.
"""

import pathlib

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client.models import Distance, VectorParams

from app.rag.portfolio_store import COLLECTION_NAME, get_qdrant_client, get_vector_store
from app.services.gemini_client import EMBEDDING_DIM

DATA_DIR = pathlib.Path(__file__).resolve().parent.parent / "data" / "portfolio"

# Roughly a few paragraphs per chunk. Too big and searches return lots of
# irrelevant text; too small and answers lose context.
CHUNK_SIZE = 800

# Chunks overlap slightly so a sentence split across a boundary isn't lost.
CHUNK_OVERLAP = 100


def load_documents() -> list[Document]:
    """Read every markdown file in data/portfolio (including subfolders)."""
    documents = []
    for path in sorted(DATA_DIR.rglob("*.md")):
        text = path.read_text().strip()
        if text:  # skip empty files
            documents.append(Document(page_content=text, metadata={"source": path.stem}))
    return documents


def ensure_collection() -> None:
    """Create the Qdrant collection on first run. Does nothing if it already exists."""
    client = get_qdrant_client()
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            # COSINE measures similarity by direction rather than length — the
            # standard choice for comparing text embeddings.
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )


def main() -> None:
    ensure_collection()

    documents = load_documents()
    if not documents:
        print(f"No markdown files found in {DATA_DIR}")
        return

    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    chunks = splitter.split_documents(documents)
    print(f"Loaded {len(documents)} files, split into {len(chunks)} chunks.")

    # Note: this adds to whatever is already stored. If you've renamed or deleted
    # content, clear the collection in Qdrant first to avoid stale answers.
    store = get_vector_store()
    store.add_documents(chunks)
    print("Uploaded to Qdrant.")


if __name__ == "__main__":
    main()
