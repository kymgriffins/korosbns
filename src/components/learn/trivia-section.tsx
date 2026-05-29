"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
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

export function TriviaSection({
  trivia,
  stepId,
  showTrivia,
  isStepTriviaPassed,
  onCorrectAnswer,
  onFinish,
}: TriviaSectionProps) {
  const [batchIdx, setBatchIdx] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  if (isStepTriviaPassed(stepId)) {
    return (
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
        <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Step Complete!</h4>
          <p className="text-[10px] text-muted-foreground">Tap Next below to continue your journey.</p>
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
    const isCorrect = q.answer === selectedIdx;

    setQuestionStates((s) => ({
      ...s,
      [globalIdx]: { selected: selectedIdx, submitted: true, isCorrect },
    }));

    if (isCorrect) {
      onCorrectAnswer(globalIdx);
    }
  };

  const handleRetry = (globalIdx: number) => {
    setQuestionStates((s) => ({
      ...s,
      [globalIdx]: { selected: null, submitted: false, isCorrect: false },
    }));
  };

  const handleNextBatch = () => {
    if (batchIdx < totalBatches - 1) {
      setBatchIdx((b) => b + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="space-y-6 border border-border bg-card rounded-2xl p-4 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1.5 text-primary">
        <Sparkles className="size-4" />
        <span className="text-xs font-black uppercase tracking-wide">
          Knowledge Check &middot; Batch {batchIdx + 1} of {totalBatches}
        </span>
      </div>

      {batchQuestions.map((q, batchLocalIdx) => {
        const globalIdx = startIdx + batchLocalIdx;
        const state = questionStates[globalIdx];

        return (
          <div key={globalIdx} className="space-y-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
            <h4 className="text-sm font-black text-foreground leading-snug">
              {startIdx + batchLocalIdx + 1}. {q.question}
            </h4>

            <div className="grid gap-2">
              {q.options?.map((opt, optIdx) => {
                const isSelected = state?.selected === optIdx;
                const isCorrectOpt = q.answer === optIdx;
                let optStyle = "border-border bg-card hover:bg-muted/40";

                if (state?.submitted) {
                  if (isSelected) {
                    optStyle = isCorrectOpt
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-destructive bg-destructive/10 text-destructive font-bold";
                  } else if (isCorrectOpt) {
                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                  } else {
                    optStyle = "border-border bg-card opacity-50";
                  }
                } else if (isSelected) {
                  optStyle = "border-primary bg-primary/5 text-primary font-bold";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(globalIdx, optIdx)}
                    disabled={state?.submitted}
                    className={cn(
                      "w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]",
                      optStyle
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {state?.submitted && (
              <div
                className={cn(
                  "p-3 rounded-xl border text-xs leading-normal animate-in zoom-in-95 duration-200",
                  state.isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                    : "border-destructive/20 bg-destructive/5 text-destructive"
                )}
              >
                <h5 className="font-bold flex items-center gap-1.5 mb-1">
                  {state.isCorrect ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-600" /> Correct!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-4 text-destructive" /> Not quite
                    </>
                  )}
                </h5>
                <p>{q.explanation}</p>
              </div>
            )}

            {state?.submitted && !state.isCorrect && (
              <Button
                onClick={() => handleRetry(globalIdx)}
                variant="outline"
                className="h-9 rounded-xl font-bold text-xs"
              >
                Try Again
              </Button>
            )}
          </div>
        );
      })}

      {allInBatchCorrect && (
        <Button onClick={handleNextBatch} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5">
          {batchIdx < totalBatches - 1 ? (
            <>Next Batch <ArrowRight className="size-4" /></>
          ) : (
            <>Finish Knowledge Check <CheckCircle2 className="size-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}
