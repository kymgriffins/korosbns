import Link from "next/link";
import { notFound } from "next/navigation";
import { LmsPage } from "@/components/lms/lms-page";
import { LessonExperience } from "@/components/lms/lesson-experience";
import {
  getCompletedLessonsCount,
  getCourse,
  getLesson,
  getModule,
  getTotalLessons,
} from "@/data/lms/catalog";
import { getLessonNeighbors } from "@/data/lms/helpers";
import { LmsRoutes } from "@/data/lms/routes";

type PageProps = {
  params: Promise<{ courseSlug: string; moduleSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const lesson = getLesson(courseSlug, moduleSlug, lessonSlug);
  return { title: lesson ? `${lesson.title} | Learn` : "Lesson | Learn" };
}

export default async function LessonPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const mod = getModule(courseSlug, moduleSlug);
  const lesson = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!course || !mod || !lesson) notFound();

  const { prev, next } = getLessonNeighbors(course, moduleSlug, lessonSlug);
  const lessonNumber = lesson.order;
  const completed = getCompletedLessonsCount(course);
  const total = getTotalLessons(course);

  return (
    <LmsPage variant="lesson" className="space-y-4">
      <Link
        href={LmsRoutes.module(courseSlug, moduleSlug)}
        className="inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← {mod.title}
      </Link>
      <LessonExperience
        courseTitle={course.title}
        moduleTitle={mod.title}
        lesson={lesson}
        lessonNumber={lessonNumber}
        completedLessons={completed}
        totalLessons={total}
        prevHref={prev}
        nextHref={next}
      />
    </LmsPage>
  );
}
