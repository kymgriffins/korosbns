import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    civicModules: vi.fn(),
    civicModule: vi.fn(),
    summary: vi.fn(),
    profile: vi.fn(),
    authors: vi.fn(),
    author: vi.fn(),
  },
}));

import { learnHubApi } from "@/lib/learn-hub";
import { learningData } from "@/data/learning";
import fallbackModules from "@/data/fallbacks/civic-modules.json";

beforeEach(() => {
  vi.clearAllMocks();
  learningData.modules.set([]);
});

describe("learningData.modules (read-only JSON fallback)", () => {
  it("returns API results when civic-modules succeeds", async () => {
    const apiMods = [
      {
        id: "api-1",
        title: "Live Module",
        slug: "live-module",
        badge: "1",
        badgeName: "Live",
        documentName: "Live",
        archive: "",
        link: "",
        status: "Published",
        credits: "BNS",
        description: "from API",
        expectations: [],
        order: 1,
        steps: [
          {
            id: "live-ch1",
            title: "Intro",
            order: 1,
            youtube_url: "",
            audio_url: "",
            transcript: "",
            text: "Published lesson body",
          },
        ],
      },
    ];
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: apiMods,
      count: 1,
    });

    const result = await learningData.modules.fetch();
    expect(result).toEqual(apiMods);
    expect(learningData.modules.usedFallback()).toBe(false);
  });

  it("drops API modules that have no learnable content", async () => {
    const apiMods = [
      {
        id: "empty",
        title: "Empty Module",
        slug: "empty-module",
        badge: "1",
        badgeName: "Empty",
        documentName: "Empty",
        archive: "",
        link: "",
        status: "Published",
        credits: "BNS",
        description: "placeholder",
        expectations: [],
        order: 1,
        steps: [
          {
            id: "empty-ch1",
            title: "Placeholder",
            order: 1,
            youtube_url: "",
            audio_url: "",
            transcript: "",
            text: "",
          },
        ],
      },
      {
        id: "api-1",
        title: "Live Module",
        slug: "live-module",
        badge: "1",
        badgeName: "Live",
        documentName: "Live",
        archive: "",
        link: "",
        status: "Published",
        credits: "BNS",
        description: "from API",
        expectations: [],
        order: 2,
        steps: [
          {
            id: "live-ch1",
            title: "Intro",
            order: 1,
            youtube_url: "",
            audio_url: "",
            transcript: "",
            text: "Published lesson body",
          },
        ],
      },
    ];
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: apiMods,
      count: 2,
    });

    const result = await learningData.modules.fetch();
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("live-module");
  });

  it("returns seeded JSON catalogue when civic-modules API fails", async () => {
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("timeout"),
    );

    const result = await learningData.modules.fetch();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.slug).toBe(fallbackModules.results[0]?.slug);
    expect(learningData.modules.usedFallback()).toBe(true);
  });

  it("uses JSON fallback when API returns an empty results list", async () => {
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [],
      count: 0,
    });
    const result = await learningData.modules.fetch();
    expect(result.length).toBeGreaterThan(0);
    expect(learningData.modules.usedFallback()).toBe(true);
  });

  it("never throws when fallback catalogue exists", async () => {
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("404"),
    );
    await expect(learningData.modules.fetch()).resolves.toBeTruthy();
  });

  it("fetchBySlug resolves from fallback when detail API fails", async () => {
    const slug = fallbackModules.results[0]?.slug as string;
    (learnHubApi.civicModule as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("offline"),
    );
    const mod = await learningData.modules.fetchBySlug(slug);
    expect(mod?.slug).toBe(slug);
  });
});

describe("learningData.summary", () => {
  it("falls back to learn-summary.json when hub summary fails", async () => {
    (learnHubApi.summary as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("fail"),
    );
    const summary = await learningData.summary.fetch();
    expect(summary.counts.path).toBeGreaterThan(0);
    expect(summary.trending.length).toBeGreaterThan(0);
  });
});
