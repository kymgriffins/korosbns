"use client";

import { useState, type ReactNode } from "react";
import type { ImmersiveMode } from "@/lib/immersive-module";
import { CurriculumToggle, ImmersiveCurriculum } from "./immersive-curriculum";

type Props = {
  activeStep: number;
  activeMode: ImmersiveMode;
  children: ReactNode;
};

/** Udemy-style shell: curriculum rail (desktop) + lesson column. */
export function ImmersiveLessonFrame({ activeStep, activeMode, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Desktop rail always visible */}
      <div className="hidden h-full md:flex">
        <ImmersiveCurriculum
          activeStep={activeStep}
          activeMode={activeMode}
          open
          onClose={() => {}}
        />
      </div>

      {/* Mobile overlay curriculum */}
      <div className="md:hidden">
        <ImmersiveCurriculum
          activeStep={activeStep}
          activeMode={activeMode}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-end p-3 md:hidden">
          <div className="pointer-events-auto pt-12">
            <CurriculumToggle onClick={() => setOpen(true)} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
