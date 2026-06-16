"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, BookOpen, ChevronRight, Calendar, BarChart3 } from "lucide-react";
import { budgetNewsModulePath } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import { BudgetNewsErrorBoundary } from "./error-boundary";
import { HarmonizedImage } from "@/components/ui/harmonized-image";

function BudgetNewsContent() {
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await learnHubApi.budgetNewsModules();
        if (!cancelled) setModules(data.results || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-9 w-56 bg-muted rounded-lg sm:h-10 sm:w-72" />
          <div className="h-4 w-full max-w-md bg-muted rounded sm:h-5 sm:max-w-96" />
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <div className="aspect-[16/10] bg-muted sm:aspect-[4/3]" />
              <div className="space-y-3 p-4 sm:p-6">
                <div className="h-4 w-24 bg-muted rounded-full" />
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <div className="aspect-[16/10] bg-muted sm:aspect-[4/3]" />
              <div className="space-y-3 p-4 sm:p-6">
                <div className="h-4 w-24 bg-muted rounded-full" />
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!modules.length) {
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
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mb-8 sm:mb-10">
          Yearly financial year analysis — comprehensive breakdowns of Kenya&apos;s national budget,
          sector allocations, revenue, and fiscal outlook. Each report is a deep dive into what the
          budget means for citizens.
        </p>

        <div className="space-y-6">
          {modules.map((mod) => (
            <BudgetNewsCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetNewsCard({ module: mod }: { module: CivicModule }) {
  const chapterCount = mod.steps?.length || 0;
  const href = budgetNewsModulePath(mod.slug);

  return (
    <Link href={href} className="block group">
      <article className="relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:bg-accent/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="relative min-w-0 overflow-hidden sm:border-r sm:border-border/60">
            <HarmonizedImage
              src={mod.image_url}
              alt={mod.title}
              aspectClassName="aspect-[16/10] sm:aspect-[4/3]"
              className="w-full rounded-none border-0"
              fallbackLabel="Module cover"
              imageClassName="group-hover:scale-105"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2.5 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20 sm:text-xs">
                    FY Analysis
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
                    <Calendar className="size-3 shrink-0" />
                    2026/27
                  </span>
                </div>
                <h2 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary sm:mb-3 sm:text-xl lg:text-2xl">
                  {mod.title}
                </h2>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:mb-4">
                  {mod.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground sm:gap-x-4 sm:gap-y-2 sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-3.5 shrink-0" />
                    {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 shrink-0" />
                    Sector analysis
                  </span>
                </div>
              </div>
              <div className="shrink-0 self-center">
                <div className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-background transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:size-10">
                  <ChevronRight className="size-4 sm:size-5" />
                </div>
              </div>
            </div>
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
