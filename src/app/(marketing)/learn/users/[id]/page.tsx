"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Globe, Loader2, MapPin, Trophy } from "lucide-react";
import { citizenApi } from "@/lib/api-client";
import { MotionPage } from "@/motion/wrappers";
import { fadeInUp } from "@/motion/variants";
import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";

export default function PublicUserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    void citizenApi
      .getPublicUser(userId)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Profile not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm font-semibold text-destructive">{error || "Profile not available."}</p>
        <Button asChild className="mt-4">
          <Link href={Routes.Learn}>Back to Learn</Link>
        </Button>
      </div>
    );
  }

  const profile = data as Record<string, unknown>;
  const gamification = profile.gamification as Record<string, unknown> | undefined;
  const socialLinks = (profile.social_links as Array<Record<string, unknown>>) || [];

  return (
    <MotionPage>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          href={Routes.Learn}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Learn
        </Link>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar as string}
                  alt=""
                  className="size-20 rounded-full object-cover ring-4 ring-primary/10 sm:size-24"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary sm:size-24">
                  {((profile.display_name as string) || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{profile.display_name as string}</h1>
                {profile.headline ? (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.headline as string}</p>
                ) : null}
                {profile.location ? (
                  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
                    <MapPin className="size-3" aria-hidden />
                    {profile.location as string}
                  </p>
                ) : null}
                {profile.bio ? (
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {profile.bio as string}
                  </p>
                ) : null}
                {socialLinks.length > 0 ? (
                  <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform as string}
                        href={link.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        <Globe className="size-3.5" aria-hidden />
                        {link.platform as string}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {gamification ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{gamification.points as number}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{gamification.level as number}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold">{gamification.streak_days as number}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>
          ) : null}

          {gamification?.badges ? (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="size-5 text-primary" aria-hidden />
                Badges
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {(gamification.badges as Array<Record<string, unknown>>).map((badge) => (
                  <li
                    key={badge.slug as string}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="mr-2">{String(badge.icon || "🏅")}</span>
                    {badge.name as string}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </motion.div>
      </div>
    </MotionPage>
  );
}
