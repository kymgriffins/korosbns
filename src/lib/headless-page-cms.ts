/**
 * Modular Page CMS schemas and utilities.
 * Powers dynamic custom pages, section reordering, media embeds, and button toggles.
 */

export type SectionType =
  | "hero"
  | "video_showcase"
  | "stats_grid"
  | "feature_cards"
  | "narrative"
  | "faq"
  | "cta_banner";

export type SectionButton = {
  id: string;
  label: string;
  href: string;
  variant?: "primary" | "outline" | "ghost";
  enabled: boolean;
};

export type SectionMedia = {
  type?: "video" | "youtube" | "image" | "auto";
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  poster?: string;
  aspectRatio?: "video" | "wide" | "square" | "auto";
};

export type SectionItem = {
  id: string;
  title: string;
  description?: string;
  value?: string; // for stats
  label?: string; // for stats
  tag?: string;
  icon?: string;
  link?: string;
  enabled?: boolean;
};

export type PageSection = {
  id: string;
  type: SectionType;
  enabled: boolean;
  eyebrow?: string;
  headline?: string;
  body?: string;
  content?: string;
  media?: SectionMedia;
  buttons?: SectionButton[];
  items?: SectionItem[];
};

export type CustomPageItem = {
  slug: string;
  title: string;
  seoDescription?: string;
  eyebrow?: string;
  headline: string;
  body: string;
  content?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  stats?: Array<{ value: string; label: string }>;
  published?: boolean;
  createdAt?: string;
  featuredMedia?: SectionMedia;
  sections?: PageSection[];
};

/**
 * Creates an empty section of a specified type with safe default fields.
 */
