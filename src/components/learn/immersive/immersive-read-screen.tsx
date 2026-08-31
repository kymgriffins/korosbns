"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveSegment } from "./immersive-segment";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { ImmersiveReadingCanvas } from "./immersive-reading-canvas";
import { ImmersiveLessonFrame } from "./immersive-lesson-frame";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  awardModuleMastery,
  completeModuleStep,
  immersiveModuleHref,
  markChapterRead,
  nextContentAfter,
  parseStepVideos,
  preferredModeForStep,
  segmentItemsForStep,
  stepReadingMinutes,
} from "@/lib/immersive-module";

export function ImmersiveReadScreen({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { mod, refreshProgress } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  if (!step) {
    router.replace(`/learn/modules/${mod.slug}/read/1`);
    return null;
  }

  const videos = parseStepVideos(step);
  const duration = stepReadingMinutes(step, videos.length);
  const segments = segmentItemsForStep(mod, stepNumber);
  const next = nextContentAfter(mod, stepNumber, "read");

  const prevHref =
    stepNumber > 1
      ? immersiveModuleHref(
          mod.slug,
          preferredModeForStep(mod, stepNumber - 2),
          stepNumber - 1,
        )
      : `/learn/modules/${mod.slug}`;

  const handleNext = () => {
    markChapterRead(mod, step);
    if (next.completesStep) {
      completeModuleStep(mod, step, stepNumber + 1);
      if (next.awardsMastery) awardModuleMastery(mod);
      refreshProgress();
    }
    router.push(next.href);
  };

  return (
    <ImmersiveLessonFrame activeStep={stepNumber} activeMode="read">
      <ImmersiveChrome
        backHref={`/learn/modules/${mod.slug}`}
        title={mod.title}
        subtitle={`${step.title} · Article`}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <ImmersiveSegment items={segments} active="read" />
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <ImmersiveReadingCanvas
          step={step}
          durationLabel={duration}
          moduleSlug={mod.slug}
          stepNumber={stepNumber}
        />
      </div>
      <ImmersiveBottomBar
        prevHref={prevHref}
        onNext={handleNext}
        nextLabel={next.label}
      />
    </ImmersiveLessonFrame>
  );
}
