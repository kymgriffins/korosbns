import type { StudioContentType } from "@/constants/bns-studio-content";

export type StudioFormatExperience =
  | "podcast"
  | "cinema"
  | "vertical"
  | "stage"
  | "brief";

export type StudioFormatTheme = {
  experience: StudioFormatExperience;
  cardAspect: "16/9" | "9/16" | "4/3" | "1/1";
  railCardWidth: string;
  accentClass: string;
  ctaLabel: string;
  rowEyebrow: string;
};

export const STUDIO_FORMAT_THEMES: Record<StudioContentType, StudioFormatTheme> = {
  "Podcast & Audio": {
    experience: "podcast",
    cardAspect: "1/1",
    railCardWidth: "min(100%, 14rem)",
    accentClass: "studio-accent-podcast",
    ctaLabel: "Listen",
    rowEyebrow: "Audio",
  },
  Animations: {
    experience: "cinema",
    cardAspect: "16/9",
    railCardWidth: "min(100%, 22rem)",
    accentClass: "studio-accent-cinema",
    ctaLabel: "Watch",
    rowEyebrow: "Motion",
  },
  "Explainer Videos": {
    experience: "cinema",
    cardAspect: "16/9",
    railCardWidth: "min(100%, 22rem)",
    accentClass: "studio-accent-cinema",
    ctaLabel: "Watch",
    rowEyebrow: "Explainers",
  },
  "Research Spotlights": {
    experience: "brief",
    cardAspect: "4/3",
    railCardWidth: "min(100%, 18rem)",
    accentClass: "studio-accent-brief",
    ctaLabel: "Read dossier",
    rowEyebrow: "Research",
  },
  Documentaries: {
    experience: "cinema",
    cardAspect: "16/9",
    railCardWidth: "min(100%, 24rem)",
    accentClass: "studio-accent-documentary",
    ctaLabel: "Watch",
    rowEyebrow: "Documentary",
  },
  "Social Media Series": {
    experience: "vertical",
    cardAspect: "9/16",
    railCardWidth: "min(100%, 11rem)",
    accentClass: "studio-accent-vertical",
    ctaLabel: "View series",
    rowEyebrow: "Short-form",
  },
  "Town Hall Design & Facilitation": {
    experience: "stage",
    cardAspect: "16/9",
    railCardWidth: "min(100%, 22rem)",
    accentClass: "studio-accent-stage",
    ctaLabel: "View event",
    rowEyebrow: "Live convening",
  },
  "Community Listening Sessions": {
    experience: "stage",
    cardAspect: "16/9",
    railCardWidth: "min(100%, 22rem)",
    accentClass: "studio-accent-stage",
    ctaLabel: "Explore session",
    rowEyebrow: "Community",
  },
};

export function getFormatTheme(contentType: StudioContentType): StudioFormatTheme {
  return STUDIO_FORMAT_THEMES[contentType];
}
