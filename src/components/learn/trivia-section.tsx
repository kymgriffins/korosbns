"use client";

import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { CheckCircle2, AlertCircle, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/utils";
import type { StageTrivia } from "@/types/learn";

interface TriviaSectionProps {
  trivia: StageTrivia[];
  stepId: number;
  stageId: number;
  currentStep: number;
  showTrivia: boolean;
  triviaSkipped: boolean;
  activeTriviaIdx: number;
  selectedTriviaAnswer: number | null;
  triviaSubmitted: boolean;
  reflectionText: string;
  selectedReflectionOption: string;
  onAnswerMCQ: (qIdx: number, selectedIdx: number, correctIdx: number) => void;
  onSubmitReflection: (qIdx: number) => void;
  onNextQuestion: () => void;
  onSkip: () => void;
  onResetMCQ: () => void;
  onReflectionOptionSelect: (opt: string) => void;
  onReflectionTextChange: (text: string) => void;
  isStepTriviaPassed: (stepId: number) => boolean;
}

export function TriviaSection({
  trivia,
  stepId,
  stageId,
  currentStep,
  showTrivia,
  triviaSkipped,
  activeTriviaIdx,
  selectedTriviaAnswer,
  triviaSubmitted,
  reflectionText,
  selectedReflectionOption,
  onAnswerMCQ,
  onSubmitReflection,
  onNextQuestion,
  onSkip,
  onResetMCQ,
  onReflectionOptionSelect,
  onReflectionTextChange,
  isStepTriviaPassed,
}: TriviaSectionProps) {
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

  if (triviaSkipped) {
    return (
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
        <HelpCircle className="size-5 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300">Trivia Skipped</h4>
          <p className="text-[10px] text-muted-foreground">You can retake this later. Tap Next to continue.</p>
        </div>
      </div>
    );
  }

  if (!showTrivia) return null;

  const q = trivia[activeTriviaIdx];
  if (!q) return null;

  return (
    <div className="space-y-4 border border-border bg-card rounded-2xl p-4 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-primary">
          <Sparkles className="size-4" />
          <span className="text-xs font-black uppercase tracking-wide">
            Quick Check {activeTriviaIdx + 1} of {trivia.length}
          </span>
        </div>
        <button onClick={onSkip} className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          Skip for now
        </button>
      </div>

      {q.type === "multiple-choice" ? (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-foreground leading-snug">{q.question}</h4>
          <div className="grid gap-2">
            {q.options?.map((opt, idx) => {
              const isSelected = selectedTriviaAnswer === idx;
              const isCorrect = q.answer === idx;
              let optStyle = "border-border bg-card hover:bg-muted/40";
              if (isSelected) {
                if (triviaSubmitted) {
                  optStyle = isCorrect
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border-destructive bg-destructive/10 text-destructive font-bold";
                } else {
                  optStyle = "border-primary bg-primary/5 text-primary font-bold";
                }
              } else if (triviaSubmitted && isCorrect) {
                optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
              }
              return (
                <button
                  key={idx}
                  onClick={() => onAnswerMCQ(activeTriviaIdx, idx, q.answer!)}
                  disabled={triviaSubmitted}
                  className={cn("w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]", optStyle)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {triviaSubmitted && (
            <div className={cn("p-3 rounded-xl border text-xs leading-normal animate-in zoom-in-95 duration-200",
              selectedTriviaAnswer === q.answer
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                : "border-destructive/20 bg-destructive/5 text-destructive"
            )}>
              <h5 className="font-bold flex items-center gap-1.5 mb-1">
                {selectedTriviaAnswer === q.answer ? <><CheckCircle2 className="size-4 text-emerald-600" /> Correct!⭐</> : <><AlertCircle className="size-4 text-destructive" /> Not quite—try again</>}
              </h5>
              <p>{q.explanation}</p>
            </div>
          )}
          {triviaSubmitted && (
            selectedTriviaAnswer === q.answer ? (
              <Button onClick={onNextQuestion} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5">
                {activeTriviaIdx < trivia.length - 1 ? <>Next Question <ArrowRight className="size-4" /></> : <>Complete Check <CheckCircle2 className="size-4" /></>}
              </Button>
            ) : (
              <Button onClick={onResetMCQ} variant="outline" className="w-full h-10 rounded-xl font-bold text-xs">
                Try Again
              </Button>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-foreground leading-snug">{q.question}</h4>
          {q.options && q.options.length > 0 && (
            <div className="grid gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onReflectionOptionSelect(opt)}
                  className={cn("w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all",
                    selectedReflectionOption === opt ? "border-primary bg-primary/5 text-primary font-bold" : "border-border bg-card hover:bg-muted/40"
                  )}
                  disabled={triviaSubmitted}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Reflection:</label>
            <Textarea
              placeholder={q.placeholder || "Enter your comment..."}
              value={selectedReflectionOption || reflectionText}
              onChange={(e) => { onReflectionTextChange(e.target.value); onReflectionOptionSelect(""); }}
              disabled={triviaSubmitted}
              className="rounded-xl text-xs min-h-[80px]"
            />
          </div>
          {!triviaSubmitted && (
            <Button onClick={() => onSubmitReflection(activeTriviaIdx)} className="w-full h-10 rounded-xl font-bold text-xs">
              Submit Reflection
            </Button>
          )}
          {triviaSubmitted && (
            <>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 text-xs">
                <h5 className="font-bold flex items-center gap-1.5 mb-1"><CheckCircle2 className="size-4 text-emerald-600" /> Reflection Logged</h5>
                <p>Your civic opinion has been recorded.</p>
              </div>
              <Button onClick={onNextQuestion} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5">
                {activeTriviaIdx < trivia.length - 1 ? <>Next Question <ArrowRight className="size-4" /></> : <>Complete Check <CheckCircle2 className="size-4" /></>}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
