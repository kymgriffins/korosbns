"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import {
  Flame, Award, BookOpen, PlayCircle, Trophy, Activity, Target,
  Newspaper, ArrowRight, CircleUser, Zap, Calendar, TrendingUp,
  Users, Star, BarChart3, Clock, Sparkles, ChevronRight
} from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
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
  leaderboard?: LeaderboardEntry[];
}

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
};

const articles = [
  {
    title: "Kenya's FY 2025/26 Budget Breakdown",
    excerpt: "Deep dive into the revenue allocations, sector priorities, and fiscal projections shaping the next financial year.",
    image: "/articles/budget-breakdown.jpg",
    category: "Budget Analysis",
    readTime: "8 min",
    slug: "budget-breakdown-2025",
    author: "Catherine Wanjiku",
    date: "Jun 8, 2026"
  },
  {
    title: "How County Governments Spend Your Taxes",
    excerpt: "An investigative look at devolved fund utilization, procurement trends, and citizen oversight mechanisms across Kenya's 47 counties.",
    image: "/articles/county-spending.jpg",
    category: "County Finance",
    readTime: "12 min",
    slug: "county-spending-taxes",
    author: "James Ochieng",
    date: "Jun 5, 2026"
  },
  {
    title: "Understanding the Finance Bill 2026",
    excerpt: "A clause-by-clause guide to the proposed tax measures, exemptions, and their impact on households and businesses.",
    image: "/articles/finance-bill.jpg",
    category: "Finance Bill",
    readTime: "6 min",
    slug: "finance-bill-2026-guide",
    author: "Faith Muthoni",
    date: "Jun 2, 2026"
  }
];

const storyItems = [
  { name: "Budget Cycle", emoji: "\uD83D\uDCC8", gradient: "from-purple-500 to-pink-500" },
  { name: "Tax 101", emoji: "\uD83D\uDCB0", gradient: "from-blue-500 to-cyan-500" },
  { name: "County Funds", emoji: "\uD83C\uDFDB\uFE0F", gradient: "from-emerald-500 to-teal-500" },
  { name: "Debt Watch", emoji: "\uD83D\uDCC9", gradient: "from-orange-500 to-red-500" },
  { name: "PPIP Act", emoji: "\uD83D\uDCDD", gradient: "from-indigo-500 to-violet-500" },
  { name: "Senate Budget", emoji: "\uD83C\uDFDB\uFE0F", gradient: "from-rose-500 to-pink-500" },
];

