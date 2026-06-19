"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { cn } from "@/utils";
import type { StageTrivia } from "@/types/learn";

interface TriviaSectionProps {
  trivia: StageTrivia[];
  stepId: number;
  showTrivia: boolean;
  isStepTriviaPassed: (stepId: number) => boolean;
  onCorrectAnswer: (qIdx: number) => void;
  onFinish: () => void;
}

interface QuestionState {
  selected: number | null;
  submitted: boolean;
  isCorrect: boolean;
}

const BATCH_SIZE = 3;

export function TriviaSection({ trivia, stepId, showTrivia, isStepTriviaPassed, onCorrectAnswer, onFinish }: TriviaSectionProps) {
  const [batchIdx, setBatchIdx] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  if (isStepTriviaPassed(stepId)) {
    return (
      <div className="p-3 rounded-xl bg-emerald-500/5 flex items-center gap-2.5">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Step Complete!</h4>
          <p className="text-[10px] text-muted-foreground">Continue your journey.</p>
        </div>
      </div>
    );
  }

  if (!showTrivia) return null;

  const totalQuestions = trivia.length;
  const totalBatches = Math.ceil(totalQuestions / BATCH_SIZE);
  const startIdx = batchIdx * BATCH_SIZE;
  const batchQuestions = trivia.slice(startIdx, startIdx + BATCH_SIZE);

  const allInBatchCorrect = batchQuestions.every((_, i) => {
    const gIdx = startIdx + i;
    return questionStates[gIdx]?.submitted && questionStates[gIdx]?.isCorrect;
  });

  const handleSelect = (globalIdx: number, selectedIdx: number) => {
    const prev = questionStates[globalIdx];
    if (prev?.submitted) return;
    const q = trivia[globalIdx];
    const isCorrect = q.type === "reflection" ? true : q.answer === selectedIdx;
    setQuestionStates((s) => ({ ...s, [globalIdx]: { selected: selectedIdx, submitted: true, isCorrect } }));
    if (isCorrect) onCorrectAnswer(globalIdx);
  };

  const handleRetry = (globalIdx: number) => {
    setQuestionStates((s) => ({ ...s, [globalIdx]: { selected: null, submitted: false, isCorrect: false } }));
  };

  const handleNextBatch = () => {
    if (batchIdx < totalBatches - 1) setBatchIdx((b) => b + 1);
    else onFinish();
  };

  return (
    <div className="space-y-4 bg-card shadow-xs rounded-xl p-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-1.5 text-primary">
        <Sparkles className="size-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Knowledge Check · Batch {batchIdx + 1} of {totalBatches}</span>
      </div>

      {batchQuestions.map((q, batchLocalIdx) => {
        const globalIdx = startIdx + batchLocalIdx;
        const state = questionStates[globalIdx];

        return (
          <div key={globalIdx} className="space-y-2.5 pb-3 border-b border-border/20 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-bold leading-snug">{startIdx + batchLocalIdx + 1}. {q.question}</h4>
              {q.type === "reflection" && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Reflection</span>
              )}
            </div>

            <div className="grid gap-1.5">
              {q.options?.map((opt, optIdx) => {
                const isSelected = state?.selected === optIdx;
                const isReflection = q.type === "reflection";
                const isCorrectOpt = isReflection ? true : q.answer === optIdx;
                let optStyle = "bg-card border-border/50 hover:bg-muted/30";

                if (state?.submitted) {
                  if (isSelected) {
                    optStyle = isReflection ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold" :
                      isCorrectOpt ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold" :
                      "border-destructive bg-destructive/10 text-destructive font-bold";
                  } else if (isCorrectOpt && !isReflection) {
                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                  } else {
                    optStyle = "border-border/30 bg-card opacity-50";
                  }
                } else if (isSelected) {
                  optStyle = "border-primary bg-primary/5 text-primary font-bold";
                }

                return (
                  <button key={optIdx} onClick={() => handleSelect(globalIdx, optIdx)} disabled={state?.submitted}
                    className={cn("w-full min-h-11 px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]", optStyle)}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {state?.submitted && (
              <div className={cn("p-2.5 rounded-xl border text-[11px] leading-normal animate-in zoom-in-95 duration-200", 
                q.type === "reflection" ? "border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-200" :
                state.isCorrect ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200" :
                "border-destructive/20 bg-destructive/5 text-destructive"
              )}>
                <h5 className="font-bold flex items-center gap-1.5 mb-0.5">
                  {q.type === "reflection" ? <><Lightbulb className="size-3.5" /> Reflection recorded</> :
                    state.isCorrect ? <><CheckCircle2 className="size-3.5 text-emerald-600" /> Correct!</> :
                    <><AlertCircle className="size-3.5 text-destructive" /> Not quite</>
                  }
                </h5>
                {q.explanation && <p>{q.explanation}</p>}
              </div>
            )}

            {state?.submitted && !state.isCorrect && q.type !== "reflection" && (
              <Button onClick={() => handleRetry(globalIdx)} variant="outline" size="sm" className="rounded-lg font-bold text-[10px] h-7">Try Again</Button>
            )}
          </div>
        );
      })}

      {allInBatchCorrect && (
        <Button onClick={handleNextBatch} className="w-full h-9 rounded-lg font-bold text-xs gap-1.5">
          {batchIdx < totalBatches - 1 ? <>Next Batch <ArrowRight className="size-3.5" /></> : <>Finish <CheckCircle2 className="size-3.5" /></>}
        </Button>
      )}
    </div>
  );
}
