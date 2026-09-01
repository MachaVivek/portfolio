from functools import lru_cache

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from app.config import settings

CHAT_MODEL = "gemini-3.5-flash-lite"

EMBEDDING_MODEL = "gemini-embedding-001"

EMBEDDING_DIM = 3072

@lru_cache(maxsize=1)
def get_chat_model() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=CHAT_MODEL, google_api_key=settings.gemini_api_key)

@lru_cache(maxsize=1)
def get_embeddings() -> GoogleGenerativeAIEmbeddings:

    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=settings.gemini_api_key,
        http_options={"api_version": "v1"},
    )
