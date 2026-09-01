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

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
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
    return {"status": "ok"}
