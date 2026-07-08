import { describe, expect, it, beforeEach } from "vitest";
import { reduceEvents } from "@/lib/learning-runtime/reducer";
import type { LearningEvent } from "@/lib/learning-runtime/types";
import { LearningRuntime, resetLearningRuntimeForTests } from "@/lib/learning-runtime/runtime";
import { clearPersistedEvents, loadPersistedEvents } from "@/lib/learning-runtime/persistence";
import { lessonKey } from "@/lib/learning-runtime/types";

const baseScope = {
  courseSlug: "budget-basics",
  moduleSlug: "intro",
  lessonSlug: "what-is-budget",
};

function sessionStarted(at = "2026-07-07T09:00:00.000Z"): LearningEvent {
  return {
    id: "1",
    type: "SessionStarted",
    occurredAt: at,
    sessionId: "test",
    payload: { ...baseScope, partId: "part-1" },
  };
}

describe("Learning Runtime — deterministic", () => {
  it("same events produce same state", () => {
    const events: LearningEvent[] = [
      sessionStarted(),
      {
        id: "2",
        type: "VideoStarted",
        occurredAt: "2026-07-07T09:02:00.000Z",
        sessionId: "test",
        payload: { partId: "part-1" },
      },
      {
        id: "3",
        type: "LessonCompleted",
        occurredAt: "2026-07-07T09:15:00.000Z",
        sessionId: "test",
        payload: baseScope,
      },
    ];

    const a = reduceEvents(events);
    const b = reduceEvents(events);
    expect(a).toEqual(b);
    expect(a.progress.completedLessons).toContain(lessonKey(baseScope));
    expect(a.lessonPhase).toBe("lesson_complete");
  });
});

describe("Learning Runtime — replayable", () => {
  beforeEach(() => {
    resetLearningRuntimeForTests();
    clearPersistedEvents();
  });

  it("replay rebuilds state", () => {
    const runtime = new LearningRuntime("test");
    runtime.dispatch({ type: "SessionStarted", payload: { ...baseScope, partId: "p1" } });
    runtime.dispatch({
      type: "VideoCompleted",
      payload: { partId: "p1", durationSeconds: 120, hasTrivia: false },
    });

    const exported = [...runtime.getEvents()];
    const fresh = new LearningRuntime("test");
    fresh.replay(exported);

    expect(fresh.getState()).toEqual(runtime.getState());
    expect(fresh.getTimeline().length).toBe(2);
  });
});

describe("Learning Runtime — observable", () => {
  it("timeline maps 1:1 with events", () => {
    const runtime = new LearningRuntime("test");
    runtime.dispatch({ type: "SessionStarted", payload: baseScope });
    runtime.dispatch({
      type: "VideoStarted",
      payload: { partId: "part-1", positionSeconds: 0 },
    });

    expect(runtime.getEvents().length).toBe(2);
    expect(runtime.getTimeline().length).toBe(2);
    expect(runtime.getTimeline()[0]?.label).toContain("Session started");
  });
});

describe("Learning Runtime — recoverable", () => {
  beforeEach(() => {
    resetLearningRuntimeForTests();
    clearPersistedEvents();
  });

  it("hydrate restores events after refresh simulation", () => {
    const runtime = new LearningRuntime("test");
    runtime.dispatch({ type: "SessionStarted", payload: baseScope });
    runtime.dispatch({
      type: "TriviaAnswered",
      payload: { triviaId: "t1", partId: "p1", correct: true },
    });

    const snapshot = reduceEvents([...runtime.getEvents()]);

    resetLearningRuntimeForTests();
    const reloaded = new LearningRuntime("test");
    reloaded.hydrate();

    expect(loadPersistedEvents()?.length).toBe(2);
    expect(reloaded.getState()).toEqual(snapshot);
  });
});
