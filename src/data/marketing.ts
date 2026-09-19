/**
 * Marketing page data helpers — derives page content from canonical stores.
 * Pages import this instead of hardcoding arrays.
 */
import { projectsData, type CanonicalProject } from "@/data/projects";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { mediaContent } from "@/content";
import { withFallback } from "@/data/adapter";
import { apiFetch } from "@/lib/api-client";

export type ProgrammeCard = {
  slug: string;
  title: string;
  description: string;
  projectCount: number;
  featuredProject?: CanonicalProject;
  thumbnail: string;
};

const PROGRAMME_META: Record<string, { title: string; description: string }> = {
  connect: {
    title: "BNS Connect",
    description:
      "National budget intelligence. Tracking debt, appropriations, and parliamentary fiscal legislation.",
  },
  mashinani: {
    title: "BNS Mashinani",
    description:
      "County delivery evidence. Following funds past treasury accounts to verify clinics, boreholes, and roads.",
  },
  "wanahabari-lab": {
    title: "Wanahabari Lab",
    description:
      "Investigative journalism lab. Equipping grassroots reporters with forensic data toolkits.",
  },
  studios: {
    title: "BNS Studio",
    description:
      "Evidence production. Translating audit spreadsheets into compelling cinematic investigations.",
  },
};

export function getProgrammeCards(): ProgrammeCard[] {
  const slugs = ["connect", "mashinani", "wanahabari-lab", "studios"];
  return slugs.map((slug) => {
    const projects = projectsData.getByProgramme(slug);
    const featured = projects.find((p) => p.featured) || projects[0];
    const meta = PROGRAMME_META[slug] || { title: slug, description: "" };
    return {
      slug,
      title: meta.title,
      description: meta.description,
      projectCount: projects.length,
      featuredProject: featured,
      thumbnail: featured?.thumbnail || mediaContent.community.forumA,
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
