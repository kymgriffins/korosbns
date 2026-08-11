"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock3, FileText, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Routes } from "@/constants/routes";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { isModuleFullyCompleted, calculateModuleProgressPct } from "@/lib/immersive-module";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame } from "@/components/learn/learn-page-frame";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { cn } from "@/utils";

const MIN_MODULES_FOR_FILTERS = 4;

interface LearnModulesViewProps {
  profile: unknown;
  stages: CivicModule[];
  currentStage: CivicModule;
  onRefresh?: () => Promise<void>;
}

function prioritizeBps(stages: CivicModule[]): CivicModule[] {
  const bps = stages.find((s) => s.slug === "budget-policy-statement");
  if (!bps) return stages;
  return [bps, ...stages.filter((s) => s.slug !== bps.slug)];
}

type ModuleRow = {
  stage: CivicModule;
  completedCount: number;
  total: number;
  minutes: number;
  pct: number;
  isCompleted: boolean;
  isInProgress: boolean;
};

type ArticleRow = {
  id: string;
  href: string;
  title: string;
  summary: string;
  moduleTitle: string;
  minutes: number;
};

export function LearnModulesView({ stages }: LearnModulesViewProps) {
  const [progressFilter, setProgressFilter] = useState<"all" | "in-progress" | "completed">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const orderedStages = useMemo(() => prioritizeBps(stages), [stages]);

  const moduleProgress = useMemo<ModuleRow[]>(() => {
    return orderedStages.map((stage) => {
      const p = readProgress(stage.slug, stage.order);
      const completedCount = Object.keys(p.stepsCompleted).length;
      const total = stage.steps.length;
      const minutes = stage.steps.reduce((sum, step) => sum + (step.estimated_minutes ?? 8), 0);
      const isCompleted = isModuleFullyCompleted(stage, p);
      const pct = calculateModuleProgressPct(stage, p);
      const isInProgress = (completedCount > 0 || Object.keys(p.videosWatched ?? {}).length > 0) && !isCompleted;
      return { stage, completedCount, total, minutes, pct, isCompleted, isInProgress };
    });
  }, [orderedStages]);

  const articleRows = useMemo<ArticleRow[]>(() => {
    return orderedStages.flatMap((stage) =>
      stage.steps
        .filter((step) => step.article_slug || step.text || step.article_summary)
        .slice(0, 1)
        .map((step) => ({
          id: `${stage.slug}-${step.id}`,
          href: `/learn/modules/${stage.slug}/read/${step.order || 1}`,
          title: step.title || stage.title,
          summary: step.article_summary || stage.description,
          moduleTitle: stage.title,
          minutes: step.estimated_minutes ?? 8,
        })),
    );
  }, [orderedStages]);

  const filteredModules = useMemo(() => {
    let list = moduleProgress;
    if (progressFilter === "in-progress") list = list.filter((m) => m.isInProgress);
    else if (progressFilter === "completed") list = list.filter((m) => m.isCompleted);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.stage.title.toLowerCase().includes(q) ||
          (m.stage.description || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [moduleProgress, progressFilter, searchQuery]);

  const primary = moduleProgress[0];
  const continueRows = moduleProgress.filter((m) => m.isInProgress);
  const showFilters = moduleProgress.length >= MIN_MODULES_FOR_FILTERS;

  const primaryHref = primary ? `/learn/modules/${primary.stage.slug}` : Routes.Learn;
  const primaryCta = primary?.isInProgress
    ? `Continue ${primary.stage.title}`
    : primary
      ? `Start ${primary.stage.title}`
      : "Browse modules";
  const completedModules = moduleProgress.filter((m) => m.isCompleted).length;
  const totalLessons = moduleProgress.reduce((sum, row) => sum + row.total, 0);
  const totalArticles = articleRows.length;

  return (
    <LearnPageFrame className="learn-hub-stage space-y-10 sm:space-y-14">
      <motion.section
        className="learn-hub-hero relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md sm:rounded-[2.5rem] sm:p-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-10 lg:p-10"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="learn-hub-grain pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative z-10 space-y-5 sm:space-y-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse" />
            Free learning hub
          </p>
          <h1 className="max-w-[14ch] text-balance font-heading text-3xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Learn Kenya&apos;s budget
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
            Read the companion articles, watch the explainers, and track the public finance
            ideas that shape decisions before Budget Day.
          </p>
          <div className="grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Courses", value: moduleProgress.length },
              { label: "Lessons", value: totalLessons },
              { label: "Articles", value: totalArticles },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-background/80 p-3 shadow-sm backdrop-blur-sm sm:rounded-2xl"
              >
                <p className="font-mono text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">{stat.value}</p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="learn-hub-primary-action min-h-[48px] h-12 w-full rounded-full px-6 text-sm font-bold shadow-xl shadow-primary/25 active:scale-[0.98] transition-all sm:w-auto"
            >
              <Link href={primaryHref} target="_blank" rel="noopener noreferrer">
                <span>{primaryCta}</span>
                <ArrowRight className="size-4 ml-1.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        {primary ? (
          <Link
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="learn-featured-panel group relative z-10 mt-6 block overflow-hidden rounded-2xl border border-background/80 bg-muted/30 shadow-xl shadow-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mt-8 sm:rounded-[1.75rem] lg:mt-0"
          >
            <HarmonizedImage
              src={primary.stage.image_url}
              alt={primary.stage.title}
              className="rounded-none border-0 ring-0"
              fallbackLabel=""
              imageClassName="transition-transform duration-700 group-hover:scale-[1.06]"
              aspectClassName="aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-background/90 text-foreground opacity-90 shadow-lg transition-all duration-300 group-hover:scale-110 sm:left-5 sm:top-5 sm:size-12">
              <Play className="size-5 fill-current ml-0.5" aria-hidden />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 pt-12 sm:p-6 sm:pt-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground/80">Featured module</p>
              <p className="mt-1 max-w-sm text-base font-bold leading-snug text-primary-foreground sm:text-xl">
                {primary.stage.title}
              </p>
              <p className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-1 font-mono text-xs font-semibold text-primary-foreground backdrop-blur-md">
                {primary.completedCount}/{primary.total} lessons
                <span className="h-1 w-1 rounded-full bg-primary-foreground/70" />
                {primary.pct}% complete
              </p>
            </div>
          </Link>
        ) : null}
      </motion.section>

      {continueRows.length > 0 ? (
        <section className="space-y-4" aria-label="Continue learning">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Continue learning</h2>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Pick up from your latest module checkpoint.
              </p>
            </div>
            <p className="hidden font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
              {completedModules}/{moduleProgress.length} complete
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x snap-mandatory scroll-smooth sm:gap-4">
            {continueRows.map((row) => (
              <Link
                key={row.stage.id}
                href={`/learn/modules/${row.stage.slug}`}
                className="learn-progress-tile snap-start min-w-[270px] max-w-[330px] shrink-0 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[300px] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                    {row.stage.title}
                  </p>
                  <span className="figure font-mono rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary shrink-0">
                    {row.pct}%
                  </span>
                </div>
                <p className="mt-2.5 font-mono text-xs text-muted-foreground">
                  {row.completedCount}/{row.total} lessons finished
                </p>
                <Progress value={row.pct} className="mt-3.5 h-1.5 learn-charged-progress" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {articleRows.length > 0 ? (
        <section className="space-y-4 sm:space-y-5" aria-label="Learning articles">
          <div className="ledger-tick-rule" aria-hidden />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Learning articles</h2>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Written companions for the video modules.
              </p>
            </div>
            <Link
              href="/learn/articles"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
            >
              Browse articles
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {articleRows.map((article) => (
              <Link
                key={article.id}
                href={article.href}
                className="group rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                      {article.moduleTitle}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                      {article.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-6">
                  {article.summary}
                </p>
                <p className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden />
                  {article.minutes} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5 sm:space-y-6" aria-label="All modules">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">All modules</h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {moduleProgress.length} course{moduleProgress.length === 1 ? "" : "s"} &bull; free forever
            </p>
          </div>
          {showFilters ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-3 text-sm outline-none transition-shadow focus:border-primary/35 focus:bg-background focus:ring-2 focus:ring-ring/25"
              />
            </div>
          ) : null}
        </div>

        {showFilters ? (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
            {(
              [
                { key: "all", label: "All" },
                { key: "in-progress", label: "In progress" },
                { key: "completed", label: "Completed" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setProgressFilter(tab.key)}
                className={cn(
                  "snap-start shrink-0 min-h-[44px] rounded-xl px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-ring",
                  progressFilter === tab.key
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {filteredModules.length > 0 ? (
          <motion.div
            className="learn-module-deck grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredModules.map((row, index) => (
              <motion.article
                key={row.stage.id}
                variants={fadeInUp}
                className={cn("lg:col-span-2", index === 0 && "lg:col-span-3")}
              >
                <Link
                  href={`/learn/modules/${row.stage.slug}`}
                  className={cn(
                    "learn-module-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:rounded-3xl",
                    row.isInProgress && "is-in-progress border-primary/40 bg-gradient-to-b from-primary/[0.04] to-transparent",
                    !row.isInProgress && !row.isCompleted && "is-not-started",
                  )}
                >
                  <div className="relative">
                    <HarmonizedImage
                      src={row.stage.image_url}
                      alt={row.stage.title}
                      className="rounded-none border-0 ring-0"
                      fallbackLabel=""
                      imageClassName="transition-transform duration-700 group-hover:scale-[1.06]"
                      aspectClassName="aspect-video"
                    />
                    <span className="learn-lesson-badge absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-[10px] font-bold text-foreground shadow-lg backdrop-blur-md border border-white/10">
                      <Play className="size-3 fill-current" aria-hidden />
                      <span className="font-mono">{row.total}</span> lesson{row.total === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <div className="space-y-1.5">
                      <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
                        {row.stage.title}
                      </h3>
                      {row.stage.description &&
                      row.stage.description.trim() !== row.stage.title.trim() ? (
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {row.stage.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-auto space-y-3 border-t border-border/40 pt-3">
                      {row.stage.author ? (
                        <div className="flex items-center gap-2">
                          {row.stage.author.image ? (
                            <Image
                              src={row.stage.author.image}
                              alt=""
                              width={20}
                              height={20}
                              className="size-5 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                              {row.stage.author.name[0]}
                            </span>
                          )}
                          <span className="truncate text-xs text-muted-foreground">
                            {row.stage.author.name}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="size-3" aria-hidden />
                          {row.stage.credits || "Budget Ndio Story"}
                        </span>
                      )}

                      {row.isInProgress || row.isCompleted ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                            <span>{row.isCompleted ? "Completed" : "In progress"}</span>
                            <span className="tabular-nums font-bold text-primary">{row.pct}%</span>
                          </div>
                          <Progress value={row.pct} className="h-1.5" />
                        </div>
                      ) : (
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Not started &bull; free
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-16 text-center">
            <BookOpen className="mx-auto size-8 text-muted-foreground/40" aria-hidden />
            <p className="mt-3 font-heading text-base font-semibold">No modules found</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search"
                : progressFilter !== "all"
                  ? "No modules match this filter"
                  : "No modules available yet"}
            </p>
          </div>
        )}
      </section>
    </LearnPageFrame>
  );
}
