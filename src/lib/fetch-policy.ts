/** Client + isomorphic fetch defaults so API data stays fresh. */
export const API_FETCH_CACHE: RequestCache = "no-store";

export function apiFetchInit(
  method: string | undefined,
  init?: RequestInit,
): RequestInit {
  const normalized = (method ?? "GET").toUpperCase();
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(normalized);
  return {
    cache: API_FETCH_CACHE,
    ...init,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(init?.headers as Record<string, string> | undefined),
    },
  };
}

/** Next.js RSC/server fetch — short TTL; override with no-store where needed. */
export const SERVER_CONTENT_REVALIDATE_SECONDS = 60;
