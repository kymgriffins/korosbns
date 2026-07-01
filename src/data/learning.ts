import type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import type { LearningEditionDetail } from "@/lib/learning-units";
import { learnHubApi } from "@/lib/learn-hub";
import { buildApiUrl } from "@/lib/api-url";
import { withFallback } from "@/data/adapter";

export type { CivicModule, CivicModuleAuthor, LearnHubSummary, LearnProfileResponse };

const DEFAULT_MODULES: CivicModule[] = [
  {
    id: "budget-basics",
    title: "Budget Basics",
    slug: "budget-basics",
    badge: "BB",
    badgeName: "Budget Basics",
    documentName: "budget-basics",
    archive: "",
    link: "",
    status: "published",
    credits: "BNS",
    description: "Understand how Kenya's national budget works — from revenue collection to allocation across sectors.",
    expectations: ["Learn the budget cycle", "Understand revenue sources", "Explore expenditure categories"],
    order: 1,
    steps: [],
  },
  {
    id: "sector-deep-dive",
    title: "Sector Deep Dive",
    slug: "sector-deep-dive",
    badge: "SD",
    badgeName: "Sector Deep Dive",
    documentName: "sector-deep-dive",
    archive: "",
    link: "",
    status: "published",
    credits: "BNS",
    description: "Explore allocations across education, health, infrastructure, and agriculture sectors.",
    expectations: ["Compare sector allocations", "Analyze year-over-year trends", "Understand policy priorities"],
    order: 2,
    steps: [],
  },
  {
    id: "citizen-engagement",
    title: "Citizen Engagement",
    slug: "citizen-engagement",
    badge: "CE",
    badgeName: "Citizen Engagement",
    documentName: "citizen-engagement",
    archive: "",
    link: "",
    status: "published",
    credits: "BNS",
    description: "Learn how citizens can participate in the budget process through public forums and petitions.",
    expectations: ["Identify engagement channels", "Understand public participation", "Take action in your county"],
    order: 3,
    steps: [],
  },
];

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
