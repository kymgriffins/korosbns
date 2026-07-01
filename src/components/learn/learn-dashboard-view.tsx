"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import {
  Flame, Award, BookOpen, Trophy, Zap, ArrowRight,
  ChevronRight, Play, Sparkles, Crown, CircleUser,
  MessageSquare, ListChecks, Target, CheckCircle2,
  Loader2, ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import type { LeaderboardEntry } from "@/types/gamification";
import { useGamificationMe } from "@/hooks/use-gamification";
import { useDailyQuests } from "@/hooks/use-quests";
import { readProgress } from "@/lib/module-progress";
import { taskData } from "@/data/tasks";
import type { Task } from "@/types/tasks";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { cn } from "@/utils";

interface LearnDashboardViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onNavigateToCurriculum: () => void;
  onNavigateToForum?: () => void;
  leaderboard?: LeaderboardEntry[];
}

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};


export function LearnDashboardView({
  profile, stages, currentStage, onSelectStage, onNavigateToCurriculum, onNavigateToForum, leaderboard,
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

  const points = gamification?.points ?? profile.sovereigns ?? 0;
  const level = gamification?.level ?? Math.floor(points / 100) + 1;
  const streak = gamification?.streak_days ?? profile.streakDays ?? 0;
  const earnedBadges = gamification?.badges?.length ?? profile.badges?.length ?? 0;
  const xpIntoLevel = points % 100;

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
        desc: (q as any).description ?? q.title,
        xp: (q as any).xp ?? 0,
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      }))
    : [];

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl space-y-3 p-3 md:p-5 pb-24"
    >
      {/* ═══ TIER 1: RESUME ═══ */}
      <motion.div
        variants={itemVars}
        className="rounded-xl bg-primary p-5 md:p-6 text-primary-foreground"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="size-13 overflow-hidden rounded-full bg-white/15">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                ) : (
                  <BitmojiAvatar gender={profile.gender as "male" | "female"} size="md" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-white px-1 text-[10px] font-bold text-primary">
                {level}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold leading-tight md:text-2xl">{profile.breakName || "Citizen"}</h1>
              <p className="truncate text-sm font-medium text-primary-foreground/70">{profile.county || "Kenya"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5">
              <Flame className="size-4 text-amber-300" fill="currentColor" />
              <span className="text-sm font-bold tabular-nums">{streak}</span>
              <span className="text-xs text-primary-foreground/70">{streak === 1 ? "day" : "days"}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-medium text-primary-foreground/70">
            <span>{points} XP</span>
            <span>{xpIntoLevel}/100 to Level {level + 1}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 w-[var(--progress)]"
              style={{ "--progress": `${xpIntoLevel}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </motion.div>

      {/* Resume card — merge hero action with continue learning */}
      <motion.div variants={itemVars} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="h-9 rounded-lg text-sm font-bold px-4">
            <Link href={currentStage ? `/learn/modules/${currentStage.slug}` : Routes.Learn}>
              <Play className="mr-1.5 size-3.5" fill="currentColor" />
              {isNewUser ? "Start your first module" : resume?.pct ? "Continue learning" : "Start learning"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 rounded-lg text-sm font-bold px-4">
            <Link href={Routes.LearnForum}>
              <MessageSquare className="mr-1.5 size-3.5" /> Discussions
            </Link>
          </Button>
        </div>
        <Button asChild variant="outline" size="sm" className="h-9 rounded-lg text-sm font-bold px-4">
          <Link href={Routes.LearnQuests}>
            <ListChecks className="mr-1.5 size-3.5" /> Quests
          </Link>
        </Button>
      </motion.div>

      {/* ═══ TIER 2: STATS ═══ */}
      <motion.div variants={itemVars} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total XP", value: points, icon: Sparkles, color: "text-primary" },
          { label: "Day streak", value: streak, icon: Flame, color: "text-orange-500" },
          { label: "Badges", value: isNewUser ? "—" : `${earnedBadges}`, icon: Award, color: "text-emerald-600" },
          { label: "Rank", value: userRank ? `#${userRank}` : isNewUser ? "—" : "—", icon: Trophy, color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", stat.color)}>
              <stat.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold leading-tight tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ═══ TIER 3: DISCOVER ═══ */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_300px]">
        {/* Left column */}
        <div className="min-w-0 space-y-3">
          {/* Continue learning card — only if user has progress */}
          {!isNewUser && currentStage && resume && resume.pct > 0 && (
            <motion.button
              variants={itemVars}
              onClick={() => router.push(`/learn/modules/${currentStage.slug}`)}
              className="group relative flex w-full items-stretch gap-3 overflow-hidden rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-28">
                {currentStage.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentStage.image_url} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-3xl">{currentStage.badge}</div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Play className="size-3" fill="currentColor" /> Continue learning
                  </p>
                  <h3 className="line-clamp-1 text-sm font-black">{currentStage.title}</h3>
                  <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{currentStage.description}</p>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>{resume.total > 0 ? `${resume.completed}/${resume.total} chapters` : "No chapters"}</span>
                    <span>{resume.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all w-[var(--p)]" style={{ "--p": `${resume.pct}%` } as React.CSSProperties} />
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </motion.button>
          )}

          {/* Empty state for new users */}
          {isNewUser && (
            <motion.div variants={itemVars} className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="size-7 text-primary" />
              </div>
              <h3 className="mb-1 text-base font-bold">Welcome to Budget Ndio Story</h3>
              <p className="mx-auto mb-4 max-w-sm text-xs text-muted-foreground">
                Learn how Kenya&apos;s budget works — from national allocations to county spending. Start with your first module.
              </p>
              <Button asChild variant="default" size="sm" className="rounded-lg text-xs font-bold">
                <Link href={Routes.Learn}>
                  <Play className="mr-1.5 size-3" fill="currentColor" /> Start your first module
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Jump to a module — with completion rings */}
          <motion.div variants={itemVars} className="rounded-xl border bg-card p-3">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <CircleUser className="size-3 text-primary" /> Jump to a module
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {stages.map((stage) => {
                const prog = moduleProgress.get(stage.slug);
                const isComplete = prog && prog.total > 0 && prog.pct >= 100;
                const isStarted = prog && prog.pct > 0 && prog.pct < 100;
                const ringColor = isComplete ? "text-emerald-500" : isStarted ? "text-primary" : "text-muted-foreground";
                const ringStroke = isComplete ? 2.5 : isStarted ? 2 : 1.5;
                return (
                  <button
                    key={stage.slug}
                    onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                    className="group flex shrink-0 flex-col items-center gap-1 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className={cn(
                      "relative size-14 overflow-hidden rounded-full p-[2.5px] transition-transform group-hover:scale-105",
                      isComplete ? "bg-emerald-500/20" : isStarted ? "bg-primary/15" : "bg-muted",
                    )}>
                      {/* SVG completion ring */}
                      {prog && prog.total > 0 && (
                        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth={ringStroke}
                            className={cn("opacity-20", ringColor)} />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth={ringStroke}
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - prog.pct / 100)}`}
                            className={ringColor} strokeLinecap="round" />
                        </svg>
                      )}
                      {isComplete && (
                        <div className="absolute -top-0.5 -right-0.5 z-10">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        </div>
                      )}
                      <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-card relative z-0">
                        {stage.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
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

          {/* Citizen Action Items — from published tasks */}
          {citizenTasks.length > 0 && (
            <motion.div variants={itemVars} className="rounded-xl border bg-card p-3">
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ClipboardList className="size-3 text-primary" /> Your Action Items
              </h2>
              <div className="space-y-1.5">
                {citizenTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/30">
                    <div className="mt-0.5 shrink-0">
                      <div className={cn(
                        "size-2 rounded-full",
                        task.priority === "high" || task.priority === "urgent" ? "bg-red-500" :
                        task.priority === "medium" ? "bg-amber-500" : "bg-muted-foreground/40",
                      )} />
                    </div>
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

        {/* Right column */}
        <div className="space-y-3">
          {/* Leaderboard */}
          <motion.div variants={itemVars} className="rounded-xl border bg-card p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold">
                <Crown className="size-3.5 text-amber-500" /> Top Citizens
              </h3>
              {onNavigateToForum && (
                <button onClick={onNavigateToForum} className="rounded text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                      "flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors",
                      entry.isUser ? "bg-primary/5" : "hover:bg-muted/40",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cn(
                        "w-5 text-center text-xs font-bold",
                        entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-orange-500" : "text-muted-foreground",
                      )}>
                        {entry.rank}
                      </span>
                      <div className="size-6 shrink-0 overflow-hidden rounded-full bg-muted">
                        {entry.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={entry.avatar_url} alt="" className="size-full object-cover" />
                        ) : (
                          <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                        )}
                      </div>
                      <span className="truncate text-[11px] font-bold">{entry.name}</span>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground">{entry.points} XP</span>
                  </div>
                ))
              ) : (
                <div className="py-5 text-center text-[11px] text-muted-foreground">No citizens yet. Start learning!</div>
              )}
            </div>
          </motion.div>

          {/* Daily quests — from API */}
          <motion.div variants={itemVars} className="rounded-xl border bg-card p-3.5">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Zap className="size-3.5 text-amber-500" /> Daily Quests
            </h3>
            <div className="space-y-1.5">
              {questsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : quests.length > 0 ? (
                quests.map((quest, i) => (
                  <div key={quest.title + i} className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/30">
                    <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", quest.bg)}>
                      <quest.icon className={cn("size-3.5", quest.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-tight">{quest.title}</p>
                      <p className="text-[10px] leading-tight text-muted-foreground">{quest.desc}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">+{quest.xp}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <Target className="size-5 text-muted-foreground/40" />
                  <p className="text-[10px] text-muted-foreground">No quests available yet. Check back soon!</p>
                </div>
              )}
            </div>
            {quests.length > 0 && (
              <Button asChild variant="ghost" size="sm" className="mt-1.5 h-7 w-full text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring">
                <Link href={Routes.LearnQuests}>
                  All quests <ChevronRight className="ml-0.5 size-3" />
                </Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
