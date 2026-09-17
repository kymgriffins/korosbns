export const THEME_MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((o) => o.value);
export type ThemeMode = (typeof THEME_MODE_VALUES)[number];
export type ResolvedThemeMode = "light" | "dark";

// --- generated:themePresets:start ---

export const THEME_PRESET_OPTIONS = [
  {
    label: "Default (Sovereign)",
    value: "default",
    primary: {
      light: "#533afd",
      dark: "#7389ff",
    },
  },
  {
    label: "Editorial",
    value: "editorial",
    primary: {
      light: "#881337",
      dark: "#e11d48",
    },
  },
  {
    label: "Cinematic",
    value: "cinematic",
    primary: {
      light: "#00d2ff",
      dark: "#38bdf8",
    },
  },
  {
    label: "Brutalist",
    value: "brutalist",
    primary: {
      light: "#ff4d00",
      dark: "#ff5500",
    },
  },
  {
    label: "Soft Pop",
    value: "soft-pop",
    primary: {
      light: "oklch(0.5106 0.2301 276.9656)",
      dark: "oklch(0.6801 0.1583 276.9349)",
    },
  },
  {
    label: "Tangerine",
    value: "tangerine",
    primary: {
      light: "oklch(0.64 0.17 36.44)",
      dark: "oklch(0.64 0.17 36.44)",
    },
  },
] as const;

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((p) => p.value);

export type ThemePreset = (typeof THEME_PRESET_OPTIONS)[number]["value"];

// --- generated:themePresets:end ---
