import type { StudioContentType } from "@/constants/bns-studio-content";
import type {
  StudioFormatDetails,
  StudioProjectEvidence,
} from "@/data/studios-evidence";

/**
 * BNS Studios content laws — strict narrative rules.
 *
 * Every project is judged as the narrative it is: a reel must behave
 * like a reel, a season like a season, a dossier like a dossier.
 * Laws validate the RESOLVED project (seed + CMS overlay + derived
 * defaults), so passing means the page is guaranteed renderable.
 */

export type StudioNarrativeKind =
  | "season"
  | "reel-feed"
  | "explainer"
  | "motion"
  | "film"
  | "dossier"
  | "convening"
  | "listening";

export const NARRATIVE_BY_CONTENT_TYPE: Record<StudioContentType, StudioNarrativeKind> = {
  "Podcast & Audio": "season",
  Animations: "motion",
  "Explainer Videos": "explainer",
  "Research Spotlights": "dossier",
  Documentaries: "film",
  "Social Media Series": "reel-feed",
  "Town Hall Design & Facilitation": "convening",
  "Community Listening Sessions": "listening",
};

export type LawViolation = {
  law: string;
  field: string;
  message: string;
};

export type ResolvedNarrative = {
  kind: StudioNarrativeKind;
  chapters: { title: string; note?: string }[];
  findings: { title: string; detail?: string }[];
  agenda: { title: string; detail?: string }[];
  voices: { quote: string; name: string; role?: string }[];
  credits: { role: string; name: string }[];
};

const PLACEHOLDER_RE = /(lorem|tbd|xxx|todo|fixme|coming soon)/i;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

function checkNoPlaceholders(
  value: unknown,
  field: string,
  violations: LawViolation[],
) {
  if (typeof value === "string" && PLACEHOLDER_RE.test(value)) {
    violations.push({
      law: "no-placeholders",
      field,
      message: `${field} contains placeholder text — real copy only.`,
    });
  }
}

/**
 * Resolve narrative structures: explicit formatDetails win, otherwise
 * derive honest defaults from outputs / brief / impact (never invented).
 */
export function resolveNarrative(
  project: Pick<
    StudioProjectEvidence,
    | "contentType"
    | "outputs"
    | "briefChallenge"
    | "description"
    | "organization"
    | "year"
    | "deliveryMode"
    | "impactEvidence"
    | "formatDetails"
  >,
): ResolvedNarrative {
  const kind = NARRATIVE_BY_CONTENT_TYPE[project.contentType];
  const details: StudioFormatDetails = project.formatDetails ?? {};

  const chapters =
    details.chapters?.length
      ? details.chapters
      : project.outputs.map((title) => ({ title }));
  const findings =
    details.findings?.length
      ? details.findings
      : project.outputs.slice(0, 4).map((title) => ({ title }));
  const agenda =
    details.agenda?.length
      ? details.agenda
      : project.outputs.map((title) => ({ title }));
  const voices: ResolvedNarrative["voices"] = details.voices?.length
    ? details.voices
    : [
        {
          quote: project.organization.description,
          name: project.organization.name,
          role: project.organization.sector,
        },
      ];
  const credits =
    details.credits?.length
      ? details.credits
      : [
          { role: "Partner", name: project.organization.name },
          { role: "Location", name: project.organization.location },
          { role: "Year", name: project.year },
          { role: "Delivery", name: project.deliveryMode.replace("-", " ") },
          { role: "Format", name: project.contentType },
        ];

  return { kind, chapters, findings, agenda, voices, credits };
}

