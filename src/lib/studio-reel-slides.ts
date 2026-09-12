import {
  BNS_STUDIO_HERO_IMAGE,
  BNS_STUDIO_PAGE_SERVICES,
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { PROGRAMME_REELS } from "@/content";

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
 * Video URLs pulled from CMS-managed programme-reels collection.
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

    // Pull video URLs from CMS-managed programme-reels
    const socialReel = PROGRAMME_REELS.find((r) => r.category === "National Debt");
    const explainerReel = PROGRAMME_REELS.find((r) => r.category === "Devolution");

    const videoUrl = isSocialReel
      ? socialReel?.videoUrl
      : isExplainer
      ? explainerReel?.videoUrl
      : undefined;
    const image = isSocialReel
      ? (socialReel?.posterUrl ?? "/images/reels/reel-01-poster.jpg")
      : isExplainer
      ? (explainerReel?.posterUrl ?? "/images/reels/reel-02-poster.jpg")
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
