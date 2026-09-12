import { getJsonFromR2 } from "@/lib/r2-storage";
import landingFallback from "@/content/landing.json";
import programmesFallback from "@/content/programmes.json";
import aboutFallback from "@/content/about.json";
import partnerPageSectionsFallback from "@/content/partner-page-sections.json";
import customPagesFallback from "@/content/custom-pages.json";
import featuredProjectsFallback from "@/data/fallbacks/featured-projects.json";
import navigationFallback from "@/content/navigation.json";
import designTokensFallback from "@/content/design-tokens.json";
import type { CmsCollectionSlug } from "@/lib/headless-cms";

export type LandingContent = typeof landingFallback;
export type ProgrammesContent = typeof programmesFallback;
export type AboutContent = typeof aboutFallback;
export type PartnerPageSectionsContent = typeof partnerPageSectionsFallback;
export type CustomPagesContent = typeof customPagesFallback;
export type FeaturedProjectsContent = typeof featuredProjectsFallback;
export type NavigationContent = typeof navigationFallback;
export type DesignTokensContent = typeof designTokensFallback;

const FALLBACK_MAP: Partial<Record<CmsCollectionSlug, unknown>> = {
  landing: landingFallback,
  programmes: programmesFallback,
  about: aboutFallback,
  "partner-page-sections": partnerPageSectionsFallback,
  "custom-pages": customPagesFallback,
  "featured-projects": featuredProjectsFallback,
  navigation: navigationFallback,
  "design-tokens": designTokensFallback,
};

/**
 * Loads live CMS collection data from Cloudflare R2 storage,
 * gracefully falling back to local bundled JSON files if unavailable.
 */
export async function getLiveCmsCollection<T = Record<string, unknown>>(
  slug: CmsCollectionSlug,
  fallback?: T,
): Promise<T> {
  const defaultData = (fallback ?? (FALLBACK_MAP[slug] as T) ?? {}) as T;
  try {
    const r2Data = await getJsonFromR2<T>(`cms/${slug}.json`);
    if (r2Data && typeof r2Data === "object" && Object.keys(r2Data).length > 0) {
      return r2Data;
    }
  } catch (err) {
    console.warn(`[Live CMS Data] Failed to load ${slug} from R2, using fallback:`, err);
  }
  return defaultData;
}

/**
 * Loads live homepage landing data from R2 or fallback.
 */
export async function getLiveLandingData(): Promise<LandingContent> {
  return getLiveCmsCollection<LandingContent>("landing", landingFallback);
}

/**
 * Loads live partner page sections configuration.
 */
export async function getLivePartnerPageSections(): Promise<PartnerPageSectionsContent> {
  return getLiveCmsCollection<PartnerPageSectionsContent>(
    "partner-page-sections",
    partnerPageSectionsFallback,
  );
}

/**
 * Loads live featured evidence & investigative stories.
 */
export async function getLiveFeaturedProjects(): Promise<FeaturedProjectsContent> {
  return getLiveCmsCollection<FeaturedProjectsContent>(
    "featured-projects",
    featuredProjectsFallback,
  );
}

/**
 * Loads live site navigation and footer chrome data.
 */
export async function getLiveNavigationData(): Promise<NavigationContent> {
  return getLiveCmsCollection<NavigationContent>("navigation", navigationFallback);
}

/**
 * Loads live brand design tokens for badges, buttons, and styles.
 */
export async function getLiveDesignTokens(): Promise<DesignTokensContent> {
  return getLiveCmsCollection<DesignTokensContent>("design-tokens", designTokensFallback);
}
