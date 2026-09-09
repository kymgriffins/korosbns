import { citizenApi } from "@/lib/api-client";
import type { TikTokVideoApi, TikTokVideoDetailApi } from "@/lib/api-client";
import {
  BNS_R2_REELS,
  getBnsR2Reel,
  type BnsReel,
} from "@/constants/bns-r2-reels";

function mapToTikTokVideoApi(reel: BnsReel): TikTokVideoApi {
  return {
    id: reel.id,
    caption: `${reel.title} — ${reel.caption}`,
    video_url: reel.videoUrl,
    cover_image_url: reel.posterUrl,
    embed_html: "",
    like_count: reel.likes,
    tiktok_like_count: reel.likes,
    tiktok_comment_count: reel.comments,
    tiktok_share_count: reel.shares,
    tiktok_play_count: reel.plays,
  };
}

function mapToTikTokVideoDetailApi(reel: BnsReel): TikTokVideoDetailApi {
  return {
    ...mapToTikTokVideoApi(reel),
    tiktok_url: reel.tiktokUrl,
  };
}

export async function getFeaturedTikTokVideos(): Promise<TikTokVideoApi[]> {
  try {
    const remote = await citizenApi.getTikTokFeatured();
    if (remote && remote.length > 0) return remote;
  } catch {
    // API offline, fall through to static R2 reels catalog
  }
  return BNS_R2_REELS.map(mapToTikTokVideoApi);
}

export async function getTikTokVideo(id: string): Promise<TikTokVideoDetailApi> {
  try {
    return await citizenApi.getTikTokVideo(id);
  } catch {
    const reel = getBnsR2Reel(id);
    return mapToTikTokVideoDetailApi(reel);
  }
}

export async function likeTikTokVideo(id: string, action: "like" | "unlike"): Promise<{ like_count: number }> {
  try {
    return await citizenApi.likeTikTokVideo(id, action);
  } catch {
    const reel = getBnsR2Reel(id);
    return { like_count: reel.likes + (action === "like" ? 1 : 0) };
  }
}

