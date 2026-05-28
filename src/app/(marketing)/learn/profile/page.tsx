"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Flame,
  Loader2,
  Medal,
  Route,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { useLearn } from "@/contexts/learn-context";
import { getGamificationDeviceId } from "@/lib/gamification";
import { learnHubApi, type LearnProfileResponse } from "@/lib/learn-hub";
import { useStages } from "@/hooks/use-stages";
import { MotionPage } from "@/motion/wrappers";
import { fadeInUp } from "@/motion/variants";
import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";

export default function LearnProfilePage() {
  const { user } = useAuth();
  const { gamification: liveGamification } = useLearn();
  const { stages } = useStages();
  const [data, setData] = useState<LearnProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void learnHubApi
      .profile()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const g = data?.gamification ?? liveGamification;
  const badges = g?.badges ?? [];
  const certificates = data?.gamification?.certificates ?? [];
  const progress = data?.progress ?? [];
  const deviceId = typeof window !== "undefined" ? getGamificationDeviceId() : "";
  const displayName = user?.display_name || [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email?.split("@")[0] || null;

  const civicProgress = useMemo(() => {
    const completedLessonIds = new Set(
      progress
        .filter((p) => p.content_type === "lesson" && p.progress_percent >= 100)
        .map((p) => p.content_id),
    );
    return stages.map((stage) => {
      const total = stage.steps.length;
      const done = stage.steps.filter(
        (s) => s.chapterId && completedLessonIds.has(s.chapterId),
      ).length;
      return {
        id: stage.id,
        title: stage.title,
        badge: stage.badge,
        percent: total ? Math.round((done / total) * 100) : 0,
        done,
        total,
      };
    });
  }, [stages, progress]);

  const xpToNext = g ? (g.level * 100) - g.points : 0;

  return (
    <MotionPage>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {displayName ? `${displayName}'s civic journey` : "Your civic journey"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {displayName ? `Welcome back, ${displayName}. ` : ""}Progress, XP, streaks, badges, and certificates — synced from the server when you learn.
            </p>
          </div>
          {!loading && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <User className="size-3.5" aria-hidden />
              {displayName ? displayName : deviceId ? "Anonymous learner" : "Guest"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          </div>
        ) : null}

        {!loading && g ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-8 space-y-8">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-5" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-widest">Level {g.level}</span>
              </div>
              <p className="mt-2 text-3xl font-black">{g.points} XP</p>
              <p className="text-sm text-muted-foreground">
                {xpToNext > 0 ? `${xpToNext} XP to next level` : "Max tier within current band"}
              </p>
              <Progress
                className="mt-4 h-2"
                value={Math.min(100, (g.points % 100) || (g.points > 0 ? 100 : 0))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon={Flame} label="Streak" value={`${g.streak_days}d`} />
              <StatCard icon={Trophy} label="Badges" value={String(badges.length)} />
              <StatCard icon={Award} label="Certificates" value={String(certificates.length)} />
              <StatCard icon={Route} label="Modules" value={String(civicProgress.length)} />
            </div>

            {civicProgress.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Route className="size-5 text-primary" aria-hidden />
                  Civic modules
                </h2>
                <ul className="mt-3 space-y-3">
                  {civicProgress.map((mod) => (
                    <li
                      key={mod.id}
                      className="rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">
                          <span className="mr-2">{mod.badge}</span>
                          {mod.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {mod.done}/{mod.total} chapters
                        </span>
                      </div>
                      <Progress className="mt-2 h-1.5" value={mod.percent} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Medal className="size-5 text-primary" aria-hidden />
                Badges
              </h2>
              {badges.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete lessons and quests to earn badges.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <li
                      key={badge.slug}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span className="mr-2">{badge.icon || "🏅"}</span>
                      <span className="font-medium">{badge.name}</span>
                      {badge.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {certificates.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Award className="size-5 text-primary" aria-hidden />
                  Certificates
                </h2>
                <ul className="mt-3 space-y-2">
                  {certificates.map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{cert.module_title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(cert.issued_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <ul className="mt-3 space-y-2">
                {progress.slice(0, 12).map((row) => (
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

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/learn">Continue learning</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={Routes.Login}>Sign in to sync devices</Link>
              </Button>
            </div>
          </motion.div>
        ) : null}

        {!loading && !g ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Start a lesson in the Learn Hub — we save progress with your device ID until you sign in.
            </p>
            <Button asChild className="mt-4">
              <Link href="/learn">Open Learn Hub</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </MotionPage>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <Icon className="mx-auto size-5 text-primary" aria-hidden />
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
