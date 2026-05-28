import type { StageData, StepData } from "@/constants/stages-data";
import type { StepTakeaway } from "@/lib/civic-fallback";

export type CivicChapterApi = {
  id: string;
  title: string;
  order: number;
  youtube_url?: string;
  audio_url?: string;
  transcript?: string;
  text?: string;
  takeaways?: StepTakeaway[];
  trivia?: Array<{
    id?: string;
    type: "multiple-choice" | "reflection";
    question: string;
    options?: string[];
    answer?: number;
    explanation?: string;
    trivia_id?: string;
  }>;
  trivia_id?: string | null;
  is_completed?: boolean;
  is_locked?: boolean;
};

export type CivicModuleApi = {
  id: string;
  slug: string;
  title: string;
  badge?: string;
  badgeName?: string;
  documentName?: string;
  archive?: string;
  link?: string;
  status?: string;
  credits?: string;
  description?: string;
  expectations?: string[];
  order?: number;
  steps: CivicChapterApi[];
};

function youtubeIdFromUrl(url?: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&/]+)/,
  );
  return match?.[1] ?? "";
}

function mapChapterToStep(chapter: CivicChapterApi, index: number): StepData & {
  chapterId?: string;
  triviaId?: string | null;
  isCompleted?: boolean;
  isLocked?: boolean;
} {
  return {
    id: index + 1,
    chapterId: chapter.id,
    triviaId: chapter.trivia_id ?? chapter.trivia?.[0]?.trivia_id ?? null,
    title: chapter.title,
    youtubeId: youtubeIdFromUrl(chapter.youtube_url),
    audioUrl: chapter.audio_url ?? "",
    transcript: chapter.transcript ?? "",
    text: chapter.text ?? "",
    takeaways: chapter.takeaways,
    trivia: (chapter.trivia ?? []).map((item) => ({
      id: item.id,
      type: item.type,
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
    })),
    isCompleted: chapter.is_completed,
    isLocked: chapter.is_locked,
  };
}

export function mapCivicModulesToStages(modules: CivicModuleApi[]): StageData[] {
  return modules
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((mod, index) => ({
      id: index + 1,
      slug: mod.slug,
      moduleId: mod.id,
      title: mod.title,
      badge: mod.badge ?? "📘",
      badgeName: mod.badgeName ?? mod.title,
      documentName: mod.documentName ?? mod.title,
      archive: mod.archive ?? "",
      link: mod.link ?? "",
      status: (mod.status as StageData["status"]) ?? "Published",
      credits: mod.credits ?? "BNS Team",
      description: mod.description ?? "",
      expectations: mod.expectations ?? [],
      steps: mod.steps.map((chapter, stepIndex) => mapChapterToStep(chapter, stepIndex)),
    })) as StageData[];
}

export function mergeStagesWithFallback(
  apiStages: StageData[],
  fallback: StageData[] = [],
): StageData[] {
  return apiStages.length > 0 ? apiStages : fallback;
}
