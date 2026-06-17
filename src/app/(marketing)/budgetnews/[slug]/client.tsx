"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/button";
import { budgetNewsChapterPath, budgetNewsModulePath, Routes } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import type { BudgetNewsYear } from "@/lib/learn-hub";
import { YearTabs } from "@/components/budget-news/year-tabs";
import { BudgetNewsErrorBoundary } from "../error-boundary";
import { resolveReportProfile } from "@/lib/budget-report-data";
import {
  BudgetModuleReportOverview,
  BudgetReportHero,
  BudgetReportToc,
  ReportSectionToc,
  MobileSectionToc,
} from "@/components/budget-news/report-blocks";

function DetailContent({ slug }: { slug: string }) {
  const { data: mod, isLoading: modLoading, error: modError } = useQuery({
    queryKey: ["budget-news", "module", slug],
    queryFn: () => learnHubApi.budgetNewsModule(slug),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const { data: yearsData } = useQuery({
    queryKey: ["budget-news", "years"],
    queryFn: () => learnHubApi.budgetNewsYears(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.results || [],
  });

  const years: BudgetNewsYear[] = yearsData || [];

  if (modLoading) {
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

  if (modError || !mod) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link href={Routes.BudgetNews} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Budget News
        </Link>
        <p className="text-destructive mt-4">{modError ? (modError as Error).message : "Module not found"}</p>
      </div>
    );
  }

  const chapters = mod.steps || [];
  const report = resolveReportProfile(mod.metadata);

  const currentYearIndex = years.findIndex((y) => y.module_slug === slug);
  const currentYear = currentYearIndex >= 0 ? years[currentYearIndex] : null;
  const prevYear = currentYearIndex > 0 ? years[currentYearIndex - 1] : null;
  const nextYear = currentYearIndex < years.length - 1 ? years[currentYearIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Link
              href={Routes.BudgetNews}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Budget News
            </Link>
          </div>

          <div className="mb-6">
            <YearTabs
              years={years}
              selectedLabel={currentYear?.label ?? null}
              onSelect={(label) => {
                const target = years.find((y) => y.label === label);
                if (target) window.location.href = budgetNewsModulePath(target.module_slug);
              }}
            />
          </div>

          {report ? (
            <BudgetReportHero title={mod.title} description={mod.description} report={report} imageUrl={mod.image_url} />
          ) : (
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                  FY Analysis
                </span>
                <span className="text-xs text-muted-foreground">{mod.fiscal_year_label || ""}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{mod.title}</h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                {mod.description}
              </p>
            </div>
          )}

          <MobileSectionToc />

          {report ? <BudgetModuleReportOverview report={report} /> : null}

          <section className="mt-10">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-5">
              <BookOpen className="size-4" />
              {chapters.length > 0 ? `${chapters.length} ${chapters.length === 1 ? "Chapter" : "Chapters"}` : "No chapters yet"}
            </div>

            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div key={chapter.id}>
                  {chapter.article_slug ? (
                    <Link
                      href={budgetNewsChapterPath(slug, chapter.article_slug)}
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

          {prevYear && (
            <div className="mt-10 border-t border-border/40 pt-6">
              <div className="flex items-center justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={budgetNewsModulePath(prevYear.module_slug)}>
                    <ChevronLeft className="size-4 mr-1" />
                    {prevYear.label} Budget
                  </Link>
                </Button>
                {nextYear && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={budgetNewsModulePath(nextYear.module_slug)}>
                      {nextYear.label} Budget
                      <ChevronRight className="size-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 text-center lg:hidden">
            <Button asChild variant="outline">
              <Link href={Routes.BudgetNews}>
                <ArrowLeft className="size-4 mr-2" />
                All Budget News
              </Link>
            </Button>
          </div>
        </div>

        {(chapters.length > 0 || report) && (
          <aside className="hidden space-y-8 lg:block">
            {report ? <ReportSectionToc /> : null}
            {chapters.length > 0 ? <BudgetReportToc chapters={chapters} slug={slug} /> : null}
            {years.length > 1 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Other Fiscal Years
                </h4>
                <div className="space-y-1">
                  {years.map((year) => (
                    <Link
                      key={year.label}
                      href={budgetNewsModulePath(year.module_slug)}
                      className={`block rounded-lg px-3 py-2 text-xs transition-colors ${
                        year.module_slug === slug
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {year.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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