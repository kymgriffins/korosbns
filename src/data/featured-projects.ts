import { withFallback } from "@/data/adapter";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
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

const DEFAULT_PROJECTS: FeaturedProject[] = (featuredFallback.results ?? []).map(
  fromSeed,
);

let _projects: FeaturedProject[] | null = null;

export function getFeaturedProjects(): FeaturedProject[] {
  if (_projects) return _projects;
  _projects = [...DEFAULT_PROJECTS];
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
        const seed = [...DEFAULT_PROJECTS];
        setFeaturedProjects(seed);
        return seed;
      },
      {
        accept: (result) =>
          Array.isArray(result) &&
          result.length > 0 &&
          result.every((p) => Boolean(p.videoId && p.thumbnail && p.title)),
      },
    ),
};
