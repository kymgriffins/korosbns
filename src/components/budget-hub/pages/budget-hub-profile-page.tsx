"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  ChevronRight,
  Flame,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { Routes } from "@/constants/routes";
import { learningData } from "@/data/learning";
import { userData } from "@/data/users";
import { citizenApi, type SocialLinkApi, type UserProfileApi } from "@/lib/api-client";
import { usePageView } from "@/hooks/use-page-view";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const SOCIAL_LABELS: Record<string, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
};

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-[var(--bh-border)] bg-[var(--bh-surface)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function BudgetHubProfilePage() {
  usePageView();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileApi | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkApi[]>([]);
  const [gamification, setGamification] = useState<
    Awaited<ReturnType<typeof learningData.profile.fetch>>["gamification"] | null
  >(null);
  const [progress, setProgress] = useState<
    Awaited<ReturnType<typeof learningData.profile.fetch>>["progress"]
  >([]);

  useEffect(() => {
    void Promise.all([
      learningData.profile.fetch(),
      userData.profile.fetch().catch(() => null),
      citizenApi.getSocialLinks().catch(() => [] as SocialLinkApi[]),
    ])
      .then(([learnProfile, userProfile, links]) => {
        setGamification(learnProfile?.gamification ?? null);
        setProgress(learnProfile?.progress ?? []);
        setProfile(userProfile);
        setSocialLinks(links);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = useMemo(() => {
    if (!profile) return "Learner";
    return (
      profile.display_name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() ||
      profile.email?.split("@")[0] ||
      "Learner"
    );
  }, [profile]);

  const badges = gamification?.badges ?? [];
  const recent = progress.slice(0, 8);

  return (
    <div className="budget-hub pb-[var(--bh-section-y)]">
      <BudgetHubPage className="space-y-6 py-6 md:py-10">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)]"
            >
              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--bh-accent-warm)]">
                  Profile
                </p>
                <div className="mt-4 flex items-start gap-4">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="size-16 rounded-full object-cover ring-2 ring-[var(--bh-border)]"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate text-2xl font-semibold tracking-tight">
                      {displayName}
                    </h1>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {profile?.headline || "Your civic learning profile and achievements."}
                    </p>
                    {profile?.location ? (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {profile.location}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {socialLinks.slice(0, 6).map((link) => (
                    <a
                      key={`${link.platform}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[var(--bh-border)] bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {SOCIAL_LABELS[link.platform] ?? link.platform}
                    </a>
                  ))}
                  {socialLinks.length === 0 ? (
                    <span className="rounded-full border border-dashed border-[var(--bh-border)] px-3 py-1.5 text-xs text-muted-foreground">
                      Add social links in account settings
                    </span>
                  ) : null}
                </div>
                <div className="mt-5">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={Routes.Account}>
                      Edit account
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard icon={Sparkles} label="XP" value={gamification?.points ?? 0} />
              <MetricCard icon={Flame} label="Streak" value={gamification?.streak_days ?? 0} />
              <MetricCard icon={Trophy} label="Level" value={gamification?.level ?? 1} />
              <MetricCard icon={Award} label="Badges" value={badges.length} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Badges</h2>
                <Link href={Routes.LearnProfile} className="text-sm text-muted-foreground hover:text-foreground">
                  View all
                </Link>
              </div>
              <div className="flex snap-x gap-3 overflow-x-auto pb-1">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <article
                      key={badge.slug}
                      className="budget-hub-card-hover min-w-[160px] snap-start rounded-xl border border-[var(--bh-border)] bg-[var(--bh-surface)] p-3"
                    >
                      <p className="text-2xl">{badge.icon || "🏅"}</p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold">{badge.name}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {badge.awarded_at
                          ? `Earned ${new Date(badge.awarded_at).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}`
                          : "Achievement badge"}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="w-full rounded-xl border border-dashed border-[var(--bh-border)] p-4 text-sm text-muted-foreground">
                    No badges yet. Complete journeys and quests to unlock achievements.
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Recent progress</h2>
              <div className="space-y-2">
                {recent.length > 0 ? (
                  recent.map((row) => (
                    <div
                      key={`${row.content_type}-${row.content_id}`}
                      className="rounded-xl border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium capitalize">{row.content_type}</p>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {row.progress_percent}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full bg-foreground transition-all")}
                          style={{ width: `${Math.max(0, Math.min(100, row.progress_percent))}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--bh-border)] p-4 text-sm text-muted-foreground">
                    Start a lesson to see progress here.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </BudgetHubPage>
    </div>
  );
}
