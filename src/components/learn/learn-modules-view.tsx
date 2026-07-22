"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Routes } from "@/constants/routes";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
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
      const isCompleted = p.masteryAwarded;
      const isInProgress = completedCount > 0 && !isCompleted;
      const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      return { stage, completedCount, total, pct, isCompleted, isInProgress };
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

  const primaryHref = primary
    ? `/learn/modules/${primary.stage.slug}`
    : Routes.Learn;
  const primaryCta = primary?.isInProgress
    ? `Continue ${primary.stage.title}`
    : primary
      ? `Start ${primary.stage.title}`
      : "Browse modules";

  return (
    <LearnPageFrame className="space-y-12">
      <motion.section
        className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Free courses
          </p>
          <h1 className="max-w-[18ch] text-balance font-heading text-[2.15rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Learn Kenya&apos;s budget
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Self-paced civic modules — read, watch, and quiz. No account required to start.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" className="h-11 rounded-md px-6 text-sm font-semibold">
              <Link href={primaryHref}>{primaryCta}</Link>
            </Button>
          </div>
        </div>

        {primary ? (
          <Link
            href={primaryHref}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HarmonizedImage
              src={primary.stage.image_url}
              alt={primary.stage.title}
              className="rounded-none border-0 ring-0"
              fallbackLabel=""
              imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
              aspectClassName="aspect-[16/10]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 pt-12">
              <p className="text-xs font-medium text-primary-foreground/80">Featured module</p>
              <p className="mt-1 text-sm font-semibold text-primary-foreground">
                {primary.stage.title}
              </p>
            </div>
          </Link>
        ) : null}
      </motion.section>

      {continueRows.length > 0 ? (
        <section className="space-y-4" aria-label="Continue learning">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
            Continue learning
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {continueRows.map((row) => (
              <Link
                key={row.stage.id}
                href={`/learn/modules/${row.stage.slug}`}
                className="min-w-[240px] max-w-[280px] shrink-0 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {row.stage.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {row.completedCount}/{row.total} lessons · {row.pct}%
                </p>
                <Progress value={row.pct} className="mt-3 h-1.5" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6" aria-label="All modules">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              All modules
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {moduleProgress.length} course{moduleProgress.length === 1 ? "" : "s"} · free forever
            </p>
          </div>
          {showFilters ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search modules…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-border/60 bg-muted/30 pl-10 pr-3 text-sm outline-none transition-shadow focus:border-primary/35 focus:bg-background focus:ring-2 focus:ring-ring/25"
              />
            </div>
          ) : null}
        </div>

        {showFilters ? (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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
                  "shrink-0 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  progressFilter === tab.key
                    ? "bg-primary text-primary-foreground"
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
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredModules.map((row) => (
              <motion.article key={row.stage.id} variants={fadeInUp}>
                <Link
                  href={`/learn/modules/${row.stage.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative">
                    <HarmonizedImage
                      src={row.stage.image_url}
                      alt={row.stage.title}
                      className="rounded-none border-0 ring-0"
                      fallbackLabel=""
                      imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                      aspectClassName="aspect-video"
                    />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-foreground/85 px-2 py-1 text-[10px] font-semibold text-background">
                      <Play className="size-3" aria-hidden />
                      {row.total} lesson{row.total === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="space-y-1.5">
                      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary">
                        {row.stage.title}
                      </h3>
                      {row.stage.description &&
                      row.stage.description.trim() !== row.stage.title.trim() ? (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>
                              {row.isCompleted ? "Completed" : "In progress"}
                            </span>
                            <span className="tabular-nums">{row.pct}%</span>
                          </div>
                          <Progress value={row.pct} className="h-1.5" />
                        </div>
                      ) : (
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Not started · free
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
