# AI Portfolio

A portfolio site with an AI assistant built into it. Visitors can ask about my
projects, dig into a GitHub repo, or send me a message — all through one chat.

An animated character represents the assistant and reacts to what it's actually
doing: looking through papers while it searches the portfolio, at a laptop while
it reads a repo, holding an envelope when a message is ready to send.

## What's here

```
portfolio/
├── backend/     FastAPI + Gemini agent, RAG, admin dashboard   → deploys to Render
├── frontend/    Next.js portfolio + chat UI                    → deploys to Vercel
├── render.yaml  Backend deployment config
└── docker-compose.yml   Runs both services together
```

Each folder has its own docs:

| Doc                                           | What it covers                               |
| --------------------------------------------- | -------------------------------------------- |
| [backend/HOW_TO_RUN.md](backend/HOW_TO_RUN.md) | Step-by-step setup for someone starting cold |
| [backend/SETUP.md](backend/SETUP.md)           | Backend setup, run, deploy                   |
| [backend/FEATURES.md](backend/FEATURES.md)     | What the backend does, and how               |
| [backend/PHASES.md](backend/PHASES.md)         | How it was built, in 6 phases                |
| [frontend/SETUP.md](frontend/SETUP.md)         | Frontend setup, the API contract, deploy     |
| [frontend/FEATURES.md](frontend/FEATURES.md)   | What the frontend does, and how              |
| [frontend/PHASES.md](frontend/PHASES.md)       | How it was built, in 3 phases                |

## How it works

```
Visitor
   │
   ▼
Next.js (Vercel) ──── server-side proxy, so the backend URL and CORS never
   │                  reach the browser
   ▼
FastAPI (Render)
   │
   ├── Qdrant ........ portfolio content, embedded for semantic search
   ├── GitHub API .... repo details, fetched live so they're never stale
   ├── Resend ........ sends contact emails, only after explicit confirmation
   └── Supabase ...... stores every conversation, readable at /admin
   │
   ▼
Gemini 2.5 Flash — picks which tool to use, then writes the answer
```

The backend streams its progress back (Server-Sent Events), which is what lets the
character change pose *while* the agent works rather than after it finishes.

## Running it locally

Everything at once:

```bash
docker compose up --build
```

Backend on http://localhost:8002, frontend on http://localhost:3001.

For day-to-day work, run them separately — the frontend hot-reloads much faster
outside Docker:

```bash
cd backend && docker compose up      # http://localhost:8002
cd frontend && npm run dev           # http://localhost:3000
```

Both need API keys before the AI does anything. The app starts and responds
sensibly without them, so you can run it first and add keys after — see
[backend/HOW_TO_RUN.md](backend/HOW_TO_RUN.md).

## A few decisions worth knowing

**The email flow can't be talked into sending.** The AI drafts the message, but
whether to actually send is decided by plain code checking for a "yes", never by
the model. Drafts are signed, so a forged one sent straight to the API is rejected.

**The backend keeps no memory between requests.** The frontend resends the full
conversation each time. Simpler to reason about, and it means restarting the
server never loses anyone's chat.

**GitHub lookups are limited to an allowlist.** The assistant can only fetch repos
you've explicitly listed, so it can't be pointed at arbitrary repositories.

**Portfolio content lives in two places on purpose.** `backend/data/portfolio/` is
what the *AI* knows (it gets embedded into Qdrant); `frontend/src/data/portfolio.ts`
is what *visitors read* on the page. Update both when something changes.

## Status

Backend and frontend are both feature-complete and deployable. Still to do before
going live: real API keys, real portfolio content, the database schema applied in
Supabase, and the actual deploy. There are no automated tests yet — the most
valuable ones would cover the email signing and confirmation gate.
