/**
 * @sdp-provenance capability: CAP-learning-experience
 * contracts: lesson-journey@1.0.0
 */
import type { LearningEvent, LessonMeta, LessonPhase, LessonScope } from "./types";
import { lessonKey } from "./types";

export type LessonExperienceView = {
  phase: LessonPhase;
  currentPartId: string | null;
  currentPartIndex: number;
  showTrivia: boolean;
  triviaPartId: string | null;
  showReflection: boolean;
  showContinue: boolean;
  continueLabel: string;
  continueScope: "part" | "lesson" | "next";
  lessonComplete: boolean;
  allPartsComplete: boolean;
  reflectionSaved: boolean;
};

function getLessonMeta(events: readonly LearningEvent[]): LessonMeta | null {
  const opened = events.find((e) => e.type === "LessonOpened");
  if (!opened || opened.type !== "LessonOpened") return null;
  return {
    partIds: opened.payload.partIds,
    triviaByPartId: opened.payload.triviaByPartId,
    reflectionRequired: opened.payload.reflectionRequired,
  };
}

function isTriviaSatisfied(
  events: readonly LearningEvent[],
  partId: string,
  triviaId: string,
): boolean {
  const completedIdx = events.findIndex(
    (e) => e.type === "VideoCompleted" && e.payload.partId === partId,
  );
  if (completedIdx < 0) return false;
  return events
    .slice(completedIdx)
    .some(
      (e) =>
        e.type === "TriviaAnswered" &&
        e.payload.triviaId === triviaId &&
        e.payload.correct,
    );
}

function isPartComplete(events: readonly LearningEvent[], partId: string, meta: LessonMeta): boolean {
  const hasVideo = events.some(
    (e) => e.type === "VideoCompleted" && e.payload.partId === partId,
  );
  if (!hasVideo) return false;
  const triviaId = meta.triviaByPartId[partId];
  if (triviaId) return isTriviaSatisfied(events, partId, triviaId);
  return true;
}

export function deriveLessonExperience(
  events: readonly LearningEvent[],
  scope: LessonScope,
): LessonExperienceView | null {
  const meta = getLessonMeta(events);
  if (!meta || meta.partIds.length === 0) return null;

  const lessonCompleted = events.some((e) => e.type === "LessonCompleted");
  const reflectionSaved = events.some(
    (e) => e.type === "ReflectionSaved" && e.payload.lessonSlug === scope.lessonSlug,
  );

  const allPartsComplete = meta.partIds.every((id) => isPartComplete(events, id, meta));

  let currentPartIndex = 0;
  const lastAdvanced = [...events].reverse().find((e) => e.type === "PartAdvanced");
  if (lastAdvanced && lastAdvanced.type === "PartAdvanced") {
    currentPartIndex = lastAdvanced.payload.partIndex;
  } else {
    const firstIncomplete = meta.partIds.findIndex((id) => !isPartComplete(events, id, meta));
    currentPartIndex = firstIncomplete >= 0 ? firstIncomplete : meta.partIds.length - 1;
  }

  const currentPartId = meta.partIds[currentPartIndex] ?? null;

  let phase: LessonPhase = "ready";
  const lastMeaningful = [...events].reverse().find((e) =>
    [
      "VideoStarted",
      "VideoPaused",
      "VideoCompleted",
      "TriviaOpened",
      "TriviaAnswered",
      "ContinuePressed",
      "LessonCompleted",
      "LessonOpened",
    ].includes(e.type),
  );

  if (lessonCompleted) {
    phase = "lesson_complete";
  } else if (lastMeaningful?.type === "VideoStarted") {
    phase = "watching";
  } else if (lastMeaningful?.type === "VideoPaused") {
    phase = "paused";
  } else if (lastMeaningful?.type === "VideoCompleted") {
    const p = lastMeaningful.payload.partId;
    const triviaId = meta.triviaByPartId[p];
    if (triviaId && !isTriviaSatisfied(events, p, triviaId)) {
      phase = "trivia_required";
    } else {
      phase = "part_complete";
    }
  } else if (lastMeaningful?.type === "TriviaAnswered") {
    phase = "trivia_answered";
  } else if (lastMeaningful?.type === "LessonOpened") {
    phase = "ready";
  }

  const pendingTriviaPart =
    phase === "trivia_required" && lastMeaningful?.type === "VideoCompleted"
      ? lastMeaningful.payload.partId
      : null;

  const showTrivia = phase === "trivia_required";

  let showContinue = false;
  let continueLabel = "Continue";
  let continueScope: "part" | "lesson" | "next" = "part";

  if (phase === "trivia_answered" || (phase === "part_complete" && !allPartsComplete)) {
    showContinue = true;
    continueScope = "part";
  } else if (allPartsComplete && reflectionSaved && !lessonCompleted) {
    showContinue = true;
    continueLabel = "Next lesson";
    continueScope = "lesson";
  } else if (phase === "part_complete" && allPartsComplete && !meta.reflectionRequired) {
    showContinue = true;
    continueLabel = "Next lesson";
    continueScope = "lesson";
  }

  const showReflection =
    allPartsComplete && !lessonCompleted && meta.reflectionRequired && !reflectionSaved;

  return {
    phase,
    currentPartId,
    currentPartIndex,
    showTrivia,
    triviaPartId: pendingTriviaPart ?? (showTrivia ? currentPartId : null),
    showReflection,
    showContinue,
    continueLabel,
    continueScope,
    lessonComplete: lessonCompleted,
    allPartsComplete,
    reflectionSaved,
  };
}

export function buildLessonMetaFromLesson(lesson: {
  slug: string;
  parts: Array<{ id: string; trivia?: { id: string } }>;
}): LessonMeta {
  const triviaByPartId: Record<string, string> = {};
  for (const part of lesson.parts) {
    if (part.trivia) triviaByPartId[part.id] = part.trivia.id;
  }
  return {
    partIds: lesson.parts.map((p) => p.id),
    triviaByPartId,
    reflectionRequired: true,
  };
}

export function formatExperienceReplay(events: LearningEvent[]): string[] {
  return events.map((e) => {
    const time = new Date(e.occurredAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${time}  ${e.type}`;
  });
}
