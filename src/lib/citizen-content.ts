import { citizenApi } from "@/lib/api-client";
import { mapApiArticle, type HubArticle } from "@/lib/learn-content";

export type HubKnowledge = {
  id: string;
  title: string;
  snippet: string;
  body: string;
  body_html: string;
};

export type EventGalleryLink = {
  id: string;
  url: string;
  label: string;
};

export type HubEvent = {
  id: string;
  title: string;
  starts_at: string;
  location: string;
  location_url?: string;
  galleries?: EventGalleryLink[];
  snippet: string;
  body: string;
  body_html: string;
};

function listFromPayload(data: {
  results?: Record<string, unknown>[];
}): Record<string, unknown>[] {
  return data.results ?? [];
}

export function mapApiKnowledge(item: Record<string, unknown>): HubKnowledge {
  const meta = (item.metadata || {}) as Record<string, string>;
  return {
    id: String(item.id),
    title: String(item.title || "Knowledge entry"),
    snippet: String(item.summary || meta.snippet || ""),
    body: String(item.body || ""),
    body_html: String(item.body_html || ""),
  };
}

export function mapApiEvent(item: Record<string, unknown>): HubEvent {
  const meta = (item.metadata || {}) as Record<string, string>;
  const rawGalleries = (item.galleries || []) as Record<string, unknown>[];
  const galleries: EventGalleryLink[] = rawGalleries.map((g) => ({
    id: String(g.id || ""),
    url: String(g.url || ""),
    label: String(g.label || "Gallery"),
  }));
  return {
    id: String(item.id),
    title: String(item.title || "Event"),
    starts_at: String(item.starts_at || meta.starts_at || ""),
    location: String(item.location || meta.location || ""),
    location_url: String(item.location_url || meta.location_url || ""),
    galleries: galleries.length ? galleries : undefined,
    snippet: String(item.summary || meta.snippet || ""),
    body: String(item.description || item.body || ""),
    body_html: String(item.body_html || ""),
  };
}

export async function loadKnowledgeList(): Promise<HubKnowledge[]> {
  const data = await citizenApi.getKnowledge();
  return listFromPayload(data).map(mapApiKnowledge);
}

export async function loadKnowledgeDetail(id: string): Promise<HubKnowledge> {
  const raw = await citizenApi.getKnowledgeEntry(id);
  return mapApiKnowledge(raw);
}

export async function loadEventList(): Promise<HubEvent[]> {
  const data = await citizenApi.getEvents();
  return listFromPayload(data).map(mapApiEvent);
}

export async function loadEventDetail(id: string): Promise<HubEvent> {
  const raw = await citizenApi.getEvent(id);
  return mapApiEvent(raw);
}

export { loadArticleList, contentLoadErrorMessage } from "@/lib/marketing-content";
export type { HubArticle };
