"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { HarmonizedImage } from "@/components/ui/harmonized-image";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
}

export function LearnModulesView({ profile, stages, currentStage, onSelectStage }: LearnModulesViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const moduleProgress = useMemo(() => {
    return stages.map((stage) => {
      const p = readProgress(stage.slug, stage.order);
      const completedCount = Object.keys(p.stepsCompleted).length;
      const total = stage.steps.length;
      const isCompleted = p.masteryAwarded;
      const isInProgress = completedCount > 0 && !isCompleted;
      return { stage, completedCount, total, isCompleted, isInProgress };
    });
  }, [stages]);

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
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border/50 shrink-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-primary/8 p-1.5 rounded-lg shrink-0 ring-1 ring-primary/20">
            <BookOpen className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight truncate">Civic Modules</h1>
            <p className="text-[10px] text-muted-foreground font-semibold">Master the budget process</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-muted/40 border-0 rounded-lg text-xs w-36 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-7 rounded-full object-cover shrink-0 ring-1 ring-border/40" />
          ) : (
            <BitmojiAvatar gender={profile?.gender} size="sm" className="shrink-0" />
          )}
        </div>
      </header>

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
                  onClick={() => onSelectStage(stage)}
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
                      onClick={(e) => { e.stopPropagation(); onSelectStage(stage); }}>
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
  );
}
