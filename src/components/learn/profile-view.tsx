"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Flame, Sparkles, Award, Globe, Star, Trophy, Lock, Check,
  Pencil, KeyRound, Bell, LogOut, ChevronDown, ShieldCheck, Loader2, LogIn, Download, ExternalLink,
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
import { useGamificationMe, useBadgeCatalog, useCertificates } from "@/hooks/use-gamification";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useChangePassword } from "@/hooks/use-auth-actions";
import { certificateDownloadHrefFromRecord } from "@/lib/certificate-url";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnPageBody,
  LearnPanel,
  LearnStatTile,
} from "@/components/learn/learn-ui-primitives";
import type { Gender } from "./bitmoji-avatar";
import type { CivicModule } from "@/types/learn";
import type { BadgeCatalogEntry, BadgeTier } from "@/types/gamification";

interface ProfileViewProps {
  profile: any;
  stages: CivicModule[];
  onResetProgress: () => void;
  onUpdateProfile: (updated: any) => void;
}

function SectionCard({
  title, icon, children, className,
}: { title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <LearnPanel className={className}>
      {title ? (
        <>
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {icon}
            {title}
          </h3>
          {children}
        </>
      ) : (
        children
      )}
    </LearnPanel>
  );
}

const TIER_STYLES: Record<BadgeTier, { label: string; chip: string }> = {
  none: { label: "", chip: "bg-primary/10 text-primary ring-primary/20" },
  bronze: { label: "Bronze", chip: "bg-orange-500/12 text-orange-700 ring-orange-500/25" },
  silver: { label: "Silver", chip: "bg-slate-400/15 text-slate-600 ring-slate-400/30" },
  gold: { label: "Gold", chip: "bg-amber-400/15 text-amber-700 ring-amber-400/30" },
  platinum: { label: "Platinum", chip: "bg-cyan-500/12 text-cyan-700 ring-cyan-500/25" },
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
        "relative flex flex-col gap-2 rounded-xl border p-3 transition-all",
        isEarned
          ? "border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent shadow-xs"
          : isLocked
            ? "border-border/40 bg-muted/20 opacity-70"
            : "border-primary/20 bg-primary/[0.04]",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-lg ring-1",
            isEarned ? "bg-emerald-500/15 ring-emerald-500/25" : "bg-muted ring-border/40",
            isLocked && "grayscale",
          )}
        >
          {badge.icon || "🏅"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold leading-tight">{badge.name}</p>
          {tier.label && (
            <span className={cn("mt-0.5 inline-block rounded-full px-1.5 py-px text-[8px] font-black uppercase tracking-wider ring-1", tier.chip)}>
              {tier.label}
            </span>
          )}
        </div>
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full text-white shadow",
            isEarned ? "bg-emerald-500" : "bg-muted-foreground/40",
          )}
        >
          {isEarned ? <Check className="size-2.5" /> : <Lock className="size-2.5" />}
        </span>
      </div>

      {isEarned ? (
        badge.earned_at && (
          <p className="text-[9px] text-muted-foreground">
            Earned {new Date(badge.earned_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )
      ) : (
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-700 w-[var(--p)]", isLocked ? "bg-muted-foreground/40" : "bg-primary")}
              style={{ "--p": `${percent}%` } as React.CSSProperties}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${badge.name} progress: ${percent}%`}
            />
          </div>
          <p className="text-[9px] font-semibold text-muted-foreground tabular-nums">
            {badge.progress?.current ?? 0}/{badge.progress?.target ?? 0}
          </p>
        </div>
      )}
    </div>
  );
}

export function ProfileView({ profile, stages, onResetProgress, onUpdateProfile }: ProfileViewProps) {
  const { user, isLoggedIn, loading: authLoading, logout } = useAuth();
  const { data: gamification } = useGamificationMe();
  const { data: badgeCatalog } = useBadgeCatalog();
  const { data: certificatesData } = useCertificates();
  const { mutateAsync: updateProfile, isPending: savingProfile } = useUpdateProfile();
  const { mutateAsync: changePassword, isPending: changingPassword } = useChangePassword();

  const points = gamification?.points ?? profile.sovereigns ?? 0;
  const level = gamification?.level ?? Math.floor(points / 100) + 1;
  const streak = gamification?.streak_days ?? profile.streakDays ?? 0;
  const earnedBadges = gamification?.badges ?? [];
  const xpIntoLevel = points % 100;

  const displayName =
    user?.display_name || user?.break_name || profile.breakName || "Citizen";
  const county = user?.county || profile.county || "Kenya";
  const ward = user?.ward || profile.ward || "";
  const avatarUrl = user?.avatar_url || user?.avatar || profile.avatar_url || null;
  const certificates = certificatesData?.results ?? gamification?.certificates ?? [];

  // Server-driven badge catalog (earned / in_progress / locked + tiers + progress).
  const catalog = badgeCatalog?.results ?? [];
  const hasCatalog = catalog.length > 0;
  const catalogEarned = useMemo(() => catalog.filter((b) => b.state === "earned"), [catalog]);
  const catalogInProgress = useMemo(
    () => catalog.filter((b) => b.state === "in_progress"),
    [catalog],
  );
  const catalogLocked = useMemo(() => catalog.filter((b) => b.state === "locked"), [catalog]);

  // Fallback: client-side module-mastery derivation when the catalog endpoint is empty.
  const moduleBadges = useMemo(
    () =>
      stages.map((stage) => ({
        key: stage.slug,
        emoji: stage.badge,
        name: stage.badgeName || stage.title,
        unlocked: Boolean(profile.badges?.includes(stage.badge)),
      })),
    [stages, profile.badges],
  );
  const moduleEarned = moduleBadges.filter((b) => b.unlocked).length;

  const badgeStatCount = hasCatalog
    ? badgeCatalog?.summary?.earned ?? catalogEarned.length
    : earnedBadges.length + moduleEarned;

  // ── Edit profile ──
  const [editingProfile, setEditingProfile] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(avatarUrl);
  const [localGender, setLocalGender] = useState<Gender | null>((profile.gender as Gender) ?? null);
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
      onUpdateProfile({ ...profile, breakName: form.display_name || profile.breakName, county: form.county, ward: form.ward });
      window.dispatchEvent(new Event("bns-profile-updated"));
      toast.success("Profile updated");
      setEditingProfile(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    }
  };

  // ── Notifications ──
  const notificationsEnabled = user?.notifications_enabled ?? profile.notifications ?? true;
  const whatsappFallback = user?.whatsapp_fallback ?? profile.whatsappFallback ?? false;

  const toggleNotificationSetting = async (
    key: "notifications_enabled" | "whatsapp_fallback",
    value: boolean,
  ) => {
    const localKey = key === "notifications_enabled" ? "notifications" : "whatsappFallback";
    onUpdateProfile({ ...profile, [localKey]: value });
    if (!isLoggedIn) return;
    try {
      await updateProfile({ [key]: value });
      toast.success("Preference saved");
    } catch {
      toast.error("Could not save preference");
    }
  };

  // ── Password ──
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
      await changePassword({ currentPassword: pw.current, newPassword: pw.next });
      toast.success("Password changed");
      setPw({ current: "", next: "", confirm: "" });
      setShowPwForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    }
  };

  return (
    <LearnPageShell navId="profile">
      <LearnPageBody narrow className="space-y-4 md:space-y-5">
      {/* Identity strip */}
      <LearnPanel className="border-primary/15 bg-gradient-to-br from-primary/[0.05] to-card">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="relative shrink-0">
            {authLoading ? (
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted">
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
                className="group relative block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sign in to change profile photo"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="size-16 rounded-2xl border border-border object-cover md:size-20" />
                ) : (
                  <BitmojiAvatar gender={profile.gender} size="xl" className="rounded-2xl border border-border" />
                )}
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                  <LogIn className="size-5 text-white" />
                </span>
              </Link>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-card bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow">
              {level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Citizen profile</p>
            <h2 className="truncate text-lg font-bold leading-tight md:text-xl">{displayName}</h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {county}{ward ? ` · ${ward}` : ""}
            </p>
            {!isLoggedIn && !authLoading && (
              <Link
                href={Routes.Login}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
              >
                <LogIn className="size-3" />
                Sign in to update
              </Link>
            )}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                <span>{points} XP</span>
                <span>{xpIntoLevel}/100 to Lv.{level + 1}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 w-[var(--progress)]"
                  style={{ "--progress": `${xpIntoLevel}%` } as React.CSSProperties}
                  role="progressbar"
                  aria-valuenow={xpIntoLevel}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`XP progress: ${xpIntoLevel}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </LearnPanel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <LearnStatTile label="XP" value={points} icon={Sparkles} />
        <LearnStatTile label="Streak" value={streak} icon={Flame} tone="warm" />
        <LearnStatTile label="Badges" value={badgeStatCount} icon={Award} tone="success" />
        <LearnStatTile label="Level" value={level} icon={Star} tone="accent" />
      </div>

      {hasCatalog ? (
        <>
          {/* Earned achievements (server-driven) */}
          {catalogEarned.length > 0 && (
            <SectionCard title={`Achievements (${catalogEarned.length})`} icon={<Trophy className="size-3" />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {catalogEarned.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* In progress (server-driven progress bars) */}
          {catalogInProgress.length > 0 && (
            <SectionCard title={`In Progress (${catalogInProgress.length})`} icon={<Sparkles className="size-3" />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {catalogInProgress.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Locked badges to discover */}
          {catalogLocked.length > 0 && (
            <SectionCard title={`Locked (${catalogLocked.length})`} icon={<Lock className="size-3" />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {catalogLocked.map((badge) => (
                  <CatalogBadgeCard key={badge.slug} badge={badge} />
                ))}
              </div>
            </SectionCard>
          )}
        </>
      ) : (
        <>
          {/* Fallback: earned achievement badges from /me */}
          {earnedBadges.length > 0 && (
            <SectionCard title={`Achievements (${earnedBadges.length})`} icon={<Trophy className="size-3" />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {earnedBadges.map((badge) => (
                  <div key={badge.slug} className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent p-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-lg ring-1 ring-amber-500/25">
                      {badge.icon || "🏅"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold leading-tight">{badge.name}</p>
                      {badge.awarded_at && (
                        <p className="text-[9px] text-muted-foreground">
                          {new Date(badge.awarded_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Fallback: client-side module mastery badges (earned vs locked) */}
          <SectionCard title={`Module Badges (${moduleEarned}/${moduleBadges.length})`} icon={<Award className="size-3" />}>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:gap-2">
              {moduleBadges.map((b) => (
                <div
                  key={b.key}
                  title={b.unlocked ? `${b.name} — earned` : `${b.name} — locked`}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all",
                    b.unlocked
                      ? "bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                      : "bg-muted/20 opacity-60 ring-1 ring-border/30",
                  )}
                >
                  <div className={cn("text-xl md:text-2xl", !b.unlocked && "grayscale")}>{b.emoji}</div>
                  <p className="line-clamp-1 text-[9px] font-bold leading-tight">{b.name}</p>
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-white shadow",
                      b.unlocked ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  >
                    {b.unlocked ? <Check className="size-2.5" /> : <Lock className="size-2.5" />}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {certificates.length > 0 && (
        <SectionCard title={`Certificates (${certificates.length})`} icon={<Award className="size-3" />}>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <a
                key={cert.id}
                href={certificateDownloadHrefFromRecord(cert)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-lg ring-1 ring-emerald-500/20">
                  📜
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{cert.civic_module_title ?? "Module"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Issued {new Date(cert.issued_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <Download className="size-4 shrink-0 text-primary" />
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50" />
              </a>
            ))}
          </div>
        </SectionCard>
      )}

      {isLoggedIn ? (
        <>
          {/* Account details */}
          <SectionCard>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="size-3" /> Account details
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingProfile((v) => !v)}
                className="h-7 gap-1 rounded-lg text-[11px] font-bold"
              >
                <Pencil className="size-3" /> {editingProfile ? "Cancel" : "Edit"}
              </Button>
            </div>

            {editingProfile ? (
              <form onSubmit={saveProfileDetails} className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="p_display" className="text-xs">Display name</Label>
                  <Input id="p_display" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p_first" className="text-xs">First name</Label>
                  <Input id="p_first" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p_last" className="text-xs">Last name</Label>
                  <Input id="p_last" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p_county" className="text-xs">County</Label>
                  <Input id="p_county" value={form.county} onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p_ward" className="text-xs">Ward</Label>
                  <Input id="p_ward" value={form.ward} onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="sm" disabled={savingProfile} className="rounded-lg text-xs font-bold">
                    {savingProfile ? <><Loader2 className="size-3.5 animate-spin" /> Saving…</> : "Save changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</dt><dd className="font-semibold">{user?.display_name || displayName}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</dt><dd className="truncate font-semibold">{user?.email || "—"}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">County</dt><dd className="font-semibold">{county}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ward</dt><dd className="font-semibold">{ward || "—"}</dd></div>
              </dl>
            )}
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notifications" icon={<Bell className="size-3" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold">Push notifications</h4>
                  <p className="text-[10px] text-muted-foreground">Comment alerts and reminders.</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={(c) => void toggleNotificationSetting("notifications_enabled", c)} />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                <div>
                  <h4 className="text-xs font-bold">WhatsApp fallback</h4>
                  <p className="text-[10px] text-muted-foreground">SMS/WhatsApp if push fails.</p>
                </div>
                <Switch checked={whatsappFallback} onCheckedChange={(c) => void toggleNotificationSetting("whatsapp_fallback", c)} />
              </div>
            </div>
          </SectionCard>

          {/* Password */}
          <SectionCard>
            <button
              type="button"
              onClick={() => setShowPwForm((v) => !v)}
              className="flex w-full items-center justify-between text-left focus-visible:outline-none"
            >
              <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <KeyRound className="size-3" /> Change password
              </h3>
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", showPwForm && "rotate-180")} />
            </button>
            {showPwForm && (
              <form onSubmit={submitPassword} className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pw_current" className="text-xs">Current password</Label>
                  <PasswordInput id="pw_current" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} required />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pw_new" className="text-xs">New password</Label>
                    <PasswordInput id="pw_new" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pw_confirm" className="text-xs">Confirm new</Label>
                    <PasswordInput id="pw_confirm" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} required />
                  </div>
                </div>
                <Button type="submit" size="sm" disabled={changingPassword} className="rounded-lg text-xs font-bold">
                  {changingPassword ? <><Loader2 className="size-3.5 animate-spin" /> Updating…</> : "Update password"}
                </Button>
              </form>
            )}
          </SectionCard>
        </>
      ) : (
        <SectionCard className="border-primary/20 bg-primary/[0.03]">
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              <LogIn className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-black">Sign in to manage your account</h3>
              <p className="mt-1 text-xs text-muted-foreground">Sync progress across devices, edit your details, and secure your badges.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="rounded-lg text-xs font-bold">
                <Link href={Routes.Login}>Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-lg text-xs font-bold">
                <Link href={Routes.JoinUs}>Create account</Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Language */}
      <SectionCard title="Language" icon={<Globe className="size-3" />}>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1 text-xs">
          {(["EN", "SW", "SH"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdateProfile({ ...profile, language: lang })}
              className={cn(
                "rounded-lg py-1.5 font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                profile.language === lang ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {lang === "EN" ? "English" : lang === "SW" ? "Kiswahili" : "Sheng"}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {isLoggedIn && (
          <Button
            type="button"
            variant="outline"
            onClick={() => void logout()}
            className="flex-1 gap-1.5 rounded-xl text-xs font-bold"
          >
            <LogOut className="size-3.5" /> Sign out
          </Button>
        )}
        <button
          onClick={onResetProgress}
          className="flex-1 rounded-xl border border-destructive/20 py-2.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset local progress
        </button>
      </div>
      </LearnPageBody>
    </LearnPageShell>
  );
}
