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
 * Landing reel curation — 4 audio + visual formats only.
 * Keeps the home viewport tight: audio craft + visual storytelling.
 */
export const STUDIO_REEL_FEATURED_TYPES: StudioContentType[] = [
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

    return {
      contentType: type.id,
      label: type.label,
      shortDesc: type.shortDesc,
      image: lead?.media.posterUrl ?? service?.image ?? BNS_STUDIO_HERO_IMAGE,
      imagePosition: lead?.media.posterPosition ?? service?.imagePosition,
      projectSlug: lead?.slug,
      year: lead?.year ?? "2025",
      sectionId: sectionIdFor(type.id),
      layout: layoutFor(type.id),
    };
  });
}

export const STUDIO_REEL_SLIDE_COUNT = STUDIO_REEL_FEATURED_TYPES.length;
