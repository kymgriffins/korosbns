"use client";

import React from "react";
import { ChevronDown, PlayCircle, CheckCircle2 } from "lucide-react";
import { triviaForStep } from "@/lib/learn-trivia";
import type { ChapterStep, StageTrivia, CivicModule } from "@/types/learn";

interface CurriculumSidebarProps {
  steps: ChapterStep[];
  stage: CivicModule;
  currentStep: number;
  expandedStep: number | null;
  setExpandedStep: (step: number | null) => void;
  selectStep: (stepNum: number) => void;
  triviaForStepFn: (stage: CivicModule, step: ChapterStep | null, idx: number) => StageTrivia[];
  setActiveTab: (tab: "read" | "watch" | "quiz") => void;
  setShowTrivia: (show: boolean) => void;
  isStepTriviaPassed: (stepId: number) => boolean;
}

export function CurriculumSidebar({
  steps, stage, currentStep, expandedStep, setExpandedStep, selectStep,
  triviaForStepFn, setActiveTab, setShowTrivia, isStepTriviaPassed
}: CurriculumSidebarProps) {
  return (
    <div className="hidden md:flex md:w-[260px] bg-muted/10 border-l border-border/30 flex-col shrink-0">
      <div className="p-3 border-b border-border/30">
        <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Curriculum</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isExpanded = expandedStep === stepNum;
          const isPassed = isStepTriviaPassed(step.order);
          const isCurrent = currentStep === stepNum;

          return (
            <div key={step.id} className="border-b border-border/20">
              <button
                onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                className={`w-full flex items-center justify-between p-2.5 transition-colors hover:bg-muted/30 ${isCurrent ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-2 text-left min-w-0">
                  <div className={`size-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isPassed ? "bg-emerald-500 text-white" :
                    isCurrent ? "bg-primary text-white" :
                    "bg-muted/50 text-muted-foreground"
                  }`}>
                    {isPassed ? <CheckCircle2 className="size-3" /> : stepNum}
                  </div>
                  <span className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{step.title}</span>
                </div>
                <ChevronDown className={`size-3 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isExpanded && (
                <div className="px-3 pb-2.5 pt-0.5 space-y-0.5">
                  <button onClick={() => selectStep(stepNum)}
                    className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <PlayCircle className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Reading</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold shrink-0">{step.estimated_minutes ?? 3} min</span>
                  </button>
                  {triviaForStepFn(stage, step, idx).length > 0 && (
                    <button onClick={() => { selectStep(stepNum); setActiveTab("quiz"); setShowTrivia(true); }}
                      className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle2 className="size-3 text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0" />
                        <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Quiz</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold shrink-0">5 min</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
