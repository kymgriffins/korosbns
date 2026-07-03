"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";
import { readProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";

export function DossierJourneyTimeline({ stages }: { stages: CivicModule[] }) {
  if (!stages.length) return null;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 md:p-5">
      <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--learn-seal-gold)]">
        Fiscal-year journey
      </h3>
      <ol className="relative space-y-0">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/60" aria-hidden />
        {stages.map((stage) => {
          const p = readProgress(stage.slug, stage.order);
          const total = stage.steps?.length ?? 0;
          const completed = total
            ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length
            : 0;
          const isComplete = p.masteryAwarded || (total > 0 && completed >= total);
          const currentStep = p.currentStep || 1;
          const stepTitle = stage.steps?.[currentStep - 1]?.title;

          return (
            <li key={stage.slug} className="relative flex gap-3 pb-4 last:pb-0">
              <span className="relative z-[1] mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border bg-background">
                {isComplete ? (
                  <CheckCircle2 className="size-4 text-[var(--learn-vote-green)]" />
                ) : completed > 0 ? (
                  <span className="flex size-4 items-center justify-center rounded-full border-2 border-[var(--learn-seal-gold)] bg-[var(--learn-seal-gold)]/15 text-[7px] font-black text-[var(--learn-seal-gold)]">
                    S
                  </span>
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/30" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/learn/modules/${stage.slug}`}
                  className="text-sm font-bold hover:text-primary"
                >
                  {stage.title}
                </Link>
                <p className="text-[10px] text-muted-foreground">
                  {isComplete
                    ? `Completed · ${total} steps filed`
                    : completed > 0
                      ? `Step ${currentStep} of ${total}${stepTitle ? ` — ${stepTitle}` : ""}`
                      : "Not yet opened"}
                </p>
                {completed > 0 && !isComplete && total > 0 && (
                  <div className="mt-1.5 h-0.5 max-w-[8rem] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[var(--learn-vote-green)]"
                      style={{ width: `${Math.round((completed / total) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
