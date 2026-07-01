"use client";

import { Button } from "@/components/ui/button";
import { ProgressDots } from "./progress-dots";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

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

export function NavigationFooter({ currentStep, totalSteps, hasNext, hasPrev, onClose, onPrevStep, onNextStep, onStartLearning, onPrevStage, onNextStage }: NavigationFooterProps) {
  if (currentStep === 0) {
    return (
      <div className="flex items-center justify-between px-4 md:px-5 h-12 border-t border-border/30 shrink-0 bg-background/60 backdrop-blur">
        <Button variant="ghost" onClick={onClose} size="sm" className="text-[10px] font-bold gap-1 rounded-lg h-8 px-3">
          <ArrowLeft className="size-3.5" /> Back
        </Button>
        <span className="text-[9px] text-muted-foreground font-medium flex items-center gap-1">
          <BookOpen className="size-3" /> Overview
        </span>
        <Button onClick={onStartLearning} size="sm" className="text-[10px] font-bold rounded-lg h-8 gap-1">
          Start <ArrowRight className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (currentStep === totalSteps + 1) {
    return (
      <div className="flex items-center justify-between px-4 md:px-5 h-12 border-t border-border/30 shrink-0 bg-background/60 backdrop-blur">
        <Button variant="ghost" onClick={onPrevStep} size="sm" className="text-[10px] font-bold gap-1 rounded-lg h-8 px-3">
          <ArrowLeft className="size-3.5" /> Prev
        </Button>
        <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
        {hasNext && onNextStage ? (
          <Button onClick={onNextStage} size="sm" className="text-[10px] font-bold rounded-lg h-8 gap-1">
            Next Stage <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button onClick={onClose} size="sm" className="text-[10px] font-bold rounded-lg h-8">Finish</Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 md:px-5 h-12 border-t border-border/30 shrink-0 bg-background/60 backdrop-blur">
      <Button variant="ghost" onClick={onPrevStep} size="sm" className="text-[10px] font-bold gap-1 rounded-lg h-8 px-3" disabled={!hasPrev}>
        <ArrowLeft className="size-3.5" /> Prev
      </Button>
      <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
      <Button onClick={onNextStep} size="sm" className="text-[10px] font-bold rounded-lg h-8 gap-1" disabled={!hasNext}>
        Continue <ArrowRight className="size-3.5" />
      </Button>
    </div>
  );
}
