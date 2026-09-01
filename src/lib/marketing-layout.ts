const MARKETING_FOOTER_ROUTES = new Set([
  "/",
  "/about",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/bns-studio",
]);

const MARKETING_FOOTER_PREFIXES = ["/tiktok/"];

/** Routes that use the marketing navbar + page transition chrome (not learn shell). */
export function usesMarketingChrome(pathname: string): boolean {
  return !pathname.startsWith("/learn");
}

function normalizeMarketingPath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Top-of-page breadcrumbs are noisy on immersive studio and programmes flows. */
export function shouldShowPageBreadcrumbs(pathname: string): boolean {
  const normalized = normalizeMarketingPath(pathname);
  if (normalized === "/bns-studio") return false;
  if (normalized === "/programmes" || normalized.startsWith("/programmes/")) {
    return false;
  }
  return true;
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
