/**
 * Smart YouTube RSS & Podcast Curator.
 * Curates videos into clean products / featured projects.
 * Automatically collapses multi-part series (e.g. Part 1, 2, 3, 4) so ONLY
 * the flagship Part 1 / main video is showcased, never cluttering with Part 2/3/4.
 */

import {
  partNumberFromTitle,
  seriesIdFromTitle,
  youtubeThumbnailUrl,
  type SeriesVideo,
} from "@/lib/youtube-series";

export interface CuratedProductProject {
  id: string;
  slug: string;
  videoId: string;
  url: string;
  title: string;
  prose: string;
  wysiwygProse?: string;
  thumbnail: string;
  authorName: string;
  programmeSlug: "connect" | "mashinani" | "wanahabari-lab" | "studios";
  programmeLabel: string;
  href: string;
  publishedAt: string;
  channelHandle?: string;
  useYoutubeThumbnail?: boolean;
  isCourseCompanion?: boolean;
  courseSlug?: string;
  partCount?: number;
}

const PART_PREFIX_CLEANER = /^(?:part\s*[\d]+)\s*[:\-–—.]?\s*/i;

export function cleanProductTitle(rawTitle: string): string {
  let t = rawTitle.replace(PART_PREFIX_CLEANER, "").trim();
  t = t.replace(/^Before the Budget:/i, "Before Budget Day:");
  return t;
}

export function inferProgrammeFromTitle(title: string): {
  slug: "connect" | "mashinani" | "wanahabari-lab" | "studios";
  label: string;
} {
  const t = title.toLowerCase();
  if (t.includes("county") || t.includes("mashinani") || t.includes("devolved")) {
    return { slug: "mashinani", label: "BNS Mashinani" };
  }
  if (t.includes("wanahabari") || t.includes("investigation") || t.includes("illicit") || t.includes("red flags")) {
    return { slug: "wanahabari-lab", label: "Wanahabari" };
  }
  if (t.includes("studio") || t.includes("terra") || t.includes("cabri") || t.includes("podcast")) {
    return { slug: "studios", label: "BNS Studio" };
  }
  return { slug: "connect", label: "BNS Connect" };
}

export function inferCourseSlug(title: string): string | undefined {
  const t = title.toLowerCase();
  if (t.includes("infrastructure")) {
    return "kenya-national-infrastructure-fund";
  }
  if (t.includes("county budget") || t.includes("where does the money come from")) {
    return "county-budget";
  }
  if (t.includes("budget policy") || t.includes("before budget day")) {
    return "budget-policy-statement";
  }
  return undefined;
}

export function curateFlagshipYoutubeProducts(
  rawVideos: SeriesVideo[],
  existingProjects: CuratedProductProject[] = [],
): CuratedProductProject[] {
  const seriesGroups = new Map<string, SeriesVideo[]>();

  for (const video of rawVideos) {
    if (!video.videoId) continue;
    const seriesId = seriesIdFromTitle(video.title) || video.videoId;
    const group = seriesGroups.get(seriesId) ?? [];
    group.push(video);
    seriesGroups.set(seriesId, group);
  }

  const curatedList: CuratedProductProject[] = [];

  for (const [seriesId, videos] of seriesGroups) {
    const sorted = [...videos].sort((a, b) => {
      const partA = partNumberFromTitle(a.title);
      const partB = partNumberFromTitle(b.title);
      if (partA !== partB) return partA - partB;
      return Date.parse(a.publishedAt || "0") - Date.parse(b.publishedAt || "0");
    });

    const primaryVideo = sorted[0];
    if (!primaryVideo) continue;

    const cleanedTitle = cleanProductTitle(primaryVideo.title);
    const prog = inferProgrammeFromTitle(cleanedTitle);
    const courseSlug = inferCourseSlug(cleanedTitle);
    const targetSlug = seriesId;

    const existing = existingProjects.find(
      (p) =>
        p.id === targetSlug ||
        p.slug === targetSlug ||
        p.videoId === primaryVideo.videoId ||
        p.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );

    const thumbnail =
      existing?.thumbnail ||
      youtubeThumbnailUrl(primaryVideo.videoId, "maxresdefault") ||
      "https://i.ytimg.com/vi/" + primaryVideo.videoId + "/hqdefault.jpg";

    const prose =
      existing?.prose ||
      primaryVideo.description ||
      "Forensic public finance explainer and investigative evidence produced by Budget Ndio Story.";

    const product: CuratedProductProject = {
      id: existing?.id || targetSlug,
      slug: existing?.slug || targetSlug,
      videoId: primaryVideo.videoId,
      url: "https://www.youtube.com/watch?v=" + primaryVideo.videoId,
      title: existing?.title || cleanedTitle,
      prose,
      wysiwygProse: existing?.wysiwygProse,
      thumbnail,
      authorName: existing?.authorName || "Budget Ndio Story Team",
      programmeSlug: existing?.programmeSlug || prog.slug,
      programmeLabel: existing?.programmeLabel || prog.label,
      href: existing?.href || (courseSlug ? "/learn/modules/" + courseSlug : "/bns-project/" + targetSlug),
      publishedAt: primaryVideo.publishedAt || existing?.publishedAt || new Date().toISOString(),
      channelHandle: existing?.channelHandle || "@budgetndiostory",
      useYoutubeThumbnail: existing?.useYoutubeThumbnail ?? true,
      isCourseCompanion: Boolean(courseSlug),
      courseSlug,
      partCount: videos.length > 1 ? videos.length : undefined,
    };

    curatedList.push(product);
  }

  for (const exp of existingProjects) {
    const alreadyIncluded = curatedList.some(
      (c) =>
        c.id === exp.id ||
        c.slug === exp.slug ||
        (c.videoId && exp.videoId && c.videoId === exp.videoId),
    );
    if (!alreadyIncluded) {
      curatedList.push(exp);
    }
  }

  curatedList.sort((a, b) => Date.parse(b.publishedAt || "0") - Date.parse(a.publishedAt || "0"));

  return curatedList;
}