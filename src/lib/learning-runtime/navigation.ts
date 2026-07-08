/**
 * @sdp-provenance capability: CAP-learning-runtime
 * contracts: learning-runtime@1.0.0
 */
import type { LmsCourse } from "@/data/lms/types";
import { getLessonNeighbors } from "@/data/lms/helpers";
import type { LearningProgress, LessonScope } from "./types";
import { lessonKey } from "./types";

export type NavigationState = {
  previousHref?: string;
  nextHref?: string;
  nextLocked: boolean;
  previousLocked: boolean;
};

export function resolveNavigation(
  course: LmsCourse,
  scope: LessonScope,
  progress: LearningProgress,
): NavigationState {
  const { prev, next } = getLessonNeighbors(course, scope.moduleSlug, scope.lessonSlug);
  const currentKey = lessonKey(scope);
  const currentIndex = course.modules
    .flatMap((m) => m.lessons.map((l) => lessonKey({
      courseSlug: course.slug,
      moduleSlug: m.slug,
      lessonSlug: l.slug,
    })))
    .indexOf(currentKey);

  const previousLocked = currentIndex <= 0;
  const nextLocked =
    !progress.completedLessons.includes(currentKey) || !next;

  return {
    previousHref: previousLocked ? undefined : prev,
    nextHref: nextLocked ? undefined : next,
    nextLocked,
    previousLocked,
  };
}

export function isLessonUnlocked(
  course: LmsCourse,
  moduleSlug: string,
  lessonSlug: string,
  progress: LearningProgress,
): boolean {
  const mod = course.modules.find((m) => m.slug === moduleSlug);
  if (!mod || mod.status === "locked") return false;

  const lessonIndex = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex <= 0) return true;

  const prevLesson = mod.lessons[lessonIndex - 1];
  if (!prevLesson) return true;

  const prevKey = lessonKey({
    courseSlug: course.slug,
    moduleSlug,
    lessonSlug: prevLesson.slug,
  });
  return progress.completedLessons.includes(prevKey);
}
