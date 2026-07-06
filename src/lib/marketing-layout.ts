const MARKETING_FOOTER_ROUTES = new Set([
  "/",
  "/about",
  "/team",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/bns-studio",
]);

const MARKETING_FOOTER_PREFIXES = ["/team/", "/tiktok/"];

/** Routes that use the marketing navbar + page transition chrome (not learn shell). */
export function usesMarketingChrome(pathname: string): boolean {
  return !pathname.startsWith("/learn");
}

/**
 * Marketing-site footer only — not learn, contact, surveys, projects, news, etc.
 */
export function shouldShowMarketingFooter(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (MARKETING_FOOTER_ROUTES.has(normalized)) return true;
  return MARKETING_FOOTER_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
}
