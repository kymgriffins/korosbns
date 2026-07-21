"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/utils";
import type { TriviaQuestionApi } from "@/lib/api-client";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { Routes } from "@/constants/routes";

export function ImmersiveStandaloneQuiz({
  slug,
  title,
  questions,
  questionNumber,
}: {
  slug: string;
  title: string;
  questions: TriviaQuestionApi[];
  questionNumber: number;
}) {
  const router = useRouter();
  const qIndex = questionNumber - 1;
  const question = questions[qIndex];
  const total = questions.length;

  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  if (!question) {
    router.replace(`/learn/${slug}/quiz/1`);
    return null;
  }

  const options = question.options ?? [];
  const correctIndex = question.correct_index ?? 0;

  const submit = (optIdx: number) => {
    if (submitted) return;
    const isCorrect = optIdx === correctIndex;
    setSelected(optIdx);
    setSubmitted(true);
    setCorrect(isCorrect);
  };

  const retry = () => {
    setSelected(null);
    setSubmitted(false);
    setCorrect(false);
  };

  const canAdvance = submitted && correct;
  const isLast = questionNumber >= total;

  return (
    <div className="learn-immersive fixed inset-0 z-50 flex flex-col bg-background">
      <ImmersiveChrome
        backHref={Routes.LearnQuests}
        title={title}
        subtitle={`Question ${questionNumber} of ${total}`}
        progress={{ current: questionNumber, total }}
      />
      <div className="mx-auto w-full max-w-lg flex-1 px-5 py-6">
        <h1 className="text-[length:var(--immersive-title)] font-semibold leading-snug tracking-tight">
          {question.question_text}
        </h1>
        <div className="mt-8 space-y-3">
          {options.map((opt, optIdx) => {
            const picked = selected === optIdx;
            let style = "border-border/60 bg-card hover:bg-muted/40";
            if (submitted) {
              if (picked) {
                style = correct
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-destructive/50 bg-destructive/10";
              } else if (optIdx === correctIndex) {
                style = "border-emerald-500/40 bg-emerald-500/5";
              } else {
                style = "opacity-50";
              }
            }
            return (
              <button
                key={optIdx}
                type="button"
                disabled={submitted}
                onClick={() => submit(optIdx)}
                className={cn(
                  "immersive-option w-full border px-4 py-3.5 text-left text-[16px] font-medium",
                  style,
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {submitted ? (
          <div
            className={cn(
              "mt-6 rounded-[var(--immersive-radius)] border p-4 text-[15px]",
              correct ? "border-emerald-500/25 bg-emerald-500/5" : "border-destructive/25 bg-destructive/5",
            )}
          >
            <p className="flex items-center gap-2 font-semibold">
              {correct ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-600" /> Correct
                </>
              ) : (
                <>
                  <AlertCircle className="size-4 text-destructive" /> Try again
                </>
              )}
            </p>
            {question.explanation ? (
              <p className="mt-2 text-muted-foreground">{question.explanation}</p>
            ) : null}
            {!correct ? (
              <button type="button" onClick={retry} className="mt-3 text-[14px] font-semibold text-primary">
                Choose another answer
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <ImmersiveBottomBar
        prevHref={
          questionNumber > 1 ? `/learn/${slug}/quiz/${questionNumber - 1}` : undefined
        }
        nextHref={
          canAdvance && !isLast ? `/learn/${slug}/quiz/${questionNumber + 1}` : undefined
        }
        nextLabel={isLast ? "Finish quiz" : "Next question"}
        nextDisabled={!canAdvance}
        onNext={canAdvance && isLast ? () => router.push(Routes.LearnQuests) : undefined}
      />
    </div>
  );
}
