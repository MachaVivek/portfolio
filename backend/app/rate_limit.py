from fastapi import Request
from slowapi import Limiter

def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        entries = [part.strip() for part in forwarded_for.split(",") if part.strip()]
        if entries:
            return entries[-1]
    return request.client.host if request.client else "unknown"

limiter = Limiter(key_func=get_client_ip)
