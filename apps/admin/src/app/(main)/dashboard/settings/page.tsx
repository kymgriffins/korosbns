"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { adminOrgApi, type OrgConfigWritePayload } from "@/lib/admin-api";

const SOCIAL_PLATFORMS = ["facebook", "twitter", "instagram", "linkedin", "youtube", "whatsapp"] as const;

type SettingsForm = {
  tagline: string;
  mission: string;
  vision: string;
  values: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
  favicon_url: string;
  show_partner_carousel: boolean;
  show_newsletter_signup: boolean;
  footer_note: string;
  socials: Record<string, string>;
};

const emptyForm = (): SettingsForm => ({
  tagline: "",
  mission: "",
  vision: "",
  values: "",
  contact_email: "",
  contact_phone: "",
  contact_whatsapp: "",
  contact_address: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  og_image_url: "",
  favicon_url: "",
  show_partner_carousel: true,
  show_newsletter_signup: true,
  footer_note: "",
  socials: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])),
});

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function OrgSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const cfg = await adminOrgApi.getConfig();
      const socials = Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""]));
      for (const s of cfg.socials ?? []) {
        if (s.platform in socials) socials[s.platform] = s.url || "";
      }
      setForm({
        tagline: cfg.tagline || "",
        mission: cfg.mission || "",
        vision: cfg.vision || "",
        values: (cfg.values ?? []).join(", "),
        contact_email: cfg.contact?.email || "",
        contact_phone: cfg.contact?.phone || "",
        contact_whatsapp: cfg.contact?.whatsapp || "",
        contact_address: cfg.contact?.address || "",
        seo_title: cfg.seo?.title || "",
        seo_description: cfg.seo?.description || "",
        seo_keywords: (cfg.seo?.keywords ?? []).join(", "),
        og_image_url: cfg.seo?.og_image || "",
        favicon_url: cfg.seo?.favicon || "",
        show_partner_carousel: cfg.layout?.show_partner_carousel ?? true,
        show_newsletter_signup: cfg.layout?.show_newsletter_signup ?? true,
        footer_note: cfg.layout?.footer_note || "",
        socials,
      });
      setUpdatedAt(cfg.updated_at || null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load org settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  async function handleSave() {
    setSaving(true);
    try {
      const social_links = SOCIAL_PLATFORMS.filter((p) => form.socials[p]?.trim()).map((platform, order) => ({
        platform,
        url: form.socials[platform].trim(),
        order,
        is_active: true,
      }));

      const payload: OrgConfigWritePayload = {
        tagline: form.tagline,
        mission: form.mission,
        vision: form.vision,
        values: splitCsv(form.values),
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        contact_whatsapp: form.contact_whatsapp,
        contact_address: form.contact_address,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        seo_keywords: splitCsv(form.seo_keywords),
        og_image_url: form.og_image_url,
        favicon_url: form.favicon_url,
        show_partner_carousel: form.show_partner_carousel,
        show_newsletter_signup: form.show_newsletter_signup,
        footer_note: form.footer_note,
        social_links,
      };

      const updated = await adminOrgApi.patchConfig(payload);
      setUpdatedAt(updated.updated_at || null);
      toast.success("Organization settings saved");
      await fetchConfig();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organization Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage global metadata, contact info, and social handles
            {updatedAt ? ` · Updated ${new Date(updatedAt).toLocaleString()}` : ""}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Save Configuration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
          <CardDescription>Tagline, mission, vision, and values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea
                id="mission"
                rows={4}
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea
                id="vision"
                rows={4}
                value={form.vision}
                onChange={(e) => setForm({ ...form, vision: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="values">Core Values (comma-separated)</Label>
            <Input
              id="values"
              value={form.values}
              onChange={(e) => setForm({ ...form, values: e.target.value })}
              placeholder="Transparency, Integrity, Accountability"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp">WhatsApp</Label>
            <Input
              id="contact_whatsapp"
              value={form.contact_whatsapp}
              onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })}
              placeholder="+254700000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_address">Address</Label>
            <Input
              id="contact_address"
              value={form.contact_address}
              onChange={(e) => setForm({ ...form, contact_address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO & Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={form.seo_title}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Input
                id="seo_description"
                value={form.seo_description}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_image_url">OG Image URL</Label>
              <Input
                id="og_image_url"
                type="url"
                value={form.og_image_url}
                onChange={(e) => setForm({ ...form, og_image_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input
                id="favicon_url"
                type="url"
                value={form.favicon_url}
                onChange={(e) => setForm({ ...form, favicon_url: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
            <Input
              id="seo_keywords"
              value={form.seo_keywords}
              onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Handles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={`social_${platform}`} className="capitalize">
                {platform === "twitter" ? "X (Twitter)" : platform}
              </Label>
              <Input
                id={`social_${platform}`}
                type="url"
                value={form.socials[platform] || ""}
                onChange={(e) =>
                  setForm({ ...form, socials: { ...form.socials, [platform]: e.target.value } })
                }
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Partner carousel</Label>
              <p className="text-xs text-muted-foreground">Show partners on the homepage</p>
            </div>
            <Switch
              checked={form.show_partner_carousel}
              onCheckedChange={(v) => setForm({ ...form, show_partner_carousel: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>Newsletter signup</Label>
              <p className="text-xs text-muted-foreground">Show email signup form</p>
            </div>
            <Switch
              checked={form.show_newsletter_signup}
              onCheckedChange={(v) => setForm({ ...form, show_newsletter_signup: v })}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="footer_note">Footer note</Label>
            <Input
              id="footer_note"
              value={form.footer_note}
              onChange={(e) => setForm({ ...form, footer_note: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
