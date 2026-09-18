/**
 * Composable Theme Registry: Structure × Palette
 *
 * Structure = HTML/layout archetype (sovereign, editorial, cinematic, brutalist, ark)
 * Palette = colour scheme within a structure (e.g., brutalist-teal, editorial-bw)
 * Composite key = `${structure}-${palette}` stored in data-theme-preset
 *
 * Adding a new palette:
 *   1. Create src/styles/palettes/{structure}-{palette}.css
 *   2. Add palette ID to STRUCTURES[structure].palettes
 *   3. Add swatch data to PALETTE_SWATCHES
 *   4. Import the CSS file in src/styles/globals.css
 *
 * Adding a new structure:
 *   1. Add structure ID to STRUCTURES
 *   2. Add structural CSS in src/styles/presets.css
 *   3. Add JSX branches to page shells (article-shell, project-shell, etc.)
 *   4. All existing palettes auto-work with the new structure
 *
 * Structures: sovereign, editorial, cinematic, brutalist, ark
 */

export type ThemeStructure = "sovereign" | "editorial" | "cinematic" | "brutalist" | "ark";

export type SovereignPalette = "default" | "midnight" | "slate" | "forest";
export type EditorialPalette = "rose" | "bw" | "premium" | "ink";
export type CinematicPalette = "cyan" | "noir" | "neon" | "premium-blue";
export type BrutalistPalette = "orange" | "teal" | "monochrome" | "neon";
export type ArkPalette = "mist" | "forest" | "timber" | "stone";

export type ThemePalette =
  | SovereignPalette
  | EditorialPalette
  | CinematicPalette
  | BrutalistPalette
  | ArkPalette;

export type CompositeThemeKey =
  | `sovereign-${SovereignPalette}`
  | `editorial-${EditorialPalette}`
  | `cinematic-${CinematicPalette}`
  | `brutalist-${BrutalistPalette}`
  | `ark-${ArkPalette}`;

export interface ThemeStructureConfig {
  id: ThemeStructure;
  label: string;
  tagline: string;
  defaultPalette: string;
  palettes: string[];
}

export interface PaletteSwatch {
  bg: string;
  primary: string;
  border: string;
  label: string;
}

export const STRUCTURES: Record<ThemeStructure, ThemeStructureConfig> = {
  sovereign: {
    id: "sovereign",
    label: "Sovereign Civic",
    tagline: "Component-driven clarity, balanced 12-column grid, people-first movement flow",
    defaultPalette: "default",
    palettes: ["default", "midnight", "slate", "forest"],
  },
  editorial: {
    id: "editorial",
    label: "Broadside Editorial",
    tagline: "Journalistic broadside spread, asymmetric reading column, serif typography",
    defaultPalette: "rose",
    palettes: ["rose", "bw", "premium", "ink"],
  },
  cinematic: {
    id: "cinematic",
    label: "Immersive Theatre",
    tagline: "Widescreen edge-to-edge frame, floating glass cards, darkroom glow",
    defaultPalette: "cyan",
    palettes: ["cyan", "noir", "neon", "premium-blue"],
  },
  brutalist: {
    id: "brutalist",
    label: "Watchdog Wireframe",
    tagline: "High-density modular ledger, 0px hard borders, tabular index, stark black rules",
    defaultPalette: "orange",
    palettes: ["orange", "teal", "monochrome", "neon"],
  },
  ark: {
    id: "ark",
    label: "Ark Shelter",
    tagline: "Premium minimalist calm — white canvas, thin rules, full-bleed photography, airy geometry",
    defaultPalette: "mist",
    palettes: ["mist", "forest", "timber", "stone"],
  },
};

