import { adminEventsApi } from "@/lib/admin-api";
import type { AdminEvent, AdminEventGallery } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminEvent, AdminEventGallery };

let _events: AdminEvent[] = [];

export const adminEventsData = {
  get: () => _events,
  set: (items: AdminEvent[]) => { _events = items; },
  fetch: () =>
    withFallback(
      "admin-events",
      () => adminEventsApi.list().then((r) => {
        const results = r.results ?? [];
        _events = results;
        return results;
      }),
      () => _events,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-events",
      () => adminEventsApi.get(id),
      () => _events.find((e) => e.id === id) ?? null,
    ),
  create: (data: { title: string; summary?: string; description?: string; starts_at: string; ends_at?: string; is_active?: boolean }) =>
    withFallback(
      "admin-events",
      () => adminEventsApi.create(data).then((r) => {
        _events.unshift(r);
        return r;
      }),
      () => {
        const e: AdminEvent = {
          id: `new-${Date.now()}`,
          title: data.title,
          summary: data.summary ?? "",
          description: data.description ?? "",
          starts_at: data.starts_at,
          ends_at: data.ends_at ?? null,
          is_active: data.is_active ?? true,
          galleries: [],
        };
        _events.unshift(e);
        return e;
      },
    ),
  update: (id: string, data: { title?: string; summary?: string; description?: string; starts_at?: string; ends_at?: string; is_active?: boolean }) =>
    withFallback(
      "admin-events",
      () => adminEventsApi.update(id, data),
      () => {
        const idx = _events.findIndex((e) => e.id === id);
        if (idx !== -1) _events[idx] = { ..._events[idx], ...data };
        return _events[idx] ?? null;
      },
    ),
  delete: (id: string) =>
    withFallback(
      "admin-events",
      () => adminEventsApi.delete(id).then(() => {
        _events = _events.filter((e) => e.id !== id);
      }),
      () => { _events = _events.filter((e) => e.id !== id); },
    ),
  galleries: {
    list: (eventId: string) =>
      withFallback(
        "admin-events",
        () => adminEventsApi.listGalleries(eventId).then((r) => r.results ?? []),
        () => [],
      ),
    add: (eventId: string, data: { url: string; label?: string; display_order?: number }) =>
      withFallback(
        "admin-events",
        () => adminEventsApi.addGallery(eventId, data),
        () => null,
      ),
    update: (eventId: string, linkId: string, data: { url?: string; label?: string; display_order?: number; is_active?: boolean }) =>
      withFallback(
        "admin-events",
        () => adminEventsApi.updateGallery(eventId, linkId, data),
        () => null,
      ),
    delete: (eventId: string, linkId: string) =>
      withFallback(
        "admin-events",
        () => adminEventsApi.deleteGallery(eventId, linkId),
        () => {},
      ),
  },
};
