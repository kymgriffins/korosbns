/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: course_detail@1.0.0,sic-cap-004@1.0.0
 */
import { notFound } from "next/navigation";
import { LmsPage } from "@/components/lms/lms-page";
import { CourseHero } from "@/components/lms/course/course-hero";
import { ModuleAccordion } from "@/components/lms/course/module-accordion";
import { JourneyBreadcrumb } from "@/components/lms/course/journey-breadcrumb";
import { LearningOutcomes } from "@/components/lms/course/learning-outcomes";
import { getCompletedLessonsCount, getCourse, getTotalLessons } from "@/data/lms/catalog";
import { LMS_TYPE } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  return { title: course ? `${course.title} | Learn` : "Journey | Learn" };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const total = getTotalLessons(course);
  const completed = getCompletedLessonsCount(course);
  const journeyComplete = total > 0 && completed >= total;

  return (
    <LmsPage className="space-y-8 pb-24 lg:pb-8">
      <JourneyBreadcrumb title={course.title} />

      <CourseHero course={course} />

      <section className="space-y-4" aria-labelledby="journey-overview-heading">
        <h2
          id="journey-overview-heading"
          className={cn(LMS_TYPE.h3, "font-semibold tracking-tight")}
        >
          About this journey
        </h2>
        <p className={cn(LMS_TYPE.body, "ljp-prose leading-relaxed text-muted-foreground")}>
          {course.description}
        </p>

        {course.requirements.length > 0 ? (
          <details className="max-w-prose rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <summary
              className={cn(
                LMS_TYPE.caption,
                "cursor-pointer font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Requirements
            </summary>
            <ul className={cn(LMS_TYPE.body, "mt-4 list-disc space-y-1 pl-5 text-muted-foreground")}>
              {course.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <LearningOutcomes course={course} journeyComplete={journeyComplete} />

      <section className="space-y-4 pt-4" aria-labelledby="journey-modules-heading">
        <header className="space-y-1">
          <h2
            id="journey-modules-heading"
            className={cn(LMS_TYPE.h3, "font-semibold tracking-tight")}
          >
            Journey modules
          </h2>
          <p className={cn(LMS_TYPE.caption, "text-muted-foreground")}>
            Expand a module to see lessons
          </p>
        </header>
        <ModuleAccordion course={course} />
      </section>
    </LmsPage>
  );
}
