from html import escape

import resend

from app.config import settings

def send_contact_email(subject: str, message: str, visitor_name: str, visitor_email: str) -> None:
    resend.api_key = settings.resend_api_key

    safe_message = escape(message).replace("\n", "<br>")
    safe_name = escape(visitor_name) if visitor_name else "Anonymous"
    safe_email = escape(visitor_email) if visitor_email else "no email given"

    resend.Emails.send(
        {

            "from": settings.resend_from_email,
            "to": settings.contact_email_to,

            "reply_to": visitor_email or None,
            "subject": subject or "New message from your portfolio",
            "html": f"<p>{safe_message}</p><hr><p>From: {safe_name} ({safe_email})</p>",
        }
    )
