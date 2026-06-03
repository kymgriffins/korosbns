"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, PlayCircle, Award, BookOpen } from "lucide-react";
import { Button } from "@/ui/button";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Sparkles, Flame } from "lucide-react";
import type { CivicModule } from "@/types/learn";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type TranslationText = {
  dashboardTitle: string;
  dashboardSubtitle: string;
  streak: string;
};

type Profile = {
  breakName: string;
  county: string;
  sovereigns: number;
  streakDays: number;
  badges?: string[];
  stageProgress?: number[];
  gender: string;
};

export function LearnDashboardPanel({
  text,
  profile,
  currentStage,
  totalStages,
  onSelectStage,
}: {
  text: TranslationText;
  profile: Profile;
  currentStage: CivicModule;
  totalStages: number;
  onSelectStage: (s: CivicModule) => void;
}) {
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
      label: "XP",
      color: "var(--primary)",
    },
  };

  const totalBadges = profile.badges?.length || 0;
  const progressPercentage = totalStages > 0 ? (totalBadges / totalStages) * 100 : 0;
  
  const doughnutData = [
    { name: "Completed", value: progressPercentage, fill: "var(--primary)" },
    { name: "Remaining", value: 100 - progressPercentage, fill: "hsl(var(--muted))" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 pb-20"
    >
      <div className="flex items-center gap-3 p-3 rounded-3xl border border-border bg-card shadow-xs">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xs font-black text-foreground truncate">{profile.breakName}</h1>
          <p className="text-[10px] text-muted-foreground truncate">{profile.county} · Lvl {Math.floor((profile.sovereigns || 0) / 100) + 1}</p>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h2 className="text-lg font-black tracking-tight">Dashboard</h2>
      </div>

      {/* Primary XP Card */}
      <div className="p-5 rounded-3xl bg-primary text-primary-foreground shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
          <Sparkles className="size-32" />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <span className="text-sm font-semibold">Total Sovereigns</span>
        </div>
        <div className="space-y-1 relative z-10">
          <div className="text-5xl font-black">{profile.sovereigns || 0}</div>
          <div className="text-xs font-medium bg-white/20 inline-flex px-2 py-0.5 rounded-sm items-center gap-1">
            <Sparkles className="size-3" /> Level {Math.floor((profile.sovereigns || 0) / 100) + 1}
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="text-sm font-semibold text-muted-foreground mb-2">Badges</div>
          <div className="text-2xl font-black">{totalBadges}</div>
        </div>
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <div className="text-sm font-semibold text-muted-foreground mb-2">Streak</div>
          <div className="text-2xl font-black flex items-center gap-1">{profile.streakDays || 0} <Flame className="size-4 text-orange-500" /></div>
        </div>
      </div>

      {/* Daily Analytics */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black">Activity Analytics</h3>
          <p className="text-[10px] text-muted-foreground">Daily XP earned</p>
        </div>
        <div className="h-[140px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} tickMargin={5} axisLine={false} className="text-[10px] font-bold" />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false} />
              <Bar dataKey="xp" fill="var(--color-xp)" radius={[6, 6, 6, 6]} barSize={20} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Active Stage Resumer */}
      <div className="p-5 border border-border bg-card rounded-3xl space-y-4 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Next Module</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
            {currentStage.badge}
          </div>
          <div>
            <h4 className="text-sm font-black leading-tight">{currentStage.title}</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">{currentStage.documentName}</p>
          </div>
        </div>
        <Button
          onClick={() => onSelectStage(currentStage)}
          className="w-full rounded-xl mt-2 font-bold h-12"
        >
          <PlayCircle className="size-4 mr-2" /> Resume Learning
        </Button>
      </div>

      {/* Radial Progress */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex items-center gap-4">
        <div className="size-24 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={doughnutData}
                innerRadius={30}
                outerRadius={45}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-black">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black">Progress</h3>
          <p className="text-[10px] text-muted-foreground">Keep completing stages to master the curriculum.</p>
        </div>
      </div>
    </motion.div>
  );
}
