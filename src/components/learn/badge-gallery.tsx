"use client";

import { useEffect, useState } from "react";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";
import { Award, Flame, Sparkles, Lock, Shield } from "lucide-react";
import { cn } from "@/utils";

const ALL_BADGES = [
  { slug: "bronze-citizen", name: "Bronze Citizen", icon: "🥉", description: "Earn 100 points", threshold: 100 },
  { slug: "silver-citizen", name: "Silver Citizen", icon: "🥈", description: "Earn 250 points", threshold: 250 },
  { slug: "gold-citizen", name: "Gold Citizen", icon: "🥇", description: "Earn 500 points", threshold: 500 },
  { slug: "streak-3", name: "3-Day Streak", icon: "🔥", description: "Maintain a 3-day streak", threshold: "streak_3" },
  { slug: "streak-7", name: "7-Day Streak", icon: "🔥", description: "Maintain a 7-day streak", threshold: "streak_7" },
  { slug: "streak-30", name: "30-Day Streak", icon: "🔥", description: "Maintain a 30-day streak", threshold: "streak_30" },
  { slug: "module-master", name: "Module Master", icon: "📚", description: "Complete all modules", threshold: "modules" },
  { slug: "challenge-champion", name: "Challenge Champion", icon: "🏆", description: "Complete a weekly challenge", threshold: "challenge" },
];

export function BadgeGallery() {
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchGamificationMe().then((data) => {
      setGamification(data);
      setLoading(false);
    });
  }, []);

  const earnedSlugs = new Set(gamification?.badges?.map((b) => b.slug) ?? []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin size-6 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const earned = ALL_BADGES.filter((b) => earnedSlugs.has(b.slug));
  const locked = ALL_BADGES.filter((b) => !earnedSlugs.has(b.slug));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Award className="size-5 text-primary" />
        <h2 className="text-lg font-black uppercase tracking-tight">Badge Gallery</h2>
      </div>

      {earned.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            Earned ({earned.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {earned.map((badge) => (
              <div
                key={badge.slug}
                className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-2"
              >
                <span className="text-3xl block">{badge.icon}</span>
                <h4 className="text-xs font-black">{badge.name}</h4>
                <p className="text-[10px] text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Lock className="size-3.5" />
          Locked ({locked.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {locked.map((badge) => (
            <div
              key={badge.slug}
              className="p-4 rounded-xl border border-border bg-muted/10 text-center space-y-2 opacity-60"
            >
              <span className="text-3xl block grayscale">{badge.icon}</span>
              <h4 className="text-xs font-black">{badge.name}</h4>
              <p className="text-[10px] text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Shield className="size-4 text-primary" />
          <span>Level {gamification?.level ?? 1} Citizen</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {gamification?.points ?? 0} points &middot; {gamification?.streak_days ?? 0} day streak
        </p>
      </div>
    </div>
  );
}
