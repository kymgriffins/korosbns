import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import { learnHubApi } from "@/lib/learn-hub";
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
};