export function validateStudioProject(
  project: StudioProjectEvidence,
): LawViolation[] {
  const violations: LawViolation[] = [];
  const fail = (law: string, field: string, message: string) =>
    violations.push({ law, field, message });

  // ── Universal laws ──────────────────────────────────────────────
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    fail("slug-kebab", "slug", "Slug must be kebab-case (a-z, 0-9, hyphens).");
  }
  if (project.title.trim().length < 8) {
    fail("title-length", "title", "Title must be at least 8 characters.");
  }
  if (project.briefChallenge.trim().length < 40) {
    fail("brief-substance", "briefChallenge", "Brief needs at least 40 characters of substance.");
  }
  if (project.whatWeProduced.trim().length < 20) {
    fail("production-substance", "whatWeProduced", "Production note needs at least 20 characters.");
  }
  if (project.description.trim().length < 80) {
    fail("description-substance", "description", "Description needs at least 80 characters.");
  }
  if (project.outputs.length < 1 || project.outputs.length > 8) {
    fail("outputs-count", "outputs", "Outputs must list 1–8 deliverables.");
  }
  project.outputs.forEach((output, i) => {
    if (output.trim().length < 4) {
      fail("outputs-substance", `outputs[${i}]`, "Each output needs at least 4 characters.");
    }
  });
  const poster = project.media.posterUrl ?? "";
  if (!poster.startsWith("/") && !poster.startsWith("http")) {
    fail("poster-path", "media.posterUrl", "Poster must be a local (/…) or absolute (http…) path.");
  }
  if (!/^\d{4}$/.test(project.year)) {
    fail("year-format", "year", "Year must be YYYY.");
  }
  if (isBlank(project.organization?.name)) {
    fail("partner-present", "organization.name", "Every project names its partner.");
  }
  if (project.tags.length < 1) {
    fail("tags-present", "tags", "At least one tag is required for discovery.");
  }
  if (project.impactEvidence.context.trim().length < 20) {
    fail("impact-context", "impactEvidence.context", "Impact context needs at least 20 characters.");
  }
  const allowedKeys = new Set(["chapters", "findings", "agenda", "voices", "credits"]);
  for (const key of Object.keys(project.formatDetails ?? {})) {
    if (!allowedKeys.has(key)) {
      fail("no-undeclared-structures", `formatDetails.${key}`, "Undeclared narrative structure — extend StudioFormatDetails first.");
    }
  }
  for (const [field, value] of [
    ["title", project.title],
    ["briefChallenge", project.briefChallenge],
    ["whatWeProduced", project.whatWeProduced],
    ["description", project.description],
    ...project.outputs.map((o, i) => [`outputs[${i}]`, o] as const),
  ] as const) {
    checkNoPlaceholders(value, field, violations);
  }

  // ── Narrative laws ──────────────────────────────────────────────
  const narrative = resolveNarrative(project);
  const nonEmpty = (items: { title: string }[]) =>
    items.filter((item) => item.title.trim().length >= 4);

  switch (narrative.kind) {
    case "season": {
      if (!project.media.audioUrl && nonEmpty(narrative.chapters).length < 2) {
        fail(
          "season-needs-episodes",
          "media.audioUrl | formatDetails.chapters",
          "A season needs episode audio or at least 2 named chapters.",
        );
      }
      break;
    }
    case "reel-feed": {
      if (nonEmpty(narrative.chapters).length < 2 && project.outputs.length < 2) {
        fail(
          "reel-needs-episodes",
          "outputs",
          "A reel-feed needs at least 2 episodes (outputs).",
        );
      }
      break;
    }
    case "explainer": {
      if (!project.media.videoUrl && isBlank(project.media.posterUrl)) {
        fail(
          "explainer-needs-watch",
          "media.videoUrl | media.posterUrl",
          "An explainer needs a video or a poster frame to open on.",
        );
      }
      if (nonEmpty(narrative.chapters).length < 2) {
        fail("explainer-needs-chapters", "outputs", "An explainer needs at least 2 chapters.");
      }
      break;
    }
    case "motion": {
      if (project.outputs.length < 2) {
        fail("motion-needs-deliverables", "outputs", "A motion piece needs at least 2 deliverables (cuts, frames, tracks).");
      }
      break;
    }
    case "film": {
      if (project.description.trim().length < 120) {
        fail("film-needs-synopsis", "description", "A film needs a synopsis of at least 120 characters.");
      }
      if (narrative.credits.length < 3) {
        fail("film-needs-credits", "formatDetails.credits", "A film needs at least 3 credits.");
      }
      break;
    }
    case "dossier": {
      if (nonEmpty(narrative.findings).length < 3) {
        fail("dossier-needs-findings", "formatDetails.findings", "A dossier needs at least 3 key findings.");
      }
      if (
        isBlank(project.impactEvidence.verificationOutcome) &&
        project.impactEvidence.context.trim().length < 40
      ) {
        fail(
          "dossier-needs-proof",
          "impactEvidence",
          "A dossier needs a verification note or 40+ characters of impact context.",
        );
      }
      break;
    }
    case "convening": {
      if (nonEmpty(narrative.agenda).length < 3) {
        fail("convening-needs-agenda", "formatDetails.agenda", "A convening needs at least 3 agenda sessions.");
      }
      if (isBlank(project.organization.location)) {
        fail("convening-needs-place", "organization.location", "A convening must name where the room met.");
      }
      break;
    }
    case "listening": {
      if (
        narrative.voices.length < 1 ||
        narrative.voices.some((v) => isBlank(v.quote) || isBlank(v.name))
      ) {
        fail("listening-needs-voices", "formatDetails.voices", "Listening needs at least 1 named real voice.");
      }
      if (nonEmpty(narrative.findings).length < 2) {
        fail("listening-needs-heard", "formatDetails.findings", "Listening needs at least 2 documented hearings.");
      }
      break;
    }
  }

  return violations;
}

export function studioProjectComplies(project: StudioProjectEvidence): boolean {
  return validateStudioProject(project).length === 0;
}
