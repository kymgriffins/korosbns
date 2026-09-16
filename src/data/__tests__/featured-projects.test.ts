import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  featuredProjectsData,
  getFeaturedProjects,
  setFeaturedProjects,
  refreshFeaturedProjectsFromYoutube,
} from "@/data/featured-projects";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import * as youtubeMeta from "@/lib/youtube-meta";

beforeEach(() => {
  setFeaturedProjects(
    featuredFallback.results.map((row) => ({
      ...row,
      programmeSlug: row.programmeSlug as
        | "wanahabari-lab"
        | "studios"
        | "connect"
        | "mashinani",
    })),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("featuredProjectsData", () => {
  it("get() returns the seeded YouTube project URLs with local covers", () => {
    const projects = getFeaturedProjects();
    expect(projects.length).toBeGreaterThanOrEqual(3);
    // Verify that at least some of the expected videoIds are present
    const videoIds = projects.map((p) => p.videoId);
    expect(videoIds).toContain("it8rOKSYKnc");
    expect(videoIds).toContain("kWpY4K1uI20");
    for (const project of projects) {
      expect(project.prose.length).toBeGreaterThan(40);
      expect(project.url).toMatch(/youtube\.com\/watch\?v=/);
    }
  });

  it("fetch() falls back to seed when YouTube refresh fails", async () => {
    vi.spyOn(youtubeMeta, "fetchYoutubeOembed").mockRejectedValue(
      new Error("network"),
    );
    vi.spyOn(youtubeMeta, "fetchYoutubeChannelRss").mockRejectedValue(
      new Error("network"),
    );
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const result = await featuredProjectsData.fetch();
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result[0]?.videoId).toBeTruthy();
  }, 15000);

  it("refreshFeaturedProjectsFromYoutube merges oEmbed titles and keeps local covers", async () => {
    vi.spyOn(youtubeMeta, "fetchYoutubeChannelRss").mockResolvedValue([]);
    vi.spyOn(youtubeMeta, "fetchYoutubeOembed").mockImplementation(
      async (url) => {
        if (url.includes("it8rOKSYKnc")) {
          return {
            title: "Live TERRA title from oEmbed",
            author_name: "Lyla Latif",
            thumbnail_url: "https://i.ytimg.com/vi/it8rOKSYKnc/hqdefault.jpg",
          };
        }
        return {
          title: "Other live title",
          author_name: "Partner",
          thumbnail_url: "https://i.ytimg.com/vi/kWpY4K1uI20/hqdefault.jpg",
        };
      },
    );

    const live = await refreshFeaturedProjectsFromYoutube();
    const terra = live.find((p) => p.videoId === "it8rOKSYKnc");
    expect(terra?.title).toBe("Live TERRA title from oEmbed");
    expect(terra?.prose).toContain("House of Fiscal Wisdom");
    expect(terra?.thumbnail).not.toMatch(/ytimg\.com/);
  });
});
