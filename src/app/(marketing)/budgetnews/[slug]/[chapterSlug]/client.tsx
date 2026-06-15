"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/ui/button";
import { budgetNewsChapterPath, budgetNewsModulePath, Routes } from "@/constants/routes";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule, ChapterStep } from "@/types/learn";
import { BudgetNewsErrorBoundary } from "../../error-boundary";
import { resolveChapterReport } from "@/lib/budget-report-data";
import {
  BudgetArticleBody,
  BudgetChapterReportBlocks,
  BudgetReportToc,
} from "@/components/budget-news/report-blocks";

function ChapterContent({
  slug,
  chapterSlug,
}: {
  slug: string;
  chapterSlug: string;
}) {
  const [mod, setMod] = useState<CivicModule | null>(null);
  const [chapter, setChapter] = useState<ChapterStep | null>(null);
  const [prevChapter, setPrevChapter] = useState<ChapterStep | null>(null);
  const [nextChapter, setNextChapter] = useState<ChapterStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await learnHubApi.budgetNewsModule(slug);
        if (cancelled) return;

        const chapters = data.steps || [];
        const idx = chapters.findIndex((c) => c.article_slug === chapterSlug);

        if (idx === -1) {
          setError("Chapter not found");
          return;
        }

        setMod(data);
        setChapter(chapters[idx]);
        setPrevChapter(idx > 0 ? chapters[idx - 1] : null);
        setNextChapter(idx < chapters.length - 1 ? chapters[idx + 1] : null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, chapterSlug]);

  if (loading) {
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
        <p className="text-destructive mt-4">{error || "Chapter not found"}</p>
      </div>
    );
  }

  const chapterReport = resolveChapterReport(chapter.report);
  const fiscalYear =
    (mod.metadata?.report as { fiscal_year?: string } | undefined)?.fiscal_year ?? "2026/27";

  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
        <div>
        <Link
          href={budgetNewsModulePath(slug)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to {mod.title}
        </Link>

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
              Chapter {chapter.order} of {mod.steps?.length || 0}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{chapter.title}</h1>

          <BudgetChapterReportBlocks report={chapterReport} />

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

        {(mod.steps?.length ?? 0) > 0 && (
          <aside className="hidden lg:block">
            <BudgetReportToc
              chapters={mod.steps}
              slug={slug}
              activeSlug={chapterSlug}
            />
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
