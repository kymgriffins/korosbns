import bnsConfig from "@/constants/bnsConfig.json";

export type InventoryCategory =
  | "branding"
  | "leadership"
  | "social"
  | "impact"
  | "videos"
  | "modules"
  | "gamification"
  | "events"
  | "partners"
  | "pages";

export type InventoryStatus = "configured" | "partial" | "missing";

export type InventoryItem = {
  id: string;
  category: InventoryCategory;
  label: string;
  description: string;
  status: InventoryStatus;
  details?: string;
  source?: string;
  count?: number;
  items?: string[];
};

export type InventoryGroup = {
  category: InventoryCategory;
  label: string;
  items: InventoryItem[];
};

const config = bnsConfig as {
  shortName?: string;
  legalName?: string;
  tagline?: string;
  mission?: string;
  overview?: string;
  valueProposition?: string[];
  consortium?: { partners?: { name?: string; id?: string }[] };
  activities?: { id?: string; title?: string }[];
  programs?: { id?: string; name?: string; stage?: string }[];
  platforms?: { name?: string; url?: string; type?: string }[];
  impact?: { id?: string; label?: string; value?: string }[];
  leadership?: Record<string, unknown>;
  references?: {
    publicPages?: { label?: string; href?: string }[];
    footerSections?: Record<string, { label?: string; href?: string }[]>;
  };
};

function flag(value: unknown, label: string): InventoryStatus {
  if (value === undefined || value === null) return "missing";
  if (typeof value === "string" && !value.trim()) return "missing";
  if (Array.isArray(value) && value.length === 0) return "missing";
  return "configured";
}

function flagItems(
  items: unknown[] | undefined | null,
  label: string,
): { status: InventoryStatus; count: number } {
  if (!items || items.length === 0) return { status: "missing", count: 0 };
  return { status: "configured", count: items.length };
}



