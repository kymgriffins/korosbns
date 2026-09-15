/**
 * Canonical project database — single source of truth.
 *
 * Merges:
 *   1. studios-evidence.json  (production portfolio, the authoritative project list)
 *   2. featured-projects.json (editorial overrides: prose, thumbnails, YouTube IDs)
 *   3. content/projects/*     (deep metadata: transcripts, pillars, case studies)
 *
 * Every page that shows a project should read from this store.
 * Adding a project here reflects across: /work, /bns-project, featured section, programme grids.
 */

import studiosEvidence from "@/data/fallbacks/studios-evidence.json";
import featuredSeeds from "@/data/fallbacks/featured-projects.json";
import { withFallback } from "@/data/adapter";

export type ProjectMediaType = "youtube" | "vimeo" | "reel" | "audio" | "image" | "animation" | "none";

export type ProjectGalleryItem = {
  url: string;
  caption?: string;
  alt?: string;
};

export type CanonicalProject = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  programmeSlug: string;
  programmeLabel: string;
  contentType: string;
  organisationId?: string;
  organisationName?: string;
  date: string;
  year: string;
  /** Media type determines what player/ embed to show */
  mediaType: ProjectMediaType;
  videoId?: string;
  videoUrl?: string;
  /** Reel MP4 URL for TikTok-style vertical player */
  reelUrl?: string;
  /** Audio embed URL (Spotify, SoundCloud, etc.) */
  audioUrl?: string;
  thumbnail: string;
  /** Caption text below the hero media — hideable via CMS */
  mediaCaption?: string;
  /** Gallery images shown before commissions/outputs section */
  gallery: ProjectGalleryItem[];
  /** Hide helper/caption texts on this project page */
  hideCaptions?: boolean;
  outputs: string[];
  tags: string[];
  featured: boolean;
  /** Global visibility toggle — false hides from /work, landing, programme grids, search */
  visible: boolean;
  /** Production format — replaces studios-as-programme */
  format?: string;
  /** Sort order within programme — lower numbers appear first */
  order: number;
  /** Editorial prose override from featured-projects.json */
  prose?: string;
  wysiwygProse?: string;
  href: string;
  authorName?: string;
  publishedAt?: string;
  channelHandle?: string;
};

type FeaturedSeed = (typeof featuredSeeds.results)[number];
type StudioProject = (typeof studiosEvidence.projects)[number];
type StudioOrganisation = (typeof studiosEvidence.organizations)[number];

const orgMap = new Map<string, StudioOrganisation>();
for (const org of studiosEvidence.organizations) {
  orgMap.set(org.id, org);
}

const featuredMap = new Map<string, FeaturedSeed>();
for (const f of featuredSeeds.results) {
  featuredMap.set(f.id, f);
}

function programmeLabelFor(slug: string): string {
  const labels: Record<string, string> = {
    connect: "BNS Connect",
    mashinani: "BNS Mashinani",
    "wanahabari-lab": "Wanahabari Lab",
  };
  return labels[slug] || slug;
}

function thumbnailFor(p: StudioProject, featured?: FeaturedSeed): string {
  // Prefer editorial thumbnail from featured seeds
  if (featured?.thumbnail) return featured.thumbnail;
  // Then studio media poster
  if (p.media?.posterUrl) return p.media.posterUrl;
  // Fallback
  return "/images/hall/129A4248.jpg";
}

function videoIdFrom(p: StudioProject, featured?: FeaturedSeed): string | undefined {
  if (featured?.videoId) return featured.videoId;
  if (p.media?.videoUrl) {
    const match = p.media.videoUrl.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    // Already a bare video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(p.media.videoUrl)) return p.media.videoUrl;
  }
  return undefined;
}

function resolveMediaType(p: StudioProject): ProjectMediaType {
  const t = (p.media?.type as string) || "";
  const platform = (p.media?.platform as string) || "";
  if (platform === "youtube" || t === "video") return "youtube";
  if (platform === "vimeo") return "vimeo";
  if (t === "audio") return "audio";
  if (t === "animation") return "animation";
  if (t === "image") return "image";
  // Check for reel-style URLs (R2 mp4, tiktok)
  if (p.media?.videoUrl && /\.mp4|\.webm|\.mov/i.test(p.media.videoUrl)) return "reel";
  if (p.media?.videoUrl) return "youtube"; // default video assumption
  return "none";
}

