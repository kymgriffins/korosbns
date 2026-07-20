"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/utils";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";
import type { FiscalYearMeta, ReportProvenance } from "@/lib/reports-api";
import { buildReportsBrief, type BriefChapterId } from "@/lib/reports-brief";
import { BriefChapterPanel, BriefHeroStats } from "./brief-chapters";
import { Button } from "@/components/ui/button";

export function ReportsBriefApp() {
  const [allYears, setAllYears] = useState<Record<string, BudgetSchema>>({});
  const [fiscalYears, setFiscalYears] = useState<FiscalYearMeta[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<BriefChapterId>("pulse");
  const [provenance, setProvenance] = useState<ReportProvenance | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchReportData();
      setFiscalYears(result.fiscalYears);
      setAllYears(result.allYears);
      setSelectedYear(result.selectedYear);
      setProvenance(result.provenance);
    } catch {
      setAllYears({});
      setFiscalYears([]);
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

  const currentData = allYears[selectedYear];
  const brief = useMemo(
    () => (currentData ? buildReportsBrief(currentData) : null),
    [currentData],
  );

  if (loading) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading budget brief…</p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <p className="font-heading text-lg font-bold">Brief unavailable</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not load FY data for this session. Live API and seeded fallback both failed.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => void fetchAll()}>
          <RefreshCw className="mr-1.5 size-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col md:max-w-2xl lg:max-w-3xl">
      {/* Top bar — mobile-first, not dashboard tabs */}
      <div className="sticky top-12 z-30 border-b border-border/40 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md sm:px-6 md:top-16">
        <div className="flex items-center justify-between gap-2">
          <BriefHeroStats model={brief} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => void fetchAll()}
            aria-label="Refresh budget data"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        {fiscalYears.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {fiscalYears.map((fy) => (
              <button
                key={fy.id}
                type="button"
                onClick={() => setSelectedYear(fy.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  selectedYear === fy.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {fy.label.replace("FY ", "")}
              </button>
            ))}
          </div>
        ) : null}

        {/* Chapter pills — horizontal scroll, not tab bar */}
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
      </div>

      {/* Chapter body */}
      <main className="flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-8">
        <BriefChapterPanel chapter={chapter} model={brief} />
      </main>

      {/* Provenance — minimal footer strip */}
      <footer className="border-t border-border/30 bg-muted/20 px-4 py-4 text-center text-[10px] text-muted-foreground sm:px-6">
        <p>
          Source: {provenance?.source ?? "—"}
          {provenance?.data_status ? ` · ${provenance.data_status}` : ""}
        </p>
        {provenance?.synced_at ? (
          <p className="mt-0.5">Synced {new Date(provenance.synced_at).toLocaleString()}</p>
        ) : null}
      </footer>

      {/* Mobile bottom chapter dock */}
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
    </div>
  );
}
