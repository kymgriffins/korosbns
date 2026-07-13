import type { AdminChapter, AdminModuleDetail, AdminTriviaDetail } from "@/lib/admin-api";

export const MODULE_WIZARD_STEPS = [
  { key: "overview", label: "Module details" },
  { key: "chapters", label: "Chapters" },
  { key: "youtube", label: "YouTube" },
  { key: "trivia", label: "Trivia" },
  { key: "publish", label: "Publish" },
] as const;

export type ModuleWizardStepKey = (typeof MODULE_WIZARD_STEPS)[number]["key"];

export function isModuleWizardStep(value: string | null | undefined): value is ModuleWizardStepKey {
  return MODULE_WIZARD_STEPS.some((s) => s.key === value);
}

export type StepStatus = {
  complete: boolean;
  hint: string;
};

export function buildModuleStepStatus(
  module: AdminModuleDetail | null,
  trivia: AdminTriviaDetail | null,
): Record<ModuleWizardStepKey, StepStatus> {
  const chapters = module?.chapters ?? [];
  const hasChapters = chapters.length > 0;
  const allHaveArticles =
    hasChapters && chapters.every((c) => (c.articles?.length ?? 0) > 0);
  const anyYoutube = chapters.some((c) =>
    (c.youtube_urls ?? []).some((u) => u.trim().length > 0) || Boolean(c.youtube_url?.trim()),
  );
  const hasTriviaQuestions = (trivia?.questions?.length ?? 0) > 0;
  const published = module?.status === "published";

  return {
    overview: {
      complete: Boolean(module?.title && module?.slug),
      hint: "Title and slug required",
    },
    chapters: {
      complete: hasChapters && allHaveArticles,
      hint: "Add at least one chapter with an article",
    },
    youtube: {
      complete: anyYoutube,
      hint: "Optional: attach YouTube URLs to chapters",
    },
    trivia: {
      complete: hasTriviaQuestions,
      hint: "Add at least one question to create an assessment",
    },
    publish: {
      complete: published,
      hint: "Set status to Published when ready",
    },
  };
}

export function chapterHasMedia(chapter: AdminChapter): boolean {
  return (
    (chapter.youtube_urls ?? []).some((u) => u.trim()) || Boolean(chapter.youtube_url?.trim())
  );
}
