import { NextResponse } from "next/server";

const TIKTOK_OEMBED = "https://www.tiktok.com/oembed";

export type TikTokOembedResult = {
  url: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  title: string;
  html: string;
  width: number;
  height: number;
  provider_name: string;
  error?: string;
};

export type TikTokLiveFeedResponse = {
  videos: TikTokOembedResult[];
  total: number;
  failed: number;
  source: "profile" | "oembed" | "none";
};

const SCRAPE_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function extractUsername(input: string): string | null {
  const cleaned = input.trim().replace(/^@/, "");
  const match = cleaned.match(
    /(?:tiktok\.com\/)?@?([A-Za-z0-9_.]+)(?:\/.*)?$/,
  );
  return match ? match[1] : null;
}

async function scrapeProfileVideos(username: string): Promise<TikTokOembedResult[]> {
  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": SCRAPE_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const state = _extractInitialState(html);
    if (!state) return [];

    return _parseVideosFromState(state, username);
  } catch {
    return [];
  }
}

function _extractInitialState(html: string): Record<string, unknown> | null {
  const patterns = [
    /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    /window\.__INITIAL_STATE__\s*=\s*([\s\S]*?)\s*;/,
    /<script[^>]*id="__UNIVERSAL_DATA_FOR_VIEW"[^>]*>([\s\S]*?)<\/script>/,
    /"ItemModule":\s*([\s\S]*?),\s*"UserModule"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        continue;
      }
    }
  }

  return null;
}

function _parseVideosFromState(
  state: Record<string, unknown>,
  username: string,
): TikTokOembedResult[] {
  const results: TikTokOembedResult[] = [];
  const seen = new Set<string>();

  const extractVideo = (id: string, data: Record<string, unknown>) => {
    if (seen.has(id)) return;
    seen.add(id);
    const videoUrl = `https://www.tiktok.com/@${username}/video/${id}`;
    results.push({
      url: videoUrl,
      author_name: (data.author as string) || (data.authorName as string) || username,
      author_url: `https://www.tiktok.com/@${username}`,
      thumbnail_url: (data.cover as string) || (data.coverUrl as string) || (data.originCover as string) || "",
      thumbnail_width: 720,
      thumbnail_height: 1280,
      title: (data.title as string) || (data.desc as string) || "",
      html: "",
      width: 540,
      height: 960,
      provider_name: "TikTok",
    });
  };

  const itemModule = state.ItemModule as Record<string, unknown> | undefined;
  if (itemModule) {
    for (const [id, item] of Object.entries(itemModule)) {
      if (item && typeof item === "object") {
        extractVideo(id, item as Record<string, unknown>);
      }
    }
  }

  const videoList = state.VideoList as { itemList?: Array<{ id: string; [key: string]: unknown }> } | undefined;
  if (videoList?.itemList) {
    for (const item of videoList.itemList) {
      if (item?.id && !seen.has(item.id)) {
        extractVideo(item.id, item as Record<string, unknown>);
      }
    }
  }

  const userModule = state.UserModule as
    | { users?: Record<string, { videos?: Array<{ id: string; [key: string]: unknown }> }> }
    | undefined;
  if (userModule?.users) {
    for (const userData of Object.values(userModule.users)) {
      if (userData?.videos) {
        for (const v of userData.videos) {
          if (v?.id && !seen.has(v.id)) {
            extractVideo(v.id, v as Record<string, unknown>);
          }
        }
      }
    }
  }

  const posts = (state as Record<string, unknown>).posts as
    | Array<{ id?: string; [key: string]: unknown }>
    | undefined;
  if (posts) {
    for (const p of posts) {
      if (p?.id && !seen.has(p.id)) {
        extractVideo(p.id, p as Record<string, unknown>);
      }
    }
  }

  return results;
}

async function fetchOembed(url: string): Promise<TikTokOembedResult> {
  try {
    const oembedUrl = `${TIKTOK_OEMBED}?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": SCRAPE_UA },
    });
    if (!res.ok) {
      return { url, error: `oEmbed returned ${res.status}`, author_name: "", author_url: "", thumbnail_url: "", thumbnail_width: 0, thumbnail_height: 0, title: "", html: "", width: 0, height: 0, provider_name: "TikTok" };
    }
    const data = await res.json();
    return { ...data, url } as TikTokOembedResult;
  } catch {
    return { url, error: "oEmbed fetch failed", author_name: "", author_url: "", thumbnail_url: "", thumbnail_width: 0, thumbnail_height: 0, title: "", html: "", width: 0, height: 0, provider_name: "TikTok" };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile = searchParams.get("profile") || searchParams.get("username") || "";
  const manualUrls = searchParams.get("urls");

  let source: TikTokLiveFeedResponse["source"] = "none";
  let rawVideos: TikTokOembedResult[] = [];

  if (profile) {
    const username = extractUsername(profile);
    if (username) {
      const scraped = await scrapeProfileVideos(username);
      if (scraped.length > 0) {
        rawVideos = scraped;
        source = "profile";
      }
    }
  }

  if (rawVideos.length === 0 && manualUrls) {
    const urls = manualUrls.split(",").map((s) => s.trim()).filter(Boolean);
    const oembedResults = await Promise.allSettled(urls.map(fetchOembed));
    for (const r of oembedResults) {
      if (r.status === "fulfilled") rawVideos.push(r.value);
    }
    if (rawVideos.length > 0) source = "oembed";
  }

  const valid = rawVideos.filter((v) => v.thumbnail_url && !v.error);
  const failed = rawVideos.length - valid.length;

  return NextResponse.json({ videos: valid, total: rawVideos.length, failed, source });
}
