"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { usePageView } from "@/hooks/use-page-view";
import { userData } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { citizenApi } from "@/lib/api-client";

export default function AdminPrivacyPage() {
  usePageView();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    profile_visibility: "public",
    allow_discovery: true,
    show_email_publicly: false,
    notifications_enabled: true,
    digest_frequency: "weekly",
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const me = await userData.profile.fetch();
      setSettings({
        profile_visibility: me.profile_visibility || "public",
        allow_discovery: me.allow_discovery ?? true,
        show_email_publicly: me.show_email_publicly ?? false,
        notifications_enabled: me.notifications_enabled ?? true,
        digest_frequency: me.digest_frequency || "weekly",
      });
    } catch {
      toast.error("Failed to load privacy settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  async function handleSave() {
    setSaving(true);
    try {
      await citizenApi.patchMe({
        profile_visibility: settings.profile_visibility,
        allow_discovery: settings.allow_discovery,
        show_email_publicly: settings.show_email_publicly,
        notifications_enabled: settings.notifications_enabled,
        digest_frequency: settings.digest_frequency,
      });
      toast.success("Privacy settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save privacy settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
        <p className="text-sm text-muted-foreground">Manage your privacy and data sharing preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control who can see your profile and how your data is used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select value={settings.profile_visibility} onValueChange={(v) => setSettings({ ...settings, profile_visibility: v })}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public — Anyone can see my profile</SelectItem>
                <SelectItem value="authenticated">Authenticated — Only logged-in users</SelectItem>
                <SelectItem value="private">Private — Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Discovery</Label>
                <p className="text-xs text-muted-foreground">Let others find you by name in search</p>
              </div>
              <Switch checked={settings.allow_discovery} onCheckedChange={(v) => setSettings({ ...settings, allow_discovery: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Email Publicly</Label>
                <p className="text-xs text-muted-foreground">Display your email address on your public profile</p>
              </div>
              <Switch checked={settings.show_email_publicly} onCheckedChange={(v) => setSettings({ ...settings, show_email_publicly: v })} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive email notifications about activity</p>
              </div>
              <Switch checked={settings.notifications_enabled} onCheckedChange={(v) => setSettings({ ...settings, notifications_enabled: v })} />
            </div>
            {settings.notifications_enabled && (
              <div className="space-y-2">
                <Label>Digest Frequency</Label>
                <Select value={settings.digest_frequency} onValueChange={(v) => setSettings({ ...settings, digest_frequency: v })}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
