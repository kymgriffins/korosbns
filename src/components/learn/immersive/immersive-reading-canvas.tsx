"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import { renderContent } from "@/lib/render-content";
import { applyLearnGlossary } from "@/lib/learn-glossary";
import type { ChapterStep } from "@/types/learn";

export function ImmersiveReadingCanvas({
  step,
  durationLabel,
  stepNumber = 1,
}: {
  step: ChapterStep;
  durationLabel?: string;
  stepNumber?: number;
}) {
  return (
    <article className="mx-auto max-w-lg px-4 py-6 space-y-6">
      <header className="space-y-3 border-b border-border/40 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Lesson {String(stepNumber).padStart(2, "0")}
        </p>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
          {step.title}
        </h1>
        {step.article_summary ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{step.article_summary}</p>
        ) : null}
        {durationLabel ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {durationLabel}
          </p>
        ) : null}
      </header>

      {step.learning_outcomes && step.learning_outcomes.length > 0 ? (
        <section className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            You will learn
          </h2>
          <ul className="space-y-2">
            {step.learning_outcomes.map((o) => (
              <li
                key={o.id}
                className="flex items-start gap-2 text-sm text-muted-foreground leading-snug"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{o.description}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="immersive-prose prose dark:prose-invert max-w-none text-foreground/90">
        {renderContent(step.text, { transformHtml: applyLearnGlossary })}
      </div>

      {step.takeaways && step.takeaways.length > 0 ? (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Key takeaways
          </h2>
          <ul className="space-y-2">
            {step.takeaways.map((t, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground/90">
                {t.title ? <strong>{t.title}: </strong> : null}
                {t.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {step.transcript ? (
        <details className="rounded-2xl border border-border/50 bg-card text-sm">
          <summary className="cursor-pointer px-4 py-3 font-medium text-muted-foreground">
            Full transcript
          </summary>
          <p className="border-t border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            {step.transcript}
          </p>
        </details>
      ) : null}
    </article>
  );
}
