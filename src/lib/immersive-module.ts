import { learnHubApi } from "@/lib/learn-hub";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { resolveYoutubeId } from "@/lib/learn-video";
import { triviaForStep } from "@/lib/learn-trivia";
import {
  recordLearnProgressWithQueue,
  trackGamificationWithQueue,
} from "@/lib/sync-profile";
import type { ChapterStep, CivicModule } from "@/types/learn";

export type ImmersiveMode = "read" | "watch" | "quiz";

/** Udemy-style lecture kinds shown in curriculum (maps to ImmersiveMode). */
export type LectureKind = "article" | "video" | "quiz";

export type StepLecture = {
  kind: LectureKind;
  mode: ImmersiveMode;
  label: string;
  href: string;
  stepNumber: number;
  stepTitle: string;
};

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

export function stepHasArticle(step: ChapterStep | null | undefined): boolean {
  if (!step) return false;
  return Boolean(
    (step.text && step.text.trim().length > 0) ||
      (step.transcript && step.transcript.trim().length > 0) ||
      (step.image_urls && step.image_urls.length > 0) ||
      (step.article_slug && step.article_slug.trim().length > 0),
  );
}

export function stepHasVideo(step: ChapterStep | null | undefined): boolean {
  return parseStepVideos(step).length > 0;
}

export function stepHasQuiz(
  mod: Pick<CivicModule, "steps" | "trivia">,
  stepIndex: number,
): boolean {
  return triviaForStep(mod, mod.steps[stepIndex], stepIndex).length > 0;
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

/** Modes available for a chapter, in Udemy consume order: Article → Video → Quiz. */
export function modesForStep(
  mod: Pick<CivicModule, "slug" | "steps" | "trivia">,
  stepIndex: number,
): ImmersiveMode[] {
  const step = mod.steps[stepIndex];
  if (!step) return [];
  const modes: ImmersiveMode[] = [];
  if (stepHasArticle(step)) modes.push("read");
  if (stepHasVideo(step)) modes.push("watch");
  if (stepHasQuiz(mod, stepIndex)) modes.push("quiz");
  // Guarantee at least one entry point so empty steps still open.
  if (modes.length === 0) modes.push("read");
  return modes;
}

export function preferredModeForStep(
  mod: Pick<CivicModule, "slug" | "steps" | "trivia">,
  stepIndex: number,
): ImmersiveMode {
  return modesForStep(mod, stepIndex)[0] ?? "read";
}

/** Flattened typed lectures for curriculum (landing + player sidebar). */
export function lecturesForModule(mod: CivicModule): StepLecture[] {
  const out: StepLecture[] = [];
  mod.steps.forEach((step, stepIndex) => {
    const stepNumber = stepIndex + 1;
    const modes = modesForStep(mod, stepIndex);
    for (const mode of modes) {
      const kind: LectureKind =
        mode === "read" ? "article" : mode === "watch" ? "video" : "quiz";
      const label =
        mode === "read" ? "Article" : mode === "watch" ? "Video" : "Quiz";
      out.push({
        kind,
        mode,
        label,
        href: immersiveModuleHref(mod.slug, mode, stepNumber),
        stepNumber,
        stepTitle: step.title,
      });
    }
  });
  return out;
}

/**
 * Continue path inside a lesson, then to the next lesson's preferred mode.
 * Udemy order: Article → Video → Quiz → complete step → next.
 */
export function nextContentAfter(
  mod: CivicModule,
  stepNumber: number,
  currentMode: ImmersiveMode,
): { href: string; label: string; completesStep: boolean; awardsMastery: boolean } {
  const stepIndex = stepNumber - 1;
  const modes = modesForStep(mod, stepIndex);
  const idx = modes.indexOf(currentMode);
  const nextMode = idx >= 0 ? modes[idx + 1] : undefined;

  if (nextMode === "watch") {
    return {
      href: immersiveModuleHref(mod.slug, "watch", stepNumber),
      label: "Continue",
      completesStep: false,
      awardsMastery: false,
    };
  }
  if (nextMode === "quiz") {
    return {
      href: immersiveModuleHref(mod.slug, "quiz", stepNumber, 1),
      label: "Continue",
      completesStep: false,
      awardsMastery: false,
    };
  }

  // End of this lesson's content → mark complete and advance.
  if (stepNumber < mod.steps.length) {
    const nextPreferred = preferredModeForStep(mod, stepNumber);
    return {
      href: immersiveModuleHref(mod.slug, nextPreferred, stepNumber + 1),
      label: "Next lesson",
      completesStep: true,
      awardsMastery: false,
    };
  }

  return {
    href: `/learn/modules/${mod.slug}/complete`,
    label: "Complete module",
    completesStep: true,
    awardsMastery: true,
  };
}

/** 1-based resume step for course landing / Start CTA. */
export function resolveResumeStep(mod: CivicModule): number {
  const p = readProgress(mod.slug, mod.order);
  const total = mod.steps.length;
  if (total < 1) return 1;
  if (p.masteryAwarded) return 1;

  // Prefer first incomplete step (by order key).
  for (let i = 0; i < mod.steps.length; i++) {
    const step = mod.steps[i];
    if (!p.stepsCompleted[step.order]) return i + 1;
  }

  // All marked complete but no mastery — stay on last.
  return total;
}

export function resumeHref(mod: CivicModule): string {
  const stepNumber = resolveResumeStep(mod);
  const mode = preferredModeForStep(mod, stepNumber - 1);
  return immersiveModuleHref(mod.slug, mode, stepNumber);
}

/** Guided lesson entry — one link per step (read → watch → quiz via Continue). */
export function lessonHref(mod: CivicModule, stepNumber: number): string {
  return immersiveModuleHref(
    mod.slug,
    preferredModeForStep(mod, stepNumber - 1),
    stepNumber,
  );
}

export function lessonSubtitle(mod: CivicModule, stepNumber: number): string {
  const step = mod.steps[stepNumber - 1];
  return `Lesson ${stepNumber} of ${mod.steps.length}${step?.title ? ` · ${step.title}` : ""}`;
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
    void trackGamificationWithQueue({
      event_type: "trivia_correct",
      points: 5,
      object_id: `${mod.slug}/ch${step.order}/q${questionIndex}`,
      idempotency_key: `trivia:${mod.slug}:${step.order}:${questionIndex}:${rewardTag}`,
      metadata: {
        module_slug: mod.slug,
        chapter_order: step.order,
        question_index: questionIndex,
      },
    });
  }
}

