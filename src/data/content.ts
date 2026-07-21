import type { ApiListResponse } from "@/types/api";
import type { LearnHubItem } from "@/types/learn";
import type { TriviaSetApi } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";
import {
  fetchDocumentsFromAPI,
  type DocumentType,
  type FetchDocumentsResult,
} from "@/constants/documents";
import learnArticlesFallback from "@/data/fallbacks/learn-articles.json";
import learnPathsFallback from "@/data/fallbacks/learn-paths.json";
import learnStoriesFallback from "@/data/fallbacks/learn-stories.json";
import learnQuestsFallback from "@/data/fallbacks/learn-quests.json";
import learnTriviaFallback from "@/data/fallbacks/learn-trivia.json";

export type { LearnHubItem };
export type { DocumentType, FetchDocumentsResult };

const DEFAULT_ARTICLES: LearnHubItem[] = [
  ...(learnArticlesFallback.results as LearnHubItem[]),
];
const DEFAULT_VIDEOS: LearnHubItem[] = [];
const DEFAULT_STORIES: LearnHubItem[] = [
  ...(learnStoriesFallback.results as LearnHubItem[]),
];
const DEFAULT_DOCUMENTS: LearnHubItem[] = [];
const DEFAULT_QUESTS: LearnHubItem[] = [
  ...(learnQuestsFallback.results as LearnHubItem[]),
];
const DEFAULT_PATHS: LearnHubItem[] = [
  ...(learnPathsFallback.results as LearnHubItem[]),
];
const DEFAULT_TRIVIA: TriviaSetApi[] = [
  ...(learnTriviaFallback.results as TriviaSetApi[]),
];

function filterBySearch(items: LearnHubItem[], search?: string): LearnHubItem[] {
  if (!search?.trim()) return items;
  const q = search.trim().toLowerCase();
  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.slug?.toLowerCase().includes(q),
  );
}

function findTriviaBySlug(slug: string): TriviaSetApi | null {
  const hit = DEFAULT_TRIVIA.find(
    (t) =>
      t.id === slug ||
      String((t as TriviaSetApi & { slug?: string }).slug ?? "") === slug,
  );
  return hit ?? null;
}

function findStoryBySlug(slug: string): Record<string, unknown> | null {
  const hit = DEFAULT_STORIES.find(
    (s) => s.id === slug || s.slug === slug || String(s.id) === slug,
  );
  return (hit as unknown as Record<string, unknown>) ?? null;
}

let _articles: LearnHubItem[] = [...DEFAULT_ARTICLES];
let _stories: LearnHubItem[] = [...DEFAULT_STORIES];
let _documents: LearnHubItem[] = [...DEFAULT_DOCUMENTS];
let _quests: LearnHubItem[] = [...DEFAULT_QUESTS];
let _paths: LearnHubItem[] = [...DEFAULT_PATHS];

