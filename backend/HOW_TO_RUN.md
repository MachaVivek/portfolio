# How to Run This Backend — Step by Step

This guide assumes no prior knowledge of this project. Follow it top to bottom.

---

## Part A — Prerequisites (install once)

1. **Docker Desktop** — this project runs entirely inside Docker, no local Python setup needed.

   - Mac: https://www.docker.com/products/docker-desktop/
   - After installing, open the Docker Desktop app once and make sure it says "Docker is running" (green icon in the menu bar / system tray). If it's not running, none of the commands below will work.
2. **Git** — to get the code. Check if you already have it:

   ```bash
   git --version
   ```

   If that errors, install Git from https://git-scm.com/downloads
3. Accounts you'll need (only required to get real answers — the app runs without them, see Part C):

   - [Google AI Studio](https://aistudio.google.com/) — for a Gemini API key (free)
   - [Qdrant Cloud](https://cloud.qdrant.io/) — free tier vector database
   - [Supabase](https://supabase.com/) — free tier Postgres database
   - [GitHub](https://github.com/settings/tokens) — a personal access token
   - [Resend](https://resend.com/) — free tier email sending

---

## Part B — Get the code onto your machine

```bash
git clone <the-repo-url>
cd portfolio/backend
```

(Replace `<the-repo-url>` with the actual GitHub URL once this project is pushed there.)

---

## Part C — Run it locally (fastest way to see it working)

### Step 1 — Create your local secrets file

```bash
cp .env.example .env
```

This copies the template. `.env` is where your real API keys go — it's never committed to git
(it's in `.gitignore`), so it's safe to put real secrets in it.

You can leave every key in `.env` blank for now — the app is built to run and respond
sensibly ("not configured yet" messages) even with zero keys filled in. This lets you confirm
everything works before dealing with any external accounts.

### Step 2 — Build and start the app

```bash
docker compose up --build
```

What this does:

- `docker compose` reads `docker-compose.yml` in this folder.
- `--build` tells it to build the Docker image first (installs Python + all dependencies inside
  a container) before starting it. You only strictly need `--build` the first time, or after
  changing `requirements.txt` — Docker will skip rebuilding unchanged layers automatically.
- It then starts the FastAPI server inside that container.

The first run takes a minute or two (downloading the base image, installing packages). You'll
see build logs, then something like:

```
Uvicorn running on http://0.0.0.0:8000
```

Leave this terminal window open — the server keeps running here. Open a **new terminal tab**
for the next steps.

### Step 3 — Check it's alive

```bash
curl http://localhost:8002/
```

Expected output:

```json
{"status":"ok"}
```

(Port is `8002`, not the more common `8000` — set that way in `docker-compose.yml` because
other ports were already taken on the machine this was built on. If `8000` is free on your
machine, feel free to change the port mapping in `docker-compose.yml` back to `8000:8000`.)

If `curl` isn't installed or you'd rather use a browser, just open `http://localhost:8002/` —
you should see the same JSON.

### Step 4 — Try the interactive API docs

Open in a browser:

```
http://localhost:8002/docs
```

This is a free, auto-generated page (from FastAPI) where you can try every endpoint by hand —
no need to write curl commands. Click on `POST /chat`, click "Try it out", and send a test
message.

### Step 5 — Talk to the chatbot from the terminal

```bash
curl -X POST http://localhost:8002/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "hello"}]}'
```

With no `GEMINI_API_KEY` set yet, you'll get back:

```json
{"reply":"AI service isn't configured yet — API keys are missing.","pending_action":null,"conversation_id":null}
```

That's expected and correct — it means the server is working, it's just waiting on real keys.

### Step 6 — Stop the server

Press `Ctrl+C` in the terminal where it's running, or from another terminal:

```bash
docker compose down
```

---

## Part D — Filling in real API keys (to get real answers)

Open `.env` in a text editor and fill in each value. Here's where to get each one:

| Variable                               | Where to get it                                                                                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`                     | https://aistudio.google.com/apikey — click "Create API key"                                                                                                                          |
| `QDRANT_URL`, `QDRANT_API_KEY`     | Create a free cluster at https://cloud.qdrant.io/ → cluster details page has both                                                                                                    |
| `SUPABASE_URL`, `SUPABASE_KEY`     | Create a project at https://supabase.com/ → Project Settings → API. Use the**service_role** key, not the anon key (this key stays server-side only, never expose it publicly) |
| `GITHUB_TOKEN`                       | https://github.com/settings/tokens → generate a token with`repo` read access                                                                                                       |
| `GITHUB_USERNAME`                    | Your GitHub username                                                                                                                                                                  |
| `GITHUB_ALLOWED_REPOS`               | Comma-separated exact repo names you want the bot allowed to explain, e.g.`AI-Tour-Guide,InstaAnalysisMcp`                                                                          |
| `RESEND_API_KEY`                     | https://resend.com/api-keys                                                                                                                                                           |
| `RESEND_FROM_EMAIL`                  | Must be an address on a domain you've verified in Resend (Resend walks you through DNS setup)                                                                                         |
| `CONTACT_EMAIL_TO`                   | Your own email — where visitor messages land                                                                                                                                         |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Pick anything — this is the login for your own`/admin` dashboard                                                                                                                   |

Once filled in, restart the server so it picks up the new values:

```bash
docker compose up --build
```

(`docker compose` reads `.env` fresh on every start — no rebuild strictly needed unless you
changed `requirements.txt`, but `--build` is harmless and safe to always include.)

---

## Part E — Loading your portfolio content (for the chatbot to answer from)

1. Open `data/portfolio/` in this folder. Replace the placeholder text in `about.md` with a
   real bio, and replace `projects/example-project.md` with one file per real project.
2. Run the ingestion script — this reads those files, breaks them into chunks, and uploads them
   to Qdrant:
   ```bash
   docker compose exec api python scripts/ingest_portfolio.py
   ```

   - `docker compose exec api` runs a command **inside the already-running** `api` container
     (so make sure `docker compose up` is running in another terminal first).
   - You should see output like `Loaded 3 files, split into 12 chunks. Uploaded to Qdrant.`
3. Re-run this command any time you edit the content files.

---

## Part F — Setting up the database (Supabase)

1. Open your Supabase project → **SQL Editor**.
2. Open `db/schema.sql` in this repo, copy its full contents, paste into the SQL Editor, and
   run it. This creates the tables the app needs (`conversations`, `messages`,
   `contact_submissions`) — a one-time step.

---

## Part G — Verifying the full thing works locally

With all keys filled in, `docker compose up --build` running, and content ingested:

```bash
curl -X POST http://localhost:8002/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Tell me about your projects"}]}'
```

You should get a real, grounded answer instead of the "not configured" message.

Check the admin dashboard:

```
http://localhost:8002/admin
```

Log in with the `ADMIN_USERNAME`/`ADMIN_PASSWORD` you set. You should see the conversation you
just created.

---

## Part H — Troubleshooting

- **"Cannot connect to the Docker daemon"** — Docker Desktop isn't running. Open the app.
- **"port is already allocated"** — something else on your machine is using that port. Either
  stop that other thing, or change the left-hand number in `docker-compose.yml`'s `ports:` line
  (e.g. `"8003:8000"`) and use that port in your commands instead.
- **Changes to code aren't showing up** — the container mounts `app/`, `scripts/`, and `data/`
  as live volumes, so edits should hot-reload automatically. If not, restart with
  `docker compose up --build`.
- **A key looks right but still fails** — double check for trailing spaces or quotes in `.env`;
  values should not be wrapped in quotes.

---

## Part I — Running in Production (deploying it for real)

This puts the backend on the public internet at a real URL, using [Render](https://render.com/).

### Step 1 — Push the code to GitHub

```bash
git add .
git commit -m "Backend ready for deployment"
git push
```

(Skip this if it's already pushed.)

### Step 2 — Create the service on Render

1. Go to https://dashboard.render.com/ and sign in (GitHub login is easiest).
2. Click **New → Blueprint**.
3. Connect the GitHub repo. Render will detect `render.yaml` at the repo root automatically and
   read its configuration — it already knows this is a Docker service living in the `backend/`
   folder.
4. Render will list every environment variable declared in `render.yaml` and ask you to fill in
   real values (same names, same values as your local `.env`).
5. Click **Apply** / **Create**. Render will build the Docker image (same `Dockerfile` you've
   been using locally) and start the container.

If you'd rather not use the blueprint, you can set it up manually instead:

1. **New → Web Service** → connect the repo.
2. **Environment**: Docker.
3. **Root Directory**: `backend`.
4. Manually add each environment variable under the "Environment" tab.

### Step 3 — Wait for the first deploy

Render shows live build logs — this looks just like the `docker compose up --build` output you
saw locally, because it's building the exact same Dockerfile. Once it says "Live", you're done.

### Step 4 — Get your live URL

Render gives you a URL like:

```
https://portfolio-backend-xxxx.onrender.com
```

Test it exactly like you tested locally, just with this URL instead of `localhost:8002`:

```bash
curl https://portfolio-backend-xxxx.onrender.com/
```

### Step 5 — Run the database setup against production

If you're using the **same** Supabase and Qdrant Cloud projects as local dev, there's nothing
more to do — they're already shared, cloud-hosted services, not something tied to your laptop.
If you created separate production projects, repeat Part E (ingest) and Part F (schema) against
them.

### Step 6 — Point the frontend at it (once the frontend exists)

In the Next.js project (deployed on Vercel), set an environment variable:

```
NEXT_PUBLIC_API_URL=https://portfolio-backend-xxxx.onrender.com
```

And update `ALLOWED_ORIGINS` in Render's environment variables to include your real Vercel
domain (e.g. `https://yourname.vercel.app`) — otherwise the browser will block requests due to
CORS.

### Step 7 — Every future update

```bash
git add .
git commit -m "describe your change"
git push
```

Render automatically rebuilds and redeploys on every push to your main branch. No SSH, no
manual server restarts, no extra steps.

---

## Quick Reference — All Commands

```bash
# First-time local setup
cp .env.example .env
docker compose up --build

# Everyday local dev (after first time)
docker compose up

# Stop
docker compose down

# Run a one-off command inside the running container (e.g. re-ingest content)
docker compose exec api python scripts/ingest_portfolio.py

# Check logs without stopping
docker compose logs -f api

# Deploy (after Render is set up once)
git add .
git commit -m "message"
git push
```
