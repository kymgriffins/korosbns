"use client";

import { BookOpen, Trophy, Zap, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/api-client";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";

export function LearnStatsHeader({ tagline }: { tagline?: string | null }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [gamification, setGamification] = useState<GamificationState | null>(null);

  useEffect(() => {
    setAuthenticated(Boolean(getAccessToken()));
    void fetchGamificationMe().then(setGamification);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-4 md:p-5 shadow-xs">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="size-3" /> Learn Hub
        </div>

        {authenticated && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
              <Trophy className="size-3" /> {gamification?.points ?? 0} pts
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
              <Zap className="size-3" /> Lv {gamification?.level ?? 1}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
              <Flame className="size-3" /> {gamification?.streak_days ?? 0}d streak
            </span>
          </div>
        )}

        <h1 className="mt-2.5 text-xl font-bold tracking-tight md:text-2xl">Learn Kenya&apos;s budget by document</h1>
        <p className="mt-1.5 max-w-2xl text-xs text-muted-foreground/80 md:text-sm">
          {tagline ?? "Open a learning unit (BPS, BROP, CFSP, and more). Each folder holds fiscal-year editions with chapters, videos, official documents, and quizzes."}
        </p>
      </div>
    </div>
  );
}
