import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";

function adminFetch<T>(url: string, options?: RequestInit & { auth?: boolean }): Promise<T> {
  return apiFetch<T>(url, { ...options, auth: true });
}

export const adminUsersApi = {
  list: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminUser>>(`/users/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<AdminUser>(`/users/${id}/`),
  create: (data: Partial<AdminUser>) =>
    adminFetch<AdminUser>("/users/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminUser>) =>
    adminFetch<AdminUser>(`/users/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/users/${id}/`, { method: "DELETE" }),
};

export const adminContentApi = {
  list: (contentType: string, params?: { page?: number; search?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminContentItem>>(`/content/learn/${contentType}/${qs ? `?${qs}` : ""}`);
  },
  get: (contentType: string, id: string) =>
    adminFetch<AdminContentItem>(`/content/learn/${contentType}/${id}/`),
  create: (contentType: string, data: Partial<AdminContentItem>) =>
    adminFetch<AdminContentItem>(`/content/learn/${contentType}/`, { method: "POST", body: JSON.stringify(data) }),
  update: (contentType: string, id: string, data: Partial<AdminContentItem>) =>
    adminFetch<AdminContentItem>(`/content/learn/${contentType}/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (contentType: string, id: string) =>
    adminFetch<void>(`/content/learn/${contentType}/${id}/`, { method: "DELETE" }),
};

export const adminModulesApi = {
  list: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminModule>>(`/content/civic-modules/${qs ? `?${qs}` : ""}`);
  },
  get: (slug: string) => adminFetch<AdminModule>(`/content/civic-modules/${slug}/`),
  create: (data: Partial<AdminModule>) =>
    adminFetch<AdminModule>("/content/civic-modules/", { method: "POST", body: JSON.stringify(data) }),
  update: (slug: string, data: Partial<AdminModule>) =>
    adminFetch<AdminModule>(`/content/civic-modules/${slug}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (slug: string) =>
    adminFetch<void>(`/content/civic-modules/${slug}/`, { method: "DELETE" }),
};

export const adminForumApi = {
  listThreads: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminForumThread>>(`/engagement/forum-threads/${qs ? `?${qs}` : ""}`);
  },
  createThread: (data: { title: string; civic_module?: string | null }) =>
    adminFetch<AdminForumThread>("/engagement/forum-threads/", { method: "POST", body: JSON.stringify(data) }),
  updateThread: (id: string, data: { title?: string; civic_module?: string | null }) =>
    adminFetch<AdminForumThread>(`/engagement/forum-threads/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteThread: (id: string) =>
    adminFetch<void>(`/engagement/forum-threads/${id}/`, { method: "DELETE" }),
  deletePost: (threadId: string, postId: string) =>
    adminFetch<void>(`/engagement/forum-threads/${threadId}/posts/${postId}/`, { method: "DELETE" }),
};

export const adminRolesApi = {
  list: () => adminFetch<ApiListResponse<AdminRole>>("/roles/"),
  get: (id: string) => adminFetch<AdminRole>(`/roles/${id}/`),
  create: (data: Partial<AdminRole>) =>
    adminFetch<AdminRole>("/roles/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminRole>) =>
    adminFetch<AdminRole>(`/roles/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/roles/${id}/`, { method: "DELETE" }),
};

export const adminNotesApi = {
  list: (params?: { page?: number; search?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminNote>>(`/notes/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<AdminNote>(`/notes/${id}/`),
  create: (data: Partial<AdminNote>) =>
    adminFetch<AdminNote>("/notes/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminNote>) =>
    adminFetch<AdminNote>(`/notes/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/notes/${id}/`, { method: "DELETE" }),
  audit: (id: string, notes: string) =>
    adminFetch<AdminNote>(`/notes/${id}/audit/`, { method: "POST", body: JSON.stringify({ audit_notes: notes }) }),
  publish: (id: string) =>
    adminFetch<AdminNote>(`/notes/${id}/publish/`, { method: "POST" }),
};

export const adminAnalyticsApi = {
  summary: (period?: string) => {
    const qs = period ? `?period=${period}` : "";
    return adminFetch<AdminAnalyticsSummary>(`/analytics/summary/${qs}`);
  },
  dashboard: (period?: string) => {
    const qs = period ? `?period=${period}` : "";
    return adminFetch<AdminAnalyticsSummary>(`/analytics/dashboard/${qs}`);
  },
};

export type AdminUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  avatar?: string | null;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string | null;
};

export type AdminContentItem = {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  summary?: string;
  body?: string;
  body_html?: string;
  thumbnail_url?: string;
  status: string;
  difficulty?: string;
  published_at?: string | null;
  tags?: Array<{ name: string; slug: string }>;
  created_at: string;
  updated_at: string;
  author?: string;
};

export type AdminModule = {
  id: string;
  title: string;
  slug: string;
  description: string;
  badge: string;
  badgeName: string;
  status: string;
  image_url?: string;
  steps: Array<{ id: string; title: string; order: number }>;
  author?: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminForumThread = {
  id: string;
  title: string;
  author_name: string;
  posts_count: number;
  created_at: string;
  civic_module?: string | null;
};

export type AdminRole = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  user_count: number;
  created_at: string;
};

export type AdminNote = {
  id: string;
  title: string;
  content?: string;
  author_name?: string;
  status: "draft" | "published" | "archived";
  is_public: boolean;
  audit_notes?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type TrafficMetricRow = {
  pageviews: number;
  visitors: number;
  percentage?: number;
};

export type VercelTrafficBundle = {
  daily_visitors: Array<TrafficMetricRow & { date: string; count: number }>;
  top_pages: Array<TrafficMetricRow & { path: string; views?: number }>;
  top_routes: Array<TrafficMetricRow & { route: string }>;
  referrers: Array<TrafficMetricRow & { hostname: string; label: string }>;
  countries: Array<TrafficMetricRow & { code: string }>;
  devices: Array<TrafficMetricRow & { device_type: string }>;
  operating_systems: Array<TrafficMetricRow & { os_name: string }>;
  browsers: Array<TrafficMetricRow & { browser_name: string }>;
  traffic_sources: { source: string; count: number; visitors?: number; percentage: number }[];
};

export type AdminAnalyticsSummary = {
  total_users: number;
  total_content: number;
  total_modules: number;
  total_articles: number;
  total_videos: number;
  total_stories: number;
  total_documents: number;
  active_forum_threads: number;
  total_notes: number;
  recent_signups: number;
  engagement_rate: number;
  period?: string;

  users_new_today: number;
  users_new_7d: number;
  users_new_30d: number;
  users_active_7d: number;
  users_active_30d: number;
  users_growth_pct: number;

  visitors_today: number;
  visitors_7d: number;
  visitors_30d: number;
  pageviews_today: number;
  pageviews_7d: number;
  pageviews_30d: number;
  bounce_rate: number;
  avg_session_seconds: number;
  traffic_source?: "vercel" | "local";
  traffic_synced_at?: string | null;

  daily_visitors: { date: string; count: number; visitors?: number; pageviews?: number }[];
  top_pages: { path: string; views: number; pageviews?: number; visitors?: number; percentage?: number }[];
  top_routes?: { route: string; pageviews: number; visitors: number; percentage?: number }[];
  referrers?: { hostname: string; label: string; pageviews: number; visitors: number; percentage?: number }[];
  countries?: { code: string; pageviews: number; visitors: number; percentage?: number }[];
  device_breakdown: { device_type: string; percentage: number; pageviews?: number; visitors?: number }[];
  operating_systems?: { os_name: string; pageviews: number; visitors: number; percentage?: number }[];
  browsers?: { browser_name: string; pageviews: number; visitors: number; percentage?: number }[];
  traffic_sources: { source: string; count: number; visitors?: number; percentage: number }[];
  vercel_traffic?: VercelTrafficBundle;

  content_published_today: number;
  content_published_7d: number;
  content_published_30d: number;
  content_drafts: number;
};