export function createDefaultSection(type: SectionType): PageSection {
  const id = `section-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        enabled: true,
        eyebrow: "Featured Initiative",
        headline: "High-Impact Civic Accountability",
        body: "Empowering citizens with verifiable public expenditure intelligence.",
        buttons: [
          { id: "btn-1", label: "Get Involved", href: "/contact?intent=partner", variant: "primary", enabled: true },
          { id: "btn-2", label: "View Programmes", href: "/programmes", variant: "outline", enabled: true },
        ],
      };

    case "video_showcase":
      return {
        id,
        type: "video_showcase",
        enabled: true,
        headline: "Watch the Investigation in Action",
        body: "A brief forensic overview documenting where public funds flow and how citizen watchdogs verify delivery.",
        media: {
          type: "video",
          url: "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/Calvina%20Praise%20Sovereign%20debt.mp4",
          title: "Forensic Investigation Overview",
          caption: "Produced by Budget Ndio Story in partnership with grassroots monitors.",
        },
        buttons: [
          { id: "btn-v1", label: "Read Full Dossier", href: "/contact", variant: "primary", enabled: true },
        ],
      };

    case "stats_grid":
      return {
        id,
        type: "stats_grid",
        enabled: true,
        headline: "Scale & Key Performance Baselines",
        items: [
          { id: "st-1", title: "Counties", value: "47", label: "Counties Monitored", enabled: true },
          { id: "st-2", title: "Public Debt", value: "11.2T", label: "National Debt Tracked", enabled: true },
          { id: "st-3", title: "Citizens", value: "100%", label: "Citizen Powered", enabled: true },
        ],
      };

    case "feature_cards":
      return {
        id,
        type: "feature_cards",
        enabled: true,
        headline: "Core Deliverables & Strategic Pillars",
        body: "Tangible outputs designed for newsroom citation and partner co-funding.",
        items: [
          {
            id: "fc-1",
            title: "Auditable Debt Baselines",
            description: "Quarterly forensic bulletins reconciling Treasury reports against actual debt disbursements.",
            tag: "Policy Evidence",
            enabled: true,
          },
          {
            id: "fc-2",
            title: "Civic Townhall Dashboards",
            description: "Accessible local language explainers distributed to youth advocates and village monitors.",
            tag: "Grassroots Action",
            enabled: true,
          },
          {
            id: "fc-3",
            title: "Newsroom Open Source Feed",
            description: "Clean CSV datasets and broadcast-ready motion graphics for investigative journalists.",
            tag: "Media Asset",
            enabled: true,
          },
        ],
      };

    case "narrative":
      return {
        id,
        type: "narrative",
        enabled: true,
        headline: "The Investigative Context",
        content:
          "Public finance scrutiny in Kenya has traditionally been restricted to technical accounting conferences or polarized political rallies.\n\nOur objective is to decode complex statutory documents into empirical, citizen-facing evidence that withstands legal scrutiny and drives legislative reform.",
      };

    case "faq":
      return {
        id,
        type: "faq",
        enabled: true,
        headline: "Frequently Asked Questions",
        items: [
          {
            id: "faq-1",
            title: "How is the data independently verified?",
            description: "Our investigative team cross-references Controller of Budget quarterly reports, Central Bank statistical bulletins, and on-the-ground community monitoring audits.",
            enabled: true,
          },
          {
            id: "faq-2",
            title: "Can civil society partners co-brand and cite these findings?",
            description: "Yes, all datasets are published under open civic licenses with full provenance citations for legislative advocacy and academic research.",
            enabled: true,
          },
        ],
      };

    case "cta_banner":
      return {
        id,
        type: "cta_banner",
        enabled: true,
        headline: "Partner with Budget Ndio Story",
        body: "Collaborate with our teams on national tracking, county accountability, and newsroom investigative training.",
        buttons: [
          { id: "cta-1", label: "Discuss Partnership", href: "/contact?intent=partner", variant: "primary", enabled: true },
          { id: "cta-2", label: "Explore Programmes", href: "/programmes", variant: "outline", enabled: true },
        ],
      };
  }
}

/**
 * Returns existing sections, or synthesizes default sections from legacy fields if empty.
 */
export function ensurePageSections(page: CustomPageItem): PageSection[] {
  if (Array.isArray(page.sections) && page.sections.length > 0) {
    return page.sections;
  }

  const synthesized: PageSection[] = [];

  // 1. Hero Section
  synthesized.push({
    id: "sec-hero",
    type: "hero",
    enabled: true,
    eyebrow: page.eyebrow,
    headline: page.headline || page.title,
    body: page.body,
    media: page.featuredMedia,
    buttons: [
      {
        id: "btn-primary",
        label: page.ctaLabel || "Discuss Co-Funding",
        href: page.ctaHref || "/contact?intent=partner",
        variant: "primary",
        enabled: !!page.ctaLabel,
      },
      {
        id: "btn-secondary",
        label: page.secondaryLabel || "Explore Programmes",
        href: page.secondaryHref || "/programmes",
        variant: "outline",
        enabled: !!page.secondaryLabel,
      },
    ],
  });

  // 2. Stats Section
  if (page.stats && page.stats.length > 0) {
    synthesized.push({
      id: "sec-stats",
      type: "stats_grid",
      enabled: true,
      headline: "Scale & Impact Baselines",
      items: page.stats.map((s, idx) => ({
        id: `stat-${idx}`,
        title: s.label,
        value: s.value,
        label: s.label,
        enabled: true,
      })),
    });
  }

  // 3. Narrative Section
  if (page.content) {
    synthesized.push({
      id: "sec-content",
      type: "narrative",
      enabled: true,
      headline: "Investigation & Analysis",
      content: page.content,
    });
  }

  // 4. Closing CTA
  synthesized.push({
    id: "sec-closing-cta",
    type: "cta_banner",
    enabled: true,
    headline: "Partner with us on verified public finance intelligence.",
    body: "Collaborate with our teams on national tracking, county accountability, and newsroom investigative training.",
    buttons: [
      {
        id: "btn-close-primary",
        label: page.ctaLabel || "Discuss Partnership",
        href: page.ctaHref || "/contact?intent=partner",
        variant: "primary",
        enabled: true,
      },
      {
        id: "btn-close-sec",
        label: "Explore Programmes",
        href: "/programmes",
        variant: "outline",
        enabled: true,
      },
    ],
  });

  return synthesized;
}
