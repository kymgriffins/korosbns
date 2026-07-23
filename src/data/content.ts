import type { ApiListResponse } from "@/types/api";
import type { LearnHubItem } from "@/types/learn";
import type { TriviaSetApi } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
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

function findArticleBySlug(slug: string): Record<string, unknown> | null {
  const hit = DEFAULT_ARTICLES.find((a) => a.slug === slug || a.id === slug);
  return (hit as unknown as Record<string, unknown>) ?? null;
}

let _articles: LearnHubItem[] = [...DEFAULT_ARTICLES];
let _stories: LearnHubItem[] = [...DEFAULT_STORIES];
let _documents: LearnHubItem[] = [...DEFAULT_DOCUMENTS];
let _quests: LearnHubItem[] = [...DEFAULT_QUESTS];
let _paths: LearnHubItem[] = [...DEFAULT_PATHS];

/**
 * Learn catalogue (articles, stories, paths, quests, trivia list) is JSON-only.
 * Knowledge / document directory / trivia leaderboard may still use API.
 */
export const contentData = {
  articles: {
    get: () => _articles,
    set: (items: LearnHubItem[]) => {
      _articles = items;
    },
    fetch: async (filters?: { search?: string }) => {
      _articles = [...DEFAULT_ARTICLES];
      return filterBySearch(_articles, filters?.search);
    },
    fetchBySlug: async (slug: string): Promise<Record<string, unknown> | null> =>
      findArticleBySlug(slug),
    fetchFromApi: (filters?: { search?: string }) =>
      citizenApi.getArticles() as Promise<ApiListResponse<LearnHubItem>>,
  },
  stories: {
    get: () => _stories,
    set: (items: LearnHubItem[]) => {
      _stories = items;
    },
    fetch: async (filters?: { search?: string }) => {
      _stories = [...DEFAULT_STORIES];
      return filterBySearch(_stories, filters?.search);
    },
    fetchBySlug: async (slug: string): Promise<Record<string, unknown> | null> =>
      findStoryBySlug(slug),
    fetchFromApi: () => citizenApi.getStories() as Promise<ApiListResponse<LearnHubItem>>,
  },
  paths: {
    get: () => _paths,
    set: (items: LearnHubItem[]) => {
      _paths = items;
    },
    fetch: async (filters?: { search?: string }) => {
      _paths = [...DEFAULT_PATHS];
      return filterBySearch(_paths, filters?.search);
    },
  },
  trivia: {
    fetchList: async () => [...DEFAULT_TRIVIA],
    fetchBySlug: async (slug: string): Promise<Record<string, unknown> | null> =>
      (findTriviaBySlug(slug) as unknown as Record<string, unknown>) ?? null,
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
    fetch: async (filters?: { search?: string }) => {
      _documents = [...DEFAULT_DOCUMENTS];
      return filterBySearch(_documents, filters?.search);
    },
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
    fetch: async (filters?: { search?: string }) => {
      _quests = [...DEFAULT_QUESTS];
      return filterBySearch(_quests, filters?.search);
    },
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
