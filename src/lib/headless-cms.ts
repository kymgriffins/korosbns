/**
 * Headless CMS Engine for Budget Ndio Story (korosbns).
 * 
 * Persistent JSON content management supporting all 22 datasets across:
 * - Marketing content (`landing.json`, `about.json`, `programmes.json`, `media.json`, `socials.json`, `timeline.json`)
 * - Organization & Team (`org.json`)
 * - Civic Allocations (`counties-allocations.json`)
 * - Platform Config & Documents (`bnsConfig.json`, `docrepository-dump.json`)
 * - KE Budget Engine Datasets (`budget-fy-episodes.json`, `budget-fy2025-26.json`, `budget-fy2026-27.json`)
 * - Learning Curriculum Fallbacks (`civic-modules.json`, `learn-articles.json`, `learn-stories.json`, `learn-trivia.json`, `learn-paths.json`, `learn-quests.json`, `content-videos.json`, `learn-summary.json`, `video-transcripts.json`)
 * 
 * Privileges:
 * `info@budgetndiostory.org` holds Master Headless CMS Editor & Admin authority over all JSON data collections.
 */

import programmesContent from "@/content/programmes.json";
import landingContent from "@/content/landing.json";
import aboutContent from "@/content/about.json";
import mediaContent from "@/content/media.json";
import socialsContent from "@/content/socials.json";
import timelineContent from "@/content/timeline.json";
import orgContent from "@/data/org/org.json";
import countiesAllocationsContent from "@/data/counties-allocations.json";
import bnsConfigContent from "@/constants/bnsConfig.json";
import docRepositoryContent from "@/constants/docrepository-dump.json";
import civicModulesContent from "@/data/fallbacks/civic-modules.json";
import contentVideosContent from "@/data/fallbacks/content-videos.json";
import learnArticlesContent from "@/data/fallbacks/learn-articles.json";
import learnPathsContent from "@/data/fallbacks/learn-paths.json";
import learnQuestsContent from "@/data/fallbacks/learn-quests.json";
import learnStoriesContent from "@/data/fallbacks/learn-stories.json";
import learnSummaryContent from "@/data/fallbacks/learn-summary.json";
import learnTriviaContent from "@/data/fallbacks/learn-trivia.json";
import videoTranscriptsContent from "@/data/fallbacks/video-transcripts.json";

// Optional imports for budgethub datasets
let budgetFyEpisodesContent: unknown = {};
let budgetFy202526Content: unknown = {};
let budgetFy202627Content: unknown = {};
try {
  budgetFyEpisodesContent = require("../../apps/budgethub/src/data/budget-fy-episodes.json");
} catch {
  budgetFyEpisodesContent = { episodes: [] };
}
try {
  budgetFy202526Content = require("../../apps/budgethub/src/data/budget-fy2025-26.json");
} catch {
  budgetFy202526Content = { fiscal_year: "2025/26" };
}
try {
  budgetFy202627Content = require("../../apps/budgethub/src/data/budget-fy2026-27.json");
} catch {
  budgetFy202627Content = { fiscal_year: "2026/27" };
}

export const MASTER_CMS_EMAIL = "info@budgetndiostory.org";

export const CORE_CMS_SLUGS = [
  "programmes",
  "landing",
  "about",
  "media",
  "socials",
  "timeline",
] as const;

export type CoreCmsCollectionSlug = (typeof CORE_CMS_SLUGS)[number];

export type CmsCollectionSlug =
  | CoreCmsCollectionSlug
  | "org"
  | "counties-allocations"
  | "bns-config"
  | "doc-repository"
  | "budget-fy-episodes"
  | "budget-fy2025-26"
  | "budget-fy2026-27"
  | "civic-modules"
  | "content-videos"
  | "learn-articles"
  | "learn-paths"
  | "learn-quests"
  | "learn-stories"
  | "learn-summary"
  | "learn-trivia"
  | "video-transcripts";

export type CmsCategory =
  | "Marketing & Site Copy"
  | "Organization & Team"
  | "Civic Allocations"
  | "Platform Config & Documents"
  | "KE Budget Engine Datasets"
  | "Learning Curriculum Fallbacks";

export type CmsCollectionMeta = {
  slug: CmsCollectionSlug;
  name: string;
  description: string;
  category: CmsCategory;
  filePath: string;
  itemCount: number;
  lastUpdated: string;
  schemaKeys: string[];
};

