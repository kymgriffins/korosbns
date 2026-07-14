/**
 * Canonical Django admin API client (P0.6).
 * Consumed by `apps/admin` and `src/app/admin` via `@/lib/admin-api`
 * (apps/admin tsconfig falls through `./src/*` → `../../src/*`).
 */
import { apiFetch, type OrgConfigApi, type SocialLinkApi, type UserProfileApi } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";

function adminFetch<T>(url: string, options?: RequestInit & { auth?: boolean }): Promise<T> {
  return apiFetch<T>(url, { ...options, auth: true });
}

export type { OrgConfigApi, SocialLinkApi, UserProfileApi };

/** Flat write body for PATCH /org/config/ (model fields, not nested GET shape). */
export type OrgConfigWritePayload = {
  tagline?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_whatsapp?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_image_url?: string;
  favicon_url?: string;
  show_partner_carousel?: boolean;
  show_newsletter_signup?: boolean;
  footer_note?: string;
  social_links?: { platform: string; url: string; label?: string; order?: number; is_active?: boolean }[];
};

export type AdminPartner = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  tier: "sponsor" | "partner" | "supporter" | string;
  description: string;
  display_order: number;
  is_active: boolean;
  is_consortium: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminPartnerWrite = {
  name?: string;
  logo_url?: string;
  website_url?: string;
  tier?: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
  is_consortium?: boolean;
};

export type PrivacyConfigApi = {
  dpa_contact: string;
  data_retention_days: number;
  cookie_policy_url: string;
  privacy_policy_url: string;
  gdpr_compliant: boolean;
  third_party_sharing: boolean;
  data_collection_purpose: string;
  last_updated: string;
};

export type SecurityInfoApi = {
  last_audit_date: string;
  encryption: string;
  headers: Record<string, string>;
  dpa_status: string;
  data_retention_days: number;
  backup_frequency: string;
};

export const adminProfileApi = {
  getMe: () => adminFetch<UserProfileApi>("/users/me/"),
  patchMe: (body: Partial<UserProfileApi>) =>
    adminFetch<UserProfileApi>("/users/me/", { method: "PATCH", body: JSON.stringify(body) }),
  patchAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return adminFetch<UserProfileApi>("/users/me/", { method: "PATCH", body: form as unknown as BodyInit });
  },
  getSocialLinks: () => adminFetch<SocialLinkApi[]>("/users/me/social-links/"),
  upsertSocialLink: (body: SocialLinkApi) =>
    adminFetch<SocialLinkApi>("/users/me/social-links/", { method: "POST", body: JSON.stringify(body) }),
  deleteSocialLink: (platform: string) =>
    adminFetch<{ detail?: string }>("/users/me/social-links/", {
      method: "DELETE",
      body: JSON.stringify({ platform }),
    }),
  changePassword: (current_password: string, new_password: string) =>
    adminFetch<{ detail: string }>("/auth/password/change/", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
};

export const adminOrgApi = {
  getConfig: () => adminFetch<OrgConfigApi>("/org/config/"),
  patchConfig: (body: OrgConfigWritePayload) =>
    adminFetch<OrgConfigApi>("/org/config/", { method: "PATCH", body: JSON.stringify(body) }),
};

