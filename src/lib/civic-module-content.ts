import type { ChapterStep, CivicModule } from "@/types/learn";

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
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
