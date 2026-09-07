"use client";

import type { BudgetNewsYear } from "@/lib/learn-hub";

export function YearTabs({
  years,
  selectedLabel,
  onSelect,
}: {
  years: BudgetNewsYear[];
  selectedLabel: string | null;
  onSelect: (label: string) => void;
}) {
  if (!years.length) return null;
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 sm:flex-wrap">
      {years.map((year) => (
        <button
          key={year.label}
          type="button"
          onClick={() => onSelect(year.label)}
          aria-pressed={selectedLabel === year.label}
          className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            selectedLabel === year.label
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
          }`}
        >
          {year.is_current && (
            <span className="relative flex size-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${selectedLabel === year.label ? "bg-primary-foreground/60" : "bg-primary/40"}`} />
              <span className={`relative inline-flex size-2 rounded-full ${selectedLabel === year.label ? "bg-primary-foreground" : "bg-primary"}`} />
            </span>
          )}
          <span>{year.label}</span>
          {year.chapter_count > 0 && (
            <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-mono ${selectedLabel === year.label ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {year.chapter_count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}