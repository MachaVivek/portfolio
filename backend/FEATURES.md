# Backend Features

## 1. RAG for Portfolio (Chatbot Knowledge)
- **What it does:** Answers questions about Vivek's projects using only indexed portfolio content.
- **Tech:** Qdrant (vector DB) + Gemini Embeddings + Gemini 2.5 Flash + LangChain.
- **How:** Portfolio text is split into chunks, embedded, stored in Qdrant. On a question, top matching chunks are fetched and given to Gemini to answer from.

## 2. GitHub Tool (Repo Q&A)
- **What it does:** Explains a specific repo in detail (overview, architecture, tech, features).
- **Tech:** GitHub REST API + Gemini function calling.
- **How:** Gemini calls a tool that hits GitHub API for README + metadata of an allowed repo, then Gemini writes the answer from that data. No embedding, always fresh.

## 3. Email Sending Agent
- **What it does:** Lets a visitor send Vivek a message, with confirmation before sending.
- **Tech:** Resend API + Gemini (for subject generation) + HMAC signing.
- **How:** Two-step tool: `draft_contact_email` (no side effect, just preview) then the send, which only runs after the visitor explicitly confirms. The backend enforces the confirmation with plain keyword matching, never the model. Drafts are HMAC-signed and expire after 30 minutes, so a forged or replayed draft posted straight to the API is rejected.

## 4. Rate Limiting
- **What it does:** Stops one visitor/IP from spamming requests and running up API costs.
- **Tech:** `slowapi` (FastAPI middleware, Redis-free, in-memory or Redis-backed).
- **How:** Each IP gets a request limit per minute (e.g. 10/min) on `/chat`. Over the limit → 429 error.

## 5. Streaming Responses (SSE)
- **What it does:** Reports progress while the agent works, instead of going quiet until the answer is ready.
- **Tech:** FastAPI `StreamingResponse` + Server-Sent Events.
- **How:** `POST /chat/stream` emits `tool_start` before each tool runs, `token` events as the answer is generated, and a final `done`. The frontend uses this to change the character's pose mid-work and type the reply out live. `POST /chat` still exists for callers that just want the finished answer — both run the same code.

## 6. Agent Orchestration (Router)
- **What it does:** Decides which tool to use for each message (RAG / GitHub / Email).
- **Tech:** Gemini function calling (native tool-use), no manual if/else routing.
- **How:** One agent, three tools registered. Gemini picks the right tool per message based on the conversation.

## 7. Conversation State
- **What it does:** Keeps multi-turn flows working (e.g. email draft → confirm → send).
- **Tech:** None extra — frontend sends full chat history each request.
- **How:** Backend stays stateless; each request includes prior messages so the model has context.

## 8. Logging
- **What it does:** Tracks requests, errors, tool calls for debugging and visibility.
- **Tech:** Python `logging` + Render logs (Better Stack optional later).
- **How:** Structured logs on every chat request: IP, tool used, latency, success/failure.

## 9. Chat Storage
- **What it does:** Saves every chat so Vivek can see what visitors asked or wanted.
- **Tech:** Supabase PostgreSQL (used as the SQL database).
- **How:** Two tables — `conversations` (one per visitor session) and `messages` (every user + assistant message, linked to a conversation). A `contact_submissions` table also stores messages sent through the email flow. Saved on every chat turn.

## 10. Admin Dashboard
- **What it does:** Lets Vivek log in, browse past chats, search them, and see contact/suggestion messages.
- **Tech:** A simple page inside the backend itself (FastAPI + basic HTML), protected by username/password.
- **How:** `/admin` route guarded by HTTP Basic Auth (credentials from env vars). Shows recent conversations, a search box over message content, and the contact submissions list. No separate frontend app needed for this.

## 11. Config & Secrets
- **What it does:** Keeps API keys out of code.
- **Tech:** `pydantic-settings` + `.env` locally, Render environment variables in production.
- **How:** All keys (Gemini, Qdrant, GitHub, Resend, Supabase) loaded from env vars, never hardcoded.

## 12. CORS
- **What it does:** Allows the Next.js frontend (Vercel) to call this backend from the browser.
- **Tech:** FastAPI's built-in CORS middleware.
- **How:** Allow only your Vercel domain as an origin, not `*`.
