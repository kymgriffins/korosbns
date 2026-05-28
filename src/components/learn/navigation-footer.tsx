"use client";

import { Button } from "@/ui/button";
import { ProgressDots } from "./progress-dots";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  hasNext: boolean;
  hasPrev: boolean;
  onClose: () => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  onStartLearning: () => void;
  onPrevStage?: () => void;
  onNextStage?: () => void;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  hasNext,
  hasPrev,
  onClose,
  onPrevStep,
  onNextStep,
  onStartLearning,
  onPrevStage,
  onNextStage,
}: NavigationFooterProps) {
  if (currentStep === 0) {
    return (
      <div className="flex items-center justify-between px-4 md:px-6 h-14 border-t border-border shrink-0 bg-background/80 backdrop-blur-xs">
        <Button variant="ghost" onClick={onClose} className="text-xs font-bold gap-1.5 rounded-xl">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
          <BookOpen className="size-3" /> Overview
        </span>
        <Button onClick={onStartLearning} className="text-xs font-bold rounded-xl">
          Start Course <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  if (currentStep === totalSteps + 1) {
    return (
      <div className="flex items-center justify-between px-4 md:px-6 h-14 border-t border-border shrink-0 bg-background/80 backdrop-blur-xs">
        <Button
          variant="ghost"
          onClick={onPrevStep}
          className="text-xs font-bold gap-1.5 rounded-xl"
        >
          <ArrowLeft className="size-4" /> Previous
        </Button>
        <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
        {hasNext && onNextStage ? (
          <Button onClick={onNextStage} className="text-xs font-bold rounded-xl">
            Next Stage <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={onClose} className="text-xs font-bold rounded-xl">
            Finish
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 border-t border-border shrink-0 bg-background/80 backdrop-blur-xs">
      <Button
        variant="ghost"
        onClick={onPrevStep}
        className="text-xs font-bold gap-1.5 rounded-xl"
        disabled={!hasPrev}
      >
        ← Previous
      </Button>
      <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
      <Button
        onClick={onNextStep}
        className="text-xs font-bold rounded-xl"
        disabled={!hasNext}
      >
        Continue <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
