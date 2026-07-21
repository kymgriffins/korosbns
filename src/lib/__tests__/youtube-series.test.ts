import { describe, it, expect } from "vitest";
import {
  BPS_YOUTUBE_URLS,
  currentYoutubeSeries,
  groupYoutubeSeries,
  isBpsSeriesTitle,
  normalizeSeriesTitle,
} from "@/lib/youtube-series";
import { ensureBpsYoutube } from "@/lib/civic-module-content";
import type { CivicModule, ChapterStep } from "@/types/learn";

describe("youtube-series", () => {
  it("strips PART prefixes into one series title", () => {
    expect(normalizeSeriesTitle("PART 3: County Budget: Where Does the Money Come From?")).toBe(
      "County Budget: Where Does the Money Come From?",
    );
    expect(normalizeSeriesTitle("PART 2-Before the Budget: This Is Where It Starts")).toBe(
      "Before Budget Day: This Is Where It Starts",
    );
  });

  it("detects BPS series titles", () => {
    expect(isBpsSeriesTitle("Before Budget Day: This Is Where It Starts")).toBe(true);
    expect(isBpsSeriesTitle("County Budget: Where Does the Money Come From?")).toBe(false);
  });

  it("groups RSS parts and marks newest series current", () => {
    const groups = groupYoutubeSeries([
      {
        videoId: "a",
        title: "Before Budget Day: This Is Where It Starts",
        url: "https://www.youtube.com/watch?v=a",
        publishedAt: "2026-04-02T10:00:00Z",
      },
      {
        videoId: "b",
        title: "PART 2: Before Budget Day: This Is Where It Starts",
        url: "https://www.youtube.com/watch?v=b",
        publishedAt: "2026-04-04T10:00:00Z",
      },
      {
        videoId: "c",
        title: "County Budget: Where Does the Money Come From?",
        url: "https://www.youtube.com/watch?v=c",
        publishedAt: "2026-06-19T05:00:00Z",
      },
      {
        videoId: "d",
        title: "PART 2: County Budget: Where Does the Money Come From?",
        url: "https://www.youtube.com/watch?v=d",
        publishedAt: "2026-06-22T15:00:00Z",
      },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].isCurrent).toBe(true);
    expect(groups[0].title).toContain("County Budget");
    expect(groups[0].videos).toHaveLength(2);
    expect(groups[1].isBps).toBe(true);
    expect(currentYoutubeSeries(groups.flatMap((g) => g.videos))?.id).toBe(groups[0].id);
  });
});

describe("ensureBpsYoutube", () => {
  const emptyStep = (order: number): ChapterStep => ({
    id: `s${order}`,
    title: `Step ${order}`,
    order,
    youtube_url: "",
    youtube_urls: [],
    audio_url: "",
    transcript: "",
    text: "Body",
    takeaways: [],
    is_completed: false,
    is_locked: false,
  });

  it("fills missing youtube on budget-policy-statement steps", () => {
    const mod: CivicModule = {
      id: "bps",
      title: "Budget Policy Statement",
      slug: "budget-policy-statement",
      badge: "1",
      badgeName: "BPS",
      documentName: "BPS",
      archive: "",
      link: "",
      status: "Published",
      credits: "BNS",
      description: "BPS",
      expectations: [],
      order: 1,
      steps: [emptyStep(1), emptyStep(2)],
    };
    const next = ensureBpsYoutube(mod);
    expect(next.steps[0].youtube_urls).toEqual([...BPS_YOUTUBE_URLS]);
    expect(next.steps[1].youtube_url).toBe(BPS_YOUTUBE_URLS[0]);
  });

  it("leaves non-BPS modules untouched", () => {
    const mod: CivicModule = {
      id: "x",
      title: "Other",
      slug: "other",
      badge: "1",
      badgeName: "Other",
      documentName: "Other",
      archive: "",
      link: "",
      status: "Published",
      credits: "BNS",
      description: "Other",
      expectations: [],
      order: 2,
      steps: [emptyStep(1)],
    };
    expect(ensureBpsYoutube(mod).steps[0].youtube_urls ?? []).toEqual([]);
  });
});
