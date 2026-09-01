"""The chat endpoints — the door into the whole assistant.

Two ways in, same behaviour:
  POST /chat         — waits, then returns the finished answer as JSON
  POST /chat/stream  — reports progress as it happens (Server-Sent Events)

The frontend uses /chat/stream so the character can change pose while the agent
works. /chat stays for anything simpler that just wants an answer.

One rule holds in both: answering "yes" or "no" to a waiting email draft is
decided here in plain code, never by the AI, because sending can't be undone.
"""

import json
import logging
from collections.abc import Iterator

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.agent.email_flow import is_cancellation, is_confirmation
from app.agent.orchestrator import run_agent, run_agent_stream
from app.config import settings
from app.models import ChatRequest, ChatResponse, ContactFormRequest
from app.rate_limit import get_client_ip, limiter
from app.security import is_draft_authentic
from app.services import chat_store
from app.services.resend_client import send_contact_email

logger = logging.getLogger(__name__)

router = APIRouter()


class DraftOutcome:
    """The result of dealing with a waiting email draft."""

    def __init__(self, reply: str, keep_draft: bool = False, tools_used: list[str] | None = None):
        self.reply = reply
        self.keep_draft = keep_draft
        self.tools_used = tools_used or []


def _check_message(chat_request: ChatRequest) -> str:
    """Pull out the newest message, rejecting anything too long."""
    last_message = chat_request.messages[-1].content
    if len(last_message) > settings.max_message_length:
        raise HTTPException(
            status_code=400,
            detail=f"Message is too long (limit {settings.max_message_length} characters).",
        )
    return last_message


def _handle_pending_draft(
    chat_request: ChatRequest, last_message: str, conversation_id: str | None, visitor_ip: str
) -> DraftOutcome:
    """Decide what to do about an email draft the visitor is being asked to confirm."""
    draft = chat_request.pending_action

    # The draft comes back to us from the frontend, so check it's one we actually
    # made and nobody edited it on the way.
    if not is_draft_authentic(draft):
        logger.warning("Rejected an unrecognised email draft from ip=%s", visitor_ip)
        return DraftOutcome(
            "Something went wrong with that draft — could you tell me your message again?"
        )

    if is_confirmation(last_message):
        try:
            send_contact_email(
                subject=draft.get("subject", ""),
                message=draft.get("message", ""),
                visitor_name=draft.get("visitor_name", ""),
                visitor_email=draft.get("visitor_email", ""),
            )
        except Exception as exc:
            logger.error("Failed to send contact email: %s", exc)
            raise HTTPException(status_code=503, detail="Couldn't send that email.") from exc

        # Kept so it's readable later in /admin, not just in the inbox.
        chat_store.save_contact_submission(
            conversation_id,
            draft.get("visitor_name", ""),
            draft.get("visitor_email", ""),
            draft.get("subject", ""),
            draft.get("message", ""),
        )
        return DraftOutcome(
            "Sent! Vivek will get back to you soon.", tools_used=["send_contact_email"]
        )

    if is_cancellation(last_message):
        return DraftOutcome("Okay, I won't send that.")

    # Unclear answer — ask again rather than guessing, and keep the draft waiting.
    return DraftOutcome(
        "I still have a draft waiting — reply 'yes' to send it or 'no' to cancel.",
        keep_draft=True,
    )


