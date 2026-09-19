/**
 * Marketing page data helpers — derives page content from canonical stores.
 * Pages import this instead of hardcoding arrays.
 */
import { projectsData, type CanonicalProject } from "@/data/projects";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { mediaContent } from "@/content";
import { withFallback } from "@/data/adapter";
import { apiFetch } from "@/lib/api-client";
import contactContent from "@/content/contact.json";
import landingContent from "@/content/landing.json";
import programmesContent from "@/content/programmes.json";

export type ProgrammeCard = {
  slug: string;
  title: string;
  description: string;
  projectCount: number;
  featuredProject?: CanonicalProject;
  thumbnail: string;
};

export type ProgrammeContent = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  body: string;
  highlight?: string;
  whatWeDo?: string;
  audience?: string;
  seoTitle: string;
  seoDescription: string;
  href: string;
  stats: Array<{ value: string; label: string }>;
  deliverables: Array<{ title: string; description: string }>;
  pillars: Array<{ title: string; body: string }>;
  process: Array<{ title: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  cta?: {
    label: string;
    href: string;
    hidden?: boolean;
    showOnMobile?: boolean;
    showOnDesktop?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    hidden?: boolean;
    showOnMobile?: boolean;
    showOnDesktop?: boolean;
  };
  visual: {
    hero: string;
    heroAlt: string;
    gallery: Array<{ src: string; alt: string }>;
  };
  featuredMedia?: {
    type?: "video" | "youtube" | "image" | "tiktok" | "auto";
    url: string;
    title?: string;
    caption?: string;
    poster?: string;
  };
};

type ContactContent = typeof contactContent;
type LandingContent = typeof landingContent;

const programmeItems = programmesContent.items as ProgrammeContent[];

export function getProgrammeContent(slug: string): ProgrammeContent | undefined {
  return programmeItems.find((programme) => programme.slug === slug);
}

export function getProgrammeContentList(): ProgrammeContent[] {
  return programmeItems;
}

export function getLandingContent(): LandingContent {
  return landingContent;
}

export function getContactContent(): ContactContent {
  return contactContent;
}

export function getContactIntent(intent?: string) {
  if (!intent) return undefined;
  const intents = programmesContent.contactIntents;
  return intents[intent as keyof typeof intents];
}

export function getMarketingNavigation() {
  return [
    { label: "Programmes", href: "/programmes" },
    ...getProgrammeContentList().map((programme) => ({
      label: programme.name.replace(/^BNS\s+/u, ""),
      href: programme.href,
    })),
    { label: "Contact", href: "/contact" },
  ];
}

export function getProgrammeCards(): ProgrammeCard[] {
  return getProgrammeContentList().map((programme) => {
    const projects = projectsData.getByProgramme(programme.slug);
    const featured = projects.find((p) => p.featured) || projects[0];
    return {
      slug: programme.slug,
      title: programme.name,
      description: programme.whatWeDo || programme.body,
      projectCount: projects.length,
      featuredProject: featured,
      thumbnail: featured?.thumbnail || programme.visual.hero,
    };
  });
}

export function getImpactStats() {
  const stats = studiosEvidenceData.getMissionStats();
  return {
    productionCount: stats.productionCount,
    partnerCount: stats.partnerCount,
    programmeCount: stats.programmeCount,
    bnsLedCount: stats.bnsLedCount,
  };
}

export function getFeaturedProjects(limit = 6): CanonicalProject[] {
  return projectsData.getFeatured().slice(0, limit);
}

export function getProjectsByProgramme(slug: string): CanonicalProject[] {
  return projectsData.getByProgramme(slug);
}

export function getStudioProjects() {
  return studiosEvidenceData.getStudioProjects();
}

export function getContentTypeCounts() {
  return studiosEvidenceData.getContentTypeCounts();
}

export function getAllOrganizations() {
  return studiosEvidenceData.getAllOrganizations();
}

export function getHeroImage(): string {
  return mediaContent.community.forumB;
}

export function getCommunityImages() {
  return mediaContent.community;
}

export function getMediaImages() {
  return mediaContent.media;
}

/**
 * Legacy API-backed marketing data stores.
 * Used by use-marketing hooks and old components.
 */
export const marketingData = {
  articlesMarquee: {
    fetch: (limit = 5) =>
      withFallback(
        "articles-marquee",
        async () => {
          const data = await apiFetch(`/content/articles/?limit=${limit}`) as { results?: unknown[] };
          return data?.results || [];
        },
        () => [],
      ),
  },
  campaigns: {
    fetch: () =>
      withFallback(
        "marketing-campaigns",
        async () => apiFetch("/marketing/campaigns/"),
        () => [],
      ),
  },
};
