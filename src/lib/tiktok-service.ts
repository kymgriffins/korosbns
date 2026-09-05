import { citizenApi } from "@/lib/api-client";
import type { TikTokVideoApi, TikTokVideoDetailApi } from "@/lib/api-client";
import { mediaContent } from "@/content";

export async function getFeaturedTikTokVideos(): Promise<TikTokVideoApi[]> {
  try {
    return await citizenApi.getTikTokFeatured();
  } catch {
    return [
      {
        id: "reel-01",
        caption: "County Budget Explained in 60s",
        video_url:
          mediaContent.cloudinary.reelVideo ||
          "https://bns.stratapointadvisory.org/0cd8319a419e6b3749a7206ba4d68801.mp4",
        cover_image_url: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
        embed_html: "",
        like_count: 12400,
        tiktok_like_count: 12400,
        tiktok_comment_count: 842,
        tiktok_share_count: 320,
        tiktok_play_count: 250000,
      },
      {
        id: "reel-02",
        caption: "County & Budget Socials In Action",
        video_url:
          mediaContent.cloudinary.countyBudgetSocialVideo ||
          "https://bns.stratapointadvisory.org/county%20%26%20budget%20socials%20new.mp4",
        cover_image_url: "/images/towwnhallmay/129A4056.jpg",
        embed_html: "",
        like_count: 8930,
        tiktok_like_count: 8930,
        tiktok_comment_count: 412,
        tiktok_share_count: 195,
        tiktok_play_count: 180000,
      },
    ];
  }
}

export async function getTikTokVideo(id: string): Promise<TikTokVideoDetailApi> {
  try {
    return await citizenApi.getTikTokVideo(id);
  } catch {
    const isVideo2 = id.includes("2") || id.includes("social");
    return {
      id,
      video_url: isVideo2
        ? (mediaContent.cloudinary.countyBudgetSocialVideo ||
          "https://bns.stratapointadvisory.org/county%20%26%20budget%20socials%20new.mp4")
        : (mediaContent.cloudinary.reelVideo ||
          "https://bns.stratapointadvisory.org/0cd8319a419e6b3749a7206ba4d68801.mp4"),
      cover_image_url: isVideo2
        ? "/images/towwnhallmay/129A4056.jpg"
        : "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
      embed_html: "",
      caption: isVideo2
        ? "County & Budget Socials - Budget Ndio Story"
        : "County Budget Explained in 60s - Budget Ndio Story",
      tiktok_url: "https://www.tiktok.com/@budget.ndio.story",
      like_count: 12500,
      tiktok_like_count: 12500,
      tiktok_comment_count: 842,
      tiktok_share_count: 320,
      tiktok_play_count: 250000,
    };
  }
}

export async function likeTikTokVideo(id: string, action: "like" | "unlike"): Promise<{ like_count: number }> {
  try {
    return await citizenApi.likeTikTokVideo(id, action);
  } catch {
    return { like_count: 12500 + (action === "like" ? 1 : 0) };
  }
}
