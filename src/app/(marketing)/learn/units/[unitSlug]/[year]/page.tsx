import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  HelpCircle,
  PlayCircle,
} from "lucide-react";
import { Routes } from "@/constants/routes";
import {
  fetchLearningEditionByUnitYearServer,
  type LearningEditionDetail,
  type LearningLesson,
} from "@/lib/learning-units";

type PageProps = {
  params: Promise<{ unitSlug: string; year: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { unitSlug, year } = await params;
  try {
    const course = await fetchLearningEditionByUnitYearServer(unitSlug, year);
    if (!course) return { title: "Edition not found | Budget Ndio Story" };
    const label = course.unit?.abbreviation ?? course.unit?.title ?? "Learning unit";
    return {
      title: `${course.title} | ${label} | Budget Ndio Story`,
      description:
        course.summary ??
        `Fiscal year ${course.fiscal_year} edition — chapters, media, and learning challenge.`,
    };
  } catch {
    return { title: "Learning edition | Budget Ndio Story" };
  }
}

function lessonHref(lesson: LearningLesson): string | null {
  if (lesson.article_slug) return Routes.Article(lesson.article_slug);
  if (lesson.trivia_id) return Routes.TriviaSet(lesson.trivia_id);
  return null;
}

function mediaEmbedUrl(item: NonNullable<LearningEditionDetail["media"]>[number]): string | null {
  if (item.url) return item.url;
  if (item.youtube_video_id) {
    return `https://www.youtube.com/watch?v=${item.youtube_video_id}`;
  }
  return null;
}

export default async function LearnUnitEditionPage({ params }: PageProps) {
  const { unitSlug, year } = await params;
  let course: Awaited<ReturnType<typeof fetchLearningEditionByUnitYearServer>> = null;
  let error = "";

  try {
    course = await fetchLearningEditionByUnitYearServer(unitSlug, year);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load this edition.";
  }

  if (!error && !course) notFound();

  const lessons = course?.lessons ?? [];
  const media = course?.media ?? [];
  const relatedDocs = course?.related_documents ?? [];
  const triviaLessons = lessons.filter((l) => l.trivia_id);
  const primaryTriviaId = triviaLessons[0]?.trivia_id;

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden overflow-y-visible bg-background pt-16 sm:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-orange-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <Link
          href={Routes.LearnUnits}
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          All learning units
        </Link>

        {error ? (
          <p className="text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {course ? (
          <>
            <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <BookOpen className="size-3.5" />
                    {course.unit?.abbreviation ?? "Unit"} · FY {course.fiscal_year}
                  </div>

                  <div className="card-shimmer min-w-0 rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-indigo-900 to-black p-4 sm:p-5">
                    <h1 className="text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                      {course.title}
                    </h1>
                    {course.summary ? (
                      <p className="mt-2 text-sm text-white/75">{course.summary}</p>
                    ) : null}
                    {course.module_code ? (
                      <p className="mt-3 text-[10px] uppercase tracking-wider text-white/60">
                        {course.module_code}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                      Chapters
                    </p>
                    {lessons.length === 0 ? (
                      <p className="mt-3 text-sm text-foreground/60">No lessons published for this edition yet.</p>
                    ) : (
                      <div className="mt-3 space-y-2 text-sm">
                        {lessons.map((lesson, index) => {
                          const href = lessonHref(lesson);
                          const inner = (
                            <>
                              <div className="deep-card-head">
                                <span className="deep-card-tag">
                                  {lesson.section_label || `Chapter ${lesson.order}`}
                                </span>
                                {lesson.estimated_minutes ? (
                                  <span className="deep-card-time">{lesson.estimated_minutes} min</span>
                                ) : null}
                              </div>
                              <p className="deep-card-title">{lesson.title}</p>
                              <div className="deep-card-foot">
                                <span className="deep-card-kicker capitalize">{lesson.kind}</span>
                                {lesson.article_slug ? (
                                  <span className="deep-card-stat">Read article</span>
                                ) : lesson.trivia_id ? (
                                  <span className="deep-card-stat">Learning challenge</span>
                                ) : null}
                              </div>
                            </>
                          );
                          const cardClass = `animate-fade-up deep-card ${
                            index % 3 === 0
                              ? "deep-card-cyan"
                              : index % 3 === 1
                                ? "deep-card-orange"
                                : "deep-card-violet"
                          }`;
                          return href ? (
                            <Link
                              key={lesson.id}
                              href={href}
                              className={`${cardClass} block transition-transform hover:-translate-y-0.5`}
                              style={{ animationDelay: `${120 + index * 90}ms` }}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div
                              key={lesson.id}
                              className={cardClass}
                              style={{ animationDelay: `${120 + index * 90}ms` }}
                            >
                              {inner}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <aside
                  className="animate-fade-up h-fit min-w-0 rounded-2xl border border-white/10 bg-background/70 p-4 sm:p-5"
                  style={{ animationDelay: "150ms" }}
                >
                  <p className="text-3xl font-bold tracking-tight">Free</p>
                  <p className="text-xs uppercase tracking-widest text-foreground/50">
                    Public civic learning edition
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center">
                      <p className="font-semibold">{lessons.length}</p>
                      <p className="text-foreground/50">chapters</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center">
                      <p className="font-semibold">{media.length}</p>
                      <p className="text-foreground/50">media items</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                    <li>• Unit: {course.unit?.title ?? unitSlug}</li>
                    <li>• Fiscal year: {course.fiscal_year}</li>
                    <li>• Format: Articles + optional video series</li>
                  </ul>

                  <div className="mt-5 space-y-2">
                    {lessons[0]?.article_slug ? (
                      <Link
                        href={Routes.Article(lessons[0].article_slug)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                      >
                        Start first chapter <ArrowRight className="size-4" />
                      </Link>
                    ) : null}
                    {primaryTriviaId ? (
                      <Link
                        href={Routes.TriviaSet(primaryTriviaId)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
                      >
                        <HelpCircle className="size-4" />
                        Take learning challenge
                      </Link>
                    ) : null}
                  </div>
                </aside>
              </div>
            </div>

            {media.length > 0 ? (
              <div
                className="animate-fade-up mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6"
                style={{ animationDelay: "200ms" }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white/90 sm:text-base">Media & explainers</h2>
                  <PlayCircle className="size-5 text-primary" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {media.map((item) => {
                    const url = mediaEmbedUrl(item);
                    return (
                      <div
                        key={`${item.order}-${item.title ?? item.youtube_video_id ?? "media"}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <p className="text-xs uppercase tracking-wider text-foreground/50">
                          {item.role ?? "Video"} · #{item.order}
                        </p>
                        <p className="mt-2 font-semibold">{item.title ?? "Watch explainer"}</p>
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            Open video <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {relatedDocs.length > 0 ? (
              <div
                className="animate-fade-up mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6"
                style={{ animationDelay: "240ms" }}
              >
                <h2 className="text-sm font-semibold text-white/90 sm:text-base">
                  Related statutory documents
                </h2>
                <p className="mt-2 text-sm text-foreground/65">
                  How this unit connects to the rest of Kenya&apos;s budget cycle.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {relatedDocs.map((doc) => (
                    <Link
                      key={`${doc.slug}-${doc.relation}`}
                      href={Routes.LearnUnits}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-primary/30"
                    >
                      <p className="text-xs uppercase tracking-wider text-foreground/50">
                        {doc.label ?? doc.relation}
                      </p>
                      <p className="mt-1 font-semibold">
                        {doc.abbreviation ? `${doc.abbreviation} · ` : ""}
                        {doc.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {primaryTriviaId ? (
              <div
                className="animate-fade-up mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6"
                style={{ animationDelay: "280ms" }}
              >
                <h2 className="text-xl font-bold sm:text-2xl">Learning challenge</h2>
                <p className="mt-2 text-sm text-foreground/75 sm:text-base">
                  Test what you learned from this {course.unit?.abbreviation ?? "unit"} edition with a
                  short trivia set tied to the course.
                </p>
                <Link
                  href={Routes.TriviaSet(primaryTriviaId)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Start challenge <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <style>{`
        .animate-fade-up {
          opacity: 0;
          transform: translateY(14px);
          animation: fadeUp 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .card-shimmer {
          position: relative;
          overflow: hidden;
        }
        .card-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.1) 45%, transparent 80%);
          transform: translateX(-120%);
          animation: shimmer 4.2s ease-in-out infinite;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          40%,
          100% {
            transform: translateX(120%);
          }
        }
        .deep-card {
          position: relative;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(10, 10, 12, 0.85));
          padding: 13px 14px;
          overflow: hidden;
        }
        .deep-card-cyan {
          border-color: rgba(34, 211, 238, 0.42);
        }
        .deep-card-orange {
          border-color: rgba(251, 146, 60, 0.42);
        }
        .deep-card-violet {
          border-color: rgba(167, 139, 250, 0.42);
        }
        .deep-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .deep-card-tag,
        .deep-card-time {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        .deep-card-title {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 700;
          color: white;
        }
        .deep-card-foot {
          margin-top: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .deep-card-kicker {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.76);
        }
        .deep-card-stat {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
