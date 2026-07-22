import { adminContentUnitsApi, availableContentTransitions } from "@/lib/admin-api";
import type { AdminContentUnitListItem, AdminContentUnitDetail, ContentTransitionAction } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminContentUnitListItem, AdminContentUnitDetail, ContentTransitionAction };

let _articles: AdminContentUnitListItem[] = [];
let _stories: AdminContentUnitListItem[] = [];

export const adminContentUnitsData = {
  articles: {
    get: () => _articles,
    set: (items: AdminContentUnitListItem[]) => { _articles = items; },
    fetch: () =>
      withFallback(
        "admin-content-units",
        () => adminContentUnitsApi.list("article").then((r) => {
          const results = r.results ?? [];
          _articles = results;
          return results;
        }),
        () => _articles,
      ),
  },
  stories: {
    get: () => _stories,
    set: (items: AdminContentUnitListItem[]) => { _stories = items; },
    fetch: () =>
      withFallback(
        "admin-content-units",
        () => adminContentUnitsApi.list("story").then((r) => {
          const results = r.results ?? [];
          _stories = results;
          return results;
        }),
        () => _stories,
      ),
  },
  get: (format: "article" | "story", id: string) =>
    withFallback(
      "admin-content-units",
      () => adminContentUnitsApi.get(format, id),
      () => null,
    ),
  create: (data: { title: string; format: "article" | "story"; summary?: string; body?: string; body_html?: string; tag_ids?: string[]; author_id?: string | null }) =>
    withFallback(
      "admin-content-units",
      () => adminContentUnitsApi.create(data),
      () => ({ id: `new-${Date.now()}`, slug: `untitled-${Date.now()}` }),
    ),
  update: (format: "article" | "story", id: string, data: { title?: string; summary?: string; body?: string; body_html?: string; tag_ids?: string[] }) =>
    withFallback(
      "admin-content-units",
      () => adminContentUnitsApi.update(format, id, data),
      () => null,
    ),
  transition: (format: "article" | "story", id: string, action: ContentTransitionAction) =>
    withFallback(
      "admin-content-units",
      () => adminContentUnitsApi.transition(format, id, action),
      () => null,
    ),
  availableTransitions: (state: string) => availableContentTransitions(state),
};