export function markChapterRead(mod: CivicModule, step: ChapterStep) {
  const p = readProgress(mod.slug, mod.order);
  writeProgress(mod.slug, {
    ...p,
    chaptersRead: { ...p.chaptersRead, [step.order]: true },
    articleRead: true,
  });
}

export function markVideoWatched(mod: CivicModule, step: ChapterStep) {
  const p = readProgress(mod.slug, mod.order);
  writeProgress(mod.slug, {
    ...p,
    videosWatched: { ...p.videosWatched, [step.order]: true },
  });
}

export function completeModuleStep(mod: CivicModule, step: ChapterStep, nextStep: number) {
  const p = readProgress(mod.slug, mod.order);
  writeProgress(mod.slug, {
    ...p,
    stepsCompleted: { ...p.stepsCompleted, [step.order]: true },
    currentStep: nextStep,
  });
  void recordLearnProgressWithQueue({
    content_type: "lesson",
    content_id: step.id,
    progress_percent: 100,
  });
  learnHubApi.completeChapter(step.id).catch(() => {});
}

export function areAllModuleVideosWatched(mod: CivicModule, p: ReturnType<typeof readProgress>): boolean {
  const videoSteps = (mod.steps ?? []).filter((s) => stepHasVideo(s));
  if (videoSteps.length === 0) return true;
  return videoSteps.every((s) => Boolean(p.videosWatched?.[s.order]));
}

export function isModuleFullyCompleted(mod: CivicModule, p: ReturnType<typeof readProgress>): boolean {
  if (!p.masteryAwarded && Object.keys(p.stepsCompleted ?? {}).length < (mod.steps?.length ?? 0)) {
    return false;
  }
  return areAllModuleVideosWatched(mod, p);
}

export function calculateModuleProgressPct(mod: CivicModule, p: ReturnType<typeof readProgress>): number {
  const totalSteps = mod.steps?.length ?? 0;
  if (totalSteps === 0) return 0;

  const videoSteps = (mod.steps ?? []).filter((s) => stepHasVideo(s));
  const totalVideoSteps = videoSteps.length;

  const completedStepsCount = Object.keys(p.stepsCompleted ?? {}).length;
  const watchedVideosCount = videoSteps.filter((s) => Boolean(p.videosWatched?.[s.order])).length;

  if (totalVideoSteps === 0) {
    return Math.round((completedStepsCount / totalSteps) * 100);
  }

  const totalItems = totalSteps + totalVideoSteps;
  const completedItems = completedStepsCount + watchedVideosCount;
  const rawPct = Math.round((completedItems / totalItems) * 100);

  const allVideosWatched = watchedVideosCount === totalVideoSteps;
  if (!allVideosWatched && rawPct >= 100) {
    return 95;
  }
  return rawPct;
}

export function awardModuleMastery(mod: CivicModule) {
  const p = readProgress(mod.slug, mod.order);
  const allVideosWatched = areAllModuleVideosWatched(mod, p);
  writeProgress(mod.slug, {
    ...p,
    masteryAwarded: allVideosWatched,
    stepsCompleted: Object.fromEntries(mod.steps.map((s) => [s.order, true])),
  });
  if (allVideosWatched) {
    void recordLearnProgressWithQueue({
      content_type: "path",
      content_id: mod.id,
      progress_percent: 100,
    });
  }
}

/** Shared segment tabs for a step (Article / Video / Quiz labels). */
export function segmentItemsForStep(mod: CivicModule, stepNumber: number) {
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  const videos = parseStepVideos(step);
  const trivia = moduleStepTrivia(mod, stepIndex);
  return [
    {
      mode: "read" as const,
      label: "Article",
      href: immersiveModuleHref(mod.slug, "read", stepNumber),
      hidden: !stepHasArticle(step) && (videos.length > 0 || trivia.length > 0),
    },
    {
      mode: "watch" as const,
      label: "Video",
      href: immersiveModuleHref(mod.slug, "watch", stepNumber),
      hidden: videos.length === 0,
    },
    {
      mode: "quiz" as const,
      label: "Quiz",
      href: immersiveModuleHref(mod.slug, "quiz", stepNumber, 1),
      hidden: trivia.length === 0,
    },
  ];
}
