import type { ChapterStep, CivicModule } from "@/types/learn";
import { BPS_MODULE_SLUG, BPS_YOUTUBE_URLS } from "@/lib/youtube-series";

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
 * Keep the seeded Budget Policy Statement module always paired with its
 * YouTube series (RSS / seed URLs), even when API chapters omit youtube_urls.
 */
export function ensureBpsYoutube(mod: CivicModule): CivicModule {
  if (mod.slug !== BPS_MODULE_SLUG) return mod;
  const urls = [...BPS_YOUTUBE_URLS];
  const steps = (mod.steps ?? []).map((step) => {
    if (stepHasYoutube(step)) return step;
    return {
      ...step,
      youtube_url: step.youtube_url || urls[0] || "",
      youtube_urls: urls,
    };
  });
  return { ...mod, steps };
}

export function ensureModulesBpsYoutube(modules: CivicModule[]): CivicModule[] {
  return modules.map(ensureBpsYoutube);
}
