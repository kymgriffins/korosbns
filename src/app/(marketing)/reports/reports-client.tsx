"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BookOpen, Building2, Hammer, Landmark, LayoutDashboard, Loader2, PieChart, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";
import type { FiscalYearMeta } from "@/lib/reports-api";
import { OverviewTab } from "@/components/reports/overview-tab";
import { SectorsTab } from "@/components/reports/sectors-tab";
import { CountiesTab } from "@/components/reports/counties-tab";
import { ProjectsTab } from "@/components/reports/projects-tab";
import { GallerySection } from "@/components/reports/gallery-section";
import { TreasuryFeed } from "@/components/reports/treasury-feed";
import { Skeleton } from "@/components/ui/skeleton";

type TabId = "overview" | "sectors" | "counties" | "projects" | "gallery";

const TABS: { id: TabId; label: string; icon: typeof Landmark }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sectors", label: "Sectors", icon: PieChart },
  { id: "counties", label: "Counties", icon: Building2 },
  { id: "projects", label: "Projects", icon: Hammer },
  { id: "gallery", label: "Gallery", icon: BookOpen },
];

export function ReportsClientPage() {
  const [allYears, setAllYears] = useState<Record<string, BudgetSchema>>({});
  const [fiscalYears, setFiscalYears] = useState<FiscalYearMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [tab, setTab] = useState<TabId>("overview");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchReportData();
      setFiscalYears(result.fiscalYears);
      setAllYears(result.allYears);
      setSelectedYear(result.selectedYear);
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

  const currentData = allYears[selectedYear];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
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

        {/* Tab Navigation */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 pb-0">
          <div className="flex items-center gap-1 -mb-px">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all",
                    tab === t.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                  )}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {loading || !currentData ? (
          <LoadingSkeleton />
        ) : (
          <>
            {tab === "overview" && (
              <OverviewTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            )}
            {tab === "sectors" && (
              <SectorsTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            )}
            {tab === "counties" && (
              <CountiesTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            )}
            {tab === "projects" && (
              <ProjectsTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            )}
            {tab === "gallery" && (
              <div className="space-y-8">
                <GallerySection />
                <TreasuryFeed />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground">
          <Landmark className="size-4 mx-auto mb-1" />
          <p>Kenya National Budget Data — {fiscalYears.find((y) => y.id === selectedYear)?.label ?? "FY"}</p>
          <p className="mt-0.5">Presented by {currentData?.metadata?.presented_by ?? "National Treasury"}</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a href="https://x.com/ketreasury" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @ketreasury
            </a>
            <a href="/learn" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowUpRight className="size-3" />
              Budget Documents
            </a>
          </div>
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
    </div>
  );
}
