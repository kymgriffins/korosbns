/**
 * Journey side effects — runtime owns transitions after ContinuePressed
 * @see agent/spec/journey-contracts/lesson-journey.md
 */
import type { DispatchInput } from "./runtime";
import { deriveLessonExperience } from "./experience";
import type { LearningEvent, LessonMeta, LessonScope } from "./types";

function lessonScopeFromEvents(events: readonly LearningEvent[]): LessonScope | null {
  const opened = events.find((e) => e.type === "LessonOpened");
  if (!opened || opened.type !== "LessonOpened") return null;
  return {
    courseSlug: opened.payload.courseSlug,
    moduleSlug: opened.payload.moduleSlug,
    lessonSlug: opened.payload.lessonSlug,
  };
}

function lessonMetaFromEvents(events: readonly LearningEvent[]): LessonMeta | null {
  const opened = events.find((e) => e.type === "LessonOpened");
  if (!opened || opened.type !== "LessonOpened") return null;
  return {
    partIds: opened.payload.partIds,
    triviaByPartId: opened.payload.triviaByPartId,
    reflectionRequired: opened.payload.reflectionRequired,
  };
}

function isPartComplete(
  events: readonly LearningEvent[],
  partId: string,
  meta: LessonMeta,
): boolean {
  const hasVideo = events.some(
    (e) => e.type === "VideoCompleted" && e.payload.partId === partId,
  );
  if (!hasVideo) return false;
  const triviaId = meta.triviaByPartId[partId];
  if (!triviaId) return true;
  const completedIdx = events.findIndex(
    (e) => e.type === "VideoCompleted" && e.payload.partId === partId,
  );
  return events
    .slice(completedIdx)
    .some(
      (e) =>
        e.type === "TriviaAnswered" &&
        e.payload.triviaId === triviaId &&
        e.payload.correct,
    );
}

/** Derive follow-on events the runtime must append after ContinuePressed */
export function deriveContinueSideEffects(
  eventsBeforeContinue: readonly LearningEvent[],
  continueEvent: Extract<LearningEvent, { type: "ContinuePressed" }>,
): DispatchInput<"PartAdvanced" | "LessonCompleted">[] {
  const scope = lessonScopeFromEvents(eventsBeforeContinue);
  if (!scope) return [];

  const view = deriveLessonExperience(eventsBeforeContinue, scope);
  if (!view) return [];

  const { scope: continueScope } = continueEvent.payload;

  if (continueScope === "part") {
    const meta = lessonMetaFromEvents(eventsBeforeContinue);
    if (!meta) return [];
    let lastCompleteIndex = -1;
    for (let i = 0; i < meta.partIds.length; i++) {
      if (isPartComplete(eventsBeforeContinue, meta.partIds[i]!, meta)) {
        lastCompleteIndex = i;
      }
    }
    const nextIndex = lastCompleteIndex + 1;
    const nextPartId = meta.partIds[nextIndex];
    if (!nextPartId) return [];
    return [{ type: "PartAdvanced", payload: { partId: nextPartId, partIndex: nextIndex } }];
  }

  if (continueScope === "lesson") {
    const opened = eventsBeforeContinue.find((e) => e.type === "LessonOpened");
    const reflectionRequired = opened?.type === "LessonOpened" ? opened.payload.reflectionRequired : true;
    const reflectionOk = view.reflectionSaved || !reflectionRequired;
    if (view.allPartsComplete && reflectionOk && !view.lessonComplete) {
      return [{ type: "LessonCompleted", payload: scope }];
    }
  }

  return [];
}