export const contentData = {
  articles: {
    get: () => _articles,
    set: (items: LearnHubItem[]) => {
      _articles = items;
    },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.articles(filters),
        () => ({ results: filterBySearch(_articles.length ? _articles : DEFAULT_ARTICLES, filters?.search) }),
        { accept: (r) => Array.isArray(r?.results) && (r.results?.length ?? 0) > 0 },
      ).then((r) => {
        const results = r.results ?? [];
        if (results.length) _articles = results;
        return results.length ? results : filterBySearch(DEFAULT_ARTICLES, filters?.search);
      }),
    fetchBySlug: (slug: string): Promise<Record<string, unknown> | null> =>
      withFallback<Record<string, unknown> | null>(
        "content",
        () => citizenApi.getArticle(slug) as Promise<Record<string, unknown>>,
        () =>
          (DEFAULT_ARTICLES.find((a) => a.slug === slug) as unknown as Record<
            string,
            unknown
          >) ?? null,
      ),
    fetchFromApi: (filters?: { search?: string }) =>
      citizenApi.getArticles() as Promise<ApiListResponse<LearnHubItem>>,
  },
  stories: {
    get: () => _stories,
    set: (items: LearnHubItem[]) => {
      _stories = items;
    },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.stories(filters),
        () => ({
          results: filterBySearch(_stories.length ? _stories : DEFAULT_STORIES, filters?.search),
        }),
        { accept: (r) => Array.isArray(r?.results) && (r.results?.length ?? 0) > 0 },
      ).then((r) => {
        const results = r.results ?? [];
        if (results.length) _stories = results;
        return results.length ? results : filterBySearch(DEFAULT_STORIES, filters?.search);
      }),
    fetchBySlug: (slug: string): Promise<Record<string, unknown> | null> =>
      withFallback<Record<string, unknown> | null>(
        "content",
        () =>
          citizenApi.getStories().then((r) => {
            const results = (r?.results ?? []) as Array<Record<string, unknown>>;
            return (
              results.find(
                (s) => s.id === slug || s.slug === slug || String(s.id) === slug,
              ) ?? null
            );
          }),
        () => findStoryBySlug(slug),
        { accept: (r) => r != null && Object.keys(r).length > 0 },
      ),
    fetchFromApi: () => citizenApi.getStories() as Promise<ApiListResponse<LearnHubItem>>,
  },
  paths: {
    get: () => _paths,
    set: (items: LearnHubItem[]) => {
      _paths = items;
    },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.paths(filters),
        () => ({ results: filterBySearch(_paths.length ? _paths : DEFAULT_PATHS, filters?.search) }),
        { accept: (r) => Array.isArray(r?.results) && (r.results?.length ?? 0) > 0 },
      ).then((r) => {
        const results = r.results ?? [];
        if (results.length) _paths = results;
        return results.length ? results : filterBySearch(DEFAULT_PATHS, filters?.search);
      }),
  },
  trivia: {
    fetchList: () =>
      withFallback(
        "content",
        () => citizenApi.getTriviaList(),
        () => ({ results: DEFAULT_TRIVIA, count: DEFAULT_TRIVIA.length }),
        { accept: (r) => Array.isArray(r?.results) && (r.results?.length ?? 0) > 0 },
      ).then((r) => {
        const results = r.results ?? [];
        return results.length ? results : DEFAULT_TRIVIA;
      }),
    fetchBySlug: (slug: string): Promise<Record<string, unknown> | null> =>
      withFallback<Record<string, unknown> | null>(
        "content",
        () => citizenApi.getTrivia(slug) as Promise<Record<string, unknown>>,
        () => (findTriviaBySlug(slug) as unknown as Record<string, unknown>) ?? null,
        { accept: (r) => r != null && Object.keys(r).length > 0 },
      ),
    fetchLeaderboard: (id: string) =>
      withFallback(
        "content",
        () => citizenApi.getTriviaLeaderboard(id),
        () => ({ results: [] }),
      ),
  },
  documents: {
    get: () => _documents,
    set: (items: LearnHubItem[]) => {
      _documents = items;
    },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.documents(filters),
        () => ({ results: filterBySearch(_documents, filters?.search) }),
      ).then((r) => r.results ?? []),
    fetchFromDirectory: () =>
      withFallback(
        "content",
        () => fetchDocumentsFromAPI(),
        () =>
          ({
            documents: [],
            error: "Repository unavailable — offline catalogue has no documents yet.",
          }) as FetchDocumentsResult,
      ),
  },
  quests: {
    get: () => _quests,
    set: (items: LearnHubItem[]) => {
      _quests = items;
    },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.quests(filters),
        () => ({
          results: filterBySearch(_quests.length ? _quests : DEFAULT_QUESTS, filters?.search),
        }),
        { accept: (r) => Array.isArray(r?.results) && (r.results?.length ?? 0) > 0 },
      ).then((r) => {
        const results = r.results ?? [];
        if (results.length) _quests = results;
        return results.length ? results : filterBySearch(DEFAULT_QUESTS, filters?.search);
      }),
  },
  knowledge: {
    fetch: () =>
      withFallback(
        "content",
        () => citizenApi.getKnowledge(),
        () => ({ results: [] }),
      ).then((r) => r.results ?? []),
    fetchById: (id: string) =>
      withFallback(
        "content",
        () => citizenApi.getKnowledgeEntry(id),
        () => null,
      ),
  },
};
