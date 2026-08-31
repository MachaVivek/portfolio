"""Per-visitor rate limiting, so one person can't spam the API and run up costs."""

from fastapi import Request
from slowapi import Limiter


def get_client_ip(request: Request) -> str:
    """Work out the real visitor's IP address.

    In production the app sits behind Render's load balancer, so the direct
    connection always comes from Render — not the visitor. Without this, every
    visitor would look like the same IP and they'd all share one rate limit.
    The real address is passed along in the "X-Forwarded-For" header instead.

    We read the LAST entry, not the first. Anyone can put whatever they like at
    the front of this header, and a proxy appends the address it actually saw to
    the end. Trusting the first entry would let a visitor send a different fake
    value on every request and get a fresh rate-limit budget each time. The last
    entry is the one our proxy wrote, so it's the one worth trusting.

    This assumes exactly one proxy in front of the app, which is how Render works.
    Behind two or more, the trusted entry moves further left.
    """
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        entries = [part.strip() for part in forwarded_for.split(",") if part.strip()]
        if entries:
            return entries[-1]
    return request.client.host if request.client else "unknown"


# Counts requests per IP. Kept in memory, which means the counts reset when the
# server restarts, and each server instance counts separately. That's fine at
# portfolio-site traffic levels; a shared Redis store would be the next step up.
limiter = Limiter(key_func=get_client_ip)
