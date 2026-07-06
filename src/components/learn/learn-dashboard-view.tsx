"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Crown,
  Flame,
  ListChecks,
  MessageSquare,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnCardGrid,
  LearnEmptyState,
  LearnExploreLayout,
  LearnLoadingState,
  LearnPageBody,
  LearnPanel,
  LearnSection,
  LearnStatTile,
} from "@/components/learn/learn-ui-primitives";
import type { CivicModule } from "@/types/learn";
import type { LeaderboardEntry } from "@/types/gamification";
import { useGamificationMe } from "@/hooks/use-gamification";
import { useDailyQuests } from "@/hooks/use-quests";
import { readProgress } from "@/lib/module-progress";
import { taskData } from "@/data/tasks";
import type { Task } from "@/types/tasks";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
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

export function LearnDashboardView({
  profile,
  stages,
  currentStage,
  onNavigateToForum,
  leaderboard,
}: LearnDashboardViewProps) {
  const router = useRouter();
  const { data: gamification } = useGamificationMe();
  const { data: questsData, isLoading: questsLoading } = useDailyQuests();
  const [citizenTasks, setCitizenTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    taskData.tasks
      .fetch()
      .then((tasks) => {
        const published = (Array.isArray(tasks) ? tasks : []).filter((t) => t.status === "published");
        setCitizenTasks(published.slice(0, 5));
      })
      .catch(() => setCitizenTasks([]))
      .finally(() => setTasksLoading(false));
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
    return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
  }, [currentStage]);

  const moduleProgress = useMemo(() => {
    return stages.map((stage) => {
      const p = readProgress(stage.slug, stage.order);
      const total = stage.steps?.length || 0;
      const completed = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
      const pct = total ? Math.round((completed / total) * 100) : 0;
      return { stage, total, completed, pct, done: p.masteryAwarded };
    });
  }, [stages]);

  const leaderboardEntries = useMemo(
    () =>
      (leaderboard ?? []).slice(0, 8).map((entry, i) => ({
        name: entry.name ?? "Anonymous",
        points: entry.points,
        rank: entry.rank ?? i + 1,
        isUser: profile?.breakName?.toLowerCase() === (entry.name ?? "").toLowerCase(),
        avatar_url: entry.avatar_url,
      })),
    [leaderboard, profile],
  );

  const quests = questsData?.length
    ? questsData.map((q) => ({
        title: q.title,
        desc: (q as { description?: string }).description ?? q.title,
        xp: (q as { xp?: number }).xp ?? 0,
      }))
    : [];

  const aside = (
  <>
    <LearnPanel>
      <LearnSection title="Top citizens" hint="Community leaderboard">
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
                  <span
                    className={cn(
                      "w-5 text-center text-xs font-bold",
                      entry.rank === 1 ? "text-amber-500" : "text-muted-foreground",
                    )}
                  >
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
                  <span className="truncate text-[11px] font-semibold">{entry.name}</span>
                </div>
                <span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground">
                  {entry.points} XP
                </span>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No citizens yet. Start learning!
            </p>
          )}
        </div>
        {onNavigateToForum ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-8 w-full text-xs"
            onClick={onNavigateToForum}
          >
            <MessageSquare className="mr-1.5 size-3" />
            Join forum
          </Button>
        ) : null}
      </LearnSection>
    </LearnPanel>

    <LearnPanel>
      <LearnSection title="Daily quests" hint="Principle: Craft">
        {questsLoading ? (
          <LearnLoadingState label="Loading quests…" />
        ) : quests.length > 0 ? (
          <div className="space-y-2">
            {quests.map((quest, i) => (
              <div
                key={quest.title + i}
                className="flex items-center gap-2 rounded-xl bg-muted/30 p-2"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <Zap className="size-3.5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight">{quest.title}</p>
                  <p className="text-[10px] text-muted-foreground">{quest.desc}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary">+{quest.xp}</span>
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="mt-1 h-8 w-full text-xs">
              <Link href={Routes.LearnQuests}>
                All quests <ChevronRight className="ml-0.5 size-3" />
              </Link>
            </Button>
          </div>
        ) : (
          <LearnEmptyState
            icon={Target}
            title="No quests today"
            description="Check back soon for quick challenges."
            className="py-8"
          />
        )}
      </LearnSection>
    </LearnPanel>
  </>
  );

  return (
    <LearnPageShell navId="overview" contentClassName="min-w-0">
      <LearnPageBody>
        <LearnExploreLayout
          main={
            <div className="space-y-5">
              {/* Purpose: one clear next step */}
              <LearnPanel className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-card">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="size-14 overflow-hidden rounded-2xl bg-muted ring-2 ring-primary/15">
                        {profile.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                        ) : (
                          <BitmojiAvatar gender={profile.gender} size="md" />
                        )}
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {level}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Your journey
                      </p>
                      <h2 className="truncate text-lg font-bold">{profile.breakName || "Citizen"}</h2>
                      <p className="text-xs text-muted-foreground">
                        {profile.county || "Kenya"} · {points} XP · Level {level}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" className="rounded-xl font-semibold">
                      <Link href={currentStage ? `/learn/modules/${currentStage.slug}` : learnTabToHref("learn")}>
                        <Play className="mr-1.5 size-3.5" fill="currentColor" />
                        {isNewUser ? "Start first module" : "Continue learning"}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link href={Routes.LearnQuests}>
                        <ListChecks className="mr-1.5 size-3.5" />
                        Quests
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="size-3 text-amber-500" />
                      {streak} day streak
                    </span>
                    <span>{xpIntoLevel}/100 to Level {level + 1}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700 w-[var(--p)]"
                      style={{ "--p": `${xpIntoLevel}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              </LearnPanel>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <LearnStatTile label="Total XP" value={points} icon={Sparkles} />
                <LearnStatTile label="Streak" value={streak} icon={Flame} tone="warm" />
                <LearnStatTile
                  label="Badges"
                  value={isNewUser ? "—" : earnedBadges}
                  icon={Award}
                  tone="success"
                />
                <LearnStatTile
                  label="Rank"
                  value={userRank ? `#${userRank}` : "—"}
                  icon={Trophy}
                  tone="accent"
                />
              </div>

              {!isNewUser && currentStage && resume && resume.pct > 0 ? (
                <LearnSection title="Resume" hint="Pick up where you left off">
                  <motion.button
                    type="button"
                    onClick={() => router.push(`/learn/modules/${currentStage.slug}`)}
                    className="group flex w-full items-stretch gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left ring-1 ring-border/30 transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-24">
                      {currentStage.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentStage.image_url}
                          alt=""
                          className="size-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-2xl">
                          {currentStage.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          In progress
                        </p>
                        <h3 className="line-clamp-1 text-sm font-bold">{currentStage.title}</h3>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground">
                          {currentStage.description}
                        </p>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                          <span>
                            {resume.completed}/{resume.total} steps
                          </span>
                          <span>{resume.pct}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary w-[var(--p)]"
                            style={{ "--p": `${resume.pct}%` } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground group-hover:text-primary" />
                  </motion.button>
                </LearnSection>
              ) : null}

              {isNewUser ? (
                <LearnEmptyState
                  icon={BookOpen}
                  title="Welcome to Budget Ndio Story"
                  description="Learn how Kenya's budget works — from national allocations to county spending."
                  action={
                    <Button asChild size="sm" className="rounded-xl">
                      <Link href={learnTabToHref("learn")}>
                        <Play className="mr-1.5 size-3" fill="currentColor" />
                        Browse modules
                      </Link>
                    </Button>
                  }
                />
              ) : null}

              <LearnSection title="Your modules" hint="Principle: Simplicity">
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {moduleProgress.map(({ stage, pct, done }) => (
                    <button
                      key={stage.slug}
                      type="button"
                      onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                      className="group flex w-16 shrink-0 flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    >
                      <div
                        className={cn(
                          "relative size-14 overflow-hidden rounded-full ring-2 transition-transform group-hover:scale-105",
                          done ? "ring-emerald-500/50" : pct > 0 ? "ring-primary/40" : "ring-border",
                        )}
                      >
                        {stage.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={stage.image_url} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="flex size-full items-center justify-center bg-muted text-lg">
                            {stage.badge}
                          </span>
                        )}
                      </div>
                      <span className="max-w-14 truncate text-center text-[9px] font-semibold text-muted-foreground">
                        {stage.badgeName || stage.title}
                      </span>
                    </button>
                  ))}
                </div>
              </LearnSection>

              {!tasksLoading && citizenTasks.length > 0 ? (
                <LearnSection title="Action items" hint="Citizen tasks from your county">
                  <LearnCardGrid columns={2}>
                    {citizenTasks.map((task) => (
                      <LearnPanel key={task.id} padding="sm" className="!p-3">
                        <div className="flex items-start gap-2">
                          <div
                            className={cn(
                              "mt-1 size-2 shrink-0 rounded-full",
                              task.priority === "high" || task.priority === "urgent"
                                ? "bg-destructive"
                                : task.priority === "medium"
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground/40",
                            )}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight">{task.title}</p>
                            {task.due_date ? (
                              <p className="mt-0.5 text-[10px] text-muted-foreground">
                                Due {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </LearnPanel>
                    ))}
                  </LearnCardGrid>
                </LearnSection>
              ) : null}
            </div>
          }
          aside={aside}
        />
      </LearnPageBody>
    </LearnPageShell>
  );
}
