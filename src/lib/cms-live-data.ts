import { getJsonFromR2 } from "@/lib/r2-storage";
import landingFallback from "@/content/landing.json";
import programmesFallback from "@/content/programmes.json";
import aboutFallback from "@/content/about.json";
import partnerPageSectionsFallback from "@/content/partner-page-sections.json";
import customPagesFallback from "@/content/custom-pages.json";
import featuredProjectsFallback from "@/data/fallbacks/featured-projects.json";
import navigationFallback from "@/content/navigation.json";
import designTokensFallback from "@/content/design-tokens.json";
import faqFallback from "@/content/faq.json";
import storiesFallback from "@/content/stories.json";
import impactFallback from "@/content/impact.json";
import consortiumFallback from "@/content/consortium.json";
import careersFallback from "@/content/careers.json";
import legalFallback from "@/content/legal.json";
import teamInitiativesFallback from "@/content/team-initiatives.json";
import landingHeroFallback from "@/content/landing-hero.json";
import landingSectionsFallback from "@/content/landing-sections.json";
import programmeReelsFallback from "@/content/programme-reels.json";
import studiosEvidenceFallback from "@/data/fallbacks/studios-evidence.json";
import bnsStudioFallback from "@/content/bns-studio.json";
import type { CmsCollectionSlug } from "@/lib/headless-cms";

export type LandingContent = typeof landingFallback;
export type ProgrammesContent = typeof programmesFallback;
export type AboutContent = typeof aboutFallback;
export type PartnerPageSectionsContent = typeof partnerPageSectionsFallback;
export type CustomPagesContent = typeof customPagesFallback;
export type FeaturedProjectsContent = typeof featuredProjectsFallback;
export type NavigationContent = typeof navigationFallback;
export type DesignTokensContent = typeof designTokensFallback;
export type FaqContent = typeof faqFallback;
export type StoriesContent = typeof storiesFallback;
export type ImpactContent = typeof impactFallback;
export type ConsortiumContent = typeof consortiumFallback;
export type CareersContent = typeof careersFallback;
export type LegalContent = typeof legalFallback;
export type TeamInitiativesContent = typeof teamInitiativesFallback;
export type LandingHeroContent = typeof landingHeroFallback;
export type LandingSectionsContent = typeof landingSectionsFallback;
export type ProgrammeReelsContent = typeof programmeReelsFallback;
export type StudiosEvidenceContent = typeof studiosEvidenceFallback;
export type BnsStudioContent = typeof bnsStudioFallback;

