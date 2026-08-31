import {
  BNS_MEDIA_IMAGES,
  BNS_COMMUNITY_IMAGES,
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

export type StudioSectorType =
  | "Governments & Public Sector"
  | "Development Partners & INGOs"
  | "Civil Society & CSOs"
  | "Private Sector & ESG"
  | "Grassroots & Community Alliances";

export interface StudioPartnerOrg {
  id: string;
  slug: string;
  name: string;
  sector: StudioSectorType;
  description: string;
  location: string;
  logoText: string;
}

export interface StudioEvidenceMedia {
  type: "video" | "audio" | "image" | "animation";
  posterUrl: string;
  posterPosition?: string;
  videoUrl?: string;
  audioUrl?: string;
  platform?: "youtube" | "vimeo" | "cloudinary" | "spotify" | "local" | "other";
  aspectRatio?: "16/9" | "4/3" | "9/16" | "1/1";
  caption?: string;
}

export interface StudioProjectEvidence {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  contentType: StudioContentType;
  organization: StudioPartnerOrg;
  date: string;
  year: string;
  briefChallenge: string;
  whatWeProduced: string;
  description: string;
  media: StudioEvidenceMedia;
  outputs: string[];
  impactEvidence: {
    primaryMetric: string;
    secondaryMetric?: string;
    context: string;
    verificationOutcome?: string;
  };
  tags: string[];
  featured?: boolean;
}

export const STUDIO_ORGANIZATIONS: StudioPartnerOrg[] = [
  {
    id: "org-treasury",
    slug: "national-treasury-youth",
    name: "National Treasury & Youth Advisory Council",
    sector: "Governments & Public Sector",
    description: "National executive oversight and participatory youth budget consultative forums.",
    location: "Nairobi / Nationwide",
    logoText: "Treasury KE",
  },
  {
    id: "org-cog",
    slug: "council-of-governors-civic",
    name: "Council of Governors & County Civic Desks",
    sector: "Governments & Public Sector",
    description: "Inter-county coordination body advancing devolution and county fiscal participation.",
    location: "47 Counties",
    logoText: "CoG Civic",
  },
  {
    id: "org-gti",
    slug: "global-transparency-initiative",
    name: "Global Transparency Initiative & BNS",
    sector: "Development Partners & INGOs",
    description: "Bilateral fiscal transparency and debt accountability consortium.",
    location: "East Africa",
    logoText: "GTI East Africa",
  },
  {
    id: "org-eafpi",
    slug: "east-africa-fiscal-policy-institute",
    name: "East Africa Fiscal Policy Institute",
    sector: "Development Partners & INGOs",
    description: "Independent economic think tank conducting empirical econometric and fiscal studies.",
    location: "Nairobi / Regional",
    logoText: "EAFPI",
  },
  {
    id: "org-phak",
    slug: "public-health-alliance-kenya",
    name: "Public Health Alliance Kenya",
    sector: "Civil Society & CSOs",
    description: "Coalition of health rights advocates monitoring county health expenditure and hospital supplies.",
    location: "Nairobi & Coast",
    logoText: "PHAK",
  },
  {
    id: "org-cfn",
    slug: "civic-freedom-network",
    name: "Civic Freedom Network",
    sector: "Civil Society & CSOs",
    description: "Youth-led civic watchdog defending constitutional public participation and tax justice.",
    location: "Nairobi / Digital",
    logoText: "CFN Kenya",
  },
  {
    id: "org-water-action",
    slug: "turkana-baringo-community-water-action",
    name: "Turkana & Baringo Community Water Action",
    sector: "Grassroots & Community Alliances",
    description: "Community assembly tracking local climate finance, borehole allocations, and contractor execution.",
    location: "Turkana & Baringo Counties",
    logoText: "Water Action",
  },
  {
    id: "org-informal-alliances",
    slug: "mukuru-mathare-community-alliances",
    name: "Mukuru & Mathare Community Alliances",
    sector: "Grassroots & Community Alliances",
    description: "Grassroots ward-level dialogue collective tracking informal settlement infrastructure spending.",
    location: "Nairobi Informal Settlements",
    logoText: "Mtaa Alliance",
  },
  {
    id: "org-agribusiness",
    slug: "kenya-sustainable-agribusiness-consortium",
    name: "Kenya Sustainable Agribusiness Consortium",
    sector: "Private Sector & ESG",
    description: "Commercial agricultural leaders investing in verifiable ESG climate resilience for smallholders.",
    location: "Rift Valley / Central",
    logoText: "KSAC ESG",
  },
];

export const STUDIO_PROJECTS: StudioProjectEvidence[] = [
  {
    id: "proj-podcast-sauti",
    slug: "sauti-ya-bajeti-podcast",
    title: "Sauti ya Bajeti: Fiscal Decoded Audio Series",
    subtitle: "12-Part Bilingual Podcast Unpacking Debt & County Revenue Splits",
    contentType: "Podcast & Audio",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "global-transparency-initiative")!,
    date: "January 2026",
    year: "2026",
    briefChallenge:
      "National debt figures and macroeconomic policy documents were inaccessible to ordinary youth, leading to disengagement and viral misinformation on social channels.",
    whatWeProduced:
      "Produced a 12-episode bilingual podcast recorded with studio-grade acoustics and street vox-pops. Blended rigorous fiscal data with relatable Swahili and Sheng conversational formats.",
    description:
      "Sauti ya Bajeti took complex IMF benchmarks, sovereign bond debt amortisation, and equitable revenue sharing formulas and turned them into gripping audio conversations. Distributed across Spotify, Apple Podcasts, and syndicated over 14 regional community radio stations across 8 counties.",
    media: {
      type: "audio",
      posterUrl: BNS_MEDIA_IMAGES.productionB,
      posterPosition: "center 20%",
      platform: "spotify",
      caption: "Studio recording session with fiscal policy economists and grassroots youth hosts.",
    },
    outputs: [
      "12 broadcast-mastered podcast episodes (45 mins each)",
      "36 micro-audiograms optimized for WhatsApp & Twitter/X",
      "Bilingual executive transcription & policy quote cards",
      "Community radio broadcast syndication packet",
    ],
    impactEvidence: {
      primaryMetric: "85,000+ Downloads",
      secondaryMetric: "14 Radio Stations Syndicated",
      context:
        "Ranked in top 10 educational podcasts in Kenya in Q1 2026. Syndicated to an estimated weekly radio listenership of 450,000 across Kisumu, Mombasa, Nakuru, and Garissa.",
      verificationOutcome:
        "Adopted as training audio in 6 university student government budget committees.",
    },
    tags: ["National Debt", "Equitable Share", "Podcast", "Audio Storytelling"],
    featured: true,
  },
  {
    id: "proj-anim-county-flow",
    slug: "county-budget-flow-animation",
    title: "County Budget Flow Animated Guide",
    subtitle: "2D Motion Graphics Demystifying the 4 Stages of the County Fiscal Calendar",
    contentType: "Animations",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "council-of-governors-civic")!,
    date: "November 2025",
    year: "2025",
    briefChallenge:
      "Citizens consistently missed statutory public participation windows (ADP, CFSP, and Budget Estimates) because county announcements were written in dense bureaucratic notices.",
    whatWeProduced:
      "Designed dynamic 2D character-animated explainers in Sheng and English walking citizens through statutory timelines, civic rights at ward barazas, and how to submit written memoranda.",
    description:
      "Through vibrant Kenyan character animations, this piece deconstructed the fiscal cycle from August to June into 4 clear citizen action steps. Packaged as both high-definition video for local television and lightweight compressed snippets for rapid WhatsApp peer sharing.",
    media: {
      type: "animation",
      posterUrl: BNS_MEDIA_IMAGES.main,
      posterPosition: "center",
      platform: "cloudinary",
      caption: "Character animation visualising the County Fiscal Strategy Paper (CFSP) review process.",
    },
    outputs: [
      "4-minute 2D Master Animated Explainer (English & Sheng)",
      "4x 45s WhatsApp modular micro-animations",
      "Static illustrated fiscal calendar infographic toolkit",
      "County civic desk social distribution kit",
    ],
    impactEvidence: {
      primaryMetric: "420,000+ Social Views",
      secondaryMetric: "Broadcast on 3 TV Stations",
      context:
        "Achieved organic peer-to-peer sharing with over 18,000 WhatsApp status reshres in Kakamega, Kilifi, Nakuru, and Machakos counties during FY25/26 public participation week.",
      verificationOutcome:
        "Documented a 34% increase in youth attendance across 12 sampled ward participation hearings.",
    },
    tags: ["County Budgets", "Public Participation", "2D Animation", "Motion Graphics"],
    featured: true,
  },
  {
    id: "proj-explainer-health",
    slug: "health-revenue-explainer",
    title: "Health Sector Own-Source Revenue Breakdown",
    subtitle: "Presenter-Led Explainer Tracking Hospital Fees to County Treasury",
    contentType: "Explainer Videos",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "public-health-alliance-kenya")!,
    date: "October 2025",
    year: "2025",
    briefChallenge:
      "Community members were frustrated by frequent stockouts of essential medicine despite paying facility user fees, but lacked the financial trail showing where hospital revenues were retained.",
    whatWeProduced:
      "Filmed a presenter-led video explainer combining on-screen motion data infographics with facility B-roll, illustrating how Facility Improvement Funds (FIF) operate under new devolution laws.",
    description:
      "Shot with studio teleprompter and verified health accounting data, the video mapped the exact statutory difference between facility-retained funds and revenues swept into county exchequers. It provided actionable tools for hospital management committees and patients.",
    media: {
      type: "video",
      posterUrl: BNS_MEDIA_IMAGES.productionA,
      posterPosition: "center top",
      platform: "youtube",
      caption: "On-set production of the Health Sector Revenue Allocation breakdown.",
    },
    outputs: [
      "5-minute 4K Explainer Master Video",
      "5x High-retention vertical reels for TikTok & Instagram",
      "Pocket data cheat-sheet for health advocates",
      "Interactive digital chart embeds",
    ],
    impactEvidence: {
      primaryMetric: "Adopted by 18 County Caucuses",
      secondaryMetric: "92,000+ Targeted Views",
      context:
        "Used as primary visual evidence by civil society caucuses in 18 counties during FY25/26 budget submissions, advocating for 100% facility retention of hospital revenues.",
      verificationOutcome:
        "Directly influenced policy amendments in 4 county health committee legislative bills.",
    },
    tags: ["Healthcare", "Devolution", "FIF Funds", "Explainer Video"],
    featured: false,
  },
  {
    id: "proj-research-debt-youth",
    slug: "debt-youth-unemployment-spotlight",
    title: "Debt & Youth Unemployment Policy Spotlight",
    subtitle: "Synthesizing a 90-Page Econometric Model into 2-Minute Visual Briefs",
    contentType: "Research Spotlights",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "east-africa-fiscal-policy-institute")!,
    date: "August 2025",
    year: "2025",
    briefChallenge:
      "A groundbreaking econometric study examining the crowding-out effect of domestic debt on youth entrepreneurship financing remained unread in lengthy PDF formats.",
    whatWeProduced:
      "Transformed the academic monograph into 3 digestible video spotlights, interactive data charts, and executive visual briefs tailored for parliamentary staff and journalists.",
    description:
      "BNS Studios extracted core econometric regression findings and translated them into clear visual metaphors, chart overlays, and brief soundbites from lead researchers. Delivered high-level authority without sacrificing analytical depth.",
    media: {
      type: "video",
      posterUrl: BNS_COMMUNITY_IMAGES.stakeholdersB,
      posterPosition: "center 15%",
      platform: "cloudinary",
      caption: "Data synthesis review with research fellows at the policy institute.",
    },
    outputs: [
      "3x 90-second Research Spotlight Videos",
      "Interactive data graphic suite for policy advisors",
      "Executive summary slide deck for parliamentary committees",
      "Media briefing kit distributed to 40 economic journalists",
    ],
    impactEvidence: {
      primaryMetric: "Cited in 4 Parliamentary Briefings",
      secondaryMetric: "25,000+ Policy Leaders Reached",
      context:
        "Provided to the Parliamentary Budget Office (PBO) and cited in parliamentary debate during the Medium Term Debt Strategy review.",
      verificationOutcome:
        "Generated 11 mainstream media op-eds and business newspaper features quoting the study.",
    },
    tags: ["Research", "Econometrics", "Youth Employment", "Policy Briefs"],
    featured: true,
  },
  {
    id: "proj-doc-water-stalled",
    slug: "shallow-waters-documentary",
    title: "Shallow Waters: The Cost of Stalled Boreholes",
    subtitle: "Investigative Cinematic Film Tracing Ksh 45M in Stalled Rural Water Projects",
    contentType: "Documentaries",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "turkana-baringo-community-water-action")!,
    date: "December 2025",
    year: "2025",
    briefChallenge:
      "Ksh 45M allocated over three financial years for solar-powered community boreholes had yielded non-functional water points, leaving pastoralist communities vulnerable to severe drought.",
    whatWeProduced:
      "Dispatched a field documentary crew with drone cinematography, portable sound kits, and investigative researchers to document community testimonials, budget trails, and audit findings.",
    description:
      "Shallow Waters combined cinematic landscape imagery with hard-hitting investigative journalism. It juxtaposed official county project completion certificates against the dry taps and broken solar arrays on the ground, elevating resident voices.",
    media: {
      type: "video",
      posterUrl: BNS_MEDIA_IMAGES.hall,
      posterPosition: "center",
      platform: "youtube",
      caption: "Field documentary screening in Baringo County with community elders and youth.",
    },
    outputs: [
      "18-minute Cinematic Investigative Short Documentary",
      "Trailer & promotional teaser campaign",
      "Community screening & dialogue toolkit",
      "Investigative memorandum submitted to County Assembly Committee",
    ],
    impactEvidence: {
      primaryMetric: "2 Stalled Water Projects Resumed",
      secondaryMetric: "Official County Oversight Audit Triggered",
      context:
        "Screened to 400 community members and local MCA representatives. Triggered a formal on-site inspection by the County Assembly Water Committee.",
      verificationOutcome:
        "Contractors returned to the site in January 2026; solar pumping restored for 3,200 households.",
    },
    tags: ["Documentary", "Investigative Film", "Water Governance", "Community Accountability"],
    featured: true,
  },
  {
    id: "proj-social-finance-bill",
    slug: "finance-bill-social-series",
    title: "Finance Bill Explainer: Mtaa to Parliament",
    subtitle: "10-Part High-Retention Vertical Video Campaign on Tax & Debt Servicing",
    contentType: "Social Media Series",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "civic-freedom-network")!,
    date: "June 2025",
    year: "2025",
    briefChallenge:
      "Youth citizens needed clause-by-clause breakdowns of proposed tax legislation within hours of publication to draft informed civic feedback before public participation deadlines closed.",
    whatWeProduced:
      "Produced a rapid-response series of 10 vertical short-form videos combining Sheng colloquialisms, kinetic text animations, and vetted revenue calculations.",
    description:
      "Each 60-second video focused on a single tax proposal (e.g., motor vehicle tax, eco-levy, withholding tax on digital content creators), comparing projected government revenue with everyday household impact. Concluded with direct links to memorandum submission portals.",
    media: {
      type: "video",
      posterUrl: BNS_COMMUNITY_IMAGES.cohortA,
      posterPosition: "center",
      platform: "cloudinary",
      caption: "Production setup for vertical rapid-response TikTok & Reels recording.",
    },
    outputs: [
      "10x Vertical 60-second Reels / TikToks / YouTube Shorts",
      "CapCut and Instagram story templates for peer remixing",
      "Verified calculation summary cards for Twitter/X threads",
      "Open-source citizen memorandum builder toolkit",
    ],
    impactEvidence: {
      primaryMetric: "1.8 Million Combined Views",
      secondaryMetric: "12,000+ Memorandum Templates Downloaded",
      context:
        "Generated massive organic engagement across TikTok and Instagram with over 95,000 shares and 14,000 comments debating specific legislative clauses.",
      verificationOutcome:
        "Over 12,000 citizens used the linked template to submit formal objections to the Clerk of the National Assembly.",
    },
    tags: ["Social Media Series", "TikTok", "Reels", "Tax Justice", "Finance Bill"],
    featured: true,
  },
  {
    id: "proj-townhall-youth-assembly",
    slug: "national-youth-fiscal-assembly",
    title: "National Youth Fiscal Assembly 2025",
    subtitle: "Complete Convening Architecture, Fishbowl Moderation & 4K Livestreaming",
    contentType: "Town Hall Design & Facilitation",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "national-treasury-youth")!,
    date: "September 2025",
    year: "2025",
    briefChallenge:
      "Conventional government town halls were plagued by top-down speeches, low youth trust, and lack of structured mechanisms to capture actionable delegate input.",
    whatWeProduced:
      "Engineered an interactive 'fishbowl' convening architecture with live digital sentiment polling, curated multi-camera 4K broadcast, and real-time testimony synthesis.",
    description:
      "BNS Studios managed the physical hall layout, audio/visual engineering, live stream broadcast to YouTube and national TV news desks, and facilitated high-intensity, respectful dialogue between Senior Treasury officials and 400 youth representatives from all 47 counties.",
    media: {
      type: "video",
      posterUrl: BNS_COMMUNITY_IMAGES.forumA,
      posterPosition: "center top",
      platform: "youtube",
      caption: "National Youth Fiscal Assembly main stage with live multi-camera broadcast.",
    },
    outputs: [
      "Full stage & lighting production in main convening hall",
      "4-camera 4K live stream broadcast with real-time lower thirds",
      "Interactive digital polling & question moderation dashboard",
      "Post-event comprehensive outcome report & highlight reel",
    ],
    impactEvidence: {
      primaryMetric: "400 Delegates + 24,000 Livestream Viewers",
      secondaryMetric: "38 Concrete Policy Resolutions Submitted",
      context:
        "Achieved 96% delegate satisfaction rating. Broadcast live across 2 national news channels and reached over 24,000 concurrent digital viewers.",
      verificationOutcome:
        "Resulted in a signed communiqué and the inclusion of 5 youth priorities in the Budget Policy Statement (BPS).",
    },
    tags: ["Town Hall", "Convening Design", "Livestream", "Public Dialogue"],
    featured: true,
  },
  {
    id: "proj-listening-ward-circles",
    slug: "informal-settlement-listening-circles",
    title: "Informal Settlement Ward Allocation Listening Circles",
    subtitle: "Hyper-Local Safe Dialogue Circles Capturing Grassroots Budget Evidence",
    contentType: "Community Listening Sessions",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "mukuru-mathare-community-alliances")!,
    date: "July 2025",
    year: "2025",
    briefChallenge:
      "Informal settlement residents in Nairobi felt excluded from county Ward Development Fund decisions, with participatory budgets routinely drafted without local testimony.",
    whatWeProduced:
      "Facilitated 8 structured, community-rooted safe listening circles using participatory community mapping, oral testimony audio recording, and priority ranking matrices.",
    description:
      "Conducted in community halls and open spaces across Mukuru, Mathare, and Kibera, these listening circles gathered verified qualitative evidence on sanitation, flood drain maintenance, and youth vocational centre funding gaps. Summarized into formal community evidence dossiers.",
    media: {
      type: "image",
      posterUrl: BNS_COMMUNITY_IMAGES.forumD,
      posterPosition: "center",
      caption: "Facilitators and grassroots mothers mapping ward flood infrastructure priorities.",
    },
    outputs: [
      "8 Community Listening Circles conducted with 650+ residents",
      "Curated audio archive of resident oral testimonies",
      "Visual participatory ward spending priority map",
      "Formal citizen memorandum submitted to Ward Budget Committees",
    ],
    impactEvidence: {
      primaryMetric: "5 Key Drainage & Lighting Priorities Funded",
      secondaryMetric: "650+ Marginalized Citizens Engaged",
      context:
        "Directly documented chronic flooding hotspots and presented mapped evidence at county assembly ward public hearings.",
      verificationOutcome:
        "Nairobi County Government allocated Ksh 12M in the supplementary budget for critical drainage desilting in Mathare Ward 4.",
    },
    tags: ["Community Listening", "Grassroots", "Ward Development", "Oral Evidence"],
    featured: false,
  },
  {
    id: "proj-doc-esg-agribusiness",
    slug: "esg-smallholder-climate-finance",
    title: "Corporate ESG & Localized Climate Finance Story",
    subtitle: "Impact Film Documenting Smallholder Carbon Credit Disbursements",
    contentType: "Documentaries",
    organization: STUDIO_ORGANIZATIONS.find((o) => o.slug === "kenya-sustainable-agribusiness-consortium")!,
    date: "May 2025",
    year: "2025",
    briefChallenge:
      "A commercial agricultural consortium needed to demonstrate transparent, verifiable community dividend sharing from its carbon credit program to international ESG auditors and investors.",
    whatWeProduced:
      "Produced an 8-minute cinematic impact documentary and a photography library capturing smallholder agroforestry farmers receiving mobile carbon dividends and soil health equipment.",
    description:
      "BNS Studios conducted ethical, consent-first interviews with 24 smallholder farmers, combined with drone footage of reforestation corridors and financial audit overlays. Delivered transparent, audit-ready visual storytelling for global ESG stakeholders.",
    media: {
      type: "video",
      posterUrl: BNS_COMMUNITY_IMAGES.stakeholdersA,
      posterPosition: "center",
      platform: "vimeo",
      caption: "On-farm cinematography documenting verified carbon dividend disbursements.",
    },
    outputs: [
      "8-minute 4K Cinematic Impact Film",
      "Executive 2-minute ESG investor cut",
      "High-resolution photography library (120+ edited assets)",
      "B2B Case Study whitepaper companion",
    ],
    impactEvidence: {
      primaryMetric: "Presented at Regional Climate Summit",
      secondaryMetric: "$1.4M Follow-on Match Funding Secured",
      context:
        "Showcased at the Africa Climate Action Summit in Addis Ababa to multilateral impact investors.",
      verificationOutcome:
        "Secured a follow-on $1.4M matching grant for expanding agroforestry to 5,000 additional smallholders.",
    },
    tags: ["ESG", "Private Sector", "Climate Finance", "Impact Film"],
    featured: false,
  },
];

export const studiosEvidenceData = {
  getAllProjects: () => STUDIO_PROJECTS,
  getFeaturedProjects: () => STUDIO_PROJECTS.filter((p) => p.featured),
  getProjectBySlug: (slug: string) => STUDIO_PROJECTS.find((p) => p.slug === slug),
  getProjectsByContentType: (contentType: StudioContentType) =>
    STUDIO_PROJECTS.filter((p) => p.contentType === contentType),
  getProjectsByOrgSlug: (orgSlug: string) =>
    STUDIO_PROJECTS.filter((p) => p.organization.slug === orgSlug),
  getAllOrganizations: () => STUDIO_ORGANIZATIONS,
  getRelatedProjects: (currentProjectId: string, limit = 3) => {
    const current = STUDIO_PROJECTS.find((p) => p.id === currentProjectId);
    if (!current) return STUDIO_PROJECTS.slice(0, limit);
    return STUDIO_PROJECTS.filter(
      (p) =>
        p.id !== currentProjectId &&
        (p.contentType === current.contentType || p.organization.slug === current.organization.slug)
    ).slice(0, limit);
  },
};
