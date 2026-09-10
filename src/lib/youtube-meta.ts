/**
 * YouTube metadata for partner-facing project evidence.
 * oEmbed JSON is primary; channel RSS enriches title/published when the video
 * appears in a known channel feed. Learn Hub series stay on content-videos.json.
 */

import {
  youtubeThumbnailUrl,
  youtubeVideoIdFromUrl,
} from "@/lib/youtube-series";

export type YoutubeOembedPayload = {
  title: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  provider_name?: string;
  html?: string;
};

export type YoutubeRssEntry = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
};

const OEMBED_ENDPOINT = "https://www.youtube.com/oembed";
const BNS_CHANNEL_ID = "UCvxVwuKoG8XEN53OohMu9qA";

export function youtubeOembedUrl(watchUrl: string): string {
  return `${OEMBED_ENDPOINT}?url=${encodeURIComponent(watchUrl)}&format=json`;
}

export function youtubeChannelRssUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

export function parseYoutubeRssEntries(xml: string): YoutubeRssEntry[] {
  const entries: YoutubeRssEntry[] = [];
  const blocks = xml.split(/<entry>/i).slice(1);

  for (const block of blocks) {
    const videoId =
      block.match(/<yt:videoId>\s*([^<\s]+)\s*<\/yt:videoId>/i)?.[1]?.trim() ??
      block.match(
        /<id>\s*yt:video:([\w-]{11})\s*<\/id>/i,
      )?.[1]?.trim();
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) continue;

    const title =
      block
        .match(/<media:title[^>]*>\s*([^<]+)\s*<\/media:title>/i)?.[1]
        ?.trim() ||
      block.match(/<title[^>]*>\s*([^<]+)\s*<\/title>/i)?.[1]?.trim() ||
      videoId;

    const publishedAt =
      block.match(/<published>\s*([^<\s]+)\s*<\/published>/i)?.[1]?.trim() ||
      block.match(/<updated>\s*([^<\s]+)\s*<\/updated>/i)?.[1]?.trim() ||
      "";

    const thumbFromMedia =
      block.match(
        /<media:thumbnail[^>]*url="([^"]+)"/i,
      )?.[1]?.trim();

    entries.push({
      videoId,
      title: decodeXmlEntities(title),
      publishedAt,
      thumbnail:
        thumbFromMedia ||
        youtubeThumbnailUrl(videoId, "hqdefault") ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  return entries;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchYoutubeOembed(
  watchUrl: string,
  init?: RequestInit,
): Promise<YoutubeOembedPayload | null> {
  const res = await fetch(youtubeOembedUrl(watchUrl), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) return null;
  return (await res.json()) as YoutubeOembedPayload;
}

export async function fetchYoutubeChannelRss(
  channelId: string = BNS_CHANNEL_ID,
  init?: RequestInit,
): Promise<YoutubeRssEntry[]> {
  const res = await fetch(youtubeChannelRssUrl(channelId), {
    ...init,
    headers: {
      Accept: "application/atom+xml, application/xml, text/xml",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  return parseYoutubeRssEntries(xml);
}

/**
 * Merge oEmbed + optional RSS hit for a watch URL / video id.
 * Thumbnail always prefers standard hqdefault for stable next/image URLs.
 */
export function mergeYoutubeProjectMeta(input: {
  urlOrId: string;
  fallbackTitle?: string;
  fallbackPublishedAt?: string;
  oembed?: YoutubeOembedPayload | null;
  rss?: YoutubeRssEntry | null;
}): {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  authorName?: string;
  url: string;
} | null {
  const videoId = youtubeVideoIdFromUrl(input.urlOrId);
  if (!videoId) return null;

  const title =
    input.rss?.title?.trim() ||
    input.oembed?.title?.trim() ||
    input.fallbackTitle?.trim() ||
    videoId;

  const publishedAt =
    input.rss?.publishedAt?.trim() ||
    input.fallbackPublishedAt?.trim() ||
    "";

  return {
    videoId,
    title,
    thumbnail:
      youtubeThumbnailUrl(videoId, "hqdefault") ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    publishedAt,
    authorName: input.oembed?.author_name?.trim() || undefined,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

export { BNS_CHANNEL_ID };
