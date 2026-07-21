"use client";

import { useRouter } from "next/navigation";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveSegment } from "./immersive-segment";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { ImmersiveVideoStage } from "./immersive-video-stage";
import { useImmersiveModule } from "./immersive-module-provider";
import {
  immersiveModuleHref,
  moduleStepTrivia,
  parseStepVideos,
} from "@/lib/immersive-module";

export function ImmersiveWatchScreen({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { mod } = useImmersiveModule();
  const stepIndex = stepNumber - 1;
  const step = mod.steps[stepIndex];
  if (!step) {
    router.replace(`/learn/modules/${mod.slug}/watch/1`);
    return null;
  }

  const videos = parseStepVideos(step);
  const trivia = moduleStepTrivia(mod, stepIndex);

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
      : immersiveModuleHref(mod.slug, "read", stepNumber);

  return (
    <>
      <ImmersiveChrome
        backHref="/learn?tab=learn"
        title={mod.title}
        subtitle={`Step ${stepNumber} · Watch`}
        progress={{ current: stepNumber, total: mod.steps.length }}
      />
      <ImmersiveSegment items={segments} active="watch" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ImmersiveVideoStage videos={videos} stepTitle={step.title} />
      </div>
      <ImmersiveBottomBar
        prevHref={immersiveModuleHref(mod.slug, "read", stepNumber)}
        nextHref={nextHref}
        nextLabel={trivia.length > 0 ? "Take quiz" : "Back to reading"}
      />
    </>
  );
}
