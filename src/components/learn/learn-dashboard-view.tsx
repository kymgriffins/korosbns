"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Flame, Award, BookOpen, Trophy, Zap, ArrowRight,
  ChevronRight, Play, Crown, CircleUser,
  MessageSquare, ListChecks, Target, CheckCircle2,
  Loader2, ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CivicModule } from "@/types/learn";
import type { LearnHubProfile } from "@/lib/learn-data";
import type { LeaderboardEntry } from "@/types/gamification";
import { useGamificationMe } from "@/hooks/use-gamification";
import { useDailyQuests } from "@/hooks/use-quests";
import { readProgress } from "@/lib/module-progress";
import { taskData } from "@/data/tasks";
import type { Task } from "@/types/tasks";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { cn } from "@/utils";
import { LearnStage } from "./learn-stage";
import { LearnChamberHero } from "./learn-chamber-hero";
import { learnStaggerContainer, learnStaggerItem } from "./learn-motion";
import { resolveGamification, SOVEREIGN_SHORT } from "@/lib/learn-gamification";

interface LearnDashboardViewProps {
  profile: Partial<LearnHubProfile> & { language?: string };
  stages: CivicModule[];
  currentStage: CivicModule;
  onNavigateToCurriculum: () => void;
  onNavigateToForum?: () => void;
  leaderboard?: LeaderboardEntry[];
}

