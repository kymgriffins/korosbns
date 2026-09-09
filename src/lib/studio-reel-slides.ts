import {
  BNS_STUDIO_HERO_IMAGE,
  BNS_STUDIO_PAGE_SERVICES,
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";

export type StudioReelSlide = {
  contentType: StudioContentType;
  label: string;
  shortDesc: string;
  image: string;
  imagePosition?: string;
  videoUrl?: string;
  projectSlug?: string;
  year: string;
  sectionId: string;
  layout: "cinema" | "vertical" | "square";
};

function sectionIdFor(contentType: StudioContentType): string {
  return `format-${contentType.replace(/\s+/g, "-").toLowerCase()}`;
}

function layoutFor(contentType: StudioContentType): StudioReelSlide["layout"] {
  if (contentType === "Social Media Series") return "vertical";
  if (contentType === "Podcast & Audio") return "square";
  return "cinema";
}

/**
 * Landing reel curation — formats showcased in the BNS Studio hero theatre.
 * Features live vertical social media reels, podcasts, and cinematic formats.
 */
export const STUDIO_REEL_FEATURED_TYPES: StudioContentType[] = [
  "Social Media Series",
  "Podcast & Audio",
  "Explainer Videos",
  "Documentaries",
  "Animations",
];

export function getStudioReelSlides(): StudioReelSlide[] {
  const types = STUDIO_CONTENT_TYPES.filter((type) =>
    STUDIO_REEL_FEATURED_TYPES.includes(type.id),
  );
  return types.map((type) => {
    const service = BNS_STUDIO_PAGE_SERVICES.find((s) => s.contentType === type.id);
    const projects = studiosEvidenceData.getProjectsByContentType(type.id);
    const lead = projects.find((p) => p.featured) ?? projects[0];

    const isSocialReel = type.id === "Social Media Series";
    const isExplainer = type.id === "Explainer Videos";
    const isAnimation = type.id === "Animations";
    const isDocumentary = type.id === "Documentaries";
    const videoUrl = isSocialReel
      ? "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/Calvina%20Praise%20Sovereign%20debt.mp4"
      : isExplainer
      ? "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/county%20%26%20budget%20socials%20new.mp4"
      : isAnimation
      ? "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/animation%20reel%20opportunities%20.%20Where%20do%20I%20start%20(%20nyota%20programmes%20%20uwezo%20fund)%20main%20landing%20page%20.mp4"
      : isDocumentary
      ? "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/BNS%20Studio%20%20MYTH%20or%20FACT%20%20game%20on%20budget.mp4"
      : undefined;
    const image = isSocialReel
      ? "/images/reels/reel-01-poster.jpg"
      : isExplainer
      ? "/images/reels/reel-02-poster.jpg"
      : isAnimation
      ? "/images/reels/reel-05-opportunities.jpg"
      : isDocumentary
      ? "/images/reels/reel-04-myth-fact.jpg"
      : (lead?.media.posterUrl ?? service?.image ?? BNS_STUDIO_HERO_IMAGE);

    return {
      contentType: type.id,
      label: type.label,
      shortDesc: type.shortDesc,
      image,
      imagePosition: isSocialReel ? "center top" : (lead?.media.posterPosition ?? service?.imagePosition),
      videoUrl,
      projectSlug: lead?.slug,
      year: lead?.year ?? "2025",
      sectionId: sectionIdFor(type.id),
      layout: layoutFor(type.id),
    };
  });
}

export const STUDIO_REEL_SLIDE_COUNT = STUDIO_REEL_FEATURED_TYPES.length;
