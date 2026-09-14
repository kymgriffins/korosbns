import studiosEvidenceSeed from "@/data/fallbacks/studios-evidence.json";
import type { StudioContentType, StudioOrganizationType } from "@/constants/bns-studio-content";
import type { ProgrammeSlug } from "@/content";
import {
  resolveOrganizationId,
  resolveProjectId,
} from "@/lib/programme-project-ids";

export type { StudioContentType };

export type StudioDeliveryMode = "bns-led" | "co-produced" | "commissioned";

export type ProjectFormat =
  | "studio-production"
  | "field-report"
  | "investigation"
  | "explainer"
  | "podcast"
  | "event";

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
  /** Global visibility toggle — false hides from /work, landing, programme grids, search */
  visible?: boolean;
  /** Production format — replaces studios-as-programme. Studio page queries this. */
  format?: ProjectFormat;
  /** Sort order within programme — lower numbers appear first */
  order?: number;
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
      const organization = orgById.get(
        resolveOrganizationId(project.organizationId),
      );
      if (!organization) return null;
      const { organizationId: _orgId, ...rest } = project;
      // Canonical rule: id mirrors the human-readable slug.
      const canonicalId = resolveProjectId(rest.slug || rest.id);
      return { ...rest, id: canonicalId, slug: canonicalId, organization };
    })
    .filter((project): project is StudioProjectEvidence => project !== null);
}

const seed = studiosEvidenceSeed as StudiosEvidenceSeed;
const STUDIO_ORGANIZATIONS: StudioPartnerOrg[] = seed.organizations.map(
  (org) => ({
    ...org,
    id: resolveOrganizationId(org.slug || org.id),
  }),
);
const STUDIO_PROJECTS: StudioProjectEvidence[] = hydrateProjects(
  seed,
  STUDIO_ORGANIZATIONS,
);

export { STUDIO_ORGANIZATIONS, STUDIO_PROJECTS };

export const studiosEvidenceData = {
  getAllProjects: () => STUDIO_PROJECTS.filter((p) => p.visible !== false),
  getFeaturedProjects: () => STUDIO_PROJECTS.filter((p) => p.featured && p.visible !== false),
  getProjectBySlug: (slug: string) => {
    const canonical = resolveProjectId(slug);
    return STUDIO_PROJECTS.find(
      (p) => p.slug === canonical || p.id === canonical,
    );
  },
  getProjectById: (id: string) => {
    const canonical = resolveProjectId(id);
    return STUDIO_PROJECTS.find(
      (p) => p.id === canonical || p.slug === canonical,
    );
  },
  getProjectsByContentType: (contentType: StudioContentType) =>
    STUDIO_PROJECTS.filter((p) => p.contentType === contentType && p.visible !== false),
  getProjectsByProgramme: (programmeSlug: ProgrammeSlug) =>
    STUDIO_PROJECTS.filter((p) => p.programmeSlug === programmeSlug && p.visible !== false),
  getProjectsByOrgSlug: (orgSlug: string) =>
    STUDIO_PROJECTS.filter(
      (p) => p.organization.slug === resolveOrganizationId(orgSlug) && p.visible !== false,
    ),
  getProjectsBySector: (sector: StudioSectorType) =>
    STUDIO_PROJECTS.filter((p) => p.organization.sector === sector && p.visible !== false),
  getAllOrganizations: () => STUDIO_ORGANIZATIONS,
  getOrganizationsWithProjects: () => {
    const slugsWithWork = new Set(
      STUDIO_PROJECTS.filter((p) => p.visible !== false).map((p) => p.organization.slug),
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
    const canonical = resolveProjectId(currentProjectId);
    const current = STUDIO_PROJECTS.find(
      (p) => p.id === canonical || p.slug === canonical,
    );
    const visible = STUDIO_PROJECTS.filter((p) => p.visible !== false);
    if (!current) return visible.slice(0, limit);
    return visible.filter(
      (p) =>
        p.id !== current.id &&
        (p.contentType === current.contentType ||
          p.organization.slug === current.organization.slug),
    ).slice(0, limit);
  },
  getBnsLedProjects: () =>
    STUDIO_PROJECTS.filter((p) => p.deliveryMode === "bns-led" && p.visible !== false),
  getPartnerCorridors: (): StudioPartnerCorridor[] => {
    const partnerProjects = STUDIO_PROJECTS.filter(
      (p) => p.deliveryMode !== "bns-led" && p.visible !== false,
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
    ];
    return slugs.map((programmeSlug) => ({
      programmeSlug,
      projects: STUDIO_PROJECTS.filter((p) => p.programmeSlug === programmeSlug && p.visible !== false),
    }));
  },
  getProjectsByFormat: (format: ProjectFormat) =>
    STUDIO_PROJECTS.filter((p) => p.format === format && p.visible !== false),
  getStudioProjects: () =>
    STUDIO_PROJECTS.filter((p) => p.format === "studio-production" && p.visible !== false),
  getMissionStats: () => {
    const visible = STUDIO_PROJECTS.filter((p) => p.visible !== false);
    return {
      productionCount: visible.length,
      partnerCount: new Set(
        visible.filter((p) => p.deliveryMode !== "bns-led").map(
          (p) => p.organization.slug,
        ),
      ).size,
      programmeCount: new Set(visible.map((p) => p.programmeSlug)).size,
      bnsLedCount: visible.filter((p) => p.deliveryMode === "bns-led")
        .length,
    };
  },
};
