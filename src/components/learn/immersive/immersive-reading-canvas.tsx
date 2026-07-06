"use client";

import { renderContent } from "@/lib/render-content";
import type { ChapterStep } from "@/types/learn";

export function ImmersiveReadingCanvas({ step, durationLabel }: { step: ChapterStep; durationLabel?: string }) {
  return (
    <article className="mx-auto max-w-2xl px-5 pb-8 pt-2">
      <header className="mb-6 space-y-2">
        <p className="text-[13px] font-medium uppercase tracking-wide text-primary">Reading</p>
        <h1 className="text-[length:var(--immersive-title)] font-semibold leading-tight tracking-tight">
          {step.title}
        </h1>
        {durationLabel ? (
          <p className="text-[13px] text-muted-foreground">{durationLabel} read</p>
        ) : null}
      </header>

      {step.learning_outcomes && step.learning_outcomes.length > 0 ? (
        <section className="mb-6 rounded-[var(--immersive-radius)] bg-primary/5 p-4 ring-1 ring-primary/10">
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-primary">
            You will learn
          </h2>
          <ul className="space-y-2">
            {step.learning_outcomes.map((o) => (
              <li key={o.id} className="text-[15px] leading-snug text-foreground/90">
                {o.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {step.image_urls?.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url + i}
          src={url}
          alt=""
          className="mb-6 w-full rounded-[var(--immersive-radius)] object-cover ring-1 ring-border/30"
          loading="lazy"
        />
      ))}

      <div className="immersive-prose max-w-none">{renderContent(step.text)}</div>

      {step.takeaways?.length > 0 ? (
        <section className="mt-8 rounded-[var(--immersive-radius)] border border-border/60 bg-card p-5">
          <h2 className="mb-3 text-[15px] font-semibold">Key takeaways</h2>
          <ul className="space-y-3">
            {step.takeaways.map((t, i) => (
              <li key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                {t.title ? <span className="font-semibold text-foreground">{t.title}: </span> : null}
                {t.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {step.transcript ? (
        <details className="mt-6 rounded-[var(--immersive-radius)] border border-border/50 bg-muted/30">
          <summary className="cursor-pointer px-4 py-3 text-[15px] font-medium">Transcript</summary>
          <p className="border-t px-4 py-3 text-[15px] leading-relaxed text-muted-foreground">
            {step.transcript}
          </p>
        </details>
      ) : null}
    </article>
  );
}
