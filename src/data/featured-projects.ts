import { withFallback } from "@/data/adapter";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import { projectsData, type CanonicalProject, type ProjectMediaType, type ProjectGalleryItem } from "@/data/projects";
import {
  BNS_CHANNEL_ID,
  fetchYoutubeChannelRss,
  fetchYoutubeOembed,
  mergeYoutubeProjectMeta,
  type YoutubeRssEntry,
} from "@/lib/youtube-meta";
import type { ProgrammeSlug } from "@/content";
import { resolveAppUrl } from "@/lib/api-url";

export type FeaturedProject = {
  id: string;
  slug: string;
  videoId: string;
  url: string;
  title: string;
  subtitle?: string;
  prose: string;
  thumbnail: string;
  /** Optional mobile-safe crop; used below `sm` when hideDesktopThumbOnMobile */
  thumbnailMobile?: string;
  hideDesktopThumbOnMobile?: boolean;
  authorName: string;
  programmeSlug: ProgrammeSlug | "studios";
  programmeLabel: string;
  href: string;
  publishedAt: string;
  channelHandle?: string;
  useYoutubeThumbnail?: boolean;
  wysiwygProse?: string;
  /** CTA chip under each story - defaults to featuredIntro.openProjectLabel */
  ctaLabel?: string;
  /** Media type: youtube | reel | audio | image | animation | none */
  mediaType?: ProjectMediaType;
  /** Reel MP4 for TikTok-style player */
  reelUrl?: string;
  /** Audio embed URL */
  audioUrl?: string;
  /** Caption below the hero media */
  mediaCaption?: string;
  /** Gallery images */
  gallery?: ProjectGalleryItem[];
  /** Hide helper/caption texts */
  hideCaptions?: boolean;
};

type SeedRow = (typeof featuredFallback.results)[number];

function fromSeed(row: SeedRow): FeaturedProject {
  return {
    id: row.id,
    slug: row.slug,
    videoId: row.videoId,
    url: row.url,
    title: row.title,
    subtitle: (row as { subtitle?: string }).subtitle,
    prose: row.prose,
    thumbnail: row.thumbnail,
    thumbnailMobile: (row as { thumbnailMobile?: string }).thumbnailMobile,
    hideDesktopThumbOnMobile: (row as { hideDesktopThumbOnMobile?: boolean })
      .hideDesktopThumbOnMobile,
    authorName: row.authorName,
    programmeSlug: row.programmeSlug as FeaturedProject["programmeSlug"],
    programmeLabel: row.programmeLabel,
    href: row.href,
    publishedAt: row.publishedAt,
    channelHandle: row.channelHandle,
    useYoutubeThumbnail: (row as any).useYoutubeThumbnail ?? true,
    wysiwygProse: (row as any).wysiwygProse || row.prose,
    ctaLabel: (row as { ctaLabel?: string }).ctaLabel,
  };
}

/**
 * Convert a canonical project from the unified database into a FeaturedProject.
 * Uses editorial overrides from featured-projects.json where available.
 */
function fromCanonical(p: CanonicalProject, seed?: SeedRow): FeaturedProject {
  const s = seed as (SeedRow & { thumbnailMobile?: string; hideDesktopThumbOnMobile?: boolean; ctaLabel?: string }) | undefined;
  return {
    id: p.id,
    slug: p.slug,
    videoId: p.videoId || s?.videoId || "",
    url: p.videoUrl || s?.url || "",
    title: p.title,
    subtitle: p.subtitle,
    prose: p.prose || s?.prose || p.description,
    thumbnail: p.thumbnail,
    thumbnailMobile: s?.thumbnailMobile,
    hideDesktopThumbOnMobile: s?.hideDesktopThumbOnMobile,
    authorName: p.authorName || s?.authorName || p.organisationName || "Budget Ndio Story",
    programmeSlug: p.programmeSlug as FeaturedProject["programmeSlug"],
    programmeLabel: p.programmeLabel,
    href: p.href,
    publishedAt: p.publishedAt || s?.publishedAt || p.date,
    channelHandle: p.channelHandle || s?.channelHandle,
    useYoutubeThumbnail: s?.useYoutubeThumbnail ?? false,
    wysiwygProse: p.wysiwygProse || s?.wysiwygProse || p.prose || p.description,
    ctaLabel: s?.ctaLabel,
    mediaType: p.mediaType,
    reelUrl: p.reelUrl,
    audioUrl: p.audioUrl,
    mediaCaption: p.mediaCaption,
    gallery: p.gallery,
    hideCaptions: p.hideCaptions,
  };
}

