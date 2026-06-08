"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { Sparkles, Flame, Award, ArrowUpRight, BookOpen, PlayCircle, Trophy, Activity, Target } from "lucide-react";
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
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function LearnDashboardView({
  profile,
  stages,
  currentStage,
  onSelectStage,
  onNavigateToCurriculum,
  leaderboard,
}: LearnDashboardViewProps) {
  // Mock daily analytics data (S M T W T F S)
  const chartData = useMemo(() => [
    { day: "S", xp: 0 },
    { day: "M", xp: 120 },
    { day: "T", xp: 80 },
    { day: "W", xp: 300 },
    { day: "T", xp: 50 },
    { day: "F", xp: 200 },
    { day: "S", xp: profile.sovereigns > 0 ? 150 : 0 },
  ], [profile.sovereigns]);

  const chartConfig = {
    xp: {
      label: "XP Earned",
      color: "var(--primary)",
    },
  };

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
      className="space-y-4 max-w-5xl mx-auto p-3 md:p-4 pb-16"
    >
      {/* 1. Hero / Profile Banner */}
      <motion.div variants={itemVars} className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary via-primary/90 to-blue-600 text-white p-5 md:p-8 shadow-lg border border-white/10 group">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 md:size-20 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <BitmojiAvatar gender={profile.gender as "male" | "female"} size="md" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">{profile.breakName || "Citizen"}</h1>
              <p className="text-white/80 font-semibold md:text-base flex items-center gap-2 mt-0.5">
                {profile.county || "Kenya"}
                <span className="size-1.5 rounded-full bg-white/50" />
                Level {Math.floor((profile.sovereigns || 0) / 100) + 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 bg-black/20 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 self-start md:self-auto w-full md:w-auto">
            <div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Sovereigns</p>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl md:text-4xl font-black tabular-nums leading-none drop-shadow-lg text-amber-300">
                  {profile.sovereigns || 0}
                </span>
                <span className="text-amber-300/80 font-bold mb-0.5 text-xs hidden sm:inline">XP</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
               <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Streak</p>
               <div className="flex items-center gap-1.5">
                 <Flame className="size-6 text-orange-400 drop-shadow-lg" fill="currentColor" />
                 <span className="text-2xl md:text-3xl font-black tabular-nums leading-none">{profile.streakDays || 0}</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Stat Grid */}
      <motion.div variants={itemVars} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Modules */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-semibold text-muted-foreground">Modules Read</span>
            <div className="size-7 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BookOpen className="size-3.5" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black tabular-nums">{profile.stageProgress?.length || 0}</div>
          </div>
        </div>

        {/* Badges */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-semibold text-muted-foreground">Badges Earned</span>
            <div className="size-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Award className="size-3.5" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black tabular-nums">{totalBadges}</div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">
              of {stages.length}
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group">
           <div className="flex justify-between items-start relative z-10">
             <span className="text-xs font-semibold text-muted-foreground">Daily Goal</span>
             <div className="size-7 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
               <Target className="size-3.5" />
             </div>
           </div>
           <div className="relative z-10">
             <div className="text-base font-black font-mono tracking-tighter tabular-nums">
               {profile.streakDays > 0 ? "00:00:00" : "24:00:00"}
             </div>
             <div className={cn(
               "text-[9px] font-bold uppercase tracking-wider leading-tight",
               profile.streakDays > 0 ? "text-emerald-500" : "text-orange-500"
             )}>
               {profile.streakDays > 0 ? "Goal Met" : "Time Left"}
             </div>
           </div>
        </div>
        
        {/* Rank */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-semibold text-muted-foreground">Current Rank</span>
            <div className="size-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Trophy className="size-3.5" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black tabular-nums">
               {leaderboard?.find(l => l.name === profile.breakName)?.rank ? `#${leaderboard?.find(l => l.name === profile.breakName)?.rank}` : "—"}
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">
              Leaderboard
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Main Content Grids */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
        
        <div className="space-y-4 flex flex-col">
          {/* Active Module Resumer */}
          <motion.div variants={itemVars} className="p-0.5 rounded-2xl bg-gradient-to-r from-primary via-indigo-500 to-blue-500">
             <div className="bg-card/95 backdrop-blur-xl rounded-[1.9rem] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20">
               <div className="flex items-center gap-4">
                 <div className="size-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner border border-primary/20">
                   {currentStage.badge}
                 </div>
                 <div className="min-w-0 space-y-0.5">
                   <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">Next Up</span>
                   <h3 className="text-base font-black tracking-tight truncate">{currentStage.title}</h3>
                   <p className="text-xs text-muted-foreground line-clamp-1">{currentStage.documentName}</p>
                 </div>
               </div>
               <Button onClick={() => onSelectStage(currentStage)} className="rounded-xl h-10 px-5 font-bold text-sm shadow-lg hover:shadow-xl transition-all shrink-0 w-full sm:w-auto">
                 <PlayCircle className="size-4 mr-1.5" /> Start Now
               </Button>
             </div>
          </motion.div>

          {/* Activity Analytics */}
          <motion.div variants={itemVars} className="p-4 rounded-2xl bg-card border border-border shadow-xs flex-1 flex flex-col min-h-[240px]">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                    <Activity className="size-4 text-primary" /> Activity
                 </h3>
                 <p className="text-[10px] text-muted-foreground">Daily XP this week</p>
               </div>
             </div>
             <div className="flex-1 min-h-[160px]">
               <ChartContainer config={chartConfig} className="w-full h-full max-h-[200px]">
                 <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                   <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                   <XAxis 
                     dataKey="day" 
                     tickLine={false}
                     tickMargin={6}
                     axisLine={false}
                     className="text-[10px] font-bold"
                   />
                   <ChartTooltip content={<ChartTooltipContent hideIndicator className="bg-card border border-border shadow-md text-xs" />} cursor={{fill: 'var(--muted)', opacity: 0.3}} />
                   <Bar 
                     dataKey="xp" 
                     fill="var(--color-xp)" 
                     radius={[4, 4, 4, 4]} 
                     barSize={28}
                     className="hover:opacity-80 transition-opacity"
                   />
                 </BarChart>
               </ChartContainer>
             </div>
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4 flex flex-col">
          
          {/* Progress Radial */}
          <motion.div variants={itemVars} className="p-5 rounded-2xl bg-card border border-border shadow-xs">
            <h3 className="text-sm font-black mb-3">Progress</h3>
            <div className="relative flex items-center justify-center h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={doughnutData}
                    innerRadius={50}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {doughnutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-semibold mt-3">
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> Mastered</div>
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-muted" /> Remaining</div>
            </div>
          </motion.div>

          {/* Top Citizens / Leaderboard */}
          <motion.div variants={itemVars} className="p-5 rounded-2xl bg-card border border-border shadow-xs flex-1 flex flex-col max-h-[340px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <Trophy className="size-4 text-amber-500" /> Top Citizens
              </h3>
              <Link href={Routes.LearnForum} className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">View All</Link>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {(leaderboard ?? []).length > 0 ? (
                leaderboard!.map((entry, i) => (
                  <div key={entry.name ?? i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-xl transition-colors border border-transparent hover:border-border cursor-default group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                        {entry.avatar_url ? (
                          <img src={entry.avatar_url} alt={entry.name ?? ""} className="size-full object-cover" />
                        ) : (
                          <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate group-hover:text-primary transition-colors">{entry.name ?? "Anonymous"}</h4>
                        <p className="text-[9px] text-muted-foreground truncate">
                          {entry.rank ? `${entry.points} SVG` : "Not started"}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider shrink-0 ${
                      entry.rank === 1 ? "bg-amber-500/20 text-amber-600" :
                      entry.rank === 2 ? "bg-slate-300/20 text-slate-500" :
                      entry.rank === 3 ? "bg-orange-600/10 text-orange-600" :
                      entry.rank
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {entry.rank ? `#${entry.rank}` : "—"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground">
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
