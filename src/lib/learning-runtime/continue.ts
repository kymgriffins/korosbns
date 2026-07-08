/**
 * @sdp-provenance capability: CAP-learning-runtime
 * contracts: learning-runtime@1.0.0
 */
import type { LmsCourse } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";
import type { LearningProgress, LearningSession, LessonScope } from "./types";
import { lessonKey } from "./types";

export type ContinueTarget = {
  href: string;
  label: string;
  scope: LessonScope;
};

export function resolveActiveCourse(
  courses: LmsCourse[],
  session: LearningSession,
): LmsCourse | null {
  if (session.courseSlug) {
    const match = courses.find((c) => c.slug === session.courseSlug);
    if (match) return match;
  }
  return courses[0] ?? null;
}

/** Next lesson to open — first incomplete in order, or session lesson if still active */
export function resolveContinueLesson(
  course: LmsCourse,
  progress: LearningProgress,
  session: LearningSession,
): ContinueTarget | null {
  if (session.courseSlug === course.slug && session.moduleSlug && session.lessonSlug) {
    const scope: LessonScope = {
      courseSlug: course.slug,
      moduleSlug: session.moduleSlug,
      lessonSlug: session.lessonSlug,
    };
    if (!progress.completedLessons.includes(lessonKey(scope))) {
      return {
        href: LmsRoutes.lesson(scope.courseSlug, scope.moduleSlug, scope.lessonSlug),
        label: "Continue Learning",
        scope,
      };
    }
  }

  const started = progress.completedLessons.some((key) => key.startsWith(`${course.slug}/`));

  for (const mod of course.modules) {
    if (mod.status === "locked") continue;
    for (const lesson of mod.lessons) {
      const scope: LessonScope = {
        courseSlug: course.slug,
        moduleSlug: mod.slug,
        lessonSlug: lesson.slug,
      };
      if (!progress.completedLessons.includes(lessonKey(scope))) {
        return {
          href: LmsRoutes.lesson(scope.courseSlug, scope.moduleSlug, scope.lessonSlug),
          label: started ? "Continue Learning" : "Start Journey",
          scope,
        };
      }
    }
  }

  const firstModule = course.modules.find((m) => m.status !== "locked");
  const firstLesson = firstModule?.lessons[0];
  if (!firstModule || !firstLesson) return null;

  const scope: LessonScope = {
    courseSlug: course.slug,
    moduleSlug: firstModule.slug,
    lessonSlug: firstLesson.slug,
  };
  return {
    href: LmsRoutes.lesson(scope.courseSlug, scope.moduleSlug, scope.lessonSlug),
    label: "Review",
    scope,
  };
}
