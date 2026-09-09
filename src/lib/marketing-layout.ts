const MARKETING_FOOTER_ROUTES = new Set([
  "/",
  "/about",
  "/programmes",
  "/reports",
  "/careers",
  "/contact",
  "/faq",
  "/help",
  "/glossary",
  "/privacy",
  "/terms",
  "/security",
]);

const MARKETING_FOOTER_PREFIXES = ["/tiktok/", "/programmes/", "/reports/"];

/** Routes that use the marketing navbar + page transition chrome. */
export function usesMarketingChrome(pathname: string): boolean {
  if (
    pathname.startsWith("/bns-studio") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/stories")
  ) {
    return false;
  }
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

export type FooterVariant = "marketing" | "minimal" | "none";

/**
 * Determines whether to display the heavy marketing footer (only on / and /about)
 * or the new minimalistic footer on all ID/slug pages and most pages, or none for /learn.
 */
export function getFooterVariant(pathname: string): FooterVariant {
  if (pathname.startsWith("/learn") || pathname.startsWith("/stories")) {
    return "none";
  }

  const normalized = normalizeMarketingPath(pathname);

  // Full bulky marketing footer is reserved for the primary landing page
  if (normalized === "/" || normalized === "/about") {
    return "marketing";
  }

  // Inside ID/slug pages and most pages, use the new minimalistic footer
  return "minimal";
}

/**
 * Marketing-site footer check (for backward compatibility and test suites).
 */
export function shouldShowMarketingFooter(pathname: string): boolean {
  if (pathname.startsWith("/learn") || pathname.startsWith("/stories")) return false;

  const normalized = normalizeMarketingPath(pathname);

  if (MARKETING_FOOTER_ROUTES.has(normalized)) return true;
  return MARKETING_FOOTER_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
}
