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

/** Org team directory — GET list + stats only. Writes (role/deactivate) are HTML-only until Phase 2H. */
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
};

/** Seeded role slugs (no public Roles list API yet — Phase 3.1). */
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
  createThread: (data: { title: string; civic_module?: string | null }) =>
    adminFetch<AdminForumThread>("/engagement/forum-threads/", { method: "POST", body: JSON.stringify(data) }),
  updateThread: (id: string, data: { title?: string; civic_module?: string | null }) =>
    adminFetch<AdminForumThread>(`/engagement/forum-threads/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
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

// ── Communication / Campaigns ──────────────────────────────────────────────

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
    adminFetch<NewsletterCampaign & { audience_count: number; sample_emails: string[] }>(
      `/newsletter/campaigns/${id}/preview/`,
    ),
};

// ── Communication / Inbox ─────────────────────────────────────────────────

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

// ── Communication / Outbox ───────────────────────────────────────────────

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

// ── Communication / Contact Messages ────────────────────────────────────

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

// ── Communication / Email Hooks ──────────────────────────────────────────

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

export const adminNotificationsApi = {
  queue: (params?: { status?: string; trigger_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.trigger_type) q.set("trigger_type", params.trigger_type);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NotificationQueueItem>>(`/engagement/notifications/admin/${qs ? `?${qs}` : ""}`);
  },
  history: (params?: { status?: string; trigger_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.trigger_type) q.set("trigger_type", params.trigger_type);
    const qs = q.toString();
    return adminFetch<ApiListResponse<NotificationQueueItem>>(`/engagement/notification-history/${qs ? `?${qs}` : ""}`);
  },
  triggerRules: () => adminFetch<ApiListResponse<NotificationQueueItem>>("/engagement/trigger-rules/"),
  toggleRule: (id: string, enabled: boolean) =>
    adminFetch<NotificationQueueItem>(`/engagement/trigger-rules/${id}/toggle/`, {
      method: "POST", body: JSON.stringify({ enabled }),
    }),
};

// ── Communication / Content Feedback ─────────────────────────────────────

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
