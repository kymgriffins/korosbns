"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveSegment } from "./immersive-segment";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { ImmersiveReadingCanvas } from "./immersive-reading-canvas";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  immersiveModuleHref,
  moduleStepTrivia,
  parseStepVideos,
  stepReadingMinutes,
} from "@/lib/immersive-module";

export function ImmersiveReadScreen({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { mod } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  if (!step) {
    router.replace(`/learn/modules/${mod.slug}/read/1`);
    return null;
  }

  const videos = parseStepVideos(step);
  const trivia = moduleStepTrivia(mod, stepIndex);
  const duration = stepReadingMinutes(step, videos.length);

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

  const nextHref =
    trivia.length > 0
      ? immersiveModuleHref(mod.slug, "quiz", stepNumber, 1)
      : stepNumber < mod.steps.length
        ? immersiveModuleHref(mod.slug, "read", stepNumber + 1)
        : `/learn/modules/${mod.slug}/complete`;

  return (
    <>
      <ImmersiveChrome
        backHref="/learn?tab=learn"
        title={mod.title}
        subtitle={`Step ${stepNumber} of ${mod.steps.length}`}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <ImmersiveSegment items={segments} active="read" />
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <ImmersiveReadingCanvas step={step} durationLabel={duration} />
      </div>
      <ImmersiveBottomBar
        prevHref={stepNumber > 1 ? immersiveModuleHref(mod.slug, "read", stepNumber - 1) : undefined}
        prevDisabled={stepNumber <= 1}
        nextHref={nextHref}
        nextLabel={trivia.length > 0 ? "Knowledge check" : stepNumber < mod.steps.length ? "Next step" : "Complete module"}
      />
    </>
  );
}
