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
    shortDesc: "Bilingual fiscal deep-dives, field soundscapes, and expert debate series.",
    icon: Mic,
  },
  {
    id: "Animations",
    label: "Animations",
    shortDesc: "High-engagement 2D & motion explainers that demystify complex legislation & budget cycles.",
    icon: Sparkles,
  },
  {
    id: "Explainer Videos",
    label: "Explainer Videos",
    shortDesc: "Step-by-step visual breakdowns of public finance, policy memos, and sector allocations.",
    icon: Video,
  },
  {
    id: "Research Spotlights",
    label: "Research Spotlights",
    shortDesc: "Digestible multimedia packaging for institutional policy briefs and data reports.",
    icon: FileText,
  },
  {
    id: "Documentaries",
    label: "Documentaries",
    shortDesc: "Cinematic, character-driven storytelling capturing grassroots community realities.",
    icon: Film,
  },
  {
    id: "Social Media Series",
    label: "Social Media Series",
    shortDesc: "Bite-sized vertical video (Reels/TikTok) engineered for virality and civic action.",
    icon: Share2,
  },
  {
    id: "Town Hall Design & Facilitation",
    label: "Town Hall Design & Facilitation",
    shortDesc: "Curated multi-stakeholder convening architectures with live audio/visual recording.",
    icon: Users,
  },
  {
    id: "Community Listening Sessions",
    label: "Community Listening Sessions",
    shortDesc: "Hyper-local participatory dialogues capturing ground-level budget evidence.",
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
    description: "County Governments, National Treasury, and Oversight Bodies fulfilling participation mandates.",
  },
  {
    id: "Development Partners & INGOs",
    label: "Development Partners & INGOs",
    description: "Multilateral agencies and foundations communicating governance, ESG, and fiscal outcomes.",
  },
  {
    id: "Civil Society & CSOs",
    label: "Civil Society & CSOs",
    description: "Civic watchdogs and rights groups needing high-impact campaign production.",
  },
  {
    id: "Private Sector & ESG",
    label: "Private Sector & ESG",
    description: "Commercial leaders, financial institutions, and ESG innovators driving transparent initiatives.",
  },
  {
    id: "Grassroots & Community Alliances",
    label: "Grassroots & Community Alliances",
    description: "Community-based collectives, youth networks, and resident associations.",
  },
];

export type StudioEvidenceItem = {
  id: string;
  title: string;
  contentType: StudioContentType;
  organizationType: StudioOrganizationType;
  organizationName: string;
  summary: string;
  description: string;
  impactMetric: string;
  deliverables: string[];
  image_url: string;
  imagePosition?: string;
  video_url?: string;
  video_platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  year: string;
  featured?: boolean;
};

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

