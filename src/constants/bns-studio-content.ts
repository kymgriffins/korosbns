import { Camera, Monitor, Scissors, Video, type LucideIcon } from "lucide-react";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
  BNS_STUDIO_PORTFOLIO_IMAGES,
} from "@/constants/bns-media-images";

export type BnsStudioService = {
  icon: LucideIcon;
  name: string;
  description: string;
  image: string;
  imagePosition?: string;
  features: string[];
};

/** Curated rows for the landing-page timeline-style studio block. */
export const BNS_STUDIO_LANDING_SHOWCASE: BnsStudioService[] = [
  {
    icon: Video,
    name: "Videography",
    description:
      "Documentaries, budget explainers, event coverage, and branded films — from treatment to final cut.",
    image: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    features: ["4K / HD capture", "Multi-camera setups", "On-location & studio"],
  },
  {
    icon: Camera,
    name: "Photography",
    description:
      "Portraits, stakeholder sessions, town halls, and campaign stills with consistent lighting and delivery.",
    image: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    features: ["Edited galleries", "Print-ready exports", "Event & portrait"],
  },
  {
    icon: Monitor,
    name: "Studio & Events",
    description:
      "Equipped studio rental and hall coverage for interviews, panels, and civic engagement productions.",
    image: BNS_MEDIA_IMAGES.hall,
    imagePosition: "center",
    features: ["Lighting & backdrops", "Hall event coverage", "Interview setups"],
  },
];

export const BNS_STUDIO_PAGE_SERVICES: (BnsStudioService & { price: string })[] = [
  {
    icon: Video,
    name: "Videography",
    description:
      "Corporate events, documentaries, music videos, and budget explainers for civic and brand clients.",
    image: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    price: "From KES 25,000",
    features: ["4K/HD recording", "Professional audio", "Multi-camera setup", "Same-day edit option"],
  },
  {
    icon: Camera,
    name: "Photography",
    description:
      "Portraits, events, product photography, and branded content from BNS production sessions.",
    image: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    price: "From KES 15,000",
    features: ["High-resolution RAW", "Professional lighting", "Edited gallery", "Print-ready files"],
  },
  {
    icon: Monitor,
    name: "Studio Rental",
    description:
      "Fully equipped studio with professional lighting, backdrops, and interview-ready layouts.",
    image: BNS_MEDIA_IMAGES.hall,
    imagePosition: "center",
    price: "KES 5,000/hr",
    features: ["Continuous / flash lighting", "Backdrop system", "Changing room", "Audio equipment"],
  },
  {
    icon: Scissors,
    name: "Post-Production",
    description:
      "Editing, color grading, motion graphics, and sound design for finished deliverables.",
    image: BNS_MEDIA_IMAGES.main,
    imagePosition: "center",
    price: "From KES 10,000",
    features: ["DaVinci / Premiere Pro", "Color grading", "Motion graphics", "Sound mixing"],
  },
];

export const BNS_STUDIO_PORTFOLIO = BNS_STUDIO_PORTFOLIO_IMAGES;

export const BNS_STUDIO_HERO_IMAGE = BNS_MEDIA_IMAGES.productionA;

export const BNS_STUDIO_COMMUNITY_HIGHLIGHTS = [
  {
    title: "Town Hall Forum",
    image: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
  },
  {
    title: "Cohort Session",
    image: BNS_COMMUNITY_IMAGES.cohortA,
    imagePosition: "center",
  },
  {
    title: "Stakeholder Roundtable",
    image: BNS_COMMUNITY_IMAGES.stakeholdersB,
    imagePosition: "center 15%",
  },
] as const;
