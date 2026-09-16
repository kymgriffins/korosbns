import { describe, it, expect } from "vitest";
import { curateFlagshipYoutubeProducts } from "@/lib/youtube-curator";
import type { SeriesVideo } from "@/lib/youtube-series";

describe("youtube-curator marketing hrefs", () => {
  const videos: SeriesVideo[] = [
    {
      videoId: "abc123",
      title: "PART 1: Before Budget Day: This Is Where It Starts",
      url: "https://www.youtube.com/watch?v=abc123",
      publishedAt: "2026-04-02T10:00:00Z",
      description: "Course companion series",
    },
  ];

  it("routes course companions to /bns-project, never /learn", () => {
    const curated = curateFlagshipYoutubeProducts(videos, []);
    expect(curated.length).toBeGreaterThan(0);
    for (const item of curated) {
      expect(item.href.startsWith("/bns-project/")).toBe(true);
      expect(item.href.startsWith("/learn")).toBe(false);
    }
  });

  it("rewrites legacy /learn hrefs on existing projects", () => {
    const curated = curateFlagshipYoutubeProducts(videos, [
      {
        id: "legacy",
        slug: "legacy-slug",
        videoId: "abc123",
        url: "https://www.youtube.com/watch?v=abc123",
        title: "Before Budget Day: This Is Where It Starts",
        prose: "Existing",
        thumbnail: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
        authorName: "Budget Ndio Story Team",
        programmeSlug: "connect",
        programmeLabel: "BNS Connect",
        href: "/learn/modules/budget-policy-statement",
        publishedAt: "2026-04-02T10:00:00Z",
      },
    ]);
    expect(curated[0].href).toBe("/bns-project/legacy-slug");
  });

  it("preserves non-Learn existing hrefs (e.g. studio)", () => {
    const curated = curateFlagshipYoutubeProducts(videos, [
      {
        id: "studio",
        slug: "studio-slug",
        videoId: "abc123",
        url: "https://www.youtube.com/watch?v=abc123",
        title: "Before Budget Day: This Is Where It Starts",
        prose: "Existing",
        thumbnail: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
        authorName: "Budget Ndio Story Team",
        programmeSlug: "connect",
        programmeLabel: "BNS Connect",
        href: "/bns-studio/cabri-digital-pfm-reforms",
        publishedAt: "2026-04-02T10:00:00Z",
      },
    ]);
    expect(curated[0].href).toBe("/bns-studio/cabri-digital-pfm-reforms");
  });
});
