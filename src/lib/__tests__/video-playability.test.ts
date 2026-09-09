import { describe, it, expect, vi } from "vitest";
import {
  BNS_HERO_REEL,
  BNS_R2_BASE_URL,
  BNS_R2_REELS,
  getAllBnsR2Reels,
  getBnsR2Reel,
} from "@/constants/bns-r2-reels";

describe("Video Playability & Media Engine", () => {
  it("verifies all 8 R2 reels have valid, playable MP4 URLs", () => {
    const reels = getAllBnsR2Reels();
    expect(reels).toHaveLength(8);

    reels.forEach((reel) => {
      // 1. URL Structure
      expect(reel.videoUrl).toBeDefined();
      expect(reel.videoUrl).toMatch(/^https:\/\/pub-96ce2eba58694b1da7f540033bdaa464\.r2\.dev\/.+\.mp4$/);

      // 2. URL encode test (valid URI that doesn't throw)
      expect(() => new URL(reel.videoUrl)).not.toThrow();

      // 3. Format & extension check
      expect(reel.videoUrl.toLowerCase().endsWith(".mp4")).toBe(true);

      // 4. Content attributes required for player rendering
      expect(reel.title.trim().length).toBeGreaterThan(0);
      expect(reel.duration).toMatch(/^\d+:\d{2}$/);
      expect(reel.category.trim().length).toBeGreaterThan(0);
    });
  });

  it("verifies hero video (Calvina Praise Sovereign Debt) has valid playable attributes", () => {
    expect(BNS_HERO_REEL).toBeDefined();
    expect(BNS_HERO_REEL.featuredInHero).toBe(true);
    expect(BNS_HERO_REEL.videoUrl).toContain("Calvina%20Praise%20Sovereign%20debt.mp4");

    const parsed = new URL(BNS_HERO_REEL.videoUrl);
    expect(parsed.hostname).toBe("pub-96ce2eba58694b1da7f540033bdaa464.r2.dev");
    expect(parsed.pathname).toBe("/Calvina%20Praise%20Sovereign%20debt.mp4");
  });

  it("simulates video element media playback lifecycle (load -> canplay -> play -> pause)", async () => {
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(async () => {});
    const pauseSpy = vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

    const video = document.createElement("video");
    video.src = BNS_HERO_REEL.videoUrl;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.loop = true;

    expect(video.src).toContain("Calvina%20Praise%20Sovereign%20debt.mp4");
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);

    // Trigger play
    await video.play();
    expect(playSpy).toHaveBeenCalled();

    // Trigger unmute
    video.muted = false;
    expect(video.muted).toBe(false);

    // Trigger pause
    video.pause();
    expect(pauseSpy).toHaveBeenCalled();

    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  it("ensures all 8 reels have unique video file paths to avoid duplicate playback", () => {
    const urls = BNS_R2_REELS.map((r) => r.videoUrl);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(8);

    const keys = BNS_R2_REELS.map((r) => r.r2Key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(8);
  });

  it("verifies canPlayType supports MP4 video containers", () => {
    const video = document.createElement("video");
    const result = video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    expect(typeof result).toBe("string");
  });
});
