import type { AnalyticsSummaryApi } from "@/types/notes";
import { citizenApi } from "@/lib/api-client";
import { adminAnalyticsApi } from "@/lib/admin-api";
import type { AdminAnalyticsSummary } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AnalyticsSummaryApi, AdminAnalyticsSummary };

const DEFAULT_ANALYTICS: AnalyticsSummaryApi = {
  total_visitors: 0,
  total_page_views: 0,
  daily_visitors: [],
  top_pages: [],
  device_breakdown: [],
  uptime_percentage: 100,
  uptime_data: [],
  modules_completed: 0,
  citizens_reached: 0,
  surveys_responded: 0,
  quiz_attempts: 0,
  total_users: 0,
  active_users_30d: 0,
  quizzes_passed: 0,
  total_pageviews: 0,
  unique_visitors: 0,
  monthly_trends: [],
  recent_signups: 0,
  engagement_rate: 0,
  total_tasks: 0,
  published_tasks: 0,
};

let _analytics: AnalyticsSummaryApi = { ...DEFAULT_ANALYTICS };

const DEFAULT_ADMIN_SUMMARY: AdminAnalyticsSummary = {
  total_users: 0,
  total_content: 0,
  total_modules: 0,
  total_articles: 0,
  total_videos: 0,
  total_stories: 0,
  total_documents: 0,
  active_forum_threads: 0,
  total_notes: 0,
  recent_signups: 0,
  engagement_rate: 0,
};

export const analyticsData = {
  get: () => _analytics,
  set: (data: AnalyticsSummaryApi) => { _analytics = data; },
  fetch: () =>
    withFallback(
      "analytics",
      () => citizenApi.getAnalyticsSummary(),
      () => DEFAULT_ANALYTICS,
    ),
  admin: {
    fetchSummary: () =>
      withFallback(
        "analytics",
        () => adminAnalyticsApi.summary(),
        () => DEFAULT_ADMIN_SUMMARY,
      ),
  },
};
