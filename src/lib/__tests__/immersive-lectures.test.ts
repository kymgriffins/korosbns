import { describe, it, expect, vi } from "vitest";
import {
  immersiveModuleHref,
  lecturesForModule,
  modesForStep,
  nextContentAfter,
  preferredModeForStep,
  resolveResumeStep,
  stepHasArticle,
  stepHasVideo,
} from "@/lib/immersive-module";
import type { ChapterStep, CivicModule } from "@/types/learn";

function step(partial: Partial<ChapterStep> & { id: string; title: string; order: number }): ChapterStep {
  return {
    youtube_url: "",
    audio_url: "",
    transcript: "",
    text: "",
    takeaways: [],
    is_completed: false,
    is_locked: false,
    ...partial,
  };
}

function mod(steps: ChapterStep[], trivia: CivicModule["trivia"] = []): CivicModule {
  return {
    id: "m1",
    title: "Test Module",
    slug: "test-module",
    badge: "",
    badgeName: "",
    documentName: "",
    archive: "",
    link: "",
    status: "published",
    credits: "",
    description: "desc",
    expectations: [],
    order: 1,
    steps,
    trivia,
  };
}

describe("Udemy-style lecture relay", () => {
  it("maps article + video + quiz into typed lectures", () => {
    const m = mod([
      step({
        id: "s1",
        title: "Intro",
        order: 1,
        text: "Hello budget",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        trivia: [
          {
            type: "multiple-choice",
            question: "What?",
            options: ["A", "B"],
            answer: 0,
          },
        ],
      }),
    ]);
    const lectures = lecturesForModule(m);
    expect(lectures.map((l) => l.kind)).toEqual(["article", "video", "quiz"]);
    expect(lectures[0].href).toBe("/learn/modules/test-module/read/1");
    expect(lectures[1].href).toBe("/learn/modules/test-module/watch/1");
    expect(lectures[2].href).toBe("/learn/modules/test-module/quiz/1/1");
  });

  it("Continue path goes Article → Video → Quiz → next lesson", () => {
    const m = mod([
      step({
        id: "s1",
        title: "One",
        order: 1,
        text: "Read me",
        youtube_url: "https://youtu.be/aaaaaaaaaaa",
        trivia: [{ type: "reflection", question: "Why?", placeholder: "..." }],
      }),
      step({
        id: "s2",
        title: "Two",
        order: 2,
        text: "Second",
      }),
    ]);

    expect(nextContentAfter(m, 1, "read")).toMatchObject({
      label: "Watch video",
      completesStep: false,
      href: "/learn/modules/test-module/watch/1",
    });
    expect(nextContentAfter(m, 1, "watch")).toMatchObject({
      label: "Take quiz",
      href: "/learn/modules/test-module/quiz/1/1",
    });
    expect(nextContentAfter(m, 1, "quiz")).toMatchObject({
      label: "Next lesson",
      completesStep: true,
      href: "/learn/modules/test-module/read/2",
    });
  });

  it("video-only lesson prefers watch mode", () => {
    const m = mod([
      step({
        id: "s1",
        title: "Clip",
        order: 1,
        youtube_url: "https://youtu.be/bbbbbbbbbbb",
      }),
    ]);
    expect(stepHasArticle(m.steps[0])).toBe(false);
    expect(stepHasVideo(m.steps[0])).toBe(true);
    expect(preferredModeForStep(m, 0)).toBe("watch");
    expect(modesForStep(m, 0)).toEqual(["watch"]);
  });

  it("hrefs are 1-based", () => {
    expect(immersiveModuleHref("bps", "read", 2)).toBe("/learn/modules/bps/read/2");
    expect(immersiveModuleHref("bps", "quiz", 3, 2)).toBe("/learn/modules/bps/quiz/3/2");
  });

  it("resolveResumeStep defaults to 1 when empty progress", () => {
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      key: () => null,
      length: 0,
    });
    const m = mod([step({ id: "s1", title: "A", order: 1, text: "x" })]);
    expect(resolveResumeStep(m)).toBe(1);
    vi.unstubAllGlobals();
  });
});
