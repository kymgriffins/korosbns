/**
 * Learning Journey Platform — domain event types.
 * @see docs/ljp-spec/events.md
 */

export type LjpEventBase = {
  occurredAt: string;
  sessionId: string;
  learnerId?: string;
};

export type VideoPartCompletedPayload = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  partId: string;
  durationSeconds?: number;
};

export type TriviaAnsweredPayload = {
  triviaId: string;
  partId: string;
  correct: boolean;
};

export type LessonCompletedPayload = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export type LjpLearnEvent =
  | ({ type: "VideoPartCompleted" } & LjpEventBase & VideoPartCompletedPayload)
  | ({ type: "TriviaOpened" } & LjpEventBase & { triviaId: string; partId: string })
  | ({ type: "TriviaAnswered" } & LjpEventBase & TriviaAnsweredPayload)
  | ({ type: "LessonCompleted" } & LjpEventBase & LessonCompletedPayload)
  | ({ type: "CourseEnrolled" } & LjpEventBase & { courseSlug: string })
  | ({ type: "CourseResumed" } & LjpEventBase & { courseSlug: string; lessonSlug: string });

/** Dev-only emitter — replace with API ingest in v2 */
export function emitLearnEvent(event: LjpLearnEvent): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[learn:event]", event.type, event);
  }
}

export function createLearnEvent<T extends LjpLearnEvent["type"]>(
  type: T,
  payload: Omit<Extract<LjpLearnEvent, { type: T }>, "type" | "occurredAt" | "sessionId"> & {
    sessionId?: string;
  },
): Extract<LjpLearnEvent, { type: T }> {
  return {
    type,
    occurredAt: new Date().toISOString(),
    sessionId: payload.sessionId ?? "local",
    ...payload,
  } as Extract<LjpLearnEvent, { type: T }>;
}
