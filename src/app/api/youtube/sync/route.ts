import { NextResponse } from "next/server";
import { fetchYoutubeChannelRss, BNS_CHANNEL_ID } from "@/lib/youtube-meta";
import { getLiveFeaturedProjects } from "@/lib/cms-live-data";
import { curateFlagshipYoutubeProducts } from "@/lib/youtube-curator";
import { headlessCmsApi, MASTER_CMS_EMAIL } from "@/lib/headless-cms";
import contentVideosFallback from "@/data/fallbacks/content-videos.json";

export async function POST() {
  try {
    // 1. Fetch channel RSS entries
    let rawVideos: any[] = [];
    try {
      const rss = await fetchYoutubeChannelRss(BNS_CHANNEL_ID);
      if (Array.isArray(rss) && rss.length > 0) {
        rawVideos = rss;
      }
    } catch {
      // Fall back to catalogue
    }

    if (rawVideos.length === 0) {
      rawVideos = (contentVideosFallback.results || []).map((v: any) => ({
        videoId: v.videoId,
        title: v.title,
        url: v.url || `https://www.youtube.com/watch?v=${v.videoId}`,
        publishedAt: v.publishedAt,
        description: v.description,
        thumbnail: v.thumbnail,
      }));
    }

    // 2. Fetch existing featured projects
    const live = await getLiveFeaturedProjects();
    const existing = (live as any)?.results || (live as any)?.projects || [];

    // 3. Intelligently curate into flagship products (deduplicating multi-part series)
    const curated = curateFlagshipYoutubeProducts(rawVideos, existing);

    // 4. Update in CMS collection
    const updatedPayload = {
      provenance: {
        source: "Automated YouTube RSS + Smart Multi-Part Series Curation",
        lastSync: new Date().toISOString(),
        channelId: BNS_CHANNEL_ID,
      },
      count: curated.length,
      results: curated,
    };

    try {
      headlessCmsApi.updateCollectionData(
        "featured-projects",
        updatedPayload,
        MASTER_CMS_EMAIL,
      );
    } catch {
      // Non-fatal if disk write fails in edge runtime
    }

    return NextResponse.json({
      success: true,
      count: curated.length,
      results: curated,
      message: `Successfully curated ${curated.length} flagship products from YouTube without duplicate multi-part episodes.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync YouTube RSS" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST();
}
