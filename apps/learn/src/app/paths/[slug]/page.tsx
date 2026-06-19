import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { fetchLearningEditionServer } from "@/lib/learning-units";
import { Routes } from "@/constants/routes";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { Button } from "@/ui/button";

export const revalidate = 3600;

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const edition = await fetchLearningEditionServer(slug).catch(() => null);
  const canonical = canonicalUrl(`/paths/${slug}`);
  const ogImage = { url: "/logo.svg", width: 1200, height: 630 };

  if (edition) {
    const edTitle = `${edition.title} | Learning Path | Budget Ndio Story`;
    const edDesc = edition.summary || `Structured learning path on Kenya's budget process, Finance Bill, and fiscal policy.`;
    return {
      title: edTitle,
      description: metaDescription(edDesc),
      alternates: { canonical },
      openGraph: {
        title: `${edition.title} | Budget Ndio Story`,
        description: edDesc,
        url: canonical,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: edTitle,
        description: edDesc,
        images: ["/logo.svg"],
      },
    };
  }
  const fbTitle = `Learning Path | Budget Ndio Story`;
  const fbDesc = `Structured budget literacy content on Kenya's Finance Bill, Appropriation Bill, and parliamentary budget process.`;
  return {
    title: fbTitle,
    description: metaDescription(fbDesc),
    alternates: { canonical },
    openGraph: {
      title: fbTitle,
      description: fbDesc,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fbTitle,
      description: fbDesc,
      images: ["/logo.svg"],
    },
  };
}

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
