import { learnHubApi } from "@/lib/learn-hub";
import { withFallback } from "@/data/adapter";
import type { LearnHubItem } from "@/types/learn";
import {
  BPS_YOUTUBE_URLS,
  currentYoutubeSeries,
  groupYoutubeSeries,
  type SeriesVideo,
  type YouTubeSeries,
} from "@/lib/youtube-series";

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

/** Seeded RSS mirror — BPS + Infrastructure + County Budget (newest). */
const DEFAULT_VIDEOS: YouTubeVideo[] = [
  {
    videoId: "oHuImiQvvN0",
    title: "PART 3: County Budget: Where Does the Money Come From?",
    url: "https://www.youtube.com/watch?v=oHuImiQvvN0",
    publishedAt: "2026-06-26T17:31:25Z",
    description:
      "Counties provide many of the services we interact with every day. Where does the money that funds county governments actually come from?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "abDYZ5xjQgo",
    title: "PART 2: County Budget: Where Does the Money Come From?",
    url: "https://www.youtube.com/watch?v=abDYZ5xjQgo",
    publishedAt: "2026-06-22T15:27:28Z",
    description:
      "Counties provide many of the services we interact with every day. Where does the money that funds county governments actually come from?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "3wfk09c_xNQ",
    title: "County Budget: Where Does the Money Come From?",
    url: "https://www.youtube.com/watch?v=3wfk09c_xNQ",
    publishedAt: "2026-06-19T05:46:47Z",
    description:
      "Counties provide many of the services we interact with every day. Where does the money that funds county governments actually come from?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "FkgRz4v2Llk",
    title: "PART 3: Before Budget Day: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=FkgRz4v2Llk",
    publishedAt: "2026-04-07T11:03:33Z",
    description:
      "In this part, we break down what the Budget Policy Statement (BPS) is and why young people should care about it.",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "wkPe3sWomoA",
    title: "PART 2-Before the Budget: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=wkPe3sWomoA",
    publishedAt: "2026-04-04T10:28:55Z",
    description:
      "In Part 2, we go deeper into the Budget Policy Statement (BPS) and why it matters before Budget Day.",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "Ed9lP0-komE",
    title: "Before Budget Day: This Is Where It Starts",
    url: "https://www.youtube.com/watch?v=Ed9lP0-komE",
    publishedAt: "2026-04-02T10:09:24Z",
    description:
      "In this part, we break down what the Budget Policy Statement (BPS) is and why young people should care about it.",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "SfPwtqUFyj4",
    title: "PART 4: Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=SfPwtqUFyj4",
    publishedAt: "2026-03-17T18:07:33Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "KeNCrx6krl0",
    title: "PART3 :Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=KeNCrx6krl0",
    publishedAt: "2026-03-17T18:00:11Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "jLZe3iPSMfc",
    title: "PART 2: Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=jLZe3iPSMfc",
    publishedAt: "2026-03-17T17:54:40Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: CHANNEL_ID,
  },
  {
    videoId: "A_EXLueEMlk",
    title: "Inside Kenya\u2019s National Infrastructure Fund",
    url: "https://www.youtube.com/watch?v=A_EXLueEMlk",
    publishedAt: "2026-03-16T08:25:38Z",
    description:
      "Kenya\u2019s National Infrastructure Fund is now law. But do young people really understand what it means?",
    channelId: CHANNEL_ID,
  },
];

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

function defaultVideosAsLearnHubItems(): { results: LearnHubItem[] } {
  return {
    results: DEFAULT_VIDEOS.map((v) => ({
      id: v.videoId,
      title: v.title,
      description: v.description,
      summary: v.description,
      url: v.url,
      published_at: v.publishedAt,
      source: "youtube" as const,
      content_type: "video" as const,
      channel_id: v.channelId,
    })),
  };
}

function hydrateFromLearnHub(items: LearnHubItem[]): YouTubeVideo[] {
  const mapped = items
    .map(learnHubItemToVideo)
    .filter((v): v is YouTubeVideo => v != null);
  if (mapped.length === 0) return getVideos();
  setVideos(mapped);
  return mapped;
}

export const videoData = {
  get: (): LearnHubItem[] =>
    getVideos().map((v) => ({
      id: v.videoId,
      title: v.title,
      description: v.description,
      summary: v.description,
      url: v.url,
      published_at: v.publishedAt,
      source: "youtube" as const,
      content_type: "video" as const,
      channel_id: v.channelId,
    })),
  set: (_items: LearnHubItem[]) => {},
  fetch: (filters?: { search?: string }): Promise<LearnHubItem[]> =>
    withFallback(
      "videos",
      () => learnHubApi.videos(filters),
      () => defaultVideosAsLearnHubItems(),
    ).then((r) => {
      const results = r.results ?? [];
      hydrateFromLearnHub(results);
      return results;
    }),
};