export const adminPartnersApi = {
  list: () => adminFetch<AdminPartner[]>("/org/partners/"),
  create: (data: AdminPartnerWrite) =>
    adminFetch<AdminPartner>("/org/partners/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: AdminPartnerWrite) =>
    adminFetch<AdminPartner>(`/org/partners/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const adminPrivacyApi = {
  getConfig: () => adminFetch<PrivacyConfigApi>("/privacy/config/"),
};

export const adminSecurityApi = {
  getInfo: () => adminFetch<SecurityInfoApi>("/security/info/"),
};

/** Org team directory — list/stats + role/deactivate/verify (Phase 2H). */
export const adminUsersApi = {
  list: (params?: { page?: number; search?: string; role?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.search) q.set("search", params.search);
    if (params?.role) q.set("role", params.role);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminUser>>(`/users/${qs ? `?${qs}` : ""}`);
  },
  stats: () => adminFetch<AdminUserStats>("/users/stats/"),
  assignRole: (userId: string, role_slug: string) =>
    adminFetch<AdminUser>(`/users/${userId}/role/`, {
      method: "PATCH",
      body: JSON.stringify({ role_slug }),
    }),
  deactivate: (userId: string) =>
    adminFetch<AdminUser>(`/users/${userId}/deactivate/`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  verify: (userId: string) =>
    adminFetch<AdminUser>(`/users/${userId}/verify/`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

/** Seeded role slugs for invitations (full catalog via GET /roles/). */
export const INVITE_ROLE_OPTIONS = [
  { slug: "citizen", label: "Citizen" },
  { slug: "editor", label: "Editor" },
  { slug: "manager", label: "Manager" },
  { slug: "admin", label: "Admin" },
] as const;

export type AdminInvitation = {
  id: string;
  email: string;
  role_name: string;
  invited_by_name: string;
  status: "pending" | "accepted" | "declined" | "expired" | "revoked" | string;
  expires_at: string;
  created_at: string;
};

export type AdminUserStats = {
  total_members: number;
  active_30d: number;
  recent_joined_30d: number;
  role_distribution: Record<string, number>;
};

export const adminInvitationsApi = {
  list: (params?: { page?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminInvitation>>(`/invitations/list/${qs ? `?${qs}` : ""}`);
  },
  create: (data: { email: string; role_slug: string; message?: string }) =>
    adminFetch<{ detail: string; id: string }>("/invitations/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  revoke: (id: string) =>
    adminFetch<{ detail: string }>(`/invitations/${id}/revoke/`, { method: "POST", body: JSON.stringify({}) }),
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
  list: (params?: { search?: string; status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminModule>>(`/content/admin/civic-modules/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<AdminModuleDetail>(`/content/admin/civic-modules/${id}/`),
  create: (data: AdminModuleWrite) =>
    adminFetch<AdminModuleDetail>("/content/admin/civic-modules/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<AdminModuleWrite>) =>
    adminFetch<AdminModuleDetail>(`/content/admin/civic-modules/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    adminFetch<void>(`/content/admin/civic-modules/${id}/`, { method: "DELETE" }),
  transition: (id: string, action: string) =>
    adminFetch<{ id: string; status: string; allowed_actions: string[] }>(
      `/content/admin/civic-modules/${id}/transition/`,
      { method: "POST", body: JSON.stringify({ action }) },
    ),
  listChapters: (moduleId: string) =>
    adminFetch<{ results: AdminChapter[] }>(`/content/admin/civic-modules/${moduleId}/chapters/`),
  createChapter: (moduleId: string, data: AdminChapterWrite) =>
    adminFetch<AdminChapter>(`/content/admin/civic-modules/${moduleId}/chapters/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateChapter: (moduleId: string, chapterId: string, data: Partial<AdminChapterWrite>) =>
    adminFetch<AdminChapter>(`/content/admin/civic-modules/${moduleId}/chapters/${chapterId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteChapter: (moduleId: string, chapterId: string) =>
    adminFetch<void>(`/content/admin/civic-modules/${moduleId}/chapters/${chapterId}/`, {
      method: "DELETE",
    }),
  reorderChapters: (moduleId: string, chapter_ids: string[]) =>
    adminFetch<{ results: AdminChapter[] }>(`/content/admin/civic-modules/${moduleId}/chapters/reorder/`, {
      method: "POST",
      body: JSON.stringify({ chapter_ids }),
    }),
  linkArticle: (moduleId: string, chapterId: string, article_id: string) =>
    adminFetch<AdminChapter>(
      `/content/admin/civic-modules/${moduleId}/chapters/${chapterId}/link-article/`,
      { method: "POST", body: JSON.stringify({ article_id }) },
    ),
};

export const adminSurveysApi = {
  list: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminSurvey>>(`/engagement/admin/surveys/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<AdminSurveyDetail>(`/engagement/admin/surveys/${id}/`),
  create: (data: AdminSurveyWrite) =>
    adminFetch<AdminSurveyDetail>("/engagement/admin/surveys/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<AdminSurveyWrite>) =>
    adminFetch<AdminSurveyDetail>(`/engagement/admin/surveys/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    adminFetch<void>(`/engagement/admin/surveys/${id}/`, { method: "DELETE" }),
  transition: (id: string, statusValue: string) =>
    adminFetch<AdminSurveyDetail>(`/engagement/admin/surveys/${id}/transition/`, {
      method: "POST",
      body: JSON.stringify({ status: statusValue }),
    }),
  createQuestion: (surveyId: string, data: AdminSurveyQuestionWrite) =>
    adminFetch<AdminSurveyQuestion>(`/engagement/admin/surveys/${surveyId}/questions/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateQuestion: (surveyId: string, questionId: string, data: Partial<AdminSurveyQuestionWrite>) =>
    adminFetch<AdminSurveyQuestion>(`/engagement/admin/surveys/${surveyId}/questions/${questionId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteQuestion: (surveyId: string, questionId: string) =>
    adminFetch<void>(`/engagement/admin/surveys/${surveyId}/questions/${questionId}/`, {
      method: "DELETE",
    }),
  results: (id: string) =>
    adminFetch<AdminSurveyResults>(`/engagement/surveys/${id}/results/`),
};

export const adminTriviaApi = {
  list: (params?: { search?: string; status?: string; civic_module_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    if (params?.civic_module_id) q.set("civic_module_id", params.civic_module_id);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminTrivia>>(`/engagement/admin/trivia/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<AdminTriviaDetail>(`/engagement/admin/trivia/${id}/`),
  create: (data: AdminTriviaWrite) =>
    adminFetch<AdminTriviaDetail>("/engagement/admin/trivia/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<AdminTriviaWrite>) =>
    adminFetch<AdminTriviaDetail>(`/engagement/admin/trivia/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    adminFetch<void>(`/engagement/admin/trivia/${id}/`, { method: "DELETE" }),
  publish: (id: string) =>
    adminFetch<AdminTriviaDetail>(`/engagement/admin/trivia/${id}/publish/`, { method: "POST" }),
  createQuestion: (triviaId: string, data: AdminTriviaQuestionWrite) =>
    adminFetch<AdminTriviaQuestion>(`/engagement/admin/trivia/${triviaId}/questions/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateQuestion: (triviaId: string, questionId: string, data: Partial<AdminTriviaQuestionWrite>) =>
    adminFetch<AdminTriviaQuestion>(`/engagement/admin/trivia/${triviaId}/questions/${questionId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteQuestion: (triviaId: string, questionId: string) =>
    adminFetch<void>(`/engagement/admin/trivia/${triviaId}/questions/${questionId}/`, {
      method: "DELETE",
    }),
  listAttempts: (triviaId: string, page?: number) => {
    const q = page ? `?page=${page}` : "";
    return adminFetch<AdminTriviaAttemptsPage>(`/engagement/admin/trivia/${triviaId}/attempts/${q}`);
  },
  getAttempt: (triviaId: string, attemptId: string) =>
    adminFetch<AdminTriviaAttemptDetail>(`/engagement/admin/trivia/${triviaId}/attempts/${attemptId}/`),
};

/**
 * Authors are derived from published civic modules (public GET only).
 * POST/PATCH/DELETE are not available — Phase 1E.6 blocker.
 */
export const adminAuthorsApi = {
  list: () => adminFetch<{ results: AdminAuthor[] }>("/content/authors/"),
  get: (slug: string) =>
    adminFetch<{ author: AdminAuthor; modules: unknown[] }>(`/content/authors/${slug}/`),
};

/**
 * Forum threads: GET list/detail + POST create/reply + admin soft-delete.
 */
export const adminForumApi = {
  listThreads: (params?: {
    page?: number;
    chapter_id?: string;
    module_id?: string;
    search?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.chapter_id) q.set("chapter_id", params.chapter_id);
    if (params?.module_id) q.set("module_id", params.module_id);
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminForumThread>>(`/engagement/forum-threads/${qs ? `?${qs}` : ""}`);
  },
  getThread: (id: string) =>
    adminFetch<AdminForumThreadDetail>(`/engagement/forum-threads/${id}/`),
  createThread: (data: { title: string; civic_module?: string | null; civic_chapter?: string | null }) =>
    adminFetch<AdminForumThread>("/engagement/forum-threads/", { method: "POST", body: JSON.stringify(data) }),
  createPost: (threadId: string, content: string) =>
    adminFetch<AdminForumPost>(`/engagement/forum-threads/${threadId}/posts/`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  softDeleteThread: (id: string) =>
    adminFetch<void>(`/engagement/forum-threads/${id}/`, { method: "DELETE" }),
  softDeletePost: (threadId: string, postId: string) =>
    adminFetch<void>(`/engagement/forum-threads/${threadId}/posts/${postId}/`, { method: "DELETE" }),
};

// ── Doc repository ────────────────────────────────────────────────────────

export type AdminDocItem = {
  name: string;
  path: string;
  is_directory: boolean;
  size: number | null;
  modified: number;
  mime_type?: string;
};

export type AdminDocLink = {
  id: string;
  title: string;
  url: string;
  description: string;
  mime_type: string;
  order: number;
  folder_path?: string;
};

export type AdminDocListResponse = {
  path: string;
  items: AdminDocItem[];
  count: number;
  links: AdminDocLink[];
  link_count: number;
};

export const adminDocRepositoryApi = {
  list: (path = "") => {
    const qs = path ? `?path=${encodeURIComponent(path)}` : "";
    return adminFetch<AdminDocListResponse>(`/docrepository/files/${qs}`);
  },
  upload: (file: File, path = "") => {
    const form = new FormData();
    form.append("file", file);
    const qs = path ? `?path=${encodeURIComponent(path)}` : "";
    return adminFetch<AdminDocItem>(`/docrepository/files/upload/${qs}`, {
      method: "POST",
      body: form as unknown as BodyInit,
    });
  },
  deleteFile: (filePath: string) => {
    const encoded = filePath.split("/").map(encodeURIComponent).join("/");
    return adminFetch<void>(`/docrepository/files/${encoded}`, { method: "DELETE" });
  },
  createFolder: (name: string, path = "") =>
    adminFetch<AdminDocItem>("/docrepository/folders/", {
      method: "POST",
      body: JSON.stringify({ name, path }),
    }),
  deleteFolder: (folderPath: string) =>
    adminFetch<void>("/docrepository/folders/", {
      method: "DELETE",
      body: JSON.stringify({ path: folderPath }),
    }),
  renameFolder: (path: string, name: string) =>
    adminFetch<AdminDocItem>("/docrepository/folders/", {
      method: "PATCH",
      body: JSON.stringify({ path, name }),
    }),
  listLinks: (folder = "") => {
    const qs = folder ? `?folder=${encodeURIComponent(folder)}` : "";
    return adminFetch<{ links: AdminDocLink[]; count: number }>(`/docrepository/links/${qs}`);
  },
  createLink: (data: {
    title: string;
    url: string;
    folder?: string;
    description?: string;
    mime_type?: string;
    order?: number;
  }) =>
    adminFetch<AdminDocLink>("/docrepository/links/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLink: (
    linkId: string,
    data: Partial<{
      title: string;
      url: string;
      description: string;
      mime_type: string;
      order: number;
      folder_path: string;
      is_active: boolean;
    }>,
  ) =>
    adminFetch<AdminDocLink>(`/docrepository/links/${linkId}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLink: (linkId: string) =>
    adminFetch<void>(`/docrepository/links/${linkId}/`, { method: "DELETE" }),
  /** Same-origin API path for opening/proxying a file (cookie auth). */
  fileUrl: (filePath: string, download = false) => {
    const encoded = filePath.split("/").map(encodeURIComponent).join("/");
    const qs = download ? "?download=1" : "";
    return `/api/v1/docrepository/files/${encoded}${qs}`;
  },
  proxyLinkUrl: (linkId: string, mode: "view" | "download" = "view") =>
    `/api/v1/docrepository/links/${encodeURIComponent(linkId)}/proxy/?mode=${mode}`,
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

/** KE Budget fiscal year / allocation admin (legacy HTML parity — Phase 2F). */
export type AdminBudgetFiscalYear = {
  id: string;
  fiscal_year: number;
  label: string;
  starts_at?: string | null;
  ends_at?: string | null;
  is_current: boolean;
  allocations?: AdminBudgetAllocation[];
};

export type AdminBudgetAllocation = {
  id: string;
  entity_id: string;
  entity_name?: string;
  entity_code?: string;
  allocation_type: string;
  amount: string;
  notes?: string;
};

export type AdminBudgetEntity = {
  id: string;
  type: string;
  code: string;
  name: string;
  is_active: boolean;
  sort_order: number;
};

export type AdminBudgetFiscalYearWrite = {
  fiscal_year: number;
  label?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  is_current?: boolean;
};

export const adminKeBudgetApi = {
  listFiscalYears: () =>
    adminFetch<ApiListResponse<AdminBudgetFiscalYear>>("/budget/admin/fiscal-years/"),
  getFiscalYear: (id: string) =>
    adminFetch<AdminBudgetFiscalYear>(`/budget/admin/fiscal-years/${id}/`),
  createFiscalYear: (data: AdminBudgetFiscalYearWrite) =>
    adminFetch<AdminBudgetFiscalYear>("/budget/admin/fiscal-years/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFiscalYear: (id: string, data: Partial<AdminBudgetFiscalYearWrite>) =>
    adminFetch<AdminBudgetFiscalYear>(`/budget/admin/fiscal-years/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteFiscalYear: (id: string) =>
    adminFetch<void>(`/budget/admin/fiscal-years/${id}/`, { method: "DELETE" }),
  saveAllocations: (
    fyId: string,
    data: {
      allocations: Array<{
        entity_id: string;
        allocation_type?: string;
        amount: string | number;
        notes?: string;
      }>;
      delete_ids?: string[];
    },
  ) =>
    adminFetch<AdminBudgetFiscalYear>(`/budget/admin/fiscal-years/${fyId}/allocations/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  listEntities: (params?: { type?: string }) => {
    const q = new URLSearchParams();
    if (params?.type) q.set("type", params.type);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminBudgetEntity>>(
      `/budget/admin/entities/${qs ? `?${qs}` : ""}`,
    );
  },
};

export type AdminEventGallery = {
  id: string;
  url: string;
  label: string;
  display_order: number;
  is_active?: boolean;
};

export type AdminEvent = {
  id: string;
  title: string;
  summary: string;
  description: string;
  image_url?: string;
  location_url?: string;
  starts_at: string;
  ends_at?: string | null;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  physical_location?: string;
  galleries: AdminEventGallery[];
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminEventWrite = {
  title: string;
  summary?: string;
  description?: string;
  image_url?: string;
  location_url?: string;
  starts_at: string;
  ends_at?: string | null;
  is_active?: boolean;
  physical_location?: string;
  metadata?: Record<string, unknown>;
};

export const adminEventsApi = {
  list: () => adminFetch<ApiListResponse<AdminEvent>>("/content/admin/events/"),
  get: (id: string) => adminFetch<AdminEvent>(`/content/admin/events/${id}/`),
  create: (data: AdminEventWrite) =>
    adminFetch<AdminEvent>("/content/admin/events/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminEventWrite>) =>
    adminFetch<AdminEvent>(`/content/admin/events/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/content/admin/events/${id}/`, { method: "DELETE" }),
  listGalleries: (eventId: string) =>
    adminFetch<ApiListResponse<AdminEventGallery>>(`/content/admin/events/${eventId}/galleries/`),
  addGallery: (
    eventId: string,
    data: { url: string; label?: string; display_order?: number; link_id?: string },
  ) =>
    adminFetch<AdminEventGallery>(`/content/admin/events/${eventId}/galleries/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGallery: (
    eventId: string,
    linkId: string,
    data: Partial<{ url: string; label: string; display_order: number; is_active: boolean }>,
  ) =>
    adminFetch<AdminEventGallery>(`/content/admin/events/${eventId}/galleries/${linkId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteGallery: (eventId: string, linkId: string) =>
    adminFetch<void>(`/content/admin/events/${eventId}/galleries/${linkId}/`, { method: "DELETE" }),
};

export type AdminTikTokVideo = {
  id: string;
  tiktok_url: string;
  video_url: string;
  cover_image_url: string;
  embed_html: string;
  caption: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  like_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminTikTokWrite = {
  tiktok_url?: string;
  video_url?: string;
  cover_image_url?: string;
  embed_html?: string;
  caption?: string;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
};

export const adminTikTokApi = {
  list: (params?: { is_featured?: boolean; is_active?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.is_featured !== undefined) q.set("is_featured", String(params.is_featured));
    if (params?.is_active !== undefined) q.set("is_active", String(params.is_active));
    const qs = q.toString();
    return adminFetch<ApiListResponse<AdminTikTokVideo>>(
      `/content/admin/tiktok/${qs ? `?${qs}` : ""}`,
    );
  },
  get: (id: string) => adminFetch<AdminTikTokVideo>(`/content/admin/tiktok/${id}/`),
  create: (data: AdminTikTokWrite) =>
    adminFetch<AdminTikTokVideo>("/content/admin/tiktok/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<AdminTikTokWrite>) =>
    adminFetch<AdminTikTokVideo>(`/content/admin/tiktok/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    adminFetch<void>(`/content/admin/tiktok/${id}/`, { method: "DELETE" }),
};

export type AdminStudioService = {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  order: number;
  is_published: boolean;
};

export type AdminStudioPortfolio = {
  id: string;
  title: string;
  description: string;
  media_type: string;
  image_url: string;
  video_url: string;
  video_platform: string;
  category: string;
  order: number;
  is_published: boolean;
};

export type AdminStudioTestimonial = {
  id: string;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  image_url: string;
  order: number;
  is_published: boolean;
};

export type AdminStudioBooking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: string;
  notes: string;
  is_read: boolean;
  assigned_to_id?: string | null;
  assigned_to_email?: string | null;
  last_contacted_at?: string | null;
  follow_up_at?: string | null;
  created_at?: string | null;
  messages?: Array<{
    id: string;
    direction: string;
    message: string;
    sent_by_name?: string;
    created_at?: string | null;
  }>;
};

export type AdminProjectMilestone = {
  id: string;
  title: string;
  description: string;
  date?: string | null;
  image_url: string;
  milestone_type: string;
  order: number;
  is_published: boolean;
};

export type AdminProjectConfig = {
  mission: string;
  vision: string;
  about_text: string;
  updated_at?: string | null;
};

export const adminStudioApi = {
  listServices: () => adminFetch<ApiListResponse<AdminStudioService>>("/studio/admin/services/"),
  createService: (data: Partial<AdminStudioService>) =>
    adminFetch<AdminStudioService>("/studio/admin/services/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: Partial<AdminStudioService>) =>
    adminFetch<AdminStudioService>(`/studio/admin/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    adminFetch<void>(`/studio/admin/services/${id}/`, { method: "DELETE" }),
  listPortfolio: () => adminFetch<ApiListResponse<AdminStudioPortfolio>>("/studio/admin/portfolio/"),
  createPortfolio: (data: Partial<AdminStudioPortfolio>) =>
    adminFetch<AdminStudioPortfolio>("/studio/admin/portfolio/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePortfolio: (id: string, data: Partial<AdminStudioPortfolio>) =>
    adminFetch<AdminStudioPortfolio>(`/studio/admin/portfolio/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deletePortfolio: (id: string) =>
    adminFetch<void>(`/studio/admin/portfolio/${id}/`, { method: "DELETE" }),
  listTestimonials: () =>
    adminFetch<ApiListResponse<AdminStudioTestimonial>>("/studio/admin/testimonials/"),
  createTestimonial: (data: Partial<AdminStudioTestimonial>) =>
    adminFetch<AdminStudioTestimonial>("/studio/admin/testimonials/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: Partial<AdminStudioTestimonial>) =>
    adminFetch<AdminStudioTestimonial>(`/studio/admin/testimonials/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    adminFetch<void>(`/studio/admin/testimonials/${id}/`, { method: "DELETE" }),
  listBookings: (params?: { status?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<{
      results: AdminStudioBooking[];
      summary?: { total: number; unread: number; by_status: Record<string, number> };
    }>(`/studio/admin/bookings/${qs ? `?${qs}` : ""}`);
  },
  getBooking: (id: string) => adminFetch<AdminStudioBooking>(`/studio/admin/bookings/${id}/`),
  updateBooking: (
    id: string,
    data: Partial<{ status: string; notes: string; is_read: boolean; assigned_to_id: string | null }>,
  ) =>
    adminFetch<AdminStudioBooking>(`/studio/admin/bookings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteBooking: (id: string) =>
    adminFetch<void>(`/studio/admin/bookings/${id}/`, { method: "DELETE" }),
  addBookingMessage: (id: string, message: string) =>
    adminFetch<{ id: string }>(`/studio/admin/bookings/${id}/messages/`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

export const adminProjectApi = {
  listMilestones: () =>
    adminFetch<ApiListResponse<AdminProjectMilestone>>("/project/admin/milestones/"),
  createMilestone: (data: Partial<AdminProjectMilestone>) =>
    adminFetch<AdminProjectMilestone>("/project/admin/milestones/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMilestone: (id: string, data: Partial<AdminProjectMilestone>) =>
    adminFetch<AdminProjectMilestone>(`/project/admin/milestones/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteMilestone: (id: string) =>
    adminFetch<void>(`/project/admin/milestones/${id}/`, { method: "DELETE" }),
  getConfig: () => adminFetch<AdminProjectConfig>("/project/admin/config/"),
  updateConfig: (data: Partial<AdminProjectConfig>) =>
    adminFetch<AdminProjectConfig>("/project/admin/config/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const adminRolesApi = {
  list: () => adminFetch<ApiListResponse<AdminRole>>("/roles/"),
  get: (id: string) => adminFetch<AdminRole>(`/roles/${id}/`),
  permissions: () => adminFetch<AdminPermission[]>("/roles/permissions/"),
  create: (data: AdminRoleWrite) =>
    adminFetch<AdminRole>("/roles/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminRoleWrite>) =>
    adminFetch<AdminRole>(`/roles/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/roles/${id}/`, { method: "DELETE" }),
};

export type AdminPermission = {
  id: number;
  codename: string;
  name: string;
  app_label: string;
  model: string;
};

export type AdminRoleWrite = {
  name?: string;
  slug?: string;
  description?: string;
  priority?: number;
  permission_ids?: number[];
};

export type AdminGamificationRule = {
  id: string | null;
  event_type: string;
  label: string;
  hint?: string;
  points: number;
  is_active: boolean;
  description: string;
  configured: boolean;
};

export type AdminBadge = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  condition_type: string;
  condition_value: number;
  tier: string;
  family: string;
  is_active: boolean;
};

export type AdminBadgeWrite = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  points_required?: number;
  condition_type?: string;
  condition_value?: number;
  tier?: string;
  family?: string;
  is_active?: boolean;
};

export const adminGamificationApi = {
  listRules: () =>
    adminFetch<{ results: AdminGamificationRule[] }>("/gamification/rules/"),
  saveRules: (rules: Array<{ event_type: string; points: number; is_active?: boolean; description?: string }>) =>
    adminFetch<{ results: AdminGamificationRule[] }>("/gamification/rules/", {
      method: "PUT",
      body: JSON.stringify({ rules }),
    }),
  seedRules: () =>
    adminFetch<{ detail: string; created: number }>("/gamification/rules/seed/", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  listBadges: () =>
    adminFetch<{ results: AdminBadge[] }>("/gamification/badges/"),
  createBadge: (data: AdminBadgeWrite) =>
    adminFetch<AdminBadge>("/gamification/badges/", { method: "POST", body: JSON.stringify(data) }),
  updateBadge: (id: string, data: Partial<AdminBadgeWrite>) =>
    adminFetch<AdminBadge>(`/gamification/badges/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deactivateBadge: (id: string) =>
    adminFetch<AdminBadge>(`/gamification/badges/${id}/`, { method: "DELETE" }),
};

export type AdminInvoiceItem = {
  description: string;
  quantity: string | number;
  unit_price: string | number;
};

export type AdminInvoice = {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: string;
  items: AdminInvoiceItem[];
  subtotal: string;
  tax_rate: string;
  tax_amount: string;
  total: string;
  currency: string;
  status: "DRAFT" | "SENT" | "PAID" | "CANCELLED";
  issue_date: string;
  due_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type AdminInvoiceWrite = {
  invoice_number: string;
  client_name: string;
  client_email?: string;
  client_address?: string;
  items: AdminInvoiceItem[];
  tax_rate?: number | string;
  currency?: string;
  status?: AdminInvoice["status"];
  issue_date: string;
  due_date: string;
  notes?: string;
};

export type AdminInvoiceSummary = {
  total_count: number;
  draft_count: number;
  sent_count: number;
  paid_count: number;
  cancelled_count: number;
  total_revenue: string;
};

export const adminInvoicesApi = {
  list: (params?: { status?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<{ results: AdminInvoice[]; summary: AdminInvoiceSummary }>(
      `/invoices/${qs ? `?${qs}` : ""}`,
    );
  },
  get: (id: string) => adminFetch<AdminInvoice>(`/invoices/${id}/`),
  create: (data: AdminInvoiceWrite) =>
    adminFetch<AdminInvoice>("/invoices/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminInvoiceWrite> & { status?: AdminInvoice["status"] }) =>
    adminFetch<AdminInvoice>(`/invoices/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/invoices/${id}/`, { method: "DELETE" }),
};

export type AdminUser = {
  id: string;
  membership_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  avatar?: string | null;
  role: string;
  role_slug?: string;
  is_active: boolean;
  membership_is_active?: boolean;
  is_verified?: boolean;
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
  status: string;
  image_url?: string;
  order?: number;
  author_id?: string | null;
  author_is_team?: boolean;
  trivia_id?: string | null;
  is_financial_year_analysis?: boolean;
  fiscal_year_id?: string | null;
  chapter_count?: number;
  created_at: string;
  updated_at: string;
};

export type AdminChapter = {
  id: string;
  title: string;
  order: number;
  youtube_url?: string;
  youtube_urls?: string[];
  audio_url?: string;
  image_urls?: string[];
  learning_outcomes?: unknown[];
  budget_entity_id?: string | null;
  trivia_id?: string | null;
  articles?: Array<{ id: string; title: string; slug: string; format: string; state: string }>;
  updated_at?: string | null;
};

export type AdminModuleDetail = AdminModule & {
  chapters?: AdminChapter[];
  allowed_actions?: string[];
};

export type AdminModuleWrite = {
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  status?: string;
  author_id?: string | null;
  author_is_team?: boolean;
  order?: number;
  is_financial_year_analysis?: boolean;
  fiscal_year_id?: string | null;
  trivia_id?: string | null;
};

export type AdminChapterWrite = {
  title: string;
  order?: number;
  youtube_url?: string;
  youtube_urls?: string[];
  audio_url?: string;
  image_urls?: string[];
  learning_outcomes?: unknown[];
  budget_entity_id?: string | null;
};

export type AdminSurvey = {
  id: string;
  title: string;
  description: string;
  status: string;
  image_url?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  allow_anonymous: boolean;
  external_url?: string;
  is_external?: boolean;
  question_count?: number;
  response_count?: number;
  created_at: string;
  updated_at: string;
};

export type AdminSurveyQuestion = {
  id: string;
  text: string;
  question_type: string;
  choices: string[];
  is_required: boolean;
  order: number;
};

export type AdminSurveyDetail = AdminSurvey & {
  questions?: AdminSurveyQuestion[];
  allowed_transitions?: string[];
};

export type AdminSurveyWrite = {
  title: string;
  description?: string;
  image_url?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  allow_anonymous?: boolean;
  external_url?: string;
};

export type AdminSurveyQuestionWrite = {
  text: string;
  question_type: string;
  choices?: string[];
  is_required?: boolean;
  order?: number;
};

export type AdminSurveyResults = {
  survey_id?: string;
  title?: string;
  total_responses?: number;
  response_count?: number;
  questions?: Array<{
    question_id?: string;
    id?: string;
    text: string;
    type?: string;
    question_type?: string;
    response_count?: number;
    counts?: Record<string, number>;
    percentages?: Record<string, number>;
    average?: number | null;
    samples?: unknown[];
    aggregates?: Record<string, unknown>;
  }>;
  [key: string]: unknown;
};

export type AdminTrivia = {
  id: string;
  title: string;
  source_content_type: string;
  source_content_id: string;
  source_link?: string;
  status: string;
  points: number;
  expiry_hours: number;
  published_at?: string | null;
  expires_at?: string | null;
  question_count?: number;
  attempt_count?: number;
  created_at: string;
  updated_at: string;
};

export type AdminTriviaQuestion = {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_index?: number | null;
  explanation?: string;
  order: number;
  points_override?: number | null;
};

export type AdminTriviaDetail = AdminTrivia & {
  questions?: AdminTriviaQuestion[];
};

export type AdminTriviaWrite = {
  title: string;
  source_content_type?: string;
  source_content_id?: string;
  source_link?: string;
  points?: number;
  expiry_hours?: number;
};

export type AdminTriviaQuestionWrite = {
  question_text: string;
  question_type?: string;
  options: string[];
  correct_index?: number;
  explanation?: string;
  order?: number;
  points_override?: number | null;
};

export type AdminTriviaAttemptsPage = {
  count: number;
  page: number;
  page_size: number;
  results: Array<{ id: string; user_email: string; score: number; completed_at: string }>;
};

export type AdminTriviaAttemptDetail = {
  id?: string;
  user_email?: string;
  score?: number;
  completed_at?: string;
  questions?: Array<{
    id: string;
    question_text: string;
    options: string[];
    correct_index?: number | null;
    selected_index?: number | null;
    selected_label?: string;
    is_correct?: boolean;
  }>;
  [key: string]: unknown;
};

/** Derived from published civic modules — GET shape; id/created_at may be absent. */
export type AdminAuthor = {
  id?: string;
  name: string;
  slug: string;
  image: string;
  role: string;
  bio: string;
  created_at?: string;
  intro_video_url?: string;
  socials?: Record<string, string>;
};

export type AdminForumPost = {
  id: string;
  content: string;
  upvotes: number;
  author_name: string;
  author_initials: string;
  author_id?: string | null;
  author_avatar?: string | null;
  created_at: string;
};

export type AdminForumThread = {
  id: string;
  title: string;
  author_name: string;
  author_initials?: string;
  posts_count: number;
  created_at: string;
  civic_module?: string | null;
  civic_chapter?: string | null;
};

export type AdminForumThreadDetail = AdminForumThread & {
  posts: AdminForumPost[];
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
  slug?: string;
  description?: string;
  priority?: number;
  permissions: string[];
  permission_ids?: number[];
  user_count: number;
  is_builtin?: boolean;
  created_at: string;
  updated_at?: string;
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
  avg_hit_seconds?: number;
  total_engagement_seconds?: number;
  top_paths_by_time?: {
    path: string;
    total_seconds: number;
    avg_seconds: number;
    hits: number;
    share_pct: number;
  }[];
  insights?: {
    id: string;
    severity: "info" | "positive" | "warning" | "attention";
    title: string;
    body: string;
  }[];
  tracked_sessions?: number;
  tracked_pageleaves?: number;
  traffic_source?: "vercel" | "local" | "first-party" | "local+vercel";
  traffic_synced_at?: string | null;
  events_as_of?: string | null;
  events_count?: number;

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

  monthly_trends?: { month: string; tasks_created: number; new_users: number }[];
  total_tasks?: number;
  published_tasks?: number;
  avg_progress_pct?: number;
  unique_visitors?: number;
  total_pageviews?: number;
};

/** Nested payload from GET /api/v1/analytics/dashboard/ (DashboardStatsAPI). */
export type AdminDashboardStats = {
  snapshot: {
    date: string | null;
    total_pageviews: number;
    unique_visitors: number;
    uptime_percentage: number;
  };
  users: {
    total: number;
    recent_signups_30d: number;
    engagement_rate: number;
  };
  weekly_notes: {
    total: number;
    published: number;
    avg_progress_pct: number;
  };
  content: {
    civic_modules: number;
    civic_chapters: number;
    knowledge_entries: number;
    articles: number;
    stories: number;
    events: number;
    learning_courses: number;
    youtube_videos: number;
    tiktok_videos: number;
  };
  engagement: {
    surveys: number;
    survey_responses: number;
    trivia_sets: number;
    trivia_attempts: number;
    forum_threads: number;
    forum_posts: number;
    content_feedback: number;
    bookmarks: number;
    newsletter_subscribers: number;
  };
  gamification: {
    learner_profiles: number;
    total_points_earned: number;
    badges_issued: number;
    certificates_issued: number;
    challenges_completed: number;
    referrals_made: number;
  };
  budget: {
    fiscal_years: number;
    budget_entities: number;
    budget_allocations: number;
    budget_executions: number;
    programmes: number;
    revenue_streams: number;
    source_documents: number;
  };
  monthly_trends: { month: string; tasks_created: number; new_users: number }[];
};

export type ModuleAnalytics = {
  period: string;
  completions_over_time: { period: string | null; count: number }[];
  top_modules: { slug: string; title: string; completions: number }[];
  event_summary_last_30d: Record<string, number>;
  total_modules_published: number;
};

export const adminAnalyticsApi = {
  summary: (period?: string) => {
    const qs = period ? `?period=${period}` : "";
    return adminFetch<AdminAnalyticsSummary>(`/analytics/summary/${qs}`);
  },
  dashboard: () => adminFetch<AdminDashboardStats>("/analytics/dashboard/"),
  moduleAnalytics: (params?: { period?: "daily" | "weekly"; module_slug?: string }) => {
    const q = new URLSearchParams();
    if (params?.period) q.set("period", params.period);
    if (params?.module_slug) q.set("module_slug", params.module_slug);
    const qs = q.toString();
    return adminFetch<ModuleAnalytics>(`/content/analytics/modules/${qs ? `?${qs}` : ""}`);
  },
};

// ΓöÇΓöÇ Communication / Campaigns ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type NewsletterCampaign = {
  id: string;
  subject: string;
  image_url?: string;
  body_plain?: string;
  body_html?: string;
  status: string;
  status_display: string;
  audience_type: string;
  audience_type_display: string;
  audience_filter?: Record<string, unknown>;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_by_email?: string;
  created_at: string;
  updated_at: string;
};

export const adminCampaignsApi = {
  list: (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NewsletterCampaign>>(`/newsletter/campaigns/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<NewsletterCampaign>(`/newsletter/campaigns/${id}/`),
  create: (data: Partial<NewsletterCampaign>) =>
    adminFetch<NewsletterCampaign>("/newsletter/campaigns/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<NewsletterCampaign>) =>
    adminFetch<NewsletterCampaign>(`/newsletter/campaigns/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    adminFetch<void>(`/newsletter/campaigns/${id}/`, { method: "DELETE" }),
  send: (id: string) =>
    adminFetch<NewsletterCampaign>(`/newsletter/campaigns/${id}/send/`, { method: "POST" }),
  schedule: (id: string, scheduledAt: string) =>
    adminFetch<NewsletterCampaign>(`/newsletter/campaigns/${id}/schedule/`, {
      method: "POST", body: JSON.stringify({ scheduled_at: scheduledAt }),
    }),
  preview: (id: string) =>
    adminFetch<
      NewsletterCampaign & {
        audience_count: number;
        sample_emails: string[];
        send_logs?: { id: string; subscriber_email: string; status: string; status_display: string }[];
      }
    >(`/newsletter/campaigns/${id}/preview/`),
};

// ── Communication / Subscribers ──────────────────────────────────────────

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string;
  consent_at: string;
  unsubscribed_at?: string | null;
  source?: string;
  created_at: string;
};

export const adminSubscribersApi = {
  list: (params?: { page?: number; active_only?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.active_only === false) q.set("active_only", "false");
    const qs = q.toString();
    return adminFetch<ApiListResponse<NewsletterSubscriber>>(
      `/newsletter/subscribers/${qs ? `?${qs}` : ""}`,
    );
  },
};

// ── Communication / Inbox ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type NewsletterInboxMessage = {
  id: string;
  message_type: string;
  message_type_display: string;
  from_email?: string;
  subject: string;
  body_plain?: string;
  is_read: boolean;
  related_subscriber?: string | null;
  related_subscriber_email?: string | null;
  related_campaign?: string | null;
  related_campaign_subject?: string | null;
  received_at: string;
  created_at: string;
};

export const adminInboxApi = {
  list: (params?: { page?: number; message_type?: string; is_read?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.message_type) q.set("message_type", params.message_type);
    if (params?.is_read !== undefined) q.set("is_read", String(params.is_read));
    const qs = q.toString();
    return adminFetch<ApiListResponse<NewsletterInboxMessage>>(`/newsletter/inbox/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<NewsletterInboxMessage>(`/newsletter/inbox/${id}/`),
  markRead: (id: string) =>
    adminFetch<NewsletterInboxMessage>(`/newsletter/inbox/${id}/read/`, { method: "POST" }),
  createNote: (data: { subject: string; body_plain: string }) =>
    adminFetch<NewsletterInboxMessage>("/newsletter/inbox/notes/", { method: "POST", body: JSON.stringify(data) }),
};

// ΓöÇΓöÇ Communication / Outbox ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type NewsletterOutboxEmail = {
  id: string;
  email_type: string;
  email_type_display: string;
  subscriber_email: string;
  recipient: string;
  subject: string;
  status: string;
  status_display: string;
  attempts: number;
  error_message?: string;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
};

export const adminOutboxApi = {
  list: (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NewsletterOutboxEmail>>(`/newsletter/outbox/${qs ? `?${qs}` : ""}`);
  },
  dispatch: () =>
    adminFetch<{ processed: number; sent: number; failed: number }>("/newsletter/outbox/dispatch/", { method: "POST" }),
  retry: (id: string) =>
    adminFetch<NewsletterOutboxEmail>(`/newsletter/outbox/${id}/retry/`, { method: "POST" }),
};

// ΓöÇΓöÇ Communication / Contact Messages ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  status_display: string;
  source: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
};

export const adminContactMessagesApi = {
  list: (params?: { page?: number; status?: string; q?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    if (params?.q) q.set("q", params.q);
    const qs = q.toString();
    return adminFetch<ApiListResponse<ContactMessage>>(`/contact/messages/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => adminFetch<ContactMessage>(`/contact/messages/${id}/`),
  reply: (id: string, replyBody: string) =>
    adminFetch<ContactMessage>(`/contact/messages/${id}/reply/`, {
      method: "POST", body: JSON.stringify({ reply_body: replyBody }),
    }),
  markRead: (id: string) =>
    adminFetch<ContactMessage>(`/contact/messages/${id}/read/`, { method: "POST" }),
  delete: (id: string) =>
    adminFetch<void>(`/contact/messages/${id}/delete/`, { method: "DELETE" }),
};

// ΓöÇΓöÇ Communication / Email Hooks ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type EmailHook = {
  id: string;
  recipient: string;
  subject: string;
  source: string;
  status: string;
  status_display: string;
  error_message?: string;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
};

export const adminEmailHooksApi = {
  list: (params?: { status?: string; source?: string; q?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.source) q.set("source", params.source);
    if (params?.q) q.set("q", params.q);
    const qs = q.toString();
    return adminFetch<{
      counts: Record<string, number>;
      sources: string[];
      results: EmailHook[];
    }>(`/email-hooks/${qs ? `?${qs}` : ""}`);
  },
  resend: (id: string) =>
    adminFetch<EmailHook>(`/email-hooks/${id}/resend/`, { method: "POST" }),
};

// ── Communication / Notification Queue & History ─────────────────────────

export type NotificationQueueItem = {
  id: string;
  trigger_type: string;
  target_user: string;
  target_user_email: string;
  obj_id: string;
  payload: Record<string, unknown>;
  status: string;
  status_display: string;
  skip_reason: string;
  scheduled_at: string;
  dispatched_at?: string | null;
  attempts: number;
  correlation_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type TriggerRule = {
  id: string;
  event_type: string;
  conditions: Record<string, unknown> | unknown[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type AuditLogEntry = {
  id: string;
  actor?: string | null;
  actor_email?: string | null;
  action: string;
  target_model: string;
  target_id?: string | null;
  correlation_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  before_state?: Record<string, unknown> | null;
  after_state?: Record<string, unknown> | null;
  created_at: string;
};

/** Normalize DRF list responses that may be paginated or a bare array. */
export function normalizeListResponse<T>(res: ApiListResponse<T> | T[]): { results: T[]; count: number } {
  if (Array.isArray(res)) return { results: res, count: res.length };
  const results = res.results ?? [];
  return { results, count: res.count ?? results.length };
}

export const adminNotificationsApi = {
  queue: (params?: { page?: number; status?: string; trigger_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    if (params?.trigger_type) q.set("trigger_type", params.trigger_type);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NotificationQueueItem> | NotificationQueueItem[]>(
      `/engagement/notifications/admin/${qs ? `?${qs}` : ""}`,
    );
  },
  history: (params?: { page?: number; status?: string; trigger_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    if (params?.trigger_type) q.set("trigger_type", params.trigger_type);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NotificationQueueItem> | NotificationQueueItem[]>(
      `/engagement/notification-history/${qs ? `?${qs}` : ""}`,
    );
  },
  triggerRules: () =>
    adminFetch<ApiListResponse<TriggerRule> | TriggerRule[]>("/engagement/trigger-rules/"),
  toggleRule: (id: string, enabled: boolean) =>
    adminFetch<TriggerRule>(`/engagement/trigger-rules/${id}/toggle/`, {
      method: "POST",
      body: JSON.stringify({ enabled }),
    }),
};

export const adminAuditLogsApi = {
  list: (params?: { page?: number; q?: string; action?: string; target_model?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.q) q.set("q", params.q);
    if (params?.action) q.set("action", params.action);
    if (params?.target_model) q.set("target_model", params.target_model);
    const qs = q.toString();
    return adminFetch<ApiListResponse<AuditLogEntry> | AuditLogEntry[]>(
      `/audit-logs/${qs ? `?${qs}` : ""}`,
    );
  },
};

// ── Communication / Content Feedback ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type ContentFeedbackItem = {
  id: string;
  content_type: string;
  content_id: string;
  rating: number;
  comment: string;
  status: string;
  status_display: string;
  created_by?: string | null;
  created_by_email?: string | null;
  created_at: string;
};

export const adminContentFeedbackApi = {
  list: (params?: { content_type?: string; status?: string; content_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.content_type) q.set("content_type", params.content_type);
    if (params?.status) q.set("status", params.status);
    if (params?.content_id) q.set("content_id", params.content_id);
    const qs = q.toString();
    return adminFetch<ApiListResponse<ContentFeedbackItem>>(`/engagement/feedback/admin/${qs ? `?${qs}` : ""}`);
  },
  summary: () => adminFetch<{
    total: number;
    average_rating: number;
    rating_distribution: Record<string, number>;
    by_content_type: Record<string, number>;
    by_status: Record<string, number>;
  }>("/engagement/feedback/summary/"),
  submit: (data: { content_type: string; content_id: string; rating: number; comment?: string }) =>
    adminFetch<ContentFeedbackItem>("/engagement/feedback/", { method: "POST", body: JSON.stringify(data) }),
};

// ── Content admin (Phase 1E) ─────────────────────────────────────────────

export type ContentTransitionAction = "submit_review" | "reject_to_draft" | "publish" | "archive";
export type ContentPublishState = "draft" | "review" | "published" | "archived" | string;

export type AdminContentUnitListItem = {
  id: string;
  title: string;
  slug: string;
  format: "article" | "story" | string;
  state: ContentPublishState;
  updated_at: string;
};

export type AdminContentUnitDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  body_html: string;
  format: string;
  state: ContentPublishState;
  metadata: Record<string, unknown>;
  published_at: string | null;
  tags: { id: string; name: string; slug: string }[];
};

export type AdminContentUnitWrite = {
  title: string;
  format: "article" | "story";
  slug?: string;
  summary?: string;
  body?: string;
  body_html?: string;
  metadata?: Record<string, unknown>;
  tag_ids?: string[];
  author_id?: string | null;
  author_is_team?: boolean;
};

export type AdminContentUnitUpdate = {
  title?: string;
  slug?: string;
  summary?: string;
  body?: string;
  body_html?: string;
  metadata?: Record<string, unknown>;
  tag_ids?: string[];
  author_id?: string | null;
  author_is_team?: boolean;
};

function contentUnitCollection(format: "article" | "story") {
  return format === "story" ? "stories" : "articles";
}

/** Articles + stories admin CRUD (PUT updates) + workflow transition. No DELETE. */
export const adminContentUnitsApi = {
  list: (format: "article" | "story") =>
    adminFetch<{ results: AdminContentUnitListItem[] }>(
      `/content/admin/${contentUnitCollection(format)}/?format=${format}`,
    ),
  get: (format: "article" | "story", id: string) =>
    adminFetch<AdminContentUnitDetail>(`/content/admin/${contentUnitCollection(format)}/${id}/`),
  create: (data: AdminContentUnitWrite) =>
    adminFetch<{ id: string; slug: string }>(`/content/admin/${contentUnitCollection(data.format)}/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (format: "article" | "story", id: string, data: AdminContentUnitUpdate) =>
    adminFetch<{ id: string; slug: string; title: string; state: string }>(
      `/content/admin/${contentUnitCollection(format)}/${id}/`,
      { method: "PUT", body: JSON.stringify(data) },
    ),
  transition: (format: "article" | "story", id: string, action: ContentTransitionAction) =>
    adminFetch<{ id: string; state: string }>(
      `/content/admin/${contentUnitCollection(format)}/${id}/transition/`,
      { method: "POST", body: JSON.stringify({ action }) },
    ),
};

export type AdminKnowledgeListItem = {
  id: string;
  title: string;
  state: ContentPublishState;
  updated_at: string;
};

export type AdminKnowledgeDetail = {
  id: string;
  title: string;
  summary: string;
  body: string;
  state: ContentPublishState;
  published_at: string | null;
  tags: { id: string; name: string; slug: string }[];
};

export type AdminKnowledgeWrite = {
  title: string;
  summary?: string;
  body?: string;
  tag_ids?: string[];
};

export const adminKnowledgeApi = {
  list: () => adminFetch<{ results: AdminKnowledgeListItem[] }>("/content/admin/knowledge/"),
  get: (id: string) => adminFetch<AdminKnowledgeDetail>(`/content/admin/knowledge/${id}/`),
  create: (data: AdminKnowledgeWrite) =>
    adminFetch<{ id: string }>("/content/admin/knowledge/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminKnowledgeWrite>) =>
    adminFetch<{ id: string; state: string }>(`/content/admin/knowledge/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  transition: (id: string, action: ContentTransitionAction) =>
    adminFetch<{ id: string; state: string }>(`/content/admin/knowledge/${id}/transition/`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
};

export type AdminCourseListItem = {
  id: string;
  module_code: string;
  title: string;
  slug: string;
  state: ContentPublishState;
  lesson_count: number;
};

export type AdminCourseDetail = {
  id: string;
  module_code: string;
  title: string;
  slug: string;
  fiscal_year?: number | null;
  credits?: string;
  summary?: string;
  state: ContentPublishState;
  county_code?: string | null;
  sector?: string | null;
  image_url?: string | null;
  external_source_url?: string | null;
  published_at?: string | null;
  lessons?: { id: string; title: string; order: number; kind?: string }[];
};

export type AdminCourseWrite = {
  title: string;
  slug?: string;
  unit_slug?: string | null;
  fiscal_year?: number | null;
  module_code?: string;
  credits?: string;
  summary?: string;
  county_code?: string;
  sector?: string;
  image_url?: string;
  external_source_url?: string;
};

/** Courses: list/create/detail/PUT. No transition JSON endpoint. */
export const adminCoursesApi = {
  list: () => adminFetch<{ results: AdminCourseListItem[] }>("/content/admin/courses/"),
  get: (id: string) => adminFetch<AdminCourseDetail>(`/content/admin/courses/${id}/`),
  create: (data: AdminCourseWrite) =>
    adminFetch<{ id: string; slug: string }>("/content/admin/courses/create/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: AdminCourseWrite) =>
    adminFetch<{ id: string; slug: string; state: string }>(`/content/admin/courses/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export type AdminMediaUploadResult = {
  id: string;
  location: string;
  url: string;
};

export const adminMediaApi = {
  upload: (file: File, altText?: string) => {
    const form = new FormData();
    form.append("file", file);
    if (altText) form.append("alt_text", altText);
    return adminFetch<AdminMediaUploadResult>("/content/admin/media/upload/", {
      method: "POST",
      body: form,
    });
  },
};

export type YouTubeSyncResult = {
  status?: string;
  created?: number;
  updated?: number;
  skipped?: number;
  detail?: string;
  [key: string]: unknown;
};

export const adminYouTubeSyncApi = {
  sync: () =>
    adminFetch<YouTubeSyncResult>("/content/sync/youtube/", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

export function availableContentTransitions(
  state: string,
): { action: ContentTransitionAction; label: string }[] {
  switch (state) {
    case "draft":
      return [{ action: "submit_review", label: "Submit for review" }];
    case "review":
      return [
        { action: "reject_to_draft", label: "Reject to draft" },
        { action: "publish", label: "Publish" },
      ];
    case "published":
      return [{ action: "archive", label: "Archive" }];
    default:
      return [];
  }
}
