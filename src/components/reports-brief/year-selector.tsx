"use client";

import { cn } from "@/utils";
import {
  BUDGET_YEARS,
  statusLabel,
  type BudgetYearEntry,
} from "@/data/budget-years-catalogue";
import type { YearVerificationStatus } from "@/lib/budget-sources";

const STATUS_CHIP: Record<YearVerificationStatus, string> = {
  IN_APP: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  TESTED_TRUE: "bg-primary/15 text-primary",
  PARTIAL: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  SOURCE_LISTED: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
  GAP: "bg-muted text-muted-foreground",
};

export function YearSelector({
  selectedId,
  onSelect,
  years = BUDGET_YEARS,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  years?: BudgetYearEntry[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Fiscal year episode
        </p>
        <p className="text-[10px] text-muted-foreground">
          {years.length} years · honesty labels
        </p>
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        role="listbox"
        aria-label="Select fiscal year"
      >
        {years.map((y) => {
          const active = selectedId === y.id;
          return (
            <button
              key={y.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(y.id)}
              className={cn(
                "shrink-0 rounded-2xl border px-3 py-2 text-left transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/50 bg-muted/40 text-foreground hover:bg-muted",
              )}
            >
              <span className="block text-xs font-bold tabular-nums">{y.id}</span>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                  active ? "bg-background/20 text-background" : STATUS_CHIP[y.status],
                )}
              >
                {statusLabel(y.status)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
