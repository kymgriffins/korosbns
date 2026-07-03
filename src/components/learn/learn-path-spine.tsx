"use client";

import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/utils";
import { readProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";

export function LearnPathSpine({ stages }: { stages: CivicModule[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3 bottom-3 w-px bg-border/60 md:left-1/2 md:-translate-x-px" aria-hidden />
      <ol className="space-y-3">
        {stages.map((stage, idx) => {
          const p = readProgress(stage.slug, stage.order);
          const total = stage.steps?.length ?? 0;
          const completed = total
            ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length
            : 0;
          const isComplete = p.masteryAwarded || (total > 0 && completed >= total);
          const isStarted = completed > 0 && !isComplete;
          const locked = idx > 0 && !readProgress(stages[idx - 1].slug, stages[idx - 1].order).masteryAwarded;

          return (
            <li key={stage.slug} className="relative flex md:odd:flex-row md:even:flex-row-reverse">
              <div className="absolute left-4 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border bg-background md:left-1/2">
                {isComplete ? (
                  <CheckCircle2 className="size-4 text-[var(--learn-vote-green)]" />
                ) : locked ? (
                  <Lock className="size-3.5 text-muted-foreground" />
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground">{idx + 1}</span>
                )}
              </div>
              <Link
                href={locked ? "#" : `/learn/modules/${stage.slug}`}
                onClick={locked ? (e) => e.preventDefault() : undefined}
                className={cn(
                  "ml-10 flex-1 rounded-xl border p-3 transition-colors md:ml-0 md:max-w-[calc(50%-2rem)]",
                  locked && "pointer-events-none opacity-50",
                  isComplete && "border-[var(--learn-vote-green)]/30 bg-[var(--learn-vote-green)]/5",
                  isStarted && "border-[var(--learn-seal-gold)]/30",
                  !locked && "hover:border-primary/30 hover:bg-muted/30",
                  idx % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {stage.badgeName || stage.documentName || "Module"}
                </p>
                <h3 className="text-sm font-bold leading-snug">{stage.title}</h3>
                {total > 0 && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {completed}/{total} steps
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
