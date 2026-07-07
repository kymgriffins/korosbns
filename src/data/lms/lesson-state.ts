/**
 * Lesson session state machine types.
 * @see docs/ljp-spec/state-machines.md
 */

export type LessonSessionState =
  | "loading"
  | "ready"
  | "watching"
  | "paused"
  | "part_ended"
  | "trivia_required"
  | "trivia_answered"
  | "part_complete"
  | "reflection"
  | "lesson_complete"
  | "navigating_away";

export type LessonSessionAction =
  | { type: "DATA_READY" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "PART_ENDED"; hasTrivia: boolean }
  | { type: "TRIVIA_ANSWERED" }
  | { type: "CONTINUE_PART" }
  | { type: "CONTINUE_LESSON" }
  | { type: "NAVIGATE" };

export type LessonSessionContext = {
  activePartIndex: number;
  partsWatched: Set<string>;
  triviaAnswered: Set<string>;
};

const ILLEGAL: Partial<Record<LessonSessionState, LessonSessionAction["type"][]>> = {
  trivia_required: ["PLAY", "CONTINUE_PART", "CONTINUE_LESSON", "NAVIGATE"],
  loading: ["PLAY", "PART_ENDED", "CONTINUE_PART", "CONTINUE_LESSON"],
};

export function canTransition(
  state: LessonSessionState,
  action: LessonSessionAction["type"],
): boolean {
  const blocked = ILLEGAL[state];
  return !blocked?.includes(action);
}

export function lessonSessionReducer(
  state: LessonSessionState,
  action: LessonSessionAction,
): LessonSessionState {
  if (!canTransition(state, action.type)) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(`[lesson-state] illegal: ${state} + ${action.type}`);
    }
    return state;
  }

  switch (action.type) {
    case "DATA_READY":
      return state === "loading" ? "ready" : state;
    case "PLAY":
      return state === "ready" || state === "paused" ? "watching" : state;
    case "PAUSE":
      return state === "watching" ? "paused" : state;
    case "PART_ENDED":
      return action.hasTrivia ? "trivia_required" : "part_complete";
    case "TRIVIA_ANSWERED":
      return state === "trivia_required" ? "trivia_answered" : state;
    case "CONTINUE_PART":
      if (state === "trivia_answered" || state === "part_complete") return "ready";
      return state;
    case "CONTINUE_LESSON":
      return state === "reflection" || state === "lesson_complete" ? "navigating_away" : state;
    case "NAVIGATE":
      return "navigating_away";
    default:
      return state;
  }
}

export function isContinueEnabled(state: LessonSessionState): boolean {
  return state === "part_complete" || state === "lesson_complete";
}
