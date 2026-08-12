/**
 * Headless CMS Engine for Budget Ndio Story (korosbns).
 * 
 * Powered by clean JSON content schemas:
 * - `programmes.json`
 * - `landing.json`
 * - `about.json`
 * - `media.json`
 * - `socials.json`
 * - `timeline.json`
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

export const MASTER_CMS_EMAIL = "info@budgetndiostory.org";

export type CmsCollectionSlug =
  | "programmes"
  | "landing"
  | "about"
  | "media"
  | "socials"
  | "timeline";

export type CmsCollectionMeta = {
  slug: CmsCollectionSlug;
  name: string;
  description: string;
  itemCount: number;
  lastUpdated: string;
  schemaKeys: string[];
};

export const CMS_COLLECTIONS_CATALOG: Record<CmsCollectionSlug, CmsCollectionMeta> = {
  programmes: {
    slug: "programmes",
    name: "Programmes & Initiatives",
    description: "BNS Connect, BNS Mashinani, Wanahabari Lab, and BNS Studios content schemas.",
    itemCount: Array.isArray((programmesContent as { items?: unknown[] }).items)
      ? (programmesContent as { items: unknown[] }).items.length
      : 4,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["landing", "cardBlurbs", "closing", "contactIntents", "partners", "items"],
  },
  landing: {
    slug: "landing",
    name: "Homepage & Core Hero",
    description: "Main value propositions, mission statements, and homepage section copy.",
    itemCount: 6,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["hero", "mission", "features", "testimonials", "cta"],
  },
  about: {
    slug: "about",
    name: "About & Leadership",
    description: "Consortium story, board advisors, executive team profiles, and mission principles.",
    itemCount: 8,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["title", "mission", "values", "leadership"],
  },
  media: {
    slug: "media",
    name: "Media & TikTok Campaigns",
    description: "Featured video embeds, podcast series, and social media campaigns.",
    itemCount: 12,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["featured", "tiktok", "podcasts", "youtube"],
  },
  socials: {
    slug: "socials",
    name: "Social Channels & Links",
    description: "Official social media handles, WhatsApp contact points, and public links.",
    itemCount: 7,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["platforms", "socialLinks"],
  },
  timeline: {
    slug: "timeline",
    name: "Civic Milestones & Roadmap",
    description: "Quarterly sprint milestones, meeting logs, and strategic roadmap events.",
    itemCount: 14,
    lastUpdated: new Date().toISOString(),
    schemaKeys: ["milestones", "meetings"],
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
  getCollections: (): CmsCollectionMeta[] => Object.values(CMS_COLLECTIONS_CATALOG),

  getCollectionData: (slug: CmsCollectionSlug): Record<string, unknown> => {
    return _cmsDataCache[slug] || {};
  },

  updateCollectionData: (
    slug: CmsCollectionSlug,
    newJsonData: Record<string, unknown>,
    editorEmail: string = MASTER_CMS_EMAIL,
  ): { success: boolean; timestamp: string; collection: CmsCollectionSlug } => {
    if (editorEmail.toLowerCase() !== MASTER_CMS_EMAIL.toLowerCase()) {
      throw new Error(`Permission Denied: Only Master CMS Editor (${MASTER_CMS_EMAIL}) can save changes.`);
    }

    _cmsDataCache[slug] = newJsonData;
    CMS_COLLECTIONS_CATALOG[slug].lastUpdated = getFormattedDate();

    return {
      success: true,
      timestamp: new Date().toISOString(),
      collection: slug,
    };
  },

  exportCollectionJson: (slug: CmsCollectionSlug): string => {
    return JSON.stringify(_cmsDataCache[slug] || {}, null, 2);
  },
};
