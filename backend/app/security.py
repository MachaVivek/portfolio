import hashlib
import hmac
import json
import logging
import time

from app.config import settings
from app.constants import DRAFT_LIFETIME_SECONDS, SIGNED_FIELDS

logger = logging.getLogger(__name__)

def _fingerprint(draft: dict) -> str:

    payload = json.dumps(
        {key: str(draft.get(key, "")) for key in SIGNED_FIELDS}, sort_keys=True
    )
    return hmac.new(
        settings.secret_key.encode(), payload.encode(), hashlib.sha256
    ).hexdigest()

def sign_draft(draft: dict) -> dict:
    stamped = {**draft, "expires_at": int(time.time()) + DRAFT_LIFETIME_SECONDS}
    return {**stamped, "signature": _fingerprint(stamped)}

def is_draft_authentic(draft: dict) -> bool:
    if not isinstance(draft, dict):
        return False

    provided = draft.get("signature")

    if not isinstance(provided, str) or not provided.isascii() or not provided:
        return False

    if not hmac.compare_digest(provided, _fingerprint(draft)):
        return False

    try:
        expires_at = int(draft.get("expires_at", 0))
    except (TypeError, ValueError):
        return False

    if time.time() > expires_at:
        logger.info("Rejected an expired email draft")
        return False

    return True
