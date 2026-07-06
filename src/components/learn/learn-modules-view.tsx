"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { RefreshCw, Search, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import { cn } from "@/utils";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onRefresh?: () => Promise<void>;
}

export function LearnModulesView({ profile, stages, currentStage, onSelectStage, onRefresh }: LearnModulesViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">("all");
  const [contentFilter, setContentFilter] = useState<"all" | "budget" | "civic">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const contentFiltered = useMemo(() => {
    if (contentFilter === "budget") return stages.filter((s) => s.is_financial_year_analysis);
    if (contentFilter === "civic") return stages.filter((s) => !s.is_financial_year_analysis);
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
      list = list.filter((m) =>
        m.stage.title.toLowerCase().includes(q) ||
        (m.stage.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [moduleProgress, activeTab, searchQuery]);

  const counts = useMemo(() => ({
    all: moduleProgress.length,
    inProgress: moduleProgress.filter((m) => m.isInProgress).length,
    completed: moduleProgress.filter((m) => m.isCompleted).length,
  }), [moduleProgress]);

  return (
    <LearnPageShell
      navId="modules"
      compact
      className="h-full"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
      actions={
        onRefresh ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await onRefresh();
              } finally {
                setRefreshing(false);
              }
            }}
          >
            <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
            Sync modules
          </Button>
        ) : null
      }
    >
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="flex shrink-0 items-center justify-end gap-2 border-b border-border/40 px-1 pb-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search modules…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 rounded-full border border-border/60 bg-muted/30 py-1.5 pl-8 pr-3 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-7 shrink-0 rounded-full object-cover ring-1 ring-border/40" />
          ) : (
            <BitmojiAvatar gender={profile?.gender} size="sm" className="shrink-0" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "in-progress", label: "Active", count: counts.inProgress },
              { key: "completed", label: "Done", count: counts.completed },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {tab.label}{tab.count > 0 ? ` (${tab.count})` : ""}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide border-t border-border/20 pt-2.5 mt-0.5">
            {[
              { key: "all", label: "All" },
              { key: "budget", label: "Budget Data" },
              { key: "civic", label: "Civic Modules" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setContentFilter(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-ring ${
                  contentFilter === tab.key
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {filteredModules.map(({ stage, completedCount, total, isCompleted, isInProgress }, idx) => (
                  <motion.div
                    key={stage.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group bg-card shadow-xs hover:shadow-sm rounded-xl p-3.5 cursor-pointer hover:bg-accent/30 transition-all flex flex-col ring-1 ring-border/40"
                    onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                  >
                  <HarmonizedImage
                    src={stage.image_url}
                    alt={stage.title}
                    className="-mx-0.5 -mt-0.5 mb-2.5 rounded-lg ring-1 ring-border/20"
                    fallbackLabel="Module image"
                    imageClassName="group-hover:scale-105"
                  />
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xl">{stage.badge || "\uD83D\uDCD8"}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20" :
                      isInProgress ? "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20" :
                      "bg-muted/40 text-muted-foreground"
                    }`}>
                      {isCompleted ? "Done" : isInProgress ? "Active" : "New"}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs leading-tight mb-1 group-hover:text-primary transition-colors">{stage.title}</h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2 flex-1">{stage.description || ""}</p>

                  {total > 0 && (
                    <div className="space-y-1 mb-2.5">
                      <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                        <span>{completedCount}/{total} steps</span>
                        <span>{Math.round((completedCount / total) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500 w-[var(--progress)]"
                          style={{ "--progress": `${(completedCount / total) * 100}%` } as React.CSSProperties}
                          role="progressbar"
                          aria-valuenow={Math.round((completedCount / total) * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${stage.title}: ${completedCount} of ${total} steps completed`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {stage.author ? (
                        <Link href={Routes.LearnAuthor(getAuthorSlug(stage.author))} className="flex items-center gap-1.5 min-w-0 group" onClick={(e) => e.stopPropagation()}>
                          {stage.author.image ? (
                            <Image src={stage.author.image} alt={stage.author.name} width={18} height={18} className="size-[18px] rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="size-[18px] rounded-full bg-muted flex items-center justify-center shrink-0 ring-1 ring-border/30">
                              <span className="text-[8px] font-bold text-muted-foreground">{stage.author.name[0]}</span>
                            </div>
                          )}
                          <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary transition-colors truncate">
                            {stage.author.name}
                          </span>
                          <ExternalLink className="size-2 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                      ) : stage.credits ? (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="size-[18px] rounded-full bg-muted flex items-center justify-center shrink-0 ring-1 ring-border/30">
                            <span className="text-[8px] font-bold text-muted-foreground">{stage.credits[0]}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-muted-foreground truncate">
                            {stage.credits}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <Button size="sm" className="rounded-lg h-6 px-2.5 text-[10px] font-bold shrink-0 focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={(e) => { e.stopPropagation(); router.push(`/learn/modules/${stage.slug}`); }}>
                      {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3 ring-1 ring-border/30">
                <BookOpen className="size-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">No modules found</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                {searchQuery ? "Try a different search" : activeTab !== "all" ? "No modules match this filter" : "No modules available yet"}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </LearnPageShell>
  );
}
