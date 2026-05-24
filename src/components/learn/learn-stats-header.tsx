"use client";

import { BookOpen, Trophy } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
          <BookOpen className="size-3.5" />
          Learn Hub
        </div>

        {authenticated ? (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
              <Trophy className="size-3.5" />
              {gamification?.points ?? 0} points
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
              Lv {gamification?.level ?? 1}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
              {gamification?.streak_days ?? 0} day streak
            </span>
          </div>
        ) : null}

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Learn Kenya&apos;s budget by document
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/75 sm:text-base">
          {tagline ??
            "Open a learning unit (BPS, BROP, CFSP, and more). Each folder holds fiscal-year editions with chapters, videos, official documents, and quizzes — not a flat list of random articles."}
        </p>
      </div>
    </div>
  );
}
