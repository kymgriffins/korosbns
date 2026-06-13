"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { LearnProgressBar } from "./learn-progress-bar";
import { LearnEmptyState } from "./learn-empty-state";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";

// Status badge variant map — defined once, not scattered
const MODULE_STATUS_VARIANT = {
  completed: "default",
  inProgress: "secondary",
  new: "outline",
} as const;

const MODULE_STATUS_LABEL = {
  completed: "Done",
  inProgress: "Active",
  new: "New",
} as const;

const TAB_CLASSES = cva(
  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      active: {
        true:  "bg-primary text-primary-foreground shadow-xs",
        false: "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
      },
    },
  },
);

interface LearnModulesViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
}

export function LearnModulesView({ profile, stages, onSelectStage }: LearnModulesViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const moduleProgress = useMemo(() => stages.map((stage) => {
    const p = readProgress(stage.slug, stage.order);
    const completedCount = Object.keys(p.stepsCompleted).length;
    const total = stage.steps.length;
    const isCompleted = p.masteryAwarded;
    const isInProgress = completedCount > 0 && !isCompleted;
    return { stage, completedCount, total, isCompleted, isInProgress };
  }), [stages]);

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
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border/50 shrink-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-primary/10 p-1.5 rounded-lg shrink-0 ring-1 ring-primary/20">
            <BookOpen className="size-4 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">Civic Modules</h1>
            <p className="text-xs text-muted-foreground">Master the budget process</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search — uses shadcn Input */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 h-8 w-36 text-xs bg-muted/40 border-0 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search modules"
            />
          </div>

          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-7 rounded-full object-cover shrink-0 ring-1 ring-border/40" />
          ) : (
            <BitmojiAvatar gender={profile?.gender} size="sm" className="shrink-0" />
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="max-w-6xl mx-auto space-y-3">

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide" role="tablist" aria-label="Filter modules">
            {[
              { key: "all",         label: "All",    count: counts.all         },
              { key: "in-progress", label: "Active", count: counts.inProgress  },
              { key: "completed",   label: "Done",   count: counts.completed   },
            ].map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={TAB_CLASSES({ active: activeTab === tab.key })}
              >
                {tab.label}{tab.count > 0 ? ` (${tab.count})` : ""}
              </button>
            ))}
          </div>

          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {filteredModules.map(({ stage, completedCount, total, isCompleted, isInProgress }, idx) => {
                const statusKey = isCompleted ? "completed" : isInProgress ? "inProgress" : "new";
                return (
                  <motion.div
                    key={stage.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card
                      className="group shadow-xs hover:shadow-sm cursor-pointer hover:bg-accent/30 transition-all h-full flex flex-col"
                      onClick={() => onSelectStage(stage)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${stage.title} module`}
                      onKeyDown={(e) => e.key === "Enter" && onSelectStage(stage)}
                    >
                      <CardContent className="p-3.5 flex flex-col h-full">
                        {/* Badge + status */}
                        <div className="flex items-start justify-between mb-2">
                          <span role="img" aria-label={stage.badgeName ?? stage.title} className="text-xl">
                            {stage.badge || "📘"}
                          </span>
                          <Badge variant={MODULE_STATUS_VARIANT[statusKey]} className="text-xs uppercase">
                            {MODULE_STATUS_LABEL[statusKey]}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-xs leading-tight mb-1 group-hover:text-primary transition-colors">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
                          {stage.description || ""}
                        </p>

                        {/* Progress bar — no inline style */}
                        {total > 0 && (
                          <LearnProgressBar
                            value={completedCount}
                            max={total}
                            label={`${stage.title}: ${completedCount} of ${total} steps completed`}
                            showLabel
                            className="mb-2.5"
                          />
                        )}

                        <Separator className="mb-2" />

                        {/* Author + action */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {stage.author ? (
                              <Link
                                href={Routes.LearnAuthor(getAuthorSlug(stage.author))}
                                className="flex items-center gap-1.5 min-w-0 group/author"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Author: ${stage.author.name}`}
                              >
                                {stage.author.image ? (
                                  <Image
                                    src={stage.author.image}
                                    alt={stage.author.name}
                                    width={18}
                                    height={18}
                                    className="size-[18px] rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="size-[18px] rounded-full bg-muted flex items-center justify-center shrink-0 ring-1 ring-border/30">
                                    <span className="text-xs font-semibold text-muted-foreground">{stage.author.name[0]}</span>
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground group-hover/author:text-primary transition-colors truncate">
                                  {stage.author.name}
                                </span>
                                <ExternalLink className="size-2.5 text-muted-foreground/40 shrink-0" aria-hidden />
                              </Link>
                            ) : stage.credits ? (
                              <span className="text-xs text-muted-foreground truncate">{stage.credits}</span>
                            ) : null}
                          </div>

                          <Button
                            size="sm"
                            className="rounded-lg h-6 px-2.5 text-xs shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            onClick={(e) => { e.stopPropagation(); onSelectStage(stage); }}
                          >
                            {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <LearnEmptyState
              icon={BookOpen}
              heading="No modules found"
              description={
                searchQuery
                  ? "Try a different search term."
                  : activeTab !== "all"
                  ? "No modules match this filter."
                  : "No modules available yet."
              }
              borderless
            />
          )}
        </div>
      </div>
    </div>
  );
}
