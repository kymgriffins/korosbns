import type { ChapterStep, CivicModule } from "@/types/learn";
import {
  BPS_MODULE_SLUG,
  BPS_YOUTUBE_URLS,
  youtubeThumbnailUrl,
  youtubeVideoIdFromUrl,
} from "@/lib/youtube-series";

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function stepHasYoutube(step: ChapterStep): boolean {
  if (hasNonEmptyString(step.youtube_url)) return true;
  if (step.youtube_urls?.some((url) => hasNonEmptyString(url))) return true;
  return Boolean(
    step.videos?.some(
      (video) =>
        hasNonEmptyString(video.url) || hasNonEmptyString(video.youtube_video_id),
    ),
  );
}

function primaryYoutubeUrl(step: ChapterStep): string {
  if (hasNonEmptyString(step.youtube_url)) return step.youtube_url.trim();
  const fromList = step.youtube_urls?.find((u) => hasNonEmptyString(u));
  if (fromList) return fromList.trim();
  const fromVideos = step.videos?.find(
    (v) => hasNonEmptyString(v.url) || hasNonEmptyString(v.youtube_video_id),
  );
  if (fromVideos?.url) return fromVideos.url.trim();
  if (fromVideos?.youtube_video_id) return fromVideos.youtube_video_id.trim();
  return "";
}

function stepYoutubeThumbnails(step: ChapterStep): string[] {
  const urls: string[] = [];
  const push = (raw: string) => {
    const thumb = youtubeThumbnailUrl(raw);
    if (thumb && !urls.includes(thumb)) urls.push(thumb);
  };
  if (hasNonEmptyString(step.youtube_url)) push(step.youtube_url);
  for (const u of step.youtube_urls ?? []) {
    if (hasNonEmptyString(u)) push(u);
  }
  for (const v of step.videos ?? []) {
    if (hasNonEmptyString(v.url)) push(v.url!);
    else if (hasNonEmptyString(v.youtube_video_id)) push(v.youtube_video_id!);
  }
  return urls;
}

/** True when a step has learnable material (not just a title placeholder). */
export function stepHasPublishableContent(step: ChapterStep): boolean {
  if (hasNonEmptyString(step.text)) return true;
  if (hasNonEmptyString(step.transcript)) return true;
  if (hasNonEmptyString(step.youtube_url)) return true;
  if (step.youtube_urls?.some((url) => hasNonEmptyString(url))) return true;
  if (
    step.videos?.some(
      (video) =>
        hasNonEmptyString(video.url) || hasNonEmptyString(video.youtube_video_id),
    )
  ) {
    return true;
  }
  if (hasNonEmptyString(step.audio_url)) return true;
  if (step.image_urls?.some((url) => hasNonEmptyString(url))) return true;
  if (hasNonEmptyString(step.article_slug)) return true;
  if (hasNonEmptyString(step.article_summary)) return true;
  if (step.report && Object.keys(step.report).length > 0) return true;
  if (step.takeaways?.length) return true;
  if (step.trivia?.length) return true;
  if (step.learning_outcomes?.length) return true;
  return false;
}

/** True when a module has at least one step (or module trivia) with learnable content. */
export function moduleHasPublishableContent(mod: CivicModule): boolean {
  if ((mod.steps ?? []).some(stepHasPublishableContent)) return true;
  if (mod.trivia?.length) return true;
  return false;
}

export function filterModulesWithPublishableContent(
  modules: CivicModule[],
): CivicModule[] {
  return modules.filter(moduleHasPublishableContent);
}

/**
 * Prefer YouTube thumbnails for module cover + step image_urls when the module
 * has series videos. Overwrites non-ytimg covers so placeholder art does not
 * win over the bloodline thumbnail.
 */
export function ensureModuleYoutubeImages(mod: CivicModule): CivicModule {
  const steps = (mod.steps ?? []).map((step) => {
    const thumbs = stepYoutubeThumbnails(step);
    if (!thumbs.length) return step;
    const existing = (step.image_urls ?? []).filter(hasNonEmptyString);
    const merged = [...thumbs];
    for (const url of existing) {
      if (!merged.includes(url) && !url.includes("ytimg.com")) merged.push(url);
    }
    return { ...step, image_urls: merged };
  });

  let imageUrl = mod.image_url?.trim() || "";
  const primary =
    steps.map(primaryYoutubeUrl).find((u) => u.length > 0) ||
    primaryYoutubeUrl(mod.steps?.[0] ?? ({} as ChapterStep));
  const ytCover = primary ? youtubeThumbnailUrl(primary) : null;
  if (ytCover) {
    const keepExisting =
      imageUrl.includes("ytimg.com") &&
      youtubeVideoIdFromUrl(imageUrl) === youtubeVideoIdFromUrl(primary);
    imageUrl = keepExisting ? imageUrl : ytCover;
  }

  return { ...mod, image_url: imageUrl || mod.image_url, steps };
}

export function ensureModulesYoutubeImages(modules: CivicModule[]): CivicModule[] {
  return modules.map(ensureModuleYoutubeImages);
}

/**
 * Keep the seeded Budget Policy Statement module always paired with its
 * YouTube series. Maps PART A/B/C (URL index 0/1/2) onto chapter steps by order
 * when a step has no YouTube yet.
 */
export function ensureBpsYoutube(mod: CivicModule): CivicModule {
  if (mod.slug !== BPS_MODULE_SLUG) return ensureModuleYoutubeImages(mod);
  const urls = [...BPS_YOUTUBE_URLS];
  const steps = (mod.steps ?? []).map((step, index) => {
    if (stepHasYoutube(step)) return step;
    const partUrl = urls[Math.min(index, urls.length - 1)] ?? urls[0] ?? "";
    return {
      ...step,
      youtube_url: step.youtube_url || partUrl,
      youtube_urls: step.youtube_urls?.length ? step.youtube_urls : urls,
    };
  });
  return ensureModuleYoutubeImages({ ...mod, steps });
}

/**
 * Apply series part URLs (A/B/C) onto module steps by chapter order (1→A, 2→B, 3→C).
 * Safe for any module when caller supplies an explicit part→url map.
 */
export function applyPartUrlsToSteps(
  mod: CivicModule,
  partUrls: Partial<Record<"A" | "B" | "C", string>>,
): CivicModule {
  const letterForOrder = (order: number): "A" | "B" | "C" | null => {
    if (order === 1) return "A";
    if (order === 2) return "B";
    if (order === 3) return "C";
    return null;
  };

  const steps = (mod.steps ?? []).map((step, index) => {
    const letter =
      letterForOrder(step.order) ??
      (index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : null);
    if (!letter) return step;
    const url = partUrls[letter];
    if (!url) return step;
    if (stepHasYoutube(step)) return step;
    return {
      ...step,
      youtube_url: step.youtube_url || url,
      youtube_urls: step.youtube_urls?.length ? step.youtube_urls : [url],
    };
  });
  return ensureModuleYoutubeImages({ ...mod, steps });
}

export function ensureModulesBpsYoutube(modules: CivicModule[]): CivicModule[] {
  return modules.map(ensureBpsYoutube);
}
