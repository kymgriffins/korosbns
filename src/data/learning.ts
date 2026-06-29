import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import type { LearningEditionDetail } from "@/lib/learning-units";
import { learnHubApi } from "@/lib/learn-hub";
import { buildApiUrl } from "@/lib/api-url";
import { withFallback } from "@/data/adapter";

export type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse };

const DEFAULT_MODULES: CivicModule[] = [];

const DEFAULT_SUMMARY: LearnHubSummary = {
  counts: {},
  trending: [],
};

let _modules: CivicModule[] = [...DEFAULT_MODULES];
let _summary: LearnHubSummary = { ...DEFAULT_SUMMARY };

export const learningData = {
  modules: {
    get: () => _modules,
    set: (items: CivicModule[]) => { _modules = items; },
    fetch: () =>
      withFallback(
        "learning",
        () => learnHubApi.civicModules(),
        () => ({ results: _modules }),
      ).then((r) => r.results ?? []),
    fetchBySlug: (slug: string) =>
      withFallback(
        "learning",
        () => learnHubApi.civicModule(slug),
        () => _modules.find((m) => m.slug === slug) ?? null,
      ),
  },
  summary: {
    get: () => _summary,
    set: (s: LearnHubSummary) => { _summary = s; },
    fetch: () =>
      withFallback(
        "learning",
        () => learnHubApi.summary(),
        () => DEFAULT_SUMMARY,
      ),
  },
  profile: {
    fetch: () =>
      withFallback(
        "learning",
        () => learnHubApi.profile(),
        () => ({ gamification: null, progress: [] }),
      ),
  },
  authors: {
    fetch: () =>
      withFallback(
        "learning",
        () => learnHubApi.authors(),
        () => ({ count: 0, results: [] }),
      ).then((r) => r.results ?? []),
    fetchBySlug: (slug: string) =>
      withFallback(
        "learning",
        () => learnHubApi.author(slug),
        () => null,
      ),
  },
  courses: {
    fetchBySlug: (slug: string) =>
      withFallback(
        "learning",
        () => fetch(buildApiUrl(`/content/courses/${slug}/`)).then((r) => {
          if (r.status === 404) return null;
          if (!r.ok) throw new Error(`Failed to load course (${r.status})`);
          return r.json() as Promise<LearningEditionDetail>;
        }),
        () => null,
      ),
    fetchByUnitYear: (unitSlug: string, year: string) =>
      withFallback(
        "learning",
        async () => {
          const unitsRes = await fetch(buildApiUrl("/content/units/"));
          if (!unitsRes.ok) throw new Error(`Failed to load units (${unitsRes.status})`);
          const unitsData = await unitsRes.json() as { results?: Array<{ slug: string; editions: Array<{ slug: string; fiscal_year: number | null }> }> };
          const fiscalYear = parseInt(year, 10);
          const unit = (unitsData.results ?? []).find((u) => u.slug === unitSlug);
          if (!unit) return null;
          const edition = unit.editions.find((e) => e.fiscal_year === fiscalYear);
          if (!edition?.slug) return null;
          const courseRes = await fetch(buildApiUrl(`/content/courses/${edition.slug}/`));
          if (courseRes.status === 404) return null;
          if (!courseRes.ok) throw new Error(`Failed to load course (${courseRes.status})`);
          return courseRes.json() as Promise<LearningEditionDetail>;
        },
        () => null,
      ),
  },
};
