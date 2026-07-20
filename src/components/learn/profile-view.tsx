"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Flame,
  Sparkles,
  Award,
  Globe,
  Trophy,
  Lock,
  Check,
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
import { getModuleEmoji } from "@/lib/learn-module-display";
import { useAuth } from "@/contexts/auth-context";
import {
  useGamificationMe,
  useBadgeCatalog,
  useCertificates,
} from "@/hooks/use-gamification";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useChangePassword } from "@/hooks/use-auth-actions";
import { certificateDownloadHrefFromRecord } from "@/lib/certificate-url";
import type { Gender } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import type { BadgeCatalogEntry, BadgeTier } from "@/types/gamification";

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

const TIER_STYLES: Record<BadgeTier, { label: string; chip: string }> = {
  none: { label: "", chip: "bg-primary/10 text-primary" },
  bronze: {
    label: "Bronze",
    chip: "bg-orange-500/12 text-orange-700",
  },
  silver: {
    label: "Silver",
    chip: "bg-slate-400/15 text-slate-600",
  },
  gold: {
    label: "Gold",
    chip: "bg-amber-400/15 text-amber-700",
  },
  platinum: {
    label: "Platinum",
    chip: "bg-cyan-500/12 text-cyan-700",
  },
};

function CatalogBadgeCard({ badge }: { badge: BadgeCatalogEntry }) {
  const tier = TIER_STYLES[badge.tier] ?? TIER_STYLES.none;
  const isEarned = badge.state === "earned";
  const isLocked = badge.state === "locked";
  const percent = Math.max(0, Math.min(100, badge.progress?.percent ?? 0));

  return (
    <div
      title={`${badge.name} — ${badge.state.replace("_", " ")}`}
      className={cn(
        "relative flex flex-col gap-2.5 rounded-2xl border p-3.5 transition-colors",
        isEarned
          ? "border-emerald-500/25 bg-emerald-500/[0.06]"
          : isLocked
            ? "border-border/50 bg-muted/20 opacity-70"
            : "border-border/70 bg-card",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-lg",
            isEarned ? "bg-emerald-500/15" : "bg-muted",
            isLocked && "grayscale",
          )}
        >
          {badge.icon || "🏅"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold leading-tight">{badge.name}</p>
          {tier.label ? (
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wider",
                tier.chip,
              )}
            >
              {tier.label}
            </span>
          ) : null}
        </div>
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full text-white",
            isEarned ? "bg-emerald-500" : "bg-muted-foreground/35",
          )}
        >
          {isEarned ? (
            <Check className="size-2.5" />
          ) : (
            <Lock className="size-2.5" />
          )}
        </span>
      </div>

      {isEarned ? (
        badge.earned_at ? (
          <p className="text-[11px] text-muted-foreground">
            Earned{" "}
            {new Date(badge.earned_at).toLocaleDateString("en-KE", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        ) : null
      ) : (
        <div className="space-y-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                isLocked ? "bg-muted-foreground/40" : "bg-primary",
              )}
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${badge.name} progress: ${percent}%`}
            />
          </div>
          <p className="text-[11px] font-semibold tabular-nums text-muted-foreground">
            {badge.progress?.current ?? 0}/{badge.progress?.target ?? 0}
          </p>
        </div>
      )}
    </div>
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
  const certificates =
    certificatesData?.results ?? gamification?.certificates ?? [];

  const catalog = badgeCatalog?.results ?? [];
  const hasCatalog = catalog.length > 0;
  const catalogEarned = useMemo(
    () => catalog.filter((b) => b.state === "earned"),
    [catalog],
  );
  const catalogInProgress = useMemo(
    () => catalog.filter((b) => b.state === "in_progress"),
    [catalog],
  );
  const catalogLocked = useMemo(
    () => catalog.filter((b) => b.state === "locked"),
    [catalog],
  );

  const moduleBadges = useMemo(
    () =>
      stages.map((stage) => ({
        key: stage.slug,
        emoji: getModuleEmoji(stage.badge),
        name: stage.badgeName || stage.title,
        unlocked: Boolean(profile.badges?.includes(stage.badge)),
      })),
    [stages, profile.badges],
  );
  const moduleEarned = moduleBadges.filter((b) => b.unlocked).length;

  const badgeStatCount = hasCatalog
    ? (badgeCatalog?.summary?.earned ?? catalogEarned.length)
    : earnedBadges.length + moduleEarned;

  const [editingProfile, setEditingProfile] = useState(false);
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
    <div className="mx-auto w-full max-w-2xl space-y-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
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

      {/* Badges */}
      {hasCatalog ? (
        <>
          {catalogEarned.length > 0 ? (
            <ProfileSection
              title={`Achievements · ${catalogEarned.length}`}
              icon={<Trophy className="size-4 text-amber-500" />}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {catalogEarned.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </ProfileSection>
          ) : null}
          {catalogInProgress.length > 0 ? (
            <ProfileSection
              title={`In progress · ${catalogInProgress.length}`}
              icon={<Sparkles className="size-4 text-primary" />}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {catalogInProgress.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </ProfileSection>
          ) : null}
          {catalogLocked.length > 0 ? (
            <ProfileSection
              title={`Locked · ${catalogLocked.length}`}
              icon={<Lock className="size-4 text-muted-foreground" />}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {catalogLocked.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </ProfileSection>
          ) : null}
        </>
      ) : (
        <>
          {earnedBadges.length > 0 ? (
            <ProfileSection
              title={`Achievements · ${earnedBadges.length}`}
              icon={<Trophy className="size-4 text-amber-500" />}
            >
              <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70">
                {earnedBadges.map((badge) => (
                  <li
                    key={badge.slug}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                      {badge.icon || "🏅"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{badge.name}</p>
                      {badge.awarded_at ? (
                        <p className="text-xs text-muted-foreground">
                          {new Date(badge.awarded_at).toLocaleDateString(
                            "en-KE",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          ) : null}

          <ProfileSection
            title={`Module badges · ${moduleEarned}/${moduleBadges.length}`}
            icon={<Award className="size-4 text-primary" />}
          >
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {moduleBadges.map((b) => (
                <div
                  key={b.key}
                  title={b.unlocked ? `${b.name} — earned` : `${b.name} — locked`}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center",
                    b.unlocked
                      ? "border-primary/25 bg-primary/[0.04]"
                      : "border-border/50 bg-muted/20 opacity-65",
                  )}
                >
                  <div
                    className={cn(
                      "text-2xl",
                      !b.unlocked && "grayscale",
                    )}
                  >
                    {b.emoji}
                  </div>
                  <p className="line-clamp-2 text-[10px] font-bold leading-tight">
                    {b.name}
                  </p>
                  <span
                    className={cn(
                      "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full text-white",
                      b.unlocked ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  >
                    {b.unlocked ? (
                      <Check className="size-2.5" />
                    ) : (
                      <Lock className="size-2.5" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </ProfileSection>
        </>
      )}

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
