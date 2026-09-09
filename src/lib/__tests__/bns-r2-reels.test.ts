import { describe, expect, it } from "vitest";
import {
  BNS_HERO_REEL,
  BNS_R2_BASE_URL,
  BNS_R2_REELS,
  getAllBnsR2Reels,
  getBnsR2Reel,
} from "@/constants/bns-r2-reels";
import { DEFAULT_REELS } from "@/components/learn/reels-scroller";
import { getFeaturedTikTokVideos, getTikTokVideo } from "@/lib/tiktok-service";

describe("Cloudflare R2 8-Reels System", () => {
  it("contains exactly 8 verified reels in BNS_R2_REELS", () => {
    expect(BNS_R2_REELS).toHaveLength(8);
    expect(getAllBnsR2Reels()).toHaveLength(8);
  });

  it("every reel points to the public Cloudflare R2 bucket domain", () => {
    expect(BNS_R2_BASE_URL).toBe("https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev");
    for (const reel of BNS_R2_REELS) {
      expect(reel.videoUrl).toMatch(/^https:\/\/pub-96ce2eba58694b1da7f540033bdaa464\.r2\.dev\//);
      expect(reel.videoUrl).toContain(".mp4");
      expect(reel.id).toMatch(/^reel-0[1-8]$/);
      expect(reel.title.length).toBeGreaterThan(5);
      expect(reel.caption.length).toBeGreaterThan(10);
      expect(reel.author.length).toBeGreaterThan(3);
      expect(reel.posterUrl).toMatch(/^\/images\/reels\/.+\.jpg$/);
      expect(reel.duration).toMatch(/^\d+:\d{2}$/);
      expect(reel.hashtags.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("Calvina Praise Sovereign Debt is the featured hero reel", () => {
    expect(BNS_HERO_REEL.id).toBe("reel-01");
    expect(BNS_HERO_REEL.featuredInHero).toBe(true);
    expect(BNS_HERO_REEL.title).toContain("Kenya Owes Over 12 Trillion");
    expect(BNS_HERO_REEL.author).toContain("Calvina Praise");
    expect(BNS_HERO_REEL.videoUrl).toContain("Calvina%20Praise%20Sovereign%20debt.mp4");
  });

  it("resolves reels by ID or search term in getBnsR2Reel", () => {
    const r1 = getBnsR2Reel("reel-01");
    expect(r1.id).toBe("reel-01");

    const r2 = getBnsR2Reel("county");
    expect(r2.id).toBe("reel-02");

    const r3 = getBnsR2Reel("Budget Day");
    expect(r3.id).toBe("reel-03");

    const r4 = getBnsR2Reel("myth or fact");
    expect(r4.id).toBe("reel-04");

    const r5 = getBnsR2Reel("uwezo");
    expect(r5.id).toBe("reel-05");

    const r6 = getBnsR2Reel("unity");
    expect(r6.id).toBe("reel-06");

    const r7 = getBnsR2Reel("personal budget");
    expect(r7.id).toBe("reel-07");

    const r8 = getBnsR2Reel("uon cohort");
    expect(r8.id).toBe("reel-08");

    // Fallback for unknown ID returns the hero reel
    const fallback = getBnsR2Reel("non-existent-reel-999");
    expect(fallback.id).toBe("reel-01");
  });

  it("DEFAULT_REELS in reels-scroller has all 8 reels populated", () => {
    expect(DEFAULT_REELS).toHaveLength(8);
    const ids = DEFAULT_REELS.map((r) => r.id);
    expect(ids).toEqual([
      "reel-01",
      "reel-02",
      "reel-03",
      "reel-04",
      "reel-05",
      "reel-06",
      "reel-07",
      "reel-08",
    ]);
  });

  it("getFeaturedTikTokVideos returns all 8 reels with video URLs", async () => {
    const featured = await getFeaturedTikTokVideos();
    expect(featured).toHaveLength(8);
    expect(featured[0].video_url).toContain("Calvina%20Praise%20Sovereign%20debt.mp4");
    expect(featured[1].video_url).toContain("county%20%26%20budget%20socials%20new.mp4");
  });

  it("getTikTokVideo resolves individual reels", async () => {
    const video = await getTikTokVideo("reel-04");
    expect(video.id).toBe("reel-04");
    expect(video.video_url).toContain("MYTH%20or%20FACT");
    expect(video.tiktok_url).toBe("https://www.tiktok.com/@budget.ndio.story");
  });
});
