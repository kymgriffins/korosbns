import { describe, it, expect } from "vitest";
import fallbackModules from "@/data/fallbacks/civic-modules.json";
import {
  filterModulesWithPublishableContent,
  moduleHasPublishableContent,
  stepHasPublishableContent,
  ensureModuleYoutubeImages,
} from "@/lib/civic-module-content";
import type { ChapterStep, CivicModule } from "@/types/learn";

const emptyStep: ChapterStep = {
  id: "s1",
  title: "Placeholder",
  order: 1,
  youtube_url: "",
  audio_url: "",
  transcript: "",
  text: "",
  takeaways: [],
  is_completed: false,
  is_locked: false,
};

describe("civic-module-content", () => {
  it("treats steps with body text as publishable", () => {
    expect(stepHasPublishableContent({ ...emptyStep, text: "Hello" })).toBe(true);
  });

  it("treats title-only steps as not publishable", () => {
    expect(stepHasPublishableContent(emptyStep)).toBe(false);
  });

  it("filters modules without learnable steps", () => {
    const emptyModule: CivicModule = {
      id: "x",
      title: "Empty",
      slug: "empty",
      badge: "1",
      badgeName: "Empty",
      documentName: "Empty",
      archive: "",
      link: "",
      status: "Published",
      credits: "BNS",
      description: "No steps yet",
      expectations: [],
      order: 1,
      steps: [emptyStep],
    };
    const withContent: CivicModule = {
      ...emptyModule,
      id: "y",
      slug: "with-content",
      steps: [{ ...emptyStep, text: "Lesson body" }],
    };

    expect(moduleHasPublishableContent(emptyModule)).toBe(false);
    expect(moduleHasPublishableContent(withContent)).toBe(true);
    expect(filterModulesWithPublishableContent([emptyModule, withContent])).toEqual([
      withContent,
    ]);
  });

  it("fallback catalogue only exposes modules with content", () => {
    const modules = (fallbackModules.results ?? []) as unknown as CivicModule[];
    const publishable = filterModulesWithPublishableContent(modules);
    expect(publishable.length).toBeGreaterThan(0);
    expect(publishable.every(moduleHasPublishableContent)).toBe(true);
  });

  it("ensureModuleYoutubeImages sets cover + step thumbs from youtube_urls", () => {
    const mod: CivicModule = {
      id: "m",
      title: "County",
      slug: "county-budget",
      badge: "1",
      badgeName: "County",
      documentName: "County",
      archive: "",
      link: "",
      status: "Published",
      credits: "BNS",
      description: "County",
      expectations: [],
      order: 1,
      image_url: "https://pbs.twimg.com/media/placeholder.jpg",
      steps: [
        {
          ...emptyStep,
          youtube_url: "https://www.youtube.com/watch?v=3wfk09c_xNQ",
          youtube_urls: [
            "https://www.youtube.com/watch?v=3wfk09c_xNQ",
            "https://www.youtube.com/watch?v=abDYZ5xjQgo",
          ],
          text: "Body",
        },
      ],
    };
    const next = ensureModuleYoutubeImages(mod);
    expect(next.image_url).toBe(
      "https://i.ytimg.com/vi/3wfk09c_xNQ/hqdefault.jpg",
    );
    expect(next.steps[0]?.image_urls?.[0]).toBe(
      "https://i.ytimg.com/vi/3wfk09c_xNQ/hqdefault.jpg",
    );
    expect(next.steps[0]?.image_urls).toContain(
      "https://i.ytimg.com/vi/abDYZ5xjQgo/hqdefault.jpg",
    );
  });

  it("fallback modules use ytimg covers for YouTube series", () => {
    const modules = (fallbackModules.results ?? []) as unknown as CivicModule[];
    for (const mod of modules) {
      expect(mod.image_url).toMatch(/i\.ytimg\.com\/vi\//);
    }
  });
});
