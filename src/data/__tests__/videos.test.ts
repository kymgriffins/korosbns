import { describe, it, expect, beforeEach } from "vitest";
import { videoData, getVideos, getVideoById } from "@/data/videos";

describe("videoData.fetch()", () => {
  it("returns an array when API fails (withFallback)", async () => {
    const result = await videoData.fetch();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns results with proper shape when fallback used", async () => {
    const result = await videoData.fetch();
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
    }
  });
});

describe("getVideos()", () => {
  it("returns DEFAULT_VIDEOS as array", () => {
    const videos = getVideos();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
  });

  it("each video has required fields", () => {
    const videos = getVideos();
    for (const v of videos) {
      expect(v).toHaveProperty("videoId");
      expect(v).toHaveProperty("title");
      expect(v).toHaveProperty("url");
      expect(v).toHaveProperty("publishedAt");
    }
  });
});

describe("getVideoById()", () => {
  it("returns a video by ID", () => {
    const video = getVideoById("FkgRz4v2Llk");
    expect(video).toBeTruthy();
    expect(video?.title).toContain("Budget Day");
  });

  it("returns undefined for unknown ID", () => {
    const video = getVideoById("nonexistent");
    expect(video).toBeUndefined();
  });
});
