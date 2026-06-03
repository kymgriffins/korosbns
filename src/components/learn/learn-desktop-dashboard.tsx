"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles, Flame, Award, ArrowUpRight, Clock, Users, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
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

interface LearnDesktopDashboardProps {
  profile: any;
  stages: CivicModule[];
  currentStage: CivicModule;
  onSelectStage: (stage: CivicModule) => void;
  onNavigateToCurriculum: () => void;
  leaderboard?: LeaderboardEntry[];
}

export function LearnDesktopDashboard({
  profile,
  stages,
  currentStage,
  onSelectStage,
  onNavigateToCurriculum,
  leaderboard,
}: LearnDesktopDashboardProps) {
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
    <div className="space-y-6 max-w-5xl mx-auto p-2 pb-10">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Track your civic learning journey and master the budget cycle.</p>
      </div>

      {/* 4-Card Summary Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Primary XP Card */}
        <div className="p-5 rounded-3xl bg-primary text-primary-foreground shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
            <Sparkles className="size-32" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold">Total Sovereigns</span>
            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black">{profile.sovereigns || 0}</div>
            <div className="text-xs font-medium bg-white/20 inline-flex px-2 py-0.5 rounded-sm items-center gap-1">
              <Sparkles className="size-3" /> Level {Math.floor((profile.sovereigns || 0) / 100) + 1}
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">Badges Earned</span>
            <div className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black">{totalBadges}</div>
            <div className="text-xs font-medium text-emerald-600 bg-emerald-500/10 inline-flex px-2 py-0.5 rounded-sm items-center gap-1">
              <Award className="size-3" /> of {stages.length} Available
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">Active Streak</span>
            <div className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black">{profile.streakDays || 0}</div>
            <div className="text-xs font-medium text-orange-600 bg-orange-500/10 inline-flex px-2 py-0.5 rounded-sm items-center gap-1">
              <Flame className="size-3" /> Days in a row
            </div>
          </div>
        </div>

        {/* Modules Completed */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">Modules Read</span>
            <div className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <ArrowUpRight className="size-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black">{profile.stageProgress?.length || 0}</div>
            <div className="text-xs font-medium text-blue-600 bg-blue-500/10 inline-flex px-2 py-0.5 rounded-sm items-center gap-1">
              <BookOpen className="size-3" /> Sections read
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Analytics & Next Module */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        
        {/* Activity Analytics (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-base font-black">Activity Analytics</h3>
              <p className="text-xs text-muted-foreground">Daily XP earned this week</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ChartContainer config={chartConfig} className="w-full h-full max-h-[220px]">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs font-bold"
                />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false} />
                <Bar 
                  dataKey="xp" 
                  fill="var(--color-xp)" 
                  radius={[10, 10, 10, 10]} 
                  barSize={32}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Reminders / Upcoming */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col">
          <div className="space-y-1 mb-6">
            <h3 className="text-base font-black">Next Module</h3>
            <p className="text-xs text-muted-foreground">Resume where you left off</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 mb-4">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              {currentStage.badge}
            </div>
            <div>
              <h4 className="text-sm font-black">{currentStage.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{currentStage.documentName}</p>
            </div>
          </div>
          <Button onClick={() => onSelectStage(currentStage)} className="w-full rounded-xl font-bold h-12">
            <PlayCircle className="size-5 mr-2" /> Start Module
          </Button>
        </div>
      </div>

      {/* Bottom Row: Community, Radial Progress, Streak Tracker */}
      <div className="grid grid-cols-[1fr_300px_300px] gap-4">
        
        {/* Top Learners / Community */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black">Top Citizens</h3>
            <Link href={Routes.LearnForum} className="text-xs font-bold text-primary hover:underline">View Forum</Link>
          </div>
          <div className="space-y-3">
            {(leaderboard ?? []).length > 0 ? (
              leaderboard!.map((entry, i) => (
                <div key={entry.name ?? i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt={entry.name ?? ""} className="size-full object-cover" />
                      ) : (
                        <BitmojiAvatar gender={i % 2 === 0 ? "female" : "male"} size="sm" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{entry.name ?? "Anonymous"}</h4>
                      <p className="text-xs text-muted-foreground">
                        {entry.rank ? `${entry.points} Sovereigns` : "Not yet started"}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    entry.rank
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {entry.rank ? `#${entry.rank}` : "—"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No citizens yet. Start learning to appear here!
              </div>
            )}
          </div>
        </div>

        {/* Progress Radial */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-black">Curriculum Progress</h3>
          <div className="relative flex-1 flex items-center justify-center min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={doughnutData}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {doughnutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black">{Math.round(progressPercentage)}%</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mastered</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> Mastered</div>
            <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-muted" /> Remaining</div>
          </div>
        </div>

        {/* Streak Dark Card */}
        <div className="p-6 rounded-3xl bg-[#0f172a] text-white shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
          
          <div className="space-y-1 relative z-10">
            <h3 className="text-sm font-bold text-white/80">Daily Goal Tracker</h3>
            <p className="text-xs text-white/60">Keep your streak alive</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center py-4">
            <div className="text-5xl font-black font-mono tracking-tighter drop-shadow-lg">
              {profile.streakDays > 0 ? "00:00:00" : "24:00:00"}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mt-2 font-bold">
              {profile.streakDays > 0 ? "Goal met today!" : "Time left to earn XP"}
            </p>
          </div>

          <div className="flex gap-2 relative z-10">
             <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none" onClick={onNavigateToCurriculum}>
               Earn XP Now
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