/** Curated evidence items showcasing recent work by Content Type and Organisation */
export const BNS_STUDIO_EVIDENCE: StudioEvidenceItem[] = [
  {
    id: "ev-podcast-01",
    title: "Sauti ya Bajeti: Fiscal Decoded Audio Series",
    contentType: "Podcast & Audio",
    organizationType: "Development Partners & INGOs",
    organizationName: "Global Transparency Initiative & BNS",
    summary: "12-part bilingual podcast unpackaging national debt sustainability and county revenue splits.",
    description: "Produced from studio-grade recording sessions and street vox-pops, translating intricate macro-economic indices into relatable Swahili/Sheng conversations. Distributed across Spotify, Apple Podcasts, and community radio syndicates.",
    impactMetric: "85,000+ total downloads & 14 radio station syndications across 8 counties",
    deliverables: ["12 master audio episodes", "Audiograms for social distribution", "Executive summary briefs"],
    image_url: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    year: "2025/2026",
    featured: true,
  },
  {
    id: "ev-anim-01",
    title: "County Budget Flow Animated Guide",
    contentType: "Animations",
    organizationType: "Governments & Public Sector",
    organizationName: "Council of Governors & County Civic Desks",
    summary: "Motion-graphics explainer walking citizens through the 4 stages of the County Fiscal Calendar.",
    description: "Created vibrant character animations in Sheng and English explaining ADP (Annual Development Plan), CFSP (County Fiscal Strategy Paper), and Public Participation deadlines.",
    impactMetric: "Over 420,000 social views & broadcast on regional television civic segments",
    deliverables: ["2D animated master (English & Sheng)", "Modular 30s WhatsApp micro-clips", "Interactive PDF guide"],
    image_url: BNS_MEDIA_IMAGES.main,
    imagePosition: "center",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-explainer-01",
    title: "Health Sector Own-Source Revenue Breakdown",
    contentType: "Explainer Videos",
    organizationType: "Civil Society & CSOs",
    organizationName: "Public Health Alliance Kenya",
    summary: "Presenter-led video demystifying facility-level health financing and county allocation gaps.",
    description: "A fast-paced, evidence-anchored explainer filmed in studio with dynamic on-screen typography, data charts, and hospital field inserts showing where every shilling goes.",
    impactMetric: "Adopted by 18 county health caucuses during FY25/26 budget submissions",
    deliverables: ["4K Explainer Video (5 mins)", "5x short vertical reels", "Infographic toolkit"],
    image_url: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-research-01",
    title: "Debt & Youth Unemployment Policy Spotlight",
    contentType: "Research Spotlights",
    organizationType: "Development Partners & INGOs",
    organizationName: "East Africa Fiscal Policy Institute",
    summary: "Transforming a 90-page technical econometric study into accessible digital multimedia cards & spotlight videos.",
    description: "Synthesized technical econometric models into 3 visual video briefs and interactive digital charts for parliamentary committee aides and civil society advocates.",
    impactMetric: "Cited in 4 parliamentary committee briefings & reached 25,000+ policy professionals",
    deliverables: ["3x Video Policy Spotlights", "Interactive Data Assets", "Executive Slide Decks"],
    image_url: BNS_COMMUNITY_IMAGES.stakeholdersB,
    imagePosition: "center 15%",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-doc-01",
    title: "Shallow Waters: The Cost of Stalled Boreholes",
    contentType: "Documentaries",
    organizationType: "Grassroots & Community Alliances",
    organizationName: "Turkana & Baringo Community Water Action",
    summary: "Investigative short documentary tracing Ksh 45M allocated to stalled water infrastructure.",
    description: "On-the-ground investigative documentary capturing resident testimonials, audit report discrepancies, and contractor records, paired with drone cinematography across three sub-counties.",
    impactMetric: "Prompted county assembly oversight audit and resumption of 2 stalled water projects",
    deliverables: ["18-minute cinematic short doc", "Trailers & promotional campaign", "Community screening kit"],
    image_url: BNS_MEDIA_IMAGES.hall,
    imagePosition: "center",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-social-01",
    title: "Finance Bill Explainer: Mtaa to Parliament",
    contentType: "Social Media Series",
    organizationType: "Civil Society & CSOs",
    organizationName: "Civic Freedom Network",
    summary: "Viral 10-episode TikTok and Instagram Reels campaign breaking down tax clauses and public debt servicing.",
    description: "High-retention vertical videos combining humor, data overlays, and clear civic call-to-actions that empowered young citizens to write informed memoranda to Parliament.",
    impactMetric: "1.8 Million combined views & 12,000+ public memorandum template downloads",
    deliverables: ["10x vertical 60s videos", "CapCut / Instagram templates", "Community discussion threads"],
    image_url: BNS_COMMUNITY_IMAGES.cohortA,
    imagePosition: "center",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-townhall-01",
    title: "National Youth Fiscal Assembly 2025",
    contentType: "Town Hall Design & Facilitation",
    organizationType: "Governments & Public Sector",
    organizationName: "National Treasury & Youth Advisory Council",
    summary: "Complete experience design, moderation, and multi-camera live broadcast for 400 youth delegates.",
    description: "Designed a collaborative 'fishbowl' participatory format, integrated digital polling systems, and coordinated live multi-camera broadcast across YouTube and national broadcast media.",
    impactMetric: "400 in-person delegates, 24,000 livestream viewers & 38 policy recommendations submitted",
    deliverables: ["Full stage design & A/V setup", "Live multi-camera broadcast", "Post-event comprehensive outcome report"],
    image_url: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-listening-01",
    title: "Informal Settlement Ward Allocation Listening Circles",
    contentType: "Community Listening Sessions",
    organizationType: "Grassroots & Community Alliances",
    organizationName: "Mukuru & Mathare Community Alliances",
    summary: "Grassroots evidence-gathering sessions documenting urban poor budget priorities.",
    description: "Facilitated structured, safe listening circles using participatory mapping and oral testimony capture. Produced grassroots evidence dossiers presented directly to county budget committees.",
    impactMetric: "8 Community Listening Circles, 650+ residents engaged, 5 key drainage priorities funded",
    deliverables: ["Community evidence dossier", "Audio story archive", "Action advocacy roadmap"],
    image_url: BNS_COMMUNITY_IMAGES.forumD,
    imagePosition: "center",
    year: "2025",
    featured: true,
  },
  {
    id: "ev-private-01",
    title: "Corporate ESG & Localized Climate Finance Story",
    contentType: "Documentaries",
    organizationType: "Private Sector & ESG",
    organizationName: "Kenya Sustainable Agribusiness Consortium",
    summary: "Impact visual report documenting smallholder carbon credit disbursements and financial audits.",
    description: "Documented verified community outcomes of private ESG investments in renewable energy and green livelihoods, combining executive interviews with smallholder farmer stories.",
    impactMetric: "Presented at COP Regional Forum & secured follow-on private matching grant",
    deliverables: ["Cinematic Impact Film (8 mins)", "B2B Case Study Suite", "Photography Library"],
    image_url: BNS_COMMUNITY_IMAGES.stakeholdersA,
    imagePosition: "center",
    year: "2025",
    featured: false,
  },
];

