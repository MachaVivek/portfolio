"""Actually sending an email, via Resend.

This is only ever called after the backend has verified the visitor confirmed the
draft AND that the draft is genuine (see security.py). Nothing else calls it.
"""

from html import escape

import resend

from app.config import settings


def send_contact_email(subject: str, message: str, visitor_name: str, visitor_email: str) -> None:
    resend.api_key = settings.resend_api_key

    # escape() turns characters like < and > into harmless text. Without it, a visitor
    # could put HTML (or a tracking pixel, or a disguised link) in their message and it
    # would render as real HTML in the inbox.
    safe_message = escape(message).replace("\n", "<br>")
    safe_name = escape(visitor_name) if visitor_name else "Anonymous"
    safe_email = escape(visitor_email) if visitor_email else "no email given"

    resend.Emails.send(
        {
            # Must be an address on a domain verified in Resend, otherwise it's rejected.
            "from": settings.resend_from_email,
            "to": settings.contact_email_to,
            # Makes hitting "reply" in the inbox go straight to the visitor.
            "reply_to": visitor_email or None,
            "subject": subject or "New message from your portfolio",
            "html": f"<p>{safe_message}</p><hr><p>From: {safe_name} ({safe_email})</p>",
        }
    )
