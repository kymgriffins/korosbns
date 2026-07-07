import type { LmsCourse } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";

export function getLessonNeighbors(
  course: LmsCourse,
  moduleSlug: string,
  lessonSlug: string,
) {
  const flat = course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      moduleSlug: mod.slug,
      lessonSlug: lesson.slug,
      href: LmsRoutes.lesson(course.slug, mod.slug, lesson.slug),
    })),
  );

  const index = flat.findIndex((item) => item.moduleSlug === moduleSlug && item.lessonSlug === lessonSlug);
  return {
    prev: index > 0 ? flat[index - 1]?.href : undefined,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1]?.href : undefined,
  };
}

export function getFirstLessonHref(course: LmsCourse) {
  const firstModule = course.modules.find((m) => m.status !== "locked");
  const firstLesson = firstModule?.lessons[0];
  if (!firstModule || !firstLesson) return undefined;
  return LmsRoutes.lesson(course.slug, firstModule.slug, firstLesson.slug);
}
