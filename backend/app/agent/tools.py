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
    if not settings.qdrant_url:
        return "Portfolio search is not configured yet."
    try:
        chunks = search_portfolio(query)
    except Exception as exc:

        logger.warning("Portfolio search failed: %s", exc)
        return f"Portfolio search failed: {exc}"
    if not chunks:
        return "No matching portfolio content found."
    return "\n\n".join(chunks)

@tool
def github_repo_info(repo_name: str) -> str:

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
    try:
        llm = get_chat_model()
        prompt = (
            "Write a short, plain email subject line (under 8 words, no quotes) "
            f"for this message:\n\n{message}"
        )
        return llm.invoke(prompt).content.strip()
    except Exception as exc:

        logger.warning("Subject generation failed, using fallback: %s", exc)
        return "New message from your portfolio"

@tool
def draft_contact_email(message: str, visitor_email: str = "", visitor_name: str = "") -> str:
    draft = {
        "subject": _generate_subject(message),
        "message": message,
        "visitor_name": visitor_name,
        "visitor_email": visitor_email,
    }

    return json.dumps(sign_draft(draft))

TOOLS = [portfolio_search, github_repo_info, draft_contact_email]
