"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const THEME_CYCLE = ["light", "dark", "system"] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeMode = (theme || themeMode || "system") as "light" | "dark" | "system";

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(activeMode);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];

    setTheme(nextTheme);
    setThemeMode(nextTheme);
    void persistPreference("theme_mode", nextTheme);
  };

  if (!mounted) {
    return (
      <Button
        size="icon"
        variant="ghost"
        className="size-8 rounded-lg"
        aria-label="Theme switcher loading"
      >
        <Sun className="size-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={cycleTheme}
      className="size-8 rounded-lg text-foreground hover:bg-muted"
      aria-label={`Current theme: ${activeMode}. Click to cycle themes`}
    >
      {activeMode === "system" && <Monitor className="size-4 text-primary" />}
      {activeMode === "dark" && <Moon className="size-4 text-foreground" />}
      {activeMode === "light" && <Sun className="size-4 text-foreground" />}
    </Button>
  );
}
