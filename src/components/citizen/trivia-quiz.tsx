"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { citizenApi, type TriviaSetApi } from "@/lib/api-client";

export function TriviaQuiz({ trivia }: { trivia: TriviaSetApi }) {
  const { isLoggedIn } = useAuth();
  const questions = (trivia.questions || []).slice().sort((a, b) => a.order - b.order);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; streak_count?: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    { display_name?: string; score?: number; rank?: number }[]
  >([]);

  const setChoice = (questionId: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const loadLeaderboard = async () => {
    try {
      const data = await citizenApi.getTriviaLeaderboard(trivia.id);
      setLeaderboard(data.results || []);
    } catch {
      setLeaderboard([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Sign in with an active membership to play trivia.");
      return;
    }
    for (const q of questions) {
      if (answers[q.id] === undefined) {
        toast.error("Please answer all questions.");
        return;
      }
    }
    setSubmitting(true);
    try {
      const res = await citizenApi.submitTriviaAttempt(trivia.id, answers, leaderboardOptIn);
      setResult(res);
      toast.success(`Score: ${res.score}`);
      void loadLeaderboard();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not submit attempt.";
      toast.error(msg);
      if (msg.toLowerCase().includes("membership")) {
        toast.info("Verify your email and ensure you have active org membership.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <p className="text-muted-foreground">
          Sign in with a verified account and active org membership to submit scored attempts.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/auth/login?next=/trivia/${trivia.id}`}>Sign in to play</Link>
        </Button>
        <Button type="button" variant="outline" className="mt-4 ml-2" onClick={() => void loadLeaderboard()}>
          View leaderboard
        </Button>
        {leaderboard.length > 0 && (
          <ol className="mt-6 text-left text-sm space-y-1">
            {leaderboard.map((row, i) => (
              <li key={i}>
                #{row.rank ?? i + 1} {row.display_name ?? "Player"} — {row.score ?? 0} pts
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold">Your score: {result.score}</h2>
          {result.streak_count != null && (
            <p className="mt-2 text-muted-foreground">Streak: {result.streak_count} days</p>
          )}
        </div>
        {leaderboard.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Leaderboard</h3>
            <ol className="space-y-2 text-sm">
              {leaderboard.map((row, i) => (
                <li key={i} className="flex justify-between border-b border-border/50 pb-2">
                  <span>
                    #{row.rank ?? i + 1} {row.display_name ?? "Player"}
                  </span>
                  <span>{row.score ?? 0} pts</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        <Button asChild variant="outline">
          <Link href="/trivia">More trivia</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((q, idx) => (
        <div key={q.id} className="space-y-3 rounded-xl border border-border p-6">
          <p className="font-medium">
            {idx + 1}. {q.question_text}
          </p>
          <RadioGroup
            value={answers[q.id] !== undefined ? String(answers[q.id]) : ""}
            onValueChange={(v) => setChoice(q.id, Number(v))}
          >
            {(q.options || []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <RadioGroupItem value={String(i)} id={`${q.id}-${i}`} />
                <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Checkbox
          id="lb-opt-in"
          checked={leaderboardOptIn}
          onCheckedChange={(c) => setLeaderboardOptIn(c === true)}
        />
        <Label htmlFor="lb-opt-in">Show my score on the public leaderboard</Label>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit answers"}
      </Button>
    </form>
  );
}
