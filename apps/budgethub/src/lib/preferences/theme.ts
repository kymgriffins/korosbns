import { STRUCTURES, PALETTE_SWATCHES } from "@/lib/theme-registry";

export const THEME_MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((o) => o.value);
export type ThemeMode = (typeof THEME_MODE_VALUES)[number];
export type ResolvedThemeMode = "light" | "dark";

// --- generated:themePresets:start ---

export const THEME_PRESET_OPTIONS = Object.entries(STRUCTURES).flatMap(([structureId, config]) =>
  config.palettes.map((palette) => {
    const compositeKey = `${structureId}-${palette}`;
    const swatch = PALETTE_SWATCHES[compositeKey];
    return {
      label: `${config.label} / ${swatch?.label || palette}`,
      value: compositeKey,
      primary: {
        light: swatch?.primary || "#000000",
        dark: swatch?.primary || "#ffffff",
      },
    };
  }),
);

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((p) => p.value);

export type ThemePreset = (typeof THEME_PRESET_OPTIONS)[number]["value"];

// --- generated:themePresets:end ---
