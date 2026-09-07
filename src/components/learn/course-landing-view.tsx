"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Play,
  Scale,
  ShieldCheck,
  Zap,
  AlertTriangle,
} from "lucide-react";
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
  stepReadingMinutes,
  parseStepVideos,
} from "@/lib/immersive-module";
import { readProgress } from "@/lib/module-progress";
import { fadeInUp } from "@/motion/variants";
import type { CivicModule } from "@/types/learn";
import { cn } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { getModuleCivicHook, getModuleEmoji } from "@/lib/learn-module-display";

function getMasteryIcon(icon: string) {
  switch (icon) {
    case "zap":
      return <Zap className="size-4 text-amber-500" />;
    case "shield":
      return <ShieldCheck className="size-4 text-emerald-500" />;
    case "scale":
      return <Scale className="size-4 text-blue-500" />;
    case "alertTriangle":
      return <AlertTriangle className="size-4 text-rose-500" />;
    case "fileText":
    default:
      return <FileText className="size-4 text-primary" />;
  }
}

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

  const civicHook = useMemo(() => {
    return getModuleCivicHook(slug, mod);
  }, [slug, mod]);

  if (loading) {
    return (
      <LearnPageFrame className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading course" />
      </LearnPageFrame>
    );
  }

  if (!mod || !progress) {
    return (
      <LearnPageFrame className="space-y-4 text-center py-16">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <p className="text-sm text-muted-foreground">This course is unavailable or was removed.</p>
        <Button asChild variant="outline">
          <Link href="/learn">Back to modules</Link>
        </Button>
      </LearnPageFrame>
    );
  }

  const ctaLabel = progress.isCompleted
    ? "Review Module"
    : progress.isInProgress
      ? `Resume Lesson ${progress.resumeStep}`
      : "Start Module (Lesson 1 - Free)";

  const estMinutes = mod.steps.reduce((sum, step) => {
    const words = (step.text || "").split(/\s+/).filter(Boolean).length;
    return sum + Math.max(1, Math.ceil(words / 200));
  }, 0);

  return (
    <LearnPageFrame className="max-w-5xl mx-auto space-y-8 pb-12 pt-2">
      {/* ── Top Navigation & Urgency Bar ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between gap-3"
      >
        <Link
          href="/learn"
          className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>All Modules</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-mono font-bold text-primary">
            <span>{civicHook.urgencyPill}</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            100% Free Access
          </span>
        </div>
      </motion.div>

      {/* ── Header: Title & Civic Tagline ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary">
          <span>{getModuleEmoji(mod.badge)}</span>
          <span>Module {mod.order} · {mod.badgeName || "Civic Masterclass"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-[1.1]">
          {mod.title}
        </h1>
        <p className="text-sm sm:text-base font-bold text-foreground/90 leading-snug">
          {civicHook.tagline}
        </p>
      </motion.div>

      {/* ── Compact Split Hero: Exactly 1 Primary CTA in Mobile View ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
      >
        {/* Visual Video Preview Frame: On mobile appears directly below title */}
        <div className="lg:col-span-5 space-y-3 order-first lg:order-last">
          <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-zinc-950 block shadow-xl transition-all">
            <Image
              src={mod.image_url || "https://i.ytimg.com/vi/Ed9lP0-komE/hqdefault.jpg"}
              alt={mod.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/15">
                Masterclass Preview
              </span>
              <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-xs">
                {progress.total} Chapters
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-2xl transition-transform group-hover:scale-110">
                <Play className="size-5 sm:size-6 fill-current ml-0.5" />
              </span>
            </div>

            <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
              <p className="text-xs font-bold leading-tight line-clamp-1">
                {mod.steps[0]?.title || mod.title}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[10px] text-white/80">
                  {mod.badgeName || "Civic Public Finance"}
                </span>
                <span className="font-mono text-[10px] text-white/75">
                  ~{estMinutes || 15} Mins
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex rounded-xl border border-border/60 bg-card/60 p-3 items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-foreground">Verified Civic Standard</span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">Article 201 CoK 2010</span>
          </div>
        </div>

        {/* Left Column: Civic Hook, Fast Stats & The ONE Primary CTA Button */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {civicHook.leadHook}
          </p>

          {/* Fast Stats Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center">
              <span className="block text-[10px] font-mono font-semibold text-muted-foreground uppercase">Duration</span>
              <span className="text-xs font-mono font-bold text-foreground">~{estMinutes || 15} Mins</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center">
              <span className="block text-[10px] font-mono font-semibold text-muted-foreground uppercase">Structure</span>
              <span className="text-xs font-mono font-bold text-foreground">{progress.total} Lessons</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center">
              <span className="block text-[10px] font-mono font-semibold text-muted-foreground uppercase">Statute</span>
              <span className="text-xs font-mono font-bold text-foreground truncate">
                {civicHook.fastStats.statute.split("·")[0].trim()}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center">
              <span className="block text-[10px] font-mono font-semibold text-muted-foreground uppercase">Access</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Public Domain</span>
            </div>
          </div>

          {/* High-Conversion Action Card: Single CTA in this View */}
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs space-y-3">
            {progress.isInProgress && (
              <div className="space-y-1.5 pb-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-bold text-primary">{progress.pct}% completed</span>
                </div>
                <Progress value={progress.pct} className="h-2" />
              </div>
            )}

            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl text-sm sm:text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all group"
            >
              <Link href={progress.startHref} className="flex items-center justify-center gap-2">
                <Play className="size-4 fill-current transition-transform group-hover:scale-110" />
                <span>{ctaLabel}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Instant access</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>3 sequential videos</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Official reader companion</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── What You'll Master (Actionable Core Competencies) ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-3 pt-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
            What You&apos;ll Master // Core Competencies
          </h2>
          <span className="text-[11px] font-mono text-primary font-bold">4 Key Skills</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {civicHook.keyMasteries.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/60 bg-card/60 p-3.5 flex items-start gap-3 transition-colors hover:border-border hover:bg-card"
            >
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                {getMasteryIcon(item.icon)}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Curriculum / Lessons List ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-3 pt-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
            Course Syllabus // {progress.total} Chapter{progress.total === 1 ? "" : "s"}
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">Sequential Reading & Video</span>
        </div>

        <div className="divide-y divide-border/40 rounded-2xl border border-border/70 bg-card overflow-hidden">
          {mod.steps.map((step, index) => {
            const stepNumber = index + 1;
            const done = Boolean(progress.completed[step.order]) || progress.isCompleted;
            const href = lessonHref(mod, stepNumber);
            const videoCount = parseStepVideos(step).length;
            const readTime = stepReadingMinutes(step, videoCount);

            return (
              <Link
                key={step.id}
                href={href}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/30 group",
                  done && "bg-muted/10",
                )}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-mono font-bold transition-transform group-hover:scale-105",
                      done
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border/60 group-hover:border-primary/50 group-hover:text-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="size-4" /> : `0${stepNumber}`}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {step.title}
                    </p>
                    {step.article_summary ? (
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                        {step.article_summary}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center pl-11 sm:pl-0">
                  {videoCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                      <Play className="size-2.5 fill-current" />
                      <span>{videoCount} Video{videoCount > 1 ? "s" : ""}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                    <Clock className="size-2.5" />
                    <span>{readTime || "5 min"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground px-2.5 py-1 text-[11px] font-mono font-bold transition-colors ml-1">
                    <span>{done ? "Review" : "Start"}</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* ── Bottom Action Banner (Desktop only; on mobile the syllabus rows are the direct action) ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="hidden md:flex rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Ready to hold public spending accountable?
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Start this civic masterclass now. No sign-up barriers, 100% free under Kenya&apos;s public education mandate.
          </p>
        </div>
        <Button asChild size="default" className="rounded-xl font-bold px-6 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={progress.startHref} className="inline-flex items-center gap-1.5">
            <span>{ctaLabel}</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </LearnPageFrame>
  );
}
