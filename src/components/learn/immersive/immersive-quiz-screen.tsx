"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveSegment } from "./immersive-segment";
import { ImmersiveQuestionScreen } from "./immersive-question-screen";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  awardModuleMastery,
  completeModuleStep,
  immersiveModuleHref,
  moduleStepTrivia,
  parseStepVideos,
  recordCorrectAnswer,
} from "@/lib/immersive-module";
import { learnHubApi } from "@/lib/learn-hub";
import { certificateDownloadHref } from "@/lib/certificate-url";

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
    router.replace(immersiveModuleHref(mod.slug, "read", stepNumber));
    return null;
  }

  const videos = parseStepVideos(step);
  const segments = [
    { mode: "read" as const, label: "Read", href: immersiveModuleHref(mod.slug, "read", stepNumber) },
    {
      mode: "watch" as const,
      label: "Watch",
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

  const prevQuestionHref =
    questionNumber > 1
      ? immersiveModuleHref(mod.slug, "quiz", stepNumber, questionNumber - 1)
      : immersiveModuleHref(mod.slug, "read", stepNumber);

  const nextQuestionHref =
    questionNumber < trivia.length
      ? immersiveModuleHref(mod.slug, "quiz", stepNumber, questionNumber + 1)
      : undefined;

  const finishStep = () => {
    const nextStep = stepNumber + 1;
    completeModuleStep(mod, step, nextStep);
    refreshProgress();

    if (stepNumber >= mod.steps.length) {
      awardModuleMastery(mod);
      const lastStep = mod.steps[mod.steps.length - 1];
      if (lastStep) {
        learnHubApi.completeChapter(lastStep.id).catch(() => {});
      }
      router.push(`/learn/modules/${mod.slug}/complete`);
      return;
    }
    router.push(immersiveModuleHref(mod.slug, "read", nextStep));
  };

  return (
    <>
      <ImmersiveChrome
        backHref={immersiveModuleHref(mod.slug, "read", stepNumber)}
        title={mod.title}
        subtitle={`Step ${stepNumber} · Quiz`}
        progress={{ current: questionNumber, total: trivia.length }}
      />
      <ImmersiveSegment items={segments} active="quiz" />
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
    </>
  );
}
