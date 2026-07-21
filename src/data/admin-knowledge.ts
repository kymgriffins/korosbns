import { adminKnowledgeApi, availableContentTransitions } from "@/lib/admin-api";
import type { AdminKnowledgeListItem, AdminKnowledgeDetail, ContentTransitionAction } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminKnowledgeListItem, AdminKnowledgeDetail, ContentTransitionAction };

let _items: AdminKnowledgeListItem[] = [];

export const adminKnowledgeData = {
  get: () => _items,
  set: (items: AdminKnowledgeListItem[]) => { _items = items; },
  fetch: () =>
    withFallback(
      "admin-knowledge",
      () => adminKnowledgeApi.list().then((r) => {
        const results = r.results ?? [];
        _items = results;
        return results;
      }),
      () => _items,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-knowledge",
      () => adminKnowledgeApi.get(id),
      () => null,
    ),
  create: (data: { title: string; summary?: string; body?: string; tag_ids?: string[] }) =>
    withFallback(
      "admin-knowledge",
      () => adminKnowledgeApi.create(data).then(() => {
        _items.unshift({ id: "pending", title: data.title, state: "draft", updated_at: new Date().toISOString() });
      }),
      () => {},
    ),
  update: (id: string, data: { title?: string; summary?: string; body?: string; tag_ids?: string[] }) =>
    withFallback(
      "admin-knowledge",
      () => adminKnowledgeApi.update(id, data),
      () => null,
    ),
  transition: (id: string, action: ContentTransitionAction) =>
    withFallback(
      "admin-knowledge",
      () => adminKnowledgeApi.transition(id, action).then((r) => {
        const idx = _items.findIndex((i) => i.id === id);
        if (idx !== -1) _items[idx] = { ..._items[idx], state: r.state };
        return r;
      }),
      () => {
        const idx = _items.findIndex((i) => i.id === id);
        if (idx !== -1) {
          const stateMap: Record<string, string> = { submit_review: "review", reject_to_draft: "draft", publish: "published", archive: "archived" };
          _items[idx] = { ..._items[idx], state: stateMap[action] ?? _items[idx].state };
        }
        return null;
      },
    ),
  availableTransitions: (state: string) => availableContentTransitions(state),
};
