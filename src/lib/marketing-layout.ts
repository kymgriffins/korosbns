const MARKETING_FOOTER_ROUTES = new Set([
  "/",
  "/about",
  "/programmes",
  "/reports",
  "/learn",
  "/careers",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
]);

const MARKETING_FOOTER_PREFIXES = ["/tiktok/", "/programmes/", "/reports/"];

/** Routes that use the marketing navbar + page transition chrome. */
export function usesMarketingChrome(pathname: string): boolean {
  if (pathname.startsWith("/bns-studio")) return false;
  return true;
}

function normalizeMarketingPath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Top-of-page breadcrumbs are disabled on marketing — pages use editorial heroes and in-page back links. */
export function shouldShowPageBreadcrumbs(_pathname: string): boolean {
  return false;
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
