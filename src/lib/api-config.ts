/**
 * Centralized API configuration.
 *
 * Browser:
 * - localhost → "" (same-origin; Next.js rewrites to Django)
 * - production/static host → absolute NEXT_PUBLIC_API_BASE_URL (CORS on API)
 *
 * Server (SSR, route handlers): absolute SERVER_API_BASE_URL.
 */

import { env } from "@/env";

const PRODUCTION_API = "https://bnske.budgetndiostory.org";

function normalizeBase(url: string | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return PRODUCTION_API;
  return trimmed.replace(/\/+$/, "");
}

/** Absolute API origin for server-side fetch (no trailing slash). */
export const SERVER_API_BASE_URL = normalizeBase(env.NEXT_PUBLIC_API_BASE_URL);

function isLocalBrowserHost(): boolean {
  if (typeof window === "undefined" || !window.location) return false;
  const host = window.location.hostname;
  return host === "localhost";
}

function isLocalApiTarget(base: string): boolean {
  try {
    const host = new URL(base).hostname;
    return host === "localhost" || host === "localhost";
  } catch {
    return false;
  }
}

function browserApiBase(): string {
  if (!isLocalBrowserHost()) return SERVER_API_BASE_URL;
  // Next `trailingSlash: true` breaks POST/GET proxy loops on `/api/v1/*` — call Django directly.
  if (isLocalApiTarget(SERVER_API_BASE_URL)) return SERVER_API_BASE_URL;
  return "";
}

/**
 * Base URL used in fetch calls.
 * Browser on localhost: empty (rewrites). Browser on deployed static: direct API.
 */
export const API_BASE_URL =
  typeof window !== "undefined" ? browserApiBase() : SERVER_API_BASE_URL;

/** Rewrite/proxy target for next.config.ts */
export function getApiProxyTarget(): string {
  return normalizeBase(env.API_PROXY_TARGET ?? env.NEXT_PUBLIC_API_BASE_URL);
}
