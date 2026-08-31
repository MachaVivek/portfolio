"""Connection to Gemini — the AI model behind everything.

Every other external service has a client module like this one (github_client,
resend_client, supabase_client), and Gemini is used in three separate places:
the agent loop, email subject generation, and embedding portfolio text. Keeping
that setup here means the model name and API key are configured in exactly one
spot rather than repeated at each call site.
"""

from functools import lru_cache

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from app.config import settings

# The model used for chatting and for writing email subject lines.
# Change it here and everything picks it up.
CHAT_MODEL = "gemini-3.5-flash-lite"
# CHAT_MODEL = "gemini-2.5-flash"

# Turns text into embeddings (lists of numbers capturing meaning) for portfolio search.
# Must stay the same for both ingesting and searching — mixing models gives junk results.
# NOTE: text-embedding-004 is only on v1 API; http_options forces v1 in the client below.
EMBEDDING_MODEL = "gemini-embedding-001"

# How many numbers each embedding contains. Fixed by the model above; Qdrant
# needs it when the collection is first created.
EMBEDDING_DIM = 3072


# lru_cache builds these once and reuses them, instead of constructing a new
# client on every request.
@lru_cache(maxsize=1)
def get_chat_model() -> ChatGoogleGenerativeAI:
    """The plain chat model, with no tools attached."""
    return ChatGoogleGenerativeAI(model=CHAT_MODEL, google_api_key=settings.gemini_api_key)


@lru_cache(maxsize=1)
def get_embeddings() -> GoogleGenerativeAIEmbeddings:
    # http_options forces the google-genai SDK to use the v1 REST endpoint.
    # text-embedding-004 is only exposed under v1, not v1beta (the SDK default).
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=settings.gemini_api_key,
        http_options={"api_version": "v1"},
    )
