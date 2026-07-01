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

const now = new Date();
const day = (offset: number) => {
  const d = new Date(now); d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};
const rng = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

const DAILY_VISITORS = Array.from({ length: 30 }, (_, i) => ({
  date: day(29 - i),
  count: rng(40, 120),
}));

const TOP_PAGES = [
  { path: "/", views: rng(1200, 2400) },
  { path: "/learn", views: rng(800, 1600) },
  { path: "/about", views: rng(400, 900) },
  { path: "/bns-studio", views: rng(300, 700) },
  { path: "/events", views: rng(200, 500) },
  { path: "/team", views: rng(150, 400) },
  { path: "/faq", views: rng(100, 300) },
  { path: "/contact", views: rng(80, 250) },
].sort((a, b) => b.views - a.views);

const DEVICE_BREAKDOWN = [
  { device_type: "Mobile", percentage: 62 },
  { device_type: "Desktop", percentage: 28 },
  { device_type: "Tablet", percentage: 10 },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", count: rng(400, 800), percentage: 35 },
  { source: "Organic Search", count: rng(300, 600), percentage: 28 },
  { source: "Social Media", count: rng(200, 400), percentage: 18 },
  { source: "Referral", count: rng(120, 250), percentage: 12 },
  { source: "Email", count: rng(60, 150), percentage: 7 },
];

function buildFallbackSummary(period?: string): AdminAnalyticsSummary {
  const visitorsToday = rng(60, 140);
  const visitors7d = rng(600, 1200);
  const visitors30d = rng(3000, 6000);
  const pvToday = rng(200, 500);
  const pv7d = rng(2000, 4500);
  const pv30d = rng(10000, 22000);

  return {
    total_users: 2847,
    total_content: 189,
    total_modules: 42,
    total_articles: 68,
    total_videos: 31,
    total_stories: 24,
    total_documents: 24,
    active_forum_threads: 156,
    total_notes: 312,
    recent_signups: rng(3, 12),
    engagement_rate: 64.8,
    period: period ?? "30d",

    users_new_today: rng(2, 8),
    users_new_7d: rng(25, 60),
    users_new_30d: rng(120, 280),
    users_active_7d: rng(200, 400),
    users_active_30d: rng(600, 1200),
    users_growth_pct: Number((2.1 + Math.random() * 1.5).toFixed(1)),

    visitors_today: visitorsToday,
    visitors_7d: visitors7d,
    visitors_30d: visitors30d,
    pageviews_today: pvToday,
    pageviews_7d: pv7d,
    pageviews_30d: pv30d,
    bounce_rate: Number((38 + Math.random() * 12).toFixed(1)),
    avg_session_seconds: rng(120, 240),

    daily_visitors: DAILY_VISITORS,
    top_pages: TOP_PAGES,
    device_breakdown: DEVICE_BREAKDOWN,
    traffic_sources: TRAFFIC_SOURCES,

    content_published_today: rng(0, 3),
    content_published_7d: rng(8, 20),
    content_published_30d: rng(25, 60),
    content_drafts: rng(10, 30),
  };
}

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
    fetchSummary: (period?: string) =>
      withFallback(
        "analytics",
        () => adminAnalyticsApi.summary(period),
        () => buildFallbackSummary(period),
      ),
  },
};
