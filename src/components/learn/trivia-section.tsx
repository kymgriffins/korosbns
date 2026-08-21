"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/utils";
import type { StageTrivia } from "@/types/learn";

interface TriviaSectionProps {
  trivia: StageTrivia[];
  stepId: number;
  showTrivia: boolean;
  isStepTriviaPassed: (stepId: number) => boolean;
  onCorrectAnswer: (qIdx: number) => void;
  onFinish: () => void;
  /** Close full-page quiz without finishing (returns to module content). */
  onClose?: () => void;
  /** Optional title shown in the full-page chrome */
  title?: string;
}

interface QuestionState {
  selected: number | null;
  submitted: boolean;
  isCorrect: boolean;
}

/**
 * Full-page knowledge check — one question at a time (desktop + mobile).
 */
export function TriviaSection({
  trivia,
  stepId,
  showTrivia,
  isStepTriviaPassed,
  onCorrectAnswer,
  onFinish,
  onClose,
  title = "Knowledge Check",
}: TriviaSectionProps) {
  const [qIdx, setQIdx] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  useEffect(() => {
    if (showTrivia) {
      setQIdx(0);
      setQuestionStates({});
    }
  }, [showTrivia, stepId]);

  useEffect(() => {
    if (!showTrivia) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showTrivia]);

  if (!showTrivia) return null;

  if (isStepTriviaPassed(stepId)) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-background"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trivia-title"
      >
        <header className="flex shrink-0 items-center gap-2 border-b px-3 py-3 md:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close quiz"
          >
            {onClose ? <X className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
          <p id="trivia-title" className="text-sm font-semibold">
            {title}
          </p>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CheckCircle2 className="size-10 text-emerald-600" />
          <div>
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Step Complete!</h4>
            <p className="text-xs text-muted-foreground">You already passed this check. Continue your journey.</p>
          </div>
          {onClose ? (
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-lg text-xs font-bold">
              Back to lesson
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={onFinish} className="rounded-lg text-xs font-bold">
              Continue
            </Button>
          )}
        </div>
      </div>
    );
  }

  const total = trivia.length;
  const q = trivia[qIdx];
  const state = questionStates[qIdx];
  const isLast = qIdx >= total - 1;
  const canAdvance = Boolean(state?.submitted && state.isCorrect);

  const handleSelect = (selectedIdx: number) => {
    if (state?.submitted) return;
    if (!q) return;
    const isCorrect = q.type === "reflection" ? true : q.answer === selectedIdx;
    setQuestionStates((s) => ({
      ...s,
      [qIdx]: { selected: selectedIdx, submitted: true, isCorrect },
    }));
    if (isCorrect) onCorrectAnswer(qIdx);
  };

  const handleRetry = () => {
    setQuestionStates((s) => ({
      ...s,
      [qIdx]: { selected: null, submitted: false, isCorrect: false },
    }));
  };

  const handleContinue = () => {
    if (!canAdvance) return;
    if (isLast) onFinish();
    else setQIdx((i) => i + 1);
  };

  if (!q || total === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-muted-foreground">No questions for this step.</p>
        <Button type="button" size="sm" onClick={onFinish} className="rounded-lg text-xs font-bold">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trivia-title"
    >
      <header className="flex shrink-0 items-center gap-2 border-b px-3 py-3 md:px-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close quiz"
        >
          {onClose ? <X className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <p id="trivia-title" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            <HelpCircle className="size-3.5 shrink-0" />
            {title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Question {qIdx + 1} of {total}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1" aria-hidden>
          {trivia.map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                i === qIdx && "bg-primary",
                i < qIdx && questionStates[i]?.isCorrect && "bg-emerald-500",
                i < qIdx && !questionStates[i]?.isCorrect && "bg-muted-foreground/40",
                i > qIdx && "bg-muted-foreground/25",
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 px-4 py-8 md:px-6 md:py-12">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                {qIdx + 1} / {total}
              </span>
              {q.type === "reflection" ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Reflection
                </span>
              ) : null}
            </div>
            <h2 className="font-heading text-xl font-bold leading-snug tracking-tight md:text-2xl">
              {q.question}
            </h2>
          </div>

          <div className="grid gap-2.5">
            {q.options?.map((opt, optIdx) => {
              const isSelected = state?.selected === optIdx;
              const isReflection = q.type === "reflection";
              const isCorrectOpt = isReflection ? true : q.answer === optIdx;
              let optStyle = "border-border/60 bg-card hover:bg-muted/40";

              if (state?.submitted) {
                if (isSelected) {
                  optStyle = isReflection
                    ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200 font-semibold"
                    : isCorrectOpt
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold"
                      : "border-destructive bg-destructive/10 text-destructive font-semibold";
                } else if (isCorrectOpt && !isReflection) {
                  optStyle = "border-emerald-500/50 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200";
                } else {
                  optStyle = "border-border/30 bg-card opacity-45";
                }
              } else if (isSelected) {
                optStyle = "border-primary bg-primary/5 text-primary font-semibold";
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelect(optIdx)}
                  disabled={state?.submitted}
                  className={cn(
                    "min-h-12 w-full rounded-xl border px-4 py-3 text-left text-sm transition-all active:scale-[0.99]",
                    optStyle,
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {state?.submitted ? (
            <div
              className={cn(
                "rounded-xl border p-3.5 text-sm leading-relaxed animate-in fade-in zoom-in-95 duration-200",
                q.type === "reflection"
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-100"
                  : state.isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100"
                    : "border-destructive/20 bg-destructive/5 text-destructive",
              )}
            >
              <h5 className="mb-1 flex items-center gap-1.5 text-xs font-bold">
                {q.type === "reflection" ? (
                  <>
                    <Lightbulb className="size-3.5" /> Reflection recorded
                  </>
                ) : state.isCorrect ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-600" /> Correct
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-3.5" /> Not quite
                  </>
                )}
              </h5>
              {q.explanation ? <p className="text-sm opacity-90">{q.explanation}</p> : null}
            </div>
          ) : null}

          {state?.submitted && !state.isCorrect && q.type !== "reflection" ? (
            <Button type="button" onClick={handleRetry} variant="outline" size="sm" className="w-fit rounded-lg text-xs font-bold">
              Try again
            </Button>
          ) : null}
        </div>
      </div>

      <footer className="shrink-0 border-t bg-background px-4 py-3 md:px-6">
        <div className="mx-auto grid w-full max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="justify-self-start">
            {onClose ? (
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="min-w-[6.5rem] rounded-lg text-xs font-bold">
                Exit quiz
              </Button>
            ) : (
              <span className="inline-block min-w-[6.5rem]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
            {qIdx + 1} / {total}
          </span>
          <div className="justify-self-end">
            <Button
              type="button"
              size="sm"
              disabled={!canAdvance}
              onClick={handleContinue}
              className="min-w-[6.5rem] rounded-lg text-xs font-bold gap-1"
            >
              {isLast ? (
                <>
                  Finish <CheckCircle2 className="size-3.5" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
