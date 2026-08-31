# Backend Build Phases

6 phases, in order. By the end of Phase 6, the backend is fully working and deployed.

## Phase 1 — Core Setup
Get a running FastAPI app in Docker, nothing smart yet.
- FastAPI skeleton + Dockerfile + docker-compose
- Config/secrets via `.env` and env vars
- CORS enabled for the frontend
- One test endpoint (health check + a dummy `/chat` that just echoes)

**Done when:** `docker compose up` runs, `/docs` loads, dummy `/chat` responds.

## Phase 2 — RAG for Portfolio
Make the bot answer questions from Vivek's portfolio content.
- Qdrant Cloud connected
- Script to chunk + embed portfolio text and upload to Qdrant
- `portfolio_search` tool that fetches matching chunks
- Gemini answers using only those chunks

**Done when:** asking about a real project returns a correct, grounded answer.

## Phase 3 — Agent Orchestration + GitHub Tool
Turn the bot into a real agent that picks tools, add the GitHub feature.
- Gemini function calling wired up (the router)
- `get_github_repo` tool (README + metadata from GitHub API, allowed repos only)
- Agent decides: portfolio question vs repo question

**Done when:** asking about a project uses RAG, asking about a repo uses GitHub tool, automatically.

## Phase 4 — Email Sending Agent
Add the contact flow, with confirmation.
- `draft_contact_email` tool (generates subject, shows preview)
- `send_contact_email` tool (only fires after explicit user confirmation)
- Resend wired up, verified sending domain
- Conversation history carries the draft/confirm state

**Done when:** asking to contact Vivek goes draft → confirm → real email received.

## Phase 5 — Chat Storage + Admin Dashboard
Save every chat, give Vivek a way to see them.
- Supabase tables: `conversations`, `messages`, `contact_submissions`
- Every chat turn saved automatically
- `/admin` page (password protected) to browse + search past chats and contact messages

**Done when:** Vivek can log into `/admin` and see/search real conversations.

## Phase 6 — Rate Limiting, Logging, Deployment
Make it production-safe and put it live.
- Per-IP rate limiting on `/chat`
- Structured logging (requests, tool used, errors, latency)
- Deploy to Render (Docker), connect env vars
- Connect frontend (Vercel) to the live backend URL

**Done when:** backend is live on Render, protected from abuse, logging properly, and reachable from the real portfolio site.

---

**Backend is fully ready after Phase 6.**

---

## Added after Phase 6

**Streaming (SSE).** `POST /chat/stream` reports progress as it happens — which
tool is running, then the answer word by word — so the frontend can react while
the agent works. `POST /chat` still returns a single finished response; both run
the same code path.
