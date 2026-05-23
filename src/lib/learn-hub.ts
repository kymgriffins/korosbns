import { apiFetch } from "@/lib/api-client";
import { buildApiUrl } from "@/lib/api-url";
import { gamificationHeaders } from "@/lib/gamification";
import type { LearningUnitSummary } from "@/lib/learning-units";

export type LearnContentType =
  | "video"
  | "article"
  | "story"
  | "document"
  | "path"
  | "quest";

export type LearnHubItem = {
  id: string;
  content_type: LearnContentType;
  title: string;
  summary?: string;
  slug?: string;
  url?: string;
  thumbnail_url?: string;
  published_at?: string | null;
  difficulty?: string | null;
  tags?: Array<{ name?: string; slug?: string }>;
  lesson_count?: number;
  fiscal_year?: number | null;
  module_code?: string;
  points?: number;
  path_slug?: string;
};

export type LearnHubListResponse = {
  count: number;
  results: LearnHubItem[];
};

export type LearnHubSummary = {
  counts: Record<string, number>;
  trending: LearnHubItem[];
};

export type LearnProfileResponse = {
  gamification: {
    points: number;
    level: number;
    streak_days: number;
    badges: Array<{ slug: string; name: string; description?: string; icon?: string }>;
    recent_progress: Array<{
      content_type: string;
      content_id: string;
      completed_at: string;
    }>;
  } | null;
  progress: Array<{
    content_type: string;
    content_id: string;
    completed_at: string;
    progress_percent: number;
  }>;
};

export type LearnListFilters = {
  sort?: string;
  difficulty?: string;
  tag?: string;
  search?: string;
};

function filtersToQuery(filters?: LearnListFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.search) params.set("search", filters.search);
  const q = params.toString();
  return q ? `?${q}` : "";
}

function fetchList(segment: string, filters?: LearnListFilters) {
  return apiFetch<LearnHubListResponse>(
    `/content/learn/${segment}/${filtersToQuery(filters)}`,
  );
}

export const learnHubApi = {
  units: () =>
    apiFetch<{ results: LearningUnitSummary[] }>("/content/units/"),
  summary: () => apiFetch<LearnHubSummary>("/content/learn/"),
  videos: (filters?: LearnListFilters) => fetchList("videos", filters),
  articles: (filters?: LearnListFilters) => fetchList("articles", filters),
  stories: (filters?: LearnListFilters) => fetchList("stories", filters),
  documents: (filters?: LearnListFilters) => fetchList("documents", filters),
  paths: (filters?: LearnListFilters) => fetchList("paths", filters),
  quests: (filters?: LearnListFilters) => fetchList("quests", filters),
  profile: async (): Promise<LearnProfileResponse> => {
    const res = await fetch(buildApiUrl("/content/learn/profile/"), {
      headers: gamificationHeaders(),
    });
    if (!res.ok) {
      return { gamification: null, progress: [] };
    }
    return (await res.json()) as LearnProfileResponse;
  },
  markProgress: async (body: {
    content_type: LearnContentType;
    content_id: string;
    progress_percent?: number;
  }) => {
    const res = await fetch(buildApiUrl("/content/learn/progress/"), {
      method: "POST",
      headers: gamificationHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Could not save progress");
    return res.json();
  },
};

export function learnItemHref(item: LearnHubItem): string {
  switch (item.content_type) {
    case "article":
    case "story":
      return `/learn/${item.slug || item.id}`;
    case "path":
      return `/learn/paths/${item.slug || item.id}`;
    case "quest":
      return `/learn/${item.id}`;
    case "video":
      return item.url ? item.url : `/learn/videos`;
    case "document":
      return item.url || "/learn/documents";
    default:
      return "/learn";
  }
}

export function isExternalLearnHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
