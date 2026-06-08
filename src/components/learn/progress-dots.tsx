"use client";

import { cn } from "@/utils";

export function ProgressDots({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={i} className={cn(
            "size-1.5 rounded-full transition-all",
            isDone && "bg-primary",
            isActive && "bg-primary ring-2 ring-primary/30",
            !isDone && !isActive && "bg-muted-foreground/15",
          )} />
        );
      })}
    </div>
  );
}
