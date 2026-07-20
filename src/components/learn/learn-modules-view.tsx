"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageFrame, LearnPageHeader } from "@/components/learn/learn-page-frame";
import { cn } from "@/utils";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onRefresh?: () => Promise<void>;
}

function prioritizeBps(stages: CivicModule[]): CivicModule[] {
  const bps = stages.find((s) => s.slug === "budget-policy-statement");
  if (!bps) return stages;
  return [bps, ...stages.filter((s) => s.slug !== bps.slug)];
}

export function LearnModulesView({
  stages,
  onRefresh,
}: LearnModulesViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">(
    "all",
  );
  const [contentFilter, setContentFilter] = useState<"all" | "budget" | "civic">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const orderedStages = useMemo(() => prioritizeBps(stages), [stages]);

  const contentFiltered = useMemo(() => {
    if (contentFilter === "budget")
      return orderedStages.filter((s) => s.is_financial_year_analysis);
    if (contentFilter === "civic")
      return orderedStages.filter((s) => !s.is_financial_year_analysis);
    return orderedStages;
  }, [orderedStages, contentFilter]);

  const moduleProgress = useMemo(() => {
    return contentFiltered.map((stage) => {
      const p = readProgress(stage.slug, stage.order);
      const completedCount = Object.keys(p.stepsCompleted).length;
      const total = stage.steps.length;
      const isCompleted = p.masteryAwarded;
      const isInProgress = completedCount > 0 && !isCompleted;
      return { stage, completedCount, total, isCompleted, isInProgress };
    });
  }, [contentFiltered]);

  const filteredModules = useMemo(() => {
    let list = moduleProgress;
    if (activeTab === "in-progress") list = list.filter((m) => m.isInProgress);
    else if (activeTab === "completed") list = list.filter((m) => m.isCompleted);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.stage.title.toLowerCase().includes(q) ||
          (m.stage.description || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [moduleProgress, activeTab, searchQuery]);

  const counts = useMemo(
    () => ({
      all: moduleProgress.length,
      inProgress: moduleProgress.filter((m) => m.isInProgress).length,
      completed: moduleProgress.filter((m) => m.isCompleted).length,
    }),
    [moduleProgress],
  );

  return (
    <LearnPageFrame className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <LearnPageHeader
          eyebrow="Curriculum"
          title="Civic modules"
          description="Master Kenya's budget process, one module at a time."
          className="flex-1"
        />
        {onRefresh ? (
          <button
            type="button"
            onClick={async () => {
              setRefreshing(true);
              try {
                await onRefresh();
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="mt-1 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            title="Refresh modules"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-border/60 bg-muted/30 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-primary/35 focus:bg-background focus:ring-2 focus:ring-ring/25"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {(
              [
                { key: "all", label: "All", count: counts.all },
                { key: "in-progress", label: "Active", count: counts.inProgress },
                { key: "completed", label: "Done", count: counts.completed },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.count > 0 ? ` · ${tab.count}` : ""}
              </button>
            ))}
          </div>

          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {(
              [
                { key: "all", label: "All types" },
                { key: "budget", label: "Budget data" },
                { key: "civic", label: "Civic" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setContentFilter(tab.key)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  contentFilter === tab.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map(({ stage, completedCount, total, isCompleted, isInProgress }) => {
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            return (
              <article
                key={stage.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/learn/modules/${stage.slug}`);
                  }
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/50 bg-card transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HarmonizedImage
                  src={stage.image_url}
                  alt={stage.title}
                  className="rounded-none border-0 ring-0"
                  fallbackLabel=""
                  imageClassName="group-hover:scale-[1.02]"
                  aspectClassName="aspect-[16/9]"
                />

                <div className="flex flex-1 flex-col gap-3.5 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600"
                          : isInProgress
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted ? "Done" : isInProgress ? "Active" : "New"}
                    </span>
                    {total > 0 ? (
                      <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                        {completedCount}/{total} steps
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-heading text-[15px] font-semibold leading-snug tracking-tight group-hover:text-primary">
                      {stage.title}
                    </h3>
                    {stage.description ? (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {stage.description}
                      </p>
                    ) : null}
                  </div>

                  {total > 0 ? (
                    <div className="mt-auto space-y-2">
                      <div className="h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${stage.title}: ${pct}% complete`}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3.5">
                    <div className="min-w-0">
                      {stage.author ? (
                        <Link
                          href={Routes.LearnAuthor(getAuthorSlug(stage.author))}
                          className="group/author flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stage.author.image ? (
                            <Image
                              src={stage.author.image}
                              alt={stage.author.name}
                              width={18}
                              height={18}
                              className="size-[18px] rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex size-[18px] items-center justify-center rounded-full bg-muted text-[8px] font-bold text-muted-foreground">
                              {stage.author.name[0]}
                            </span>
                          )}
                          <span className="truncate text-[11px] font-medium text-muted-foreground group-hover/author:text-primary">
                            {stage.author.name}
                          </span>
                          <ExternalLink className="size-2.5 shrink-0 text-muted-foreground/40" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <BookOpen className="size-3" />
                          {stage.credits || "Budget Ndio Story"}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-8 shrink-0 rounded-full px-3.5 text-[11px] font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/learn/modules/${stage.slug}`);
                      }}
                    >
                      {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/60 px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="size-5 text-muted-foreground/50" />
          </div>
          <p className="font-heading text-base font-semibold">No modules found</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search"
              : activeTab !== "all"
                ? "No modules match this filter"
                : "No modules available yet"}
          </p>
        </div>
      )}
    </LearnPageFrame>
  );
}
