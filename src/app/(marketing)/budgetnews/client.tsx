"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Newspaper, BookOpen, ChevronRight, Calendar, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { budgetNewsModulePath } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import type { BudgetNewsYear } from "@/lib/learn-hub";
import { BudgetNewsErrorBoundary } from "./error-boundary";

const YEARS_KEY = ["budget-news", "years"] as const;

function BudgetNewsContent() {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  const { data: yearsData, isLoading: yearsLoading, error: yearsError } = useQuery({
    queryKey: YEARS_KEY,
    queryFn: () => learnHubApi.budgetNewsYears(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.results || [],
  });

  const years = yearsData || [];

  useEffect(() => {
    if (!initialized && years.length > 0) {
      const current = years.find((y: BudgetNewsYear) => y.is_current);
      setSelectedLabel((current || years[0]).label);
      setInitialized(true);
    }
  }, [years, initialized]);

  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: [...YEARS_KEY, "modules", selectedLabel],
    queryFn: () => learnHubApi.budgetNewsModules({ fiscal_year_label: selectedLabel ?? undefined }),
    enabled: !!selectedLabel,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.results || [],
  });

  const selectedYear = years.find((y: BudgetNewsYear) => y.label === selectedLabel);

  if (yearsLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-9 w-56 bg-muted rounded-lg sm:h-10 sm:w-72" />
          <div className="h-4 w-full max-w-md bg-muted rounded sm:h-5 sm:max-w-96" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-8 w-24 bg-muted rounded-full" />)}
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
              <div className="aspect-[16/10] bg-muted sm:aspect-[16/10] lg:aspect-[5/3]" />
              <div className="min-w-0 space-y-3 p-4 sm:p-6 lg:p-8">
                <div className="h-4 w-24 bg-muted rounded-full" />
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (yearsError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-destructive">{(yearsError as Error).message}</p>
      </div>
    );
  }

  if (!years.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="text-center py-16">
          <Newspaper className="mx-auto size-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Budget News Yet</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Financial year analyses will appear here once published. Check back after the next budget reading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-xl shrink-0">
            <Newspaper className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Budget News</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mb-6 sm:mb-8">
          Yearly financial year analysis — comprehensive breakdowns of Kenya&apos;s national budget,
          sector allocations, revenue, and fiscal outlook across all fiscal years.
        </p>

        <YearTabs years={years} selectedLabel={selectedLabel} onSelect={(label) => setSelectedLabel(label)} />

        {modulesLoading ? (
          <div className="space-y-4 mt-6">
            <div className="animate-pulse overflow-hidden rounded-2xl border border-border/40">
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
                <div className="aspect-[16/10] bg-muted sm:aspect-[16/10]" />
                <div className="min-w-0 space-y-3 p-4 sm:p-6">
                  <div className="h-4 w-24 bg-muted rounded-full" />
                  <div className="h-6 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {modules.map((mod: CivicModule) => (
              <BudgetNewsCard key={mod.id} module={mod} selectedYear={selectedYear} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function YearTabs({ years, selectedLabel, onSelect }: { years: BudgetNewsYear[]; selectedLabel: string | null; onSelect: (label: string) => void }) {
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
          <span className={`text-[10px] ${selectedLabel === year.label ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
            {year.chapter_count}
          </span>
        </button>
      ))}
    </div>
  );
}

function BudgetNewsCard({ module: mod, selectedYear }: { module: CivicModule; selectedYear?: BudgetNewsYear | null }) {
  const chapterCount = mod.steps?.length || 0;
  const href = budgetNewsModulePath(mod.slug);
  const reportProfile = mod.metadata?.report as { fiscal_year?: string; theme?: string; kpis?: Array<{ label: string; value: number; trend?: string }> } | undefined;
  const kpis = reportProfile?.kpis?.slice(0, 3) || [];
  const theme = reportProfile?.theme || "";

  return (
    <Link href={href} className="block group">
      <article className="relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:bg-accent/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20 sm:text-xs">
              FY Analysis
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
              <Calendar className="size-3 shrink-0" />
              {selectedYear?.label || reportProfile?.fiscal_year || ""}
            </span>
          </div>

          <h2 className="mb-2 line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary sm:text-xl lg:text-2xl">
            {mod.title}
          </h2>

          {theme && (
            <p className="mb-3 text-xs italic text-muted-foreground/70">{theme}</p>
          )}

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {mod.description}
          </p>

          {kpis.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 sm:gap-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <span className="text-sm font-bold">{kpi.value >= 1000 ? `${(kpi.value / 1000).toFixed(1)}T` : `${kpi.value}B`}</span>
                  {kpi.trend === "up" && <TrendingUp className="size-3 text-green-500" />}
                  {kpi.trend === "down" && <TrendingDown className="size-3 text-red-500" />}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground sm:text-xs">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 shrink-0" />
              {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart3 className="size-3.5 shrink-0" />
              Sector analysis
            </span>
            <span className="ml-auto flex items-center gap-1 text-primary group-hover:gap-1.5 transition-all">
              View report <ChevronRight className="size-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BudgetNewsHomeClient() {
  return (
    <BudgetNewsErrorBoundary>
      <BudgetNewsContent />
    </BudgetNewsErrorBoundary>
  );
}