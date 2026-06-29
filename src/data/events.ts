import { citizenApi } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";
import type { HubEvent } from "@/lib/citizen-content";
import { mapApiEvent } from "@/lib/citizen-content";

export type { HubEvent };

const DEFAULT_EVENTS: HubEvent[] = [];

let _events: HubEvent[] = [...DEFAULT_EVENTS];

export const eventData = {
  get: () => _events,
  set: (items: HubEvent[]) => { _events = items; },
  fetch: () =>
    withFallback(
      "events",
      () => citizenApi.getEvents().then((r) => {
        const results = (r as any).results ?? [];
        const mapped = results.map(mapApiEvent);
        _events = mapped;
        return mapped;
      }),
      () => _events,
    ),
  fetchById: (id: string) =>
    withFallback(
      "events",
      () => citizenApi.getEvent(id).then(mapApiEvent),
      () => _events.find((e) => e.id === id) ?? null,
    ),
};
