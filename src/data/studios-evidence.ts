import studiosEvidenceSeed from "@/data/fallbacks/studios-evidence.json";
import type { StudioContentType, StudioOrganizationType } from "@/constants/bns-studio-content";

export type { StudioContentType };

export type StudioSectorType = StudioOrganizationType;

export interface StudioPartnerOrg {
  id: string;
  slug: string;
  name: string;
  sector: StudioSectorType;
  description: string;
  location: string;
  logoText: string;
}

export interface StudioEvidenceMedia {
  type: "video" | "audio" | "image" | "animation";
  posterUrl: string;
  posterPosition?: string;
  videoUrl?: string;
  audioUrl?: string;
  platform?: "youtube" | "vimeo" | "cloudinary" | "spotify" | "local" | "other";
  aspectRatio?: "16/9" | "4/3" | "9/16" | "1/1";
  caption?: string;
}

export interface StudioProjectEvidence {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  contentType: StudioContentType;
  organization: StudioPartnerOrg;
  date: string;
  year: string;
  briefChallenge: string;
  whatWeProduced: string;
  description: string;
  media: StudioEvidenceMedia;
  outputs: string[];
  impactEvidence: {
    primaryMetric?: string;
    secondaryMetric?: string;
    context: string;
    verificationOutcome?: string;
  };
  tags: string[];
  featured?: boolean;
}

type StudiosEvidenceSeed = {
  organizations: StudioPartnerOrg[];
  projects: Array<
    Omit<StudioProjectEvidence, "organization"> & { organizationId: string }
  >;
};

function hydrateProjects(
  seed: StudiosEvidenceSeed,
  organizations: StudioPartnerOrg[],
): StudioProjectEvidence[] {
  const orgById = new Map(organizations.map((org) => [org.id, org]));

  return seed.projects
    .map((project) => {
      const organization = orgById.get(project.organizationId);
      if (!organization) return null;
      const { organizationId: _orgId, ...rest } = project;
      return { ...rest, organization };
    })
    .filter((project): project is StudioProjectEvidence => project !== null);
}

const seed = studiosEvidenceSeed as StudiosEvidenceSeed;
const STUDIO_ORGANIZATIONS: StudioPartnerOrg[] = seed.organizations;
const STUDIO_PROJECTS: StudioProjectEvidence[] = hydrateProjects(
  seed,
  STUDIO_ORGANIZATIONS,
);

export { STUDIO_ORGANIZATIONS, STUDIO_PROJECTS };

export const studiosEvidenceData = {
  getAllProjects: () => STUDIO_PROJECTS,
  getFeaturedProjects: () => STUDIO_PROJECTS.filter((p) => p.featured),
  getProjectBySlug: (slug: string) =>
    STUDIO_PROJECTS.find((p) => p.slug === slug),
  getProjectsByContentType: (contentType: StudioContentType) =>
    STUDIO_PROJECTS.filter((p) => p.contentType === contentType),
  getProjectsByOrgSlug: (orgSlug: string) =>
    STUDIO_PROJECTS.filter((p) => p.organization.slug === orgSlug),
  getProjectsBySector: (sector: StudioSectorType) =>
    STUDIO_PROJECTS.filter((p) => p.organization.sector === sector),
  getAllOrganizations: () => STUDIO_ORGANIZATIONS,
  getOrganizationsWithProjects: () => {
    const slugsWithWork = new Set(
      STUDIO_PROJECTS.map((p) => p.organization.slug),
    );
    return STUDIO_ORGANIZATIONS.filter((org) => slugsWithWork.has(org.slug));
  },
  getContentTypeCounts: () => {
    const counts = {} as Record<StudioContentType, number>;
    for (const project of STUDIO_PROJECTS) {
      counts[project.contentType] = (counts[project.contentType] ?? 0) + 1;
    }
    return counts;
  },
  getRelatedProjects: (currentProjectId: string, limit = 3) => {
    const current = STUDIO_PROJECTS.find((p) => p.id === currentProjectId);
    if (!current) return STUDIO_PROJECTS.slice(0, limit);
    return STUDIO_PROJECTS.filter(
      (p) =>
        p.id !== currentProjectId &&
        (p.contentType === current.contentType ||
          p.organization.slug === current.organization.slug),
    ).slice(0, limit);
  },
};
