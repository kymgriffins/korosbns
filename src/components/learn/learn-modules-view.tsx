"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, FileText, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Routes } from "@/constants/routes";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { isModuleFullyCompleted, calculateModuleProgressPct } from "@/lib/immersive-module";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame, LearnSection } from "@/components/learn/learn-page-frame";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapHeroChoreography, GsapStaggerReveal } from "@/motion/gsap";
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
      const isInProgress =
        (completedCount > 0 || Object.keys(p.videosWatched ?? {}).length > 0) && !isCompleted;
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
    <LearnPageFrame>
      <section className="border-b border-border/40 pb-16 pt-2 md:pb-24 md:pt-4">
        <GsapHeroChoreography className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div data-gsap-hero-content className="flex flex-col gap-6 lg:col-span-6">
            <span className={T.eyebrow}>Free civic learning</span>
            <h1 className={cn(T.heroTitle, "max-w-xl text-balance")}>
              Learn Kenya&apos;s{" "}
              <span className={T.highlight}>budget</span>
            </h1>
            <p className={cn(T.lead, "max-w-lg text-foreground/75")}>
              Read companion articles, watch explainers, and follow public finance
              from Treasury allocation to county delivery — no paywall on reading.
            </p>

            <dl className="grid max-w-md grid-cols-3 gap-4">
              {[
                { label: "Courses", value: moduleProgress.length },
                { label: "Lessons", value: totalLessons },
                { label: "Articles", value: totalArticles },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-card px-4 py-4"
                >
                  <dt className={cn(T.caption, "text-muted-foreground")}>{stat.label}</dt>
                  <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className={cn(T.btnPrimary, "rounded-full px-8")}>
                <Link href={primaryHref}>
                  {primaryCta}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          {primary ? (
            <div data-gsap-hero-media className="lg:col-span-6">
              <Link
                href={primaryHref}
                className="group relative block overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted/30 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HarmonizedImage
                  src={primary.stage.image_url}
                  alt={primary.stage.title}
                  className="rounded-none border-0 ring-0"
                  fallbackLabel=""
                  imageClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  aspectClassName="aspect-[16/10]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <span className="absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <Play className="size-5 fill-current" aria-hidden />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 pt-20">
                  <p className={cn(T.caption, "text-primary-foreground/80")}>Featured module</p>
                  <p className="mt-2 max-w-sm font-heading text-xl font-bold leading-tight text-primary-foreground">
                    {primary.stage.title}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur">
                    {primary.completedCount}/{primary.total} lessons
                    <span className="h-1 w-1 rounded-full bg-primary-foreground/70" />
                    {primary.pct}% complete
                  </p>
                </div>
              </Link>
            </div>
          ) : null}
        </GsapHeroChoreography>
      </section>

      {continueRows.length > 0 ? (
        <LearnSection
          title="Continue learning"
          description="Pick up from your latest module checkpoint."
          className="border-t-0"
          action={
            <p className={cn(T.caption, "hidden text-muted-foreground sm:block")}>
              {completedModules}/{moduleProgress.length} complete
            </p>
          }
        >
          <GsapStaggerReveal className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {continueRows.map((row) => (
              <Link
                key={row.stage.id}
                data-gsap-item
                href={`/learn/modules/${row.stage.slug}`}
                className="min-w-[300px] max-w-[360px] shrink-0 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="line-clamp-2 font-heading text-sm font-bold leading-snug text-foreground">
                    {row.stage.title}
                  </p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold tabular-nums text-primary">
                    {row.pct}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {row.completedCount}/{row.total} lessons finished
                </p>
                <Progress value={row.pct} className="mt-4 h-1.5" />
              </Link>
            ))}
          </GsapStaggerReveal>
        </LearnSection>
      ) : null}

      {articleRows.length > 0 ? (
        <LearnSection
          title="Learning articles"
          description="Written companions for the video modules."
          action={
            <Link
              href="/learn/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse articles
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        >
          <GsapStaggerReveal className="grid gap-5 lg:grid-cols-3">
            {articleRows.map((article) => (
              <Link
                key={article.id}
                data-gsap-item
                href={article.href}
                className="group rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className={cn(T.caption, "line-clamp-1 text-muted-foreground")}>
                      {article.moduleTitle}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-foreground group-hover:text-primary">
                      {article.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden />
                  {article.minutes} min read
                </p>
              </Link>
            ))}
          </GsapStaggerReveal>
        </LearnSection>
      ) : null}

      <LearnSection
        title="All modules"
        description={`${moduleProgress.length} course${moduleProgress.length === 1 ? "" : "s"} — free forever`}
        action={
          showFilters ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-border/60 bg-muted/30 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-primary/35 focus:bg-background focus:ring-2 focus:ring-ring/25"
              />
            </div>
          ) : undefined
        }
      >
        {showFilters ? (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  progressFilter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {filteredModules.length > 0 ? (
          <GsapStaggerReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((row) => (
              <article key={row.stage.id} data-gsap-item>
                <Link
                  href={`/learn/modules/${row.stage.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative">
                    <HarmonizedImage
                      src={row.stage.image_url}
                      alt={row.stage.title}
                      className="rounded-none border-0 ring-0"
                      fallbackLabel=""
                      imageClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                      aspectClassName="aspect-video"
                    />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1.5 text-[10px] font-bold text-background backdrop-blur">
                      <Play className="size-3" aria-hidden />
                      {row.total} lesson{row.total === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="space-y-2">
                      <h3 className="line-clamp-2 font-heading text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
                        {row.stage.title}
                      </h3>
                      {row.stage.description &&
                      row.stage.description.trim() !== row.stage.title.trim() ? (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {row.stage.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-auto space-y-3 border-t border-border/40 pt-4">
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
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{row.isCompleted ? "Completed" : "In progress"}</span>
                            <span className="tabular-nums">{row.pct}%</span>
                          </div>
                          <Progress value={row.pct} className="h-1.5" />
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-muted-foreground">
                          Not started — free
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </GsapStaggerReveal>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-6 py-20 text-center">
            <BookOpen className="mx-auto size-8 text-muted-foreground/40" aria-hidden />
            <p className="mt-4 font-heading text-lg font-bold">No modules found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search"
                : progressFilter !== "all"
                  ? "No modules match this filter"
                  : "No modules available yet"}
            </p>
          </div>
        )}
      </LearnSection>
    </LearnPageFrame>
  );
}
