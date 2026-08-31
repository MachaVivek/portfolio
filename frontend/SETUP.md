# Frontend Setup & Requirements

## 1. Requirements

**On your machine:**
- **Node.js 20 or newer** — check with `node --version`. Get it from https://nodejs.org
- **npm** (comes with Node)
- Docker is **optional** here. The recommended dev flow is plain `npm run dev`, but a
  `Dockerfile` exists for running the whole stack at once — see section 7.

**Accounts:**
- [Vercel](https://vercel.com/) — free, sign in with GitHub

**The backend must be running** for chat to work. Either:
- locally at `http://localhost:8002` (`cd backend && docker compose up`), or
- deployed on Render

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Server components, route handlers, first-class on Vercel |
| Language | TypeScript | The backend contract is easy to get subtly wrong; types catch it at build time |
| Styling | Tailwind CSS | Fast to write, no separate stylesheets to manage |
| Animation | Framer Motion | Smooth character transitions with little code |
| Markdown | react-markdown | AI replies come back with headings and code blocks |
| State | React `useState` | The conversation is one array — a state library would be overkill |
| Hosting | Vercel | Auto-deploys on push |

No chat library — it's a message list and an input box, and rolling it ourselves keeps
full control over how the character ties into it.

## 3. Creating the character

**A placeholder character already ships** (a vector stand-in drawn in
`src/components/CharacterArt.tsx`), so the site is complete and testable right now.
Everything around it — the state machine, animations, layout — is final and won't
change when you swap in real art.

To see all six poses at once: **http://localhost:3000/character-preview**

Real artwork has the longest lead time of anything in this project, so start it early.

**Poses needed** (see FEATURES.md for when each is used):
`idle`, `thinking`, `searching`, `coding`, `envelope`, `error`

**Options, cheapest first:**
1. **AI-generated images** — generate with any image model, then reuse the same
   character description and seed across all six so it stays recognisably one character.
   Cheapest and fastest.
2. **Commissioned art** — a real artist gives you a distinctive character nobody else has.
   Costs money and takes time, but it's the version people remember.
3. **Rive animation** — one rigged character that animates between states instead of six
   separate images. Smoothest result and small file size, but there's a learning curve.

**Whichever you pick:**
- Export as `.webp`, transparent background, roughly 512×512
- Keep each file under ~200KB — a multi-MB character will visibly hurt page load
- Save to `public/character/idle.webp`, `thinking.webp`, and so on
- Then follow the swap instructions in the comment at the top of
  `src/components/CharacterArt.tsx` — it's a single component replacement
- Give the character a name — it makes the whole thing feel intentional, and the name
  can go into the backend's system prompt so the writing matches the face

## 4. Project setup

Already done — the app is scaffolded (Next.js 16, React 19, Tailwind v4) with
`framer-motion` and `react-markdown` installed. If you're setting up on a new
machine, just install the dependencies:

```bash
cd frontend
npm install
```

## 5. Environment variables

`.env` already exists in `frontend/` with:

```
BACKEND_URL=http://localhost:8002
```

Notes:
- **No `NEXT_PUBLIC_` prefix.** That prefix exposes a variable to the browser. The backend
  URL is only used server-side in the route handler, so it should stay private.
- `.env` is gitignored by default — keep secrets private.
- In production this becomes your Render URL, set in Vercel's dashboard.

## 6. Running locally

```bash
npm run dev
```

Open http://localhost:3000

For chat to work, the backend needs to be running too — in another terminal:
```bash
cd ../backend
docker compose up
```

## 7. Running with Docker (optional)

**Vercel does not use Docker** — it builds Next.js natively and ignores the
`Dockerfile`. It's here for two other reasons: running the whole stack with one
command, and not being locked into Vercel if you ever want to host elsewhere.

From the repo root (not `frontend/`):

```bash
docker compose up --build
```

That starts both services — backend on `http://localhost:8002`, frontend on
`http://localhost:3001`. Inside the compose network the frontend reaches the
backend at `http://backend:8000`, so no ports or localhost are involved.

**For day-to-day frontend work, still use `npm run dev`.** Next.js's own docs
recommend it over Docker on Mac and Windows — file watching through a bind mount
makes hot reload noticeably slower. The container is a production build, so it
doesn't hot-reload at all.

## 8. Deploying to Vercel

1. Push the repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Set **Root Directory** to `frontend` (the repo also contains the backend).
4. Add the environment variable `BACKEND_URL` = your Render URL
   (e.g. `https://portfolio-backend-xxxx.onrender.com`).
5. Deploy.

**Then update the backend**, or chat will be blocked by CORS: in Render's dashboard set
`ALLOWED_ORIGINS` to include your Vercel domain, e.g.
`https://yourname.vercel.app,http://localhost:3000`

## 9. Talking to the backend

Two endpoints, same behaviour:

- **`POST /chat/stream`** — what the frontend uses. Reports progress as it happens
  (Server-Sent Events), so the character can change pose *while* the agent works
  and the answer appears word by word.
- **`POST /chat`** — waits and returns the finished answer as one JSON response.

Both take the same request body.

**Send:**
```json
{
  "messages": [{ "role": "user", "content": "Tell me about your projects" }],
  "conversation_id": null,
  "pending_action": null
}
```

**Get back:**
```json
{
  "reply": "...",
  "pending_action": null,
  "conversation_id": "uuid-here",
  "tools_used": ["portfolio_search"]
}
```

`tools_used` names the tools the agent ran, in order. Possible values:
`portfolio_search`, `github_repo_info`, `draft_contact_email`, `send_contact_email`.
Empty when the agent answered without using a tool.

**Streaming events** from `/chat/stream`, each sent as `data: {...}\n\n`:

| Event | Meaning |
|---|---|
| `{"type":"tool_start","tool":"..."}` | About to run a tool — **sent before it runs**, which is what drives the character's pose |
| `{"type":"tool_end","tool":"..."}` | That tool finished |
| `{"type":"token","text":"..."}` | A piece of the reply |
| `{"type":"done", ...}` | Finished; carries the full `reply`, `pending_action`, `conversation_id`, `tools_used` |
| `{"type":"error","message":"..."}` | Failed after the response already started |

Always use the `reply` from `done` as the final text — for answers that weren't
streamed (like an email confirmation) it's the only text you get.

Three rules that are easy to get wrong:

1. **Send the entire `messages` array every time.** The backend keeps no memory between
   requests. Sending only the newest message means the AI forgets everything.
2. **Store `conversation_id` from the first reply and send it with every request after.**
   Skip this and each message becomes its own orphaned conversation in the admin dashboard.
3. **Echo `pending_action` back exactly as received.** It's cryptographically signed — edit
   any field and the backend rejects it, and the email never sends.

**Limits to respect:** 10 requests per minute per visitor, 2000 characters per message,
50 messages per conversation.

## 10. Day-to-day workflow

1. Edit code — the dev server hot-reloads.
2. Commit and push.
3. Vercel auto-deploys.
