"use client";

import { useEffect, useState } from "react";

export type ThemePreset = "default" | "editorial" | "cinematic" | "brutalist";

export function useThemePreset(): ThemePreset {
  const [preset, setPreset] = useState<ThemePreset>("default");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const value = root.getAttribute("data-theme-preset");
      setPreset(value === "editorial" || value === "cinematic" || value === "brutalist" ? value : "default");
    };

    sync();
    window.addEventListener("bns:theme-preset-changed", sync);
    return () => window.removeEventListener("bns:theme-preset-changed", sync);
  }, []);

  return preset;
}
