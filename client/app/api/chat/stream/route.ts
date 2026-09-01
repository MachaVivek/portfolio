import type { ChatRequest } from "@/types/chat";
import { fetchBackend, DEFAULT_TIMEOUT_MS } from "@/lib/backendClient";

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
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for");

  try {
    const response = await fetchBackend(
      "/chat/stream",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        cache: "no-store",
      },
      clientIp
    );

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
