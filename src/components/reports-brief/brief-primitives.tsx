"use client";

import { cn } from "@/utils";
import { formatKesBillions } from "@/lib/budget-format";
import type { CategoryBrief } from "@/lib/reports-brief";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function BriefAmount({
  billions,
  className,
}: {
  billions: number;
  className?: string;
}) {
  const label =
    billions >= 1000
      ? `KES ${(billions / 1000).toFixed(2)}T`
      : formatKesBillions(billions, { prefix: false });
  return (
    <span className={cn("font-heading text-2xl font-bold tabular-nums tracking-tight", className)}>
      {label}
    </span>
  );
}

export function ShareMeter({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted/60", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

export function BriefCard({
  brief,
  rank,
  defaultOpen = false,
}: {
  brief: CategoryBrief;
  rank?: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm",
        "bg-gradient-to-br",
        brief.accent,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
      >
        {rank != null ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-xs font-bold tabular-nums text-muted-foreground">
            {rank}
          </span>
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-heading text-base font-bold leading-snug">{brief.title}</h3>
            {brief.sharePct != null ? (
              <span className="shrink-0 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-bold tabular-nums text-foreground">
                {brief.sharePct.toFixed(1)}%
              </span>
            ) : null}
          </div>
          <BriefAmount billions={brief.amountBillions} className="text-xl sm:text-2xl" />
          {brief.sharePct != null ? <ShareMeter pct={brief.sharePct} /> : null}
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{brief.summary}</p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform mt-1",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-border/40 bg-background/60 px-4 pb-5 pt-4 sm:px-5">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
              Citizen takeaway
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{brief.takeaway}</p>
          </div>

          {brief.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {brief.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {brief.lines?.length ? (
            <ul className="space-y-2.5">
              {brief.lines.map((line) => {
                const max = brief.lines!.reduce((m, l) => Math.max(m, l.amountBillions), 0);
                const width = max > 0 ? (line.amountBillions / max) * 100 : 0;
                return (
                  <li key={line.label} className="space-y-1">
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="font-medium leading-snug text-foreground/90">{line.label}</span>
                      <span className="shrink-0 tabular-nums font-semibold text-muted-foreground">
                        {formatKesBillions(line.amountBillions, { prefix: false })}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-foreground/25"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    {line.note ? (
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{line.note}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function ChapterIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-2 pb-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
