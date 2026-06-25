"use client";

import { BookOpen, Trophy, Zap, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGamificationMe } from "@/lib/gamification";
import { useAuth } from "@/contexts/auth-context";

export function LearnStatsHeader({ tagline }: { tagline?: string | null }) {
  const { isLoggedIn } = useAuth();
  const { data: gamification } = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: fetchGamificationMe,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        <BookOpen className="size-3" /> Learn Hub
      </div>

      {isLoggedIn && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            <Trophy className="size-3" /> {gamification?.points ?? 0} pts
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            <Zap className="size-3" /> Lv {gamification?.level ?? 1}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            <Flame className="size-3" /> {gamification?.streak_days ?? 0}d streak
          </span>
        </div>
      )}

      <h1 className="mt-3 text-xl font-bold tracking-tight md:text-2xl">Learn Kenya&apos;s budget by document</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
        {tagline ?? "Open a learning unit (BPS, BROP, CFSP, and more). Each folder holds fiscal-year editions with chapters, videos, official documents, and quizzes."}
      </p>
    </div>
  );
}
