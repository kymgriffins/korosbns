"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Trophy } from "lucide-react";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { learnHubApi, type LearnProfileResponse } from "@/lib/learn-hub";
import { MotionPage } from "@/motion/wrappers";
import { fadeInUp } from "@/motion/variants";
import { motion } from "motion/react";
import { Button } from "@/ui/button";

export default function LearnProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<LearnProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void learnHubApi
      .profile()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const g = data?.gamification;
  const displayName = user?.display_name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email?.split("@")[0] || null;

  return (
    <MotionPage>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">
          {displayName ? `${displayName}'s profile` : "Learner profile"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {displayName ? `Welcome back, ${displayName}. ` : ""}Your XP, streaks, badges, and recent progress on Budget Ndio Story.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          </div>
        ) : null}

        {!loading && g ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-8 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{g.points}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{g.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{g.streak_days}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="size-5 text-primary" aria-hidden />
                Badges
              </h2>
              {g.badges.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete quests and lessons to earn badges.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {g.badges.map((badge) => (
                    <li
                      key={badge.slug}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span className="mr-2">{badge.icon || "🏅"}</span>
                      {badge.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold">Recent progress</h2>
              <ul className="mt-3 space-y-2">
                {(data?.progress ?? []).slice(0, 10).map((row) => (
                  <li
                    key={`${row.content_type}-${row.content_id}`}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="font-medium capitalize">{row.content_type}</span>
                    <span className="text-muted-foreground"> · {row.progress_percent}%</span>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        ) : null}

        {!loading && !g ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in or browse lessons to start tracking progress.
            </p>
            <Button asChild className="mt-4">
              <Link href={Routes.Login}>Sign in</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </MotionPage>
  );
}
