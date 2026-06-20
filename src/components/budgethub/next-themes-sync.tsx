"use client";

import { useEffect } from "react";

import { useTheme } from "next-themes";

import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function NextThemesSync() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setResolvedThemeMode = usePreferencesStore((s) => s.setResolvedThemeMode);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      setResolvedThemeMode(resolvedTheme as "light" | "dark");
    }
  }, [resolvedTheme, setResolvedThemeMode]);

  useEffect(() => {
    setTheme(themeMode);
  }, [themeMode, setTheme]);

  return null;
}
