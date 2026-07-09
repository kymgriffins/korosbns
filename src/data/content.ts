import type { ApiListResponse } from "@/types/api";
import type { LearnHubItem } from "@/types/learn";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";
import {
  fetchDocumentsFromAPI,
  type DocumentType,
  type FetchDocumentsResult,
} from "@/constants/documents";

export type { LearnHubItem };
export type { DocumentType, FetchDocumentsResult };

const DEFAULT_ARTICLES: LearnHubItem[] = [];

const DEFAULT_VIDEOS: LearnHubItem[] = [];

const DEFAULT_STORIES: LearnHubItem[] = [];

const DEFAULT_DOCUMENTS: LearnHubItem[] = [];
const DEFAULT_QUESTS: LearnHubItem[] = [];

let _articles: LearnHubItem[] = [...DEFAULT_ARTICLES];
let _stories: LearnHubItem[] = [...DEFAULT_STORIES];
let _documents: LearnHubItem[] = [...DEFAULT_DOCUMENTS];
let _quests: LearnHubItem[] = [...DEFAULT_QUESTS];

export const contentData = {
  articles: {
    get: () => _articles,
    set: (items: LearnHubItem[]) => { _articles = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.articles(filters) as Promise<ApiListResponse<LearnHubItem>>,
        () => ({ results: _articles }),
        { timeoutMs: 8000 },
      ).then((r) => r.results ?? []),
    fetchBySlug: (slug: string) =>
      withFallback<Record<string, unknown> | null>(
        "content",
        () => learnHubApi.articleDetail(slug) as Promise<Record<string, unknown>>,
        () => null,
        { timeoutMs: 6000 },
      ),
    fetchFromApi: (filters?: { search?: string }) =>
      learnHubApi.articles(filters) as Promise<ApiListResponse<LearnHubItem>>,
  },
  stories: {
    get: () => _stories,
    set: (items: LearnHubItem[]) => { _stories = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.stories(filters) as Promise<ApiListResponse<LearnHubItem>>,
        () => ({ results: _stories }),
        { timeoutMs: 8000 },
      ).then((r) => r.results ?? []),
    fetchBySlug: (slug: string) =>
      withFallback<Record<string, unknown> | null>(
        "content",
        () => learnHubApi.storyDetail(slug) as Promise<Record<string, unknown>>,
        () => null,
        { timeoutMs: 6000 },
      ),
    fetchFromApi: () => learnHubApi.stories() as Promise<ApiListResponse<LearnHubItem>>,
  },
  trivia: {
    fetchList: () =>
      withFallback(
        "content",
        () => citizenApi.getTriviaList(),
        () => ({ results: [], count: 0 }),
      ).then((r) => r.results ?? []),
    fetchBySlug: (slug: string) =>
      withFallback(
        "content",
        () => citizenApi.getTrivia(slug) as Promise<Record<string, unknown>>,
        () => null,
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
    set: (items: LearnHubItem[]) => { _documents = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.documents(filters),
        () => ({ results: _documents }),
      ).then((r) => r.results ?? []),
    fetchFromDirectory: () =>
      withFallback(
        "content",
        () => fetchDocumentsFromAPI(),
        () => ({ documents: [], error: "Repository unavailable" }) as FetchDocumentsResult,
      ),
  },
  quests: {
    get: () => _quests,
    set: (items: LearnHubItem[]) => { _quests = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.quests(filters),
        () => ({ results: _quests }),
      ).then((r) => r.results ?? []),
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
