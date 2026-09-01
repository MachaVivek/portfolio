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
    return text.strip().lower().strip(string.punctuation + " ")

def is_confirmation(text: str) -> bool:
    return _normalise(text) in CONFIRM_WORDS

def is_cancellation(text: str) -> bool:
    return _normalise(text) in CANCEL_WORDS
