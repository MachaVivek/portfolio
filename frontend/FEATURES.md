# Frontend Features

## 1. AI Character (the agent's face)
- **What it does:** An anime-style character represents the assistant. It isn't decoration — it *reacts* to what the agent is actually doing, so the visitor can see the AI working.
- **Tech:** Static image set (`.webp`) swapped by state + CSS/Framer Motion animation. Optional upgrade: a Rive file for one rigged character that animates smoothly between states.
- **How:** The chat's current state drives which pose shows.

| State | When | Character shows |
|---|---|---|
| Idle | Waiting for input | Gentle float + blink |
| Thinking | Request in flight | Thinking pose |
| Searching | Agent used `portfolio_search` | Looking through papers |
| Coding | Agent used `github_repo_info` | At a laptop |
| Envelope | Email draft ready | Holding an envelope |
| Error / waking | Backend down or cold-starting | Apologetic pose |

> The backend streams a `tool_start` event *before* each tool runs, so the pose
> changes while the work is happening rather than after it. The `done` event also
> carries the full `tools_used` list.

## 2. Hero Chat (homepage centerpiece)
- **What it does:** The chat is the first thing on the homepage, with the character beside it. Portfolio content sits directly below, so visitors who just want to scan aren't blocked.
- **Tech:** React client component.
- **How:** Full-width hero section — character on one side, chat on the other. Stacks vertically on mobile.

## 3. Floating Chat Widget
- **What it does:** On every page other than home, a small character bubble sits bottom-right and opens the same chat.
- **Tech:** Shared chat component in the root layout.
- **How:** Collapsed = small character avatar. Expanded = chat panel. Conversation carries over from the hero chat.

## 4. Chat Interface
- **What it does:** The message list and input box.
- **Tech:** React `useState`, `react-markdown` for AI replies.
- **How:** User messages right-aligned, AI left-aligned next to the character. AI replies render as markdown so GitHub answers keep their headings and code blocks.

## 5. Backend Integration
- **What it does:** Talks to the FastAPI backend.
- **Tech:** `fetch` in a Next.js route handler (server-side proxy).
- **How:** Every request sends the **full message history**, the **`conversation_id`**, and any **`pending_action`** — the backend is stateless and needs all three. Routing through a Next.js route handler instead of calling the backend directly from the browser keeps the backend URL out of client code and avoids CORS entirely.

## 6. Email Confirmation Card
- **What it does:** When the agent drafts an email, it shows as a proper preview card with Send and Cancel buttons — not just a wall of text asking you to type "yes".
- **Tech:** React component triggered by `pending_action` in the response.
- **How:** Shows subject, message, and recipient. The buttons send the literal text `"yes"` / `"no"`, which is what the backend's confirmation check expects. Typing it manually still works.

## 7. Starter Prompts
- **What it does:** Three suggestion chips on an empty chat, so visitors know what the agent can do.
- **Tech:** Plain buttons.
- **How:** e.g. "Tell me about your projects", "Explain InstaAnalysisMcp", "I'd like to contact Vivek" — one per backend capability.

## 8. Cold-Start Handling
- **What it does:** Render's free tier sleeps after ~15 minutes idle and takes 30–60s to wake. Without this, the first visitor of the day types a message and stares at a frozen box.
- **Tech:** Health-check ping + a distinct loading state.
- **How:** Ping the backend's `/` endpoint on page load to start the wake-up early. If a chat request takes over ~5s, switch the message to "waking the server up, one moment" so the wait is honest rather than broken-looking.

## 9. Error States
- **What it does:** Every failure the backend can return gets a human message, never a raw error.
- **Tech:** Status-code handling around `fetch`.
- **How:** `429` → "you're sending messages a bit fast, give it a minute". `400` → message too long (also capped at 2000 characters in the input box before it's ever sent). `503` → "the assistant is unavailable right now".

## 10. Portfolio Content
- **What it does:** The actual portfolio — about, projects, skills, links.
- **Tech:** Static Next.js pages/components.
- **How:** Plain content below the hero. Kept in sync by hand with `backend/data/portfolio/` (the AI's knowledge lives there, not here).

## 11. Responsive & Accessible
- **What it does:** Works on phones; the character never gets in the way.
- **Tech:** Tailwind breakpoints, `prefers-reduced-motion`.
- **How:** Character shrinks or hides on small screens so the chat gets the room. Animations switch off for visitors who've asked for reduced motion. Chat is fully keyboard-navigable.

## 12. Performance
- **What it does:** Keeps the character from hurting load time.
- **Tech:** Inline SVG today; Next.js `<Image>` once real artwork replaces it.
- **How:** The placeholder character is inline SVG, so it costs no network requests
  at all and every pose is instantly available. When you swap in real artwork, use
  Next.js `<Image>` with `priority` on the idle pose only, keep each file under
  ~200KB as `.webp`, and let the other poses load lazily.
