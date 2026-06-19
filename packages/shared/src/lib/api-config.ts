/**
 * Centralized API configuration.
 *
 * Browser:
 * - Production citizen site → "" (same-origin `/api/v1` rewrites to BNSKE; no CORS)
 * - localhost + local Django → direct http://localhost:8000
 * - localhost + remote API → "" (rewrites)
 *
 * Server (SSR, route handlers): absolute SERVER_API_BASE_URL.
 */

const env = typeof process !== "undefined" ? process.env : {};

const NEXT_PUBLIC_API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://bnske.budgetndiostory.org";
const API_PROXY_TARGET_VAL = env.API_PROXY_TARGET?.trim();

const PRODUCTION_API = "https://bnske.budgetndiostory.org";

function normalizeBase(url: string | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return PRODUCTION_API;
  return trimmed.replace(/\/+$/, "");
}

/** Absolute API origin for server-side fetch (no trailing slash). */
export const SERVER_API_BASE_URL = normalizeBase(NEXT_PUBLIC_API_BASE_URL);

function isLocalApiTarget(base: string): boolean {
  try {
    const host = new URL(base).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Browser API base URL.
 * - Same host as API (rare): direct absolute calls.
 * - Local dev + local Django: direct to localhost:8000 (avoids broken POST rewrites).
 * - Otherwise: "" → same-origin `/api/v1/*` proxied by Next (production + preview).
 */
function browserApiBase(): string {
  if (typeof window === "undefined" || !window.location) return SERVER_API_BASE_URL;
  try {
    const apiOrigin = new URL(SERVER_API_BASE_URL).origin;
    if (window.location.origin === apiOrigin) return SERVER_API_BASE_URL;
  } catch {
    /* fall through */
  }
  const isLocalDev =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (isLocalDev && isLocalApiTarget(SERVER_API_BASE_URL)) {
    return SERVER_API_BASE_URL;
  }
  return "";
}

/**
 * Base URL used in fetch calls.
 * Browser on citizen site: empty (same-origin /api/v1 proxy). SSR: absolute API URL.
 */
export const API_BASE_URL =
  typeof window !== "undefined" ? browserApiBase() : SERVER_API_BASE_URL;

/** Rewrite/proxy target for next.config.ts */
export function getApiProxyTarget(): string {
  return normalizeBase(API_PROXY_TARGET_VAL ?? NEXT_PUBLIC_API_BASE_URL);
}
