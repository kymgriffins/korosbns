"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Landmark,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchAllYearsData, type ReportPageData } from "@/lib/reports-hub";
import { NationalView } from "@/components/reports/national-view";
import { CountyView } from "@/components/reports/county-view";
import { Skeleton } from "@/components/ui/skeleton";
import type { BudgetFiscalYear } from "@/lib/budget-api";
import budgetJson from "@/data/budget-fy2026-27.json";

const schema = budgetJson as any;

export default function ReportsPage() {
  const [byYear, setByYear] = useState<Record<string, ReportPageData>>({});
  const [fiscalYears, setFiscalYears] = useState<BudgetFiscalYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [tab, setTab] = useState<"national" | "counties">("national");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllYearsData();
      setFiscalYears(result.fiscalYears);
      setByYear(result.byYear);
      setSelectedYear(result.fiscalYears.find((y) => y.is_current)?.id || result.fiscalYears[0]?.id || "");
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const yearLabels = useMemo(() => {
    const m: Record<string, string> = {};
    for (const fy of fiscalYears) m[fy.id] = fy.label.replace("FY ", "");
    return m;
  }, [fiscalYears]);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Sticky Header ─── */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <h1 className="text-base font-bold tracking-tight md:text-lg">Budget Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            {fiscalYears.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {fiscalYears.map((fy) => {
                  const isSelected = selectedYear === fy.id;
                  const isCurrent = fy.is_current;
                  return (
                    <button key={fy.id} onClick={() => setSelectedYear(fy.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40",
                      )}
                    >
                      {isCurrent && (
                        <span className="relative flex size-2">
                          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                            isSelected ? "bg-primary-foreground/60" : "bg-primary/40")} />
                          <span className={cn("relative inline-flex size-2 rounded-full",
                            isSelected ? "bg-primary-foreground" : "bg-primary")} />
                        </span>
                      )}
                      {fy.label.replace("FY ", "")}
                    </button>
                  );
                })}
              </div>
            )}
            <Button variant="outline" size="icon-sm" onClick={fetchAll} disabled={loading}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-8">
              <button onClick={() => setTab("national")}
                className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  tab === "national"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80")}
              >
                <Landmark className="size-4" /> National
              </button>
              <button onClick={() => setTab("counties")}
                className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  tab === "counties"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80")}
              >
                <Building2 className="size-4" /> Counties
              </button>
            </div>

            {tab === "national" ? (
              <NationalView byYear={byYear} selectedYear={selectedYear} fiscalYears={fiscalYears} schema={schema} />
            ) : (
              <CountyView byYear={byYear} selectedYear={selectedYear} fiscalYears={fiscalYears} />
            )}
          </>
        )}
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground">
          <Landmark className="size-4 mx-auto mb-1" />
          <p>Kenya National Budget Data — {fiscalYears.find((y) => y.id === selectedYear)?.label ?? "FY"}</p>
          <p className="mt-0.5">Presented by {schema.metadata?.presented_by ?? "National Treasury"}</p>
        </div>
      </footer>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-border/60 p-5">
        <div className="h-4 w-28 bg-muted rounded-full mb-2" />
        <div className="h-5 w-3/4 bg-muted rounded mb-2" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 p-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-52 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border/60 p-4 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-52 w-full rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 p-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
