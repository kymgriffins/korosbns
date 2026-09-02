"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveQuestionScreen } from "./immersive-question-screen";
import { ImmersiveLessonFrame } from "./immersive-lesson-frame";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  awardModuleMastery,
  completeModuleStep,
  immersiveModuleHref,
  lessonSubtitle,
  moduleStepTrivia,
  nextContentAfter,
  preferredModeForStep,
  recordCorrectAnswer,
} from "@/lib/immersive-module";
import { learnHubApi } from "@/lib/learn-hub";

export function ImmersiveQuizScreen({
  stepNumber,
  questionNumber,
}: {
  stepNumber: number;
  questionNumber: number;
}) {
  const router = useRouter();
  const { mod, refreshProgress } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  const trivia = moduleStepTrivia(mod, stepIndex);
  const qIndex = questionNumber - 1;
  const question = trivia[qIndex];

  if (!step || !question) {
    router.replace(
      immersiveModuleHref(
        mod.slug,
        preferredModeForStep(mod, Math.max(0, stepIndex)),
        Math.max(1, stepNumber),
      ),
    );
    return null;
  }

  const prevQuestionHref =
    questionNumber > 1
      ? immersiveModuleHref(mod.slug, "quiz", stepNumber, questionNumber - 1)
      : immersiveModuleHref(mod.slug, preferredModeForStep(mod, stepIndex), stepNumber);

  const nextQuestionHref =
    questionNumber < trivia.length
      ? immersiveModuleHref(mod.slug, "quiz", stepNumber, questionNumber + 1)
      : undefined;

  const finishStep = () => {
    const next = nextContentAfter(mod, stepNumber, "quiz");
    completeModuleStep(mod, step, stepNumber + 1);
    if (next.awardsMastery) {
      awardModuleMastery(mod);
      const lastStep = mod.steps[mod.steps.length - 1];
      if (lastStep) learnHubApi.completeChapter(lastStep.id).catch(() => {});
    }
    refreshProgress();
    router.push(next.href);
  };

  return (
    <ImmersiveLessonFrame activeStep={stepNumber} activeMode="quiz">
      <ImmersiveChrome
        backHref={`/learn/modules/${mod.slug}`}
        title={mod.title}
        subtitle={lessonSubtitle(mod, stepNumber)}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <ImmersiveQuestionScreen
        question={question}
        questionNumber={questionNumber}
        totalQuestions={trivia.length}
        prevHref={prevQuestionHref}
        nextHref={nextQuestionHref}
        isLast={questionNumber >= trivia.length}
        onAnsweredCorrectly={() => recordCorrectAnswer(mod, step, qIndex)}
        onFinish={finishStep}
      />
    </ImmersiveLessonFrame>
  );
}
