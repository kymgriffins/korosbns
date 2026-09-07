import studiosEvidenceSeed from "@/data/fallbacks/studios-evidence.json";
import type { StudioContentType, StudioOrganizationType } from "@/constants/bns-studio-content";
import type { ProgrammeSlug } from "@/content";

export type { StudioContentType };

export type StudioDeliveryMode = "bns-led" | "co-produced" | "commissioned";

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
  videoUrlFr?: string;
  audioUrl?: string;
  platform?: "youtube" | "vimeo" | "cloudinary" | "spotify" | "local" | "other";
  aspectRatio?: "16/9" | "4/3" | "9/16" | "1/1";
  caption?: string;
  gallery?: Array<{
    url: string;
    caption?: string;
    position?: string;
  }>;
}

export interface StudioFormatChapter {
  title: string;
  note?: string;
}

export interface StudioFormatFinding {
  title: string;
  detail?: string;
}

export interface StudioFormatAgendaItem {
  title: string;
  detail?: string;
}

export interface StudioFormatVoice {
  quote: string;
  name: string;
  role?: string;
}

export interface StudioFormatCredit {
  role: string;
  name: string;
}

/**
 * Optional per-format editorial structures. When absent, pages derive
 * honest defaults from outputs / brief / impact (never invented facts).
 */
export interface StudioFormatDetails {
  chapters?: StudioFormatChapter[];
  findings?: StudioFormatFinding[];
  agenda?: StudioFormatAgendaItem[];
  voices?: StudioFormatVoice[];
  credits?: StudioFormatCredit[];
}

export interface StudioMultilingualLanguage {
  code: string;
  label: string;
  flag: string;
  videoId: string;
  duration: string;
  countries: string[];
  title: string;
}

export interface StudioMultilingualConfig {
  isMultilingual: boolean;
  defaultLang: string;
  languages: StudioMultilingualLanguage[];
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
  multilingual?: StudioMultilingualConfig;
  outputs: string[];
  impactEvidence: {
    primaryMetric?: string;
    secondaryMetric?: string;
    context: string;
    verificationOutcome?: string;
  };
  tags: string[];
  featured?: boolean;
  deliveryMode: StudioDeliveryMode;
  programmeSlug: ProgrammeSlug;
  formatDetails?: StudioFormatDetails;
}

export type StudioPartnerCorridor = {
  org: StudioPartnerOrg;
  projects: StudioProjectEvidence[];
  dominantMode: StudioDeliveryMode;
};

export type StudioProgrammeLane = {
  programmeSlug: ProgrammeSlug;
  projects: StudioProjectEvidence[];
};

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
  getBnsLedProjects: () =>
    STUDIO_PROJECTS.filter((p) => p.deliveryMode === "bns-led"),
  getPartnerCorridors: (): StudioPartnerCorridor[] => {
    const partnerProjects = STUDIO_PROJECTS.filter(
      (p) => p.deliveryMode !== "bns-led",
    );
    const byOrg = new Map<string, StudioProjectEvidence[]>();
    for (const project of partnerProjects) {
      const key = project.organization.slug;
      const list = byOrg.get(key) ?? [];
      list.push(project);
      byOrg.set(key, list);
    }
    return STUDIO_ORGANIZATIONS.filter((org) => byOrg.has(org.slug)).map(
      (org) => {
        const projects = byOrg.get(org.slug) ?? [];
        const commissioned = projects.filter(
          (p) => p.deliveryMode === "commissioned",
        ).length;
        const dominantMode: StudioDeliveryMode =
          commissioned >= projects.length / 2 ? "commissioned" : "co-produced";
        return { org, projects, dominantMode };
      },
    );
  },
  getProgrammeLanes: (): StudioProgrammeLane[] => {
    const slugs: ProgrammeSlug[] = [
      "connect",
      "mashinani",
      "wanahabari-lab",
      "studios",
    ];
    return slugs.map((programmeSlug) => ({
      programmeSlug,
      projects: STUDIO_PROJECTS.filter((p) => p.programmeSlug === programmeSlug),
    }));
  },
  getMissionStats: () => ({
    productionCount: STUDIO_PROJECTS.length,
    partnerCount: new Set(
      STUDIO_PROJECTS.filter((p) => p.deliveryMode !== "bns-led").map(
        (p) => p.organization.slug,
      ),
    ).size,
    programmeCount: new Set(STUDIO_PROJECTS.map((p) => p.programmeSlug)).size,
    bnsLedCount: STUDIO_PROJECTS.filter((p) => p.deliveryMode === "bns-led")
      .length,
  }),
};
