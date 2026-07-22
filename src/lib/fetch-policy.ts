/** Client + isomorphic fetch defaults so API data stays fresh. */
export const API_FETCH_CACHE: RequestCache = "no-store";

/** Next.js RSC/server fetch — short TTL; override with no-store where needed. */
export const SERVER_CONTENT_REVALIDATE_SECONDS = 60;

type FetchInitWithNext = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

/** Public catalogue GETs — ISR instead of cache: no-store (auth/mutations stay no-store). */
export function publicCatalogueFetchInit(
  init?: RequestInit,
): FetchInitWithNext {
  const existingNext = (init as FetchInitWithNext | undefined)?.next;
  return {
    ...init,
    next: {
      ...existingNext,
      revalidate:
        typeof existingNext?.revalidate === "number"
          ? existingNext.revalidate
          : SERVER_CONTENT_REVALIDATE_SECONDS,
    },
  };
}

export function apiFetchInit(
  method: string | undefined,
  init?: RequestInit,
): RequestInit {
  const normalized = (method ?? "GET").toUpperCase();
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(normalized);
  const nextRevalidate = (init as FetchInitWithNext | undefined)?.next?.revalidate;
  const useIsr =
    !isMutation && typeof nextRevalidate === "number" && nextRevalidate > 0;

  return {
    ...(useIsr ? {} : { cache: API_FETCH_CACHE }),
    ...init,
    headers: {
      ...(useIsr
        ? {}
        : {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }),
      ...(init?.headers as Record<string, string> | undefined),
    },
  };
}
