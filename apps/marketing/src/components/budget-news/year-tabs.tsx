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
    <div className="flex flex-wrap items-center gap-2">
      {years.map((year) => (
        <button
          key={year.label}
          onClick={() => onSelect(year.label)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
            selectedLabel === year.label
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
          }`}
        >
          {year.is_current && (
            <span className="relative flex size-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${selectedLabel === year.label ? "bg-primary-foreground/60" : "bg-primary/40"}`} />
              <span className={`relative inline-flex size-2 rounded-full ${selectedLabel === year.label ? "bg-primary-foreground" : "bg-primary"}`} />
            </span>
          )}
          {year.label}
          {year.chapter_count > 0 && (
            <span className={`text-[10px] ${selectedLabel === year.label ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
              {year.chapter_count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}