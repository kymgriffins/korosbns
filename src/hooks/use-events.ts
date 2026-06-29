import { useQuery } from "@tanstack/react-query";
import type { HubEvent } from "@/lib/citizen-content";
import { eventData } from "@/data/events";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventData.fetch() as Promise<HubEvent[]>,
  });
}

export function useEvent(id: string, enabled = true) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventData.fetchById(id) as Promise<HubEvent | null>,
    enabled: !!id && enabled,
  });
}
