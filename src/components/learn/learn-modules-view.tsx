"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, BookOpen, User } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
}

export function LearnModulesView({
  profile,
  stages,
  currentStage,
  onSelectStage,
}: LearnModulesViewProps) {
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
    if (activeTab === "in-progress") {
      list = list.filter((m) => m.isInProgress);
    } else if (activeTab === "completed") {
      list = list.filter((m) => m.isCompleted);
    }
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

  const counts = useMemo(() => ({
    all: moduleProgress.length,
    inProgress: moduleProgress.filter((m) => m.isInProgress).length,
    completed: moduleProgress.filter((m) => m.isCompleted).length,
  }), [moduleProgress]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-2 rounded-xl shrink-0">
            <BookOpen className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-lg leading-tight truncate">Civic Modules</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Master the budget process
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm w-44 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-9 rounded-full border border-border object-cover shrink-0" />
          ) : (
            <BitmojiAvatar gender={profile?.gender} size="sm" className="rounded-full border border-border shrink-0" />
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { key: "all", label: "All Modules", count: counts.all },
              { key: "in-progress", label: "In Progress", count: counts.inProgress },
              { key: "completed", label: "Completed", count: counts.completed },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors shrink-0 ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}{tab.count > 0 ? ` (${tab.count})` : ""}
              </button>
            ))}
          </div>

          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModules.map(({ stage, completedCount, total, isCompleted, isInProgress }, idx) => (
                <motion.div
                  key={stage.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group relative bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-primary/30 flex flex-col"
                  onClick={() => onSelectStage(stage)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{stage.badge || "📘"}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-600"
                        : isInProgress
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? "Done" : isInProgress ? "Active" : "New"}
                    </span>
                  </div>

                  <h3 className="font-black text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {stage.description || ""}
                  </p>

                  {total > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                        <span>{completedCount}/{total} lessons</span>
                        <span>{Math.round((completedCount / total) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(completedCount / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      {stage.author?.image ? (
                        <img
                          src={stage.author.image}
                          alt={stage.author.name}
                          className="size-6 rounded-full object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="size-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-[10px] font-semibold text-muted-foreground truncate">
                        {stage.author?.name || stage.credits || "BNS Team"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full h-7 px-3 text-[10px] font-bold shrink-0"
                      onClick={(e) => { e.stopPropagation(); onSelectStage(stage); }}
                    >
                      {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="size-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-base font-bold text-muted-foreground">No modules found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {searchQuery
                  ? "Try a different search"
                  : activeTab !== "all"
                    ? "No modules match this filter"
                    : "No modules available yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}