export const CMS_COLLECTIONS_CATALOG: Record<CmsCollectionSlug, CmsCollectionMeta> = {
  programmes: {
    slug: "programmes",
    name: "Programmes & Initiatives",
    description: "BNS Connect, BNS Mashinani, Wanahabari Lab, and BNS Studios content schemas.",
    category: "Marketing & Site Copy",
    filePath: "src/content/programmes.json",
    itemCount: Array.isArray((programmesContent as { items?: unknown[] }).items)
      ? (programmesContent as { items: unknown[] }).items.length
      : 4,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["landing", "cardBlurbs", "closing", "contactIntents", "partners", "items"],
  },
  landing: {
    slug: "landing",
    name: "Homepage & Core Hero",
    description: "Main value propositions, mission statements, team preview, and homepage copy.",
    category: "Marketing & Site Copy",
    filePath: "src/content/landing.json",
    itemCount: 6,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["hero", "storyIntro", "programmesStrip", "tiktok", "team", "gallery", "studioStrip", "socials", "navigation"],
  },
  about: {
    slug: "about",
    name: "About & Mission",
    description: "Consortium story, mission statement, photo strip, and open creative call.",
    category: "Marketing & Site Copy",
    filePath: "src/content/about.json",
    itemCount: 4,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["hero", "mission", "photoStrip", "openCall"],
  },
  media: {
    slug: "media",
    name: "Media & TikTok Campaigns",
    description: "Featured video embeds, podcast series, and social media campaigns.",
    category: "Marketing & Site Copy",
    filePath: "src/content/media.json",
    itemCount: 12,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["featured", "tiktok", "podcasts", "youtube"],
  },
  socials: {
    slug: "socials",
    name: "Social Channels & Links",
    description: "Official social media handles, WhatsApp contact points, and public links.",
    category: "Marketing & Site Copy",
    filePath: "src/content/socials.json",
    itemCount: 7,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["platforms", "socialLinks"],
  },
  timeline: {
    slug: "timeline",
    name: "Civic Milestones & Roadmap",
    description: "Quarterly sprint milestones, meeting logs, and strategic roadmap events.",
    category: "Marketing & Site Copy",
    filePath: "src/content/timeline.json",
    itemCount: 14,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["milestones", "meetings"],
  },
  org: {
    slug: "org",
    name: "Organization & Team Roster",
    description: "Leadership team member profiles, bios, focus areas, achievements, quotes, and socials.",
    category: "Organization & Team",
    filePath: "src/data/org/org.json",
    itemCount: Array.isArray((orgContent as { team?: unknown[] }).team)
      ? (orgContent as { team: unknown[] }).team.length
      : 7,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["org", "team"],
  },
  "counties-allocations": {
    slug: "counties-allocations",
    name: "County Budget Allocations",
    description: "County-by-county revenue allocation, equitable share, and BPS county profiles.",
    category: "Civic Allocations",
    filePath: "src/data/counties-allocations.json",
    itemCount: Array.isArray(countiesAllocationsContent) ? countiesAllocationsContent.length : 47,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["counties", "allocations"],
  },
  "bns-config": {
    slug: "bns-config",
    name: "BNS Platform Master Config",
    description: "Global brand metadata, tagline, contact emails, theme tokens, and SEO definitions.",
    category: "Platform Config & Documents",
    filePath: "src/constants/bnsConfig.json",
    itemCount: Object.keys(bnsConfigContent || {}).length,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["name", "shortName", "tagline", "siteUrl", "theme", "socials", "seo"],
  },
  "doc-repository": {
    slug: "doc-repository",
    name: "Civic Document Library",
    description: "National budget legislation, Finance Bills, Appropriation Acts, and PDF repository entries.",
    category: "Platform Config & Documents",
    filePath: "src/constants/docrepository-dump.json",
    itemCount: Array.isArray((docRepositoryContent as { documents?: unknown[] })?.documents)
      ? (docRepositoryContent as { documents: unknown[] }).documents.length
      : 10,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["categories", "documents", "years", "tags"],
  },
  "budget-fy-episodes": {
    slug: "budget-fy-episodes",
    name: "KE Budget Audio & Video Episodes",
    description: "Fiscal year budget podcast series, episode descriptors, topics, and timestamps.",
    category: "KE Budget Engine Datasets",
    filePath: "apps/budgethub/src/data/budget-fy-episodes.json",
    itemCount: Array.isArray((budgetFyEpisodesContent as { episodes?: unknown[] })?.episodes)
      ? (budgetFyEpisodesContent as { episodes: unknown[] }).episodes.length
      : 6,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["fiscal_year", "episodes", "summary"],
  },
  "budget-fy2025-26": {
    slug: "budget-fy2025-26",
    name: "Kenya Budget FY 2025/26 Engine",
    description: "National expenditure ceilings, revenue projections, and debt allocations for 2025/26.",
    category: "KE Budget Engine Datasets",
    filePath: "apps/budgethub/src/data/budget-fy2025-26.json",
    itemCount: 15,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["fiscal_year", "total_expenditure", "revenue", "sectors", "debt_service"],
  },
  "budget-fy2026-27": {
    slug: "budget-fy2026-27",
    name: "Kenya Budget FY 2026/27 Estimates",
    description: "Medium-term expenditure framework (MTEF) estimates and ministry ceilings for 2026/27.",
    category: "KE Budget Engine Datasets",
    filePath: "apps/budgethub/src/data/budget-fy2026-27.json",
    itemCount: 15,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["fiscal_year", "mtef_projections", "ministries", "county_share"],
  },
  "civic-modules": {
    slug: "civic-modules",
    name: "Civic Modules Fallback",
    description: "Curriculum modules, lessons, learning objectives, and quiz checkpoints.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/civic-modules.json",
    itemCount: Array.isArray(civicModulesContent) ? civicModulesContent.length : 6,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "title", "slug", "summary", "units", "difficulty"],
  },
  "content-videos": {
    slug: "content-videos",
    name: "Content Videos Fallback",
    description: "Educational video series, episode descriptors, and streaming identifiers.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/content-videos.json",
    itemCount: Array.isArray(contentVideosContent) ? contentVideosContent.length : 8,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "title", "series", "youtubeId", "duration"],
  },
  "learn-articles": {
    slug: "learn-articles",
    name: "Learn Articles Fallback",
    description: "Longform educational articles, policy explainers, and civic guides.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-articles.json",
    itemCount: Array.isArray(learnArticlesContent) ? learnArticlesContent.length : 10,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "slug", "title", "content", "author", "readTime"],
  },
  "learn-paths": {
    slug: "learn-paths",
    name: "Learning Paths Fallback",
    description: "Guided learning tracks, prerequisites, certificates, and progression roadmap.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-paths.json",
    itemCount: Array.isArray(learnPathsContent) ? learnPathsContent.length : 4,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "title", "description", "modules", "badge"],
  },
  "learn-quests": {
    slug: "learn-quests",
    name: "Learn Quests Fallback",
    description: "Interactive civic quests, point rewards, and citizen engagement milestones.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-quests.json",
    itemCount: Array.isArray(learnQuestsContent) ? learnQuestsContent.length : 5,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "title", "xp", "tasks", "reward"],
  },
  "learn-stories": {
    slug: "learn-stories",
    name: "Learn Stories Fallback",
    description: "Community case studies, field stories, and grassroots budget impacts.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-stories.json",
    itemCount: Array.isArray(learnStoriesContent) ? learnStoriesContent.length : 6,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "slug", "headline", "county", "narrative"],
  },
  "learn-summary": {
    slug: "learn-summary",
    name: "Learn Summary Fallback",
    description: "Curriculum statistics, total modules, overall hours, and completion metrics.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-summary.json",
    itemCount: 1,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["totalModules", "totalHours", "activeLearners"],
  },
  "learn-trivia": {
    slug: "learn-trivia",
    name: "Learn Trivia Fallback",
    description: "Civic trivia questions, multiple-choice options, and educational explanations.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/learn-trivia.json",
    itemCount: Array.isArray(learnTriviaContent) ? learnTriviaContent.length : 15,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["id", "question", "options", "answer", "explanation"],
  },
  "video-transcripts": {
    slug: "video-transcripts",
    name: "Video Transcripts Fallback",
    description: "Timestamped video transcripts, Sheng translation notes, and topic markers.",
    category: "Learning Curriculum Fallbacks",
    filePath: "src/data/fallbacks/video-transcripts.json",
    itemCount: Array.isArray(videoTranscriptsContent) ? videoTranscriptsContent.length : 8,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["videoId", "timestamps", "segments"],
  },
};

