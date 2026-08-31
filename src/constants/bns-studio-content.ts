import {
  Mic,
  Sparkles,
  Video,
  FileText,
  Film,
  Share2,
  Users,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
} from "@/constants/bns-media-images";

export type StudioContentType =
  | "Podcast & Audio"
  | "Animations"
  | "Explainer Videos"
  | "Research Spotlights"
  | "Documentaries"
  | "Social Media Series"
  | "Town Hall Design & Facilitation"
  | "Community Listening Sessions";

export type StudioOrganizationType =
  | "Governments & Public Sector"
  | "Development Partners & INGOs"
  | "Civil Society & CSOs"
  | "Private Sector & ESG"
  | "Grassroots & Community Alliances";

export const STUDIO_CONTENT_TYPES: {
  id: StudioContentType;
  label: string;
  shortDesc: string;
  icon: LucideIcon;
}[] = [
  {
    id: "Podcast & Audio",
    label: "Podcast & Audio",
    shortDesc:
      "Bilingual fiscal deep-dives, field soundscapes, and expert debate series.",
    icon: Mic,
  },
  {
    id: "Animations",
    label: "Animations",
    shortDesc:
      "High-engagement 2D and motion explainers that demystify complex legislation and budget cycles.",
    icon: Sparkles,
  },
  {
    id: "Explainer Videos",
    label: "Explainer Videos",
    shortDesc:
      "Step-by-step visual breakdowns of public finance, policy memos, and sector allocations.",
    icon: Video,
  },
  {
    id: "Research Spotlights",
    label: "Research Spotlights",
    shortDesc:
      "Digestible multimedia packaging for institutional policy briefs and data reports.",
    icon: FileText,
  },
  {
    id: "Documentaries",
    label: "Documentaries",
    shortDesc:
      "Cinematic, character-driven storytelling capturing grassroots community realities.",
    icon: Film,
  },
  {
    id: "Social Media Series",
    label: "Social Media Series",
    shortDesc:
      "Bite-sized vertical video engineered for reach and civic action.",
    icon: Share2,
  },
  {
    id: "Town Hall Design & Facilitation",
    label: "Town Hall Design & Facilitation",
    shortDesc:
      "Curated multi-stakeholder convening with live audio and visual recording.",
    icon: Users,
  },
  {
    id: "Community Listening Sessions",
    label: "Community Listening Sessions",
    shortDesc:
      "Hyper-local participatory dialogues capturing ground-level budget evidence.",
    icon: MessagesSquare,
  },
];

export const STUDIO_ORGANIZATION_TYPES: {
  id: StudioOrganizationType;
  label: string;
  description: string;
}[] = [
  {
    id: "Governments & Public Sector",
    label: "Governments & Public Sector",
    description:
      "County governments, national treasury, and oversight bodies fulfilling participation mandates.",
  },
  {
    id: "Development Partners & INGOs",
    label: "Development Partners & INGOs",
    description:
      "Multilateral agencies and foundations communicating governance, ESG, and fiscal outcomes.",
  },
  {
    id: "Civil Society & CSOs",
    label: "Civil Society & CSOs",
    description:
      "Civic watchdogs and rights groups needing high-impact campaign production.",
  },
  {
    id: "Private Sector & ESG",
    label: "Private Sector & ESG",
    description:
      "Commercial leaders, financial institutions, and ESG innovators driving transparent initiatives.",
  },
  {
    id: "Grassroots & Community Alliances",
    label: "Grassroots & Community Alliances",
    description:
      "Community-based collectives, youth networks, and resident associations.",
  },
];

export type BnsStudioService = {
  icon: LucideIcon;
  name: string;
  contentType: StudioContentType;
  description: string;
  image: string;
  imagePosition?: string;
  features: string[];
  bestFor: string;
};

/** Curated rows for the landing-page studio block. */
export const BNS_STUDIO_LANDING_SHOWCASE: BnsStudioService[] = [
  {
    icon: Video,
    name: "Explainer Videos & Animations",
    contentType: "Explainer Videos",
    description:
      "Turning complex fiscal legislation, budget splits, and policy reports into high-clarity videos and motion graphics.",
    image: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    features: [
      "Motion graphics and 2D animation",
      "Presenter-led video explainers",
      "Bilingual English and Sheng scripts",
    ],
    bestFor:
      "Governments, CSOs, and development partners seeking mass public comprehension.",
  },
  {
    icon: Mic,
    name: "Podcasts & Audio Series",
    contentType: "Podcast & Audio",
    description:
      "Studio-grade audio production, field soundscapes, and conversational fiscal deep-dives for broadcast and streaming.",
    image: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    features: [
      "Bilingual audio production",
      "Full mastering and sound design",
      "Syndication-ready distribution",
    ],
    bestFor: "Research institutes, think tanks, and civic watchdogs.",
  },
  {
    icon: Users,
    name: "Town Halls & Listening Sessions",
    contentType: "Town Hall Design & Facilitation",
    description:
      "End-to-end convening architecture, facilitation frameworks, and multi-camera broadcast for high-trust civic dialogues.",
    image: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
    features: [
      "Participatory facilitation design",
      "Multi-camera live streaming",
      "Structured community evidence dossiers",
    ],
    bestFor: "Counties, bilateral donors, and grassroots alliances.",
  },
];

export const BNS_STUDIO_PAGE_SERVICES: (BnsStudioService & { price: string })[] =
  STUDIO_CONTENT_TYPES.map((type) => {
    const showcase = BNS_STUDIO_LANDING_SHOWCASE.find(
      (item) => item.contentType === type.id,
    );
    const imageMap: Partial<Record<StudioContentType, string>> = {
      "Podcast & Audio": BNS_MEDIA_IMAGES.productionB,
      Animations: BNS_MEDIA_IMAGES.main,
      "Explainer Videos": BNS_MEDIA_IMAGES.productionA,
      "Research Spotlights": BNS_COMMUNITY_IMAGES.stakeholdersB,
      Documentaries: BNS_MEDIA_IMAGES.hall,
      "Social Media Series": BNS_COMMUNITY_IMAGES.cohortA,
      "Town Hall Design & Facilitation": BNS_COMMUNITY_IMAGES.forumA,
      "Community Listening Sessions": BNS_COMMUNITY_IMAGES.forumD,
    };

    return {
      icon: type.icon,
      name: type.label,
      contentType: type.id,
      description: showcase?.description ?? type.shortDesc,
      image: imageMap[type.id] ?? BNS_MEDIA_IMAGES.main,
      imagePosition: showcase?.imagePosition,
      price: "Custom Package",
      features: showcase?.features ?? [type.shortDesc],
      bestFor:
        showcase?.bestFor ??
        "Partners seeking evidence-based civic storytelling in this format.",
    };
  });

export const BNS_STUDIO_HERO_IMAGE = BNS_MEDIA_IMAGES.productionA;
