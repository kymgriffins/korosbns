/**
 * Stable, slug-like identifiers for programmes portfolio projects.
 * Canonical rule: project `id` === human-readable `slug` (title-derived, unique).
 */

const LEGACY_PROJECT_ID_ALIASES: Record<string, string> = {
  "proj-001": "budget-sasa-ni-delivery-explainer",
  "proj-002": "budget-ndio-story-podcast",
  // Historical IDs that never landed as separate dossiers — resolve to closest live evidence pages
  "proj-003": "wajir-community-listening",
  "nakuru-citizen-baraza": "wajir-community-listening",
  "proj-004": "budget-sasa-ni-delivery-explainer",
  "finance-bill-motion-explainer": "budget-sasa-ni-delivery-explainer",
  "proj-005": "illicit-financial-flows-benin-cabo-verde",
  "mashinani-field-documentary": "illicit-financial-flows-benin-cabo-verde",
  "proj-006": "cra-formula-research-spotlight",
  "proj-007": "budget-tiktok-vertical-series",
  "proj-008": "wajir-community-listening",
  "proj-009": "bps-2026-reading-coverage",
  "proj-010": "stakeholder-forum-production",
  "proj-cabri-digital-pfm": "cabri-digital-pfm-reforms",
  "proj-hofw-iff": "illicit-financial-flows-benin-cabo-verde",
  "proj-terra": "project-terra",
  terra: "project-terra",
};

const LEGACY_ORG_ID_ALIASES: Record<string, string> = {
  "org-tisa": "tisa-kenya",
  "org-hofw": "house-of-fiscal-wisdom",
  "org-cfs": "committee-on-fiscal-studies",
  "org-nakuru": "nakuru-county",
  "org-treasury": "national-treasury",
  "org-youth-network": "bns-youth-trackers",
  "org-cabri": "cabri",
  "org-afrodad": "afrodad",
};

/** Derive a URL-safe slug from a project or organisation title. */
export function slugifyProjectId(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Ensure uniqueness within an existing set by appending -2, -3, … */
export function ensureUniqueSlug(
  base: string,
  taken: ReadonlySet<string>,
): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Resolve any historical project id/alias to the canonical slug id. */
export function resolveProjectId(idOrSlug: string): string {
  const key = idOrSlug.trim().toLowerCase();
  return LEGACY_PROJECT_ID_ALIASES[key] ?? key;
}

/** Resolve any historical organisation id/alias to the canonical slug id. */
export function resolveOrganizationId(idOrSlug: string): string {
  const key = idOrSlug.trim().toLowerCase();
  return LEGACY_ORG_ID_ALIASES[key] ?? key;
}

export { LEGACY_PROJECT_ID_ALIASES, LEGACY_ORG_ID_ALIASES };
