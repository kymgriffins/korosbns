/** Local public assets — names reflect intended use across landing & studio. */
export const BNS_MEDIA_IMAGES = {
  main: "/images/media/main%20media%20image.jpg",
  productionA: "/images/media/129A3905.jpg",
  productionB: "/images/media/129A4039.jpg",
  hall: "/images/hall/129A4248.jpg",
} as const;

export const BNS_COMMUNITY_IMAGES = {
  forumA: "/images/towwnhallmay/129A3863.jpg",
  forumB: "/images/towwnhallmay/129A3912.jpg",
  forumC: "/images/towwnhallmay/129A3923.jpg",
  forumD: "/images/towwnhallmay/129A4056.jpg",
  forumE: "/images/towwnhallmay/129A4094.jpg",
  cohortA: "/images/cohort1 groundworks/129A3964.jpg",
  cohortB: "/images/cohort1 groundworks/129A3987.jpg",
  stakeholdersA: "/images/stakeholders/129A4094.jpg",
  stakeholdersB: "/images/stakeholders/129A4113.jpg",
  stakeholdersC: "/images/stakeholders/129A4164.jpg",
} as const;

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
