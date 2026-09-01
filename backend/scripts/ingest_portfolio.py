import pathlib

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client.models import Distance, VectorParams

from app.rag.portfolio_store import COLLECTION_NAME, get_qdrant_client, get_vector_store
from app.services.gemini_client import EMBEDDING_DIM

DATA_DIR = pathlib.Path(__file__).resolve().parent.parent / "data" / "portfolio"

CHUNK_SIZE = 800

CHUNK_OVERLAP = 100

def load_documents() -> list[Document]:
    documents = []
    for path in sorted(DATA_DIR.rglob("*.md")):
        text = path.read_text().strip()
        if text:                    
            documents.append(Document(page_content=text, metadata={"source": path.stem}))
    return documents

def ensure_collection() -> None:
    client = get_qdrant_client()
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,

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

    store = get_vector_store()
    store.add_documents(chunks)
    print("Uploaded to Qdrant.")

if __name__ == "__main__":
    main()
