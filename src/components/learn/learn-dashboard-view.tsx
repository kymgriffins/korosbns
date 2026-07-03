"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Trophy, ChevronRight, Play, CircleUser,
  MessageSquare, ListChecks, CheckCircle2, Loader2, ClipboardList,
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
import { resolveGamification, formatSovereignGain, SOVEREIGN_SHORT } from "@/lib/learn-gamification";
import { SovereignSealGlyph } from "./learn-chamber-ui";

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
      setCitizenTasks(published.slice(0, 3));
    }).catch(() => {
      setCitizenTasks([]);
    }).finally(() => setTasksLoading(false));
  }, []);

  const { points, streak } = resolveGamification(profile, gamification ?? undefined);
  const isNewUser = points === 0 && !currentStage;

  const resume = useMemo(() => {
    if (!currentStage) return null;
    const p = readProgress(currentStage.slug, currentStage.order);
    const total = currentStage.steps?.length || 0;
    const completed = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct, currentStep: p.currentStep || 1 };
  }, [currentStage]);

  const leaderboardEntries = useMemo(
    () => (leaderboard ?? []).slice(0, 5),
    [leaderboard],
  );

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

  const quests = questsData && questsData.length > 0 ? questsData.slice(0, 3) : [];

  return (
    <LearnStage>
      <div className="space-y-5">
        <LearnChamberHero
          profile={profile}
          currentStage={currentStage}
          resume={resume}
          points={points}
          streak={streak}
          isNewUser={isNewUser}
        />

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold">
            <Link href={Routes.LearnForum}>
              <MessageSquare className="mr-1.5 size-3.5" /> Ask about the budget
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold">
            <Link href={Routes.LearnQuests}>
              <ListChecks className="mr-1.5 size-3.5" /> Daily quests
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={onNavigateToCurriculum}>
            Learning path <ChevronRight className="ml-0.5 size-3.5" />
          </Button>
        </div>

        {isNewUser && (
          <div className="rounded-xl border border-dashed border-[var(--learn-seal-gold)]/40 bg-muted/30 p-5 text-center">
            <BookOpen className="mx-auto mb-2 size-7 text-[var(--learn-seal-gold)]" />
            <h3 className="mb-1 text-sm font-bold">Welcome to the chamber</h3>
            <p className="mx-auto mb-3 max-w-sm text-xs text-muted-foreground">
              Start with your first module on Kenya&apos;s national and county budget process.
            </p>
            <Button asChild size="sm" className="rounded-lg text-xs font-bold">
              <Link href="/learn?tab=modules">
                <Play className="mr-1.5 size-3" fill="currentColor" /> Open learning path
              </Link>
            </Button>
          </div>
        )}

        <section className="rounded-xl border bg-card p-3">
          <h2 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <CircleUser className="size-3 text-[var(--learn-seal-gold)]" /> Learning path
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
                    "relative size-12 overflow-hidden rounded-full p-[2px]",
                    isComplete ? "bg-[var(--learn-vote-green)]/20" : isStarted ? "bg-[var(--learn-seal-gold)]/20" : "bg-muted",
                  )}>
                    {isComplete && (
                      <div className="absolute -top-0.5 -right-0.5 z-10">
                        <CheckCircle2 className="size-3.5 text-[var(--learn-vote-green)]" />
                      </div>
                    )}
                    <div className="relative z-0 flex size-full items-center justify-center overflow-hidden rounded-full bg-card text-base">
                      {stage.badge}
                    </div>
                  </div>
                  <span className="max-w-14 truncate text-center text-[9px] font-semibold leading-tight text-muted-foreground">
                    {stage.badgeName || stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {(leaderboardEntries.length > 0 || quests.length > 0) && (
          <section className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Secondary lanes
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {leaderboardEntries.map((entry, i) => (
                <div
                  key={entry.name ?? i}
                  className="flex min-w-[9rem] shrink-0 flex-col rounded-lg border bg-card/80 p-2.5"
                >
                  <p className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                    <Trophy className="size-3 text-[var(--learn-seal-gold)]" />
                    #{entry.rank ?? i + 1}
                  </p>
                  <p className="truncate text-xs font-semibold">{entry.name ?? "Citizen"}</p>
                  <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {entry.points} {SOVEREIGN_SHORT}
                  </p>
                </div>
              ))}
              {questsLoading ? (
                <div className="flex min-w-[9rem] items-center justify-center rounded-lg border bg-card/80 p-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                quests.map((quest) => {
                  const reward = (quest as { points?: number }).points ?? (quest as { xp?: number }).xp ?? 0;
                  const prereq = (quest as { path_slug?: string }).path_slug;
                  return (
                    <Link
                      key={quest.id}
                      href={Routes.LearnQuests}
                      className="flex min-w-[11rem] shrink-0 flex-col rounded-lg border bg-card/80 p-2.5 transition-colors hover:border-primary/30"
                    >
                      <p className="line-clamp-2 text-xs font-semibold leading-tight">{quest.title}</p>
                      {prereq && (
                        <p className="mt-1 text-[9px] text-muted-foreground">After {prereq.replace(/-/g, " ")}</p>
                      )}
                      <p className="mt-auto flex items-center gap-1 pt-1 font-mono text-[10px] font-bold text-[var(--learn-seal-gold)]">
                        <SovereignSealGlyph />
                        {formatSovereignGain(reward)}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
            {onNavigateToForum && (
              <button
                type="button"
                onClick={onNavigateToForum}
                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Open town hall →
              </button>
            )}
          </section>
        )}

        {!tasksLoading && citizenTasks.length > 0 && (
          <section className="rounded-xl border bg-card/60 p-3">
            <h2 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <ClipboardList className="size-3" /> Civic action items
            </h2>
            <div className="space-y-1">
              {citizenTasks.map((task) => (
                <p key={task.id} className="line-clamp-1 text-[11px] text-muted-foreground">
                  · {task.title}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </LearnStage>
  );
}
