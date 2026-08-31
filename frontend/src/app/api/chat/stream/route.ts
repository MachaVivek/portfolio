import type { ChatRequest } from "@/lib/types";

/**
 * Streaming proxy to the backend's /chat/stream.
 *
 * The backend sends Server-Sent Events as it works — which tool it's running,
 * then the answer word by word. This passes them straight through to the browser
 * without collecting them first, which is the whole point: buffering here would
 * undo the streaming.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8002";

// Generous, because Render's free tier can take ~30-60s to wake from sleep.
const TIMEOUT_MS = 60_000;

function messageForStatus(status: number): string {
  if (status === 429) {
    return "You're sending messages a bit fast — give it a minute and try again.";
  }
  if (status === 400) {
    return "That message was too long. Could you shorten it?";
  }
  return "The assistant is unavailable right now. Please try again in a moment.";
}

/** Build a one-event stream, so failures reach the client in the same format. */
function errorStream(message: string): Response {
  const body = `data: ${JSON.stringify({
    type: "done",
    reply: message,
    pending_action: null,
    conversation_id: null,
    tools_used: [],
    error: true,
  })}\n\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;

  try {
    const response = await fetch(`${BACKEND_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok || !response.body) {
      console.error(`Backend responded ${response.status}`);
      return errorStream(messageForStatus(response.status));
    }

    // response.body is passed along untouched, so events reach the browser the
    // moment the backend produces them.
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Could not reach the backend:", error);
    return errorStream(
      "I couldn't reach the server. It may be waking up — try again in a few seconds.",
    );
  }
}
