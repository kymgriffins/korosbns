/**
 * Theme Motion Profiles & Presets
 * Reusable motion tokens across the 4 core design presets:
 * - default (Sovereign / Obama.org: fluid spring physics, accessible, responsive)
 * - editorial (Rockefeller / Deep Journalism: deliberate ink fade, quiet cadence)
 * - cinematic (Make It Real / Analogue: slow theatrical dolly, atmospheric curve)
 * - brutalist (Civic Watchdog: instantaneous mechanical cuts, high urgency)
 */

import type { Transition } from "motion/react";

export type ThemePresetName = "default" | "editorial" | "cinematic" | "brutalist";

export interface ThemeMotionProfile {
  name: ThemePresetName;
  label: string;
  description: string;
  transition: Transition;
  fadeUp: {
    initial: { opacity: number; y?: number; x?: number; scale?: number };
    animate: { opacity: number; y?: number; x?: number; scale?: number };
  };
  stagger: number;
  hoverScale: number;
  tapScale: number;
}

export const THEME_MOTION_PROFILES: Record<ThemePresetName, ThemeMotionProfile> = {
  default: {
    name: "default",
    label: "Sovereign (Civic)",
    description: "Fluid Apple/Vercel spring physics with calm, trustworthy upward cadence",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 26,
      mass: 0.8,
    },
    fadeUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
    },
    stagger: 0.08,
    hoverScale: 1.02,
    tapScale: 0.97,
  },
  editorial: {
    name: "editorial",
    label: "Editorial (Broadside)",
    description: "Deliberate ink reveal with smooth journalistic pacing and zero bounce",
    transition: {
      type: "tween",
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
    fadeUp: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
    },
    stagger: 0.12,
    hoverScale: 1.0,
    tapScale: 0.98,
  },
  cinematic: {
    name: "cinematic",
    label: "Cinematic (Theatre)",
    description: "Theatrical slow dolly zoom with expansive negative space and ambient glow",
    transition: {
      type: "tween",
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
    fadeUp: {
      initial: { opacity: 0, y: 24, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
    },
    stagger: 0.15,
    hoverScale: 1.03,
    tapScale: 0.96,
  },
  brutalist: {
    name: "brutalist",
    label: "Brutalist (Watchdog)",
    description: "Mechanical instantaneous cuts with high-contrast urgency and zero transition delay",
    transition: {
      type: "tween",
      duration: 0.1,
      ease: "linear",
    },
    fadeUp: {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
    },
    stagger: 0.04,
    hoverScale: 1.0,
    tapScale: 0.95,
  },
};

export function getThemeMotion(preset?: string | null): ThemeMotionProfile {
  if (!preset || !(preset in THEME_MOTION_PROFILES)) {
    return THEME_MOTION_PROFILES.default;
  }
  return THEME_MOTION_PROFILES[preset as ThemePresetName];
}
