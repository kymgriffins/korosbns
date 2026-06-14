import { apiFetch } from "@/lib/api-client";
import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import type { LearningUnitSummary } from "@/lib/learning-units";

export type LearnHubItem = {
  id: string;
  content_type: "video" | "article" | "story" | "document" | "path" | "quest";
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

export type LearnHubSummary = {
  counts: Record<string, number>;
  trending: LearnHubItem[];
};

export type LearnProfileResponse = {
  gamification: {
    points: number;
    level: number;
    streak_days: number;
    badges: Array<{
      slug: string;
      name: string;
      description?: string;
      icon?: string;
      awarded_at?: string;
    }>;
    certificates?: Array<{
      id: string;
      civic_module?: string;
      module_title: string;
      module_slug: string;
      issued_at: string;
      certificate_url?: string;
    }>;
    recent_progress: Array<{
      content_type: string;
      content_id: string;
      completed_at: string;
      progress_percent?: number;
    }>;
    total_progress?: number;
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
  return apiFetch<ApiListResponse<LearnHubItem>>(
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
  stages: () => apiFetch<ApiListResponse<CivicModule>>("/content/civic-modules/"),
  stage: (slug: string) => apiFetch<CivicModule>(`/content/civic-modules/${slug}/`),
  leaderboard: (limit = 20) =>
    apiFetch<ApiListResponse<LeaderboardEntry>>(`/gamification/leaderboard/?limit=${limit}`),
  stageLeaderboard: (slug: string) =>
    apiFetch<StageLeaderboardStats>(`/content/learn/stages/${slug}/leaderboard/`),
  profile: () =>
    apiFetch<LearnProfileResponse>("/content/learn/profile/"),
  markProgress: (body: {
    content_type: string;
    content_id: string;
    progress_percent?: number;
  }) =>
    apiFetch("/content/learn/progress/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  civicModules: () =>
    apiFetch<ApiListResponse<CivicModule>>("/content/civic-modules/"),
  civicModule: (slug: string) =>
    apiFetch<CivicModule>(`/content/civic-modules/${slug}/`),
  budgetNewsModules: () =>
    apiFetch<ApiListResponse<CivicModule>>("/content/civic-modules/?is_financial_year_analysis=true"),
  budgetNewsModule: (slug: string) =>
    apiFetch<CivicModule>(`/content/civic-modules/${slug}/`),
  completeChapter: (chapterId: string) =>
    apiFetch<{
      detail: string;
      module_completed: boolean;
      certificate_id?: string | null;
    }>(`/content/civic-chapters/${chapterId}/complete/`, { method: "POST" }),
  submitTriviaAttempt: (triviaId: string, answers: Record<string, number>) =>
    apiFetch<{ score: number; streak_count?: number; completed_at?: string }>(
      `/engagement/trivia/${triviaId}/attempt/`,
      {
        method: "POST",
        body: JSON.stringify({ answers, leaderboard_opt_in: false }),
      },
    ),
  getForumThreads: (chapterId?: string) => {
    let url = "/engagement/forum-threads/";
    if (chapterId) url += `?chapter_id=${chapterId}`;
    return apiFetch<ApiListResponse<ForumThread>>(url);
  },
  createForumThread: (body: { title: string; civic_module?: string; civic_chapter?: string }) =>
    apiFetch<ForumThread>("/engagement/forum-threads/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getForumThread: (threadId: string) =>
    apiFetch<ForumThreadDetail>(`/engagement/forum-threads/${threadId}/`),
  createForumPost: (threadId: string, content: string) =>
    apiFetch<ForumPost>(`/engagement/forum-threads/${threadId}/posts/`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  // Dedicated author endpoints (no more client-side filtering)
  authors: () =>
    apiFetch<ApiListResponse<CivicModuleAuthor>>("/content/authors/"),
  author: (slug: string) =>
    apiFetch<{ author: CivicModuleAuthor; modules: CivicModule[] }>(
      `/content/authors/${slug}/`,
    ),
  // Module analytics (daily/weekly)
  moduleAnalytics: (params?: { period?: string; module_slug?: string }) => {
    const q = new URLSearchParams();
    if (params?.period) q.set("period", params.period);
    if (params?.module_slug) q.set("module_slug", params.module_slug);
    const qs = q.toString();
    return apiFetch<ModuleAnalyticsResponse>(
      `/content/analytics/modules/${qs ? `?${qs}` : ""}`,
    );
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

type LeaderboardEntry = {
  rank: number;
  name: string | null;
  points: number;
  level: number;
  streak_days: number;
  badge_count: number;
};

type StageLeaderboardStats = {
  stage_slug: string;
  stage_title: string;
  total_users: number;
  avg_trivia_score: number | null;
};

type ForumPost = {
  id: string;
  content: string;
  upvotes: number;
  author_name: string;
  author_initials: string;
  created_at: string;
};

type ForumThread = {
  id: string;
  title: string;
  civic_module: string | null;
  civic_chapter: string | null;
  posts_count: number;
  author_name: string;
  author_initials: string;
  created_at: string;
};

type ForumThreadDetail = ForumThread & {
  posts: ForumPost[];
};

export type ModuleAnalyticsResponse = {
  period: string;
  completions_over_time: Array<{ period: string | null; count: number }>;
  top_modules: Array<{ slug: string; title: string; completions: number }>;
  event_summary_last_30d: Record<string, number>;
  total_modules_published: number;
};
