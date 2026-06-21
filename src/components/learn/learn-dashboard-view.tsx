"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import {
  Flame, Award, BookOpen, Trophy, Zap, ArrowRight,
  ChevronRight, Play, Sparkles, Crown, CircleUser, Newspaper,
  MessageSquare, BrainCircuit, ListChecks, Quote,
} from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import type { LeaderboardEntry } from "@/types/gamification";
import { useGamificationMe } from "@/hooks/use-gamification";
import { readProgress } from "@/lib/module-progress";
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const gradientRing = (i: number) => {
  const palettes = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-violet-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-sky-500 to-indigo-500",
  ];
  return palettes[i % palettes.length];
};

const quests = [
  { title: "Daily Trivia", desc: "Answer 5 budget questions", xp: 50, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Read & Earn", desc: "Read 1 article today", xp: 30, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Streak Boost", desc: "3-day streak bonus", xp: 100, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
];

const QUOTES = [
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "The art of taxation consists in plucking the goose as to obtain the largest amount of feathers with the least possible amount of hissing.", author: "Jean-Baptiste Colbert" },
  { text: "The budget is not just a collection of numbers, but an expression of our values and aspirations.", author: "Jack Lew" },
  { text: "Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness. Annual income twenty pounds, annual expenditure twenty pounds ought and six, result misery.", author: "Charles Dickens" },
  { text: "The best way to teach your kids about money is to not have any.", author: "Dave Chappelle" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "In the private sector, if you don't balance your budget, you go bankrupt. In government, if you don't balance your budget, you get reelected.", author: "P. J. O'Rourke" },
  { text: "Balancing the budget is like protecting your virtue. You have to learn to say no.", author: "Ronald Reagan" },
  { text: "The taxpayer: that's someone who works for the federal government but doesn't have to take the civil service examination.", author: "Ronald Reagan" },
  { text: "Governments don't have any money — they only have the money they take from you.", author: "Thomas Sowell" },
  { text: "The most important budgeting is the budgeting of your time and energy.", author: "Brian Tracy" },
  { text: "A budget doesn't limit your freedom; it gives you freedom.", author: "Unknown" },
];

const quoteOfDay = QUOTES[new Date().getDate() % QUOTES.length];

