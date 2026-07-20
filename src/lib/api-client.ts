import { buildApiUrl, networkErrorMessage } from "@/lib/api-url";
import { ApiRequestError, extractApiErrorMessage, extractFieldErrors, type ApiPayload } from "@/lib/api-errors";
import { apiFetchInit } from "@/lib/fetch-policy";
import { logDebug } from "@/lib/debug-logs";
import type {
  WeeklyNoteApi,
  WeeklyNoteCreateApi,
  AnalyticsSummaryApi,
  StudioServiceApi,
  StudioPortfolioItemApi,
  StudioTestimonialApi,
  StudioBookingApi,
} from "@/types/notes";

export { buildApiUrl };
export type {
  WeeklyNoteApi,
  WeeklyNoteCreateApi,
  AnalyticsSummaryApi,
  StudioServiceApi,
  StudioPortfolioItemApi,
  StudioTestimonialApi,
  StudioBookingApi,
};

export type ApiListResponse<T> = {
  count?: number;
  results: T[];
};

export type SurveyQuestionApi = {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "rating" | "boolean";
  choices: string[];
  is_required: boolean;
  order: number;
};

export type SurveyListItemApi = {
  id: string;
  title: string;
  description?: string;
  allow_anonymous?: boolean;
  status?: string;
  external_url?: string | null;
  is_external?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  image?: string;
  image_url?: string;
};

export type SurveyDetailApi = {
  id: string;
  title: string;
  description?: string;
  allow_anonymous: boolean;
  external_url?: string | null;
  is_external?: boolean;
  questions: SurveyQuestionApi[];
  image?: string;
  image_url?: string;
};

export type TriviaQuestionApi = {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "reflection";
  options: string[];
  order: number;
  correct_index?: number;
  explanation?: string;
};

export type TriviaSetApi = {
  id: string;
  title: string;
  questions: TriviaQuestionApi[];
  points?: number;
  expires_at?: string | null;
};

export type TriviaLeaderboardRow = {
  display_name?: string;
  score?: number;
  rank?: number;
  completed_at?: string;
};

export type TikTokVideoApi = {
  id: string;
  video_url: string;
  cover_image_url: string;
  embed_html: string;
  caption: string;
  like_count: number;
  tiktok_like_count: number;
  tiktok_comment_count: number;
  tiktok_share_count: number;
  tiktok_play_count: number;
};

export type TikTokVideoDetailApi = TikTokVideoApi & {
  tiktok_url: string;
};

export type OrgConfigApi = {
  tagline?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    og_image?: string;
    favicon?: string;
  };
  layout?: {
    show_newsletter_signup?: boolean;
    show_partner_carousel?: boolean;
    footer_note?: string;
  };
  socials?: { platform: string; url: string; label?: string }[];
  partners?: {
    name: string;
    slug?: string;
    logo_url?: string;
    website_url?: string;
    tier?: string;
    role?: string;
    description?: string;
    is_consortium?: boolean;
  }[];
  updated_at?: string;
};

export type SocialLinkApi = {
  platform: string;
  url: string;
  visibility: string;
  order?: number;
};

export type UserRole = {
  slug: string;
  name: string;
};

export type UserProfileApi = {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  display_name?: string;
  bio?: string;
  headline?: string;
  location?: string;
  avatar?: string | null;
  avatar_url?: string | null;
  profile_visibility?: string;
  allow_discovery?: boolean;
  show_email_publicly?: boolean;
  event_toggles?: Record<string, boolean>;
  digest_frequency?: string;
  social_links?: SocialLinkApi[];
  metadata?: Record<string, unknown>;
  county?: string;
  ward?: string;
  budget_priorities?: string[];
  language_preference?: string;
  age_range?: string;
  education_level?: string;
  date_of_birth?: string;
  break_name?: string;
  pseudo_name?: string;
  phone_number?: string;
  notifications_enabled?: boolean;
  whatsapp_fallback?: boolean;
  dpa_consent_granted?: boolean;
  dpa_consent_timestamp?: string;
  onboarding_completed_at?: string;
};

