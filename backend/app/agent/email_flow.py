"""Reading a visitor's yes/no answer when an email draft is waiting.

This is deliberately plain keyword matching rather than asking the AI. Sending an
email is irreversible, so the decision to send is made by simple, predictable code
that can't be talked into anything.
"""

import string

CONFIRM_WORDS = {
    "yes", "yep", "yeah", "yup", "confirm", "confirmed", "send", "send it",
    "go ahead", "sure", "ok", "okay", "do it", "please send",
}

CANCEL_WORDS = {
    "no", "nope", "cancel", "don't send", "dont send", "stop",
    "nevermind", "never mind", "no thanks",
}


def _normalise(text: str) -> str:
    """Lowercase and strip surrounding spaces/punctuation so "Yes!" matches "yes"."""
    return text.strip().lower().strip(string.punctuation + " ")


def is_confirmation(text: str) -> bool:
    return _normalise(text) in CONFIRM_WORDS


def is_cancellation(text: str) -> bool:
    return _normalise(text) in CANCEL_WORDS