const FALLBACK_MAP: Partial<Record<CmsCollectionSlug, unknown>> = {
  landing: landingFallback,
  programmes: programmesFallback,
  about: aboutFallback,
  "partner-page-sections": partnerPageSectionsFallback,
  "custom-pages": customPagesFallback,
  "featured-projects": featuredProjectsFallback,
  navigation: navigationFallback,
  "design-tokens": designTokensFallback,
  faq: faqFallback,
  stories: storiesFallback,
  impact: impactFallback,
  consortium: consortiumFallback,
  careers: careersFallback,
  legal: legalFallback,
  "team-initiatives": teamInitiativesFallback,
  "landing-hero": landingHeroFallback,
  "landing-sections": landingSectionsFallback,
  "programme-reels": programmeReelsFallback,
  "studios-evidence": studiosEvidenceFallback,
  "bns-studio": bnsStudioFallback,
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
 * Loads live programmes hub + programme dossier content from R2 or fallback.
 */
export async function getLiveProgrammesContent(): Promise<ProgrammesContent> {
  return getLiveCmsCollection<ProgrammesContent>("programmes", programmesFallback);
}

/**
 * Loads live about-page content from R2 or fallback.
 */
export async function getLiveAboutContent(): Promise<AboutContent> {
  return getLiveCmsCollection<AboutContent>("about", aboutFallback);
}

/**
 * Loads live custom pages from R2 or fallback.
 */
export async function getLiveCustomPages(): Promise<CustomPagesContent> {
  return getLiveCmsCollection<CustomPagesContent>("custom-pages", customPagesFallback);
}

/** Resolve a programme block from live (or fallback) programmes JSON. */
export function findProgrammeInContent(
  content: ProgrammesContent,
  slug: string,
): ProgrammesContent["items"][number] | undefined {
  const key = slug.trim().toLowerCase();
  const items = Array.isArray(content.items) ? content.items : [];
  return items.find(
    (item) =>
      String((item as { slug?: string }).slug ?? "").toLowerCase() === key ||
      String((item as { id?: string }).id ?? "").toLowerCase() === key,
  );
}

/** Civic programmes only (excludes studios redirect stub). */
export function civicProgrammesFromContent(
  content: ProgrammesContent,
): ProgrammesContent["items"] {
  const items = Array.isArray(content.items) ? content.items : [];
  return items.filter(
    (item) => String((item as { slug?: string }).slug ?? "") !== "studios",
  );
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

/**
 * Loads live FAQ & help center content from R2 or fallback.
 */
export async function getLiveFaqContent(): Promise<FaqContent> {
  return getLiveCmsCollection<FaqContent>("faq", faqFallback);
}

/**
 * Loads live budget stories content from R2 or fallback.
 */
export async function getLiveStoriesContent(): Promise<StoriesContent> {
  return getLiveCmsCollection<StoriesContent>("stories", storiesFallback);
}

/**
 * Loads live impact metrics & testimonials from R2 or fallback.
 */
export async function getLiveImpactContent(): Promise<ImpactContent> {
  return getLiveCmsCollection<ImpactContent>("impact", impactFallback);
}

/**
 * Loads live consortium partners content from R2 or fallback.
 */
export async function getLiveConsortiumContent(): Promise<ConsortiumContent> {
  return getLiveCmsCollection<ConsortiumContent>("consortium", consortiumFallback);
}

/**
 * Loads live careers & open roles content from R2 or fallback.
 */
export async function getLiveCareersContent(): Promise<CareersContent> {
  return getLiveCmsCollection<CareersContent>("careers", careersFallback);
}

/**
 * Loads live legal pages content from R2 or fallback.
 */
export async function getLiveLegalContent(): Promise<LegalContent> {
  return getLiveCmsCollection<LegalContent>("legal", legalFallback);
}

/**
 * Loads live team member initiatives from R2 or fallback.
 */
export async function getLiveTeamInitiatives(): Promise<TeamInitiativesContent> {
  return getLiveCmsCollection<TeamInitiativesContent>("team-initiatives", teamInitiativesFallback);
}

/**
 * Loads live landing hero section from R2 or fallback.
 */
export async function getLiveLandingHero(): Promise<LandingHeroContent> {
  return getLiveCmsCollection<LandingHeroContent>("landing-hero", landingHeroFallback);
}

/**
 * Loads live landing page sections from R2 or fallback.
 */
export async function getLiveLandingSections(): Promise<LandingSectionsContent> {
  return getLiveCmsCollection<LandingSectionsContent>("landing-sections", landingSectionsFallback);
}

/**
 * Loads live programme reels from R2 or fallback.
 */
export async function getLiveProgrammeReels(): Promise<ProgrammeReelsContent> {
  return getLiveCmsCollection<ProgrammeReelsContent>("programme-reels", programmeReelsFallback);
}

/**
 * Loads live studios evidence projects from R2 or fallback.
 */
export async function getLiveStudiosEvidence(): Promise<StudiosEvidenceContent> {
  return getLiveCmsCollection<StudiosEvidenceContent>("studios-evidence", studiosEvidenceFallback);
}

/**
 * Loads live BNS Studio page content from R2 or fallback.
 */
export async function getLiveBnsStudioContent(): Promise<BnsStudioContent> {
  return getLiveCmsCollection<BnsStudioContent>("bns-studio", bnsStudioFallback);
}
