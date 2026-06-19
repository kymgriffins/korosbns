import type { ChapterStep, CivicModule, StageTrivia } from "@/types/learn";

/**
 * Resolve trivia questions for a learn-hub chapter step.
 * Prefers per-chapter trivia from the API; falls back to module-level
 * assessment on the final chapter only.
 */
export function triviaForStep(
  stage: Pick<CivicModule, "steps" | "trivia">,
  step: ChapterStep | null | undefined,
  idx: number,
): StageTrivia[] {
  if (step?.trivia?.length) return step.trivia;
  const moduleTrivia = stage.trivia ?? [];
  const isLast = idx >= 0 && idx === stage.steps.length - 1;
  return isLast ? moduleTrivia : [];
}

export function stageHasAnyQuiz(stage: Pick<CivicModule, "steps" | "trivia">): boolean {
  if ((stage.trivia?.length ?? 0) > 0) return true;
  return stage.steps.some((step, idx) => triviaForStep(stage, step, idx).length > 0);
}
