import type {
  StudioFormatDetails,
  StudioProjectEvidence,
} from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { validateStudioProject } from "@/lib/studio-content-laws";
import { withFallback } from "@/data/adapter";

/**
 * Studio narratives CMS — headless draft overlays.
 *
 * Editors reshape each project's narrative (chapters, findings, agenda,
 * voices, credits, copy) under strict content laws. Drafts persist to
 * localStorage; the storefront merges them at runtime. "Publish" without
 * a backend means exporting seed-compatible JSON to bake into the repo.
 */

export type StudioNarrativeDraft = {
  slug: string;
  updatedAt?: string;
  title?: string;
  subtitle?: string;
  briefChallenge?: string;
  whatWeProduced?: string;
  description?: string;
  outputs?: string[];
  tags?: string[];
  primaryMetric?: string;
  secondaryMetric?: string;
  impactContext?: string;
  verificationOutcome?: string;
  formatDetails?: StudioFormatDetails;
};

const STORAGE_KEY = "bns-studio-narrative-drafts-v1";

function readStorage(): Record<string, StudioNarrativeDraft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StudioNarrativeDraft>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(drafts: Record<string, StudioNarrativeDraft>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    /* private mode — drafts stay in memory */
  }
}

let _drafts: Record<string, StudioNarrativeDraft> | null = null;

function drafts(): Record<string, StudioNarrativeDraft> {
  if (!_drafts) _drafts = readStorage();
  return _drafts;
}

/** Merge a draft over its seed project. Pure — safe on server + client. */
export function applyDraftToProject(
  project: StudioProjectEvidence,
  draft: StudioNarrativeDraft,
): StudioProjectEvidence {
  return {
    ...project,
    title: draft.title ?? project.title,
    subtitle: draft.subtitle ?? project.subtitle,
    briefChallenge: draft.briefChallenge ?? project.briefChallenge,
    whatWeProduced: draft.whatWeProduced ?? project.whatWeProduced,
    description: draft.description ?? project.description,
    outputs: draft.outputs ?? project.outputs,
    tags: draft.tags ?? project.tags,
    impactEvidence: {
      ...project.impactEvidence,
      primaryMetric: draft.primaryMetric ?? project.impactEvidence.primaryMetric,
      secondaryMetric:
        draft.secondaryMetric ?? project.impactEvidence.secondaryMetric,
      context: draft.impactContext ?? project.impactEvidence.context,
      verificationOutcome:
        draft.verificationOutcome ??
        project.impactEvidence.verificationOutcome,
    },
    formatDetails: draft.formatDetails ?? project.formatDetails,
  };
}

/** Resolve a project by slug with any CMS draft merged in. */
export function resolveCmsProject(slug: string): StudioProjectEvidence | undefined {
  const base = studiosEvidenceData.getProjectBySlug(slug);
  if (!base) return undefined;
  const draft = drafts()[slug];
  return draft ? applyDraftToProject(base, draft) : base;
}

/** All storefront projects with drafts merged — for indexes and lanes. */
export function resolveAllCmsProjects(): StudioProjectEvidence[] {
  const all = drafts();
  return studiosEvidenceData
    .getAllProjects()
    .map((project) => (all[project.slug] ? applyDraftToProject(project, all[project.slug]) : project));
}

export const studioCmsData = {
  drafts: {
    get: (): Record<string, StudioNarrativeDraft> => ({ ...drafts() }),
    set: (next: Record<string, StudioNarrativeDraft>) => {
      _drafts = { ...next };
      writeStorage(_drafts);
    },
    fetch: async (): Promise<Record<string, StudioNarrativeDraft>> =>
      withFallback("studio-cms", async () => ({ ...drafts() }), () => ({ ...drafts() })),
    getBySlug: (slug: string): StudioNarrativeDraft | undefined => drafts()[slug],
    save: (draft: StudioNarrativeDraft): StudioNarrativeDraft => {
      const next = {
        ...drafts(),
        [draft.slug]: { ...draft, updatedAt: new Date().toISOString() },
      };
      _drafts = next;
      writeStorage(next);
      return next[draft.slug];
    },
    discard: (slug: string) => {
      const next = { ...drafts() };
      delete next[slug];
      _drafts = next;
      writeStorage(next);
    },
    clear: () => {
      _drafts = {};
      writeStorage({});
    },
  },
  laws: {
    /** Validate the resolved (seed + draft) project against strict laws. */
    validate: (slug: string) => {
      const resolved = resolveCmsProject(slug);
      if (!resolved) {
        return [{ law: "project-exists", field: "slug", message: "Unknown project slug." }];
      }
      return validateStudioProject(resolved);
    },
  },
  io: {
    /** Seed-compatible JSON for baking drafts into studios-evidence.json. */
    exportSeedPatch: (): string => {
      const all = drafts();
      const patch = Object.values(all).map((draft) => ({
        slug: draft.slug,
        ...(draft.title !== undefined ? { title: draft.title } : {}),
        ...(draft.subtitle !== undefined ? { subtitle: draft.subtitle } : {}),
        ...(draft.briefChallenge !== undefined ? { briefChallenge: draft.briefChallenge } : {}),
        ...(draft.whatWeProduced !== undefined ? { whatWeProduced: draft.whatWeProduced } : {}),
        ...(draft.description !== undefined ? { description: draft.description } : {}),
        ...(draft.outputs !== undefined ? { outputs: draft.outputs } : {}),
        ...(draft.tags !== undefined ? { tags: draft.tags } : {}),
        ...(draft.primaryMetric !== undefined ||
        draft.secondaryMetric !== undefined ||
        draft.impactContext !== undefined ||
        draft.verificationOutcome !== undefined
          ? {
              impactEvidence: {
                ...(draft.primaryMetric !== undefined ? { primaryMetric: draft.primaryMetric } : {}),
                ...(draft.secondaryMetric !== undefined ? { secondaryMetric: draft.secondaryMetric } : {}),
                ...(draft.impactContext !== undefined ? { context: draft.impactContext } : {}),
                ...(draft.verificationOutcome !== undefined
                  ? { verificationOutcome: draft.verificationOutcome }
                  : {}),
              },
            }
          : {}),
        ...(draft.formatDetails !== undefined ? { formatDetails: draft.formatDetails } : {}),
      }));
      return JSON.stringify(patch, null, 2);
    },
  },
};
