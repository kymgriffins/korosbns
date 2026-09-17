"use client";

import {
  Palette,
  Check,
  BookOpen,
  Film,
  Square,
  Compass,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";
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

export const NAV_CONTROL_SIZE = "h-9 min-w-[2.25rem] px-2";
export const NAV_CONTROL_RADIUS = "rounded-full";
export const NAV_CONTROL_BORDER =
  "border border-border/50 bg-background/80 text-foreground transition-[background-color,color,transform,border-color] duration-200 ease-out hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-2xs";

export type CmsThemePresetId = "default" | "editorial" | "cinematic" | "brutalist";

export interface CmsThemeOption {
  id: CmsThemePresetId;
  label: string;
  tagline: string;
  swatch: {
    bg: string;
    primary: string;
    border: string;
  };
  icon: typeof Compass;
}

export const CMS_THEME_OPTIONS: CmsThemeOption[] = [
  {
    id: "default",
    label: "Sovereign (Default)",
    tagline: "Modern civic ledger & frosted glass",
    swatch: {
      bg: "#f8fafd",
      primary: "#533afd",
      border: "#b9b9f9",
    },
    icon: Compass,
  },
  {
    id: "editorial",
    label: "Editorial",
    tagline: "Broadside journalism, parchment & serif",
    swatch: {
      bg: "#fbf9f4",
      primary: "#881337",
      border: "#e7e0d3",
    },
    icon: BookOpen,
  },
  {
    id: "cinematic",
    label: "Cinematic",
    tagline: "BNS Theatre noir & electric cyan glow",
    swatch: {
      bg: "#080c14",
      primary: "#00d2ff",
      border: "rgba(0,210,255,0.4)",
    },
    icon: Film,
  },
  {
    id: "brutalist",
    label: "Brutalist",
    tagline: "Raw high contrast & stark pop shadow",
    swatch: {
      bg: "#fffdf5",
      primary: "#ff4d00",
      border: "#000000",
    },
    icon: Square,
  },
];

export function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const storeThemePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const { theme: mode, setTheme: setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const domPreset = document.documentElement.getAttribute("data-theme-preset");
    if (domPreset && domPreset !== storeThemePreset) {
      setThemePreset(domPreset as any);
    }
  }, []);

  const activePresetId = (storeThemePreset as CmsThemePresetId) || "default";
  const activeOption =
    CMS_THEME_OPTIONS.find((t) => t.id === activePresetId) || CMS_THEME_OPTIONS[0];

  const handleSelectPreset = (id: CmsThemePresetId) => {
    setThemePreset(id as any);
    document.documentElement.setAttribute("data-theme-preset", id);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("bns-theme-preset", id);
      } catch {}
      document.cookie = `theme_preset=${id}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(
        new CustomEvent("bns:theme-preset-changed", { detail: id }),
      );
    }
    const chosen = CMS_THEME_OPTIONS.find((t) => t.id === id);
    toast.success(`CMS Theme: ${chosen?.label || id} activated`);
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
          {CMS_THEME_OPTIONS.map((themeOption) => {
            const isSelected = themeOption.id === activePresetId;
            return (
              <DropdownMenuItem
                key={themeOption.id}
                onClick={() => handleSelectPreset(themeOption.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted/70",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="size-3 rounded-full shrink-0 ring-1 ring-border/60"
                    style={{ backgroundColor: themeOption.swatch.primary }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold leading-tight truncate">
                      {themeOption.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight truncate">
                      {themeOption.tagline}
                    </span>
                  </div>
                </div>
                {isSelected ? (
                  <Check className="size-3.5 shrink-0 text-primary" />
                ) : null}
              </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
