import { citizenApi } from "@/lib/api-client";
import type { TikTokVideoApi, TikTokVideoDetailApi } from "@/lib/api-client";
import {
  BNS_R2_REELS,
  getBnsR2Reel,
  type BnsReel,
} from "@/constants/bns-r2-reels";

/** Avoid hanging pre-push / offline when the Django TikTok API never responds. */
const TIKTOK_API_TIMEOUT_MS = 2500;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("tiktok-api-timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

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

function isKnownR2ReelId(id: string): boolean {
  return /^reel-0[1-8]$/.test(id);
}

export async function getFeaturedTikTokVideos(): Promise<TikTokVideoApi[]> {
  try {
    const remote = await withTimeout(citizenApi.getTikTokFeatured(), TIKTOK_API_TIMEOUT_MS);
    if (remote && remote.length > 0) return remote;
  } catch {
    // API offline or slow, fall through to static R2 reels catalog
  }
  return BNS_R2_REELS.map(mapToTikTokVideoApi);
}

export async function getTikTokVideo(id: string): Promise<TikTokVideoDetailApi> {
  // Known Cloudflare R2 catalog IDs resolve locally — no network hang.
  if (isKnownR2ReelId(id)) {
    return mapToTikTokVideoDetailApi(getBnsR2Reel(id));
  }

  try {
    return await withTimeout(citizenApi.getTikTokVideo(id), TIKTOK_API_TIMEOUT_MS);
  } catch {
    const reel = getBnsR2Reel(id);
    return mapToTikTokVideoDetailApi(reel);
  }
}

export async function likeTikTokVideo(id: string, action: "like" | "unlike"): Promise<{ like_count: number }> {
  try {
    return await withTimeout(citizenApi.likeTikTokVideo(id, action), TIKTOK_API_TIMEOUT_MS);
  } catch {
    const reel = getBnsR2Reel(id);
    return { like_count: reel.likes + (action === "like" ? 1 : 0) };
  }
}
