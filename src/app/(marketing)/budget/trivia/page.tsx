"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, Flame, X, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  { q: "Which body approves the National Budget in Kenya?", opts: ["National Treasury", "Parliament", "The President", "County Governments"], correct: 1 },
  { q: "What is the Equalization Fund?", opts: ["A fund for equalizing taxes", "A fund to provide basic services to marginalized areas", "A fund for county staff salaries", "A fund for presidential projects"], correct: 1 },
  { q: "How many counties are there in Kenya?", opts: ["42", "45", "47", "50"], correct: 2 },
  { q: "What does 'Division of Revenue' mean?", opts: ["Splitting taxes between rich and poor", "Dividing national revenue between national and county governments", "Revenue from international trade", "Tax collection by counties"], correct: 1 },
  { q: "What is a Supplementary Budget?", opts: ["A budget for extra government staff", "A mid-year adjustment to the original budget", "A budget for education only", "A budget for emergencies only"], correct: 1 },
];

export default function BudgetTriviaPage() {
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const question = QUESTIONS[qIndex];
  const isCorrect = selected === question?.correct;

  const nextQuestion = useCallback(() => {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(15);
    } else {
      setFinished(true);
    }
  }, [qIndex]);

  useEffect(() => {
    if (!started || finished || selected !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { nextQuestion(); return 15; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, selected, nextQuestion, qIndex]);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#e8f5e9]">
          <Zap className="size-8 text-[#006d37]" />
        </div>
        <h1 className="text-xl font-bold text-[#020304]">Budget Trivia</h1>
        <p className="mt-2 text-sm text-[#5f6368]">Test your budget literacy skills. Answer 5 questions to earn XP and build your streak!</p>
        <button onClick={() => setStarted(true)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[#006d37] px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
        >
          Start Challenge <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#e8f5e9]">
          <CheckCircle2 className={cn("size-8", pct >= 60 ? "text-[#006d37]" : "text-[#f59e0b]")} />
        </div>
        <h1 className="text-xl font-bold text-[#020304]">Challenge Complete!</h1>
        <p className="mt-2 text-3xl font-bold text-[#006d37]">{score}/{QUESTIONS.length}</p>
        <p className="mt-1 text-sm text-[#5f6368]">{pct >= 80 ? "Excellent! You're a Budget Scholar!" : pct >= 60 ? "Good job! Keep learning!" : "Keep studying — you'll get it!"}</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => { setStarted(false); setQIndex(0); setSelected(null); setScore(0); setStreak(0); setFinished(false); setTimeLeft(15); }}
            className="rounded-xl border border-[#e1e4e8] bg-white px-4 py-2 text-xs font-semibold text-[#020304] transition-all active:scale-[0.98]"
          >
            Try Again
          </button>
          <a href="/budget/learn"
            className="inline-flex items-center gap-1 rounded-xl bg-[#006d37] px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]"
          >
            Learn More <ArrowRight className="size-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => { setStarted(false); setQIndex(0); setSelected(null); setScore(0); setStreak(0); setTimeLeft(15); }}
          className="flex size-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]"
        >
          <X className="size-4" />
        </button>
        {streak > 1 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fef7e0] px-2.5 py-0.5 text-xs font-semibold text-[#735c00]">
            <Flame className="size-3" />{streak} in a row!
          </span>
        )}
        <div className="flex items-center gap-2 text-xs text-[#5f6368]">
          <span className="font-medium text-[#020304]">{qIndex + 1}</span>/<span>{QUESTIONS.length}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className={cn("h-1.5 overflow-hidden rounded-full bg-[#e1e4e8]")}>
          <div className={cn("h-full rounded-full transition-all duration-1000", timeLeft <= 5 ? "bg-[#c5221f]" : "bg-[#006d37]")}
            style={{ width: `${(timeLeft / 15) * 100}%` }} />
        </div>
        <p className={cn("mt-1 text-center text-xs font-medium", timeLeft <= 5 ? "text-[#c5221f] animate-pulse" : "text-[#5f6368]")}>
          {timeLeft}s
        </p>
      </div>

      {/* Question */}
      <h2 className="mb-6 text-base font-semibold text-[#020304] text-center leading-relaxed">{question.q}</h2>

      {/* Options */}
      <div className="space-y-2.5">
        {question.opts.map((opt, i) => {
          const state = selected === null ? "default" : i === question.correct ? "correct" : i === selected ? "wrong" : "dimmed";
          return (
            <button key={i} onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.98]",
                state === "default" && "border-[#e1e4e8] bg-white text-[#020304] hover:border-[#006d37]/40 hover:bg-[#f1f3f4]",
                state === "correct" && "border-[#006d37] bg-[#e8f5e9] text-[#006d37] shadow-sm",
                state === "wrong" && "border-[#c5221f] bg-[#fce8e6] text-[#c5221f]",
                state === "dimmed" && "border-[#e1e4e8] bg-white text-[#5f6368]/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {state === "correct" && <CheckCircle2 className="size-4 text-[#006d37]" />}
                {state === "wrong" && <XCircle className="size-4 text-[#c5221f]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {selected !== null && (
        <div className="mt-6 text-center animate-fadeIn">
          <button onClick={nextQuestion}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#006d37] px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          >
            {qIndex < QUESTIONS.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
