"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Flame,
  Sparkles,
  Award,
  Globe,
  Trophy,
  Pencil,
  KeyRound,
  Bell,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Loader2,
  LogIn,
  Download,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { ProfileAvatarEditor } from "./profile-avatar-editor";
import { cn } from "@/utils";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import {
  useGamificationMe,
  useBadgeCatalog,
  useCertificates,
  useLeaderboard,
  usePointHistory,
} from "@/hooks/use-gamification";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useChangePassword } from "@/hooks/use-auth-actions";
import { certificateDownloadHrefFromRecord } from "@/lib/certificate-url";
import type { Gender } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import { AchievementCard } from "@/components/ui/achievement-card";
import { AchievementGrid } from "@/components/ui/achievement-grid";
import { LeaderboardCard } from "@/components/ui/leaderboard-card";
import { PointsChart } from "@/components/ui/points-chart";
import { StreakCard } from "@/components/ui/streak-card";
import { StreakCalendar } from "@/components/ui/streak-calendar";
import {
  buildPointsChartFromHistory,
  buildStreakPeriods,
  chartLevelMarkers,
  collectActivityDateKeys,
  gamificationProgressRows,
  longestStreakFromDates,
  mapLeaderboardPodium,
  mapLeaderboardRankings,
  mergeAchievements,
} from "@/lib/trophy-profile-data";

interface ProfileViewProps {
  profile: any;
  stages: CivicModule[];
  onResetProgress: () => void;
  onUpdateProfile: (updated: any) => void;
}

