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

export const adminAuthorsApi = {
  list: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminAuthor>>(`/content/authors/${qs ? `?${qs}` : ""}`);
  },
  get: (slug: string) => adminFetch<AdminAuthor>(`/content/authors/${slug}/`),
  create: (data: Partial<AdminAuthor>) =>
    adminFetch<AdminAuthor>("/content/authors/", { method: "POST", body: JSON.stringify(data) }),
  update: (slug: string, data: Partial<AdminAuthor>) =>
    adminFetch<AdminAuthor>(`/content/authors/${slug}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (slug: string) =>
    adminFetch<void>(`/content/authors/${slug}/`, { method: "DELETE" }),
};

export const adminForumApi = {
  listThreads: (params?: { page?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminForumThread>>(`/engagement/forum-threads/${qs ? `?${qs}` : ""}`);
  },
  deleteThread: (id: string) =>
    adminFetch<void>(`/engagement/forum-threads/${id}/`, { method: "DELETE" }),
  deletePost: (threadId: string, postId: string) =>
    adminFetch<void>(`/engagement/forum-threads/${threadId}/posts/${postId}/`, { method: "DELETE" }),
};

export const adminBudgetApi = {
  list: () => adminFetch<ApiListResponse<AdminBudgetRecord>>("/budget/records/"),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return adminFetch<AdminBudgetRecord>("/budget/records/", { method: "POST", body: formData as unknown as BodyInit });
  },
  delete: (id: string) =>
    adminFetch<void>(`/budget/records/${id}/`, { method: "DELETE" }),
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

export type AdminAuthor = {
  id: string;
  name: string;
  slug: string;
  image: string;
  role: string;
  bio: string;
  created_at: string;
};

export type AdminForumThread = {
  id: string;
  title: string;
  author_name: string;
  posts_count: number;
  created_at: string;
  civic_module?: string | null;
};

export type AdminBudgetRecord = {
  id: string;
  fiscal_year: string;
  title: string;
  uploaded_at: string;
  file_size?: number;
  status: string;
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
};

export const adminAnalyticsApi = {
  summary: () => adminFetch<AdminAnalyticsSummary>("/analytics/summary/"),
  dashboard: () => adminFetch<AdminAnalyticsSummary>("/analytics/dashboard/"),
};
