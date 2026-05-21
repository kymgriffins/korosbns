import { API_BASE_URL, SERVER_API_BASE_URL } from "@/lib/api-config";

/**
 * Resolve same-origin paths (`/api/youtube`, `/api/gamification/...`) for fetch.
 * Browser: current origin. SSR/tests: configured API base or localhost.
 */
export function resolveAppUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${normalized}`;
  }
  const base = (API_BASE_URL || SERVER_API_BASE_URL || "http://localhost:8000").replace(
    /\/+$/,
    "",
  );
  return `${base}${normalized}`;
}

/** Build a same-origin or server-absolute API URL for `/api/v1` paths. */
export function buildApiUrl(path: string, params?: Record<string, string>): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = normalized.startsWith("/api/v1")
    ? `${API_BASE_URL}${normalized}`
    : `${API_BASE_URL}/api/v1${normalized}`;
  if (!params || !Object.keys(params).length) return base;
  const search = new URLSearchParams(params);
  return `${base}${base.includes("?") ? "&" : "?"}${search.toString()}`;
}

export function networkErrorMessage(cause: unknown): string {
  if (cause instanceof Error) {
    if (cause.name === "TypeError" || cause.message === "Failed to fetch") {
      return "Unable to reach the API. Ensure the dev server is running and API rewrites are configured.";
    }
    if (cause.name === "NetworkError" || cause.message.includes("NetworkError")) {
      return "Network error while contacting the API. Check CORS, proxy, or that the backend is running.";
    }
    return cause.message;
  }
  return "Unable to reach the API.";
}
