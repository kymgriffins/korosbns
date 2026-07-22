"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveSegment } from "./immersive-segment";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { ImmersiveVideoStage } from "./immersive-video-stage";
import { ImmersiveLessonFrame } from "./immersive-lesson-frame";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  awardModuleMastery,
  completeModuleStep,
  immersiveModuleHref,
  markVideoWatched,
  nextContentAfter,
  parseStepVideos,
  segmentItemsForStep,
  stepHasArticle,
} from "@/lib/immersive-module";

export function ImmersiveWatchScreen({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { mod, refreshProgress } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  if (!step) {
    router.replace(`/learn/modules/${mod.slug}/watch/1`);
    return null;
  }

  const videos = parseStepVideos(step);
  if (videos.length === 0) {
    router.replace(immersiveModuleHref(mod.slug, "read", stepNumber));
    return null;
  }

  const segments = segmentItemsForStep(mod, stepNumber);
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

  return (
    <ImmersiveLessonFrame activeStep={stepNumber} activeMode="watch">
      <ImmersiveChrome
        backHref={`/learn/modules/${mod.slug}`}
        title={mod.title}
        subtitle={`${step.title} · Video`}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <ImmersiveSegment items={segments} active="watch" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ImmersiveVideoStage videos={videos} stepTitle={step.title} />
      </div>
      <ImmersiveBottomBar
        prevHref={
          stepHasArticle(step)
            ? immersiveModuleHref(mod.slug, "read", stepNumber)
            : stepNumber > 1
              ? immersiveModuleHref(mod.slug, "read", stepNumber - 1)
              : `/learn/modules/${mod.slug}`
        }
        onNext={handleNext}
        nextLabel={next.label}
      />
    </ImmersiveLessonFrame>
  );
}