function ProfileSection({
  title,
  icon,
  action,
  children,
  className,
}: {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-3">
          {title ? (
            <h2 className="flex items-center gap-1.5 font-heading text-base font-bold tracking-tight">
              {icon}
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function ScoreStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3 text-center sm:py-4">
      <Icon className="size-3.5 text-muted-foreground/70" aria-hidden />
      <p className="font-heading text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {value}
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function ProfileView({
  profile,
  stages,
  onResetProgress,
  onUpdateProfile,
}: ProfileViewProps) {
  const { user, isLoggedIn, loading: authLoading, logout } = useAuth();
  const { data: gamification } = useGamificationMe();
  const { data: badgeCatalog } = useBadgeCatalog();
  const { data: certificatesData } = useCertificates();
  const { data: leaderboardData } = useLeaderboard(20);
  const { data: pointHistoryData } = usePointHistory(120);
  const { mutateAsync: updateProfile, isPending: savingProfile } =
    useUpdateProfile();
  const { mutateAsync: changePassword, isPending: changingPassword } =
    useChangePassword();

  const points = gamification?.points ?? profile.sovereigns ?? 0;
  const level = gamification?.level ?? Math.floor(points / 100) + 1;
  const streak = gamification?.streak_days ?? profile.streakDays ?? 0;
  const earnedBadges = gamification?.badges ?? [];
  const xpIntoLevel = points % 100;
  const xpToNext = 100 - xpIntoLevel;

  const displayName =
    user?.display_name || user?.break_name || profile.breakName || "Citizen";
  const county = user?.county || profile.county || "Kenya";
  const ward = user?.ward || profile.ward || "";
  const avatarUrl =
    user?.avatar_url || user?.avatar || profile.avatar_url || null;

  const leaderboardEntries = leaderboardData?.results ?? [];

  const currentUserKey = displayName;

  const podiumRankings = useMemo(
    () => mapLeaderboardPodium(leaderboardEntries),
    [leaderboardEntries],
  );

  const rankingRows = useMemo(
    () => mapLeaderboardRankings(leaderboardEntries, displayName),
    [leaderboardEntries, displayName],
  );

  const certificates =
    certificatesData?.results ?? gamification?.certificates ?? [];

  const catalog = badgeCatalog?.results ?? [];
  const achievements = useMemo(
    () =>
      mergeAchievements(
        catalog,
        earnedBadges,
        stages,
        profile.badges ?? [],
        gamificationProgressRows(gamification),
      ),
    [catalog, earnedBadges, stages, profile.badges, gamification],
  );

  const highlightedAchievements = useMemo(
    () =>
      achievements
        .filter(
          (a) => a.achievedAt !== null || (a.progress ?? 0) >= 100,
        )
        .slice(0, 3),
    [achievements],
  );

  const activityDates = useMemo(
    () =>
      collectActivityDateKeys(
        gamificationProgressRows(gamification),
        pointHistoryData?.results ?? [],
      ),
    [gamification, pointHistoryData?.results],
  );

  const streakPeriods = useMemo(
    () => buildStreakPeriods(activityDates),
    [activityDates],
  );

  const longestStreak = useMemo(
    () => Math.max(longestStreakFromDates(activityDates), streak),
    [activityDates, streak],
  );

  const pointsChartData = useMemo(
    () =>
      buildPointsChartFromHistory(
        pointHistoryData?.results ?? [],
        points,
      ),
    [pointHistoryData?.results, points],
  );

  const levelMarkers = useMemo(() => chartLevelMarkers(level), [level]);

  const badgeStatCount = catalog.length
    ? (badgeCatalog?.summary?.earned ??
      achievements.filter(
        (a) => a.achievedAt !== null || (a.progress ?? 0) >= 100,
      ).length)
    : achievements.filter(
        (a) => a.achievedAt !== null || (a.progress ?? 0) >= 100,
      ).length;

  const [editingProfile, setEditingProfile] = useState(false);
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(avatarUrl);
  const [localGender, setLocalGender] = useState<Gender | null>(
    (profile.gender as Gender) ?? null,
  );
  useEffect(() => {
    setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);
  const [form, setForm] = useState({
    display_name: "",
    first_name: "",
    last_name: "",
    county: "",
    ward: "",
  });
  useEffect(() => {
    setForm({
      display_name: user?.display_name || profile.breakName || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      county: user?.county || profile.county || "",
      ward: user?.ward || profile.ward || "",
    });
  }, [user, profile.breakName, profile.county, profile.ward]);

  const saveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        display_name: form.display_name,
        first_name: form.first_name,
        last_name: form.last_name,
        county: form.county,
        ward: form.ward,
        location: form.county,
      });
      onUpdateProfile({
        ...profile,
        breakName: form.display_name || profile.breakName,
        county: form.county,
        ward: form.ward,
      });
      window.dispatchEvent(new Event("bns-profile-updated"));
      toast.success("Profile updated");
      setEditingProfile(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update profile",
      );
    }
  };

  const notificationsEnabled =
    user?.notifications_enabled ?? profile.notifications ?? true;
  const whatsappFallback =
    user?.whatsapp_fallback ?? profile.whatsappFallback ?? false;

  const toggleNotificationSetting = async (
    key: "notifications_enabled" | "whatsapp_fallback",
    value: boolean,
  ) => {
    const localKey =
      key === "notifications_enabled" ? "notifications" : "whatsappFallback";
    onUpdateProfile({ ...profile, [localKey]: value });
    if (!isLoggedIn) return;
    try {
      await updateProfile({ [key]: value });
      toast.success("Preference saved");
    } catch {
      toast.error("Could not save preference");
    }
  };

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPwForm, setShowPwForm] = useState(false);
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pw.next !== pw.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: pw.current,
        newPassword: pw.next,
      });
      toast.success("Password changed");
      setPw({ current: "", next: "", confirm: "" });
      setShowPwForm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not change password",
      );
    }
  };

  return (
    <div className="w-full space-y-10 py-10 sm:py-14">
      {/* Identity */}
      <section className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {authLoading ? (
              <div className="flex size-16 items-center justify-center rounded-full bg-muted sm:size-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : isLoggedIn ? (
              <ProfileAvatarEditor
                avatarUrl={localAvatarUrl}
                gender={localGender}
                size="xl"
                onAvatarUrlChange={(url) => {
                  setLocalAvatarUrl(url);
                  onUpdateProfile({ ...profile, avatar_url: url });
                }}
                onGenderChange={(g) => {
                  setLocalGender(g);
                  onUpdateProfile({ ...profile, gender: g });
                }}
                onSaved={(url) => {
                  onUpdateProfile({ ...profile, avatar_url: url });
                  window.dispatchEvent(new Event("bns-profile-updated"));
                }}
              />
            ) : (
              <Link
                href={Routes.Login}
                className="group relative block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sign in to change profile photo"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-16 rounded-full object-cover ring-1 ring-border/60 sm:size-20"
                  />
                ) : (
                  <BitmojiAvatar
                    gender={profile.gender}
                    size="xl"
                    className="rounded-full ring-1 ring-border/60"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45">
                  <LogIn className="size-5 text-white" />
                </span>
              </Link>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background">
              {level}
            </span>
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Account
            </p>
            <h1 className="mt-1 truncate font-heading text-[2rem] font-bold leading-tight tracking-tight sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1.5 truncate text-sm text-muted-foreground">
              {county}
              {ward ? ` · ${ward}` : ""}
              {streak > 0 ? ` · ${streak}-day streak` : ""}
            </p>
            {!isLoggedIn && !authLoading ? (
              <Link
                href={Routes.Login}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <LogIn className="size-3.5" />
                Sign in to update photo
              </Link>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="font-semibold tabular-nums">
              {points.toLocaleString()} XP
            </span>
            <span className="text-muted-foreground">
              {xpToNext} XP to Level {level + 1}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${xpIntoLevel}%` }}
              role="progressbar"
              aria-valuenow={xpIntoLevel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`XP progress: ${xpIntoLevel}%`}
            />
          </div>
        </div>
      </section>

      {/* Streak + points — real gamification API data */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StreakCard
          streak={streakPeriods}
          currentStreak={streak}
          longestStreak={longestStreak}
          total={gamification?.total_progress ?? 0}
          title="Learning streak"
          actionLabel="View calendar"
          onActionClick={() =>
            activitySectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          showHowItWorks
          howItWorksItems={[
            "Complete a lesson, quiz, or module step each day to keep your streak.",
            "Your streak counts consecutive days with learning activity on Budget Ndio Story.",
            "Missing a day resets the streak — sign in to sync progress across devices.",
          ]}
        />
        {pointsChartData.length > 0 ? (
          <PointsChart
            data={pointsChartData}
            title="XP over time"
            yAxisLabel="XP"
            levels={levelMarkers}
            headerRight={
              <span className="figure text-sm font-semibold tabular-nums text-muted-foreground">
                Level {level}
              </span>
            }
          />
        ) : (
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-10 text-center">
            <Sparkles className="mx-auto mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm font-semibold">XP history</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Complete a lesson to start earning XP — your chart will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <section
        aria-label="Profile stats"
        className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-transparent"
      >
        <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0">
          <ScoreStat label="Total XP" value={points.toLocaleString()} icon={Sparkles} />
          <ScoreStat label="Day streak" value={streak} icon={Flame} />
          <ScoreStat label="Badges" value={badgeStatCount} icon={Award} />
          <ScoreStat label="Level" value={level} icon={Trophy} />
        </div>
      </section>

      {leaderboardEntries.length > 0 ? (
        <LeaderboardCard
          title="Community leaderboard"
          fromDate={new Date(new Date().getFullYear(), 0, 1)}
          toDate={new Date()}
          podiumRankings={podiumRankings}
          rankings={rankingRows}
          currentUserId={currentUserKey}
        />
      ) : null}

      {achievements.length > 0 ? (
        highlightedAchievements.length >= 3 ? (
          <AchievementCard
            achievements={achievements}
            highlightedAchievements={highlightedAchievements}
            lockedStyle="grayscale"
          />
        ) : (
          <ProfileSection
            title={`Achievements · ${badgeStatCount} earned`}
            icon={<Trophy className="size-4 text-amber-500" />}
          >
            <AchievementGrid achievements={achievements} columns="auto" badgeSize="default" />
          </ProfileSection>
        )
      ) : null}

      {activityDates.length > 0 ? (
        <div ref={activitySectionRef}>
          <ProfileSection
            title="Activity"
            icon={<Flame className="size-4 text-primary" />}
          >
          <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card p-4">
            <StreakCalendar streak={streakPeriods} view="year" startOfWeek={1} />
          </div>
        </ProfileSection>
        </div>
      ) : null}

      {certificates.length > 0 ? (
        <ProfileSection
          title={`Certificates · ${certificates.length}`}
          icon={<Award className="size-4 text-emerald-600" />}
        >
          <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70">
            {certificates.map((cert) => (
              <li key={cert.id}>
                <a
                  href={certificateDownloadHrefFromRecord(cert)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                    📜
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {cert.civic_module_title ?? "Module"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issued{" "}
                      {new Date(cert.issued_at).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Download className="size-4 shrink-0 text-primary" />
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50" />
                </a>
              </li>
            ))}
          </ul>
        </ProfileSection>
      ) : null}

      {isLoggedIn ? (
        <>
          <ProfileSection
            title="Account details"
            icon={<ShieldCheck className="size-4 text-primary" />}
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingProfile((v) => !v)}
                className="h-8 gap-1.5 rounded-xl text-xs font-bold"
              >
                <Pencil className="size-3.5" />
                {editingProfile ? "Cancel" : "Edit"}
              </Button>
            }
          >
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {editingProfile ? (
                <form
                  onSubmit={saveProfileDetails}
                  className="grid gap-3 p-4 sm:grid-cols-2"
                >
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="p_display" className="text-xs">
                      Display name
                    </Label>
                    <Input
                      id="p_display"
                      value={form.display_name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          display_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p_first" className="text-xs">
                      First name
                    </Label>
                    <Input
                      id="p_first"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, first_name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p_last" className="text-xs">
                      Last name
                    </Label>
                    <Input
                      id="p_last"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, last_name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p_county" className="text-xs">
                      County
                    </Label>
                    <Input
                      id="p_county"
                      value={form.county}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, county: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p_ward" className="text-xs">
                      Ward
                    </Label>
                    <Input
                      id="p_ward"
                      value={form.ward}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, ward: e.target.value }))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={savingProfile}
                      className="h-9 rounded-xl text-xs font-bold"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" /> Saving…
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <dl className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  {[
                    {
                      label: "Name",
                      value: user?.display_name || displayName,
                    },
                    { label: "Email", value: user?.email || "—" },
                    { label: "County", value: county },
                    { label: "Ward", value: ward || "—" },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1 px-4 py-3.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="truncate text-sm font-semibold">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Notifications"
            icon={<Bell className="size-4 text-primary" />}
          >
            <div className="overflow-hidden rounded-2xl border border-border/70">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <h3 className="text-sm font-bold">Push notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Comment alerts and reminders.
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(c) =>
                    void toggleNotificationSetting("notifications_enabled", c)
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3.5">
                <div>
                  <h3 className="text-sm font-bold">WhatsApp fallback</h3>
                  <p className="text-xs text-muted-foreground">
                    SMS/WhatsApp if push fails.
                  </p>
                </div>
                <Switch
                  checked={whatsappFallback}
                  onCheckedChange={(c) =>
                    void toggleNotificationSetting("whatsapp_fallback", c)
                  }
                />
              </div>
            </div>
          </ProfileSection>

          <ProfileSection>
            <div className="overflow-hidden rounded-2xl border border-border/70">
              <button
                type="button"
                onClick={() => setShowPwForm((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-1.5 font-heading text-base font-bold">
                  <KeyRound className="size-4 text-primary" />
                  Change password
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    showPwForm && "rotate-180",
                  )}
                />
              </button>
              {showPwForm ? (
                <form
                  onSubmit={submitPassword}
                  className="space-y-3 border-t border-border/60 p-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="pw_current" className="text-xs">
                      Current password
                    </Label>
                    <PasswordInput
                      id="pw_current"
                      autoComplete="current-password"
                      value={pw.current}
                      onChange={(e) =>
                        setPw((p) => ({ ...p, current: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="pw_new" className="text-xs">
                        New password
                      </Label>
                      <PasswordInput
                        id="pw_new"
                        autoComplete="new-password"
                        value={pw.next}
                        onChange={(e) =>
                          setPw((p) => ({ ...p, next: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pw_confirm" className="text-xs">
                        Confirm new
                      </Label>
                      <PasswordInput
                        id="pw_confirm"
                        autoComplete="new-password"
                        value={pw.confirm}
                        onChange={(e) =>
                          setPw((p) => ({ ...p, confirm: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={changingPassword}
                    className="h-9 rounded-xl text-xs font-bold"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Updating…
                      </>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </form>
              ) : null}
            </div>
          </ProfileSection>
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-primary/35 bg-primary/[0.04] px-5 py-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <LogIn className="size-5 text-primary" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight">
            Sign in to manage your account
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Sync progress across devices, edit your details, and keep your
            badges safe.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button asChild className="h-10 rounded-xl font-bold">
              <Link href={Routes.Login}>Sign in</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl font-bold"
            >
              <Link href={Routes.JoinUs}>Create account</Link>
            </Button>
          </div>
        </section>
      )}

      <ProfileSection
        title="Language"
        icon={<Globe className="size-4 text-primary" />}
      >
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border/70 bg-muted/40 p-1">
          {(["EN", "SW", "SH"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onUpdateProfile({ ...profile, language: lang })}
              className={cn(
                "rounded-xl py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                profile.language === lang
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {lang === "EN"
                ? "English"
                : lang === "SW"
                  ? "Kiswahili"
                  : "Sheng"}
            </button>
          ))}
        </div>
      </ProfileSection>

      <div className="flex flex-col gap-2 pb-2 sm:flex-row">
        {isLoggedIn ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => void logout()}
            className="h-11 flex-1 gap-1.5 rounded-xl text-sm font-bold"
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        ) : null}
        <button
          type="button"
          onClick={onResetProgress}
          className="h-11 flex-1 rounded-xl border border-destructive/25 text-sm font-bold text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset local progress
        </button>
      </div>
    </div>
  );
}
