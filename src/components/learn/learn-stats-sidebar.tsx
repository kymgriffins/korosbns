"use client";

import { BitmojiAvatar } from "./bitmoji-avatar";
import { Sparkles, Flame } from "lucide-react";
import { useLearn } from "@/contexts/learn-context";

export function LearnStatsSidebar({
  profile,
}: {
  profile: {
    breakName: string;
    gender: string;
    sovereigns: number;
    streakDays: number;
    badges?: string[];
  };
}) {
  const { totalStages } = useLearn();
  return (
    <aside className="w-80 border-l border-border bg-card/25 p-6 flex flex-col gap-6 overflow-y-auto select-none">
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Good Morning</p>
        <h3 className="text-base font-black text-foreground flex items-center gap-2 mt-0.5">
          <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
          {profile.breakName} 🔥
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center p-4 border border-border bg-card/40 rounded-2xl gap-3">
        <div className="relative size-28 flex items-center justify-center">
          <svg className="size-full -rotate-90">
            <circle cx="56" cy="56" r="46" className="stroke-muted fill-none" strokeWidth="6" />
            <circle
              cx="56" cy="56" r="46"
              className="stroke-primary fill-none transition-all duration-500"
              strokeWidth="6"
              strokeDasharray="289"
              strokeDashoffset={totalStages ? 289 - (289 * (profile.badges?.length || 0)) / totalStages : 289}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black leading-none">
              {totalStages ? Math.round(((profile.badges?.length || 0) / totalStages) * 100) : 0}%
            </span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5 tracking-wider">Progress</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium text-center">
          Master all {totalStages} stages to unlock your Citizen Certificate.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-orange-500/8 border border-orange-500/15 rounded-xl text-center">
          <Flame className="size-5 fill-orange-500 text-orange-500 mx-auto" />
          <span className="block text-sm font-black text-orange-600 mt-1">{profile.streakDays} Days</span>
          <span className="text-[8px] font-black text-orange-500/80 uppercase tracking-wider mt-0.5">Streak</span>
        </div>
        <div className="p-3 bg-primary/8 border border-primary/15 rounded-xl text-center">
          <Sparkles className="size-5 fill-primary text-primary mx-auto" />
          <span className="block text-sm font-black text-primary mt-1">{profile.sovereigns} SVG</span>
          <span className="text-[8px] font-black text-primary/80 uppercase tracking-wider mt-0.5">Sovereigns</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Unlocked Badges ({profile.badges?.length || 0})
        </h4>
        {profile.badges?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((b, i) => (
              <span key={i} className="text-xl p-2 rounded-xl bg-card border border-border shadow-2xs" title={b}>
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground italic bg-muted/20 p-3 rounded-lg text-center border border-border/50">
            No badges unlocked yet. Start learning to earn badges!
          </p>
        )}
      </div>
    </aside>
  );
}
