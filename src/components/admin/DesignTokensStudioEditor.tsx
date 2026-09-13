"use client";

import React from "react";
import { Sparkles, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColorFieldControl } from "./ColorFieldControl";
import defaultTokens from "@/content/design-tokens.json";
import {
  computeBadgeClasses,
  designTokensToCssVars,
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
    primaryBg: "#0055FF",
    primaryFg: "#FFFFFF",
    primaryHoverBg: "#0044CC",
    outlineBg: "#FFFFFF",
    outlineFg: "#000000",
    outlineBorder: "rgba(0, 0, 0, 0.12)",
  };

  const brand = data?.brand || {
    primary: "#0055FF",
    primaryForeground: "#FFFFFF",
    accent: "#0055FF",
    background: "#FFFFFF",
    foreground: "#000000",
    muted: "#F5F5F5",
    card: "#FFFFFF",
    border: "rgba(0, 0, 0, 0.12)",
    surfaceMuted: "#F5F5F5",
  };

  const radii = data?.radii || {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    card: "1.5rem",
    button: "9999px",
    image: "1rem",
  };

  const typography = data?.typography || {
    eyebrowTracking: "wider",
    headlineWeight: "bold",
  };

  const updateBadgeField = (field: string, value: any) => {
    onChange({
      ...data,
      badges: { ...(data?.badges || {}), [field]: value },
    });
  };

  const updateButtonField = (field: string, value: any) => {
    onChange({
      ...data,
      buttons: { ...(data?.buttons || {}), [field]: value },
    });
  };

  const updateBrandField = (field: string, value: string) => {
    onChange({
      ...data,
      brand: { ...(data?.brand || {}), [field]: value },
    });
  };

  const updateRadiusField = (field: string, value: string) => {
    onChange({
      ...data,
      radii: { ...(data?.radii || {}), [field]: value },
    });
  };

  const updateTypographyField = (field: string, value: any) => {
    onChange({
      ...data,
      typography: { ...(data?.typography || {}), [field]: value },
    });
  };

  const currentBadgeClasses = computeBadgeClasses(data as DesignTokens);
  const previewCss = designTokensToCssVars(data as DesignTokens);
  const programmePresets = {
    ...((defaultTokens as DesignTokens).programmePresets || {}),
    ...(data?.programmePresets || {}),
  };

  return (
    <div className="space-y-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `.cms-token-preview{${previewCss}}`,
        }}
      />
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

      {/* Brand agency colors */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground">Brand Agency Colors</h3>
          <p className="text-xs text-muted-foreground">
            Hex or CSS color values. Applied sitewide as CSS variables after save.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorFieldControl
            label="Primary"
            value={brand.primary ?? "#0055FF"}
            onChange={(v) => updateBrandField("primary", v)}
          />
          <ColorFieldControl
            label="Primary foreground (text on primary)"
            value={brand.primaryForeground ?? "#FFFFFF"}
            onChange={(v) => updateBrandField("primaryForeground", v)}
          />
          <ColorFieldControl
            label="Accent"
            value={brand.accent ?? brand.primary ?? "#0055FF"}
            onChange={(v) => updateBrandField("accent", v)}
          />
          <ColorFieldControl
            label="Background"
            value={brand.background ?? "#FFFFFF"}
            onChange={(v) => updateBrandField("background", v)}
          />
          <ColorFieldControl
            label="Foreground (body text)"
            value={brand.foreground ?? "#000000"}
            onChange={(v) => updateBrandField("foreground", v)}
          />
          <ColorFieldControl
            label="Muted surface"
            value={brand.muted ?? "#F5F5F5"}
            onChange={(v) => updateBrandField("muted", v)}
          />
          <ColorFieldControl
            label="Card surface"
            value={brand.card ?? "#FFFFFF"}
            onChange={(v) => updateBrandField("card", v)}
          />
          <ColorFieldControl
            label="Border"
            value={brand.border ?? "rgba(0, 0, 0, 0.12)"}
            onChange={(v) => updateBrandField("border", v)}
            description="Supports hex or rgba()"
          />
        </div>
      </div>

      {/* Radii */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground">Border Radius Scale</h3>
          <p className="text-xs text-muted-foreground">
            Use rem or px values (e.g. 1rem, 16px, 9999px for pills).
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              ["sm", "Small"],
              ["md", "Medium"],
              ["lg", "Large (base)"],
              ["xl", "XL"],
              ["2xl", "2XL"],
              ["card", "Cards"],
              ["button", "Buttons"],
              ["image", "Images"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-semibold text-foreground">{label}</label>
              <Input
                value={radii[key] ?? ""}
                onChange={(e) => updateRadiusField(key, e.target.value)}
                className="h-9 font-mono text-xs"
                placeholder="1rem"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Button fills + typography */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground">Button Fills &amp; Eyebrow Rules</h3>
          <p className="text-xs text-muted-foreground">
            Primary buttons always get a solid background from these tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorFieldControl
            label="Primary button background"
            value={buttons.primaryBg ?? brand.primary ?? "#0055FF"}
            onChange={(v) => updateButtonField("primaryBg", v)}
          />
          <ColorFieldControl
            label="Primary button text"
            value={buttons.primaryFg ?? "#FFFFFF"}
            onChange={(v) => updateButtonField("primaryFg", v)}
          />
          <ColorFieldControl
            label="Primary button hover"
            value={buttons.primaryHoverBg ?? "#0044CC"}
            onChange={(v) => updateButtonField("primaryHoverBg", v)}
          />
          <ColorFieldControl
            label="Outline button background"
            value={buttons.outlineBg ?? "#FFFFFF"}
            onChange={(v) => updateButtonField("outlineBg", v)}
          />
          <div>
            <label className="text-xs font-semibold text-foreground">Preset corner radius</label>
            <select
              value={buttons.borderRadius ?? "full"}
              onChange={(e) => updateButtonField("borderRadius", e.target.value)}
              className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
            >
              <option value="full">Pill / Fully Rounded</option>
              <option value="lg">Soft Rounded</option>
              <option value="md">Subtle Rounded</option>
              <option value="none">Sharp / Flat</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Eyebrow tracking</label>
            <select
              value={typography.eyebrowTracking ?? "wider"}
              onChange={(e) => updateTypographyField("eyebrowTracking", e.target.value)}
              className="w-full mt-1 text-xs rounded-lg border border-border bg-background px-3 py-2"
            >
              <option value="wider">Wider</option>
              <option value="normal">Normal</option>
              <option value="tight">Tight</option>
            </select>
          </div>
        </div>

        <div className="cms-token-preview rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-full">
            Live button preview
          </span>
          <span className="inline-flex items-center justify-center rounded-[var(--brand-button-radius,9999px)] bg-[var(--brand-button-bg,var(--primary))] px-6 py-2.5 text-sm font-semibold text-[var(--brand-button-fg,var(--primary-foreground))]">
            Primary CTA
          </span>
          <span className="inline-flex items-center justify-center rounded-[var(--brand-button-radius,9999px)] border border-[var(--brand-button-outline-border,var(--border))] bg-[var(--brand-button-outline-bg,var(--background))] px-6 py-2.5 text-sm font-semibold text-[var(--brand-button-outline-fg,var(--foreground))]">
            Outline CTA
          </span>
        </div>
      </div>

      {/* Programme colour themes — assign per Connect / Mashinani / etc. */}
      {/* Programme colour themes — assign per Connect / Mashinani / etc. */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground">Layout tokens</h3>
          <p className="text-xs text-muted-foreground">
            Default hero sizing and featured evidence layout. Programme desks can still override per page.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Default hero aspect</label>
            <select
              value={data?.layout?.heroAspect ?? "16/10"}
              onChange={(e) =>
                onChange({
                  ...data,
                  layout: { ...(data?.layout || {}), heroAspect: e.target.value },
                })
              }
              className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="16/10">16:10</option>
              <option value="16/9">16:9</option>
              <option value="4/3">4:3</option>
              <option value="1/1">1:1</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Default featured layout</label>
            <select
              value={data?.layout?.featuredLayout ?? "grid"}
              onChange={(e) =>
                onChange({
                  ...data,
                  layout: { ...(data?.layout || {}), featuredLayout: e.target.value },
                })
              }
              className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="grid">Tile grid</option>
              <option value="list">Editorial list</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Featured columns</label>
            <select
              value={String(data?.layout?.featuredColumns ?? 3)}
              onChange={(e) =>
                onChange({
                  ...data,
                  layout: {
                    ...(data?.layout || {}),
                    featuredColumns: Number(e.target.value),
                  },
                })
              }
              className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Footer background</label>
            <select
              value={data?.layout?.footerBackground ?? "muted"}
              onChange={(e) =>
                onChange({
                  ...data,
                  layout: { ...(data?.layout || {}), footerBackground: e.target.value },
                })
              }
              className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="muted">Grey (muted)</option>
              <option value="background">Background</option>
              <option value="card">Card</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border/50 pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Programme colour themes
          </h3>
          <p className="text-xs text-muted-foreground">
            Named palettes you can assign on each programme desk (Colour Theme tab). Edit swatches here, then open Connect / Mashinani / Wanahabari to apply.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(programmePresets).map(([id, preset]: [string, any]) => (
            <div key={id} className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={preset.label ?? id}
                  onChange={(e) => {
                    onChange({
                      ...data,
                      programmePresets: {
                        ...programmePresets,
                        [id]: { ...preset, label: e.target.value },
                      },
                    });
                  }}
                  className="h-8 text-xs font-bold"
                />
                <span className="font-mono text-[10px] text-muted-foreground">{id}</span>
              </div>
              <Input
                value={preset.description ?? ""}
                onChange={(e) => {
                  onChange({
                    ...data,
                    programmePresets: {
                      ...programmePresets,
                      [id]: { ...preset, description: e.target.value },
                    },
                  });
                }}
                className="h-7 text-[11px]"
                placeholder="Short description"
              />
              <div className="grid grid-cols-2 gap-2">
                <ColorFieldControl
                  label="Primary"
                  value={preset.brand?.primary ?? "#0055FF"}
                  onChange={(v) => {
                    onChange({
                      ...data,
                      programmePresets: {
                        ...programmePresets,
                        [id]: {
                          ...preset,
                          brand: { ...(preset.brand || {}), primary: v, accent: v },
                          buttons: {
                            ...(preset.buttons || {}),
                            primaryBg: v,
                          },
                        },
                      },
                    });
                  }}
                />
                <ColorFieldControl
                  label="Button hover"
                  value={preset.buttons?.primaryHoverBg ?? "#0044CC"}
                  onChange={(v) => {
                    onChange({
                      ...data,
                      programmePresets: {
                        ...programmePresets,
                        [id]: {
                          ...preset,
                          buttons: { ...(preset.buttons || {}), primaryHoverBg: v },
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
