import string

CONFIRM_WORDS = {
    "yes", "yep", "yeah", "yup", "confirm", "confirmed", "send", "send it",
    "go ahead", "sure", "ok", "okay", "do it", "please send", "yes please send it",
    "yes please send", "yes send it", "please send it", "send message", "yes send",
}

CANCEL_WORDS = {
    "no", "nope", "cancel", "don't send", "dont send", "stop",
    "nevermind", "never mind", "no thanks", "no cancel it", "cancel it", "no cancel",
}

def _normalise(text: str) -> str:
    return text.strip().lower().strip(string.punctuation + " ")

def is_confirmation(text: str) -> bool:
    norm = _normalise(text)
    if norm in CONFIRM_WORDS:
        return True
    words = norm.split()
    if words and words[0] in {"yes", "yep", "yeah", "yup", "sure", "ok", "okay"}:
        return True
    if "send" in words and "dont" not in words and "not" not in words:
        return True
    return False

def is_cancellation(text: str) -> bool:
    norm = _normalise(text)
    if norm in CANCEL_WORDS:
        return True
    words = norm.split()
    if words and words[0] in {"no", "nope", "cancel", "stop"}:
        return True
    if "cancel" in words or "dont" in words:
        return True
    return False
