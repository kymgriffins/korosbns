"use client";

import { BitmojiAvatar } from "./bitmoji-avatar";
import { Zap, Flame } from "lucide-react";
import { useLearn } from "@/contexts/learn-context";

export function LearnStatsSidebar({ profile }: {
  profile: { breakName: string; gender: string; sovereigns: number; streakDays: number; badges?: string[]; };
}) {
  const { totalStages } = useLearn();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <aside className="w-72 border-l border-border/30 bg-card/10 p-4 flex flex-col gap-4 overflow-y-auto">
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{greeting}</p>
        <h3 className="text-sm font-black flex items-center gap-2 mt-0.5">
          <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
          {profile.breakName}
        </h3>
      </div>

      <div className="flex flex-col items-center p-3 bg-card/30 rounded-xl gap-2 shadow-xs">
        <div className="relative size-24 flex items-center justify-center">
          <svg className="size-full -rotate-90">
            <circle cx="48" cy="48" r="38" className="stroke-muted/30 fill-none" strokeWidth="5" />
            <circle cx="48" cy="48" r="38" className="stroke-primary fill-none transition-all duration-500" strokeWidth="5"
              strokeDasharray="239" strokeDashoffset={totalStages ? 239 - (239 * (profile.badges?.length || 0)) / totalStages : 239} strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-lg font-black">{totalStages ? Math.round(((profile.badges?.length || 0) / totalStages) * 100) : 0}%</span>
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground text-center">Master all {totalStages} stages for your Citizen Certificate.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-orange-500/5 rounded-xl text-center shadow-xs">
          <Flame className="size-4 fill-orange-500 text-orange-500 mx-auto" />
          <span className="block text-sm font-black text-orange-600 mt-0.5">{profile.streakDays}d</span>
          <span className="text-[7px] font-bold text-orange-500/70 uppercase tracking-wider">Streak</span>
        </div>
        <div className="p-2.5 bg-primary/5 rounded-xl text-center shadow-xs">
          <Zap className="size-4 fill-primary text-primary mx-auto" />
          <span className="block text-sm font-black text-primary mt-0.5">{profile.sovereigns}</span>
          <span className="text-[7px] font-bold text-primary/70 uppercase tracking-wider">SVG</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Badges ({profile.badges?.length || 0})</h4>
        {profile.badges?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.badges.map((b, i) => (
              <span key={i} className="text-base p-1.5 rounded-lg bg-card shadow-xs border-0">{b}</span>
            ))}
          </div>
        ) : (
          <p className="text-[9px] text-muted-foreground italic bg-muted/10 p-2 rounded-lg text-center">No badges yet. Start learning!</p>
        )}
      </div>
    </aside>
  );
}
