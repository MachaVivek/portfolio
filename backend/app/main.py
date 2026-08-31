"""Application entry point — wires everything together and starts the server.

Run order matters here: logging is set up first, then the app is created, then
middleware is attached, then the routes are mounted.
"""

import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.logging_config import setup_logging
from app.rate_limit import get_client_ip, limiter
from app.routers import admin, chat

setup_logging()
logger = logging.getLogger("app.access")

app = FastAPI(title="Portfolio AI Backend")

# Hook up rate limiting. The handler turns a blocked request into a clean
# "429 Too Many Requests" response instead of a crash.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Browsers block a website from calling an API on a different domain unless that
# API says it's allowed. This lists the sites permitted to call us — the portfolio
# frontend, and localhost during development. Never use "*" here.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log one line for every request: what was asked, the result, and how long it took."""
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %s (%.1fms) ip=%s",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
        get_client_ip(request),
    )
    return response


app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
def health_check():
    """Simple "is the server alive?" check. Render pings this to confirm a deploy worked."""
    return {"status": "ok"}
