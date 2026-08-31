# Frontend Build Phases

3 phases. By the end of Phase 3 the portfolio is live and the agent works end to end.

## Phase 1 — Foundation & Character

Get a real portfolio deployed, with the character in place but not yet wired to anything.

- Next.js (App Router) + TypeScript + Tailwind set up
- Portfolio content: about, projects, skills, links
- Character assets created and added to `public/character/`
  (see SETUP.md "Creating the character" — this is the part with a real lead time,
  so start it early rather than at the end)
- Character component that can switch poses, with idle float + blink animation
- Layout shell: hero section on home, floating widget slot on other pages
- Deployed to Vercel, auto-deploying on push

**Done when:** the portfolio is live at a real URL, looks finished, and the character
is visible and animating — with no chat behind it yet.

## Phase 2 — The Agent

Make it actually work. This is the phase that needs the backend running.

- Next.js route handler that proxies to the FastAPI backend
- Chat UI: message list, input box, send
- Full request contract: send the whole `messages` array, the `conversation_id`, and
  any `pending_action` on every request
- Character reacts to real state: thinking while waiting, then the pose matching the
  tool the agent used
- All three flows working: portfolio question, GitHub repo question, contact email
- Markdown rendering for AI replies
- `ALLOWED_ORIGINS` on the backend updated to include the Vercel domain

**Done when:** you can ask about a project, ask about a repo, and send yourself an
email — all from the live site, with the character reacting throughout.

## Phase 3 — Polish & Production

Make it feel finished and survive real visitors.

- Email confirmation card with Send / Cancel buttons
- Starter prompt chips on an empty chat
- Cold-start handling: health-check ping on load, honest "waking up" message
- Error states for 429 / 400 / 503, and a 2000-character cap on the input
- Floating widget on non-home pages, sharing conversation state with the hero chat
- Mobile layout pass — character must never crowd the chat on a phone
- Accessibility: keyboard navigation, `prefers-reduced-motion`, alt text
- Performance: image optimisation, preload non-idle poses after first paint

**Done when:** it works well on a phone, handles a sleeping backend gracefully,
and nothing shows a raw error message.

---

**Frontend is complete after Phase 3.**

---

## Status

All three phases are built. Streaming (SSE) was added on top of the original plan,
so the character reacts while the agent works rather than after it finishes.

Still to do before going live: real character artwork (a placeholder ships today),
real portfolio content in `src/data/portfolio.ts`, and the Vercel deploy.