export type AuthLoginResponse = {
  detail: string;
};

export type AuthRegisterResponse = {
  user: { id: string; email: string };
  detail: string;
};

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  auth?: boolean;
  credentials?: RequestCredentials;
  _retry?: boolean;
};

export function getAccessToken(): string | null {
  return null;
}

export function getRefreshToken(): string | null {
  return null;
}

export function setAuthTokens(_access: string, _refresh?: string): void {
  // Tokens are managed server-side via Set-Cookie headers.
}

export function clearAuthTokens(): void {
  // Tokens are HttpOnly cookies — can't clear them from JS.
}

/**
 * @deprecated Use isLoggedIn from useAuth() instead.
 */
export function isAuthenticated(): boolean {
  return false;
}

/**
 * @deprecated Token storage mode is no longer relevant.
 */
export function getTokenStorageMode(): "hybrid" | "legacy" {
  return "hybrid";
}

/** Backward-compat alias — login no longer returns tokens in the body. */
export function normalizeLoginResponse(
  _raw: Record<string, unknown>,
): { access: string; refresh?: string } | null {
  return null;
}

// ---------------------------------------------------------------------------
// Silent refresh — uses the bns_rt HttpOnly cookie via the proxy
// ---------------------------------------------------------------------------

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async (): Promise<boolean> => {
    logDebug("Auth", "Attempting silent token refresh via proxy");

    const response = await fetch(buildApiUrl("/auth/token/refresh/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({}),
      credentials: "include",
    });

    if (!response.ok) {
      logDebug("Auth", "Refresh failed", { status: response.status });
      return false;
    }

    logDebug("Auth", "Token refreshed successfully via proxy");
    return true;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export async function apiFetch<T = unknown>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, auth = false, credentials: explicitCredentials, _retry, ...init } = config;
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // No Authorization header — the browser sends the bns_at HttpOnly cookie
  // automatically via credentials: 'include'.

  logDebug("API", "Request start", {
    path,
    method: init.method ?? "GET",
    auth,
  });

  const method = init.method ?? "GET";
  const fetchInit = apiFetchInit(method, init);
  const mergedHeaders = new Headers(fetchInit.headers);
  headers.forEach((value, key) => mergedHeaders.set(key, value));

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path, params), {
      ...fetchInit,
      headers: mergedHeaders,
      credentials: explicitCredentials ?? "include",
    });
  } catch (err) {
    logDebug("API", "Request network error", {
      path,
      method: init.method ?? "GET",
      message: networkErrorMessage(err),
    });
    throw new Error(networkErrorMessage(err));
  }

  // Silent refresh on 401 — retry once
  if (response.status === 401 && auth && !_retry) {
    logDebug("API", "401 received; attempting silent refresh", { path });
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...config, auth: true, _retry: true });
    }
    // Refresh failed — the auth-context will handle the 401 error
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiPayload;
    const fieldErrors = extractFieldErrors(payload);
    const message = extractApiErrorMessage(
      payload,
      response.status === 429
        ? "Too many requests. Please wait a moment and try again."
        : `Request failed (${response.status}).`,
    );
    logDebug("API", "Request failed", {
      path,
      method: init.method ?? "GET",
      status: response.status,
      message,
      fieldErrors,
    });
    throw new ApiRequestError(message, response.status, fieldErrors);
  }

  logDebug("API", "Request success", {
    path,
    method: init.method ?? "GET",
    status: response.status,
  });

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Citizen API — all calls go through the Next.js proxy with credentials
// ---------------------------------------------------------------------------

