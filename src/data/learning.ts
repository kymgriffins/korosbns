import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { LearningEditionDetail } from "@/lib/learning-units";
import { learnHubApi } from "@/lib/learn-hub";
import { buildApiUrl } from "@/lib/api-url";
import { withFallback } from "@/data/adapter";
import {
  ensureBpsYoutube,
  ensureModulesBpsYoutube,
  filterModulesWithPublishableContent,
} from "@/lib/civic-module-content";
import civicModulesFallback from "@/data/fallbacks/civic-modules.json";
import learnSummaryFallback from "@/data/fallbacks/learn-summary.json";

export type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse };

const FALLBACK_MODULES = ensureModulesBpsYoutube(
  filterModulesWithPublishableContent(
    (civicModulesFallback.results ?? []) as unknown as CivicModule[],
  ),
);

const DEFAULT_SUMMARY: LearnHubSummary = {
  counts: { ...(learnSummaryFallback.counts ?? {}) },
  trending: [...(learnSummaryFallback.trending ?? [])] as LearnHubSummary["trending"],
};

let _modules: CivicModule[] = [...FALLBACK_MODULES];
let _summary: LearnHubSummary = { ...DEFAULT_SUMMARY };

/**
 * Learn catalogue (modules + hub summary) is JSON-only — no civic-modules DB
 * hits. Profile / gamification stay on the authenticated API.
 */
export const learningData = {
  modules: {
    get: () => _modules,
    set: (items: CivicModule[]) => {
      _modules = items;
    },
    /** Always true: catalogue is the seeded JSON constant, not live API. */
    usedFallback: () => true,
    fetch: async (): Promise<CivicModule[]> => {
      _modules = [...FALLBACK_MODULES];
      return _modules;
    },
    fetchBySlug: async (slug: string): Promise<CivicModule | null> => {
      const fromMemory = _modules.find((m) => m.slug === slug);
      const fromSeed = FALLBACK_MODULES.find((m) => m.slug === slug);
      const mod = fromMemory ?? fromSeed ?? null;
      return mod ? ensureBpsYoutube(mod) : null;
    },
  },
  summary: {
    get: () => _summary,
    set: (s: LearnHubSummary) => {
      _summary = s;
    },
    fetch: async (): Promise<LearnHubSummary> => {
      _summary = { ...DEFAULT_SUMMARY };
      return _summary;
    },
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
