# Backend Setup, Run, Deploy

Everything below assumes Docker as the way you build and run this — no venv needed.

## 1. What's in this folder

```
backend/
├── app/                  # FastAPI application code
├── data/portfolio/       # your real portfolio content (RAG source — replace placeholders)
├── scripts/               # ingest_portfolio.py — loads data/ into Qdrant
├── db/schema.sql          # run once in Supabase's SQL editor
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env                   # your real secrets (never committed)
├── .env.example           # template showing which env vars are needed
└── .dockerignore
```

## 2. One-time setup (local machine)

1. Install Docker Desktop (if not already installed).
2. Copy the example env file and fill in real values:
   ```bash
   cp .env.example .env
   ```
3. Fill in `.env` with all the keys listed there — Gemini, Qdrant, Supabase, GitHub, Resend, and the admin login. See `.env.example` for what each one is for.

`.env` is gitignored — it never gets committed or built into the image.

## 3. Running locally (every day dev)

```bash
docker compose up --build
```

- First run builds the image (installs deps) — slower.
- Later runs reuse the cached image — fast, unless `requirements.txt` changed.
- Code is volume-mounted, so editing files on your host auto-reloads the server inside the container (uvicorn `--reload`).
- API available at `http://localhost:8002` (mapped this way locally because ports 8000/8001 were already taken by other containers on this machine — adjust in `docker-compose.yml` if that's no longer true for you).
- Interactive API docs at `http://localhost:8002/docs`.
- Admin dashboard at `http://localhost:8002/admin` (needs `ADMIN_USERNAME`/`ADMIN_PASSWORD` set).

Stop it with `Ctrl+C`, or in another terminal:
```bash
docker compose down
```

## 4. Running without Docker (optional, only if you want faster local iteration)

Not required, but if you ever want it:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
This is purely a convenience path — Docker remains the source of truth for how the app actually runs in production.

## 5. Loading your portfolio content (for RAG)

1. Replace the placeholder files in `data/portfolio/` with your real bio and project write-ups.
2. Run the ingest script once (and again any time content changes):
   ```bash
   docker compose exec api python scripts/ingest_portfolio.py
   ```

## 6. Testing endpoints

Use the `/docs` page (Swagger UI) to try requests manually, or:
```bash
curl -X POST http://localhost:8002/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Tell me about your AI Tour Guide project"}]}'
```

The response includes a `conversation_id` — send it back in the next request's body
(`"conversation_id": "..."`) so messages stay grouped as one conversation, and echo back
whatever `pending_action` you got in the previous reply so the email confirm/cancel flow works.

## 7. Deployment (Render)

A `render.yaml` blueprint lives at the repo root (one level up from `backend/`) — Render can
read it directly instead of you configuring everything by hand.

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, connect the GitHub repo. Render will detect `render.yaml`
   and set up the web service (Docker, root directory `backend`) automatically.
   - Alternative without the blueprint: **New → Web Service**, connect the repo, set
     **Environment: Docker** and **Root directory: backend** manually.
3. Render will prompt for every env var listed in `render.yaml` (same names as `.env`) — fill
   in the real values. This is the production secrets store; `.env` itself never gets deployed.
4. Deploy. Render builds the Docker image and runs it automatically on every push to your main
   branch (auto-deploy).
5. Once live, Render gives you a URL like `https://your-service.onrender.com`.
6. Run `db/schema.sql` in your Supabase project's SQL editor if you haven't already, and run the
   portfolio ingest script once against production data (or point Qdrant at the same collection
   you already ingested locally — no need to re-ingest if using the same Qdrant Cloud instance).

## 8. After deploying: connect the frontend

In the Next.js project on Vercel, set an environment variable pointing at the Render URL (e.g.
`NEXT_PUBLIC_API_URL=https://your-service.onrender.com`) and redeploy the frontend. Also update
`ALLOWED_ORIGINS` in Render's env vars to include the real Vercel domain (CORS will block the
frontend otherwise).

## 9. Day-to-day workflow going forward

1. Edit code locally.
2. `docker compose up --build` to test.
3. Commit + push to GitHub.
4. Render auto-deploys the new version.

No manual server setup, no SSH, no manual restarts — push to deploy.
