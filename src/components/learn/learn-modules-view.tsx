"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { cn } from "@/utils";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onRefresh?: () => Promise<void>;
}

export function LearnModulesView({
  profile,
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

  const contentFiltered = useMemo(() => {
    if (contentFilter === "budget")
      return stages.filter((s) => s.is_financial_year_analysis);
    if (contentFilter === "civic")
      return stages.filter((s) => !s.is_financial_year_analysis);
    return stages;
  }, [stages, contentFilter]);

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
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Curriculum
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Civic modules
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Master Kenya&apos;s budget process, one module at a time.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                title="Refresh modules"
              >
                <RefreshCw
                  className={cn("size-4", refreshing && "animate-spin")}
                />
              </button>
            ) : null}
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="size-9 rounded-xl object-cover ring-1 ring-border/50"
              />
            ) : (
              <BitmojiAvatar
                gender={profile?.gender}
                size="sm"
                className="rounded-xl"
              />
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search modules…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-border/70 bg-card pl-10 pr-3 text-sm outline-none ring-0 transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-ring/30"
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
                  "shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
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

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
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
      </header>

      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredModules.map(
            ({ stage, completedCount, total, isCompleted, isInProgress }) => (
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
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HarmonizedImage
                  src={stage.image_url}
                  alt={stage.title}
                  className="rounded-none border-0 ring-0"
                  fallbackLabel="Module image"
                  imageClassName="group-hover:scale-105"
                />

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-lg leading-none">
                      {stage.badge || "📘"}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600"
                          : isInProgress
                            ? "bg-amber-500/10 text-amber-700"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted ? "Done" : isInProgress ? "Active" : "New"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary">
                      {stage.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {stage.description || ""}
                    </p>
                  </div>

                  {total > 0 ? (
                    <div className="mt-auto space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                        <span>
                          {completedCount}/{total} steps
                        </span>
                        <span>
                          {Math.round((completedCount / total) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(completedCount / total) * 100}%`,
                          }}
                          role="progressbar"
                          aria-valuenow={Math.round(
                            (completedCount / total) * 100,
                          )}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${stage.title}: ${completedCount} of ${total} steps completed`}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                    <div className="min-w-0">
                      {stage.author ? (
                        <Link
                          href={Routes.LearnAuthor(getAuthorSlug(stage.author))}
                          className="flex items-center gap-1.5 group/author"
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
                          <span className="truncate text-[11px] font-semibold text-muted-foreground group-hover/author:text-primary">
                            {stage.author.name}
                          </span>
                          <ExternalLink className="size-2.5 shrink-0 text-muted-foreground/40" />
                        </Link>
                      ) : stage.credits ? (
                        <span className="truncate text-[11px] font-semibold text-muted-foreground">
                          {stage.credits}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <BookOpen className="size-3" /> Module
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-7 shrink-0 rounded-lg px-3 text-[11px] font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/learn/modules/${stage.slug}`);
                      }}
                    >
                      {isCompleted
                        ? "Review"
                        : isInProgress
                          ? "Continue"
                          : "Start"}
                    </Button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 px-4 py-16 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="size-5 text-muted-foreground/50" />
          </div>
          <p className="font-heading text-base font-bold">No modules found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search"
              : activeTab !== "all"
                ? "No modules match this filter"
                : "No modules available yet"}
          </p>
        </div>
      )}
    </div>
  );
}
