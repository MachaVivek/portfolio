"""Reading and writing chat history in the database.

Design rule for this file: saving a chat must never break a conversation. If the
database is unreachable or not configured, every write quietly does nothing and
logs a warning — the visitor still gets their answer.
"""

import logging

from app.config import settings
from app.services.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)


def is_configured() -> bool:
    """True only if database credentials are actually set."""
    return bool(settings.supabase_url and settings.supabase_key)


# --- Writing ---------------------------------------------------------------


def create_conversation(visitor_ip: str | None) -> str | None:
    """Start a new conversation row and return its id."""
    if not is_configured():
        return None
    try:
        client = get_supabase_client()
        result = client.table("conversations").insert({"visitor_ip": visitor_ip}).execute()
        return result.data[0]["id"]
    except Exception as exc:
        logger.warning("Failed to create conversation: %s", exc)
        return None


def save_message(
    conversation_id: str | None,
    role: str,
    content: str,
    tools_used: list[str] | None = None,
) -> None:
    """Save one message (from the visitor or the assistant).

    tools_used is stored as a comma-separated string, so the admin dashboard can
    show which tools answered a given question.
    """
    if not is_configured() or not conversation_id:
        return
    try:
        client = get_supabase_client()
        client.table("messages").insert(
            {
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
                "tool_used": ",".join(tools_used) if tools_used else None,
            }
        ).execute()
    except Exception as exc:
        logger.warning("Failed to save message: %s", exc)


def save_contact_submission(
    conversation_id: str | None, visitor_name: str, visitor_email: str, subject: str, message: str
) -> None:
    """Record a message that was actually emailed, so it's searchable in /admin later."""
    if not is_configured():
        return
    try:
        client = get_supabase_client()
        client.table("contact_submissions").insert(
            {
                "conversation_id": conversation_id,
                "visitor_name": visitor_name,
                "visitor_email": visitor_email,
                "subject": subject,
                "message": message,
            }
        ).execute()
    except Exception as exc:
        logger.warning("Failed to save contact submission: %s", exc)


# --- Reading (used by the /admin dashboard) --------------------------------
# These deliberately don't catch errors: if the database is down, the admin page
# should show a real error rather than pretending there's no data.


def list_conversations(limit: int = 50) -> list[dict]:
    """Most recent conversations first."""
    if not is_configured():
        return []
    client = get_supabase_client()
    result = (
        client.table("conversations")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_conversation_messages(conversation_id: str) -> list[dict]:
    """Every message in one conversation, oldest first so it reads in order."""
    if not is_configured():
        return []
    client = get_supabase_client()
    result = (
        client.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return result.data


def search_messages(query: str, limit: int = 50) -> list[dict]:
    """Find messages containing some text. ilike = case-insensitive "contains"."""
    if not is_configured() or not query:
        return []
    client = get_supabase_client()
    result = (
        client.table("messages")
        .select("*")
        .ilike("content", f"%{query}%")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def list_contact_submissions(limit: int = 50) -> list[dict]:
    """Messages visitors actually sent through, most recent first."""
    if not is_configured():
        return []
    client = get_supabase_client()
    result = (
        client.table("contact_submissions")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data
