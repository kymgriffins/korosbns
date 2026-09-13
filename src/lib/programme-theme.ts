/**
 * Programme-scoped brand themes (Connect blue, Mashinani red, etc.).
 * Applied via CSS variables on a page wrapper — does not replace sitewide tokens.
 */

import defaultTokens from "@/content/design-tokens.json";
import {
  designTokensToCssVars,
  resolveDesignTokens,
  type DesignTokens,
} from "@/lib/design-tokens";

export type ProgrammeThemePresetId =
  | "global"
  | "connect-blue"
  | "mashinani-red"
  | "wanahabari-teal"
  | "studios-ink"
  | "custom";

export type ProgrammeTheme = {
  preset?: ProgrammeThemePresetId;
  /** Hex overrides layered on top of the selected preset */
  primary?: string;
  primaryForeground?: string;
  accent?: string;
  buttonBg?: string;
  buttonFg?: string;
  buttonHoverBg?: string;
};

export type ProgrammePresetBag = {
  label: string;
  description?: string;
  brand: NonNullable<DesignTokens["brand"]>;
  buttons: NonNullable<DesignTokens["buttons"]>;
};

const FALLBACK_PRESETS: Record<string, ProgrammePresetBag> = {
  "connect-blue": {
    label: "Connect Blue",
    description: "National tracker — BNS blue",
    brand: {
      primary: "#0055FF",
      primaryForeground: "#FFFFFF",
      accent: "#0055FF",
    },
    buttons: {
      borderRadius: "full",
      primaryBg: "#0055FF",
      primaryFg: "#FFFFFF",
      primaryHoverBg: "#0044CC",
    },
  },
  "mashinani-red": {
    label: "Mashinani Red",
    description: "County accountability — warm crimson",
    brand: {
      primary: "#C41E3A",
      primaryForeground: "#FFFFFF",
      accent: "#E85D4C",
    },
    buttons: {
      borderRadius: "full",
      primaryBg: "#C41E3A",
      primaryFg: "#FFFFFF",
      primaryHoverBg: "#9E1830",
    },
  },
  "wanahabari-teal": {
    label: "Wanahabari Teal",
    description: "Newsroom lab — deep teal",
    brand: {
      primary: "#0F766E",
      primaryForeground: "#FFFFFF",
      accent: "#14B8A6",
    },
    buttons: {
      borderRadius: "full",
      primaryBg: "#0F766E",
      primaryFg: "#FFFFFF",
      primaryHoverBg: "#0D5F59",
    },
  },
  "studios-ink": {
    label: "Studios Ink",
    description: "Production house — near-black ink",
    brand: {
      primary: "#111827",
      primaryForeground: "#FFFFFF",
      accent: "#374151",
    },
    buttons: {
      borderRadius: "full",
      primaryBg: "#111827",
      primaryFg: "#FFFFFF",
      primaryHoverBg: "#030712",
    },
  },
};

export function getProgrammePresets(
  tokens?: DesignTokens | null | Record<string, unknown>,
): Record<string, ProgrammePresetBag> {
  const fromCms = (tokens as DesignTokens | null | undefined)?.programmePresets as
    | Record<string, ProgrammePresetBag>
    | undefined;
  return {
    ...FALLBACK_PRESETS,
    ...(fromCms || {}),
  };
}

export function resolveProgrammeThemeTokens(
  theme?: ProgrammeTheme | null,
  globalTokens?: DesignTokens | null,
): DesignTokens {
  const base = resolveDesignTokens(globalTokens);
  const presets = getProgrammePresets(globalTokens);
  const presetId = theme?.preset || "global";

  if (presetId === "global" || presetId === "custom") {
    const merged = resolveDesignTokens({
      brand: {
        ...base.brand,
        ...(theme?.primary ? { primary: theme.primary } : {}),
        ...(theme?.primaryForeground
          ? { primaryForeground: theme.primaryForeground }
          : {}),
        ...(theme?.accent ? { accent: theme.accent } : {}),
      },
      buttons: {
        ...base.buttons,
        ...(theme?.buttonBg ? { primaryBg: theme.buttonBg } : {}),
        ...(theme?.buttonFg ? { primaryFg: theme.buttonFg } : {}),
        ...(theme?.buttonHoverBg ? { primaryHoverBg: theme.buttonHoverBg } : {}),
      },
    });
    return merged;
  }

  const preset = presets[presetId] || FALLBACK_PRESETS[presetId];
  if (!preset) return base;

  return resolveDesignTokens({
    brand: {
      ...base.brand,
      ...preset.brand,
      ...(theme?.primary ? { primary: theme.primary } : {}),
      ...(theme?.primaryForeground
        ? { primaryForeground: theme.primaryForeground }
        : {}),
      ...(theme?.accent ? { accent: theme.accent } : {}),
    },
    buttons: {
      ...base.buttons,
      ...preset.buttons,
      ...(theme?.buttonBg ? { primaryBg: theme.buttonBg } : {}),
      ...(theme?.buttonFg ? { primaryFg: theme.buttonFg } : {}),
      ...(theme?.buttonHoverBg ? { primaryHoverBg: theme.buttonHoverBg } : {}),
    },
  });
}

/** Scoped CSS var block for a programme page wrapper. */
export function programmeThemeToCssVars(
  theme?: ProgrammeTheme | null,
  globalTokens?: DesignTokens | null,
): string {
  return designTokensToCssVars(resolveProgrammeThemeTokens(theme, globalTokens));
}

export function listProgrammePresetOptions(
  tokens?: DesignTokens | null | Record<string, unknown>,
): Array<{ id: ProgrammeThemePresetId; label: string; description?: string; swatch: string }> {
  const presets = getProgrammePresets(tokens);
  return [
    {
      id: "global",
      label: "Site default",
      description: "Use global brand tokens",
      swatch: (defaultTokens as DesignTokens).brand?.primary || "#0055FF",
    },
    ...Object.entries(presets).map(([id, preset]) => ({
      id: id as ProgrammeThemePresetId,
      label: preset.label,
      description: preset.description,
      swatch: preset.brand.primary || "#0055FF",
    })),
    {
      id: "custom",
      label: "Custom colours",
      description: "Pick your own primary / buttons",
      swatch: "#888888",
    },
  ];
}
