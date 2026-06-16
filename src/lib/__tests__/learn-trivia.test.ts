import { describe, expect, it } from "vitest";
import { triviaForStep, stageHasAnyQuiz } from "../learn-trivia";
import type { CivicModule, ChapterStep } from "@/types/learn";

const baseStep = (overrides: Partial<ChapterStep> = {}): ChapterStep => ({
  id: "step-1",
  title: "Step 1",
  order: 1,
  youtube_url: "",
  audio_url: "",
  transcript: "",
  text: "Body",
  takeaways: [],
  is_completed: false,
  is_locked: false,
  ...overrides,
});

describe("triviaForStep", () => {
  it("prefers chapter-level trivia when present", () => {
    const stage: CivicModule = {
      id: "mod-1",
      title: "Module",
      slug: "module",
      badge: "📘",
      badgeName: "Module",
      documentName: "Module",
      archive: "",
      link: "",
      status: "Published",
      credits: "",
      description: "",
      expectations: [],
      order: 1,
      steps: [
        baseStep({ id: "s1", order: 1 }),
        baseStep({
          id: "s2",
          order: 2,
          trivia: [{ type: "multiple-choice", question: "Q?", options: ["A", "B"], answer: 0 }],
        }),
      ],
    };

    expect(triviaForStep(stage, stage.steps[1], 1)).toHaveLength(1);
    expect(triviaForStep(stage, stage.steps[0], 0)).toHaveLength(0);
  });

  it("falls back to module trivia on the final chapter only", () => {
    const moduleTrivia = [{ type: "multiple-choice" as const, question: "Module Q?", options: ["A"], answer: 0 }];
    const stage: CivicModule = {
      id: "mod-1",
      title: "BPS",
      slug: "budget-policy-statement",
      badge: "📘",
      badgeName: "BPS",
      documentName: "BPS",
      archive: "",
      link: "",
      status: "Published",
      credits: "",
      description: "",
      expectations: [],
      order: 1,
      trivia: moduleTrivia,
      steps: [baseStep({ id: "s1", order: 1 }), baseStep({ id: "s2", order: 2 })],
    };

    expect(triviaForStep(stage, stage.steps[0], 0)).toHaveLength(0);
    expect(triviaForStep(stage, stage.steps[1], 1)).toEqual(moduleTrivia);
    expect(stageHasAnyQuiz(stage)).toBe(true);
  });
});
