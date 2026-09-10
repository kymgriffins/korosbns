/**
 * Canonical frontend auth policy for Budget Ndio Story (korosbns).
 *
 * Model: REAL AUTH ONLY
 * - Anonymous users may browse all learn & task content freely — no profile needed.
 * - Admin routes require a real authenticated session with admin/manager role.
 * - No synthetic "citizen" state — either you have a real session or you don't.
 * - `isLoggedIn` (validated by GET /users/me/) gates privileged UI actions.
 *
 * @see docs/frontend-auth.md
 */

/** Default path after successful login when `next` is missing or invalid. */
export const DEFAULT_POST_LOGIN_PATH = "/";

/**
 * Admin routes — token-required at middleware level.
 * Role-specific enforcement (admin/manager only) happens client-side.
 */
export const ADMIN_PATH_PREFIXES = [
  "/admin",
  "/dashboard",
] as const;

export const BUDGETHUB_PATH_PREFIXES = [
  "/budgethub",
] as const;

/** Budgethub sub-paths that do NOT require authentication. */
export const BUDGETHUB_PUBLIC_PREFIXES = [
  "/budgethub/reports",
] as const;

/**
 * Gated routes — temporarily restricted from public/unauthenticated access.
 * Gated during review and restructuring phase.
 */
export const GATED_PATH_PREFIXES = [
  "/learn",
  "/learnhub",
  "/reports",
] as const;

/**
 * Auth pages that redirect authenticated users away (already signed in).
 * Verify and reset are intentionally excluded so users with a stale cookie can finish flows.
 */
export const AUTH_REDIRECT_IF_TOKEN_PREFIXES = [
  "/auth/login",
  "/auth/register",
] as const;

/** Auth pages that remain reachable regardless of token presence. */
export const AUTH_ALWAYS_ACCESSIBLE_PREFIXES = [
  "/auth/verify",
  "/auth/reset",
] as const;

export const AUTH_PAGE_PREFIXES = [
  ...AUTH_REDIRECT_IF_TOKEN_PREFIXES,
  ...AUTH_ALWAYS_ACCESSIBLE_PREFIXES,
] as const;

export const ACCESS_TOKEN_COOKIE = "bns_at";
export const REFRESH_TOKEN_COOKIE = "bns_rt";

export function pathMatchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGE_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
}

export function shouldRedirectAuthPageWhenToken(pathname: string): boolean {
  return AUTH_REDIRECT_IF_TOKEN_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
}

/**
 * Sanitize post-login redirect targets. Blocks open redirects and protocol tricks.
 * Only same-origin relative paths (single leading slash) are allowed.
 */
export function sanitizeRedirectPath(
  raw: string | null | undefined,
  fallback: string = DEFAULT_POST_LOGIN_PATH,
): string {
  if (raw == null) return fallback;

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("\\") || trimmed.includes("@") || trimmed.includes("\0")) return fallback;

  let decoded = trimmed;
  try {
    for (let i = 0; i < 3; i += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)) return fallback;
  if (decoded.includes("://")) return fallback;
  if (decoded.includes("\\") || decoded.includes("@")) return fallback;

  const pathPart = decoded.split("?")[0]?.split("#")[0] ?? decoded;
  if (pathPart.includes(":")) return fallback;
  if (/[\u0000-\u001F\u007F]/.test(pathPart)) return fallback;
  if (pathPart.includes("..")) return fallback;

  return trimmed;
}

export function buildLoginUrl(pathname: string, origin = ""): string {
  const next = encodeURIComponent(pathname);
  return `${origin}/auth/login?next=${next}`;
}