function resolveGallery(p: StudioProject): ProjectGalleryItem[] {
  if (!p.media?.gallery || !Array.isArray(p.media.gallery)) return [];
  return p.media.gallery.map((g: { url: string; caption?: string; position?: string }) => ({
    url: g.url,
    caption: g.caption,
    alt: g.caption || p.title,
  }));
}

function mergeProject(studio: StudioProject): CanonicalProject {
  const featured = featuredMap.get(studio.id);
  const org = studio.organizationId ? orgMap.get(studio.organizationId) : undefined;
  const videoId = videoIdFrom(studio, featured);
  const programmeSlug = studio.programmeSlug || featured?.programmeSlug || "connect";
  const mediaType = resolveMediaType(studio);
  const reelUrl = mediaType === "reel" ? studio.media?.videoUrl : undefined;
  const audioUrl = mediaType === "audio" ? studio.media?.videoUrl : undefined;

  return {
    id: studio.id,
    slug: studio.slug,
    title: featured?.title || studio.title,
    subtitle: (featured as { subtitle?: string })?.subtitle || (studio as { subtitle?: string }).subtitle,
    description: studio.description,
    programmeSlug,
    programmeLabel: programmeLabelFor(programmeSlug),
    contentType: studio.contentType,
    organisationId: studio.organizationId,
    organisationName: org?.name,
    date: studio.date,
    year: studio.year,
    mediaType,
    videoId,
    videoUrl: studio.media?.videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined),
    reelUrl,
    audioUrl,
    thumbnail: thumbnailFor(studio, featured),
    mediaCaption: (studio.media as { caption?: string })?.caption,
    gallery: resolveGallery(studio),
    hideCaptions: false,
    outputs: studio.outputs || [],
    tags: studio.tags || [],
    featured: studio.featured || false,
    visible: (studio as { visible?: boolean }).visible !== false,
    format: (studio as { format?: string }).format,
    order: (studio as { order?: number }).order ?? 999,
    prose: featured?.prose,
    wysiwygProse: featured?.wysiwygProse,
    href: featured?.href || `/bns-project/${studio.slug}`,
    authorName: featured?.authorName || org?.name,
    publishedAt: featured?.publishedAt || studio.date,
    channelHandle: featured?.channelHandle,
  };
}

/** All projects from the canonical studios-evidence database */
const ALL_PROJECTS: CanonicalProject[] = studiosEvidence.projects.map(mergeProject);

const _featuredIds = new Set(
  featuredSeeds.results.map((f) => f.id),
);

let _cache: CanonicalProject[] | null = null;

function getAll(): CanonicalProject[] {
  if (_cache) return _cache;
  _cache = ALL_PROJECTS
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);
  return _cache;
}

/** Projects marked as featured in studios-evidence OR present in featured-projects.json */
function getFeatured(): CanonicalProject[] {
  return getAll().filter(
    (p) => (p.featured || _featuredIds.has(p.id)) && p.visible,
  );
}

/** Find a single project by id or slug — returns hidden projects too (direct URL access) */
function getById(id: string): CanonicalProject | undefined {
  return ALL_PROJECTS.find((p) => p.id === id || p.slug === id);
}

/** Projects filtered by programme */
function getByProgramme(slug: string): CanonicalProject[] {
  return getAll().filter((p) => p.programmeSlug === slug);
}

/** Search by title/description/tags */
function search(query: string): CanonicalProject[] {
  const q = query.toLowerCase();
  return getAll().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export const projectsData = {
  get: getAll,
  getFeatured,
  getById,
  getByProgramme,
  search,
  fetch: async (): Promise<CanonicalProject[]> =>
    withFallback(
      "canonical-projects",
      async () => getAll(),
      () => getAll(),
      { accept: (r) => Array.isArray(r) && r.length > 0 },
    ),
};
