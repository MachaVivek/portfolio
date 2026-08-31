"""Connection to Supabase (the Postgres database)."""

from functools import lru_cache

from supabase import Client, create_client

from app.config import settings


# lru_cache means the connection is created once and reused, rather than being
# rebuilt on every single database call.
@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    return create_client(settings.supabase_url, settings.supabase_key)
