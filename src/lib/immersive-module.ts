import { learnHubApi } from "@/lib/learn-hub";
import { apiFetch } from "@/lib/api-client";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { resolveYoutubeId } from "@/lib/learn-video";
import { triviaForStep } from "@/lib/learn-trivia";
import type { ChapterStep, CivicModule } from "@/types/learn";

export type ImmersiveMode = "read" | "watch" | "quiz";

export function parseStepVideos(step: ChapterStep | null | undefined): { videoId: string; title: string }[] {
  if (!step) return [];
  const entries: { videoId: string; title: string }[] = [];

  if (step.videos?.length) {
    for (const v of step.videos) {
      const id = v.youtube_video_id || (v.url ? resolveYoutubeId(v.url) : "");
      if (id) entries.push({ videoId: id, title: v.title || v.role || "Video" });
    }
  }
  if (step.youtube_urls?.length) {
    for (const url of step.youtube_urls) {
      const id = resolveYoutubeId(url);
      if (id && !entries.some((e) => e.videoId === id)) entries.push({ videoId: id, title: "Video" });
    }
  }
  if (step.youtube_url) {
    const id = resolveYoutubeId(step.youtube_url);
    if (id && !entries.some((e) => e.videoId === id)) entries.push({ videoId: id, title: "Video" });
  }
  return entries;
}

export function stepReadingMinutes(step: ChapterStep | null, videoCount: number): string {
  if (!step) return "";
  const words = (step.text || "").split(/\s+/).filter(Boolean).length;
  const textMinutes = Math.ceil(words / 200);
  const totalMinutes = textMinutes + Math.ceil((videoCount * 30) / 60);
  return totalMinutes < 1 ? "<1 min" : `${totalMinutes} min`;
}

export function moduleStepTrivia(mod: CivicModule, stepIndex: number) {
  const step = mod.steps[stepIndex];
  return triviaForStep(mod, step, stepIndex);
}

export function immersiveModuleHref(
  slug: string,
  mode: ImmersiveMode,
  step: number,
  question = 1,
) {
  if (mode === "read") return `/learn/modules/${slug}/read/${step}`;
  if (mode === "watch") return `/learn/modules/${slug}/watch/${step}`;
  return `/learn/modules/${slug}/quiz/${step}/${question}`;
}

export function recordCorrectAnswer(
  mod: CivicModule,
  step: ChapterStep,
  questionIndex: number,
) {
  const rewardTag = `${step.order}_${questionIndex}`;
  const p = readProgress(mod.slug, mod.order);
  if (!p.triviaRewards.includes(rewardTag)) {
    writeProgress(mod.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
    apiFetch<{ points: number }>("/gamification/trivia-answers/", {
      method: "POST",
      body: JSON.stringify({
        module_slug: mod.slug,
        chapter_order: step.order,
        question_index: questionIndex,
        is_correct: true,
        idempotency_key: rewardTag,
      }),
    }).catch(() => {});
  }
}

export function completeModuleStep(mod: CivicModule, step: ChapterStep, nextStep: number) {
  const p = readProgress(mod.slug, mod.order);
  writeProgress(mod.slug, {
    ...p,
    stepsCompleted: { ...p.stepsCompleted, [step.order]: true },
    currentStep: nextStep,
  });
  learnHubApi.completeChapter(step.id).catch(() => {});
}

export function awardModuleMastery(mod: CivicModule) {
  const p = readProgress(mod.slug, mod.order);
  writeProgress(mod.slug, {
    ...p,
    masteryAwarded: true,
    stepsCompleted: Object.fromEntries(mod.steps.map((s) => [s.order, true])),
  });
  learnHubApi.markProgress({ content_type: "path", content_id: mod.id, progress_percent: 100 }).catch(() => {});
}
