/**
 * @deprecated Prefer `@/content` media JSON — kept as a compatibility shim.
 */
import { mediaContent } from "@/content";

export const BNS_MEDIA_IMAGES = mediaContent.media;
export const BNS_COMMUNITY_IMAGES = mediaContent.community;

export const BNS_STUDIO_PORTFOLIO_IMAGES = [
  {
    id: "media-main",
    title: "BNS Studio Production",
    category: "Videography",
    image_url: BNS_MEDIA_IMAGES.main,
    description: "Flagship studio shoot capturing civic storytelling in production.",
  },
  {
    id: "media-3905",
    title: "On-Set Coverage",
    category: "Videography",
    image_url: BNS_MEDIA_IMAGES.productionA,
    description: "Behind-the-scenes videography for budget and civic education content.",
  },
  {
    id: "media-4039",
    title: "Studio Session",
    category: "Photography",
    image_url: BNS_MEDIA_IMAGES.productionB,
    description: "Portrait and interview photography from a BNS Studio session.",
  },
  {
    id: "media-hall",
    title: "Hall Event Coverage",
    category: "Events",
    image_url: BNS_MEDIA_IMAGES.hall,
    description: "Event photography and video coverage in the main hall.",
  },
  {
    id: "community-forum",
    title: "Town Hall Forum",
    category: "Events",
    image_url: BNS_COMMUNITY_IMAGES.forumA,
    description: "Public participation forum — photo and video documentation.",
  },
  {
    id: "community-cohort",
    title: "Cohort Groundworks",
    category: "Brand",
    image_url: BNS_COMMUNITY_IMAGES.cohortA,
    description: "Youth cohort engagement captured for brand and documentary use.",
  },
  {
    id: "community-stakeholders",
    title: "Stakeholder Roundtable",
    category: "Photography",
    image_url: BNS_COMMUNITY_IMAGES.stakeholdersB,
    description: "Stakeholder meetings and partnership events on camera.",
  },
  {
    id: "community-forum-b",
    title: "Civic Engagement Day",
    category: "Events",
    image_url: BNS_COMMUNITY_IMAGES.forumD,
    description: "Citizen engagement sessions filmed and photographed by BNS Studio.",
  },
] as const;
