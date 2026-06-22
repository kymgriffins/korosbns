"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight, BookOpen, Building2, ChevronDown, Hammer, Landmark, Loader2, PieChart, RefreshCw,
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

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Landmark },
  { id: "sectors", label: "Sectors", icon: PieChart },
  { id: "counties", label: "Counties", icon: Building2 },
  { id: "projects", label: "Projects", icon: Hammer },
  { id: "gallery", label: "Gallery", icon: BookOpen },
] as const;

export default function ReportsPage() {
  const [allYears, setAllYears] = useState<Record<string, BudgetSchema>>({});
  const [fiscalYears, setFiscalYears] = useState<FiscalYearMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const id = sorted[0].target.getAttribute("data-section");
          if (id) setActiveSection(id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [loading]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  const yearLabels = useMemo(() => {
    const m: Record<string, string> = {};
    for (const fy of fiscalYears) m[fy.id] = fy.label.replace("FY ", "");
    return m;
  }, [fiscalYears]);

  const currentData = allYears[selectedYear];

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      {/* Floating nav */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <nav className="flex items-center gap-1 rounded-full border bg-card/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => scrollToSection(s.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <Icon className="size-3" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sticky Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <h1 className="text-base font-bold tracking-tight md:text-lg">Budget Report</h1>
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

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {loading || !currentData ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-16">
            {/* Cover / Hero */}
            <section ref={setRef("hero")} data-section="hero" className="scroll-mt-24">
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12">
                <div className="absolute right-0 top-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full ring-1 ring-primary/20 mb-4">
                    <Landmark className="size-3.5" />
                    {fiscalYears.find((y) => y.id === selectedYear)?.label ?? "FY"} Budget Report
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                    {currentData.metadata.theme}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                    A comprehensive analysis of Kenya&apos;s national budget, covering revenue projections, sector allocations,
                    county disbursements, and development projects.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Landmark className="size-3.5" />{currentData.metadata.presented_by}</span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1.5">Presented {currentData.metadata.presented_date}</span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1.5">Approved {currentData.metadata.approved_date}</span>
                  </div>
                  <button onClick={() => scrollToSection("overview")}
                    className="mt-8 flex items-center gap-2 text-xs font-medium text-primary hover:underline group"
                  >
                    Explore the budget
                    <ChevronDown className="size-3.5 animate-bounce group-hover:animate-none" />
                  </button>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section ref={setRef("overview")} data-section="overview" className="scroll-mt-24">
              <SectionHeading icon={Landmark} title="National Overview" subtitle="Key fiscal aggregates and revenue analysis" />
              <OverviewTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            </section>

            {/* Sectors */}
            <section ref={setRef("sectors")} data-section="sectors" className="scroll-mt-24">
              <SectionHeading icon={PieChart} title="Sector Analysis" subtitle="Resource allocation and spending by sector" />
              <SectorsTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            </section>

            {/* Counties */}
            <section ref={setRef("counties")} data-section="counties" className="scroll-mt-24">
              <SectionHeading icon={Building2} title="County Allocations" subtitle="Distribution across all 47 counties" />
              <CountiesTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            </section>

            {/* Projects */}
            <section ref={setRef("projects")} data-section="projects" className="scroll-mt-24">
              <SectionHeading icon={Hammer} title="Development Projects" subtitle="National and county-level project portfolio" />
              <ProjectsTab
                currentData={currentData}
                allYears={allYears}
                fiscalYears={fiscalYears}
                selectedYear={selectedYear}
              />
            </section>

            {/* Gallery */}
            <section ref={setRef("gallery")} data-section="gallery" className="scroll-mt-24">
              <SectionHeading icon={BookOpen} title="Document Gallery" subtitle="Key budget documents at a glance" />
              <GallerySection />
            </section>

            {/* Treasury Feed */}
            <section ref={setRef("treasury")} data-section="treasury" className="scroll-mt-24">
              <SectionHeading icon={Landmark} title="Treasury Updates" subtitle="Latest from the National Treasury" />
              <TreasuryFeed />
            </section>
          </div>
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
            <a href="/budgethub/dashboard/lms/documents" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowUpRight className="size-3" />
              Budget Documents
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }: { icon: typeof Landmark; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 h-px bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-border/60 p-8">
        <div className="h-4 w-32 bg-muted rounded-full mb-3" />
        <div className="h-6 w-3/4 bg-muted rounded mb-3" />
        <div className="h-4 w-1/2 bg-muted rounded" />
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
