import { useQuery } from "@tanstack/react-query";
import { citizenApi } from "@/lib/api-client";
import { mapApiEvent } from "@/lib/citizen-content";
import type { HubEvent } from "@/lib/citizen-content";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const data = await citizenApi.getEvents();
      const results = (data as any).results ?? [];
      return results.map(mapApiEvent) as HubEvent[];
    },
  });
}

export function useEvent(id: string, enabled = true) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const raw = await citizenApi.getEvent(id);
      return mapApiEvent(raw);
    },
    enabled: !!id && enabled,
  });
}
