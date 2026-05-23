import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { fetchLearningEditionServer } from "@/lib/learning-units";
import { Routes } from "@/constants/routes";
import { Button } from "@/ui/button";

export const revalidate = 3600;

export default async function LearnPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await fetchLearningEditionServer(slug).catch(() => null);
  if (!edition) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={Routes.Learn}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Learning paths
      </Link>

      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {edition.module_code || "Learning path"}
        {edition.fiscal_year ? ` · FY ${edition.fiscal_year}` : ""}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{edition.title}</h1>
      {edition.summary ? (
        <p className="mt-4 text-muted-foreground whitespace-pre-line">{edition.summary}</p>
      ) : null}

      {edition.lessons && edition.lessons.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="size-5" aria-hidden />
            Lessons
          </h2>
          <ol className="space-y-3">
            {edition.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                {lesson.article_slug ? (
                  <Link
                    href={Routes.Article(lesson.article_slug)}
                    className="font-medium hover:text-primary"
                  >
                    {lesson.section_label ? `${lesson.section_label}: ` : ""}
                    {lesson.title}
                  </Link>
                ) : (
                  <span className="font-medium">
                    {lesson.section_label ? `${lesson.section_label}: ` : ""}
                    {lesson.title}
                  </span>
                )}
                {lesson.estimated_minutes ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ~{lesson.estimated_minutes} min
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {edition.external_source_url ? (
        <Button asChild className="mt-8">
          <a href={edition.external_source_url} target="_blank" rel="noopener noreferrer">
            Open official document
          </a>
        </Button>
      ) : null}
    </div>
  );
}
