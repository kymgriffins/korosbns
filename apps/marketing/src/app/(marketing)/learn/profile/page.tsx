"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Globe,
  Loader2,
  MapPin,
  Settings,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/constants/routes";
import { learnHubApi, type LearnProfileResponse } from "@/lib/learn-hub";
import { citizenApi, type SocialLinkApi, type UserProfileApi } from "@/lib/api-client";
import { MotionPage } from "@/motion/wrappers";
import { fadeInUp } from "@/motion/variants";
import { motion } from "motion/react";
import { Button } from "@/ui/button";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  website: Globe,
};

export default function LearnProfilePage() {
  const [data, setData] = useState<LearnProfileResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileApi | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      learnHubApi.profile(),
      citizenApi.getMe().catch(() => null),
      citizenApi.getSocialLinks().catch(() => [] as SocialLinkApi[]),
    ]).then(([d, p, s]) => {
      setData(d);
      setProfile(p);
      setSocialLinks(s);
    }).finally(() => setLoading(false));
  }, []);

  const g = data?.gamification;
  const displayName =
    profile?.display_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.email?.split("@")[0] ||
    "Learner";

  return (
    <MotionPage>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          </div>
        ) : null}

        {!loading ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            {/* Profile card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="size-20 rounded-full object-cover ring-4 ring-primary/10 sm:size-24"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary sm:size-24">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {profile?.headline ? (
                    <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
                  ) : null}
                  {profile?.location ? (
                    <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
                      <MapPin className="size-3" aria-hidden />
                      {profile.location}
                    </p>
                  ) : null}
                  {profile?.email ? (
                    <p className="mt-1 text-xs text-muted-foreground">{profile.email}</p>
                  ) : null}
                  {profile?.bio ? (
                    <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {profile.bio}
                    </p>
                  ) : null}
                  {/* Social links */}
                  {socialLinks.length > 0 ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                      {socialLinks.map((link) => {
                        const Icon = SOCIAL_ICONS[link.platform] || Globe;
                        return (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                          >
                            <Icon className="size-3.5" aria-hidden />
                            {link.platform}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                  <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Link href={Routes.Account}>
                        <Settings className="mr-1.5 size-3.5" aria-hidden />
                        Edit profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamification stats */}
            {g ? (
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
            ) : null}

            {/* Badges */}
            {g ? (
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
            ) : null}

            {/* Recent progress */}
            {data?.progress && data.progress.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold">Recent progress</h2>
                <ul className="mt-3 space-y-2">
                  {data.progress.slice(0, 10).map((row) => (
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
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </MotionPage>
  );
}
