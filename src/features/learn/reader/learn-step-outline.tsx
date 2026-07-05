"use client";

import React from "react";
import { CheckCircle2, ChevronDown, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { triviaForStep } from "@/lib/learn-trivia";
import type { ChapterStep, CivicModule, StageTrivia } from "@/types/learn";

export function LearnStepOutline({
  steps,
  stage,
  currentStep,
  expandedStep,
  setExpandedStep,
  selectStep,
  setActiveTab,
  setShowTrivia,
  isStepTriviaPassed,
}: {
  steps: ChapterStep[];
  stage: CivicModule;
  currentStep: number;
  expandedStep: number | null;
  setExpandedStep: (step: number | null) => void;
  selectStep: (stepNum: number) => void;
  triviaForStepFn?: (stage: CivicModule, step: ChapterStep | null, idx: number) => StageTrivia[];
  setActiveTab: (tab: "read" | "watch" | "quiz") => void;
  setShowTrivia: (show: boolean) => void;
  isStepTriviaPassed: (stepId: number) => boolean;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l border-border/40 bg-muted/20 md:flex">
      <div className="border-b border-border/40 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">In this module</p>
        <p className="mt-0.5 truncate text-sm font-semibold tracking-tight">{stage.title}</p>
      </div>
      <ol className="flex-1 overflow-y-auto p-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isExpanded = expandedStep === stepNum;
          const isPassed = isStepTriviaPassed(step.order);
          const isCurrent = currentStep === stepNum;
          const hasQuiz = triviaForStep(stage, step, idx).length > 0;

          return (
            <li key={step.id} className="mb-1">
              <button
                type="button"
                onClick={() => {
                  selectStep(stepNum);
                  setExpandedStep(isExpanded ? null : stepNum);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  isCurrent ? "bg-primary/10 text-foreground" : "hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isPassed
                      ? "bg-emerald-500/15 text-emerald-600"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isPassed ? <CheckCircle2 className="size-3.5" /> : stepNum}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{step.title}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>
              {isExpanded ? (
                <div className="ml-10 space-y-0.5 pb-2 pr-2">
                  <button
                    type="button"
                    onClick={() => selectStep(stepNum)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  >
                    <PlayCircle className="size-3.5" />
                    Read · {step.estimated_minutes ?? 3} min
                  </button>
                  {hasQuiz ? (
                    <button
                      type="button"
                      onClick={() => {
                        selectStep(stepNum);
                        setActiveTab("quiz");
                        setShowTrivia(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Quiz
                    </button>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