/** Compatibility alias for existing imports */
export const BNS_STUDIO_PORTFOLIO = BNS_STUDIO_EVIDENCE.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.contentType,
  image_url: item.image_url,
  description: item.summary,
  impactMetric: item.impactMetric,
  organizationName: item.organizationName,
  organizationType: item.organizationType,
  year: item.year,
}));

/** Curated rows for the landing-page timeline-style studio block. */
export const BNS_STUDIO_LANDING_SHOWCASE: BnsStudioService[] = [
  {
    icon: Video,
    name: "Explainer Videos & Animations",
    contentType: "Explainer Videos",
    description:
      "Turning complex fiscal legislation, budget splits, and policy reports into high-clarity videos and motion graphics.",
    image: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    features: ["Motion graphics & 2D animation", "Presenter-led video explainers", "Bilingual English & Sheng scripts"],
    bestFor: "Governments, CSOs, and Development Partners seeking mass public comprehension.",
  },
  {
    icon: Mic,
    name: "Podcasts & Audio Series",
    contentType: "Podcast & Audio",
    description:
      "Studio-grade audio production, field soundscapes, and conversational fiscal deep-dives tailored for broadcast and digital streaming.",
    image: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    features: ["Bilingual audio production", "Full mastering & sound design", "Syndication-ready distribution"],
    bestFor: "Research institutes, think tanks, and civic watchdogs.",
  },
  {
    icon: Users,
    name: "Town Hall Design & Listening Sessions",
    contentType: "Town Hall Design & Facilitation",
    description:
      "End-to-end convening architecture, facilitation frameworks, and multi-camera broadcast capture for high-trust civic dialogues.",
    image: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
    features: ["Participatory facilitation design", "Multi-camera live streaming", "Structured community evidence dossiers"],
    bestFor: "Counties, bilateral donors, and grassroots alliances.",
  },
];

