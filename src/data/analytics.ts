import type { AnalyticsSummaryApi } from "@/types/notes";
import { citizenApi } from "@/lib/api-client";
import { adminAnalyticsApi } from "@/lib/admin-api";
import type { AdminAnalyticsSummary } from "@/lib/admin-api";

export type { AnalyticsSummaryApi, AdminAnalyticsSummary };

export const analyticsData = {
  fetch: (): Promise<AnalyticsSummaryApi> => citizenApi.getAnalyticsSummary(),
  admin: {
    fetchSummary: (period?: string): Promise<AdminAnalyticsSummary> => adminAnalyticsApi.summary(period),
  },
};
