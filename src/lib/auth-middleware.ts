import {
  ADMIN_PATH_PREFIXES,
  BUDGETHUB_PATH_PREFIXES,
  buildLoginUrl,
  DEFAULT_POST_LOGIN_PATH,
  isAuthPage,
  isLearnProtectedPath,
  pathMatchesPrefix,
  shouldRedirectAuthPageWhenToken,
} from "@/lib/auth-policy";

export type MiddlewareDecision =
  | { action: "next" }
  | { action: "redirect"; location: string };

/**
 * Pure middleware decision function — shared by edge middleware and stress tests.
 */
export function evaluateAuthMiddleware(
  pathname: string,
  token: string | null | undefined,
): MiddlewareDecision {
  if (isLearnProtectedPath(pathname) && !token) {
    return { action: "redirect", location: buildLoginUrl(pathname) };
  }

  const isAdminPath = ADMIN_PATH_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
  if (isAdminPath && !token) {
    return { action: "redirect", location: buildLoginUrl(pathname) };
  }

  const isBudgethubPath = BUDGETHUB_PATH_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
  if (isBudgethubPath && !token) {
    return { action: "redirect", location: buildLoginUrl(pathname) };
  }

  if (isAuthPage(pathname) && token && shouldRedirectAuthPageWhenToken(pathname)) {
    return { action: "redirect", location: DEFAULT_POST_LOGIN_PATH };
  }

  return { action: "next" };
}