export const BNS_STUDIO_PAGE_SERVICES: (BnsStudioService & { price: string })[] = [
  {
    icon: Mic,
    name: "Podcast & Audio Production",
    contentType: "Podcast & Audio",
    description:
      "Full-cycle audio production from concept, scripting, guest curation, studio recording, and mastering to distribution.",
    image: BNS_MEDIA_IMAGES.productionB,
    imagePosition: "center 20%",
    price: "Custom Package",
    features: [
      "Acoustically treated studio & field recording",
      "Editorial research & script doctoring",
      "Broadcast-grade mastering & soundscapes",
      "Social audiograms & transcription packs",
    ],
    bestFor: "Think tanks, bilateral donors, and policy institutions.",
  },
  {
    icon: Sparkles,
    name: "2D Animations & Motion Graphics",
    contentType: "Animations",
    description:
      "Engaging animations that visually untangle multi-layered datasets, statutory processes, and public finance cycles.",
    image: BNS_MEDIA_IMAGES.main,
    imagePosition: "center",
    price: "Custom Package",
    features: [
      "Custom character illustration & storyboard",
      "Bilingual voiceover talent (Sheng, English, Swahili)",
      "High-retention kinetic typography",
      "Optimized formats for WhatsApp & TV broadcast",
    ],
    bestFor: "Public participation desks, voter education, and youth outreach.",
  },
  {
    icon: Video,
    name: "Explainer Videos",
    contentType: "Explainer Videos",
    description:
      "High-energy, presenter-driven or data-rich video explainers that contextualize budgets, governance policies, and citizen rights.",
    image: BNS_MEDIA_IMAGES.productionA,
    imagePosition: "center top",
    price: "Custom Package",
    features: [
      "Studio teleprompter or field setup",
      "Integrated data graphics & infographics",
      "4K cinematography & multi-camera shoot",
      "Fast-turnaround post-production",
    ],
    bestFor: "Civil society advocacy and governmental public education.",
  },
  {
    icon: FileText,
    name: "Research Spotlights & Policy Packaging",
    contentType: "Research Spotlights",
    description:
      "Distilling heavy institutional reports into digestible multimedia summaries, executive video decks, and infographic suites.",
    image: BNS_COMMUNITY_IMAGES.stakeholdersB,
    imagePosition: "center 15%",
    price: "Custom Package",
    features: [
      "Academic & econometric report synthesis",
      "Executive 2-minute video briefs",
      "Interactive data visualizations",
      "Policy memo design for parliamentary engagement",
    ],
    bestFor: "Academic institutions, INGOs, and research think tanks.",
  },
  {
    icon: Film,
    name: "Documentaries & Investigative Films",
    contentType: "Documentaries",
    description:
      "Cinematic, character-centered documentaries exploring human stories behind public expenditure, climate finance, and community resilience.",
    image: BNS_MEDIA_IMAGES.hall,
    imagePosition: "center",
    price: "Custom Package",
    features: [
      "Field cinematography & drone capture",
      "Investigative research & ethics-first interviews",
      "DaVinci color grading & cinematic score",
      "Community screening & festival toolkit",
    ],
    bestFor: "Foundations, ESG corporate initiatives, and grassroots coalitions.",
  },
  {
    icon: Share2,
    name: "Social Media Series (Shorts/Reels/TikTok)",
    contentType: "Social Media Series",
    description:
      "Bite-sized, high-retention vertical video campaigns crafted for maximum algorithm reach and real-world citizen mobilization.",
    image: BNS_COMMUNITY_IMAGES.cohortA,
    imagePosition: "center",
    price: "Custom Package",
    features: [
      "Trend-fluent vertical video editing",
      "Sheng & youth-culture vernacular fluency",
      "Batch production of 5–20 episodic assets",
      "Engagement analytics & community moderation strategy",
    ],
    bestFor: "Youth mobilization, civic campaigns, and brand storytelling.",
  },
  {
    icon: Users,
    name: "Town Hall Design & Facilitation",
    contentType: "Town Hall Design & Facilitation",
    description:
      "Comprehensive convening architecture, live multi-camera broadcasting, and participatory moderation for major stakeholder forums.",
    image: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
    price: "Custom Package",
    features: [
      "Fishbowl & interactive dialogic format design",
      "Multi-camera 4K livestreaming & A/V engineering",
      "Digital live polling & Q&A moderation",
      "Executive synthesis & video highlights reel",
    ],
    bestFor: "National and county government agencies, donor summits.",
  },
  {
    icon: MessagesSquare,
    name: "Community Listening Sessions",
    contentType: "Community Listening Sessions",
    description:
      "Hyper-local, safe participatory listening circles that collect oral testimonies and qualitative budget evidence from marginalized communities.",
    image: BNS_COMMUNITY_IMAGES.forumD,
    imagePosition: "center",
    price: "Custom Package",
    features: [
      "Community-rooted safe circle facilitation",
      "Qualitative evidence mapping & coding",
      "Audio testimonial repository",
      "Formal community evidence memorandum packaging",
    ],
    bestFor: "Grassroots alliances, human rights bodies, and civic funds.",
  },
];

export const BNS_STUDIO_HERO_IMAGE = BNS_MEDIA_IMAGES.productionA;

export const BNS_STUDIO_COMMUNITY_HIGHLIGHTS = [
  {
    title: "National Youth Town Hall",
    image: BNS_COMMUNITY_IMAGES.forumA,
    imagePosition: "center top",
  },
  {
    title: "Groundworks Cohort Session",
    image: BNS_COMMUNITY_IMAGES.cohortA,
    imagePosition: "center",
  },
  {
    title: "Policy Stakeholder Roundtable",
    image: BNS_COMMUNITY_IMAGES.stakeholdersB,
    imagePosition: "center 15%",
  },
] as const;