export function LearnDashboardView({
  profile, stages, currentStage, onSelectStage, onNavigateToCurriculum, onNavigateToForum, leaderboard,
}: LearnDashboardViewProps) {
  const router = useRouter();
  const { data: gamification } = useGamificationMe();

  const points = gamification?.points ?? profile.sovereigns ?? 0;
  const level = gamification?.level ?? Math.floor(points / 100) + 1;
  const streak = gamification?.streak_days ?? profile.streakDays ?? 0;
  const earnedBadges = gamification?.badges?.length ?? profile.badges?.length ?? 0;
  const xpIntoLevel = points % 100;

  const userRank = leaderboard?.find((l) => l.name === profile.breakName)?.rank ?? null;

  // Resume target: progress within the current stage.
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

  const statTiles = [
    { label: "Total XP", value: points, icon: Sparkles, color: "text-primary", bg: "bg-primary/8 ring-primary/15" },
    { label: "Day streak", value: streak, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/8 ring-orange-500/15" },
    { label: "Badges", value: `${earnedBadges}`, icon: Award, color: "text-emerald-600", bg: "bg-emerald-500/8 ring-emerald-500/15" },
    { label: "Rank", value: userRank ? `#${userRank}` : "—", icon: Trophy, color: "text-amber-600", bg: "bg-amber-500/8 ring-amber-500/15" },
  ];

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl space-y-3 p-3 md:p-5 pb-24"
    >
      {/* Hero */}
      <motion.div
        variants={itemVars}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-primary/65 p-4 text-primary-foreground shadow-md md:p-5"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="size-12 overflow-hidden rounded-full bg-white/15 ring-2 ring-white/30">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                ) : (
                  <BitmojiAvatar gender={profile.gender as "male" | "female"} size="md" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-white px-1 text-[10px] font-black text-primary">
                {level}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Welcome back</p>
              <h1 className="truncate text-lg font-black leading-tight md:text-xl">{profile.breakName || "Citizen"}</h1>
              <p className="truncate text-[11px] font-semibold text-white/75">{profile.county || "Kenya"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 ring-1 ring-white/20">
              <Flame className="size-4 text-amber-300" fill="currentColor" />
              <span className="text-sm font-black tabular-nums">{streak}</span>
              <span className="text-[10px] font-bold text-white/70">days</span>
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="mb-1 flex justify-between text-[10px] font-bold text-white/75">
            <span>{points} XP</span>
            <span>{xpIntoLevel}/100 to Level {level + 1}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 w-[var(--progress)]"
              style={{ "--progress": `${xpIntoLevel}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVars} className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {statTiles.map((stat) => (
          <div key={stat.label} className={cn("flex items-center gap-2.5 rounded-xl bg-card p-3 shadow-xs ring-1", stat.bg)}>
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/60", stat.color)}>
              <stat.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold leading-tight text-muted-foreground">{stat.label}</p>
              <p className="text-base font-black leading-tight tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions & Quote */}
      <motion.div variants={itemVars} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button asChild variant="default" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
            <Link href={currentStage ? `/learn/modules/${currentStage.slug}` : Routes.Learn}>
              <Play className="mr-1 size-3" fill="currentColor" /> Start Learning
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
            <Link href="/learn/analytics">
              <BrainCircuit className="mr-1 size-3" /> View Analytics
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
            <Link href={Routes.LearnForum}>
              <MessageSquare className="mr-1 size-3" /> Discussions
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
            <Link href={Routes.LearnQuests}>
              <ListChecks className="mr-1 size-3" /> Quests
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 ring-1 ring-border/40 sm:max-w-[260px]">
          <Quote className="size-3 shrink-0 text-primary/40" />
          <p className="text-[10px] leading-tight text-muted-foreground">
            &ldquo;{quoteOfDay.text}&rdquo;
            <span className="block text-[9px] text-muted-foreground/60">&mdash; {quoteOfDay.author}</span>
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_300px]">
        {/* ===== LEFT ===== */}
        <div className="min-w-0 space-y-3">
          {/* Continue learning */}
          {currentStage && resume && (
            <motion.button
              variants={itemVars}
              onClick={() => router.push(`/learn/modules/${currentStage.slug}`)}
              className="group relative flex w-full items-stretch gap-3 overflow-hidden rounded-2xl bg-card p-3 text-left shadow-xs ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Play className="size-3" fill="currentColor" /> {resume.pct > 0 ? "Continue learning" : "Start learning"}
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

          {/* Stories strip */}
          <motion.div variants={itemVars} className="rounded-2xl bg-card p-3 shadow-xs ring-1 ring-border/40">
            <h2 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <CircleUser className="size-3 text-primary" /> Jump to a module
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {stages.map((stage, i) => (
                <button
                  key={stage.slug}
                  onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                  className="group flex shrink-0 flex-col items-center gap-1 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className={cn("size-14 overflow-hidden rounded-full bg-gradient-to-br p-[2.5px] transition-transform group-hover:scale-105", stage.image_url ? "from-border to-border" : gradientRing(i))}>
                    <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-card">
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
              ))}
            </div>
          </motion.div>

          {/* Modules grid */}
          <motion.div variants={itemVars} className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Newspaper className="size-3 text-primary" /> Learning Modules
              </h2>
              <button
                onClick={onNavigateToCurriculum}
                className="rounded text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stages.slice(0, 6).map((stage) => (
                <button
                  key={stage.slug}
                  onClick={() => router.push(`/learn/modules/${stage.slug}`)}
                  className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-card text-left ring-1 ring-border/40 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {stage.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={stage.image_url} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted text-2xl">{stage.badge}</div>
                    )}
                  </div>
                  <div className="space-y-1 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground bg-muted/60">
                        {stage.badgeName || stage.badge}
                      </span>
                      {stage.steps?.length ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
                          <BookOpen className="size-2.5" /> {stage.steps.length}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="line-clamp-2 text-xs font-bold leading-tight transition-colors group-hover:text-primary">{stage.title}</h3>
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">{stage.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="space-y-3">
          {/* Leaderboard */}
          <motion.div variants={itemVars} className="rounded-2xl bg-card p-3.5 shadow-xs ring-1 ring-border/40">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[11px] font-bold">
                <Crown className="size-3.5 text-amber-500" /> Top Citizens
              </h3>
              {onNavigateToForum && (
                <button onClick={onNavigateToForum} className="rounded text-[10px] font-bold uppercase tracking-wider text-primary/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                      entry.isUser ? "bg-primary/5 ring-1 ring-primary/15" : "hover:bg-muted/40",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cn(
                        "w-5 text-center text-[11px] font-black",
                        entry.rank === 1 ? "text-amber-500" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-orange-500" : "text-muted-foreground",
                      )}>
                        {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                      </span>
                      <div className="size-6 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/40">
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

          {/* Daily quests */}
          <motion.div variants={itemVars} className="rounded-2xl bg-card p-3.5 shadow-xs ring-1 ring-border/40">
            <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold">
              <Zap className="size-3.5 text-amber-500" /> Daily Quests
            </h3>
            <div className="space-y-1.5">
              {quests.map((quest) => (
                <div key={quest.title} className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/30">
                  <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", quest.bg)}>
                    <quest.icon className={cn("size-3.5", quest.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold leading-tight">{quest.title}</p>
                    <p className="text-[9px] leading-tight text-muted-foreground">{quest.desc}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold tabular-nums text-primary">+{quest.xp}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" size="sm" className="mt-1.5 h-7 w-full text-[10px] font-bold focus-visible:ring-2 focus-visible:ring-ring">
              <Link href={Routes.LearnQuests}>
                All quests <ChevronRight className="ml-0.5 size-3" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
