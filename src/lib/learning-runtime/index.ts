/**
 * Learning Runtime — public API
 * @see agent/spec/runtime-contracts/learning-runtime.md
 */

export * from "./types";
export { reduceEvents, EMPTY_STATE, EMPTY_PROGRESS } from "./reducer";
export { LearningRuntime, getLearningRuntime, resetLearningRuntimeForTests } from "./runtime";
export type { DispatchInput } from "./runtime";
export { LearningRuntimeProvider, useLearningRuntime } from "./context";
export { resolveNavigation, isLessonUnlocked } from "./navigation";
export { resolveActiveCourse, resolveContinueLesson } from "./continue";
export type { ContinueTarget } from "./continue";
export { eventsToTimeline, eventToTimelineLabel } from "./timeline";
export { loadPersistedEvents, persistEvents, clearPersistedEvents } from "./persistence";
export {
  deriveLessonExperience,
  buildLessonMetaFromLesson,
  formatExperienceReplay,
} from "./experience";
export type { LessonExperienceView } from "./experience";
