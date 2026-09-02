"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { ImmersiveVideoStage } from "./immersive-video-stage";
import { ImmersiveLessonFrame } from "./immersive-lesson-frame";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  awardModuleMastery,
  completeModuleStep,
  immersiveModuleHref,
  lessonSubtitle,
  markVideoWatched,
  nextContentAfter,
  parseStepVideos,
  preferredModeForStep,
} from "@/lib/immersive-module";

export function ImmersiveWatchScreen({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { mod, refreshProgress } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];

  useEffect(() => {
    if (step) {
      markVideoWatched(mod, step);
      refreshProgress();
    }
  }, [mod, step, refreshProgress]);

  if (!step) {
    router.replace(`/learn/modules/${mod.slug}/watch/1`);
    return null;
  }

  const videos = parseStepVideos(step);
  if (videos.length === 0) {
    router.replace(immersiveModuleHref(mod.slug, "read", stepNumber));
    return null;
  }

  const next = nextContentAfter(mod, stepNumber, "watch");

  const handleNext = () => {
    markVideoWatched(mod, step);
    if (next.completesStep) {
      completeModuleStep(mod, step, stepNumber + 1);
      if (next.awardsMastery) awardModuleMastery(mod);
      refreshProgress();
    }
    router.push(next.href);
  };

  const prevHref =
    stepNumber > 1
      ? immersiveModuleHref(
          mod.slug,
          preferredModeForStep(mod, stepNumber - 2),
          stepNumber - 1,
        )
      : `/learn/modules/${mod.slug}`;

  return (
    <ImmersiveLessonFrame activeStep={stepNumber} activeMode="watch">
      <ImmersiveChrome
        backHref={`/learn/modules/${mod.slug}`}
        title={mod.title}
        subtitle={lessonSubtitle(mod, stepNumber)}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ImmersiveVideoStage videos={videos} stepTitle={step.title} />
      </div>
      <ImmersiveBottomBar prevHref={prevHref} onNext={handleNext} nextLabel={next.label} />
    </ImmersiveLessonFrame>
  );
}
