/**
 * JSON-driven marketing content barrel.
 * Layouts/components should import from here — not hardcode copy or asset paths.
 */

import mediaJson from "@/content/media.json";
import programmesJson from "@/content/programmes.json";
import landingJson from "@/content/landing.json";
import aboutJson from "@/content/about.json";
import timelineJson from "@/content/timeline.json";
import socialsJson from "@/content/socials.json";
import partnerPageSectionsJson from "@/content/partner-page-sections.json";
import faqJson from "@/content/faq.json";
import storiesJson from "@/content/stories.json";
import impactJson from "@/content/impact.json";
import consortiumJson from "@/content/consortium.json";
import careersJson from "@/content/careers.json";
import legalJson from "@/content/legal.json";
import teamInitiativesJson from "@/content/team-initiatives.json";
import landingHeroJson from "@/content/landing-hero.json";
import landingSectionsJson from "@/content/landing-sections.json";

export const mediaContent = mediaJson;
export const programmesContent = programmesJson;
export const landingContent = landingJson;
export const aboutContent = aboutJson;
export const timelineContent = timelineJson;
export const socialsContent = socialsJson;
export const partnerPageSectionsContent = partnerPageSectionsJson;
export const faqContent = faqJson;
export const storiesContent = storiesJson;
export const impactContent = impactJson;
export const consortiumContent = consortiumJson;
export const careersContent = careersJson;
export const legalContent = legalJson;
export const teamInitiativesContent = teamInitiativesJson;
export const landingHeroContent = landingHeroJson;
export const landingSectionsContent = landingSectionsJson;

export type ProgrammeSlug = "connect" | "mashinani" | "wanahabari-lab" | "studios";

export type ProgrammeCta = {
  label: string;
  href: string;
  note?: string;
  hidden?: boolean;
};

export type ProgrammeVisual = {
  hero: string;
  heroAlt: string;
  gallery: { src: string; alt: string }[];
};

export type ProgrammeStat = {
  value: string;
  label: string;
};

export type ProgrammePillar = {
  title: string;
  body: string;
};

export type ProgrammeStep = {
  title: string;
  body: string;
};

export type ProgrammeFaq = {
  q: string;
  a: string;
};

export type ProgrammeDeliverable = {
  title: string;
  description: string;
};

export type ProgrammeBlock = {
  /** Canonical stable id — always mirrors `slug`. */
  id: ProgrammeSlug;
  slug: ProgrammeSlug;
  name: string;
  eyebrow: string;
  headline: string;
  body: string;
  highlight?: string;
  investorThesis?: string;
  whatWeDo?: string;
  mandateFit?: string;
  deliverables?: ProgrammeDeliverable[];
  seoTitle: string;
  seoDescription: string;
  cta: ProgrammeCta;
  secondaryCta?: ProgrammeCta;
  href: string;
  visual: ProgrammeVisual;
  featuredMedia?: {
    type?: "video" | "youtube" | "image" | "auto";
    url: string;
    title?: string;
    caption?: string;
  };
  stats?: ProgrammeStat[];
  pillars?: ProgrammePillar[];
  process?: ProgrammeStep[];
  faqs?: ProgrammeFaq[];
  audience?: string;
};

export const PROGRAMMES_LANDING = programmesContent.landing;
export const PROGRAMMES = programmesContent.items as ProgrammeBlock[];
/** Civic programmes only — Connect, Mashinani, Wanahabari. BNS Studio is separate. */
export const CIVIC_PROGRAMMES = PROGRAMMES.filter((p) => p.slug !== "studios");
export const PROGRAMMES_CLOSING = programmesContent.closing;
export const CONTACT_INTENT_COPY = programmesContent.contactIntents as Record<
  string,
  { title: string; blurb: string; messagePrefill: string }
>;
export const PROGRAMME_CARD_BLURBS = programmesContent.cardBlurbs as Record<
  ProgrammeSlug,
  string
>;
export const BNS_PARTNERS_NAMED = programmesContent.partners;

export function getProgramme(slug: string): ProgrammeBlock | undefined {
  const key = slug.trim().toLowerCase();
  return PROGRAMMES.find((p) => p.slug === key || p.id === key);
}

export function programmeHref(slug: ProgrammeSlug): string {
  const found = getProgramme(slug);
  if (found?.href) return found.href;
  if (slug === "studios") return "/bns-studio";
  return `/programmes/${slug}`;
}

export const BNS_MEDIA_IMAGES = mediaContent.media;
export const BNS_COMMUNITY_IMAGES = mediaContent.community;

export function cloudinaryUrl(
  key: keyof typeof mediaContent.cloudinary,
): string {
  return mediaContent.cloudinary[key];
}
