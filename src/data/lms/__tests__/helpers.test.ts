import { describe, expect, it } from "vitest";
import { getFirstLessonHref, getLessonNeighbors } from "@/data/lms/helpers";
import { getCourse } from "@/data/lms/catalog";
import { canTransition, isContinueEnabled, lessonSessionReducer } from "@/data/lms/lesson-state";

describe("getLessonNeighbors", () => {
  const course = getCourse("kenya-budget-fundamentals");
  if (!course) throw new Error("fixture course missing");

  it("returns next lesson href", () => {
    const { next } = getLessonNeighbors(course, "introduction", "what-is-the-budget");
    expect(next).toContain("who-makes-the-budget");
  });
});

describe("getFirstLessonHref", () => {
  it("returns first available lesson", () => {
    const course = getCourse("kenya-budget-fundamentals");
    expect(getFirstLessonHref(course!)).toContain("/lessons/");
  });
});

describe("lessonSessionReducer", () => {
  it("transitions loading to ready", () => {
    expect(lessonSessionReducer("loading", { type: "DATA_READY" })).toBe("ready");
  });

  it("blocks play during trivia_required", () => {
    expect(lessonSessionReducer("trivia_required", { type: "PLAY" })).toBe("trivia_required");
  });

  it("enables continue on part_complete", () => {
    expect(isContinueEnabled("part_complete")).toBe(true);
  });

  it("rejects illegal transition in canTransition", () => {
    expect(canTransition("trivia_required", "NAVIGATE")).toBe(false);
  });
});
