import { adminContentFeedbackApi } from "@/lib/admin-api";
import type { ContentFeedbackItem } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { ContentFeedbackItem };

let _feedback: ContentFeedbackItem[] = [];

export const adminContentFeedbackData = {
  get: () => _feedback,
  set: (items: ContentFeedbackItem[]) => { _feedback = items; },
  fetch: (params?: { content_type?: string; status?: string; content_id?: string }) =>
    withFallback(
      "admin-content-feedback",
      () => adminContentFeedbackApi.list(params).then((r) => {
        const results = r.results ?? [];
        _feedback = results;
        return results;
      }),
      () => _feedback,
    ),
  summary: () =>
    withFallback(
      "admin-content-feedback",
      () => adminContentFeedbackApi.summary(),
      () => ({ total: 0, average_rating: 0, rating_distribution: {}, by_content_type: {}, by_status: {} }),
    ),
};
