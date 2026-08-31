"""Signing for email drafts.

Why this exists:
The /chat endpoint is public, so anyone can POST anything to it — including a fake
"pending_action" that says "send this email". Without a check, someone could skip the
whole draft-and-confirm flow and use the API to fire arbitrary emails into Vivek's
inbox.

So: when the backend creates a draft, it stamps it with a signature (a fingerprint
made using a secret only the server knows) and an expiry. Before sending, it
re-checks both. A draft the server didn't create won't have a valid signature, and
an old one won't be accepted twice days later.
"""

import hashlib
import hmac
import json
import logging
import time

from app.config import settings

logger = logging.getLogger(__name__)

# The exact fields that get signed. Anything outside this list isn't protected,
# so every field the send step actually uses must be listed here.
SIGNED_FIELDS = ("subject", "message", "visitor_name", "visitor_email", "expires_at")

# How long a draft stays valid. Long enough for someone to read it and decide,
# short enough that a captured draft isn't replayable indefinitely.
DRAFT_LIFETIME_SECONDS = 30 * 60


def _fingerprint(draft: dict) -> str:
    """Turn the draft's contents into a signature string."""
    # sort_keys makes the output identical no matter what order the keys came in,
    # otherwise the same draft could produce two different signatures.
    payload = json.dumps(
        {key: str(draft.get(key, "")) for key in SIGNED_FIELDS}, sort_keys=True
    )
    return hmac.new(
        settings.secret_key.encode(), payload.encode(), hashlib.sha256
    ).hexdigest()


def sign_draft(draft: dict) -> dict:
    """Stamp a draft the server just created with an expiry and a signature."""
    stamped = {**draft, "expires_at": int(time.time()) + DRAFT_LIFETIME_SECONDS}
    return {**stamped, "signature": _fingerprint(stamped)}


def is_draft_authentic(draft: dict) -> bool:
    """Check a draft really came from this server, wasn't tampered with, and is current."""
    if not isinstance(draft, dict):
        return False

    provided = draft.get("signature")
    # Must be a plain ASCII string. compare_digest raises TypeError on anything
    # else (a number, a list, a non-ASCII string), which would otherwise crash
    # the request instead of simply rejecting the draft.
    if not isinstance(provided, str) or not provided.isascii() or not provided:
        return False

    # compare_digest instead of == so the comparison takes the same amount of time
    # whether it fails on the first character or the last (avoids timing attacks).
    if not hmac.compare_digest(provided, _fingerprint(draft)):
        return False

    # Signature is good, so expires_at is genuinely ours and worth trusting.
    try:
        expires_at = int(draft.get("expires_at", 0))
    except (TypeError, ValueError):
        return False

    if time.time() > expires_at:
        logger.info("Rejected an expired email draft")
        return False

    return True
