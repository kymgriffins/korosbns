"use client";

import { Sparkles, Flame } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { LearnStatCard } from "./learn-stat-card";
import { useLearn } from "@/contexts/learn-context";

export function LearnStatsSidebar({ profile }: {
  profile: { breakName: string; gender: string; sovereigns: number; streakDays: number; badges?: string[] };
}) {
  const { totalStages } = useLearn();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const badgeCount  = profile.badges?.length ?? 0;
  const progressPct = totalStages ? Math.round((badgeCount / totalStages) * 100) : 0;
  // SVG ring constants — defined once
  const RADIUS         = 38;
  const CIRCUMFERENCE  = 2 * Math.PI * RADIUS;
  const strokeOffset   = CIRCUMFERENCE - (CIRCUMFERENCE * badgeCount) / (totalStages || 1);

  return (
    <aside className="w-72 border-l border-border/30 bg-card/10 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Greeting */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{greeting}</p>
        <h3 className="text-sm font-semibold flex items-center gap-2 mt-0.5">
          <BitmojiAvatar gender={profile.gender as "male" | "female"} size="sm" />
          {profile.breakName}
        </h3>
      </div>

      {/* Radial progress */}
      <Card className="shadow-xs">
        <CardContent className="flex flex-col items-center p-3 gap-2">
          <div
            className="relative size-24 flex items-center justify-center"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall progress: ${progressPct}%`}
          >
            <svg className="size-full -rotate-90" aria-hidden>
              <circle cx="48" cy="48" r={RADIUS} className="stroke-muted/30 fill-none" strokeWidth="5" />
              <circle
                cx="48" cy="48" r={RADIUS}
                className="stroke-primary fill-none transition-all duration-500"
                strokeWidth="5"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black">{progressPct}%</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Progress</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Master all {totalStages} stages for your Citizen Certificate.
          </p>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <LearnStatCard label="Streak" value={`${profile.streakDays}d`} icon={Flame}    accent="orange" size="sm" />
        <LearnStatCard label="SVG"    value={profile.sovereigns}        icon={Sparkles} accent="primary" size="sm" />
      </div>

      {/* Badge list */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Badges ({badgeCount})
        </h4>
        {profile.badges?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.badges.map((b, i) => (
              <span
                key={i}
                role="img"
                aria-label={`Badge ${i + 1}`}
                className="text-base p-1.5 rounded-lg bg-card shadow-xs"
              >
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic bg-muted/10 p-2 rounded-lg text-center">
            No badges yet. Start learning!
          </p>
        )}
      </div>
    </aside>
  );
}
