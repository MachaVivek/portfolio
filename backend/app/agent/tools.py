"""The three things the AI can actually *do*.

Gemini decides on its own which of these to call based on what the visitor asks —
there's no manual if/else routing anywhere. The text in each function's docstring
is what Gemini reads to decide, so those descriptions matter.
"""

import json
import logging

from langchain_core.tools import tool

from app.config import settings
from app.rag.retrieval import search_portfolio
from app.security import sign_draft
from app.services.gemini_client import get_chat_model
from app.services.github_client import get_repo_details

logger = logging.getLogger(__name__)


@tool
def portfolio_search(query: str) -> str:
    """Search Vivek's portfolio knowledge base for info about his projects, skills, or background."""
    if not settings.qdrant_url:
        return "Portfolio search is not configured yet."
    try:
        chunks = search_portfolio(query)
    except Exception as exc:
        # Returned as text (not raised) so the model can tell the visitor
        # something went wrong instead of the whole request failing.
        logger.warning("Portfolio search failed: %s", exc)
        return f"Portfolio search failed: {exc}"
    if not chunks:
        return "No matching portfolio content found."
    return "\n\n".join(chunks)


@tool
def github_repo_info(repo_name: str) -> str:
    """Get the README and metadata for one of Vivek's GitHub repos. repo_name is the exact repo name."""
    # Only repos on the allowlist can be fetched. This keeps the tool on-topic and
    # means a visitor can't point it at some random repo whose README might contain
    # text designed to manipulate the AI.
    allowed = settings.github_allowed_repos_list
    if not allowed:
        return "No repositories are available to look up."
    if repo_name not in allowed:
        return f"'{repo_name}' is not one of the repositories I can look up."
    if not settings.github_username:
        return "GitHub lookup is not configured yet."

    try:
        details = get_repo_details(repo_name)
    except Exception as exc:
        logger.warning("GitHub lookup failed for %s: %s", repo_name, exc)
        return f"Could not fetch repo '{repo_name}': {exc}"

    return (
        f"Name: {details['name']}\n"
        f"Description: {details['description']}\n"
        f"Language: {details['language']}\n"
        f"Topics: {', '.join(details['topics'])}\n"
        f"URL: {details['url']}\n\n"
        f"README:\n{details['readme']}"
    )


def _generate_subject(message: str) -> str:
    """Ask Gemini for a short subject line based on the visitor's message."""
    try:
        llm = get_chat_model()
        prompt = (
            "Write a short, plain email subject line (under 8 words, no quotes) "
            f"for this message:\n\n{message}"
        )
        return llm.invoke(prompt).content.strip()
    except Exception as exc:
        # A missing subject shouldn't sink the whole contact flow — fall back to a generic one.
        logger.warning("Subject generation failed, using fallback: %s", exc)
        return "New message from your portfolio"


@tool
def draft_contact_email(message: str, visitor_email: str = "", visitor_name: str = "") -> str:
    """Create a draft email to Vivek from a visitor. Call this once you have their message.
    Ask for the visitor's email first if they haven't given one, so Vivek can reply.
    This only creates a preview — it does NOT send anything."""
    draft = {
        "subject": _generate_subject(message),
        "message": message,
        "visitor_name": visitor_name,
        "visitor_email": visitor_email,
    }
    # Stamped with a signature so the send step can confirm this draft genuinely
    # came from here, and wasn't invented by whoever is calling the API.
    return json.dumps(sign_draft(draft))


# The full list handed to Gemini.
TOOLS = [portfolio_search, github_repo_info, draft_contact_email]
