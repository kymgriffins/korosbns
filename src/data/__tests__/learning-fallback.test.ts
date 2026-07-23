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
import learnSummaryFallback from "@/data/fallbacks/learn-summary.json";

beforeEach(() => {
  vi.clearAllMocks();
  learningData.modules.set([]);
});

describe("learningData.modules (JSON-only catalogue)", () => {
  it("returns seeded civic-modules.json and never calls civicModules API", async () => {
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [
        {
          id: "api-should-be-ignored",
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
      ],
      count: 1,
    });

    const result = await learningData.modules.fetch();

    expect(learnHubApi.civicModules).not.toHaveBeenCalled();
    expect(result.length).toBe(fallbackModules.results.length);
    expect(result.map((m) => m.slug)).toEqual(
      fallbackModules.results.map((m) => m.slug),
    );
    expect(learningData.modules.usedFallback()).toBe(true);
  });

  it("includes budget-policy-statement from JSON even when API would succeed", async () => {
    (learnHubApi.civicModules as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [],
      count: 0,
    });

    const result = await learningData.modules.fetch();

    expect(learnHubApi.civicModules).not.toHaveBeenCalled();
    expect(result.some((m) => m.slug === "budget-policy-statement")).toBe(true);
  });

  it("never throws when JSON catalogue exists", async () => {
    await expect(learningData.modules.fetch()).resolves.toBeTruthy();
    expect(learnHubApi.civicModules).not.toHaveBeenCalled();
  });

  it("fetchBySlug resolves from JSON and never calls civicModule API", async () => {
    const slug = fallbackModules.results[0]?.slug as string;
    (learnHubApi.civicModule as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "api",
      slug: "api-only",
      title: "API",
      steps: [],
    });

    const mod = await learningData.modules.fetchBySlug(slug);

    expect(learnHubApi.civicModule).not.toHaveBeenCalled();
    expect(mod?.slug).toBe(slug);
  });

  it("fetchBySlug returns null for unknown slug without API", async () => {
    const mod = await learningData.modules.fetchBySlug("does-not-exist");
    expect(learnHubApi.civicModule).not.toHaveBeenCalled();
    expect(mod).toBeNull();
  });
});

describe("learningData.summary (JSON-only catalogue)", () => {
  it("returns learn-summary.json and never calls summary API", async () => {
    (learnHubApi.summary as ReturnType<typeof vi.fn>).mockResolvedValue({
      counts: { path: 99 },
      trending: [],
    });

    const summary = await learningData.summary.fetch();

    expect(learnHubApi.summary).not.toHaveBeenCalled();
    expect(summary.counts.path).toBe(learnSummaryFallback.counts.path);
    expect(summary.trending.length).toBeGreaterThan(0);
  });
});

describe("learningData.profile (API allowed)", () => {
  it("still calls profile API for personal state", async () => {
    const payload = { gamification: { points: 1 }, progress: [] };
    (learnHubApi.profile as ReturnType<typeof vi.fn>).mockResolvedValue(payload);

    const result = await learningData.profile.fetch();

    expect(learnHubApi.profile).toHaveBeenCalled();
    expect(result).toEqual(payload);
  });
});
