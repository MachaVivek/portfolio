import type { ChatRequest } from "@/types/chat";

/**
 * Streaming proxy to the backend's /chat/stream endpoint.
 *
 * Streams Server-Sent Events (SSE) directly through to the client without buffering,
 * enabling real-time token streaming and immediate character state transitions.
 */

const TIMEOUT_MS = 60_000;

async function fetchBackend(path: string, options: RequestInit): Promise<Response> {
  const configured = process.env.BACKEND_URL;
  if (configured) {
    return fetch(`${configured}${path}`, options);
  }

  try {
    return await fetch(`http://localhost:8002${path}`, options);
  } catch (err: unknown) {
    const error = err as { code?: string; cause?: { code?: string } };
    if (error?.cause?.code === "ECONNREFUSED" || error?.code === "ECONNREFUSED") {
      return await fetch(`http://localhost:8000${path}`, options);
    }
    throw err;
  }
}

function messageForStatus(status: number): string {
  if (status === 429) {
    return "Daily AI token limit reached. Please explore Vivek's detailed projects, skills, and resume in the sections below, or send a direct message via the Contact tab!";
  }
  if (status === 400) {
    return "That message was too long. Could you shorten it?";
  }
  return "The assistant is temporarily unavailable. Please explore the detailed sections below or reach out via the Contact tab!";
}

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
    const response = await fetchBackend("/chat/stream", {
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
