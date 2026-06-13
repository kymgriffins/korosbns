"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import {
  Flame, Award, BookOpen, Trophy, Target,
  Newspaper, ArrowRight, CircleUser, Zap, TrendingUp,
  Users, Star, ChevronRight, Video
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { LearnStatCard } from "./learn-stat-card";
import { LearnSectionHeader } from "./learn-section-header";
import { LearnProgressBar } from "./learn-progress-bar";
import type { CivicModule } from "@/types/learn";
import type { LeaderboardEntry } from "@/types/gamification";
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
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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

export function LearnDashboardView({
  profile, stages, currentStage, onSelectStage, onNavigateToCurriculum, onNavigateToForum, leaderboard,
}: LearnDashboardViewProps) {
  const totalBadges = profile.badges?.length || 0;

  const leaderboardEntries = useMemo(() => {
    const entries = (leaderboard ?? []).slice(0, 8).map((entry, i) => ({
      name: entry.name ?? "Anonymous",
      points: entry.points,
      rank: entry.rank ?? i + 1,
      isUser: profile?.breakName?.toLowerCase() === (entry.name ?? "").toLowerCase(),
      avatar_url: entry.avatar_url,
    }));
    return entries;
  }, [leaderboard, profile]);

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-2 max-w-6xl mx-auto p-3 md:p-4 pb-20"
    >
      {/* Hero — compact card */}
      <motion.div variants={itemVars} className="bg-card rounded-xl p-3 ring-1 ring-border/40 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border/40">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-full object-cover" />
            ) : (
              <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black truncate">{profile.breakName || "Citizen"}</h1>
              <span className="size-1 rounded-full bg-muted-foreground/30 shrink-0" />
              <span className="text-[10px] font-semibold text-muted-foreground truncate">{profile.county || "Kenya"}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/70 font-medium">
              Lv.{Math.floor((profile.sovereigns || 0) / 100) + 1} &middot; {profile.sovereigns || 0} XP
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 rounded-lg px-2 py-1 ring-1 ring-amber-500/20 shrink-0">
          <Flame className="size-3 text-amber-500" fill="currentColor" />
          <span className="text-xs font-black tabular-nums text-amber-600">{profile.streakDays || 0}</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        <LearnStatCard label="Modules" value={profile.stageProgress?.length || 0} icon={BookOpen} accent="blue" />
        <LearnStatCard label="Badges" value={`${totalBadges}/${stages.length}`} icon={Award} accent="emerald" />
        <LearnStatCard
          label="Goal"
          value={profile.streakDays > 0 ? "Met ✓" : "Pending"}
          icon={Target}
          accent={profile.streakDays > 0 ? "emerald" : "orange"}
        />
        <LearnStatCard
          label="Rank"
          value={leaderboard?.find(l => l.name === profile.breakName)?.rank ? `#${leaderboard?.find(l => l.name === profile.breakName)?.rank}` : "—"}
          icon={Trophy}
          accent="amber"
        />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-2">

        {/* ===== LEFT ===== */}
        <div className="space-y-2 min-w-0">

          {/* Stories */}
          <motion.div variants={itemVars}>
            <Card className="shadow-xs">
              <CardContent className="p-3">
                <LearnSectionHeader label="Stories" icon={CircleUser} className="mb-2" />
                <div className="flex gap-2.5 overflow-x-auto pb-0.5 scrollbar-hide">
                  {stages.map((stage, i) => (
                    <button
                      key={stage.slug}
                      onClick={() => onSelectStage(stage)}
                      aria-label={`Open ${stage.badgeName || stage.title} module`}
                      className="flex flex-col items-center gap-1 shrink-0 group focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-0.5"
                    >
                      <div className={cn(
                        "size-13 rounded-full p-[2.5px] bg-gradient-to-br",
                        gradientRing(i),
                        "group-hover:scale-105 transition-transform"
                      )}>
                        <div className="size-full rounded-full bg-card flex items-center justify-center text-lg">
                          <span role="img" aria-label={stage.badgeName ?? stage.title}>{stage.badge}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground truncate max-w-13 text-center leading-tight">
                        {stage.badgeName || stage.title}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Modules grid */}
          <motion.div variants={itemVars} className="space-y-1.5">
            <LearnSectionHeader
              label="Learning Modules"
              icon={Newspaper}
              action={{ label: "View All", onClick: onNavigateToCurriculum }}
              className="px-0.5"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {stages.slice(0, 6).map((stage) => (
                <button
                  key={stage.slug}
                  onClick={() => onSelectStage(stage)}
                  aria-label={`Open ${stage.title} module`}
                  className="group bg-card rounded-xl overflow-hidden ring-1 ring-border/40 hover:shadow-sm hover:ring-primary/20 transition-all text-left w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold bg-white/20 backdrop-blur text-white ring-1 ring-white/20 leading-tight">
                        {stage.badgeName || stage.badge}
                      </span>
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/30 backdrop-blur rounded-full px-1.5 py-0.5 text-xs text-white/80">
                      <Video className="size-2.5" aria-hidden />
                      {stage.steps?.length || 0} videos
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <h3 className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {stage.description}
                    </p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs text-muted-foreground/60">{stage.author?.name ?? stage.archive ?? "BNS"}</span>
                      <span className="text-xs text-muted-foreground/60">{stage.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard + Quests */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-2">
            <motion.div variants={itemVars}>
              <Card className="shadow-xs">
                <CardHeader className="px-3 pt-3 pb-1.5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                      <Trophy className="size-3.5 text-amber-500" aria-hidden /> Top Citizens
                    </CardTitle>
                    <button
                      onClick={onNavigateToForum}
                      aria-label="View all citizens"
                      className="text-xs font-semibold text-primary/70 hover:text-primary uppercase tracking-wide focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      All
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="space-y-0.5 max-h-[220px] overflow-y-auto">
                    {leaderboardEntries.length > 0 ? (
                      leaderboardEntries.map((entry, i) => (
                        <div
                          key={entry.name ?? i}
                          className={cn(
                            "flex items-center justify-between py-1 px-2 rounded-lg transition-colors",
                            entry.isUser ? "bg-primary/5 ring-1 ring-primary/15" : "hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span aria-label={`Rank ${entry.rank}`} className={cn(
                              "w-4 text-center text-xs font-black",
                              entry.rank === 1 ? "text-amber-500" :
                              entry.rank === 2 ? "text-slate-400" :
                              entry.rank === 3 ? "text-orange-500" :
                              "text-muted-foreground"
                            )}>
                              {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
                            </span>
                            <div className="size-5 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border/40">
                              {entry.avatar_url ? (
                                <img src={entry.avatar_url} alt="" className="size-full object-cover" />
                              ) : (
                                <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                              )}
                            </div>
                            <span className="text-xs font-semibold truncate">{entry.name}</span>
                          </div>
                          <span className="text-xs font-semibold tabular-nums text-muted-foreground shrink-0">{entry.points} XP</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-xs text-muted-foreground">No citizens yet. Start learning!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVars}>
              <Card className="shadow-xs">
                <CardHeader className="px-3 pt-3 pb-1.5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Zap className="size-3.5 text-amber-500" aria-hidden /> Quests
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="space-y-1.5">
                    {quests.map((quest) => (
                      <div key={quest.title} className="flex items-start gap-1.5 p-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className={cn("size-6 rounded-md flex items-center justify-center shrink-0", quest.bg)}>
                          <quest.icon className={cn("size-3", quest.color)} aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold leading-tight">{quest.title}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{quest.desc}</p>
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-primary shrink-0">+{quest.xp}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="ghost" size="sm" className="w-full mt-1 h-7 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring">
                    <Link href={Routes.LearnQuests}>All <ChevronRight className="size-3 ml-0.5" aria-hidden /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR — Analytics ===== */}
        <div className="space-y-2">
          <motion.div variants={itemVars}>
            <Card className="shadow-xs">
              <CardHeader className="px-3 pt-3 pb-1.5">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-primary" aria-hidden /> Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-1">
                {[
                  { label: "Total XP",  value: profile.sovereigns || 0,               accent: "blue",    icon: TrendingUp },
                  { label: "Badges",    value: `${totalBadges}/${stages.length}`,      accent: "emerald", icon: Award      },
                  { label: "Level",     value: Math.floor((profile.sovereigns || 0) / 100) + 1, accent: "purple", icon: Star },
                  { label: "Streak",    value: `${profile.streakDays || 0} days`,      accent: "amber",   icon: Flame      },
                  { label: "Modules",   value: profile.stageProgress?.length || 0,    accent: "rose",    icon: Users      },
                ].map((stat) => (
                  <LearnStatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    accent={stat.accent as any}
                    size="sm"
                    className="border-0 shadow-none hover:bg-muted/20 transition-colors"
                  />
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* XP Progress */}
          <motion.div variants={itemVars}>
            <Card className="shadow-xs">
              <CardContent className="p-3">
                <LearnProgressBar
                  value={(profile.sovereigns || 0) % 100}
                  max={100}
                  label={`Level progress: ${(profile.sovereigns || 0) % 100} / 100 XP`}
                  showLabel
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