def _format_agent_error(exc: Exception) -> str:
    """Format a clear, friendly message when tokens/quota are completed."""
    err_str = str(exc).lower()
    if any(
        k in err_str
        for k in ["resourceexhausted", "quota", "rate limit", "429", "token", "exhausted", "limit"]
    ):
        return (
            "Daily AI token limit reached. Please check the detailed projects, skills, "
            "and resume in the sections below, or send a direct message via the Contact tab!"
        )
    return (
        "The assistant is temporarily unavailable. Please explore the detailed sections below "
        "or reach out via the Contact tab!"
    )


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
def chat(request: Request, chat_request: ChatRequest) -> ChatResponse:
    last_message = _check_message(chat_request)

    visitor_ip = get_client_ip(request)
    conversation_id = chat_request.conversation_id or chat_store.create_conversation(visitor_ip)
    chat_store.save_message(conversation_id, "user", last_message)

    def reply_with(
        text: str, pending_action: dict | None = None, tools_used: list[str] | None = None
    ) -> ChatResponse:
        chat_store.save_message(conversation_id, "assistant", text, tools_used)
        return ChatResponse(
            reply=text,
            pending_action=pending_action,
            conversation_id=conversation_id,
            tools_used=tools_used or [],
        )

    if chat_request.pending_action:
        outcome = _handle_pending_draft(chat_request, last_message, conversation_id, visitor_ip)
        return reply_with(
            outcome.reply,
            pending_action=chat_request.pending_action if outcome.keep_draft else None,
            tools_used=outcome.tools_used,
        )

    if not settings.gemini_api_key:
        return reply_with("AI service isn't configured yet — API keys are missing.")

    try:
        reply, pending_action, tools_used = run_agent(chat_request.messages)
    except Exception as exc:
        logger.error("Agent failed: %s", exc)
        return reply_with(_format_agent_error(exc))

    return reply_with(reply, pending_action=pending_action, tools_used=tools_used)


def _sse(event: dict) -> str:
    """Format one event the way Server-Sent Events expects.

    The blank line at the end is what tells the browser the event is complete.
    """
    return f"data: {json.dumps(event)}\n\n"


@router.post("/chat/stream")
@limiter.limit("10/minute")
def chat_stream(request: Request, chat_request: ChatRequest) -> StreamingResponse:
    last_message = _check_message(chat_request)

    visitor_ip = get_client_ip(request)
    conversation_id = chat_request.conversation_id or chat_store.create_conversation(visitor_ip)
    chat_store.save_message(conversation_id, "user", last_message)

    def finish(reply: str, pending_action: dict | None, tools_used: list[str]) -> str:
        """Save the reply and build the final event."""
        chat_store.save_message(conversation_id, "assistant", reply, tools_used)
        return _sse(
            {
                "type": "done",
                "reply": reply,
                "pending_action": pending_action,
                "conversation_id": conversation_id,
                "tools_used": tools_used,
            }
        )

    def events() -> Iterator[str]:
        try:
            if chat_request.pending_action:
                outcome = _handle_pending_draft(
                    chat_request, last_message, conversation_id, visitor_ip
                )
                yield finish(
                    outcome.reply,
                    chat_request.pending_action if outcome.keep_draft else None,
                    outcome.tools_used,
                )
                return

            if not settings.gemini_api_key:
                yield finish(
                    "AI service isn't configured yet — API keys are missing.", None, []
                )
                return

            for event in run_agent_stream(chat_request.messages):
                if event["type"] == "done":
                    yield finish(
                        event["reply"], event["pending_action"], event["tools_used"]
                    )
                else:
                    yield _sse(event)

        except HTTPException as exc:
            logger.error("Stream failed: %s", exc.detail)
            yield _sse({"type": "error", "message": exc.detail})
            yield finish(exc.detail, chat_request.pending_action, [])

        except Exception as exc:
            logger.error("Agent failed mid-stream: %s", exc)
            message = _format_agent_error(exc)
            yield _sse({"type": "error", "message": message})
            yield finish(message, chat_request.pending_action, [])

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            # Tells proxies (including Render's) not to buffer the response —
            # without it the whole stream arrives at once and streaming is pointless.
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/contact")
@limiter.limit("5/minute")
def send_contact(request: Request, body: ContactFormRequest):
    visitor_ip = get_client_ip(request)
    try:
        send_contact_email(
            subject=f"New Portfolio Contact from {body.name}",
            message=body.message,
            visitor_name=body.name,
            visitor_email=body.email,
        )
        chat_store.save_contact_submission(
            conversation_id=None,
            visitor_name=body.name,
            visitor_email=body.email,
            subject=f"Portfolio Contact Form: {body.name}",
            message=body.message,
        )
        return {"ok": True, "message": "Message sent successfully!"}
    except Exception as exc:
        logger.error("Failed to send contact form email from %s: %s", visitor_ip, exc)
        raise HTTPException(
            status_code=503,
            detail="Could not send your message right now. Please try emailing directly.",
        ) from exc
