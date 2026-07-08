/**
 * @sdp-provenance capability: CAP-learning-runtime
 * contracts: progress@1.0.0, event-model@1.0.0
 */
import type { LearningEvent, LearningProgress, LearningRuntimeState, LessonPhase } from "./types";
import { lessonKey } from "./types";

export const EMPTY_PROGRESS: LearningProgress = {
  completedLessons: [],
  completedModules: [],
  watchPositions: {},
  triviaPassed: [],
  bookmarks: [],
  notes: [],
};

export const EMPTY_STATE: LearningRuntimeState = {
  session: {
    sessionId: "local",
    courseSlug: null,
    moduleSlug: null,
    lessonSlug: null,
    partId: null,
    startedAt: null,
  },
  progress: EMPTY_PROGRESS,
  lessonPhase: "idle",
};

function deriveLessonPhase(events: LearningEvent[]): LessonPhase {
  let phase: LessonPhase = "idle";
  for (const event of events) {
    switch (event.type) {
      case "LessonOpened":
      case "SessionStarted":
        phase = "ready";
        break;
      case "VideoStarted":
        phase = "watching";
        break;
      case "VideoPaused":
        phase = "paused";
        break;
      case "VideoCompleted":
        phase = "part_complete";
        break;
      case "TriviaOpened":
        phase = "trivia_required";
        break;
      case "TriviaAnswered":
        phase = "trivia_answered";
        break;
      case "ContinuePressed": {
        const scope = event.payload.scope;
        if (scope === "lesson" || scope === "next") {
          phase = "lesson_complete";
        } else {
          phase = "ready";
        }
        break;
      }
      case "LessonCompleted":
        phase = "lesson_complete";
        break;
      default:
        break;
    }
  }
  return phase;
}

/** Event-sourced fold — deterministic state derivation */
export function reduceEvents(events: LearningEvent[]): LearningRuntimeState {
  const progress: LearningProgress = {
    completedLessons: [],
    completedModules: [],
    watchPositions: {},
    triviaPassed: [],
    bookmarks: [],
    notes: [],
  };

  let session = { ...EMPTY_STATE.session };
  const completedLessonSet = new Set<string>();
  const triviaPassedSet = new Set<string>();

  for (const event of events) {
    switch (event.type) {
      case "LessonOpened":
      case "SessionStarted": {
        const p = event.payload;
        session = {
          sessionId: event.sessionId,
          courseSlug: p.courseSlug,
          moduleSlug: p.moduleSlug,
          lessonSlug: p.lessonSlug,
          partId: "partId" in p && p.partId ? p.partId : null,
          startedAt: event.occurredAt,
        };
        break;
      }
      case "PartAdvanced": {
        session.partId = event.payload.partId;
        break;
      }
      case "VideoStarted": {
        session.partId = event.payload.partId;
        break;
      }
      case "VideoPaused": {
        const p = event.payload;
        session.partId = p.partId;
        progress.watchPositions[p.partId] = p.positionSeconds;
        progress.bookmarks.push({
          partId: p.partId,
          positionSeconds: p.positionSeconds,
          at: event.occurredAt,
        });
        break;
      }
      case "VideoCompleted": {
        const p = event.payload;
        progress.watchPositions[p.partId] = p.durationSeconds;
        session.partId = p.partId;
        break;
      }
      case "TriviaAnswered": {
        if (event.payload.correct) {
          triviaPassedSet.add(event.payload.triviaId);
        }
        break;
      }
      case "ReflectionSaved": {
        progress.notes.push({
          lessonSlug: event.payload.lessonSlug,
          length: event.payload.length,
          at: event.occurredAt,
        });
        break;
      }
      case "LessonCompleted": {
        completedLessonSet.add(lessonKey(event.payload));
        break;
      }
      default:
        break;
    }
  }

  progress.completedLessons = [...completedLessonSet];
  progress.triviaPassed = [...triviaPassedSet];

  return {
    session,
    progress,
    lessonPhase: deriveLessonPhase(events),
  };
}
