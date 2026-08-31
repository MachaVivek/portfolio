"""The /admin dashboard — Vivek's private view of what visitors have been asking.

It's plain server-rendered HTML rather than a separate frontend app, because it's a
single-user internal page and that keeps the whole thing in one deployable service.
"""

import secrets
from html import escape

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.config import settings
from app.rate_limit import limiter
from app.services import chat_store

router = APIRouter(prefix="/admin")

# Triggers the browser's built-in username/password popup.
security = HTTPBasic()

PAGE_STYLE = """
<style>
body { font-family: system-ui, sans-serif; margin: 2rem; background: #0f172a; color: #e2e8f0; }
a { color: #38bdf8; }
table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
th, td { border: 1px solid #334155; padding: 0.5rem; text-align: left; vertical-align: top; }
th { background: #1e293b; }
input[type=text] { padding: 0.4rem; width: 300px; }
button { padding: 0.4rem 0.8rem; }
.msg-user { color: #38bdf8; }
.msg-assistant { color: #4ade80; }
.empty { color: #94a3b8; font-style: italic; }
.tools { color: #fbbf24; font-size: 0.85em; }
</style>
"""


def require_admin(credentials: HTTPBasicCredentials) -> None:
    """Block the request unless the right username and password were given.

    Called from inside each endpoint rather than as a Depends(). FastAPI resolves
    dependencies *before* the rate-limit wrapper runs, so a failed login raised
    from a dependency would never be counted — leaving password guessing
    completely unthrottled, the exact opposite of what the limit is for.
    """
    if not settings.admin_username or not settings.admin_password:
        raise HTTPException(status_code=503, detail="Admin login is not configured yet.")

    # compare_digest takes the same time whether the first character is wrong or the
    # last one is, so an attacker can't narrow down the password by timing responses.
    # Both checks always run (no early exit) for the same reason.
    valid_user = secrets.compare_digest(
        credentials.username.encode(), settings.admin_username.encode()
    )
    valid_pass = secrets.compare_digest(
        credentials.password.encode(), settings.admin_password.encode()
    )
    if not (valid_user and valid_pass):
        raise HTTPException(
            status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Basic"}
        )


def _table(headers: list[str], rows: str, empty_message: str) -> str:
    """Build an HTML table, or a friendly note if there's nothing to show."""
    if not rows:
        return f"<p class='empty'>{empty_message}</p>"
    header_html = "".join(f"<th>{h}</th>" for h in headers)
    return f"<table><tr>{header_html}</tr>{rows}</table>"


@router.get("", response_class=HTMLResponse)
# Slows down anyone trying to guess the password by brute force.
@limiter.limit("30/minute")
def admin_home(
    request: Request,
    q: str = Query(default=""),
    credentials: HTTPBasicCredentials = Depends(security),
) -> str:
    require_admin(credentials)

    conversations = chat_store.list_conversations()
    contacts = chat_store.list_contact_submissions()
    search_results = chat_store.search_messages(q) if q else []

    # Note: every value below goes through escape(). Visitors control this text, so
    # without escaping someone could type HTML into the chat and have it run on this page.
    conversation_rows = "".join(
        f"<tr><td><a href='/admin/conversation/{escape(str(c['id']))}'>{escape(str(c['id']))}</a></td>"
        f"<td>{escape(c.get('visitor_ip') or '')}</td>"
        f"<td>{escape(c.get('created_at') or '')}</td></tr>"
        for c in conversations
    )

    search_html = ""
    if q:
        search_rows = "".join(
            f"<tr><td>{escape(m.get('role', ''))}</td><td>{escape(m.get('content', ''))}</td>"
            f"<td><a href='/admin/conversation/{escape(str(m.get('conversation_id')))}'>view</a></td></tr>"
            for m in search_results
        )
        search_html = f"<h2>Search results for '{escape(q)}'</h2>" + _table(
            ["Role", "Content", ""], search_rows, "No messages matched."
        )

    contact_rows = "".join(
        f"<tr><td>{escape(c.get('visitor_name') or '')}</td>"
        f"<td>{escape(c.get('visitor_email') or '')}</td>"
        f"<td>{escape(c.get('subject') or '')}</td>"
        f"<td>{escape(c.get('message') or '')}</td>"
        f"<td>{escape(c.get('created_at') or '')}</td></tr>"
        for c in contacts
    )

    return f"""<!doctype html>
<html><head><title>Admin</title>{PAGE_STYLE}</head>
<body>
<h1>Portfolio Admin</h1>
<form method="get" action="/admin">
  <input type="text" name="q" placeholder="Search chats..." value="{escape(q)}">
  <button type="submit">Search</button>
</form>
{search_html}
<h2>Recent conversations</h2>
{_table(["Conversation", "IP", "Started"], conversation_rows, "No conversations yet.")}
<h2>Contact submissions</h2>
{_table(["Name", "Email", "Subject", "Message", "When"], contact_rows, "No messages sent yet.")}
</body></html>"""


@router.get("/conversation/{conversation_id}", response_class=HTMLResponse)
@limiter.limit("30/minute")
def admin_conversation(
    request: Request,
    conversation_id: str,
    credentials: HTTPBasicCredentials = Depends(security),
) -> str:
    """Read one conversation from start to finish."""
    require_admin(credentials)

    messages = chat_store.get_conversation_messages(conversation_id)

    def render(message: dict) -> str:
        # Show which tools answered, when the assistant used any.
        tools = message.get("tool_used")
        tag = f" <span class='tools'>[{escape(tools)}]</span>" if tools else ""
        return (
            f"<p class='msg-{escape(message['role'])}'>"
            f"<b>{escape(message['role'])}:</b>{tag} {escape(message['content'])}</p>"
        )

    message_html = "".join(render(m) for m in messages) or (
        "<p class='empty'>No messages in this conversation.</p>"
    )

    return f"""<!doctype html>
<html><head><title>Conversation</title>{PAGE_STYLE}</head>
<body>
<p><a href="/admin">&larr; back</a></p>
<h1>Conversation {escape(conversation_id)}</h1>
{message_html}
</body></html>"""
