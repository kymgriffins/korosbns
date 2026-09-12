"use client";

import React from "react";
import { Sparkles, Eye, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  computeBadgeClasses,
  type BadgeShape,
  type BadgeVariant,
  type BadgeColorScheme,
  type BadgeTypography,
  type DesignTokens,
} from "@/lib/design-tokens";

interface DesignTokensStudioEditorProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

export function DesignTokensStudioEditor({
  data,
  onChange,
}: DesignTokensStudioEditorProps) {
  const badges = data?.badges || {
    shape: "pill",
    variant: "soft",
    colorScheme: "emerald",
    typography: "uppercase",
    showDot: true,
  };

  const buttons = data?.buttons || {
    borderRadius: "full",
    defaultElevation: "subtle",
  };

  const typography = data?.typography || {
    eyebrowTracking: "wider",
    headlineWeight: "bold",
  };

  const updateBadgeField = (field: string, value: any) => {
    const next = {
      ...data,
      badges: {
        ...(data?.badges || {}),
        [field]: value,
      },
    };
    onChange(next);
  };

  const updateButtonField = (field: string, value: any) => {
    const next = {
      ...data,
      buttons: {
        ...(data?.buttons || {}),
        [field]: value,
      },
    };
    onChange(next);
  };

  const updateTypographyField = (field: string, value: any) => {
    const next = {
      ...data,
      typography: {
        ...(data?.typography || {}),
        [field]: value,
      },
    };
    onChange(next);
  };

  const currentBadgeClasses = computeBadgeClasses(data as DesignTokens);

  return (
    <div className="space-y-6">
      {/* Live Badge Preview Stage */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">Global Badge Token Designer</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Applies instantly across all marketing &amp; partner pages
          </span>
        </div>

        {/* Real-time Interactive Previews across 3 surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Surface 1: Dark Canvas */}
          <div className="rounded-xl border border-border bg-neutral-950 p-4 space-y-3 flex flex-col justify-center items-start">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Dark Background (Night/Default)
            </span>
            <div className={currentBadgeClasses}>
              {badges.showDot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              <span>Civic Fiscal Intelligence</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Forensic tracking of public finance across 47 Kenyan counties.
            </p>
          </div>

          {/* Surface 2: Elevated Card Surface */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 flex flex-col justify-center items-start">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Card Surface (Component Tier)
            </span>
            <div className={currentBadgeClasses}>
              {badges.showDot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              <span>Verified Programme Block</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standardized section anchor used on programmes &amp; landing.
            </p>
          </div>

          {/* Surface 3: Contrast / Hero Accent Surface */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-3 flex flex-col justify-center items-start">
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Hero Section Banner
            </span>
            <div className={currentBadgeClasses}>
              {badges.showDot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              <span>BNS Studio · Broadcast</span>
            </div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
              Impact documentary productions and budget explainers.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Controls Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shape Picker */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="text-sm font-bold text-foreground">Badge Shape &amp; Corner Radius</h3>
            <p className="text-xs text-muted-foreground">Select the geometric profile of badges across the site.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "pill", label: "Pill Capsule", desc: "Classic rounded-full curve", icon: "💊" },
              { id: "rounded", label: "Rounded", desc: "Modern rounded-lg (8px)", icon: "🔲" },
              { id: "subtle", label: "Subtle Soft", desc: "Gentle rounded-md (4px)", icon: "◻️" },
              { id: "sharp", label: "Sharp / Tech", desc: "Clean 0px terminal edges", icon: "⬛" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateBadgeField("shape", item.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                  badges.shape === item.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/60 bg-muted/20 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{item.label}</span>
                  {badges.shape === item.id && <Check className="size-3.5 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Variant Style Picker */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="text-sm font-bold text-foreground">Visual Style Variant</h3>
            <p className="text-xs text-muted-foreground">Contrast, fill, and glass treatment.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "soft", label: "Soft Tint", desc: "10% tinted fill + gentle border" },
              { id: "outline", label: "Clean Outline", desc: "Transparent fill + crisp border" },
              { id: "solid", label: "Vibrant Solid", desc: "Solid color fill + white text" },
              { id: "glass", label: "Frosted Glass", desc: "Backdrop blur + glass sheen" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateBadgeField("variant", item.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                  badges.variant === item.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/60 bg-muted/20 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{item.label}</span>
                  {badges.variant === item.id && <Check className="size-3.5 text-primary" />}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Picker */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="text-sm font-bold text-foreground">Color Scheme</h3>
            <p className="text-xs text-muted-foreground">Primary color palette applied to badges.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "emerald", label: "Civic Emerald", bg: "bg-emerald-500", text: "Fiscal & Transparency" },
              { id: "brand", label: "Intelligence Indigo", bg: "bg-indigo-500", text: "Tech & Editorial" },
              { id: "amber", label: "Alert Amber", bg: "bg-amber-500", text: "Investigations & Audit" },
              { id: "slate", label: "Editorial Slate", bg: "bg-neutral-500", text: "Monograph & Research" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateBadgeField("colorScheme", item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  badges.colorScheme === item.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/60 bg-muted/20 hover:bg-muted/50"
                }`}
              >
                <span className={`size-4 rounded-full ${item.bg}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{item.text}</div>
                </div>
                {badges.colorScheme === item.id && <Check className="size-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Typography & Pulse Dot */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="text-sm font-bold text-foreground">Typography &amp; Indicator Dot</h3>
            <p className="text-xs text-muted-foreground">Casing, font style, and live pulse dot indicator.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Letter Casing &amp; Font</label>
              <select
                value={badges.typography ?? "uppercase"}
                onChange={(e) => updateBadgeField("typography", e.target.value)}
                className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="uppercase">UPPERCASE (Tracking Wider, 11px Bold)</option>
                <option value="normal">Normal Case (Medium Weight, 12px)</option>
                <option value="mono">Monospace Terminal (Code Font, 11px)</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3">
              <div>
                <div className="text-xs font-bold text-foreground">Live Pulse Dot Indicator</div>
                <div className="text-[11px] text-muted-foreground">
                  Shows an animated pulsing beacon next to the badge text.
                </div>
              </div>
              <input
                type="checkbox"
                checked={badges.showDot ?? true}
                onChange={(e) => updateBadgeField("showDot", e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Button & Typography Global Tokens */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground">Global Button &amp; Eyebrow Rules</h3>
          <p className="text-xs text-muted-foreground">Default radius and typography settings for marketing components.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground">Default Button Corner Radius</label>
            <select
              value={buttons.borderRadius ?? "full"}
              onChange={(e) => updateButtonField("borderRadius", e.target.value)}
              className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
            >
              <option value="full">Pill / Fully Rounded (rounded-full)</option>
              <option value="lg">Soft Rounded (rounded-lg)</option>
              <option value="md">Subtle Rounded (rounded-md)</option>
              <option value="none">Sharp / Flat (rounded-none)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Eyebrow Headline Tracking</label>
            <select
              value={typography.eyebrowTracking ?? "wider"}
              onChange={(e) => updateTypographyField("eyebrowTracking", e.target.value)}
              className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
            >
              <option value="wider">Wider (tracking-wider)</option>
              <option value="normal">Normal (tracking-normal)</option>
              <option value="tight">Tight (tracking-tight)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
