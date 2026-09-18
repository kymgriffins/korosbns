"use client";

import { useEffect, useState } from "react";
import { resolveTheme, type ThemeStructure } from "@/lib/theme-registry";

export type ThemePreset = "default" | "editorial" | "cinematic" | "brutalist" | "ark";

export function useThemePreset(): ThemePreset {
  const [preset, setPreset] = useState<ThemePreset>("default");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const value = root.getAttribute("data-theme-preset");
      const { structure } = resolveTheme(value);
      setPreset(structure === "sovereign" ? "default" : structure);
    };

    sync();
    window.addEventListener("bns:theme-preset-changed", sync);
    return () => window.removeEventListener("bns:theme-preset-changed", sync);
  }, []);

  return preset;
}

/**
 * Returns the full composite key (e.g., "brutalist-teal", "editorial-bw").
 */
export function useCompositeThemeKey(): string {
  const [compositeKey, setCompositeKey] = useState("sovereign-default");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const value = root.getAttribute("data-theme-preset");
      const { compositeKey: resolved } = resolveTheme(value);
      setCompositeKey(resolved);
    };

    sync();
    window.addEventListener("bns:theme-preset-changed", sync);
    return () => window.removeEventListener("bns:theme-preset-changed", sync);
  }, []);

  return compositeKey;
}

/**
 * Returns just the structure (layout archetype) from the composite key.
 */
export function useThemeStructure(): ThemeStructure {
  const [structure, setStructure] = useState<ThemeStructure>("sovereign");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const value = root.getAttribute("data-theme-preset");
      const { structure: s } = resolveTheme(value);
      setStructure(s);
    };

    sync();
    window.addEventListener("bns:theme-preset-changed", sync);
    return () => window.removeEventListener("bns:theme-preset-changed", sync);
  }, []);

  return structure;
}

/**
 * Returns just the palette from the composite key.
 */
export function useThemePalette(): string {
  const [palette, setPalette] = useState("default");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const value = root.getAttribute("data-theme-preset");
      const { palette: p } = resolveTheme(value);
      setPalette(p);
    };

    sync();
    window.addEventListener("bns:theme-preset-changed", sync);
    return () => window.removeEventListener("bns:theme-preset-changed", sync);
  }, []);

  return palette;
}
