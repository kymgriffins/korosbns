import type { LearnHubItem } from "@/types/learn";
import {
  BPS_YOUTUBE_URLS,
  currentYoutubeSeries,
  groupYoutubeSeries,
  type SeriesVideo,
  type YouTubeSeries,
} from "@/lib/youtube-series";
import videosFallback from "@/data/fallbacks/content-videos.json";

export type YouTubeVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  description: string;
  channelId: string;
  transcript?: TranscriptEntry[];
};

export type TranscriptEntry = {
  text: string;
  start: number;
  duration: number;
};

const CHANNEL_ID = "UCvxVwuKoG8XEN53OohMu9qA";

/** Seeded YouTube catalogue from content-videos.json (JSON-only Learn Hub). */
const DEFAULT_VIDEOS: YouTubeVideo[] = (videosFallback.results ?? []).map((v) => ({
  videoId: v.videoId,
  title: v.title,
  url: v.url,
  publishedAt: v.publishedAt,
  description: v.description,
  channelId: v.channelId || CHANNEL_ID,
}));

let _videos: YouTubeVideo[] | null = null;

function sortByDate(videos: YouTubeVideo[]): YouTubeVideo[] {
  return [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function learnHubItemToVideo(item: LearnHubItem): YouTubeVideo | null {
  const videoId =
    item.id ||
    (item.url ? item.url.match(/[?&]v=([^&]+)/)?.[1] : "") ||
    "";
  if (!videoId) return null;
  return {
    videoId,
    title: item.title,
    url: item.url || `https://www.youtube.com/watch?v=${videoId}`,
    publishedAt: item.published_at || "",
    description: item.summary || "",
    channelId: (item as LearnHubItem & { channel_id?: string }).channel_id || CHANNEL_ID,
  };
}

export function toSeriesVideos(videos: YouTubeVideo[]): SeriesVideo[] {
  return videos.map((v) => ({
    videoId: v.videoId,
    title: v.title,
    url: v.url,
    publishedAt: v.publishedAt,
    description: v.description,
  }));
}

export function getVideos(): YouTubeVideo[] {
  if (_videos) return _videos;
  _videos = sortByDate(DEFAULT_VIDEOS);
  return _videos;
}

export function getVideoById(videoId: string): YouTubeVideo | undefined {
  return getVideos().find((v) => v.videoId === videoId);
}

export function setVideos(videos: YouTubeVideo[]): void {
  _videos = sortByDate(videos);
}

export function addVideo(video: YouTubeVideo): void {
  const existing = getVideos();
  const idx = existing.findIndex((v) => v.videoId === video.videoId);
  if (idx >= 0) {
    existing[idx] = video;
  } else {
    existing.push(video);
  }
  _videos = sortByDate(existing);
}

export function removeVideo(videoId: string): void {
  _videos = getVideos().filter((v) => v.videoId !== videoId);
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function getGroupedSeries(videos?: YouTubeVideo[]): YouTubeSeries[] {
  return groupYoutubeSeries(toSeriesVideos(videos ?? getVideos()));
}

export function getCurrentSeries(videos?: YouTubeVideo[]): YouTubeSeries | null {
  return currentYoutubeSeries(toSeriesVideos(videos ?? getVideos()));
}

/** BPS explainer watch URLs — always available for the seeded module. */
export function getBpsYoutubeUrls(): string[] {
  return [...BPS_YOUTUBE_URLS];
}

function toLearnHubItems(videos: YouTubeVideo[]): LearnHubItem[] {
  return videos.map((v) => ({
    id: v.videoId,
    title: v.title,
    description: v.description,
    summary: v.description,
    url: v.url,
    published_at: v.publishedAt,
    source: "youtube" as const,
    content_type: "video" as const,
    channel_id: v.channelId,
  }));
}

function filterBySearch(items: LearnHubItem[], search?: string): LearnHubItem[] {
  if (!search?.trim()) return items;
  const q = search.trim().toLowerCase();
  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q),
  );
}

/**
 * YouTube catalogue is JSON-only (`content-videos.json`). No learn/videos API.
 */
export const videoData = {
  get: (): LearnHubItem[] => toLearnHubItems(getVideos()),
  set: (items: LearnHubItem[]) => {
    const mapped = items
      .map(learnHubItemToVideo)
      .filter((v): v is YouTubeVideo => v != null);
    if (mapped.length) setVideos(mapped);
  },
  fetch: async (filters?: { search?: string }): Promise<LearnHubItem[]> => {
    _videos = sortByDate(DEFAULT_VIDEOS);
    return filterBySearch(toLearnHubItems(_videos), filters?.search);
  },
};
