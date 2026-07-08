/**
 * Canonical acceptance test — lesson journey
 * @see agent/spec/journey-contracts/lesson-journey.md
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  LearningRuntime,
  resetLearningRuntimeForTests,
  deriveLessonExperience,
  buildLessonMetaFromLesson,
  lessonKey,
} from "@/lib/learning-runtime";
import { clearPersistedEvents } from "@/lib/learning-runtime/persistence";

const scope = {
  courseSlug: "national-budget",
  moduleSlug: "introduction",
  lessonSlug: "what-is-the-budget",
};

const lesson = {
  slug: "what-is-the-budget",
  parts: [
    { id: "p1", trivia: { id: "t1" } },
    { id: "p2" },
  ],
};

describe("Lesson journey — canonical acceptance", () => {
  beforeEach(() => {
    resetLearningRuntimeForTests();
    clearPersistedEvents();
  });

  it("Given learner opens lesson, when full journey, then progress and timeline correct", () => {
    const runtime = new LearningRuntime("journey-test");
    const meta = buildLessonMetaFromLesson(lesson);

    runtime.dispatch({ type: "LessonOpened", payload: { ...scope, ...meta } });

    // Part 1
    runtime.dispatch({ type: "VideoStarted", payload: { partId: "p1" } });
    runtime.dispatch({
      type: "VideoCompleted",
      payload: { partId: "p1", durationSeconds: 180, hasTrivia: true },
    });
    runtime.dispatch({ type: "TriviaOpened", payload: { triviaId: "t1", partId: "p1" } });
    runtime.dispatch({
      type: "TriviaAnswered",
      payload: { triviaId: "t1", partId: "p1", correct: true },
    });
    runtime.dispatch({ type: "ContinuePressed", payload: { scope: "part" } });

    // Part 2
    runtime.dispatch({ type: "VideoStarted", payload: { partId: "p2" } });
    runtime.dispatch({
      type: "VideoCompleted",
      payload: { partId: "p2", durationSeconds: 120, hasTrivia: false },
    });

    // Reflection + complete
    runtime.dispatch({
      type: "ReflectionSaved",
      payload: { lessonSlug: lesson.slug, length: 42 },
    });
    runtime.dispatch({ type: "ContinuePressed", payload: { scope: "lesson" } });

    const events = runtime.getEvents();
    const state = runtime.getState();
    const view = deriveLessonExperience(events, scope)!;

    expect(events.some((e) => e.type === "LessonCompleted")).toBe(true);
    expect(events.some((e) => e.type === "PartAdvanced")).toBe(true);
    expect(events.filter((e) => e.type === "VideoCompleted")).toHaveLength(2);
    expect(runtime.getTimeline().length).toBe(events.length);
    expect(state.progress.completedLessons).toContain(lessonKey(scope));
    expect(view.lessonComplete).toBe(true);
    expect(view.showContinue).toBe(false);
  });
});