export const PALETTE_SWATCHES: Record<string, PaletteSwatch> = {
  // Sovereign palettes
  "sovereign-default": { bg: "#f8fafd", primary: "#533afd", border: "#b9b9f9", label: "Indigo Ink" },
  "sovereign-midnight": { bg: "#061b31", primary: "#7389ff", border: "#182659", label: "Midnight" },
  "sovereign-slate": { bg: "#f1f5f9", primary: "#475569", border: "#cbd5e1", label: "Slate" },
  "sovereign-forest": { bg: "#f0fdf4", primary: "#166534", border: "#bbf7d0", label: "Forest" },
  // Editorial palettes
  "editorial-rose": { bg: "#fbf9f4", primary: "#881337", border: "#e7e0d3", label: "Deep Rose" },
  "editorial-bw": { bg: "#ffffff", primary: "#000000", border: "#d4d4d4", label: "Black & White" },
  "editorial-premium": { bg: "#fefdf5", primary: "#92700c", border: "#e8dfc0", label: "Gold Premium" },
  "editorial-ink": { bg: "#f5f0e6", primary: "#1e3a5f", border: "#c8d6e5", label: "Deep Ink" },
  // Cinematic palettes
  "cinematic-cyan": { bg: "#080c14", primary: "#00d2ff", border: "rgba(0,210,255,0.4)", label: "Electric Cyan" },
  "cinematic-noir": { bg: "#000000", primary: "#ffffff", border: "rgba(255,255,255,0.2)", label: "Noir" },
  "cinematic-neon": { bg: "#0a0014", primary: "#d946ef", border: "rgba(217,70,239,0.3)", label: "Neon Violet" },
  "cinematic-premium-blue": { bg: "#0a1628", primary: "#3b82f6", border: "rgba(59,130,246,0.3)", label: "Premium Blue" },
  // Brutalist palettes
  "brutalist-orange": { bg: "#fffdf5", primary: "#ff4d00", border: "#000000", label: "Safety Orange" },
  "brutalist-teal": { bg: "#f0fdfa", primary: "#0d9488", border: "#134e4a", label: "Teal" },
  "brutalist-monochrome": { bg: "#ffffff", primary: "#000000", border: "#000000", label: "Monochrome" },
  "brutalist-neon": { bg: "#000000", primary: "#ff00ff", border: "#00ff00", label: "Neon Punk" },
  // Ark palettes
  "ark-mist": { bg: "#ffffff", primary: "#0a0a0a", border: "#e5e5e5", label: "Mist" },
  "ark-forest": { bg: "#f7f8f5", primary: "#1a3a2a", border: "#d5ddd6", label: "Forest" },
  "ark-timber": { bg: "#faf8f5", primary: "#2c2418", border: "#e4ddd4", label: "Timber" },
  "ark-stone": { bg: "#f4f4f2", primary: "#1c1c1c", border: "#d8d8d4", label: "Stone" },
};

/**
 * Parse a composite theme key into structure and palette.
 * Accepts: "brutalist-teal", "editorial", "default", "brutalist"
 * Returns structure + palette, falling back to the structure's default palette.
 */
export function resolveTheme(compositeKey?: string | null): {
  structure: ThemeStructure;
  palette: string;
  compositeKey: string;
} {
  if (!compositeKey) {
    return { structure: "sovereign", palette: "default", compositeKey: "sovereign-default" };
  }

  // Try to match longest structure prefix first
  const structures: ThemeStructure[] = ["brutalist", "cinematic", "editorial", "sovereign", "ark"];
  for (const s of structures) {
    if (compositeKey === s || compositeKey.startsWith(`${s}-`)) {
      const palette = compositeKey === s
        ? STRUCTURES[s].defaultPalette
        : compositeKey.slice(s.length + 1);
      return {
        structure: s,
        palette,
        compositeKey: `${s}-${palette}`,
      };
    }
  }

  // Legacy: "default" maps to sovereign-default
  if (compositeKey === "default") {
    return { structure: "sovereign", palette: "default", compositeKey: "sovereign-default" };
  }

  return { structure: "sovereign", palette: "default", compositeKey: "sovereign-default" };
}

/**
 * Get the default palette for a given structure.
 */
export function getDefaultPalette(structure: ThemeStructure): string {
  return STRUCTURES[structure].defaultPalette;
}

/**
 * Build all valid composite keys (structure × palette combinations).
 */
export function getAllCompositeKeys(): string[] {
  const keys: string[] = [];
  for (const [structureId, config] of Object.entries(STRUCTURES)) {
    for (const palette of config.palettes) {
      keys.push(`${structureId}-${palette}`);
    }
  }
  return keys;
}

/**
 * Get swatch data for a composite key (for theme toggle UI).
 */
export function getPaletteSwatch(compositeKey: string): PaletteSwatch | undefined {
  return PALETTE_SWATCHES[compositeKey];
}

/**
 * Check if a composite key is valid.
 */
export function isValidCompositeKey(key: string): boolean {
  return key in PALETTE_SWATCHES;
}
