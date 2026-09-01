/**
 * Contact form endpoint forwarding to the backend's POST /contact.
 * Uses Resend to send the message straight to Vivek's inbox.
 */

const TIMEOUT_MS = 20_000;

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Please provide your name, email, and message." },
        { status: 400 },
      );
    }

    const response = await fetchBackend("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { ok: false, error: data.detail || "Could not send message." },
        { status: response.status },
      );
    }

    return Response.json({ ok: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return Response.json(
      {
        ok: false,
        error:
          "Could not reach the email server. Please try again or email machavivek19@gmail.com directly.",
      },
      { status: 503 },
    );
  }
}
