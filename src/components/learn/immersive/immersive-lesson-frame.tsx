"use client";

import { useState, type ReactNode } from "react";
import type { ImmersiveMode } from "@/lib/immersive-module";
import { CurriculumToggle, ImmersiveCurriculum } from "./immersive-curriculum";

type Props = {
  activeStep: number;
  activeMode: ImmersiveMode;
  children: ReactNode;
};

/** Phone-first lesson shell — overlay lesson list only. */
export function ImmersiveLessonFrame({ activeStep, activeMode, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <ImmersiveCurriculum
        activeStep={activeStep}
        activeMode={activeMode}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-30 flex justify-end p-3 safe-area-inset-top">
          <CurriculumToggle onClick={() => setOpen(true)} />
        </div>
        {children}
      </div>
    </div>
  );
}
