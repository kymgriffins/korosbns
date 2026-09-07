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

export type EventSponsor = {
  name: string;
  logo_url?: string;
  website_url?: string;
  tier?: string;
  description?: string;
};

export type EventGalleryImage = {
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspect_ratio: number;
};

export type EventSpeaker = {
  name: string;
  role: string;
  organization: string;
  image_url?: string;
};

export type HubEvent = {
  id: string;
  title: string;
  starts_at: string;
  location: string;
  location_url?: string;
  programme?: string;
  programme_label?: string;
  image_aspect_ratio?: number;
  image_orientation?: "portrait" | "landscape" | "square";
  video_url?: string;
  video_title?: string;
  key_speakers?: EventSpeaker[];
  gallery_images?: EventGalleryImage[];
  galleries?: EventGalleryLink[];
  sponsors?: EventSponsor[];
  snippet: string;
  body: string;
  body_html: string;
  image?: string;
  image_url?: string;
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

  const rawSponsors = (item.sponsors || []) as Record<string, unknown>[];
  const sponsors: EventSponsor[] = rawSponsors.map((s) => ({
    name: String(s.name || ""),
    logo_url: s.logo_url ? String(s.logo_url) : undefined,
    website_url: s.website_url ? String(s.website_url) : undefined,
    tier: s.tier ? String(s.tier) : undefined,
    description: s.description ? String(s.description) : undefined,
  }));

  const title = String(item.title || "Event");
  const snippet = String(item.summary || meta.snippet || "");
  const body = String(item.description || item.body || "");
  const bodyHtml = String(item.body_html || "");
  const textToCheck = (title + " " + snippet + " " + body + " " + bodyHtml).toLowerCase();

  // If no sponsors mapped from backend, but keyword Tisa is found, inject Tisa as lead sponsor.
  if (sponsors.length === 0 && textToCheck.includes("tisa")) {
    sponsors.push({
      name: "Tisa (The Institute for Social Accountability)",
      logo_url: "https://newtisa.tisa.co.ke/wp-content/uploads/2025/03/New-TISA-logo.svg",
      website_url: "https://tisa.or.ke",
      tier: "Lead Sponsor",
      description: "Promoting citizen oversight and social accountability in public resource management in Kenya."
    });
  }

  const imageUrl = item.image_url || item.image || meta.image_url || meta.image || undefined;

  return {
    id: String(item.id),
    title,
    starts_at: String(item.starts_at || meta.starts_at || ""),
    location: String(item.location || meta.location || ""),
    location_url: String(item.location_url || meta.location_url || ""),
    galleries: galleries.length ? galleries : undefined,
    sponsors: sponsors.length ? sponsors : undefined,
    snippet,
    body,
    body_html: bodyHtml,
    image: imageUrl ? String(imageUrl) : undefined,
    image_url: imageUrl ? String(imageUrl) : undefined,
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
