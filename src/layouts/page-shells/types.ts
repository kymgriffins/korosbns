import type { ReactNode } from "react";
import { type ThemeStructure, resolveTheme } from "@/lib/theme-registry";

export type LayoutArchetype = ThemeStructure;

export interface LayoutArchetypeConfig {
  id: LayoutArchetype;
  label: string;
  tagline: string;
  containerMeasure: string;
  sectionPadding: string;
  headerStyle: string;
  cardStyle: string;
  sidebarRatio: string;
  borderRadius: string;
}

export const LAYOUT_ARCHETYPES: Record<LayoutArchetype, LayoutArchetypeConfig> = {
  sovereign: {
    id: "sovereign",
    label: "Sovereign Civic",
    tagline: "Component-driven clarity, balanced 12-column grid, people-first movement flow",
    containerMeasure: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    sectionPadding: "py-16 md:py-24",
    headerStyle: "text-4xl sm:text-5xl font-extrabold tracking-tight",
    cardStyle: "rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-md transition-all",
    sidebarRatio: "lg:col-span-4",
    borderRadius: "rounded-2xl",
  },
  editorial: {
    id: "editorial",
    label: "Broadside Editorial",
    tagline: "Journalistic broadside spread, asymmetric reading column, serif typography, archival rules",
    containerMeasure: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
    sectionPadding: "py-12 md:py-20",
    headerStyle: "text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-normal leading-tight",
    cardStyle: "rounded-xs border-b border-border py-6 bg-transparent hover:border-primary/60 transition-colors",
    sidebarRatio: "lg:col-span-4",
    borderRadius: "rounded-xs",
  },
  cinematic: {
    id: "cinematic",
    label: "Immersive Theatre",
    tagline: "Widescreen edge-to-edge frame, floating glass cards, sticky media hero, darkroom glow",
    containerMeasure: "max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12",
    sectionPadding: "py-20 md:py-32",
    headerStyle: "text-4xl sm:text-6xl font-extrabold tracking-tighter",
    cardStyle: "rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 shadow-2xl hover:border-primary/50 transition-all",
    sidebarRatio: "lg:col-span-5",
    borderRadius: "rounded-3xl",
  },
  brutalist: {
    id: "brutalist",
    label: "Watchdog Wireframe",
    tagline: "High-density modular ledger, 0px hard borders, tabular index, stark black rules",
    containerMeasure: "max-w-7xl mx-auto px-4 sm:px-6",
    sectionPadding: "py-10 md:py-16",
    headerStyle: "text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight",
    cardStyle: "rounded-none border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_currentColor] transition-transform",
    sidebarRatio: "lg:col-span-4",
    borderRadius: "rounded-none",
  },
  ark: {
    id: "ark",
    label: "Ark Shelter",
    tagline: "Premium minimalist calm — white canvas, thin rules, full-bleed photography, airy geometry",
    containerMeasure: "max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12",
    sectionPadding: "py-20 md:py-28",
    headerStyle: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05]",
    cardStyle: "rounded-xl border border-border bg-card p-8 shadow-none hover:border-foreground/20 transition-colors",
    sidebarRatio: "lg:col-span-4",
    borderRadius: "rounded-xl",
  },
};

export const LAYOUT_ARCHETYPES_LIST = Object.values(LAYOUT_ARCHETYPES);

export function resolveLayoutArchetype(
  archetype?: string | null,
  fallback: LayoutArchetype = "sovereign"
): LayoutArchetypeConfig {
  // Support composite keys (e.g., "brutalist-teal") by extracting structure
  if (archetype && archetype.includes("-")) {
    const { structure } = resolveTheme(archetype);
    return LAYOUT_ARCHETYPES[structure];
  }

  if (archetype && archetype in LAYOUT_ARCHETYPES) {
    return LAYOUT_ARCHETYPES[archetype as LayoutArchetype];
  }
  return LAYOUT_ARCHETYPES[fallback];
}