const quests = [
  { title: "Daily Trivia", desc: "Answer 5 budget questions", xp: 50, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Read & Earn", desc: "Read 1 article today", xp: 30, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Streak Boost", desc: "3-day streak bonus", xp: 100, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function LearnDashboardView({
  profile, stages, currentStage, onSelectStage, onNavigateToCurriculum, leaderboard,
}: LearnDashboardViewProps) {
  const chartData = useMemo(() => [
    { day: "S", xp: 0 },
    { day: "M", xp: 120 },
    { day: "T", xp: 80 },
    { day: "W", xp: 300 },
    { day: "T", xp: 50 },
    { day: "F", xp: 200 },
    { day: "S", xp: profile.sovereigns > 0 ? 150 : 0 },
  ], [profile.sovereigns]);

  const chartConfig = { xp: { label: "XP Earned", color: "var(--primary)" } };

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
      className="space-y-3 max-w-7xl mx-auto p-3 md:p-4 pb-20"
    >
      {/* Hero */}
      <motion.div variants={itemVars} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 text-white p-4 md:p-6 shadow-sm">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-12 md:size-14 rounded-full bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black tracking-tight truncate">{profile.breakName || "Citizen"}</h1>
              <p className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                {profile.county || "Kenya"}
                <span className="size-1 rounded-full bg-white/40" />
                Lv.{Math.floor((profile.sovereigns || 0) / 100) + 1}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur rounded-xl px-2.5 py-1.5 border border-white/10 shrink-0">
            <Flame className="size-3.5 md:size-4 text-orange-400" fill="currentColor" />
            <span className="text-sm md:text-lg font-black tabular-nums leading-tight text-white">{profile.streakDays || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Modules", value: profile.stageProgress?.length || 0, suffix: "", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/8" },
          { label: "Badges", value: totalBadges, suffix: `/ ${stages.length}`, icon: Award, color: "text-emerald-600", bg: "bg-emerald-500/8" },
          { label: "Daily Goal", value: profile.streakDays > 0 ? "Goal Met" : "24:00:00", suffix: "", icon: Target, color: profile.streakDays > 0 ? "text-emerald-600" : "text-orange-500", bg: "bg-purple-500/8" },
          { label: "Rank", value: leaderboard?.find(l => l.name === profile.breakName)?.rank ? `#${leaderboard?.find(l => l.name === profile.breakName)?.rank}` : "\u2014", suffix: "", icon: Trophy, color: "text-amber-600", bg: "bg-amber-500/8" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card shadow-xs rounded-xl p-3 flex items-center justify-between gap-2 ring-1 ring-border/40">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-black tabular-nums">{stat.value}</span>
                {stat.suffix && <span className="text-[10px] text-muted-foreground font-semibold">{stat.suffix}</span>}
              </div>
            </div>
            <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-black/[0.02]", stat.bg)}>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main grid: content (left) + stats sidebar (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-3">

        {/* ===== LEFT CONTENT ===== */}
        <div className="space-y-3 min-w-0">

          {/* Next Up */}
          <motion.div variants={itemVars} className="relative rounded-xl p-[1px] bg-gradient-to-r from-primary/15 via-primary/10 to-blue-500/15 shadow-xs">
            <div className="bg-card rounded-[calc(0.75rem-1px)] p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-xl ring-1 ring-primary/20">
                  {currentStage.badge}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-primary tracking-wider">Next Up</p>
                  <h3 className="text-sm font-black truncate">{currentStage.title}</h3>
                  <p className="text-[10px] text-muted-foreground truncate">{currentStage.documentName}</p>
                </div>
              </div>
              <Button onClick={() => onSelectStage(currentStage)} size="sm" className="rounded-lg h-8 px-3 font-bold text-xs shrink-0 focus-visible:ring-2 focus-visible:ring-ring">
                <PlayCircle className="size-3.5 mr-1" /> Start
              </Button>
            </div>
          </motion.div>

          {/* Articles overview — 3 story-format cards */}
          <motion.div variants={itemVars} className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold flex items-center gap-1.5 text-foreground/80">
                <Newspaper className="size-3.5 text-primary" /> Latest Articles
              </h2>
              <Link
                href={Routes.LearnArticles}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                View All <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`${Routes.Learn}/${article.slug}`}
                  className="group bg-card shadow-xs rounded-xl overflow-hidden ring-1 ring-border/40 hover:shadow-md hover:ring-primary/20 transition-all"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 backdrop-blur text-white ring-1 ring-white/20">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/30 backdrop-blur rounded-full px-1.5 py-0.5 text-[9px] text-white/80">
                      <Clock className="size-2.5" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1.5">
                    <h3 className="text-[11px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] text-muted-foreground/60">{article.author}</span>
                      <span className="text-[9px] text-muted-foreground/60">{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stories UI — Instagram-like */}
          <motion.div variants={itemVars} className="space-y-2">
            <h2 className="text-xs font-bold flex items-center gap-1.5 text-foreground/80">
              <CircleUser className="size-3.5 text-primary" /> Stories
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {storyItems.map((story, i) => (
                <button
                  key={story.name}
                  className="flex flex-col items-center gap-1 shrink-0 group focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
                >
                  <div className={cn(
                    "size-14 rounded-full p-[2px] bg-gradient-to-br",
                    story.gradient,
                    "group-hover:scale-105 transition-transform"
                  )}>
                    <div className="size-full rounded-full bg-card flex items-center justify-center text-xl">
                      {story.emoji}
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-muted-foreground truncate max-w-14 text-center">
                    {story.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard (3/4) + Daily Quests (1/4) */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-3">

            {/* Leaderboard */}
            <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 ring-1 ring-border/40">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <Trophy className="size-3.5 text-amber-500" /> Top Citizens
                </h3>
                <Link href={Routes.LearnForum} className="text-[10px] font-bold text-primary/70 hover:text-primary uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-ring rounded">
                  All
                </Link>
              </div>
              <div className="space-y-0.5 max-h-[260px] overflow-y-auto">
                {leaderboardEntries.length > 0 ? (
                  leaderboardEntries.map((entry, i) => (
                    <div
                      key={entry.name ?? i}
                      className={cn(
                        "flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors",
                        entry.isUser ? "bg-primary/5 ring-1 ring-primary/15" : "hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn(
                          "w-5 text-center text-[10px] font-black",
                          entry.rank === 1 ? "text-amber-500" :
                          entry.rank === 2 ? "text-slate-400" :
                          entry.rank === 3 ? "text-orange-500" :
                          "text-muted-foreground"
                        )}>
                          {entry.rank <= 3 ? ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][entry.rank - 1] : `#${entry.rank}`}
                        </span>
                        <div className="size-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border/40">
                          {entry.avatar_url ? (
                            <img src={entry.avatar_url} alt="" className="size-full object-cover" />
                          ) : (
                            <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate">{entry.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">{entry.points} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No citizens yet. Start learning!
                  </div>
                )}
              </div>
            </motion.div>

            {/* Daily Quests */}
            <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 ring-1 ring-border/40">
              <h3 className="text-xs font-bold flex items-center gap-1.5 mb-2">
                <Zap className="size-3.5 text-amber-500" /> Quests
              </h3>
              <div className="space-y-2">
                {quests.map((quest, i) => (
                  <div key={quest.title} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-black/[0.02]", quest.bg)}>
                      <quest.icon className={cn("size-3.5", quest.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold leading-tight">{quest.title}</p>
                      <p className="text-[9px] text-muted-foreground">{quest.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold tabular-nums text-primary shrink-0">+{quest.xp}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full mt-1 h-7 text-[10px] font-bold focus-visible:ring-2 focus-visible:ring-ring">
                <Link href={Routes.LearnQuests}>
                  All Quests <ChevronRight className="size-3 ml-0.5" />
                </Link>
              </Button>
            </motion.div>

          </div>

          {/* Activity chart */}
          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 ring-1 ring-border/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" /> Activity
              </h3>
              <span className="text-[10px] text-muted-foreground font-semibold">This week</span>
            </div>
            <div className="h-[100px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={4} axisLine={false} className="text-[10px] font-bold" />
                  <ChartTooltip content={<ChartTooltipContent hideIndicator className="bg-card shadow-md text-xs border-0" />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                  <Bar dataKey="xp" fill="var(--color-xp)" radius={[3, 3, 0, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>

        </div>

        {/* ===== RIGHT SIDEBAR — Stats & Analytics ===== */}
        <div className="space-y-3">
          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 ring-1 ring-border/40">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 className="size-3 text-primary" /> Analytics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="size-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Total XP</p>
                    <p className="text-[9px] text-muted-foreground">Lifetime earnings</p>
                  </div>
                </div>
                <span className="text-sm font-black tabular-nums">{profile.sovereigns || 0}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Award className="size-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Badges Earned</p>
                    <p className="text-[9px] text-muted-foreground">Of {stages.length} total</p>
                  </div>
                </div>
                <span className="text-sm font-black tabular-nums">{totalBadges}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Star className="size-3.5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Level</p>
                    <p className="text-[9px] text-muted-foreground">Current rank</p>
                  </div>
                </div>
                <span className="text-sm font-black tabular-nums">{Math.floor((profile.sovereigns || 0) / 100) + 1}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Calendar className="size-3.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Streak</p>
                    <p className="text-[9px] text-muted-foreground">Consecutive days</p>
                  </div>
                </div>
                <span className="text-sm font-black tabular-nums">{profile.streakDays || 0}</span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Users className="size-3.5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold">Modules</p>
                    <p className="text-[9px] text-muted-foreground">Active stages</p>
                  </div>
                </div>
                <span className="text-sm font-black tabular-nums">{profile.stageProgress?.length || 0}</span>
              </div>
            </div>
          </motion.div>

          {/* Next Up mini card */}
          <motion.div variants={itemVars} className="bg-gradient-to-br from-primary/5 via-primary/[0.03] to-transparent rounded-xl p-3 ring-1 ring-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-sm ring-1 ring-primary/20">
                {currentStage.badge}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase text-primary tracking-wider">Next</p>
                <p className="text-[10px] font-bold truncate">{currentStage.title}</p>
              </div>
            </div>
            <Button onClick={() => onSelectStage(currentStage)} size="sm" className="w-full rounded-lg h-7 text-[10px] font-bold focus-visible:ring-2 focus-visible:ring-ring">
              Continue <ChevronRight className="size-3 ml-0.5" />
            </Button>
          </motion.div>

          {/* XP Progress mini */}
          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 ring-1 ring-border/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-muted-foreground">Level Progress</span>
              <span className="text-[9px] font-semibold text-muted-foreground">{(profile.sovereigns || 0) % 100}/100 XP</span>
            </div>
            <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${(profile.sovereigns || 0) % 100}%` }}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
