"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, BookOpen, ChevronRight, Calendar, BarChart3 } from "lucide-react";
import { budgetNewsModulePath } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import { BudgetNewsErrorBoundary } from "./error-boundary";

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
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 bg-muted rounded-lg" />
          <div className="h-5 w-96 bg-muted rounded" />
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Newspaper className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Budget News</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mb-10">
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
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:bg-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                  FY Analysis
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  2026/27
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors mb-3">
                {mod.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                {mod.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-3.5" />
                  Sector analysis
                </span>
              </div>
            </div>
            <div className="shrink-0 self-center">
              <div className="size-10 rounded-full border border-border/60 bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                <ChevronRight className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
