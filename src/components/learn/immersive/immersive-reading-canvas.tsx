"use client";

import Link from "next/link";
import { BookOpen, Clapperboard, Clock, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { renderContent } from "@/lib/render-content";
import { applyLearnGlossary } from "@/lib/learn-glossary";
import { parseStepVideos } from "@/lib/immersive-module";
import type { ChapterStep } from "@/types/learn";

export function ImmersiveReadingCanvas({
  step,
  durationLabel,
  moduleSlug,
  stepNumber = 1,
}: {
  step: ChapterStep;
  durationLabel?: string;
  moduleSlug?: string;
  stepNumber?: number;
}) {
  const videos = parseStepVideos(step);
  const heroImage = step.image_urls?.[0];

  return (
    <article className="mx-auto max-w-3xl px-5 py-6 space-y-8">
      {/* Specimen Header */}
      <header className="space-y-4 border-b border-foreground/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              ARTICLE SPECIMEN
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border border-foreground/10 bg-muted/40 text-foreground">
              CIVIC LITERACY DESK
            </span>
          </div>
          {durationLabel ? (
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 border border-foreground/10 rounded-md px-2 py-0.5 bg-muted/20">
              <Clock className="size-3 text-primary" />
              <span>{durationLabel} read</span>
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="font-serif italic text-2xl sm:text-3xl text-primary font-normal">
              Lesson {String(stepNumber).padStart(2, "0")};
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-[1.15]">
              {step.title}
            </h1>
          </div>
          {step.article_summary ? (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
              {step.article_summary}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground pt-1">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="size-3.5" /> PFM Act § 25 · Art. 201 Verified
          </span>
          <span>·</span>
          <span>Budget Ndio Story Research Series</span>
        </div>
      </header>

      {/* Companion Video Series Callout Banner (if step has videos) */}
      {videos.length > 0 && moduleSlug ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-card/60 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt=""
                className="size-16 sm:size-20 rounded-xl object-cover ring-1 ring-foreground/10 shrink-0"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Clapperboard className="size-6" />
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Companion Video Series ({videos.length} Parts)
              </p>
              <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                Watch the companion visual breakdown on YouTube
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                High-definition visual explanations &amp; podcast discussions
              </p>
            </div>
          </div>

          <Link
            href={`/learn/modules/${moduleSlug}/watch/${stepNumber}`}
            className="shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-xs"
          >
            <span>Watch Video Mode</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : null}

      {/* Learning Outcomes Specimen Card */}
      {step.learning_outcomes && step.learning_outcomes.length > 0 ? (
        <section className="rounded-2xl border border-foreground/10 bg-muted/20 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Core Civic Learning Outcomes
            </h2>
          </div>
          <ul className="space-y-2">
            {step.learning_outcomes.map((o) => (
              <li key={o.id} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground leading-snug">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{o.description}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Main Narrative Markdown Prose */}
      <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-sm sm:text-base border-t border-foreground/10 pt-6">
        {renderContent(step.text, { transformHtml: applyLearnGlossary })}
      </div>

      {/* Key Takeaways Section */}
      {step.takeaways && step.takeaways.length > 0 ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-mono font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4 text-primary" />
            <h2>Key Citizen Takeaways</h2>
          </div>
          <ul className="space-y-3">
            {step.takeaways.map((t, i) => (
              <li key={i} className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                {t.title ? <strong className="font-bold text-foreground">{t.title}: </strong> : null}
                {t.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Collapsible Transcript */}
      {step.transcript ? (
        <details className="rounded-2xl border border-foreground/10 bg-card/60 overflow-hidden text-xs">
          <summary className="cursor-pointer px-5 py-3 font-mono font-semibold text-muted-foreground hover:text-foreground">
            View Full Lesson Transcript
          </summary>
          <p className="border-t border-foreground/10 px-5 py-4 leading-relaxed text-muted-foreground font-mono text-xs">
            {step.transcript}
          </p>
        </details>
      ) : null}
    </article>
  );
}
