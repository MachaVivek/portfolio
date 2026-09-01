from fastapi import Request
from slowapi import Limiter

def get_client_ip(request: Request) -> str:
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip and cf_ip.strip():
        return cf_ip.strip()

    real_ip = request.headers.get("x-real-ip")
    if real_ip and real_ip.strip():
        return real_ip.strip()

    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        entries = [part.strip() for part in forwarded_for.split(",") if part.strip()]
        if entries:
            return entries[0]
    return request.client.host if request.client else "unknown"

limiter = Limiter(key_func=get_client_ip)
