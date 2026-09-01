import { fetchBackend } from "@/lib/backendClient";
import { APP_DEFAULTS, BACKEND_CONFIG } from "@/lib/constants";

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

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for");

    const response = await fetchBackend(
      "/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
        signal: AbortSignal.timeout(BACKEND_CONFIG.CONTACT_TIMEOUT_MS),
      },
      clientIp
    );

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
          `Could not reach the email server. Please try again or email ${APP_DEFAULTS.CONTACT_EMAIL} directly.`,
      },
      { status: 503 },
    );
  }
}
