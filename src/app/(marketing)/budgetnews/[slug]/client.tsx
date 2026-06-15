"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import { BudgetNewsErrorBoundary } from "../error-boundary";
import { resolveReportProfile } from "@/lib/budget-report-data";
import {
  BudgetModuleReportOverview,
  BudgetReportHero,
  BudgetReportToc,
} from "@/components/budget-news/report-blocks";

function DetailContent({ slug }: { slug: string }) {
  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await learnHubApi.budgetNewsModule(slug);
        if (!cancelled) setMod(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded-lg" />
          <div className="h-5 w-full bg-muted rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link href={Routes.BudgetNews} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Budget News
        </Link>
        <p className="text-destructive mt-4">{error || "Module not found"}</p>
      </div>
    );
  }

  const chapters = mod.steps || [];
  const report = resolveReportProfile(mod.metadata);
  const fiscalYear = report?.fiscal_year ?? "2026/27";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
        <div>
        <Link
          href={Routes.BudgetNews}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Budget News
        </Link>

        {report ? (
          <BudgetReportHero title={mod.title} description={mod.description} report={report} />
        ) : (
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                FY Analysis
              </span>
              <span className="text-xs text-muted-foreground">{fiscalYear}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{mod.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              {mod.description}
            </p>
          </div>
        )}

        {report ? <BudgetModuleReportOverview report={report} /> : null}

        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-5">
            <BookOpen className="size-4" />
            {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
          </div>

          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div key={chapter.id}>
                {chapter.article_slug ? (
                  <Link
                    href={Routes.BudgetNewsChapter(slug, chapter.article_slug)}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 hover:bg-accent/30 hover:border-primary/30 transition-all duration-200">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary group-hover:bg-primary/15 transition-colors">
                        {chapter.order}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          Read the full sector analysis
                        </p>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 opacity-60">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                      {chapter.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{chapter.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center lg:hidden">
          <Button asChild variant="outline">
            <Link href={Routes.BudgetNews}>
              <ArrowLeft className="size-4 mr-2" />
              All Budget News
            </Link>
          </Button>
        </div>
        </div>

        {chapters.length > 0 && (
          <aside className="hidden lg:block">
            <BudgetReportToc chapters={chapters} slug={slug} />
          </aside>
        )}
      </div>
    </div>
  );
}

export function BudgetNewsDetailClient({ slug }: { slug: string }) {
  return (
    <BudgetNewsErrorBoundary>
      <DetailContent slug={slug} />
    </BudgetNewsErrorBoundary>
  );
}
