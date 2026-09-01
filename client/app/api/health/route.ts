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
