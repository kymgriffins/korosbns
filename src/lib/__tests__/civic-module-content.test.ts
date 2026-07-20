import { describe, it, expect } from "vitest";
import fallbackModules from "@/data/fallbacks/civic-modules.json";
import {
  filterModulesWithPublishableContent,
  moduleHasPublishableContent,
  stepHasPublishableContent,
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
});