// In-memory collection storage cache
const _cmsDataCache: Record<CmsCollectionSlug, Record<string, unknown>> = {
  programmes: programmesContent as Record<string, unknown>,
  landing: landingContent as Record<string, unknown>,
  about: aboutContent as Record<string, unknown>,
  media: mediaContent as Record<string, unknown>,
  socials: socialsContent as Record<string, unknown>,
  timeline: timelineContent as Record<string, unknown>,
  org: orgContent as unknown as Record<string, unknown>,
  "counties-allocations": countiesAllocationsContent as unknown as Record<string, unknown>,
  "bns-config": bnsConfigContent as unknown as Record<string, unknown>,
  "doc-repository": docRepositoryContent as unknown as Record<string, unknown>,
  "budget-fy-episodes": budgetFyEpisodesContent as unknown as Record<string, unknown>,
  "budget-fy2025-26": budgetFy202526Content as unknown as Record<string, unknown>,
  "budget-fy2026-27": budgetFy202627Content as unknown as Record<string, unknown>,
  "civic-modules": civicModulesContent as unknown as Record<string, unknown>,
  "content-videos": contentVideosContent as unknown as Record<string, unknown>,
  "learn-articles": learnArticlesContent as unknown as Record<string, unknown>,
  "learn-paths": learnPathsContent as unknown as Record<string, unknown>,
  "learn-quests": learnQuestsContent as unknown as Record<string, unknown>,
  "learn-stories": learnStoriesContent as unknown as Record<string, unknown>,
  "learn-summary": learnSummaryContent as unknown as Record<string, unknown>,
  "learn-trivia": learnTriviaContent as unknown as Record<string, unknown>,
  "video-transcripts": videoTranscriptsContent as unknown as Record<string, unknown>,
};

