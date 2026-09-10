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
  it("get() returns the three seeded YouTube project URLs", () => {
    const projects = getFeaturedProjects();
    expect(projects).toHaveLength(3);
    expect(projects.map((p) => p.videoId).sort()).toEqual(
      ["G5ddu4I6mNs", "it8rOKSYKnc", "kWpY4K1uI20"].sort(),
    );
    for (const project of projects) {
      expect(project.thumbnail).toMatch(
        new RegExp(`i\\.ytimg\\.com/vi/${project.videoId}/hqdefault\\.jpg`),
      );
      expect(project.prose.length).toBeGreaterThan(40);
    }
  });

  it("fetch() falls back to seed when YouTube refresh fails", async () => {
    vi.spyOn(youtubeMeta, "fetchYoutubeOembed").mockRejectedValue(
      new Error("network"),
    );
    vi.spyOn(youtubeMeta, "fetchYoutubeChannelRss").mockRejectedValue(
      new Error("network"),
    );

    const result = await featuredProjectsData.fetch();
    expect(result).toHaveLength(3);
    expect(result[0]?.videoId).toBeTruthy();
    expect(result.every((p) => p.thumbnail.includes("ytimg.com"))).toBe(true);
  });

  it("refreshFeaturedProjectsFromYoutube merges oEmbed titles", async () => {
    vi.spyOn(youtubeMeta, "fetchYoutubeChannelRss").mockResolvedValue([]);
    vi.spyOn(youtubeMeta, "fetchYoutubeOembed").mockImplementation(
      async (url) => {
        if (url.includes("G5ddu4I6mNs")) {
          return {
            title: "Live IFF title from oEmbed",
            author_name: "Lyla Latif",
            thumbnail_url: "https://i.ytimg.com/vi/G5ddu4I6mNs/hqdefault.jpg",
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
    const iff = live.find((p) => p.videoId === "G5ddu4I6mNs");
    expect(iff?.title).toBe("Live IFF title from oEmbed");
    expect(iff?.prose).toContain("House of Fiscal Wisdom");
  });
});
