"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame } from "@/components/learn/learn-page-frame";
import { learningData } from "@/data/learning";
import {
  isModuleFullyCompleted,
  calculateModuleProgressPct,
  lessonHref,
  resolveResumeStep,
  resumeHref,
} from "@/lib/immersive-module";
import { readProgress } from "@/lib/module-progress";
import { fadeInUp } from "@/motion/variants";
import type { CivicModule } from "@/types/learn";
import { cn } from "@/utils";
import { useEffect, useMemo, useState } from "react";

/**
 * Mobile-first course overview — one guided path per lesson (Continue inside player).
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
    const isCompleted = isModuleFullyCompleted(mod, p);
    const pct = calculateModuleProgressPct(mod, p);
    return {
      completedCount,
      total,
      pct,
      isCompleted,
      isInProgress:
        (completedCount > 0 || Object.keys(p.videosWatched ?? {}).length > 0) &&
        !isCompleted,
      resumeStep: resolveResumeStep(mod),
      startHref: resumeHref(mod),
      completed: p.stepsCompleted,
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
        <h1 className="text-2xl font-bold">Module not found</h1>
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
      ? "Continue"
      : "Start course";

  const estMinutes = mod.steps.reduce((sum, step) => {
    const words = (step.text || "").split(/\s+/).filter(Boolean).length;
    return sum + Math.max(1, Math.ceil(words / 200));
  }, 0);

  return (
    <LearnPageFrame className="space-y-8 pb-8">
      <Link
        href="/learn"
        className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← All modules
      </Link>

      <motion.section className="space-y-5" variants={fadeInUp} initial="hidden" animate="visible">
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <HarmonizedImage
            src={mod.image_url}
            alt={mod.title}
            className="rounded-none border-0 ring-0"
            fallbackLabel=""
            aspectClassName="aspect-video"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Free module</p>
          <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight">
            {mod.title}
          </h1>
          {mod.description && mod.description.trim() !== mod.title.trim() ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{mod.description}</p>
          ) : null}
        </div>

        <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            ~{estMinutes} min
          </li>
          <li>
            {progress.total} lesson{progress.total === 1 ? "" : "s"}
          </li>
          {progress.isInProgress || progress.isCompleted ? (
            <li className="tabular-nums">{progress.pct}% complete</li>
          ) : null}
        </ul>

        {(progress.isInProgress || progress.isCompleted) && (
          <Progress value={progress.pct} className="h-2" />
        )}

        <Button asChild size="lg" className="h-12 w-full rounded-2xl text-base font-semibold">
          <Link href={progress.startHref}>
            <Play className="size-4" aria-hidden />
            {ctaLabel}
          </Link>
        </Button>
      </motion.section>

      {mod.expectations?.length ? (
        <section className="space-y-3" aria-labelledby="outcomes-heading">
          <h2 id="outcomes-heading" className="text-sm font-semibold">
            What you&apos;ll learn
          </h2>
          <ul className="space-y-2">
            {mod.expectations.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3" aria-labelledby="curriculum-heading">
        <h2 id="curriculum-heading" className="text-sm font-semibold">
          Lessons
        </h2>
        <ol className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60">
          {mod.steps.map((step, index) => {
            const stepNumber = index + 1;
            const done = Boolean(progress.completed[step.order]) || progress.isCompleted;
            const href = lessonHref(mod, stepNumber);

            return (
              <li key={step.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30",
                    done && "bg-muted/15",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="size-4" aria-hidden /> : stepNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Lesson {stepNumber}
                      {done ? " · Done" : ""}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </LearnPageFrame>
  );
}