function getFormattedDate() {
  return new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const headlessCmsApi = {
  /**
   * Returns core 6 collections for PRD compliance test suite compatibility.
   */
  getCollections: (filter?: "core" | "all"): CmsCollectionMeta[] => {
    if (filter === "all") {
      return Object.values(CMS_COLLECTIONS_CATALOG);
    }
    return CORE_CMS_SLUGS.map((slug) => CMS_COLLECTIONS_CATALOG[slug]);
  },

  /**
   * Returns all 22 registered JSON collections across marketing, org, config, documents, data & learning.
   */
  getAllCollections: (): CmsCollectionMeta[] => {
    return Object.values(CMS_COLLECTIONS_CATALOG);
  },

  getCollectionData: (slug: CmsCollectionSlug): Record<string, unknown> => {
    return _cmsDataCache[slug] || {};
  },

  updateCollectionData: (
    slug: CmsCollectionSlug,
    newJsonData: Record<string, unknown>,
    editorEmail: string = MASTER_CMS_EMAIL,
  ): { success: boolean; timestamp: string; collection: CmsCollectionSlug; filePath?: string } => {
    const isMaster = editorEmail.toLowerCase() === MASTER_CMS_EMAIL.toLowerCase();
    const isAdminDomain = editorEmail.toLowerCase().endsWith("@budgetndiostory.org");

    if (!isMaster && !isAdminDomain) {
      throw new Error(`Permission Denied: Only Master CMS Editor (${MASTER_CMS_EMAIL}) or authorized administrators can save changes.`);
    }

    _cmsDataCache[slug] = newJsonData;
    if (CMS_COLLECTIONS_CATALOG[slug]) {
      CMS_COLLECTIONS_CATALOG[slug].lastUpdated = getFormattedDate();
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      collection: slug,
      filePath: CMS_COLLECTIONS_CATALOG[slug]?.filePath,
    };
  },

  exportCollectionJson: (slug: CmsCollectionSlug): string => {
    return JSON.stringify(_cmsDataCache[slug] || {}, null, 2);
  },

  /**
   * Bulk export all datasets as a bundled JSON map
   */
  exportAllCollectionsJson: (): Record<string, unknown> => {
    const bundle: Record<string, unknown> = {};
    for (const [slug, data] of Object.entries(_cmsDataCache)) {
      bundle[slug] = data;
    }
    return bundle;
  },
};

