import { NextResponse } from "next/server";

const TIKTOK_OEMBED = "https://www.tiktok.com/oembed";

const DEFAULT_URLS: string[] = [
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857142",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857143",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857144",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857145",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857146",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857147",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857148",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857149",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857150",
  "https://www.tiktok.com/@budget.ndio.story/video/742857142857151",
];

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
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlsParam = searchParams.get("urls");
  const urls = urlsParam
    ? urlsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_URLS;

  if (urls.length === 0) {
    return NextResponse.json({ videos: [], total: 0, failed: 0 });
  }

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const oembedUrl = `${TIKTOK_OEMBED}?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) {
        return { url, error: `oEmbed returned ${res.status}`, author_name: "", author_url: "", thumbnail_url: "", thumbnail_width: 0, thumbnail_height: 0, title: "", html: "", width: 0, height: 0, provider_name: "TikTok" } as TikTokOembedResult;
      }
      const data = await res.json();
      return { ...data, url } as TikTokOembedResult;
    }),
  );

  const videos: TikTokOembedResult[] = [];
  let failed = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      videos.push(result.value);
      if (result.value.error) failed++;
    } else {
      failed++;
    }
  }

  return NextResponse.json({ videos, total: urls.length, failed });
}
