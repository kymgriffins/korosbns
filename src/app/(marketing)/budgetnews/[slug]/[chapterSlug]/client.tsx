"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/button";
import { budgetNewsChapterPath, budgetNewsModulePath, Routes } from "@/constants/routes";
import { learnHubApi, type BudgetNewsYear } from "@/lib/learn-hub";
import type { ChapterStep } from "@/types/learn";
import { YearTabs } from "@/components/budget-news/year-tabs";
import { BudgetNewsErrorBoundary } from "../../error-boundary";
import { resolveChapterReport } from "@/lib/budget-report-data";
import {
  BudgetArticleBody,
  BudgetChapterReportBlocks,
  BudgetReportToc,
  getArticleHeadings,
  ArticleSectionToc,
  MobileArticleToc,
} from "@/components/budget-news/report-blocks";

function ChapterContent({
  slug,
  chapterSlug,
}: {
  slug: string;
  chapterSlug: string;
}) {
  const { data: mod, isLoading, error } = useQuery({
    queryKey: ["budget-news", "module", slug],
    queryFn: () => learnHubApi.budgetNewsModule(slug),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const chapters = (mod?.steps || []) as ChapterStep[];
  const idx = chapters.findIndex((c) => c.article_slug === chapterSlug);
  const chapter = idx >= 0 ? chapters[idx] : null;
  const prevChapter = idx > 0 ? chapters[idx - 1] : null;
  const nextChapter = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded-lg" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapter || !mod) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href={Routes.BudgetNews}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Budget News
        </Link>
        <p className="text-destructive mt-4">{error ? (error as Error).message : "Chapter not found"}</p>
      </div>
    );
  }

  const { data: yearsData } = useQuery({
    queryKey: ["budget-news", "years"],
    queryFn: () => learnHubApi.budgetNewsYears(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.results || [],
  });

  const years: BudgetNewsYear[] = yearsData || [];
  const currentYearEntry = years.find((y) => y.module_slug === slug);

  const chapterReport = resolveChapterReport(chapter.report);
  const reportProfile = mod.metadata?.report as { fiscal_year?: string; fiscal_year_previous?: string } | undefined;
  const fiscalYear = reportProfile?.fiscal_year ?? "2026/27";
  const fiscalYearPrevious = reportProfile?.fiscal_year_previous;
  const articleHeadings = getArticleHeadings(chapter.text || "");

  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
        <div>
        <Link
          href={budgetNewsModulePath(slug)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to {mod.title}
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <YearTabs
            years={years}
            selectedLabel={currentYearEntry?.label ?? null}
            onSelect={(label) => {
              const target = years.find((y) => y.label === label);
              if (target) window.location.href = budgetNewsModulePath(target.module_slug);
            }}
          />
          <a
            href="https://bnske.budgetndiostory.org/admin/ke-budget/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shrink-0"
          >
            <Settings className="size-3" />
            Manage Budget
          </a>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
              Sector Analysis
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" />
              FY{fiscalYear}
            </span>
            <span className="text-xs text-muted-foreground">
              Chapter {chapter.order}{mod.steps?.length ? ` of ${mod.steps.length}` : ""}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{chapter.title}</h1>

          <BudgetChapterReportBlocks
            report={chapterReport}
            previousLabel={fiscalYearPrevious ? `FY${fiscalYearPrevious}` : undefined}
            currentLabel={`FY${fiscalYear}`}
          />

          <MobileArticleToc headings={articleHeadings} />

          <BudgetArticleBody text={chapter.text || ""} imageUrls={chapter.image_urls} />
        </div>

        <nav className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-border/60">
          <div>
            {prevChapter ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link
                  href={budgetNewsChapterPath(slug, prevChapter.article_slug!)}
                  className="gap-2"
                >
                  <ChevronLeft className="size-4" />
                  {prevChapter.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
          <div>
            {nextChapter ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link
                  href={budgetNewsChapterPath(slug, nextChapter.article_slug!)}
                  className="gap-2"
                >
                  {nextChapter.title}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link href={budgetNewsModulePath(slug)}>
                  Read all chapters
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Link>
              </Button>
            )}
          </div>
        </nav>
        </div>

        {((mod.steps?.length ?? 0) > 0 || articleHeadings.length > 0) && (
          <aside className="hidden space-y-8 lg:block">
            {articleHeadings.length > 0 ? (
              <ArticleSectionToc headings={articleHeadings} />
            ) : null}
            {(mod.steps?.length ?? 0) > 0 ? (
              <BudgetReportToc
                chapters={mod.steps}
                slug={slug}
                activeSlug={chapterSlug}
              />
            ) : null}
          </aside>
        )}
      </article>
    </div>
  );
}

export function BudgetNewsChapterClient({
  slug,
  chapterSlug,
}: {
  slug: string;
  chapterSlug: string;
}) {
  return (
    <BudgetNewsErrorBoundary>
      <ChapterContent slug={slug} chapterSlug={chapterSlug} />
    </BudgetNewsErrorBoundary>
  );
}
