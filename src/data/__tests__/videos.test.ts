import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    videos: vi.fn(),
  },
}));

import { learnHubApi } from "@/lib/learn-hub";
import {
  videoData,
  getVideos,
  getVideoById,
  getGroupedSeries,
  setVideos,
} from "@/data/videos";
import videosFallback from "@/data/fallbacks/content-videos.json";

beforeEach(() => {
  vi.clearAllMocks();
  setVideos(
    (videosFallback.results ?? []).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      url: v.url,
      publishedAt: v.publishedAt,
      description: v.description,
      channelId: v.channelId,
    })),
  );
});

describe("videoData (JSON-only YouTube catalogue)", () => {
  it("fetch returns seeded content-videos.json and never calls learnHubApi.videos", async () => {
    (learnHubApi.videos as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: "api-only", title: "From API", url: "https://youtube.com/watch?v=api" }],
      count: 1,
    });

    const result = await videoData.fetch();

    expect(learnHubApi.videos).not.toHaveBeenCalled();
    expect(result.length).toBe(videosFallback.results.length);
    expect(result.map((v) => v.id).sort()).toEqual(
      videosFallback.results.map((v) => v.videoId).sort(),
    );
  });

  it("includes all three YouTube series from JSON", async () => {
    const result = await videoData.fetch();
    const titles = result.map((v) => v.title).join(" ");
    expect(titles).toMatch(/County Budget/i);
    expect(titles).toMatch(/Before Budget Day|Before the Budget/i);
    expect(titles).toMatch(/Infrastructure Fund/i);
  });

  it("getGroupedSeries builds series from JSON catalogue", () => {
    const series = getGroupedSeries();
    expect(series.length).toBeGreaterThanOrEqual(3);
  });
});

describe("getVideos / getVideoById", () => {
  it("returns DEFAULT catalogue as array", () => {
    const videos = getVideos();
    expect(videos.length).toBe(videosFallback.results.length);
  });

  it("each video has required fields", () => {
    for (const v of getVideos()) {
      expect(v.videoId).toBeTruthy();
      expect(v.title).toBeTruthy();
      expect(v.url).toContain("youtube.com");
      expect(v.publishedAt).toBeTruthy();
    }
  });

  it("getVideoById returns Part 1 BPS video", () => {
    const video = getVideoById("Ed9lP0-komE");
    expect(video?.title).toMatch(/Before Budget Day/i);
  });

  it("returns undefined for unknown ID", () => {
    expect(getVideoById("nonexistent")).toBeUndefined();
  });
});
