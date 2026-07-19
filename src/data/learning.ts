import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { LearningEditionDetail } from "@/lib/learning-units";
import { learnHubApi } from "@/lib/learn-hub";
import { buildApiUrl } from "@/lib/api-url";
import { withFallback } from "@/data/adapter";
import civicModulesFallback from "@/data/fallbacks/civic-modules.json";
import learnSummaryFallback from "@/data/fallbacks/learn-summary.json";

export type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse };

const FALLBACK_MODULES = (civicModulesFallback.results ?? []) as CivicModule[];

const DEFAULT_SUMMARY: LearnHubSummary = {
  counts: { ...(learnSummaryFallback.counts ?? {}) },
  trending: [...(learnSummaryFallback.trending ?? [])] as LearnHubSummary["trending"],
};

let _modules: CivicModule[] = [...FALLBACK_MODULES];
let _modulesUsedFallback = false;
let _summary: LearnHubSummary = { ...DEFAULT_SUMMARY };

/**
 * Civic modules are read-only catalogue data. Prefer the live API, but always
 * fall back to seeded JSON so the Learn hub never hard-fails on timeout/404.
 */
export const learningData = {
  modules: {
    get: () => _modules,
    set: (items: CivicModule[]) => {
      _modules = items;
    },
    usedFallback: () => _modulesUsedFallback,
    fetch: async (): Promise<CivicModule[]> => {
      let usedFallback = false;
      const results = await withFallback(
        "learning",
        async () => {
          const load = async () => {
            const r = await learnHubApi.civicModules();
            return r.results ?? [];
          };
          try {
            return await load();
          } catch (firstErr) {
            await new Promise((r) => setTimeout(r, 350));
            try {
              return await load();
            } catch {
              throw firstErr;
            }
          }
        },
        () => {
          usedFallback = true;
          return _modules.length > 0 ? _modules : FALLBACK_MODULES;
        },
        {
          // Empty success must not wipe the hub — use seeded catalogue.
          accept: (rows) => Array.isArray(rows) && rows.length > 0,
        },
      );
      _modules = results.length > 0 ? results : FALLBACK_MODULES;
      _modulesUsedFallback = usedFallback || results.length === 0;
      return _modules;
    },
    fetchBySlug: (slug: string) =>
      withFallback(
        "learning",
        () => learnHubApi.civicModule(slug),
        () =>
          FALLBACK_MODULES.find((m) => m.slug === slug) ??
          _modules.find((m) => m.slug === slug) ??
          null,
      ),
  },
  summary: {
    get: () => _summary,
    set: (s: LearnHubSummary) => {
      _summary = s;
    },
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
        () =>
          fetch(buildApiUrl(`/content/courses/${slug}/`)).then((r) => {
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
          const unitsData = (await unitsRes.json()) as {
            results?: Array<{
              slug: string;
              editions: Array<{ slug: string; fiscal_year: number | null }>;
            }>;
          };
          const fiscalYear = parseInt(year, 10);
          const unit = (unitsData.results ?? []).find((u) => u.slug === unitSlug);
          if (!unit) return null;
          const edition = unit.editions.find((e) => e.fiscal_year === fiscalYear);
          if (!edition?.slug) return null;
          const courseRes = await fetch(
            buildApiUrl(`/content/courses/${edition.slug}/`),
          );
          if (courseRes.status === 404) return null;
          if (!courseRes.ok) throw new Error(`Failed to load course (${courseRes.status})`);
          return courseRes.json() as Promise<LearningEditionDetail>;
        },
        () => null,
      ),
  },
};
