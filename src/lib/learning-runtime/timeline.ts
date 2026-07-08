/**
 * @sdp-provenance capability: CAP-learning-runtime
 * contracts: timeline@1.0.0
 */
import type { LearningEvent, LearningEventType } from "./types";

const LABELS: Record<LearningEventType, (payload: Record<string, unknown>) => string> = {
  LessonOpened: (p) => `Lesson opened — ${p.lessonSlug as string}`,
  SessionStarted: (p) =>
    `Session started — ${p.lessonSlug as string}${p.partId ? ` (${p.partId as string})` : ""}`,
  VideoStarted: (p) => `Video started — ${p.partId as string}`,
  VideoPaused: (p) => `Video paused — ${p.partId as string} @ ${p.positionSeconds as number}s`,
  VideoCompleted: (p) => `Video completed — ${p.partId as string}`,
  TriviaOpened: () => "Trivia opened",
  TriviaAnswered: (p) =>
    `Trivia ${(p.correct as boolean) ? "correct" : "incorrect"}`,
  ReflectionSaved: () => "Reflection saved",
  ContinuePressed: (p) => `Continue pressed — ${p.scope as string}`,
  LessonCompleted: (p) => `Lesson completed — ${p.lessonSlug as string}`,
  PartAdvanced: (p) => `Part advanced — ${p.partId as string}`,
};

export function eventToTimelineLabel(event: LearningEvent): string {
  const fn = LABELS[event.type];
  return fn(event.payload as Record<string, unknown>);
}

export function eventsToTimeline(events: LearningEvent[]) {
  return [...events]
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
    .map((event) => ({
      id: event.id,
      occurredAt: event.occurredAt,
      label: eventToTimelineLabel(event),
      eventType: event.type,
      payload: event.payload as Record<string, unknown>,
    }));
}
