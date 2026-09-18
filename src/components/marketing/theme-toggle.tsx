"use client";

import {
  Palette,
  Check,
  BookOpen,
  Film,
  Square,
  Compass,
  Home,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Globe,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { toast } from "sonner";
import { STRUCTURES, PALETTE_SWATCHES, resolveTheme, type ThemeStructure } from "@/lib/theme-registry";

export const NAV_CONTROL_SIZE = "h-9 min-w-[2.25rem] px-2";
export const NAV_CONTROL_RADIUS = "rounded-full";
export const NAV_CONTROL_BORDER =
  "border border-border/50 bg-background/80 text-foreground transition-[background-color,color,transform,border-color] duration-200 ease-out hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-2xs";

export type CmsThemePresetId = string;

export interface CmsThemeOption {
  id: string;
  label: string;
  tagline: string;
  structure: ThemeStructure;
  swatch: {
    bg: string;
    primary: string;
    border: string;
  };
  icon: typeof Compass;
}

const STRUCTURE_ICONS: Record<ThemeStructure, typeof Compass> = {
  sovereign: Compass,
  editorial: BookOpen,
  cinematic: Film,
  brutalist: Square,
  ark: Home,
};

export const CMS_THEME_OPTIONS: CmsThemeOption[] = Object.entries(STRUCTURES).flatMap(
  ([structureId, config]) =>
    config.palettes.map((palette) => {
      const compositeKey = `${structureId}-${palette}`;
      const swatch = PALETTE_SWATCHES[compositeKey];
      return {
        id: compositeKey,
        label: `${config.label} / ${swatch?.label || palette}`,
        tagline: config.tagline,
        structure: structureId as ThemeStructure,
        swatch: swatch
          ? { bg: swatch.bg, primary: swatch.primary, border: swatch.border }
          : { bg: "#ffffff", primary: "#000000", border: "#000000" },
        icon: STRUCTURE_ICONS[structureId as ThemeStructure],
      };
    }),
);

export function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const storeThemePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const { theme: mode, setTheme: setMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const domPreset = document.documentElement.getAttribute("data-theme-preset");
    if (domPreset && domPreset !== storeThemePreset) {
      setThemePreset(domPreset as any);
    }
  }, []);

  const activePresetId = (() => {
    const stored = storeThemePreset as string;
    if (stored && stored in PALETTE_SWATCHES) return stored;
    const { compositeKey } = resolveTheme(stored);
    return compositeKey;
  })();
  const activeOption =
    CMS_THEME_OPTIONS.find((t) => t.id === activePresetId) || CMS_THEME_OPTIONS[0];

  const handleSelectPreset = (id: CmsThemePresetId) => {
    setThemePreset(id as any);
    document.documentElement.setAttribute("data-theme-preset", id);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("bns-theme-preset-preview", id);
      } catch {}
      document.cookie = `theme_preset=${id}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(
        new CustomEvent("bns:theme-preset-changed", { detail: id }),
      );
    }
    const chosen = CMS_THEME_OPTIONS.find((t) => t.id === id);
    toast.info(`Theme Preview: ${chosen?.label || id}`, {
      description: "Click 'Publish Theme to Production' to push live for all visitors.",
    });
  };

  const handlePublishToProduction = async (targetPreset?: CmsThemePresetId) => {
    const idToPublish = targetPreset || activePresetId;
    setIsPublishing(true);
    try {
      const getRes = await fetch("/api/cms/design-tokens");
      const current = getRes.ok ? await getRes.json() : {};
      const payloadData = {
        ...(current.data || {}),
        activeThemePreset: idToPublish,
      };

      const postRes = await fetch("/api/cms/design-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payloadData }),
      });

      if (!postRes.ok) {
        const errJson = (await postRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(errJson.error || "Failed to persist to Cloudflare R2");
      }

      // Clear preview cookie so admin views canonical live production theme
      document.cookie = "theme_preset=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      try {
        window.localStorage?.removeItem("bns-theme-preset-preview");
      } catch {}

      const chosen = CMS_THEME_OPTIONS.find((t) => t.id === idToPublish);
      toast.success("Theme Published Live to Production!", {
        description: `"${chosen?.label || idToPublish}" is now live for all visitors across Cloudflare R2 & edge.`,
      });
    } catch (err) {
      toast.error("Failed to publish theme to production", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!mounted) {
    return (
      <span
        className={cn(
          NAV_CONTROL_SIZE,
          NAV_CONTROL_RADIUS,
          NAV_CONTROL_BORDER,
          "inline-flex items-center justify-center gap-1.5",
          className,
        )}
        aria-hidden
      >
        <Palette className="size-3.5 text-foreground/70" />
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={cn(
            NAV_CONTROL_SIZE,
            NAV_CONTROL_RADIUS,
            NAV_CONTROL_BORDER,
            "relative inline-flex shrink-0 items-center justify-center gap-1.5 select-none",
            className,
          )}
          aria-label={`CMS Theme: ${activeOption.label}. Click to choose theme.`}
        >
          <span
            className="size-2.5 rounded-full shrink-0 ring-1 ring-border/40 shadow-xs"
            style={{ backgroundColor: activeOption.swatch.primary }}
            aria-hidden
          />
          <Palette className="size-3.5 text-foreground/80 shrink-0" />
          <span className="hidden xl:inline text-xs font-semibold capitalize text-foreground/90 truncate max-w-[5.5rem]">
            {activeOption.id}
          </span>
          <ChevronDown className="size-3 opacity-60 shrink-0" aria-hidden />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl p-1.5 shadow-xl z-[120]"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          CMS Visual Themes
        </DropdownMenuLabel>

        <div className="space-y-1">
          {(Object.keys(STRUCTURES) as ThemeStructure[]).map((structureId) => {
            const options = CMS_THEME_OPTIONS.filter((t) => t.structure === structureId);
            const config = STRUCTURES[structureId];
            return (
              <div key={structureId}>
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {config.label}
                </div>
                {options.map((themeOption) => {
                  const isSelected = themeOption.id === activePresetId;
                  return (
                    <DropdownMenuItem
                      key={themeOption.id}
                      onClick={() => handleSelectPreset(themeOption.id)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-2.5 rounded-full shrink-0 ring-1 ring-border/60"
                          style={{ backgroundColor: themeOption.swatch.primary }}
                        />
                        <span className="text-[11px] font-medium leading-tight truncate">
                          {themeOption.label.split(" / ")[1]}
                        </span>
                      </div>
                      {isSelected ? (
                        <Check className="size-3 shrink-0 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1.5 opacity-40" />

        <div className="flex items-center justify-between px-2.5 py-1 text-[11px] text-muted-foreground">
          <span className="font-medium">Mode</span>
          <div className="inline-flex items-center rounded-lg bg-muted/60 p-0.5 border border-border/40">
            <button
              type="button"
              onClick={() => setMode("light")}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors flex items-center gap-1",
                mode === "light"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Light mode"
            >
              <Sun className="size-2.5" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setMode("dark")}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors flex items-center gap-1",
                mode === "dark"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Dark mode"
            >
              <Moon className="size-2.5" />
              Dark
            </button>
            <button
              type="button"
              onClick={() => setMode("system")}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors flex items-center gap-1",
                mode === "system"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="System mode"
            >
              <Monitor className="size-2.5" />
            </button>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5 opacity-40" />

        <div className="p-1">
          <Button
            type="button"
            size="sm"
            disabled={isPublishing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handlePublishToProduction();
            }}
            className="w-full h-8 text-xs font-semibold gap-1.5 rounded-lg bg-primary text-primary-foreground shadow-xs hover:opacity-95 cursor-pointer"
          >
            {isPublishing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Publishing to R2...</span>
              </>
            ) : (
              <>
                <Globe className="size-3.5" />
                <span>Save Theme to Live Production</span>
              </>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            Persists to Cloudflare R2 & live visitors site-wide
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