export const citizenApi = {
  getOrgConfig: () => apiFetch<OrgConfigApi>("/org/config/"),

  register: (body: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const payload: Record<string, string> = {
      email: body.email.trim(),
      password: body.password,
    };
    const first = body.first_name?.trim();
    const last = body.last_name?.trim();
    if (first) payload.first_name = first;
    if (last) payload.last_name = last;
    const path = "/auth/register/";
    logDebug("API", "Register request", {
      url: buildApiUrl(path),
      email: payload.email,
    });
    return apiFetch<AuthRegisterResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  verifyEmail: (token: string) =>
    apiFetch<{ detail: string }>("/auth/verify/", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthLoginResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ detail?: string }>("/auth/logout/", {
      method: "POST",
      auth: true,
    }),

  requestPasswordReset: (email: string) =>
    apiFetch<{ detail: string }>("/auth/password-reset/request/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmPasswordReset: (token: string, password: string) =>
    apiFetch<{ detail: string }>("/auth/password-reset/confirm/", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  changePassword: (current_password: string, new_password: string) =>
    apiFetch<{ detail: string }>("/auth/password/change/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ current_password, new_password }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ detail: string }>("/auth/verify/resend/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  acceptInvitation: (token: string) =>
    apiFetch<{ status: string; detail?: string }>("/invitations/accept/", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  getMe: () => apiFetch<UserProfileApi>("/users/me/", { auth: true }),
  patchMe: (body: Partial<UserProfileApi>) =>
    apiFetch<UserProfileApi>("/users/me/", {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(body),
    }),
  patchMeAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return apiFetch<UserProfileApi>("/users/me/", {
      method: "PATCH",
      auth: true,
      body: form,
    });
  },

  getSocialLinks: () =>
    apiFetch<SocialLinkApi[]>("/users/me/social-links/", { auth: true }),
  upsertSocialLink: (body: SocialLinkApi) =>
    apiFetch<SocialLinkApi>("/users/me/social-links/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  deleteSocialLink: (platform: string) =>
    apiFetch<{ detail?: string }>("/users/me/social-links/", {
      method: "DELETE",
      auth: true,
      body: JSON.stringify({ platform }),
    }),

  getPublicUser: (id: string) =>
    apiFetch<Record<string, unknown>>(`/users/${id}/public/`),

  subscribeNewsletter: (body: { email: string; name?: string; source?: string }) =>
    apiFetch<{ detail?: string; id?: string; email?: string; subscribed?: boolean }>(
      "/newsletter/subscribe/",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    ),

  submitContact: (body: {
    name: string;
    email: string;
    message: string;
    source?: string;
  }) =>
    apiFetch<{ id?: string; detail?: string }>("/contact/", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getTeamMembers: () =>
    apiFetch<Array<{
      name: string;
      role: string;
      image: string;
      description?: string;
      bio?: string;
      socials?: { linkedin?: string; x?: string; website?: string };
    }>>("/org/team/public/"),

  getStories: () => apiFetch<ApiListResponse<Record<string, unknown>>>("/content/stories/"),
  getArticles: () => apiFetch<ApiListResponse<Record<string, unknown>>>("/content/articles/"),
  getArticle: (slug: string) =>
    apiFetch<Record<string, unknown>>(`/content/articles/${slug}/`),
  getKnowledge: () => apiFetch<ApiListResponse<Record<string, unknown>>>("/content/knowledge/"),
  getKnowledgeEntry: (id: string) =>
    apiFetch<Record<string, unknown>>(`/content/knowledge/${id}/`),
  getEvents: () => apiFetch<ApiListResponse<Record<string, unknown>>>("/content/events/"),
  getEvent: (id: string) => apiFetch<Record<string, unknown>>(`/content/events/${id}/`),

  getSurveys: () => apiFetch<ApiListResponse<SurveyListItemApi>>("/engagement/surveys/"),
  getSurvey: (id: string) => apiFetch<SurveyDetailApi>(`/engagement/surveys/${id}/`),
  submitSurvey: (id: string, answers: Record<string, unknown>) =>
    apiFetch<{ response_id: string }>(`/engagement/surveys/${id}/submit/`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getTriviaList: () => apiFetch<ApiListResponse<TriviaSetApi>>("/engagement/trivia/"),
  getTrivia: (id: string) => apiFetch<TriviaSetApi>(`/engagement/trivia/${id}/`),
  submitTriviaAttempt: (
    id: string,
    answers: Record<string, number>,
    leaderboardOptIn = false,
  ) =>
    apiFetch<{ score: number; streak_count?: number; completed_at?: string }>(
      `/engagement/trivia/${id}/attempt/`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify({ answers, leaderboard_opt_in: leaderboardOptIn }),
      },
    ),
  getTriviaLeaderboard: (id: string) =>
    apiFetch<{ results: TriviaLeaderboardRow[] }>(`/engagement/trivia/${id}/leaderboard/`),

  getBookmarks: () =>
    apiFetch<{ results: Record<string, unknown>[] }>("/engagement/bookmarks/", { auth: true }),
  toggleBookmark: (content_type: string, content_id: string) =>
    apiFetch<{ toggle: boolean; bookmarks: Record<string, unknown>[] }>(
      "/engagement/bookmarks/",
      {
        method: "POST",
        auth: true,
        body: JSON.stringify({ content_type, content_id }),
      },
    ),

  getNotifications: (status?: string) =>
    apiFetch<ApiListResponse<Record<string, unknown>>>("/engagement/notifications/", {
      auth: true,
      params: status ? { status } : undefined,
    }),

  getTikTokFeatured: () =>
    apiFetch<TikTokVideoApi[]>("/content/tiktok/featured/"),

  getTikTokVideo: (id: string) =>
    apiFetch<TikTokVideoDetailApi>(`/content/tiktok/${id}/`),

  likeTikTokVideo: (id: string, action: "like" | "unlike") =>
    apiFetch<{ like_count: number }>(`/content/tiktok/${id}/like/`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  recordShare: (body: {
    content_type: string;
    content_id: string;
    channel: string;
    target_url?: string;
  }) =>
    apiFetch<Record<string, unknown>>("/engagement/share/", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getWeeklyNotes: () => apiFetch<WeeklyNoteApi[]>("/notes/public/"),
  getMyNotes: () => apiFetch<ApiListResponse<WeeklyNoteApi>>("/notes/", { auth: true }),
  createWeeklyNote: (body: WeeklyNoteCreateApi) =>
    apiFetch<WeeklyNoteApi>("/notes/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  updateWeeklyNote: (id: string, body: Partial<WeeklyNoteCreateApi>) =>
    apiFetch<WeeklyNoteApi>(`/notes/${id}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(body),
    }),
  auditWeeklyNote: (id: string, action: string, comment: string) =>
    apiFetch<WeeklyNoteApi>(`/notes/${id}/audit/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ action, comment }),
    }),
  publishWeeklyNote: (id: string, bypassChecklist = false, bypassComment = "") =>
    apiFetch<WeeklyNoteApi>(`/notes/${id}/publish/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ bypass_checklist: bypassChecklist, bypass_comment: bypassComment }),
    }),

  getAnalyticsSummary: () => apiFetch<AnalyticsSummaryApi>("/analytics/summary/"),

  getStudioServices: () => apiFetch<StudioServiceApi[]>("/studio/services/"),
  getStudioPortfolio: () => apiFetch<StudioPortfolioItemApi[]>("/studio/portfolio/"),
  getStudioTestimonials: () => apiFetch<StudioTestimonialApi[]>("/studio/testimonials/"),
  submitStudioBooking: (body: StudioBookingApi) =>
    apiFetch<{ id: string }>("/studio/booking/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export function wrapNotionContent(html: string): string {
  const trimmed = html?.trim();
  if (!trimmed) return "";
  if (trimmed.includes("notion-content")) return trimmed;
  return `<div class="notion-content prose dark:prose-invert max-w-none">${trimmed}</div>`;
}
