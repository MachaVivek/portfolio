/**
 * Pinged when someone opens the page, purely to wake the backend up.
 *
 * On Render's free tier the backend sleeps after ~15 minutes of no traffic and
 * takes 30-60s to start again. Without this, the first visitor of the day types
 * a message and waits at a dead-looking box. Firing this on page load means the
 * server is usually awake by the time they've finished typing.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8002";

export async function GET() {
  try {
    await fetch(`${BACKEND_URL}/`, {
      // Long enough to cover a cold start. Nothing waits on this response, so a
      // slow reply costs the visitor nothing.
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    return Response.json({ ok: true });
  } catch {
    // Not a real failure — the visitor never sees this, and the chat has its own
    // error handling if the backend is genuinely down.
    return Response.json({ ok: false });
  }
}
