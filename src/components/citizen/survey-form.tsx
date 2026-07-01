"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import {
  type SurveyDetailApi,
  type SurveyQuestionApi,
} from "@/lib/api-client";
import { useSubmitSurvey } from "@/hooks/use-surveys";

function QuestionField({
  q,
  value,
  onChange,
}: {
  q: SurveyQuestionApi;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (q.type === "text") {
    return (
      <Textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        required={q.is_required}
      />
    );
  }
  if (q.type === "boolean") {
    return (
      <RadioGroup
        value={value === true ? "yes" : value === false ? "no" : ""}
        onValueChange={(v) => onChange(v === "yes")}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${q.id}-yes`} />
          <Label htmlFor={`${q.id}-yes`}>Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${q.id}-no`} />
          <Label htmlFor={`${q.id}-no`}>No</Label>
        </div>
      </RadioGroup>
    );
  }
  if (q.type === "rating") {
    return (
      <Input
        type="number"
        min={1}
        max={10}
        value={value !== undefined ? String(value) : ""}
        onChange={(e) => onChange(Number(e.target.value))}
        required={q.is_required}
      />
    );
  }
  if (q.type === "multiple") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="space-y-2">
        {q.choices.map((choice) => (
          <div key={choice} className="flex items-center gap-2">
            <Checkbox
              id={`${q.id}-${choice}`}
              checked={selected.includes(choice)}
              onCheckedChange={(checked) => {
                onChange(
                  checked
                    ? [...selected, choice]
                    : selected.filter((c) => c !== choice),
                );
              }}
            />
            <Label htmlFor={`${q.id}-${choice}`}>{choice}</Label>
          </div>
        ))}
      </div>
    );
  }
  return (
    <RadioGroup
      value={String(value ?? "")}
      onValueChange={onChange}
      required={q.is_required}
    >
      {q.choices.map((choice) => (
        <div key={choice} className="flex items-center gap-2">
          <RadioGroupItem value={choice} id={`${q.id}-${choice}`} />
          <Label htmlFor={`${q.id}-${choice}`}>{choice}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export function SurveyForm({ survey }: { survey: SurveyDetailApi }) {
  const { isLoggedIn } = useAuth();
  const { mutateAsync: submitSurvey } = useSubmitSurvey();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const needsLogin = !survey.allow_anonymous && !isLoggedIn;

  const setAnswer = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsLogin) {
      toast.error("Please sign in to submit this survey.");
      return;
    }
    for (const q of survey.questions) {
      if (q.is_required && (answers[q.id] === undefined || answers[q.id] === "")) {
        toast.error(`Please answer: ${q.text}`);
        return;
      }
    }
    setSubmitting(true);
    try {
      const result = await submitSurvey({ id: survey.id, answers });
      setDone(true);
      toast.success("Survey submitted. Thank you!");
      if (result.response_id) {
        /* response_id available for support */
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <h2 className="text-xl font-semibold">Thank you!</h2>
        <p className="mt-2 text-muted-foreground">Your responses have been recorded.</p>
        <Button asChild className="mt-6">
          <Link href="/surveys">More surveys</Link>
        </Button>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <p className="text-muted-foreground">This survey requires a signed-in account.</p>
        <Button asChild className="mt-4">
          <Link href={`/auth/login?next=/surveys/${survey.id}`}>Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {survey.questions
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((q) => (
          <div key={q.id} className="space-y-3">
            <Label className="text-base font-medium">
              {q.text}
              {q.is_required ? <span className="text-destructive"> *</span> : null}
            </Label>
            <QuestionField q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
          </div>
        ))}
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Submitting…" : "Submit survey"}
      </Button>
    </form>
  );
}
