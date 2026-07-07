"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LmsTrivia } from "@/data/lms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

type TriviaSheetProps = {
  trivia: LmsTrivia;
  open: boolean;
  onClose: () => void;
  onAnswered?: (correct: boolean) => void;
};

export function TriviaSheet({ trivia, open, onClose, onAnswered }: TriviaSheetProps) {
  const [selected, setSelected] = useState<string | boolean | null>(null);
  const [fillValue, setFillValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const submit = () => {
    let correct = false;
    if (trivia.type === "true_false") {
      correct = selected === trivia.answer;
    } else if (trivia.type === "multiple_choice") {
      correct = selected === trivia.answer;
    } else if (trivia.type === "fill_blank") {
      correct = fillValue.trim().toLowerCase() === String(trivia.answer).toLowerCase();
    }
    setFeedback(correct ? "correct" : "incorrect");
    onAnswered?.(correct);
  };

  const handleContinue = () => {
    setSelected(null);
    setFillValue("");
    setFeedback(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-border/60 bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl md:mx-auto md:max-w-lg"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Quick trivia</p>
            <h3 className="mb-4 text-lg font-semibold">{trivia.prompt}</h3>

            {trivia.type === "multiple_choice" && trivia.options ? (
              <div className="space-y-2">
                {trivia.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => setSelected(option)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      selected === option
                        ? "border-primary bg-primary/10"
                        : "border-border/60 hover:bg-muted/40",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {trivia.type === "true_false" ? (
              <div className="grid grid-cols-2 gap-2">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => setSelected(value)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      selected === value
                        ? "border-primary bg-primary/10"
                        : "border-border/60 hover:bg-muted/40",
                    )}
                  >
                    {value ? "True" : "False"}
                  </button>
                ))}
              </div>
            ) : null}

            {trivia.type === "fill_blank" ? (
              <Input
                value={fillValue}
                onChange={(e) => setFillValue(e.target.value)}
                placeholder="Your answer"
                disabled={feedback !== null}
              />
            ) : null}

            {feedback ? (
              <p
                className={cn(
                  "mt-4 rounded-xl px-4 py-3 text-sm",
                  feedback === "correct"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {feedback === "correct" ? "Correct! " : "Not quite. "}
                {trivia.explanation}
              </p>
            ) : null}

            <div className="mt-5 flex gap-2">
              {feedback ? (
                <Button className="flex-1" onClick={handleContinue}>
                  Continue
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={submit}
                  disabled={
                    (trivia.type === "fill_blank" && !fillValue.trim()) ||
                    (trivia.type !== "fill_blank" && selected === null)
                  }
                >
                  Check answer
                </Button>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