export function LearnDashboardView({
  profile, stages, currentStage, onNavigateToCurriculum, onNavigateToForum, leaderboard,
}: LearnDashboardViewProps) {
  const router = useRouter();
  const { data: gamification } = useGamificationMe();
  const { data: questsData, isLoading: questsLoading } = useDailyQuests();

  const [citizenTasks, setCitizenTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    taskData.tasks.fetch().then((tasks) => {
      const published = (Array.isArray(tasks) ? tasks : []).filter((t) => t.status === "published");
      setCitizenTasks(published.slice(0, 5));
    }).catch(() => {
      setCitizenTasks([]);
    }).finally(() => setTasksLoading(false));
  }, []);

  const { points, level, streak, xpIntoLevel } = resolveGamification(profile, gamification ?? undefined);
  const earnedBadges = gamification?.badges?.length ?? profile.badges?.length ?? 0;
  const userRank = leaderboard?.find((l) => l.name === profile.breakName)?.rank ?? null;
  const isNewUser = points === 0 && !currentStage;

  const resume = useMemo(() => {
    if (!currentStage) return null;
    const p = readProgress(currentStage.slug, currentStage.order);
    const total = currentStage.steps?.length || 0;
    const completed = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct, currentStep: p.currentStep || 1 };
  }, [currentStage]);

  const leaderboardEntries = useMemo(() => {
    return (leaderboard ?? []).slice(0, 8).map((entry, i) => ({
      name: entry.name ?? "Anonymous",
      points: entry.points,
      rank: entry.rank ?? i + 1,
      isUser: profile?.breakName?.toLowerCase() === (entry.name ?? "").toLowerCase(),
      avatar_url: entry.avatar_url,
    }));
  }, [leaderboard, profile]);

  const moduleProgress = useMemo(() => {
    const map = new Map<string, { completed: number; total: number; pct: number }>();
    for (const stage of stages) {
      const p = readProgress(stage.slug, stage.order);
      const total = stage.steps?.length || 0;
      const completed = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
      map.set(stage.slug, { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 });
    }
    return map;
  }, [stages]);

  const quests = questsData && questsData.length > 0
    ? questsData.map((q) => ({
        title: q.title,
        desc: (q as { description?: string }).description ?? q.title,
        xp: (q as { xp?: number }).xp ?? 0,
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      }))
    : [];

  return (
    <LearnStage>
      <motion.div variants={learnStaggerContainer} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={learnStaggerItem}>
          <LearnChamberHero
            profile={profile}
            currentStage={currentStage}
            resume={resume}
            points={points}
            level={level}
            streak={streak}
            xpIntoLevel={xpIntoLevel}
            isNewUser={isNewUser}
          />
        </motion.div>

        <motion.div variants={learnStaggerItem} className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 rounded-lg text-sm font-semibold">
            <Link href={Routes.LearnForum}>
              <MessageSquare className="mr-1.5 size-3.5" /> Ask about the budget
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 rounded-lg text-sm font-semibold">
            <Link href={Routes.LearnQuests}>
              <ListChecks className="mr-1.5 size-3.5" /> Daily quests
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 text-sm font-semibold" onClick={onNavigateToCurriculum}>
            Learning path <ChevronRight className="ml-0.5 size-3.5" />
          </Button>
        </motion.div>

        <motion.div variants={learnStaggerItem} className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: SOVEREIGN_SHORT, value: points, icon: Zap, color: "text-[var(--learn-seal-gold)]" },
            { label: "Day streak", value: streak, icon: Flame, color: "text-amber-500" },
            { label: "Badges", value: isNewUser ? "—" : `${earnedBadges}`, icon: Award, color: "text-[var(--learn-vote-green)]" },
            { label: "Rank", value: userRank ? `#${userRank}` : "—", icon: Trophy, color: "text-muted-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/50", stat.color)}>
                <stat.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="font-mono text-lg font-bold leading-tight tabular-nums">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
          <div className="min-w-0 space-y-4">
            {!isNewUser && currentStage && resume && resume.pct > 0 && (
              <motion.button
                variants={learnStaggerItem}
                onClick={() => router.push(`/learn/modules/${currentStage.slug}`)}
                className="group flex w-full items-stretch gap-3 overflow-hidden rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-24">
                  {currentStage.image_url ? (
                    <img src={currentStage.image_url} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-3xl">{currentStage.badge}</div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-xs font-semibold text-primary">
                      <Play className="size-3" fill="currentColor" /> In progress
                    </p>
                    <h3 className="line-clamp-1 text-sm font-bold">{currentStage.title}</h3>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>{resume.completed}/{resume.total} steps</span>
                      <span>{resume.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-[var(--learn-vote-green)] transition-all" style={{ width: `${resume.pct}%` }} />
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </motion.button>
            )}

            {isNewUser && (
              <motion.div variants={learnStaggerItem} className="rounded-xl border border-dashed border-[var(--learn-seal-gold)]/40 bg-muted/30 p-6 text-center">
                <BookOpen className="mx-auto mb-2 size-8 text-[var(--learn-seal-gold)]" />
                <h3 className="mb-1 text-base font-bold">Welcome to the chamber</h3>
                <p className="mx-auto mb-4 max-w-sm text-xs text-muted-foreground">
                  Start with your first module on Kenya&apos;s national and county budget process.
                </p>
                <Button asChild size="sm" className="rounded-lg text-xs font-bold">
                  <Link href="/learn?tab=modules">
                    <Play className="mr-1.5 size-3" fill="currentColor" /> Open learning path
                  </Link>
                </Button>
              </motion.div>
            )}

            <motion.div variants={learnStaggerItem} className="rounded-xl border bg-card p-3">
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <CircleUser className="size-3 text-primary" /> Learning path
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {stages.map((stage) => {
                  const prog = moduleProgress.get(stage.slug);
                  const isComplete = prog && prog.total > 0 && prog.pct >= 100;
                  const isStarted = prog && prog.pct > 0 && prog.pct < 100;
                  return (
                    <button
                      key={stage.slug}
                      onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                      className="group flex shrink-0 flex-col items-center gap-1 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className={cn(
                        "relative size-14 overflow-hidden rounded-full p-[2.5px]",
                        isComplete ? "bg-[var(--learn-vote-green)]/20" : isStarted ? "bg-[var(--learn-seal-gold)]/20" : "bg-muted",
                      )}>
                        {isComplete && (
                          <div className="absolute -top-0.5 -right-0.5 z-10">
                            <CheckCircle2 className="size-4 text-[var(--learn-vote-green)]" />
                          </div>
                        )}
                        <div className="relative z-0 flex size-full items-center justify-center overflow-hidden rounded-full bg-card">
                          {stage.image_url ? (
                            <img src={stage.image_url} alt="" className="size-full object-cover" />
                          ) : (
                            <span className="text-lg">{stage.badge}</span>
                          )}
                        </div>
                      </div>
                      <span className="max-w-14 truncate text-center text-[9px] font-semibold leading-tight text-muted-foreground">
                        {stage.badgeName || stage.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {!tasksLoading && citizenTasks.length > 0 && (
              <motion.div variants={learnStaggerItem} className="rounded-xl border bg-card p-3">
                <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <ClipboardList className="size-3 text-primary" /> Civic action items
                </h2>
                <div className="space-y-1.5">
                  {citizenTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 rounded-lg p-1.5 hover:bg-muted/30">
                      <div className={cn(
                        "mt-0.5 size-2 shrink-0 rounded-full",
                        task.priority === "high" || task.priority === "urgent" ? "bg-[var(--learn-vermillion)]" :
                        task.priority === "medium" ? "bg-amber-500" : "bg-muted-foreground/40",
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold leading-tight">{task.title}</p>
                        {task.due_date && (
                          <p className="text-[9px] text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <motion.div variants={learnStaggerItem} className="rounded-xl border bg-card p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-bold">
                  <Crown className="size-3.5 text-[var(--learn-seal-gold)]" /> Top citizens
                </h3>
                {onNavigateToForum && (
                  <button onClick={onNavigateToForum} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                    Forum
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {leaderboardEntries.length > 0 ? (
                  leaderboardEntries.map((entry, i) => (
                    <div
                      key={entry.name ?? i}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2 py-1.5",
                        entry.isUser ? "bg-primary/5" : "hover:bg-muted/40",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="w-5 text-center text-xs font-bold text-muted-foreground">{entry.rank}</span>
                        <span className="truncate text-[11px] font-bold">{entry.name}</span>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
                        {entry.points} {SOVEREIGN_SHORT}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-5 text-center text-[11px] text-muted-foreground">No citizens yet. Start learning!</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={learnStaggerItem} className="rounded-xl border bg-card p-3.5">
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <Zap className="size-3.5 text-amber-500" /> Daily quests
              </h3>
              <div className="space-y-1.5">
                {questsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                ) : quests.length > 0 ? (
                  quests.map((quest, i) => (
                    <div key={quest.title + i} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted/30">
                      <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", quest.bg)}>
                        <quest.icon className={cn("size-3.5", quest.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-tight">{quest.title}</p>
                        <p className="text-[10px] text-muted-foreground">{quest.desc}</p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-primary">+{quest.xp}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <Target className="size-5 text-muted-foreground/40" />
                    <p className="text-[10px] text-muted-foreground">No quests yet. Check back soon.</p>
                  </div>
                )}
              </div>
              {quests.length > 0 && (
                <Button asChild variant="ghost" size="sm" className="mt-1.5 h-7 w-full text-xs font-semibold">
                  <Link href={Routes.LearnQuests}>
                    All quests <ChevronRight className="ml-0.5 size-3" />
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </LearnStage>
  );
}
