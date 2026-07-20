"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Award,
  BookOpen,
  Trophy,
  Zap,
  ArrowRight,
  ChevronRight,
  Play,
  Crown,
  MessageSquare,
  ListChecks,
  Target,
  CheckCircle2,
  Loader2,
  ClipboardList,
  Sparkles,
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
import { learnTabToHref } from "@/lib/learn-nav";
import { cn } from "@/utils";
import { getModuleEmoji } from "@/lib/learn-module-display";

interface LearnDashboardViewProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onNavigateToCurriculum: () => void;
  onNavigateToForum?: () => void;
  leaderboard?: LeaderboardEntry[];
}

function ScoreStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3 text-center sm:py-4">
      <Icon className="size-3.5 text-muted-foreground/70" aria-hidden />
      <p className="font-heading text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {value}
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {hint ? (
        <p className="text-[10px] text-muted-foreground/70">{hint}</p>
      ) : null}
    </div>
  );
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
        const published = (Array.isArray(tasks) ? tasks : []).filter(
          (t) => t.status === "published",
        );
        setCitizenTasks(published.slice(0, 5));
      })
      .catch(() => {
        setCitizenTasks([]);
      })
      .finally(() => setTasksLoading(false));
  }, []);

  const points = gamification?.points ?? profile.sovereigns ?? 0;
  const level = gamification?.level ?? Math.floor(points / 100) + 1;
  const streak = gamification?.streak_days ?? profile.streakDays ?? 0;
  const earnedBadges = gamification?.badges?.length ?? profile.badges?.length ?? 0;
  const xpIntoLevel = points % 100;
  const xpToNext = 100 - xpIntoLevel;

  const userRank = leaderboard?.find((l) => l.name === profile.breakName)?.rank ?? null;
  const isNewUser = points === 0 && !currentStage;

  const resume = useMemo(() => {
    if (!currentStage) return null;
    const p = readProgress(currentStage.slug, currentStage.order);
    const total = currentStage.steps?.length || 0;
    const completed = total
      ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length
      : 0;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct, currentStep: p.currentStep || 1 };
  }, [currentStage]);

  const leaderboardEntries = useMemo(() => {
    return (leaderboard ?? []).slice(0, 8).map((entry, i) => ({
      name: entry.name ?? "Anonymous",
      points: entry.points,
      rank: entry.rank ?? i + 1,
      isUser:
        profile?.breakName?.toLowerCase() === (entry.name ?? "").toLowerCase(),
      avatar_url: entry.avatar_url,
    }));
  }, [leaderboard, profile]);

  const moduleProgress = useMemo(() => {
    const map = new Map<string, { completed: number; total: number; pct: number }>();
    for (const stage of stages) {
      const p = readProgress(stage.slug, stage.order);
      const total = stage.steps?.length || 0;
      const completed = total
        ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length
        : 0;
      map.set(stage.slug, {
        total,
        completed,
        pct: total ? Math.round((completed / total) * 100) : 0,
      });
    }
    return map;
  }, [stages]);

  const quests =
    questsData && questsData.length > 0
      ? questsData.map((q) => ({
          title: q.title,
          desc: (q as any).description ?? q.title,
          xp: (q as any).xp ?? 0,
          done: Boolean((q as any).completed || (q as any).is_completed),
        }))
      : [];

  const primaryHref = currentStage
    ? `/learn/modules/${currentStage.slug}`
    : Routes.Learn;
  const primaryLabel = isNewUser
    ? "Start your first module"
    : resume?.pct
      ? "Continue learning"
      : "Start learning";

  return (
    <div className="w-full space-y-8 py-10 sm:py-14">
      {/* ── Identity + level ─────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="size-14 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 sm:size-16">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <BitmojiAvatar
                    gender={profile.gender as "male" | "female"}
                    size="md"
                  />
                )}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background">
                {level}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Learning hub
              </p>
              <h1 className="truncate font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {profile.breakName || "Citizen"}
              </h1>
              <p className="truncate text-sm text-muted-foreground">
                {profile.county || "Kenya"}
                {streak > 0 ? ` · ${streak}-day streak` : ""}
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden h-9 shrink-0 rounded-xl sm:inline-flex"
          >
            <Link href={learnTabToHref("forum")}>
              <MessageSquare className="mr-1.5 size-3.5" />
              Forum
            </Link>
          </Button>
        </div>

        {/* Level progress — full width, not a card */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="font-semibold tabular-nums text-foreground">
              {points.toLocaleString()} XP
            </span>
            <span className="text-muted-foreground">
              {xpToNext} XP to Level {level + 1}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${xpIntoLevel}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="h-11 flex-1 rounded-xl text-sm font-bold">
            <Link href={primaryHref}>
              <Play className="mr-2 size-4" fill="currentColor" />
              {primaryLabel}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 rounded-xl text-sm font-bold sm:w-auto"
          >
            <Link href={Routes.LearnQuests}>
              <ListChecks className="mr-2 size-4" />
              Quests
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Scoreboard (replaces poor 4-up cards) ─────────────────────── */}
      <section
        aria-label="Your learning stats"
        className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-transparent"
      >
        <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0">
          <ScoreStat
            label="Total XP"
            value={points.toLocaleString()}
            hint={`Level ${level}`}
            icon={Sparkles}
          />
          <ScoreStat
            label="Day streak"
            value={streak}
            hint={streak === 1 ? "day" : "days"}
            icon={Flame}
          />
          <ScoreStat
            label="Badges"
            value={earnedBadges}
            hint={earnedBadges === 0 ? "earn your first" : "earned"}
            icon={Award}
          />
          <ScoreStat
            label="Rank"
            value={userRank ? `#${userRank}` : "—"}
            hint={userRank ? "on board" : "unranked"}
            icon={Trophy}
          />
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8">
          {/* Continue / welcome */}
          {!isNewUser && currentStage && resume && resume.pct > 0 ? (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold tracking-tight">
                    Pick up where you left off
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Chapter {resume.currentStep} · {resume.pct}% complete
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/learn/modules/${currentStage.slug}`)}
                className="group flex w-full overflow-hidden rounded-2xl border border-border/70 bg-card text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] w-28 shrink-0 bg-muted sm:w-36">
                  {currentStage.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentStage.image_url}
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 text-3xl">
                      {getModuleEmoji(currentStage.badge)}
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Continue
                    </p>
                    <h3 className="line-clamp-2 font-heading text-base font-bold leading-snug">
                      {currentStage.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {currentStage.description}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>
                        {resume.total > 0
                          ? `${resume.completed}/${resume.total} chapters`
                          : "No chapters"}
                      </span>
                      <span>{resume.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${resume.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <ArrowRight className="mr-4 size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            </section>
          ) : isNewUser ? (
            <section className="rounded-2xl border border-dashed border-primary/35 bg-primary/[0.04] px-5 py-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="size-6 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold tracking-tight">
                Welcome to Budget Ndio Story
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Learn how Kenya&apos;s budget works — from national allocations to
                county spending. Start with your first module.
              </p>
              <Button asChild className="mt-5 h-10 rounded-xl font-bold">
                <Link href={Routes.Learn}>
                  <Play className="mr-1.5 size-3.5" fill="currentColor" />
                  Start your first module
                </Link>
              </Button>
            </section>
          ) : null}

          {/* Module path */}
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold tracking-tight">
                  Your learning path
                </h2>
                <p className="text-sm text-muted-foreground">
                  {stages.length} modules · jump in anywhere
                </p>
              </div>
              <Link
                href={learnTabToHref("learn")}
                className="inline-flex items-center text-xs font-bold text-primary hover:underline"
              >
                See all
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {stages.slice(0, 6).map((stage) => {
                const prog = moduleProgress.get(stage.slug);
                const isComplete = prog && prog.total > 0 && prog.pct >= 100;
                const isStarted = prog && prog.pct > 0 && prog.pct < 100;
                return (
                  <button
                    key={stage.slug}
                    type="button"
                    onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                    className="group flex w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                  >
                    <div className="relative aspect-[16/10] bg-muted">
                      {stage.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={stage.image_url}
                          alt=""
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-2xl">
                          {getModuleEmoji(stage.badge)}
                        </div>
                      )}
                      {isComplete ? (
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-500 p-0.5 text-white shadow">
                          <CheckCircle2 className="size-3.5" />
                        </span>
                      ) : isStarted ? (
                        <span className="absolute right-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                          {prog?.pct}%
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-1 p-3">
                      <h3 className="line-clamp-2 text-xs font-bold leading-snug group-hover:text-primary">
                        {stage.title}
                      </h3>
                      {prog && prog.total > 0 ? (
                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isComplete ? "bg-emerald-500" : "bg-primary",
                            )}
                            style={{ width: `${prog.pct}%` }}
                          />
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">Not started</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Action items */}
          {(citizenTasks.length > 0 || tasksLoading) && (
            <section className="space-y-3">
              <h2 className="font-heading text-lg font-bold tracking-tight">
                Action items
              </h2>
              {tasksLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70">
                  {citizenTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                    >
                      <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">
                          {task.title}
                        </p>
                        {task.due_date ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Due {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "mt-1 size-2 shrink-0 rounded-full",
                          task.priority === "high" || task.priority === "urgent"
                            ? "bg-destructive"
                            : task.priority === "medium"
                              ? "bg-amber-500"
                              : "bg-muted-foreground/40",
                        )}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {/* ── Side rail ──────────────────────────────────────────────── */}
        <aside className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 font-heading text-base font-bold">
                <Zap className="size-4 text-amber-500" />
                Daily quests
              </h2>
              <Link
                href={Routes.LearnQuests}
                className="text-[11px] font-bold text-muted-foreground hover:text-foreground"
              >
                All
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {questsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : quests.length > 0 ? (
                <ul className="divide-y divide-border/60">
                  {quests.map((quest, i) => (
                    <li
                      key={quest.title + i}
                      className="flex items-start gap-3 px-3.5 py-3"
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                          quest.done
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600",
                        )}
                      >
                        {quest.done ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <Target className="size-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-snug">
                          {quest.title}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                          {quest.desc}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] font-bold tabular-nums text-primary">
                        +{quest.xp}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <Target className="size-5 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">
                    No quests yet — check back soon.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 font-heading text-base font-bold">
                <Crown className="size-4 text-amber-500" />
                Top citizens
              </h2>
              {onNavigateToForum ? (
                <button
                  type="button"
                  onClick={onNavigateToForum}
                  className="text-[11px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Forum
                </button>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {leaderboardEntries.length > 0 ? (
                <ol className="divide-y divide-border/60">
                  {leaderboardEntries.map((entry, i) => (
                    <li
                      key={entry.name ?? i}
                      className={cn(
                        "flex items-center justify-between gap-2 px-3.5 py-2.5",
                        entry.isUser && "bg-primary/5",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={cn(
                            "w-4 text-center text-xs font-bold tabular-nums",
                            entry.rank === 1
                              ? "text-amber-500"
                              : "text-muted-foreground",
                          )}
                        >
                          {entry.rank}
                        </span>
                        <div className="size-7 shrink-0 overflow-hidden rounded-full bg-muted">
                          {entry.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={entry.avatar_url}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <BitmojiAvatar
                              gender={i % 2 === 0 ? "female" : "male"}
                              size="sm"
                            />
                          )}
                        </div>
                        <span className="truncate text-xs font-bold">
                          {entry.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground">
                        {entry.points} XP
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No citizens yet. Start learning!
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