const DEFAULT_PROJECTS: FeaturedProject[] = (featuredFallback.results ?? []).map(
  fromSeed,
);

let _projects: FeaturedProject[] | null = null;

/**
 * Build featured list from canonical project database.
 * Falls back to seed data if canonical store is empty.
 */
function buildFeaturedFromCanonical(): FeaturedProject[] {
  const canonical = projectsData.getFeatured();
  if (canonical.length === 0) return DEFAULT_PROJECTS;

  return canonical.map((p) => {
    const seed = featuredFallback.results.find((s) => s.id === p.id);
    return fromCanonical(p, seed);
  });
}

export function getFeaturedProjects(): FeaturedProject[] {
  if (_projects) return _projects;
  _projects = buildFeaturedFromCanonical();
  return _projects;
}

export function setFeaturedProjects(projects: FeaturedProject[]): void {
  _projects = [...projects];
}

function rssByVideoId(entries: YoutubeRssEntry[]): Map<string, YoutubeRssEntry> {
  const map = new Map<string, YoutubeRssEntry>();
  for (const entry of entries) {
    map.set(entry.videoId, entry);
  }
  return map;
}

/**
 * Refresh titles / authors / published dates from YouTube oEmbed JSON and
 * channel RSS. Prose, href, programme mapping, and local cover thumbnails
 * stay seeded (editorial) — never overwrite cover art with hqdefault.
 * Server-only — do not call from the browser (CSP / CORS).
 */
export async function refreshFeaturedProjectsFromYoutube(
  seed: FeaturedProject[] = DEFAULT_PROJECTS,
): Promise<FeaturedProject[]> {
  const rssEntries = await fetchYoutubeChannelRss(BNS_CHANNEL_ID).catch(
    () => [] as YoutubeRssEntry[],
  );
  const rssMap = rssByVideoId(rssEntries);

  const refreshed = await Promise.all(
    seed.map(async (project) => {
      const oembed = await fetchYoutubeOembed(project.url).catch(() => null);
      const merged = mergeYoutubeProjectMeta({
        urlOrId: project.videoId,
        fallbackTitle: project.title,
        fallbackPublishedAt: project.publishedAt,
        oembed,
        rss: rssMap.get(project.videoId) ?? null,
      });

      if (!merged) return project;

      return {
        ...project,
        title: merged.title,
        // Keep seeded local still — YT hqdefault is display-quality poor
        thumbnail: project.thumbnail,
        authorName: merged.authorName || project.authorName,
        publishedAt: merged.publishedAt || project.publishedAt,
        url: merged.url,
      };
    }),
  );

  const usable = refreshed.filter((p) => Boolean(p.videoId && p.thumbnail));
  if (usable.length === 0) {
    throw new Error("YouTube refresh returned no usable featured projects");
  }
  return usable;
}

async function fetchFromProjectsApi(): Promise<FeaturedProject[]> {
  const res = await fetch(resolveAppUrl("/api/youtube/projects/"), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`featured projects API ${res.status}`);
  }
  const data = (await res.json()) as { projects?: FeaturedProject[] };
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    throw new Error("featured projects API returned empty");
  }
  return data.projects;
}

export const featuredProjectsData = {
  get: (): FeaturedProject[] => getFeaturedProjects(),
  set: (projects: FeaturedProject[]) => setFeaturedProjects(projects),
  fetch: async (): Promise<FeaturedProject[]> =>
    withFallback(
      "featured-projects",
      async () => {
        const live =
          typeof window !== "undefined"
            ? await fetchFromProjectsApi()
            : await refreshFeaturedProjectsFromYoutube(DEFAULT_PROJECTS);
        setFeaturedProjects(live);
        return live;
      },
      () => {
        const seed = buildFeaturedFromCanonical();
        setFeaturedProjects(seed);
        return seed;
      },
      {
        accept: (result) =>
          Array.isArray(result) &&
          result.length > 0 &&
          result.every((p) => Boolean(p.thumbnail && p.title)),
      },
    ),
};
