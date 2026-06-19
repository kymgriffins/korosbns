import { citizenApi } from "@/lib/api-client";
import type { TikTokVideoApi, TikTokVideoDetailApi } from "@/lib/api-client";

export async function getFeaturedTikTokVideos(): Promise<TikTokVideoApi[]> {
  return citizenApi.getTikTokFeatured();
}

export async function getTikTokVideo(id: string): Promise<TikTokVideoDetailApi> {
  return citizenApi.getTikTokVideo(id);
}

export async function likeTikTokVideo(id: string, action: "like" | "unlike"): Promise<{ like_count: number }> {
  return citizenApi.likeTikTokVideo(id, action);
}
