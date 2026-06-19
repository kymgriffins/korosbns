import { citizenApi } from "@/lib/api-client";

export function fetchEvents() {
  return citizenApi.getEvents();
}

export function fetchEvent(id: string) {
  return citizenApi.getEvent(id);
}
