/**
 * @sdp-provenance
 * intent: INTENT-002
 * capability: CAP-learning-runtime
 * requirements: REQ-0100, REQ-0101
 * contracts: event-model@1.0.0
 */

export type LearningEventType =
  | "LessonOpened"
  | "SessionStarted"
  | "VideoStarted"
  | "VideoPaused"
  | "VideoCompleted"
  | "TriviaOpened"
  | "TriviaAnswered"
  | "ReflectionSaved"
  | "ContinuePressed"
  | "LessonCompleted"
  | "PartAdvanced";

export type LessonScope = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export type LessonMeta = {
  partIds: string[];
  triviaByPartId: Record<string, string>;
  reflectionRequired: boolean;
};

export type LearningEventPayloads = {
  LessonOpened: LessonScope & LessonMeta;
  SessionStarted: LessonScope & { partId?: string };
  VideoStarted: { partId: string; positionSeconds?: number };
  VideoPaused: { partId: string; positionSeconds: number };
  VideoCompleted: { partId: string; durationSeconds: number; hasTrivia: boolean };
  TriviaOpened: { triviaId: string; partId: string };
  TriviaAnswered: { triviaId: string; partId: string; correct: boolean };
  ReflectionSaved: { lessonSlug: string; length: number };
  ContinuePressed: { scope: "part" | "lesson" | "next" };
  LessonCompleted: LessonScope;
  PartAdvanced: { partId: string; partIndex: number };
};

export type LearningEvent =
  | { id: string; type: "LessonOpened"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["LessonOpened"] }
  | { id: string; type: "SessionStarted"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["SessionStarted"] }
  | { id: string; type: "VideoStarted"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["VideoStarted"] }
  | { id: string; type: "VideoPaused"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["VideoPaused"] }
  | { id: string; type: "VideoCompleted"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["VideoCompleted"] }
  | { id: string; type: "TriviaOpened"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["TriviaOpened"] }
  | { id: string; type: "TriviaAnswered"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["TriviaAnswered"] }
  | { id: string; type: "ReflectionSaved"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["ReflectionSaved"] }
  | { id: string; type: "ContinuePressed"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["ContinuePressed"] }
  | { id: string; type: "LessonCompleted"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["LessonCompleted"] }
  | { id: string; type: "PartAdvanced"; occurredAt: string; sessionId: string; learnerId?: string; payload: LearningEventPayloads["PartAdvanced"] };

export type LearningSession = {
  sessionId: string;
  courseSlug: string | null;
  moduleSlug: string | null;
  lessonSlug: string | null;
  partId: string | null;
  startedAt: string | null;
};

export type LearningProgress = {
  completedLessons: string[];
  completedModules: string[];
  watchPositions: Record<string, number>;
  triviaPassed: string[];
  bookmarks: Array<{ partId: string; positionSeconds: number; at: string }>;
  notes: Array<{ lessonSlug: string; length: number; at: string }>;
};

export type TimelineEntry = {
  id: string;
  occurredAt: string;
  label: string;
  eventType: LearningEventType;
  payload: Record<string, unknown>;
};

export type LessonPhase =
  | "idle"
  | "ready"
  | "watching"
  | "paused"
  | "trivia_required"
  | "trivia_answered"
  | "part_complete"
  | "lesson_complete";

export type LearningRuntimeState = {
  session: LearningSession;
  progress: LearningProgress;
  lessonPhase: LessonPhase;
};

export function lessonKey(scope: LessonScope): string {
  return `${scope.courseSlug}/${scope.moduleSlug}/${scope.lessonSlug}`;
}
