"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, AlertCircle } from "lucide-react";
import { cn } from "@/utils";
import type { StageTrivia } from "@/types/learn";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";

type QuestionState = {
  selected: number | null;
  submitted: boolean;
  correct: boolean;
};

export function ImmersiveQuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  prevHref,
  nextHref,
  onAnsweredCorrectly,
  onFinish,
  isLast,
}: {
  question: StageTrivia;
  questionNumber: number;
  totalQuestions: number;
  prevHref?: string;
  nextHref?: string;
  onAnsweredCorrectly: () => void;
  onFinish?: () => void;
  isLast: boolean;
}) {
  const [state, setState] = useState<QuestionState>({
    selected: null,
    submitted: false,
    correct: false,
  });

  const isReflection = question.type === "reflection";

  const selectOption = (optIdx: number) => {
    if (state.submitted) return;
    const correct = isReflection ? true : question.answer === optIdx;
    setState({ selected: optIdx, submitted: true, correct });
    if (correct) onAnsweredCorrectly();
  };

  const retry = () => setState({ selected: null, submitted: false, correct: false });

  const canAdvance = state.submitted && (state.correct || isReflection);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-lg flex-1 px-5 py-4">
        <p className="text-[13px] font-medium uppercase tracking-wide text-primary">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h1 className="mt-3 text-[length:var(--immersive-title)] font-semibold leading-snug tracking-tight">
          {question.question}
        </h1>
        {isReflection ? (
          <span className="mt-2 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[12px] font-semibold text-amber-700">
            Reflection
          </span>
        ) : null}

        <div className="mt-8 space-y-3">
          {question.options?.map((opt, optIdx) => {
            const picked = state.selected === optIdx;
            let style = "border-border/60 bg-card hover:bg-muted/40";

            if (state.submitted) {
              if (picked) {
                style = isReflection
                  ? "border-amber-500/50 bg-amber-500/10"
                  : state.correct
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-destructive/50 bg-destructive/10";
              } else if (!isReflection && question.answer === optIdx) {
                style = "border-emerald-500/40 bg-emerald-500/5";
              } else {
                style = "border-border/30 opacity-50";
              }
            } else if (picked) {
              style = "border-primary bg-primary/5";
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={state.submitted}
                onClick={() => selectOption(optIdx)}
                className={cn(
                  "immersive-option w-full border px-4 py-3.5 text-left text-[16px] font-medium leading-snug transition-all active:scale-[0.99]",
                  style,
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {state.submitted ? (
          <div
            className={cn(
              "mt-6 rounded-[var(--immersive-radius)] border p-4 text-[15px] leading-relaxed",
              isReflection
                ? "border-amber-500/25 bg-amber-500/5"
                : state.correct
                  ? "border-emerald-500/25 bg-emerald-500/5"
                  : "border-destructive/25 bg-destructive/5",
            )}
          >
            <p className="mb-1 flex items-center gap-2 font-semibold">
              {isReflection ? (
                <>
                  <Lightbulb className="size-4 text-amber-600" /> Recorded
                </>
              ) : state.correct ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-600" /> Correct
                </>
              ) : (
                <>
                  <AlertCircle className="size-4 text-destructive" /> Try again
                </>
              )}
            </p>
            {question.explanation ? <p className="text-muted-foreground">{question.explanation}</p> : null}
            {!state.correct && !isReflection ? (
              <button
                type="button"
                onClick={retry}
                className="mt-3 text-[14px] font-semibold text-primary"
              >
                Choose another answer
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <ImmersiveBottomBar
        prevHref={prevHref}
        prevDisabled={!prevHref}
        nextHref={canAdvance && nextHref ? nextHref : undefined}
        nextLabel={isLast ? "Finish step" : "Next question"}
        nextDisabled={!canAdvance}
        onNext={
          canAdvance && isLast && onFinish
            ? onFinish
            : undefined
        }
      />
    </div>
  );
}