export function generateInventory(
  videoCount?: number,
  moduleCount?: number,
): InventoryGroup[] {
  const groups: InventoryGroup[] = [];

  // Branding / Org Identity
  const brandingItems: InventoryItem[] = [
    {
      id: "org-name",
      category: "branding",
      label: "Organization Name",
      description: "Legal name and short name of the organization",
      status: flag(config.legalName, "name"),
      details: config.legalName ?? "Not set",
      source: "bnsConfig.json",
    },
    {
      id: "org-tagline",
      category: "branding",
      label: "Tagline",
      description: "Organization tagline used site-wide",
      status: flag(config.tagline, "tagline"),
      details: config.tagline ?? "Not set",
      source: "bnsConfig.json",
    },
    {
      id: "org-mission",
      category: "branding",
      label: "Mission Statement",
      description: "Organization mission",
      status: flag(config.mission, "mission"),
      details: config.mission ? config.mission.slice(0, 80) + "..." : "Not set",
      source: "bnsConfig.json",
    },
    {
      id: "org-overview",
      category: "branding",
      label: "Overview / About",
      description: "Organization overview for about page",
      status: flag(config.overview, "overview"),
      details: config.overview ? config.overview.slice(0, 80) + "..." : "Not set",
      source: "bnsConfig.json",
    },
    {
      id: "value-props",
      category: "branding",
      label: "Value Propositions",
      description: "Key value proposition items",
      ...flagItems(config.valueProposition, "value props"),
      source: "bnsConfig.json",
    },
  ];
  groups.push({ category: "branding", label: "Branding & Identity", items: brandingItems });

  // Leadership
  const leadership = config.leadership as Record<string, unknown[]>;
  const leaderCount = Object.values(leadership ?? {}).flat().length;
  const leadershipItems: InventoryItem[] = [
    {
      id: "leadership-team",
      category: "leadership",
      label: "Leadership Team",
      description: "All leadership (Advisor, Executive, Directors, Operations)",
      status: leaderCount > 0 ? "configured" : "missing",
      details: `${leaderCount} team members configured`,
      count: leaderCount,
      source: "bnsConfig.json",
    },
    {
      id: "executive",
      category: "leadership",
      label: "Executive Director",
      description: "Executive director profile",
      status: flag(leadership?.executive, "executive"),
      source: "bnsConfig.json",
    },
    {
      id: "directors",
      category: "leadership",
      label: "Directors",
      description: "ICT, Media, Partnerships directors",
      status: flag(leadership?.directors, "directors"),
      source: "bnsConfig.json",
    },
    {
      id: "advisor",
      category: "leadership",
      label: "Board Advisor",
      description: "Board advisor profile",
      status: flag(leadership?.advisor, "advisor"),
      source: "bnsConfig.json",
    },
  ];
  groups.push({ category: "leadership", label: "Leadership & Team", items: leadershipItems });

  // Social Platforms
  const platforms = config.platforms ?? [];
  const socialItems: InventoryItem[] = [
    {
      id: "social-platforms",
      category: "social",
      label: "Social Platforms",
      description: "Connected social media platforms",
      status: platforms.length > 0 ? "configured" : "missing",
      details: `${platforms.length} platforms configured`,
      count: platforms.length,
      items: platforms.map((p) => p.name ?? ""),
      source: "bnsConfig.json",
    },
  ];
  platforms.forEach((p) => {
    if (p.name) {
      socialItems.push({
        id: `social-${p.name.toLowerCase()}`,
        category: "social",
        label: `${p.name}`,
        description: `${p.name} platform URL and configuration`,
        status: flag(p.url, "url"),
        details: p.url ?? "Not set",
        source: "bnsConfig.json",
      });
    }
  });
  groups.push({ category: "social", label: "Social Platforms", items: socialItems });

  // Impact Metrics
  const impactMetrics = config.impact ?? [];
  const impactItems: InventoryItem[] = [
    {
      id: "impact-metrics",
      category: "impact",
      label: "Impact Metrics",
      description: "Key impact statistics displayed on site",
      status: impactMetrics.length > 0 ? "configured" : "missing",
      details: `${impactMetrics.length} metrics configured`,
      count: impactMetrics.length,
      items: impactMetrics.map((m) => `${m.label}: ${m.value}`),
      source: "bnsConfig.json",
    },
  ];
  groups.push({ category: "impact", label: "Impact Metrics", items: impactItems });

  // YouTube Videos
  const vCount = videoCount ?? 7;
  const videoItems: InventoryItem[] = [
    {
      id: "youtube-videos",
      category: "videos",
      label: "YouTube Videos",
      description: "YouTube videos synced and displayed on website",
      status: vCount > 0 ? "configured" : "missing",
      details: `${vCount} videos available`,
      count: vCount,
      source: "content_videos.example.json",
    },
    {
      id: "video-transcripts",
      category: "videos",
      label: "Video Transcripts",
      description: "Transcripts available for YouTube videos",
      status: vCount > 0 ? "partial" : "missing",
      details: "Default transcripts provided; real transcripts from API",
      source: "data/transcripts.ts",
    },
    {
      id: "video-page",
      category: "videos",
      label: "Video Gallery Page",
      description: "Public video gallery at /learn/videos",
      status: "configured",
      details: "Route exists",
      source: "src/app/(marketing)/learn/videos/",
    },
  ];
  groups.push({ category: "videos", label: "Video Content", items: videoItems });

  // Learning Modules
  const mCount = moduleCount ?? 6;
  const moduleItems: InventoryItem[] = [
    {
      id: "civic-modules",
      category: "modules",
      label: "Civic Learning Modules",
      description: "Learning modules with chapters and steps",
      status: mCount > 0 ? "configured" : "missing",
      details: `${mCount} modules seeded`,
      count: mCount,
      source: "civic_modules.json",
    },
  ];
  groups.push({ category: "modules", label: "Learning Modules", items: moduleItems });

  // Gamification
  const gamificationItems: InventoryItem[] = [
    {
      id: "badges",
      category: "gamification",
      label: "Badges",
      description: "Gamification badge definitions",
      status: "configured",
      details: "Badges seeded in gamification_badges.json",
      source: "gamification_badges.json",
    },
  ];
  groups.push({ category: "gamification", label: "Gamification", items: gamificationItems });

  // Partners
  const partnerItems: InventoryItem[] = [
    {
      id: "partners",
      category: "partners",
      label: "Consortium Partners",
      description: "Partner organizations displayed on site",
      status: flagItems(config.consortium?.partners, "partners").status,
      count: config.consortium?.partners?.length ?? 0,
      items: config.consortium?.partners?.map((p) => p.name ?? "") ?? [],
      source: "bnsConfig.json / org_config.example.json",
    },
  ];
  groups.push({ category: "partners", label: "Partners", items: partnerItems });

  // Public Pages
  const pages = config.references?.publicPages ?? [];
  const pageItems: InventoryItem[] = [
    {
      id: "public-pages",
      category: "pages",
      label: "Public Pages",
      description: "Public pages configured in navigation",
      status: pages.length > 0 ? "configured" : "missing",
      details: `${pages.length} pages`,
      count: pages.length,
      items: pages.map((p) => p.label ?? ""),
      source: "bnsConfig.json",
    },
  ];
  groups.push({ category: "pages", label: "Navigation & Pages", items: pageItems });

  return groups;
}

export function inventorySummary(groups: InventoryGroup[]): {
  total: number;
  configured: number;
  partial: number;
  missing: number;
} {
  const all = groups.flatMap((g) => g.items);
  return {
    total: all.length,
    configured: all.filter((i) => i.status === "configured").length,
    partial: all.filter((i) => i.status === "partial").length,
    missing: all.filter((i) => i.status === "missing").length,
  };
}
