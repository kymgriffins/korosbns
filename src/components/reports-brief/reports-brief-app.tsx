"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/utils";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";
import type { ReportProvenance } from "@/lib/reports-api";
import { buildReportsBrief, type BriefChapterId } from "@/lib/reports-brief";
import { getFyEpisode } from "@/lib/budget-episodes";
import {
  BUDGET_YEARS,
  DEFAULT_BUDGET_YEAR_ID,
  getBudgetYear,
} from "@/data/budget-years-catalogue";
import { BriefChapterPanel, BriefHeroStats } from "./brief-chapters";
import { FyEpisodePanel } from "./fy-episode-panel";
import { YearEmptyState } from "./year-empty-state";
import { YearSelector } from "./year-selector";
import { Button } from "@/components/ui/button";

function schemaByFiscalYear(
  allYears: Record<string, BudgetSchema>,
  fyLabel: string,
): BudgetSchema | undefined {
  return Object.values(allYears).find((d) => d.metadata?.fiscal_year === fyLabel);
}

export function ReportsBriefApp() {
  const [allYears, setAllYears] = useState<Record<string, BudgetSchema>>({});
  const [selectedFy, setSelectedFy] = useState(DEFAULT_BUDGET_YEAR_ID);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<BriefChapterId>("pulse");
  const [provenance, setProvenance] = useState<ReportProvenance | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchReportData();
      setAllYears(result.allYears);
      setProvenance(result.provenance);
      const fromPayload = result.selectedYear
        ? result.allYears[result.selectedYear]?.metadata?.fiscal_year
        : undefined;
      if (fromPayload && getBudgetYear(fromPayload)) {
        setSelectedFy(fromPayload);
      }
    } catch {
      setAllYears({});
      setProvenance({
        source: "none",
        fiscal_year: null,
        synced_at: null,
        data_status: "unavailable",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const yearMeta = getBudgetYear(selectedFy) ?? BUDGET_YEARS[BUDGET_YEARS.length - 1];
  const episode = getFyEpisode(selectedFy);
  const currentData = schemaByFiscalYear(allYears, selectedFy);
  const brief = useMemo(
    () => (currentData ? buildReportsBrief(currentData) : null),
    [currentData],
  );

  const showEpisode = yearMeta.status === "IN_APP" && Boolean(episode);
  const showEmpty = yearMeta.status === "GAP" || yearMeta.status === "SOURCE_LISTED";

  if (loading) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading budget brief…</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col md:max-w-2xl lg:max-w-3xl">
      <div className="sticky top-12 z-30 border-b border-border/40 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md sm:px-6 md:top-16">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-heading text-sm font-bold tracking-tight sm:text-base">
              Budget Reports
            </h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              FY {selectedFy} · {yearMeta.status}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => void fetchAll()}
            aria-label="Refresh budget data"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="mt-3">
          <YearSelector selectedId={selectedFy} onSelect={setSelectedFy} />
        </div>

        {brief ? (
          <>
            <div className="mt-3">
              <BriefHeroStats model={brief} />
            </div>
            <div
              className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
              role="tablist"
              aria-label="Budget chapters"
            >
              {brief.chapters.map((ch) => {
                const active = chapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setChapter(ch.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span aria-hidden>{ch.emoji}</span>
                    {ch.shortLabel}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>

      <main className="flex-1 space-y-10 px-4 py-6 pb-28 sm:px-6 sm:py-8">
        {showEmpty ? <YearEmptyState year={yearMeta} /> : null}

        {showEpisode && episode ? <FyEpisodePanel episode={episode} /> : null}

        {showEpisode && !episode ? (
          <div className="rounded-3xl border border-border/50 bg-muted/30 p-6 text-center">
            <p className="font-heading text-lg font-bold">Episode seed missing</p>
            <p className="mt-2 text-sm text-muted-foreground">
              FY {selectedFy} is marked IN_APP but no episode payload is bundled. We will not invent
              figures.
            </p>
          </div>
        ) : null}

        {brief ? (
          <section className="space-y-4 border-t border-border/40 pt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Detailed brief
            </p>
            <BriefChapterPanel chapter={chapter} model={brief} />
          </section>
        ) : null}

        {!showEmpty && !showEpisode && !brief ? (
          <div className="mx-auto max-w-lg py-10 text-center">
            <p className="font-heading text-lg font-bold">Brief unavailable</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We could not load FY data for this session. Live API and seeded fallback both failed.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => void fetchAll()}>
              <RefreshCw className="mr-1.5 size-3.5" />
              Retry
            </Button>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-border/30 bg-muted/20 px-4 py-4 text-center text-[10px] text-muted-foreground sm:px-6">
        <p>
          Source: {episode?.seed_key ? `seeded:${episode.seed_key}` : provenance?.source ?? "—"}
          {provenance?.data_status ? ` · ${provenance.data_status}` : ""}
          {` · ${yearMeta.status}`}
        </p>
        {provenance?.synced_at ? (
          <p className="mt-0.5">Synced {new Date(provenance.synced_at).toLocaleString()}</p>
        ) : null}
      </footer>

      {brief ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/95 px-2 py-2 backdrop-blur-lg md:hidden"
          aria-label="Quick chapter switch"
        >
          <div className="mx-auto flex max-w-lg justify-between gap-0.5">
            {brief.chapters.map((ch) => {
              const active = chapter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChapter(ch.id)}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[9px] font-bold uppercase tracking-wide",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="text-base leading-none">{ch.emoji}</span>
                  <span className="truncate px-0.5">{ch.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
