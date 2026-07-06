"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnCardGrid,
  LearnEmptyState,
  LearnFilterTabs,
  LearnPageBody,
  LearnRefreshButton,
  LearnSearchField,
  LearnToolbar,
} from "@/components/learn/learn-ui-primitives";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import { readProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";
import { cn } from "@/utils";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onRefresh?: () => Promise<void>;
}

type ProgressTab = "all" | "in-progress" | "completed";
type ContentTab = "all" | "budget" | "civic";

export function LearnModulesView({
  stages,
  onRefresh,
}: LearnModulesViewProps) {
  const router = useRouter();
  const [progressTab, setProgressTab] = useState<ProgressTab>("all");
  const [contentTab, setContentTab] = useState<ContentTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const contentFiltered = useMemo(() => {
    if (contentTab === "budget") return stages.filter((s) => s.is_financial_year_analysis);
    if (contentTab === "civic") return stages.filter((s) => !s.is_financial_year_analysis);
    return stages;
  }, [stages, contentTab]);

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
    if (progressTab === "in-progress") list = list.filter((m) => m.isInProgress);
    else if (progressTab === "completed") list = list.filter((m) => m.isCompleted);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.stage.title.toLowerCase().includes(q) ||
          (m.stage.description || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [moduleProgress, progressTab, searchQuery]);

  const counts = useMemo(
    () => ({
      all: moduleProgress.length,
      inProgress: moduleProgress.filter((m) => m.isInProgress).length,
      completed: moduleProgress.filter((m) => m.isCompleted).length,
    }),
    [moduleProgress],
  );

  return (
    <LearnPageShell
      navId="modules"
      actions={
        onRefresh ? (
          <LearnRefreshButton
            label="Sync"
            refreshing={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await onRefresh();
              } finally {
                setRefreshing(false);
              }
            }}
          />
        ) : null
      }
    >
      <LearnPageBody>
        <div className="space-y-4">
          <LearnToolbar>
            <LearnSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search modules…"
              className="w-full sm:max-w-xs"
            />
          </LearnToolbar>

          <LearnFilterTabs
            tabs={[
              { key: "all", label: "All", count: counts.all },
              { key: "in-progress", label: "Active", count: counts.inProgress },
              { key: "completed", label: "Done", count: counts.completed },
            ]}
            value={progressTab}
            onChange={setProgressTab}
          />

          <LearnFilterTabs
            tabs={[
              { key: "all", label: "All types" },
              { key: "budget", label: "Budget data" },
              { key: "civic", label: "Civic modules" },
            ]}
            value={contentTab}
            onChange={setContentTab}
          />

          {filteredModules.length > 0 ? (
            <LearnCardGrid>
              {filteredModules.map(({ stage, completedCount, total, isCompleted, isInProgress }, idx) => (
                <motion.article
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group flex cursor-pointer flex-col rounded-2xl border border-border/60 bg-card p-4 ring-1 ring-border/30 transition-all hover:border-primary/25 hover:shadow-sm"
                  onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                >
                  <HarmonizedImage
                    src={stage.image_url}
                    alt={stage.title}
                    className="mb-3 rounded-xl ring-1 ring-border/20"
                    fallbackLabel="Module"
                    imageClassName="group-hover:scale-105"
                  />

                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-xl">{stage.badge || "📘"}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
                          : isInProgress
                            ? "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isCompleted ? "Done" : isInProgress ? "Active" : "New"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold leading-tight group-hover:text-primary">
                    {stage.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-[11px] text-muted-foreground">
                    {stage.description || ""}
                  </p>

                  {total > 0 ? (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                        <span>
                          {completedCount}/{total} steps
                        </span>
                        <span>{Math.round((completedCount / total) * 100)}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary w-[var(--p)]"
                          style={
                            { "--p": `${(completedCount / total) * 100}%` } as React.CSSProperties
                          }
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                    <div className="min-w-0">
                      {stage.author ? (
                        <Link
                          href={Routes.LearnAuthor(getAuthorSlug(stage.author))}
                          className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stage.author.image ? (
                            <Image
                              src={stage.author.image}
                              alt=""
                              width={16}
                              height={16}
                              className="size-4 rounded-full object-cover"
                            />
                          ) : null}
                          <span className="truncate">{stage.author.name}</span>
                          <ExternalLink className="size-2.5 shrink-0" />
                        </Link>
                      ) : null}
                    </div>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg px-2.5 text-[10px] font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/learn/modules/${stage.slug}`);
                      }}
                    >
                      {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                    </Button>
                  </div>
                </motion.article>
              ))}
            </LearnCardGrid>
          ) : (
            <LearnEmptyState
              icon={BookOpen}
              title="No modules found"
              description={
                searchQuery
                  ? "Try a different search term."
                  : progressTab !== "all"
                    ? "No modules match this filter."
                    : "No modules available yet."
              }
            />
          )}
        </div>
      </LearnPageBody>
    </LearnPageShell>
  );
}
