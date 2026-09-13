/**
 * Page loading / splash policy — lives in `partner-page-sections` CMS.
 * Defaults are OFF so routes never show cosmetic loaders unless editors opt in.
 */

import {
  partnerPageSectionsCms,
  type PartnerPageSectionsCms,
  type PartnerPageSectionsLike,
  type PageLoadingConfig,
  type PageLoadingVariant,
} from "@/lib/partner-page-cms";

export type { PageLoadingConfig, PageLoadingVariant };

export const DEFAULT_PAGE_LOADING: PageLoadingConfig = {
  enabled: false,
  minMs: 0,
  variant: "none",
};

export function getLoadingDefaults(
  config?: PartnerPageSectionsLike | null,
): NonNullable<PartnerPageSectionsCms["policy"]["loadingDefaults"]> {
  const policy =
    (config as PartnerPageSectionsCms | null | undefined)?.policy ??
    partnerPageSectionsCms.policy;
  const defaults = policy.loadingDefaults || {};
  return {
    globalSplash: Boolean(defaults.globalSplash),
    globalSplashMinMs: Math.max(0, Number(defaults.globalSplashMinMs) || 0),
    routeLoadingDefault: Boolean(defaults.routeLoadingDefault),
    routeLoadingVariant: (defaults.routeLoadingVariant ||
      "none") as PageLoadingVariant,
    notes: defaults.notes || "",
  };
}

export function getGlobalSplashConfig(config?: PartnerPageSectionsLike | null): {
  enabled: boolean;
  minMs: number;
} {
  const defaults = getLoadingDefaults(config);
  return {
    enabled: Boolean(defaults.globalSplash),
    minMs: Math.max(0, Number(defaults.globalSplashMinMs) || 0),
  };
}

export function resolvePageLoadingById(
  pageId: string,
  config?: PartnerPageSectionsLike | null,
): PageLoadingConfig {
  const defaults = getLoadingDefaults(config);
  const pages =
    (config as PartnerPageSectionsCms | null | undefined)?.pages ??
    partnerPageSectionsCms.pages;
  const page = pages?.[pageId] as
    | { loading?: Partial<PageLoadingConfig> }
    | undefined;
  const pageLoading = page?.loading;

  if (pageLoading && typeof pageLoading.enabled === "boolean") {
    return {
      enabled: pageLoading.enabled,
      minMs: Math.max(0, Number(pageLoading.minMs) || 0),
      variant: (pageLoading.variant ||
        defaults.routeLoadingVariant ||
        "none") as PageLoadingVariant,
    };
  }

  return {
    enabled: Boolean(defaults.routeLoadingDefault),
    minMs: 0,
    variant: (defaults.routeLoadingVariant || "none") as PageLoadingVariant,
  };
}

/**
 * Match a pathname to the longest partner-page route (supports `[slug]` prefixes).
 */
export function findPartnerPageIdByPath(
  pathname: string,
  config?: PartnerPageSectionsLike | null,
): string | null {
  const pages =
    (config as PartnerPageSectionsCms | null | undefined)?.pages ??
    partnerPageSectionsCms.pages;
  const path = (pathname || "/").split("?")[0] || "/";

  const ranked = Object.entries(pages)
    .map(([id, page]) => ({
      id,
      route: String((page as { route?: string })?.route || ""),
    }))
    .filter((row) => row.route)
    .sort((a, b) => b.route.length - a.route.length);

  for (const row of ranked) {
    if (row.route.includes("[")) {
      const prefix = row.route.slice(0, row.route.indexOf("["));
      if (path.startsWith(prefix)) return row.id;
      continue;
    }
    if (path === row.route || path.startsWith(`${row.route}/`)) {
      return row.id;
    }
  }
  return null;
}

export function resolvePageLoadingByPath(
  pathname: string,
  config?: PartnerPageSectionsLike | null,
): PageLoadingConfig {
  const pageId = findPartnerPageIdByPath(pathname, config);
  if (!pageId) {
    const defaults = getLoadingDefaults(config);
    return {
      enabled: Boolean(defaults.routeLoadingDefault),
      minMs: 0,
      variant: (defaults.routeLoadingVariant || "none") as PageLoadingVariant,
    };
  }
  return resolvePageLoadingById(pageId, config);
}
