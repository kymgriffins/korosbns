"use client";

import { useCallback, useEffect, useState } from "react";
import { AtSign, Camera, ExternalLink, Globe, Link, Loader2, Plus, Share2, X } from "lucide-react";
import { toast } from "sonner";

import { usePageView } from "@/hooks/use-page-view";
import { userData } from "@/data/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { citizenApi } from "@/lib/api-client";
import type { UserProfileApi, SocialLinkApi } from "@/lib/api-client";

const PLATFORM_ICONS: Record<string, typeof Globe> = {
  twitter: AtSign,
  x: AtSign,
  linkedin: Link,
  github: ExternalLink,
  instagram: Share2,
  youtube: Globe,
  website: Globe,
  facebook: Share2,
  tiktok: ExternalLink,
  medium: Link,
  other: Globe,
};

const PLATFORM_OPTIONS = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "medium", label: "Medium" },
  { value: "other", label: "Other" },
];

export default function AdminProfilePage() {
  usePageView();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileApi | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkApi[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const [addingLink, setAddingLink] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [me, links] = await Promise.all([
        userData.profile.fetch(),
        citizenApi.getSocialLinks(),
      ]);
      setProfile(me);
      setSocialLinks(links);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      if (avatarFile) {
        await citizenApi.patchMeAvatar(avatarFile);
      }
      await citizenApi.patchMe({
        display_name: profile.display_name,
        bio: profile.bio,
        headline: profile.headline,
        location: profile.location,
        profile_visibility: profile.profile_visibility,
      });
      toast.success("Profile saved");
      await fetchProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLink() {
    if (!newLink.platform || !newLink.url.trim()) {
      toast.error("Platform and URL are required");
      return;
    }
    setAddingLink(true);
    try {
      await citizenApi.upsertSocialLink({ platform: newLink.platform, url: newLink.url.trim(), visibility: "public" });
      toast.success("Social link added");
      setNewLink({ platform: "", url: "" });
      const links = await citizenApi.getSocialLinks();
      setSocialLinks(links);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add social link");
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDeleteLink(platform: string) {
    try {
      await citizenApi.deleteSocialLink(platform);
      toast.success("Social link removed");
      setSocialLinks((prev) => prev.filter((l) => l.platform !== platform));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete social link");
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-muted-foreground">Failed to load profile</p>
        <Button variant="outline" onClick={fetchProfile}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your public profile and social media links</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Profile Information</CardTitle>
            <CardDescription>Update your display name, bio, and public details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="size-16 ring-2 ring-border">
                  <AvatarImage src={avatarPreview || profile.avatar_url || ""} />
                  <AvatarFallback className="text-lg">{(profile.display_name || profile.email || "U")[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="size-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{profile.display_name || profile.email}</p>
                <p>Click to change avatar</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input id="display_name" value={profile.display_name || ""} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" value={profile.headline || ""} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} placeholder="e.g. Budget Analyst" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Nairobi, Kenya" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Profile Visibility</Label>
                <Select value={profile.profile_visibility || "public"} onValueChange={(v) => setProfile({ ...profile, profile_visibility: v })}>
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="authenticated">Authenticated Users Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Social Links</CardTitle>
            <CardDescription>Connect your social media accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No social links added yet</p>
            )}
            {socialLinks.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform] || Globe;
              return (
                <div key={link.platform} className="flex items-center gap-3 rounded-lg border p-3">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize truncate">{link.platform}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => handleDeleteLink(link.platform)}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              );
            })}

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Add Link</p>
              <Select value={newLink.platform} onValueChange={(v) => setNewLink({ ...newLink, platform: v })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
              <Button size="sm" className="w-full" onClick={handleAddLink} disabled={addingLink}>
                {addingLink ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                Add Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
