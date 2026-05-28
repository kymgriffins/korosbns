"use client";

import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Sparkles } from "lucide-react";
import { Flame } from "lucide-react";

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

type StageData = {
  id: number;
  title: string;
  badge: string;
  documentName: string;
  badgeName: string;
  status: string;
};

export function LearnDashboardPanel({
  text,
  profile,
  currentStage,
  onSelectStage,
}: {
  text: TranslationText;
  profile: Profile;
  currentStage: StageData;
  onSelectStage: (s: StageData) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card shadow-xs">
        <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xs font-black text-foreground truncate">{profile.breakName}</h1>
          <p className="text-[10px] text-muted-foreground truncate">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black flex items-center gap-1">
            <Sparkles className="size-3 fill-primary" />
            <span>{profile.sovereigns}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold" title={text.streak}>
            <Flame className="size-3 fill-orange-500" />
            <span>{profile.streakDays}d</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-black uppercase tracking-tight">{text.dashboardTitle}</h2>
        <p className="text-xs text-muted-foreground">{text.dashboardSubtitle}</p>
      </div>

      <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-foreground">
          <span>Progress to Citizen Expert</span>
          <span className="text-primary">{profile.badges?.length || 0} / 8 Stages Mastered</span>
        </div>
        <Progress value={((profile.badges?.length || 0) / 8) * 100} className="h-2 rounded-full" />
        <p className="text-[10px] text-muted-foreground">Unlock all 8 badges by completing the trivia gates.</p>
      </div>

      <div className="p-4 border border-border bg-card rounded-2xl space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Stage</span>
          <span className="text-[11px] text-primary font-bold">Stage {currentStage.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentStage.badge}</span>
          <div>
            <h4 className="text-sm font-black uppercase leading-tight">{currentStage.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{currentStage.documentName}</p>
          </div>
        </div>
        <Button
          onClick={() => onSelectStage(currentStage)}
          className="w-full rounded-xl mt-2 font-bold"
        >
          Resume Learning
        </Button>
      </div>
    </motion.div>
  );
}
