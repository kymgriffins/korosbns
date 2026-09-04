"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <LearnPageFrame className="space-y-0 pb-8">
      {/* Dossier header — typewriter style */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="border-b-2 border-foreground pb-6"
      >
        <Link
          href="/learn"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        >
          ← All modules
        </Link>
        <div className="mt-2 inline-flex items-center gap-1.5 border-2 border-primary/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary" style={{ transform: "rotate(-1deg)" }}>
          Free module
        </div>
        <h1 className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          {mod.title}
        </h1>
        {mod.description && mod.description.trim() !== mod.title.trim() ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mod.description}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          {mod.author?.name ? (
            <span className="font-semibold">By {mod.author.name}</span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />~{estMinutes} min
          </span>
          <span>{progress.total} lesson{progress.total === 1 ? "" : "s"}</span>
          {progress.isInProgress || progress.isCompleted ? (
            <span className="tabular-nums">{progress.pct}% complete</span>
          ) : null}
        </div>
      </motion.div>

      {/* Progress + CTA */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-4 py-6"
      >
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

      {/* What you'll learn */}
      {mod.expectations?.length ? (
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-3 border-t border-border/40 py-6"
          aria-labelledby="outcomes-heading"
        >
          <h2 id="outcomes-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
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
        </motion.section>
      ) : null}

      {/* Curriculum — numbered rows */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-3 border-t border-border/40 py-6"
        aria-labelledby="curriculum-heading"
      >
        <h2 id="curriculum-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Curriculum
        </h2>
        <ol className="divide-y divide-border/40">
          {mod.steps.map((step, index) => {
            const stepNumber = index + 1;
            const done = Boolean(progress.completed[step.order]) || progress.isCompleted;
            const href = lessonHref(mod, stepNumber);

            return (
              <li key={step.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-3.5 transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    done && "bg-muted/10",
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
      </motion.section>
    </LearnPageFrame>
  );
}
