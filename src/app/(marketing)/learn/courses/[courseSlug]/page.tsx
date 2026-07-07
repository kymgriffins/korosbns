import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, GraduationCap } from "lucide-react";
import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { ModuleCard } from "@/components/lms/module-card";
import { ProgressBar } from "@/components/lms/progress-bar";
import { getCourse, getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import { getFirstLessonHref } from "@/data/lms/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  return { title: course ? `${course.title} | Learn` : "Course | Learn" };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const total = getTotalLessons(course);
  const completed = getCompletedLessonsCount(course);
  const startHref = getFirstLessonHref(course);

  return (
    <LmsPage className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="relative aspect-[21/9] w-full">
          <Image src={course.heroImage} alt="" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="space-y-4 p-5 md:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge>{course.category}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{course.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{course.subtitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" />
              {course.durationMinutes} minutes
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="size-4" />
              {course.instructor}
            </span>
          </div>
          <ProgressBar completed={completed} total={total} />
          {startHref ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={startHref}>Enroll &amp; start learning</Link>
            </Button>
          ) : null}
        </div>
      </section>

      <LmsSection title="About this course">
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{course.description}</p>
      </LmsSection>

      <LmsSection title="Requirements">
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          {course.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </LmsSection>

      <LmsSection title="Modules" description="Expand each module to see lessons">
        <div className="space-y-4">
          {course.modules.map((mod, index) => (
            <ModuleCard
              key={mod.slug}
              courseSlug={course.slug}
              module={mod}
              defaultOpen={index === 1 || mod.status === "in_progress"}
            />
          ))}
        </div>
      </LmsSection>
    </LmsPage>
  );
}
