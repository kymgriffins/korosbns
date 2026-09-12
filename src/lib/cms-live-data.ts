import { getJsonFromR2 } from "@/lib/r2-storage";
import landingFallback from "@/content/landing.json";
import programmesFallback from "@/content/programmes.json";
import aboutFallback from "@/content/about.json";
import partnerPageSectionsFallback from "@/content/partner-page-sections.json";
import customPagesFallback from "@/content/custom-pages.json";
import featuredProjectsFallback from "@/data/fallbacks/featured-projects.json";
import type { CmsCollectionSlug } from "@/lib/headless-cms";

export type LandingContent = typeof landingFallback;
export type ProgrammesContent = typeof programmesFallback;
export type AboutContent = typeof aboutFallback;
export type PartnerPageSectionsContent = typeof partnerPageSectionsFallback;
export type CustomPagesContent = typeof customPagesFallback;
export type FeaturedProjectsContent = typeof featuredProjectsFallback;

const FALLBACK_MAP: Partial<Record<CmsCollectionSlug, unknown>> = {
  landing: landingFallback,
  programmes: programmesFallback,
  about: aboutFallback,
  "partner-page-sections": partnerPageSectionsFallback,
  "custom-pages": customPagesFallback,
  "featured-projects": featuredProjectsFallback,
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
