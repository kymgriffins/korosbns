import type { ApiListResponse } from "@/types/api";
import type { LearnHubItem } from "@/types/learn";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";

export type { LearnHubItem };

const DEFAULT_ARTICLES: LearnHubItem[] = [];

const DEFAULT_VIDEOS: LearnHubItem[] = [];

const DEFAULT_STORIES: LearnHubItem[] = [];

const DEFAULT_DOCUMENTS: LearnHubItem[] = [];

let _articles: LearnHubItem[] = [...DEFAULT_ARTICLES];
let _stories: LearnHubItem[] = [...DEFAULT_STORIES];
let _documents: LearnHubItem[] = [...DEFAULT_DOCUMENTS];

export const contentData = {
  articles: {
    get: () => _articles,
    set: (items: LearnHubItem[]) => { _articles = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.articles(filters),
        () => ({ results: _articles }),
      ).then((r) => r.results ?? []),
    fetchFromApi: (filters?: { search?: string }) =>
      citizenApi.getArticles() as Promise<ApiListResponse<LearnHubItem>>,
  },
  stories: {
    get: () => _stories,
    set: (items: LearnHubItem[]) => { _stories = items; },
    fetch: (filters?: { search?: string }) =>
      withFallback(
        "content",
        () => learnHubApi.stories(filters),
        () => ({ results: _stories }),
      ).then((r) => r.results ?? []),
    fetchFromApi: () => citizenApi.getStories() as Promise<ApiListResponse<LearnHubItem>>,
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
  },
};
