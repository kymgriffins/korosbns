"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { Sparkles, Flame, Award, BookOpen, PlayCircle, Trophy, Activity, Target, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
    transition: { staggerChildren: 0.08 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
};

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
  const progressPercentage = stages.length > 0 ? (totalBadges / stages.length) * 100 : 0;

  const doughnutData = [
    { name: "Completed", value: progressPercentage, fill: "var(--primary)" },
    { name: "Remaining", value: 100 - progressPercentage, fill: "hsl(var(--muted))" },
  ];

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-3 max-w-5xl mx-auto p-3 md:p-4 pb-20"
    >
      <motion.div variants={itemVars} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 text-white p-4 md:p-6 shadow-sm">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 md:size-14 rounded-full bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
              )}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight">{profile.breakName || "Citizen"}</h1>
              <p className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                {profile.county || "Kenya"}
                <span className="size-1 rounded-full bg-white/40" />
                Lv.{Math.floor((profile.sovereigns || 0) / 100) + 1}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur rounded-xl px-3 py-2 border border-white/10">
            <div className="text-right">
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">SVG</p>
              <p className="text-lg font-black tabular-nums text-amber-300">{profile.sovereigns || 0}</p>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div>
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Streak</p>
              <div className="flex items-center gap-1">
                <Flame className="size-4 text-orange-400" fill="currentColor" />
                <span className="text-lg font-black tabular-nums">{profile.streakDays || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Modules", value: profile.stageProgress?.length || 0, suffix: "", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/8" },
          { label: "Badges", value: totalBadges, suffix: `/ ${stages.length}`, icon: Award, color: "text-emerald-600", bg: "bg-emerald-500/8" },
          { label: "Daily Goal", value: profile.streakDays > 0 ? "Goal Met" : "24:00:00", suffix: "", icon: Target, color: profile.streakDays > 0 ? "text-emerald-600" : "text-orange-500", bg: "bg-purple-500/8" },
          { label: "Rank", value: leaderboard?.find(l => l.name === profile.breakName)?.rank ? `#${leaderboard?.find(l => l.name === profile.breakName)?.rank}` : "\u2014", suffix: "", icon: Trophy, color: "text-amber-600", bg: "bg-amber-500/8" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card shadow-xs rounded-xl p-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-black tabular-nums">{stat.value}</span>
                {stat.suffix && <span className="text-[10px] text-muted-foreground font-semibold">{stat.suffix}</span>}
              </div>
            </div>
            <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-3">
        <div className="space-y-3">
          <motion.div variants={itemVars} className="bg-gradient-to-r from-primary/10 via-indigo-500/10 to-blue-500/10 rounded-xl p-0.5 shadow-xs">
            <div className="bg-card rounded-[calc(0.75rem-1px)] p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                  {currentStage.badge}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase text-primary tracking-wider">Next Up</p>
                  <h3 className="text-sm font-black truncate">{currentStage.title}</h3>
                  <p className="text-[10px] text-muted-foreground truncate">{currentStage.documentName}</p>
                </div>
              </div>
              <Button onClick={() => onSelectStage(currentStage)} size="sm" className="rounded-lg h-8 px-3 font-bold text-xs shrink-0">
                <PlayCircle className="size-3.5 mr-1" /> Start
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" /> Activity
              </h3>
              <span className="text-[9px] text-muted-foreground font-semibold">This week</span>
            </div>
            <div className="h-[120px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={4} axisLine={false} className="text-[9px] font-bold" />
                  <ChartTooltip content={<ChartTooltipContent hideIndicator className="bg-card shadow-md text-xs border-0" />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                  <Bar dataKey="xp" fill="var(--color-xp)" radius={[3, 3, 0, 0]} barSize={24} />
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3">
            <h3 className="text-xs font-bold mb-2">Progress</h3>
            <div className="relative flex items-center justify-center h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={doughnutData} innerRadius={34} outerRadius={46} startAngle={90} endAngle={-270} dataKey="value" stroke="none" cornerRadius={6}>
                    {doughnutData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg font-black">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <div className="flex justify-center gap-3 text-[9px] font-semibold mt-1">
              <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-primary" /> Done</div>
              <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-muted-foreground/20" /> Left</div>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-card shadow-xs rounded-xl p-3 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Trophy className="size-3.5 text-amber-500" /> Top Citizens
              </h3>
              <Link href={Routes.LearnForum} className="text-[9px] font-bold text-primary/70 hover:text-primary uppercase tracking-wider">All</Link>
            </div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {(leaderboard ?? []).length > 0 ? (
                leaderboard!.slice(0, 5).map((entry, i) => (
                  <div key={entry.name ?? i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-6 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {entry.avatar_url ? (
                          <img src={entry.avatar_url} alt={entry.name ?? ""} className="size-full object-cover" />
                        ) : (
                          <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold truncate">{entry.name ?? "Anonymous"}</p>
                        <p className="text-[8px] text-muted-foreground">{entry.points} SVG</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-black",
                      entry.rank === 1 ? "bg-amber-500/15 text-amber-600" :
                      entry.rank === 2 ? "bg-slate-300/20 text-slate-500" :
                      entry.rank === 3 ? "bg-orange-500/10 text-orange-600" :
                      "text-muted-foreground"
                    )}>
                      #{entry.rank}
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
        </div>
      </div>
    </motion.div>
  );
}
