"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock,
  Loader2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame } from "@/components/learn/learn-page-frame";
import { learningData } from "@/data/learning";
import {
  lecturesForModule,
  modesForStep,
  resumeHref,
  resolveResumeStep,
  type LectureKind,
} from "@/lib/immersive-module";
import { readProgress } from "@/lib/module-progress";
import { fadeInUp } from "@/motion/variants";
import type { CivicModule } from "@/types/learn";
import { cn } from "@/utils";

const KIND_ICON: Record<LectureKind, typeof BookOpen> = {
  article: BookOpen,
  video: Clapperboard,
  quiz: Brain,
};

/**
 * Udemy-style course landing: overview + typed curriculum (Article / Video / Quiz)
 * + one primary Start/Continue CTA into the immersive player.
 */
export function CourseLandingView() {
  const params = useParams();
  const slug = params.slug as string;
  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    learningData.modules
      .fetchBySlug(slug)
      .then((m) => {
        if (!cancelled) setMod(m);
      })
      .catch(() => {
        if (!cancelled) setMod(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const progress = useMemo(() => {
    if (!mod) return null;
    const p = readProgress(mod.slug, mod.order);
    const completedCount = Object.keys(p.stepsCompleted).length;
    const total = mod.steps.length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const lectures = lecturesForModule(mod);
    return {
      completedCount,
      total,
      pct,
      isCompleted: p.masteryAwarded,
      isInProgress: completedCount > 0 && !p.masteryAwarded,
      resumeStep: resolveResumeStep(mod),
      startHref: resumeHref(mod),
      completed: p.stepsCompleted,
      lectures,
      lectureCount: lectures.length,
    };
  }, [mod]);

  if (loading) {
    return (
      <LearnPageFrame className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading course" />
      </LearnPageFrame>
    );
  }

  if (!mod || !progress) {
    return (
      <LearnPageFrame className="space-y-4 text-center">
        <h1 className="font-heading text-2xl font-bold">Module not found</h1>
        <p className="text-sm text-muted-foreground">This course is unavailable or was removed.</p>
        <Button asChild variant="outline">
          <Link href="/learn">Back to modules</Link>
        </Button>
      </LearnPageFrame>
    );
  }

  const ctaLabel = progress.isCompleted
    ? "Review course"
    : progress.isInProgress
      ? "Continue learning"
      : "Start course";

  const estMinutes = mod.steps.reduce((sum, step) => {
    const words = (step.text || "").split(/\s+/).filter(Boolean).length;
    return sum + Math.max(1, Math.ceil(words / 200));
  }, 0);

  return (
    <LearnPageFrame className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link
          href="/learn"
          className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Modules
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{mod.title}</span>
      </nav>

      <motion.section
        className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Free module
          </p>
          <h1 className="text-balance font-heading text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-4xl">
            {mod.title}
          </h1>
          {mod.description && mod.description.trim() !== mod.title.trim() ? (
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {mod.description}
            </p>
          ) : (
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Articles, videos, and quizzes — self-paced civic learning on Kenya&apos;s public finance.
            </p>
          )}

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" aria-hidden />
              {progress.total} lesson{progress.total === 1 ? "" : "s"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clapperboard className="size-3.5" aria-hidden />
              {progress.lectureCount} lecture{progress.lectureCount === 1 ? "" : "s"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              ~{estMinutes} min
            </li>
            {progress.isInProgress || progress.isCompleted ? (
              <li className="inline-flex items-center gap-1.5 tabular-nums">{progress.pct}% complete</li>
            ) : (
              <li>Not started</li>
            )}
          </ul>

          {(progress.isInProgress || progress.isCompleted) && (
            <Progress value={progress.pct} className="h-2 max-w-md" />
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" className="h-11 gap-2 rounded-md px-6 text-sm font-semibold">
              <Link href={progress.startHref} target="_blank" rel="noopener noreferrer">
                <Play className="size-4" aria-hidden />
                {ctaLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 rounded-md px-5 text-sm font-semibold">
              <Link href="/learn">All modules</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
          <HarmonizedImage
            src={mod.image_url}
            alt={mod.title}
            className="rounded-none border-0 ring-0"
            fallbackLabel=""
            aspectClassName="aspect-video"
          />
        </div>
      </motion.section>

      {mod.expectations?.length ? (
        <section className="space-y-4" aria-labelledby="outcomes-heading">
          <h2 id="outcomes-heading" className="text-[15px] font-semibold tracking-tight">
            What you&apos;ll learn
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {mod.expectations.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4" aria-labelledby="curriculum-heading">
        <div className="flex items-end justify-between gap-3">
          <h2 id="curriculum-heading" className="text-[15px] font-semibold tracking-tight">
            Course content
          </h2>
          <p className="text-xs text-muted-foreground">
            {progress.completedCount}/{progress.total} lessons · {progress.lectureCount} lectures
          </p>
        </div>

        <ol className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60">
          {mod.steps.map((step, index) => {
            const stepNumber = index + 1;
            const done = Boolean(progress.completed[step.order]) || progress.isCompleted;
            const modes = modesForStep(mod, index);
            const lectures = progress.lectures.filter((l) => l.stepNumber === stepNumber);
            const primaryHref = lectures[0]?.href ?? progress.startHref;

            return (
              <li key={step.id} className={cn(done && "bg-muted/15")}>
                <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                        done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <CheckCircle2 className="size-3.5" aria-hidden /> : stepNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Lesson {stepNumber}
                        {done ? " · Done" : ""}
                      </p>
                    </div>
                    <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" aria-hidden />
                  </Link>

                  <div className="flex flex-wrap gap-1.5 pl-10 sm:pl-0">
                    {lectures.map((lec) => {
                      const Icon = KIND_ICON[lec.kind];
                      return (
                        <Link
                          key={`${lec.stepNumber}-${lec.mode}`}
                          href={lec.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Icon className="size-3" aria-hidden />
                          {lec.label}
                        </Link>
                      );
                    })}
                    {modes.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">No content yet</span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </LearnPageFrame>
  );
}
