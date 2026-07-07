import Link from "next/link";
import { notFound } from "next/navigation";
import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { ModuleCard } from "@/components/lms/module-card";
import { ProgressBar } from "@/components/lms/progress-bar";
import { getCourse, getModule } from "@/data/lms/catalog";
import { LmsRoutes } from "@/data/lms/routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug, moduleSlug } = await params;
  const mod = getModule(courseSlug, moduleSlug);
  return { title: mod ? `${mod.title} | Learn` : "Module | Learn" };
}

export default async function ModuleOverviewPage({ params }: PageProps) {
  const { courseSlug, moduleSlug } = await params;
  const course = getCourse(courseSlug);
  const mod = getModule(courseSlug, moduleSlug);
  if (!course || !mod) notFound();

  const firstLesson = mod.lessons[0];
  const completedInModule = mod.status === "completed" ? mod.lessons.length : mod.status === "in_progress" ? 1 : 0;

  return (
    <LmsPage className="space-y-8">
      <header className="space-y-3">
        <Link href={LmsRoutes.course(courseSlug)} className="text-sm text-muted-foreground hover:text-primary">
          ← {course.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Module {mod.order}</Badge>
          <Badge variant="outline">{mod.status.replace("_", " ")}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{mod.title}</h1>
        <p className="text-muted-foreground">
          {mod.lessons.length} lessons · {mod.durationMinutes} minutes
        </p>
        <ProgressBar completed={completedInModule} total={mod.lessons.length} />
        {firstLesson && mod.status !== "locked" ? (
          <Button asChild>
            <Link href={LmsRoutes.lesson(courseSlug, moduleSlug, firstLesson.slug)}>Start module</Link>
          </Button>
        ) : null}
      </header>

      <LmsSection title="Objectives">
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          {mod.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </LmsSection>

      <LmsSection title="Lessons">
        <ModuleCard courseSlug={courseSlug} module={mod} defaultOpen />
      </LmsSection>
    </LmsPage>
  );
}
