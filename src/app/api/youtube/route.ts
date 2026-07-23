import { NextResponse } from "next/server";
import videosFallback from "@/data/fallbacks/content-videos.json";

/**
 * Serve the seeded YouTube catalogue (JSON-only). No live RSS / Data API —
 * Learn Hub and marketing share content-videos.json.
 */
export async function GET() {
  const videos = (videosFallback.results ?? []).map((v) => ({
    id: v.videoId,
    title: v.title,
    published: v.publishedAt,
    thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    url: v.url,
    description: v.description,
  }));

  return NextResponse.json({
    videos,
    provenance: videosFallback.provenance,
    source: "content-videos.json",
  });
}
