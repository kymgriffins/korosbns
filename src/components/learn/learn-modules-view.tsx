"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Routes } from "@/constants/routes";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { isModuleFullyCompleted, calculateModuleProgressPct } from "@/lib/immersive-module";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame, LearnSection } from "@/components/learn/learn-page-frame";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
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
    ? "Continue learning"
    : primary
      ? "Start learning"
      : "Browse modules";
  const completedModules = moduleProgress.filter((m) => m.isCompleted).length;
  const totalLessons = moduleProgress.reduce((sum, row) => sum + row.total, 0);

  return (
    <LearnPageFrame>
      <section className="space-y-6 pb-8 pt-2">
        <GsapReveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Free civic learning
          </p>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight">
            Learn Kenya&apos;s budget
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Guided lessons on public finance — read, watch, and check understanding with
            Next. No paywall.
          </p>

          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: "Courses", value: moduleProgress.length },
              { label: "Lessons", value: totalLessons },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-card px-4 py-3"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <Button asChild size="lg" className="h-12 w-full rounded-2xl text-base font-semibold">
            <Link href={primaryHref}>
              {primaryCta}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </GsapReveal>

        {primary ? (
          <GsapReveal>
            <Link
              href={primaryHref}
              className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-muted/30"
            >
              <HarmonizedImage
                src={primary.stage.image_url}
                alt={primary.stage.title}
                className="rounded-none border-0 ring-0"
                fallbackLabel=""
                imageClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                aspectClassName="aspect-[16/10]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/80">
                  Up next
                </p>
                <p className="mt-1 font-bold leading-snug text-primary-foreground">
                  {primary.stage.title}
                </p>
                <p className="mt-2 text-xs text-primary-foreground/90">
                  {primary.completedCount}/{primary.total} lessons · {primary.pct}%
                </p>
              </div>
            </Link>
          </GsapReveal>
        ) : null}
      </section>

      {continueRows.length > 0 ? (
        <LearnSection
          title="Continue"
          description="Pick up where you left off."
          className="border-t border-border/40 pt-8"
        >
          <div className="space-y-3">
            {continueRows.map((row) => (
              <Link
                key={row.stage.id}
                href={`/learn/modules/${row.stage.slug}`}
                className="block rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{row.stage.title}</p>
                  <span className="shrink-0 text-xs font-bold tabular-nums text-primary">
                    {row.pct}%
                  </span>
                </div>
                <Progress value={row.pct} className="mt-3 h-1.5" />
              </Link>
            ))}
          </div>
        </LearnSection>
      ) : null}

      <LearnSection
        title="All courses"
        description={`${moduleProgress.length} free module${moduleProgress.length === 1 ? "" : "s"}`}
        className="border-t border-border/40 pt-8"
        action={
          showFilters ? (
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-2xl border border-border/60 bg-muted/30 pl-10 pr-4 text-sm outline-none focus:border-primary/35 focus:bg-background focus:ring-2 focus:ring-ring/25"
              />
            </div>
          ) : undefined
        }
      >
        {showFilters ? (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(
              [
                { key: "all", label: "All" },
                { key: "in-progress", label: "In progress" },
                { key: "completed", label: "Done" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setProgressFilter(tab.key)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  progressFilter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card text-muted-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {filteredModules.length > 0 ? (
          <GsapStaggerReveal className="space-y-4">
            {filteredModules.map((row) => (
              <article key={row.stage.id} data-gsap-item>
                <Link
                  href={`/learn/modules/${row.stage.slug}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/30"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <HarmonizedImage
                      src={row.stage.image_url}
                      alt={row.stage.title}
                      className="size-full rounded-none border-0 ring-0"
                      fallbackLabel=""
                      imageClassName="object-cover"
                      aspectClassName="aspect-square size-20"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                      {row.stage.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {row.total} lesson{row.total === 1 ? "" : "s"}
                      {row.isInProgress || row.isCompleted ? ` · ${row.pct}%` : ""}
                    </p>
                    {row.stage.author ? (
                      <span className="truncate text-[11px] text-muted-foreground">
                        {row.stage.author.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <BookOpen className="size-3" aria-hidden />
                        {row.stage.credits || "Budget Ndio Story"}
                      </span>
                    )}
                  </div>
                  <Play className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </article>
            ))}
          </GsapStaggerReveal>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center">
            <BookOpen className="mx-auto size-8 text-muted-foreground/40" aria-hidden />
            <p className="mt-4 text-lg font-bold">No courses found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search" : "No modules match this filter"}
            </p>
          </div>
        )}
      </LearnSection>
    </LearnPageFrame>
  );
}
