import { buildApiUrl } from "@/lib/api-url";
import { SERVER_CONTENT_REVALIDATE_SECONDS } from "@/lib/fetch-policy";

export type LearningEditionSummary = {
  slug: string;
  fiscal_year: number | null;
  title: string;
  module_code?: string;
};

export type LearningUnitSummary = {
  slug: string;
  title: string;
  abbreviation?: string;
  description?: string;
  document_family?: string;
  jurisdiction?: string;
  statutory_reference?: string;
  external_source_url?: string;
  editions: LearningEditionSummary[];
};

export type LearningLesson = {
  id: string;
  title: string;
  section_label?: string;
  order: number;
  kind: string;
  estimated_minutes?: number;
  article_slug?: string;
  article_id?: string;
  trivia_id?: string;
};

export type LearningEditionDetail = {
  id: string;
  slug: string;
  title: string;
  fiscal_year: number | null;
  module_code?: string;
  credits?: string;
  summary?: string;
  county_code?: string | null;
  sector?: string | null;
  external_source_url?: string | null;
  unit?: {
    slug: string;
    title: string;
    abbreviation?: string;
    jurisdiction?: string;
    document_family?: string;
  };
  lessons?: LearningLesson[];
  media?: Array<{
    order: number;
    role: string;
    title?: string;
    url?: string;
    youtube_video_id?: string;
  }>;
  related_documents?: Array<{
    slug: string;
    title: string;
    abbreviation?: string;
    relation: string;
    label?: string;
  }>;
};

export async function fetchLearningUnitsServer(): Promise<LearningUnitSummary[]> {
  const response = await fetch(buildApiUrl("/content/units/"), {
    next: { revalidate: SERVER_CONTENT_REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    const detail = `Could not load learning units (${response.status}).`;
    console.error(`[LearningUnits] ${detail}`, { status: response.status, statusText: response.statusText });
    throw new Error(detail);
  }
  const data = (await response.json()) as { results?: LearningUnitSummary[] };
  return data.results ?? [];
}

export async function fetchLearningEditionServer(
  slug: string
): Promise<LearningEditionDetail | null> {
  const response = await fetch(buildApiUrl(`/content/courses/${slug}/`), {
    next: { revalidate: SERVER_CONTENT_REVALIDATE_SECONDS },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = `Could not load edition (${response.status}).`;
    console.error(`[LearningUnits] ${detail}`, { slug, status: response.status, statusText: response.statusText });
    throw new Error(detail);
  }
  return (await response.json()) as LearningEditionDetail;
}

export function editionPath(unitSlug: string, fiscalYear: number | string): string {
  return `/learn/units/${unitSlug}/${fiscalYear}`;
}

export async function resolveEditionSlugServer(
  unitSlug: string,
  year: string | number,
): Promise<string | null> {
  const fiscalYear = typeof year === "string" ? parseInt(year, 10) : year;
  if (!Number.isFinite(fiscalYear)) return null;

  const units = await fetchLearningUnitsServer();
  const unit = units.find((u) => u.slug === unitSlug);
  if (!unit) return null;

  const edition = unit.editions.find((e) => e.fiscal_year === fiscalYear);
  return edition?.slug ?? null;
}

/** Resolve unit + fiscal year from the units list, then load course detail by edition slug. */
export async function fetchLearningEditionByUnitYearServer(
  unitSlug: string,
  year: string | number,
): Promise<LearningEditionDetail | null> {
  const editionSlug = await resolveEditionSlugServer(unitSlug, year);
  if (!editionSlug) return null;
  return fetchLearningEditionServer(editionSlug);
}
