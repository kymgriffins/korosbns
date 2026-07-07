"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FormStatus } from "@/components/citizen/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { citizenApi, type SocialLinkApi } from "@/lib/api-client";
import { useUpdateProfile, useUpsertSocialLink, useDeleteSocialLink } from "@/hooks/use-profile";
import { ProfileAvatarEditor } from "@/components/profile/profile-avatar-editor";

const SOCIAL_PLATFORMS = [
  "linkedin",
  "twitter",
  "x",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
  "github",
  "website",
] as const;

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "authenticated", label: "Signed-in members" },
  { value: "private", label: "Only me" },
] as const;

export function AccountProfileForm() {
  const { user, refreshUser } = useAuth();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { mutateAsync: upsertSocialLink } = useUpsertSocialLink();
  const { mutateAsync: deleteSocialLink } = useDeleteSocialLink();
  const [status, setStatus] = useState("");
  const [statusVariant, setStatusVariant] = useState<"success" | "error" | "info">("info");
  const [saving, setSaving] = useState(false);
  const [socialSaving, setSocialSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkApi[]>([]);
  const [newLink, setNewLink] = useState({ platform: "linkedin", url: "", visibility: "public" });
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    headline: "",
    location: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    profile_visibility: "public",
    allow_discovery: true,
    show_email_publicly: false,
    digest_frequency: "weekly",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      display_name: user.display_name || "",
      bio: user.bio || "",
      headline: user.headline || "",
      location: user.location || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      avatar_url: user.avatar_url || user.avatar || "",
      profile_visibility: user.profile_visibility || "public",
      allow_discovery: user.allow_discovery ?? true,
      show_email_publicly: user.show_email_publicly ?? false,
      digest_frequency: user.digest_frequency || "weekly",
    });
    setSocialLinks(user.social_links || []);
  }, [user]);

  useEffect(() => {
    void citizenApi
      .getSocialLinks()
      .then(setSocialLinks)
      .catch(() => {
        /* use profile payload fallback */
      });
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      await updateProfile({
        display_name: form.display_name,
        bio: form.bio,
        headline: form.headline,
        location: form.location,
        first_name: form.first_name,
        last_name: form.last_name,
        avatar_url: form.avatar_url || null,
        profile_visibility: form.profile_visibility,
        allow_discovery: form.allow_discovery,
        show_email_publicly: form.show_email_publicly,
        digest_frequency: form.digest_frequency,
      });
      await refreshUser();
      setStatus("Profile saved successfully.");
      setStatusVariant("success");
      toast.success("Profile updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setStatus(message);
      setStatusVariant("error");
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url.trim()) return;
    setSocialSaving(true);
    setStatus("");
    try {
      const link = await upsertSocialLink({
        platform: newLink.platform,
        url: newLink.url.trim(),
        visibility: newLink.visibility,
        order: socialLinks.length,
      });
      setSocialLinks((prev) => {
        const without = prev.filter((l) => l.platform !== link.platform);
        return [...without, link].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });
      setNewLink((f) => ({ ...f, url: "" }));
      setStatus("Social link saved.");
      setStatusVariant("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save link";
      setStatus(message);
      setStatusVariant("error");
    } finally {
      setSocialSaving(false);
    }
  };

  const removeSocialLink = async (platform: string) => {
    setSocialSaving(true);
    try {
      await deleteSocialLink(platform);
      setSocialLinks((prev) => prev.filter((l) => l.platform !== platform));
      setStatus(`Removed ${platform} link.`);
      setStatusVariant("success");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not remove link");
      setStatusVariant("error");
    } finally {
      setSocialSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <FormStatus message={status} variant={statusVariant} />

      <form onSubmit={saveProfile} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold">Public profile</h2>
          <p className="text-sm text-muted-foreground">
            Your photo, bio, and social links help other citizens recognise you.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <ProfileAvatarEditor
            avatarUrl={form.avatar_url || null}
            size="lg"
            onAvatarUrlChange={(url) => setForm((f) => ({ ...f, avatar_url: url ?? "" }))}
            onSaved={async () => {
              await refreshUser();
            }}
          />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-xs text-muted-foreground">
              Upload a photo or choose a bitmoji avatar. Images are stored securely on your profile.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              autoComplete="nickname"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              autoComplete="given-name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              autoComplete="family-name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              placeholder="e.g. Youth budget advocate · Nairobi"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              autoComplete="address-level2"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={4}
              placeholder="Tell the community a bit about yourself — your interests, what brought you here, or why budgets matter to you."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile_visibility">Profile visibility</Label>
            <Select
              value={form.profile_visibility}
              onValueChange={(v) => setForm((f) => ({ ...f, profile_visibility: v }))}
            >
              <SelectTrigger id="profile_visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="digest_frequency">Email digest</Label>
            <Select
              value={form.digest_frequency}
              onValueChange={(v) => setForm((f) => ({ ...f, digest_frequency: v }))}
            >
              <SelectTrigger id="digest_frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.allow_discovery}
              onChange={(e) => setForm((f) => ({ ...f, allow_discovery: e.target.checked }))}
              className="rounded border-border"
            />
            Allow others to discover my profile
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.show_email_publicly}
              onChange={(e) => setForm((f) => ({ ...f, show_email_publicly: e.target.checked }))}
              className="rounded border-border"
            />
            Show email on public profile
          </label>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Social links</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your social media profiles so others can follow you. One link per platform.
        </p>

        {socialLinks.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {socialLinks.map((link) => (
              <li
                key={link.platform}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                    {link.platform.charAt(0)}
                  </span>
                  <span className="font-medium capitalize">{link.platform}</span>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-primary hover:underline max-w-[180px] sm:max-w-md"
                >
                  {link.url}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={socialSaving}
                  onClick={() => void removeSocialLink(link.platform)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-card/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your Twitter/X, LinkedIn, Instagram, or other profiles below.
            </p>
          </div>
        )}

        <form onSubmit={addSocialLink} className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="social_platform">Platform</Label>
            <Select
              value={newLink.platform}
              onValueChange={(v) => setNewLink((f) => ({ ...f, platform: v }))}
            >
              <SelectTrigger id="social_platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="social_url">Profile URL</Label>
            <Input
              id="social_url"
              type="url"
              autoComplete="url"
              required
              value={newLink.url}
              onChange={(e) => setNewLink((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>
          <Button type="submit" className="sm:col-span-3" disabled={socialSaving}>
            {socialSaving ? "Saving…" : "Add or update link"}
          </Button>
        </form>
      </section>

      <div className="flex flex-wrap gap-6 rounded-2xl border border-border bg-card p-4 text-sm sm:p-6">
        <Link href={Routes.LearnProfile} className="text-primary hover:underline">
          View my public profile →
        </Link>
        <Link href={Routes.AccountPassword} className="text-muted-foreground hover:text-foreground">
          Change password →
        </Link>
        <Link href={Routes.AccountNotifications} className="text-muted-foreground hover:text-foreground">
          Notification history →
        </Link>
        <Link href={Routes.AccountSignOut} className="text-muted-foreground hover:text-foreground">
          Sign out →
        </Link>
      </div>
    </div>
  );
}
