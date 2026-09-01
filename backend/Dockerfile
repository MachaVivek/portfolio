# How to build the container image that runs this app.
# The same image is used locally and in production on Render.

FROM python:3.12-slim

# Don't write .pyc cache files, and send log output straight through
# instead of buffering it (so logs appear immediately, not in delayed bursts).
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencies are copied and installed BEFORE the app code. Docker caches each
# step, so this way changing a source file doesn't trigger a full reinstall —
# only a change to requirements.txt does.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY data ./data

# Run as a normal user rather than root. If the app is ever compromised, the
# attacker lands with limited permissions instead of full control of the container.
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Started with 0.0.0.0 (not localhost) so the server accepts connections from
# outside the container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips=*"]
