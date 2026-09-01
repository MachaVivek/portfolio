import { fetchBackend } from "@/lib/backendClient";

export async function GET() {
  try {
    await fetchBackend("/", {
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
