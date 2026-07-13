import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import type { LearningEditionDetail } from "@/lib/learning-units";
import { learnHubApi } from "@/lib/learn-hub";
import { buildApiUrl } from "@/lib/api-url";
import { withFallback } from "@/data/adapter";

export type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse };

const DEFAULT_SUMMARY: LearnHubSummary = {
  counts: {},
  trending: [],
};

let _modules: CivicModule[] = [];
let _summary: LearnHubSummary = { ...DEFAULT_SUMMARY };

/**
 * Never invent civic modules. Fake titles like "Budget Basics" /
 * "Sector Deep Dive" / "Citizen Engagement" used to appear when the API
 * failed (common right after login). Show empty + error UI instead.
 */
export const learningData = {
  modules: {
    get: () => _modules,
    set: (items: CivicModule[]) => {
      _modules = items;
    },
    fetch: async (): Promise<CivicModule[]> => {
      const load = async () => {
        const r = await learnHubApi.civicModules();
        return r.results ?? [];
      };

      try {
        const results = await load();
        _modules = results;
        return results;
      } catch (firstErr) {
        // One quick retry — login/cookie races and transient proxy blips are common.
        try {
          await new Promise((r) => setTimeout(r, 350));
          const results = await load();
          _modules = results;
          return results;
        } catch {
          const message =
            firstErr instanceof Error ? firstErr.message : String(firstErr);
          console.warn(
            `[Data:learning] civic-modules failed (${message}); returning empty list`,
          );
          // Prefer last good in-memory catalogue over a hard failure when possible.
          if (_modules.length > 0) return _modules;
          throw firstErr instanceof Error ? firstErr : new Error(message);
        }
      }
    },
    fetchBySlug: (slug: string) =>
      withFallback(
        "learning",
        () => learnHubApi.civicModule(slug),
        () => null,
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
