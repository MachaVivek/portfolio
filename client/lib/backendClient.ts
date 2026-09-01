import { BACKEND_CONFIG } from "@/lib/constants";

export const DEFAULT_TIMEOUT_MS = BACKEND_CONFIG.DEFAULT_TIMEOUT_MS;

export async function fetchBackend(
  path: string,
  options: RequestInit,
  clientIp?: string | null
): Promise<Response> {
  const headers = new Headers(options.headers || {});
  if (clientIp) {
    headers.set("X-Forwarded-For", clientIp);
    headers.set("X-Real-IP", clientIp);
  }

  const configured = process.env.BACKEND_URL;
  if (configured) {
    return fetch(`${configured}${path}`, { ...options, headers });
  }

  try {
    return await fetch(`${BACKEND_CONFIG.FALLBACK_DOCKER_URL}${path}`, { ...options, headers });
  } catch (err: unknown) {
    const error = err as { code?: string; cause?: { code?: string } };
    if (error?.cause?.code === "ECONNREFUSED" || error?.code === "ECONNREFUSED") {
      return await fetch(`${BACKEND_CONFIG.FALLBACK_LOCAL_URL}${path}`, { ...options, headers });
    }
    throw err;
  }
}
