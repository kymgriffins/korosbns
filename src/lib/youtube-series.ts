/**
 * Group YouTube RSS items into PART series and surface the newest as "current".
 * Titles like "PART 2: County Budget: …" and "County Budget: …" collapse to one series.
 */

export type SeriesVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  description?: string;
};

export type YouTubeSeries = {
  /** Stable key from normalized series title */
  id: string;
  title: string;
  videos: SeriesVideo[];
  /** Newest publish time in the group (ISO) */
  latestPublishedAt: string;
  isCurrent: boolean;
  /** True when the series is about the Budget Policy Statement / "Before Budget Day" */
  isBps: boolean;
};

const PART_PREFIX =
  /^(?:part\s*[\d]+)\s*[:\-–—.]?\s*/i;

const PART_NUMBER = /^part\s*(\d+)/i;

const PART_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** 1-based PART index; titles without PART default to 1 (Part A). */
export function partNumberFromTitle(title: string): number {
  const m = title.trim().match(PART_NUMBER);
  if (!m) return 1;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** Map PART 1/2/3 → A/B/C (PART 4+ → D…). */
export function partLetterFromTitle(title: string): string {
  const n = partNumberFromTitle(title);
  if (n <= PART_LETTERS.length) return PART_LETTERS[n - 1]!;
  return `PART_${n}`;
}

export function normalizeSeriesTitle(title: string): string {
  let t = title
    .replace(PART_PREFIX, "")
    .replace(/\s+/g, " ")
    .trim();
  // Channel titles sometimes say "Before the Budget" for the same BPS series.
  t = t.replace(/^Before the Budget:/i, "Before Budget Day:");
  return t;
}

export function seriesIdFromTitle(title: string): string {
  return normalizeSeriesTitle(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isBpsSeriesTitle(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t.includes("budget policy") ||
    t.includes("before budget day") ||
    t.includes("before the budget")
  );
}

function publishedMs(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

/** Sort videos within a series oldest → newest (PART 1 first when dates align). */
function sortSeriesVideos(videos: SeriesVideo[]): SeriesVideo[] {
  return [...videos].sort((a, b) => publishedMs(a.publishedAt) - publishedMs(b.publishedAt));
}

/**
 * Group flat RSS / catalogue videos into series, newest series first.
 * The first group is marked `isCurrent` (date-filtered advertise target).
 */
export function groupYoutubeSeries(videos: SeriesVideo[]): YouTubeSeries[] {
  const map = new Map<string, SeriesVideo[]>();

  for (const video of videos) {
    if (!video.videoId) continue;
    const id = seriesIdFromTitle(video.title) || video.videoId;
    const list = map.get(id) ?? [];
    list.push(video);
    map.set(id, list);
  }

  const groups: YouTubeSeries[] = [];
  for (const [id, list] of map) {
    const sorted = sortSeriesVideos(list);
    const latest = sorted.reduce(
      (best, v) => (publishedMs(v.publishedAt) > publishedMs(best) ? v.publishedAt : best),
      sorted[0]?.publishedAt ?? "",
    );
    const title = normalizeSeriesTitle(sorted[0]?.title ?? id);
    groups.push({
      id,
      title,
      videos: sorted,
      latestPublishedAt: latest,
      isCurrent: false,
      isBps: isBpsSeriesTitle(title) || sorted.some((v) => isBpsSeriesTitle(v.title)),
    });
  }

  groups.sort((a, b) => publishedMs(b.latestPublishedAt) - publishedMs(a.latestPublishedAt));
  if (groups[0]) groups[0].isCurrent = true;
  return groups;
}

export function currentYoutubeSeries(videos: SeriesVideo[]): YouTubeSeries | null {
  return groupYoutubeSeries(videos)[0] ?? null;
}

/** Canonical BPS explainer URLs (seed + live API chapter 1). */
export const BPS_YOUTUBE_URLS = [
  "https://www.youtube.com/watch?v=Ed9lP0-komE",
  "https://www.youtube.com/watch?v=wkPe3sWomoA",
  "https://www.youtube.com/watch?v=FkgRz4v2Llk",
] as const;

export const BPS_MODULE_SLUG = "budget-policy-statement";

/** County Budget series — Part 1 → 3 watch order. */
export const COUNTY_BUDGET_YOUTUBE_URLS = [
  "https://www.youtube.com/watch?v=3wfk09c_xNQ",
  "https://www.youtube.com/watch?v=abDYZ5xjQgo",
  "https://www.youtube.com/watch?v=oHuImiQvvN0",
] as const;

export const COUNTY_BUDGET_MODULE_SLUG = "county-budget";

/** National Infrastructure Fund series — Part 1 → 4 watch order. */
export const KNIF_YOUTUBE_URLS = [
  "https://www.youtube.com/watch?v=A_EXLueEMlk",
  "https://www.youtube.com/watch?v=jLZe3iPSMfc",
  "https://www.youtube.com/watch?v=KeNCrx6krl0",
  "https://www.youtube.com/watch?v=SfPwtqUFyj4",
] as const;

export const KNIF_MODULE_SLUG = "kenya-national-infrastructure-fund";

/** Extract a YouTube video id from a watch URL, youtu.be link, or bare id. */
export function youtubeVideoIdFromUrl(urlOrId: string): string | null {
  const raw = urlOrId.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    const v = u.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const embed = u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Standard YouTube thumbnail (hqdefault) for cards and module covers. */
export function youtubeThumbnailUrl(
  urlOrId: string,
  quality: "hqdefault" | "mqdefault" | "sddefault" | "maxresdefault" = "hqdefault",
): string | null {
  const id = youtubeVideoIdFromUrl(urlOrId);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}
