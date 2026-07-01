import { apiFetch } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";
import type { ApiListResponse } from "@/types/api";

export const marketingData = {
  articlesMarquee: {
    fetch: (limit = 5) =>
      withFallback(
        "marketing",
        () => apiFetch<ApiListResponse<Record<string, unknown>>>(`/content/articles/?limit=${limit}`),
        () => ({ count: 0, results: [] }),
      ).then((r: any) => r.results ?? []),
  },
  campaigns: {
    fetch: () =>
      withFallback(
        "marketing",
        () => apiFetch("/marketing/campaigns/"),
        () => [],
      ),
  },
};
