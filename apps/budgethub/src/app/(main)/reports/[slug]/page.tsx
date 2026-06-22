"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Crosshair,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Landmark,
  Loader2,
  MapPin,
  Minus,
  PieChart as PieChartIcon,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart as RechartPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatKesBillions, formatKesTrillions, percentChange, shareOfTotal } from "@/lib/budget-format";
import { COUNTIES } from "@/constants/counties";
import { getReportBySlug, fetchReportData, getCategoryLabel, type ReportPageData, type ReportCategory } from "@/lib/reports-hub";
import {
  KpiCard,
  formatValue,
  TrendIndicator,
  SECTOR_COLORS,
  ReportHeader,
  TocNav,
  MobileToc,
  BarChartIcon,
  type SectionDef,
} from "@/components/reports/shared";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function emptyDataFallback() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 py-16">
        <PieChartIcon className="size-12 text-muted-foreground/20" />
        <p className="text-sm text-muted-foreground">No data available for this report</p>
        <p className="text-xs text-muted-foreground/60">Select a different fiscal year or report category</p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardHeader><Skeleton className="h-3 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-28" /><Skeleton className="mt-1 h-3 w-16" /></CardContent></Card>
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function ReportDetailPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [data, setData] = useState<ReportPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const report = slug ? getReportBySlug(slug) : undefined;

  const fetchData = useCallback(async (year?: string) => {
    if (!slug) return;
    setLoading(true);
    try {
      const result = await fetchReportData(slug, year);
      setData(result);
      setSelectedYear(result.selectedYear);
    } catch {} finally { setLoading(false); }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug, fetchData]);

  const handleYearChange = useCallback((yearId: string) => {
    setSelectedYear(yearId);
    fetchData(yearId);
  }, [fetchData]);

  if (!report && slug) return notFound();
  if (!slug || !report) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <ReportNav
        report={report}
        data={data}
        selectedYear={selectedYear}
        loading={loading}
        onYearChange={handleYearChange}
        onRefresh={() => fetchData(selectedYear)}
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-56 shrink-0 lg:block">
            <TocNav
              sections={SECTION_MAP[slug as keyof typeof SECTION_MAP] ?? []}
              activeSection={activeSection}
              onNavigate={(id) => {
                setActiveSection(id);
                sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <MobileToc
                sections={SECTION_MAP[slug as keyof typeof SECTION_MAP] ?? []}
                activeSection={activeSection}
                onNavigate={(id) => {
                  setActiveSection(id);
                  sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>

            {loading ? <LoadingSkeleton /> : (
              <ReportContent slug={slug} data={data} sectionRefs={sectionRefs} setActiveSection={setActiveSection} />
            )}
          </div>
        </div>
      </div>

      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
            <Landmark className="size-4" />
            <p>Budget data sourced from the Kenya National Treasury and County Governments</p>
            <p>Data is for informational purposes and may not reflect the latest revisions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ReportNav({ report, data, selectedYear, loading, onYearChange, onRefresh }: {
  report: { title: string; slug: string };
  data: ReportPageData | null;
  selectedYear: string;
  loading: boolean;
  onYearChange: (id: string) => void;
  onRefresh: () => void;
}) {
  const fiscalYears = data?.fiscalYears ?? [];
  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/budgethub/reports"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-colors"
          >
            <Landmark className="size-4.5 text-primary" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link href="/budgethub/reports" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
              <span className="text-[10px] text-muted-foreground">/</span>
              <h1 className="text-base font-bold tracking-tight md:text-lg truncate">{report.title}</h1>
            </div>
            <p className="truncate text-[10px] text-muted-foreground hidden sm:block">
              Kenya Budget Analysis — {selectedYearLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fiscalYears.length > 0 && (
            <div className="flex items-center gap-1 rounded-lg border bg-background p-0.5">
              {fiscalYears.slice(0, 5).map((fy) => (
                <button
                  key={fy.id}
                  onClick={() => onYearChange(fy.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-bold transition-all whitespace-nowrap",
                    selectedYear === fy.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {fy.label.replace("FY ", "")}
                </button>
              ))}
            </div>
          )}
          <Button variant="outline" size="icon-sm" onClick={onRefresh} disabled={loading}>
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

const SECTION_MAP: Record<string, SectionDef[]> = {
  "budget-overview": [
    { id: "kpis", label: "Key Indicators", icon: Landmark },
    { id: "revenue-expenditure", label: "Revenue vs Expenditure", icon: PieChartIcon },
    { id: "sectors", label: "Sector Allocation", icon: TrendingUp },
    { id: "highlights", label: "Highlights", icon: Sparkles },
  ],
  "county-budgets": [
    { id: "overview", label: "County Overview", icon: MapPin },
    { id: "top-counties", label: "Top Counties", icon: TrendingUp },
    { id: "comparison", label: "Approved vs Proposed", icon: BarChartIcon },
  ],
  "defense-security": [
    { id: "total", label: "Total Allocation", icon: Shield },
    { id: "breakdown", label: "Entity Breakdown", icon: Crosshair },
  ],
  "development-projects": [
    { id: "split", label: "Development vs Recurrent", icon: Target },
    { id: "sector-investment", label: "Sector Investment", icon: Globe },
    { id: "comparison", label: "Top Allocations", icon: BarChartIcon },
  ],
  "revenue-analysis": [
    { id: "overview", label: "Revenue Overview", icon: Banknote },
    { id: "composition", label: "Revenue Composition", icon: PieChartIcon },
    { id: "trends", label: "Revenue Trends", icon: TrendingUp },
  ],
  "sector-allocations": [
    { id: "breakdown", label: "Sector Breakdown", icon: PieChartIcon },
    { id: "comparison", label: "Sector Comparison", icon: BarChartIcon },
    { id: "details", label: "Details", icon: FileText },
  ],
};

function ReportContent({ slug, data, sectionRefs, setActiveSection }: {
  slug: string;
  data: ReportPageData | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  setActiveSection: (id: string) => void;
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );
    const refs = sectionRefs.current;
    for (const ref of Object.values(refs)) {
      if (ref) observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [data, setActiveSection, sectionRefs]);

  if (!data) return emptyDataFallback();

  const { allocations, kpis, entities, highlights, fiscalYears, selectedYear } = data;
  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";
  const approvedAllocations = allocations.filter((a) => a.allocation_type === "approved");
  const proposedAllocations = allocations.filter((a) => a.allocation_type === "proposed");
  const totalBudget = approvedAllocations.reduce((sum, a) => sum + Number(a.amount), 0);

  switch (slug) {
    case "budget-overview":
      return <BudgetOverview
        allocations={allocations} kpis={kpis} entities={entities} highlights={highlights}
        approvedAllocations={approvedAllocations} totalBudget={totalBudget}
        selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    case "county-budgets":
      return <CountyBudgets
        allocations={allocations} entities={entities} approvedAllocations={approvedAllocations}
        proposedAllocations={proposedAllocations} totalBudget={totalBudget}
        selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    case "defense-security":
      return <DefenseSecurity
        allocations={allocations} entities={entities} approvedAllocations={approvedAllocations}
        totalBudget={totalBudget} selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    case "development-projects":
      return <DevelopmentProjects
        approvedAllocations={approvedAllocations} totalBudget={totalBudget}
        selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    case "revenue-analysis":
      return <RevenueAnalysis
        kpis={kpis} totalBudget={totalBudget} selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    case "sector-allocations":
      return <SectorAllocations
        approvedAllocations={approvedAllocations} totalBudget={totalBudget}
        selectedYearLabel={selectedYearLabel} sectionRefs={sectionRefs}
      />;
    default:
      return emptyDataFallback();
  }
}

function SectionRenderer({ children, id, sectionRefs }: {
  children: React.ReactNode;
  id: string;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}) {
  return <section id={id} ref={(el) => { sectionRefs.current[id] = el; }} className="scroll-mt-24 mb-12">{children}</section>;
}

function BudgetOverview({ allocations, kpis, entities, highlights, approvedAllocations, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const nationalEntities = entities.filter((e: any) => e.type === "national").map((e: any) => e.id);
  const nationalAllocations = approvedAllocations.filter((a: any) => nationalEntities.includes(a.entity));
  const nationalDeficit = useMemo(() => {
    const rev = kpis.find((k: any) => k.key === "total_revenue");
    const exp = kpis.find((k: any) => k.key === "total_expenditure");
    if (rev && exp) return Number(rev.value) - Number(exp.value);
    return 0;
  }, [kpis]);
  const budgetGrowth = useMemo(() => {
    const current = kpis.find((k: any) => k.key === "total_expenditure");
    if (current?.previous_value) return percentChange(Number(current.value), Number(current.previous_value));
    return "—";
  }, [kpis]);

  const revenueExpenditure = useMemo(() => {
    return [
      { name: "Revenue", value: kpis.find((k: any) => k.key === "total_revenue") ? Number(kpis.find((k: any) => k.key === "total_revenue")!.value) / 1e9 : 0, fill: "hsl(142 76% 36%)" },
      { name: "Expenditure", value: kpis.find((k: any) => k.key === "total_expenditure") ? Number(kpis.find((k: any) => k.key === "total_expenditure")!.value) / 1e9 : totalBudget / 1e9, fill: "hsl(346 77% 50%)" },
      { name: "Deficit", value: Math.abs(nationalDeficit) / 1e9, fill: "hsl(47 95% 48%)" },
    ].filter((d) => d.value > 0);
  }, [kpis, totalBudget, nationalDeficit]);

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of approvedAllocations) {
      const sector = a.entity_name.split(" - ")[0] || a.entity_name;
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 12).map(([name, value], i) => ({
      name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  }, [approvedAllocations]);

  return (
    <div className="space-y-12">
      <SectionRenderer id="kpis" sectionRefs={sectionRefs}>
        <ReportHeader title="National Budget Overview" description="Key fiscal indicators" icon={Landmark} selectedYearLabel={selectedYearLabel} />
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard label="Total Budget" value={formatValue(totalBudget / 1e9)} subtitle={selectedYearLabel} />
          <KpiCard label="Revenue" value={kpis.find((k: any) => k.key === "total_revenue") ? formatKesBillions(Number(kpis.find((k: any) => k.key === "total_revenue")!.value) / 1e9) : "—"} />
          <KpiCard label="Expenditure" value={kpis.find((k: any) => k.key === "total_expenditure") ? formatKesBillions(Number(kpis.find((k: any) => k.key === "total_expenditure")!.value) / 1e9) : formatKesBillions(totalBudget / 1e9)} />
          <KpiCard label="Fiscal Deficit" value={formatKesBillions(Math.abs(nationalDeficit) / 1e9)} trend={nationalDeficit < 0 ? -Math.abs(nationalDeficit) / (kpis.find((k: any) => k.key === "total_revenue") ? Number(kpis.find((k: any) => k.key === "total_revenue")!.value) : 1) * 100 : undefined} subtitle={nationalDeficit < 0 ? "Expenditure exceeds revenue" : "Budget surplus"} />
        </div>
        {kpis.length > 3 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {kpis.filter((k: any) => !["total_revenue", "total_expenditure"].includes(k.key)).slice(0, 5).map((kpi: any) => (
              <KpiCard key={kpi.key} label={kpi.label} value={`${kpi.value}${kpi.suffix || ""}`} />
            ))}
          </div>
        )}
      </SectionRenderer>

      <SectionRenderer id="revenue-expenditure" sectionRefs={sectionRefs}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><PieChartIcon className="size-4 text-primary" />Revenue vs Expenditure</CardTitle>
            <CardDescription>Budget composition for {selectedYearLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueExpenditure.length === 0 ? emptyDataFallback() : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <RechartPie>
                    <Pie data={revenueExpenditure} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {revenueExpenditure.map((entry: any, idx: number) => (<Cell key={idx} fill={entry.fill} />))}
                      <Label value={`KES ${(totalBudget / 1e12).toFixed(2)}T`} position="center" className="text-lg font-bold" />
                    </Pie>
                    <Tooltip formatter={formatKesBillions as any} />
                  </RechartPie>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {revenueExpenditure.map((entry: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-medium tabular-nums">{formatKesBillions(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </SectionRenderer>

      <SectionRenderer id="sectors" sectionRefs={sectionRefs}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Sector Allocation</CardTitle>
            <CardDescription>Top sectors by approved budget</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? emptyDataFallback() : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                  <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {sectorBreakdown.map((entry: any, idx: number) => (<Cell key={idx} fill={entry.fill} />))}
                    <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </SectionRenderer>

      {highlights.length > 0 && (
        <SectionRenderer id="highlights" sectionRefs={sectionRefs}>
          <ReportHeader title="Budget Highlights" description="Key takeaways" icon={Sparkles} selectedYearLabel={selectedYearLabel} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.slice(0, 3).map((hl: any) => (
              <Card key={hl.id} className={cn(
                "border-l-4 shadow-sm",
                hl.type === "success" && "border-l-emerald-500",
                hl.type === "warning" && "border-l-amber-500",
                hl.type === "trend" && "border-l-blue-500",
                hl.type === "info" && "border-l-slate-400",
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    {hl.type === "success" ? <Sparkles className="size-4 text-emerald-500 shrink-0 mt-0.5" /> :
                     hl.type === "warning" ? <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" /> :
                     hl.type === "trend" ? <TrendingUp className="size-4 text-blue-500 shrink-0 mt-0.5" /> :
                     <Info className="size-4 text-slate-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-bold">{hl.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{hl.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {(() => {
            const current = kpis.find((k: any) => k.key === "total_expenditure");
            if (!current?.previous_value) return null;
            const growth = percentChange(Number(current.value), Number(current.previous_value));
            return (
              <Card className="mt-4 border-border/60 shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="flex items-center gap-3 p-4">
                  <TrendingUp className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Budget Growth</p>
                    <p className="text-xs text-muted-foreground">
                      The total budget changed by <span className="font-bold text-foreground">{growth}</span> compared to the previous fiscal year
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </SectionRenderer>
      )}
    </div>
  );
}

function CountyBudgets({ allocations, entities, approvedAllocations, proposedAllocations, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const countyEntities = entities.filter((e: any) => e.type === "county").map((e: any) => e.id);
  const countyAllocations = approvedAllocations.filter((a: any) => countyEntities.includes(a.entity));

  const countyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of countyAllocations) {
      map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value / 1e8) / 10 })).sort((a, b) => b.value - a.value);
  }, [countyAllocations]);

  const topCounties = useMemo(() => countyBreakdown.slice(0, 10), [countyBreakdown]);
  const totalCountyAllocation = countyAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);

  return (
    <div className="space-y-12">
      <SectionRenderer id="overview" sectionRefs={sectionRefs}>
        <ReportHeader title="County Budgets" description="Budget allocations across 47 counties" icon={Building2} selectedYearLabel={selectedYearLabel} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><MapPin className="size-4 text-primary" />County Summary</CardTitle>
              <CardDescription>Aggregate county budget metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total County Allocation</p>
                <p className="text-2xl font-bold tabular-nums mt-1">{formatKesBillions(totalCountyAllocation / 1e9)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Counties</p>
                  <p className="text-lg font-bold tabular-nums">47</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Share of Budget</p>
                  <p className="text-lg font-bold tabular-nums">
                    {totalBudget > 0 ? `${((totalCountyAllocation / totalBudget) * 100).toFixed(1)}%` : "—"}
                  </p>
                </div>
              </div>
              {countyBreakdown.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Highest & Lowest</p>
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowUpRight className="size-3 text-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{countyBreakdown[0]?.name}</span>
                    <span className="tabular-nums text-muted-foreground ml-auto">{formatKesBillions(countyBreakdown[0]?.value ?? 0)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowDownRight className="size-3 text-red-500 shrink-0" />
                    <span className="truncate font-medium">{countyBreakdown[countyBreakdown.length - 1]?.name}</span>
                    <span className="tabular-nums text-muted-foreground ml-auto">{formatKesBillions(countyBreakdown[countyBreakdown.length - 1]?.value ?? 0)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <SectionRenderer id="top-counties" sectionRefs={sectionRefs}>
            <div className="lg:col-span-2">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2"><BarChartIcon className="size-4 text-primary" />Top 10 Counties by Allocation</CardTitle>
                  <CardDescription>Counties with the largest approved budgets</CardDescription>
                </CardHeader>
                <CardContent>
                  {topCounties.length === 0 ? emptyDataFallback() : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={topCounties} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                        <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                        <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" width={90} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={formatKesBillions as any} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16} fill="hsl(199 89% 48%)">
                          <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </SectionRenderer>
        </div>
      </SectionRenderer>

      {countyAllocations.length > 0 && proposedAllocations.length > 0 && (
        <SectionRenderer id="comparison" sectionRefs={sectionRefs}>
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Approved vs Proposed — County Allocations</CardTitle>
              <CardDescription>Comparison of budgeted vs actual county allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={countyBreakdown.slice(0, 15)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeOpacity={0.3} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={20} fill="hsl(199 89% 48%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </SectionRenderer>
      )}
    </div>
  );
}

function DefenseSecurity({ allocations, entities, approvedAllocations, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const defenseEntities = entities.filter((e: any) => e.type === "defense" || e.name.toLowerCase().includes("defence") || e.name.toLowerCase().includes("security")).map((e: any) => e.id);
  const defenseAllocations = approvedAllocations.filter((a: any) => defenseEntities.includes(a.entity));
  const totalDefense = defenseAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);

  return (
    <div className="space-y-12">
      <SectionRenderer id="total" sectionRefs={sectionRefs}>
        <ReportHeader title="Defense & Security Budget" description="Allocation to national defense, internal security, and peace initiatives" icon={Shield} selectedYearLabel={selectedYearLabel} />
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-sm">Total Defense Allocation</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{formatKesBillions(totalDefense / 1e9)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBudget > 0 ? `${((totalDefense / totalBudget) * 100).toFixed(1)}% of total budget` : ""}
            </p>
          </CardContent>
        </Card>
      </SectionRenderer>

      <SectionRenderer id="breakdown" sectionRefs={sectionRefs}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Crosshair className="size-4 text-primary" />Defense Entities Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {defenseAllocations.length === 0 ? emptyDataFallback() : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={defenseAllocations.map((a: any) => ({
                  name: a.entity_name.split(" - ").pop() || a.entity_name,
                  value: Math.round(Number(a.amount) / 1e8) / 10,
                }))} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                  <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16} fill="hsl(346 77% 50%)">
                    <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </SectionRenderer>
    </div>
  );
}

function DevelopmentProjects({ approvedAllocations, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const developmentAllocations = approvedAllocations.filter((a: any) => a.entity_name.toLowerCase().includes("development"));
  const totalDevelopment = developmentAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);
  const totalApproved = approvedAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);
  const recurrentTotal = totalApproved - totalDevelopment;

  const sectorInvestmentData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of developmentAllocations) {
      map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value], i) => ({
      name: name.length > 20 ? name.slice(0, 20) + "…" : name,
      value: Math.round(value / 1e8) / 10,
      fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  }, [developmentAllocations]);

  const comparisonRows = useMemo(() => {
    return approvedAllocations.slice(0, 10).map((a: any) => ({
      name: a.entity_name,
      amount: Number(a.amount),
      prev: a.amount_previous ? Number(a.amount_previous) : 0,
    }));
  }, [approvedAllocations]);

  return (
    <div className="space-y-12">
      <SectionRenderer id="split" sectionRefs={sectionRefs}>
        <ReportHeader title="Development vs Recurrent" description="Development expenditure, capital projects, and sector investments" icon={Target} selectedYearLabel={selectedYearLabel} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Target className="size-4 text-primary" />Development vs Recurrent</CardTitle>
              <CardDescription>Split between development and recurrent expenditure</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedAllocations.length === 0 ? emptyDataFallback() : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <RechartPie>
                      <Pie data={[
                        { name: "Development", value: totalDevelopment / 1e9, fill: "hsl(142 76% 36%)" },
                        { name: "Recurrent", value: recurrentTotal / 1e9, fill: "hsl(221 83% 53%)" },
                      ].filter((d) => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        <Cell fill="hsl(142 76% 36%)" /><Cell fill="hsl(221 83% 53%)" />
                        <Label value={`KES ${(totalApproved / 1e12).toFixed(2)}T`} position="center" className="text-sm font-bold" />
                      </Pie>
                      <Tooltip formatter={formatKesBillions as any} />
                    </RechartPie>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: "hsl(142 76% 36%)" }} />
                      <span className="text-muted-foreground">Development</span>
                      <span className="font-medium tabular-nums">{shareOfTotal(totalDevelopment, totalApproved)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: "hsl(221 83% 53%)" }} />
                      <span className="text-muted-foreground">Recurrent</span>
                      <span className="font-medium tabular-nums">{shareOfTotal(recurrentTotal, totalApproved)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <SectionRenderer id="sector-investment" sectionRefs={sectionRefs}>
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Globe className="size-4 text-primary" />Sector Investment</CardTitle>
                <CardDescription>Development allocations by sector</CardDescription>
              </CardHeader>
              <CardContent>
                {sectorInvestmentData.length === 0 ? emptyDataFallback() : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sectorInvestmentData} layout="vertical" margin={{ left: 0, right: 30 }}>
                      <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                      <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                      <Tooltip formatter={formatKesBillions as any} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                        {sectorInvestmentData.map((_: any, i: number) => (<Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />))}
                        <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </SectionRenderer>
        </div>
      </SectionRenderer>

      {comparisonRows.length > 0 && (
        <SectionRenderer id="comparison" sectionRefs={sectionRefs}>
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Top Allocations by Entity</CardTitle>
              <CardDescription>Largest budget allocations and year-over-year change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="py-2 pr-4 text-left font-medium">Entity</th>
                      <th className="py-2 px-4 text-right font-medium">Current (KES)</th>
                      <th className="py-2 px-4 text-right font-medium">Previous (KES)</th>
                      <th className="py-2 pl-4 text-right font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row: any, i: number) => {
                      const diff = row.amount - row.prev;
                      const pct = row.prev > 0 ? ((diff / row.prev) * 100).toFixed(1) : "—";
                      return (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 pr-4 font-medium truncate max-w-[200px]">{row.name}</td>
                          <td className="py-2.5 px-4 text-right tabular-nums">{formatKesBillions(row.amount / 1e9, { prefix: false })}</td>
                          <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">{row.prev > 0 ? formatKesBillions(row.prev / 1e9, { prefix: false }) : "—"}</td>
                          <td className="py-2.5 pl-4 text-right">
                            <span className={cn(
                              "inline-flex items-center gap-0.5 tabular-nums font-medium",
                              diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"
                            )}>
                              {diff > 0 ? <ArrowUpRight className="size-3" /> : diff < 0 ? <ArrowDownRight className="size-3" /> : null}
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </SectionRenderer>
      )}
    </div>
  );
}

function RevenueAnalysis({ kpis, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const revenueKpis = kpis.filter((k: any) => k.key.includes("revenue") || k.key.includes("tax") || k.key.includes("income"));

  return (
    <div className="space-y-12">
      <SectionRenderer id="overview" sectionRefs={sectionRefs}>
        <ReportHeader title="Revenue Analysis" description="Tax and non-tax revenue composition" icon={Banknote} selectedYearLabel={selectedYearLabel} />
        {revenueKpis.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {revenueKpis.slice(0, 8).map((kpi: any) => (
              <KpiCard key={kpi.key} label={kpi.label} value={`${kpi.value}${kpi.suffix || ""}`} />
            ))}
          </div>
        ) : (
          <Card className="border-border/60 shadow-sm">
            <CardContent className="flex flex-col items-center gap-3 py-16">
              <Banknote className="size-12 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No revenue-specific KPIs available</p>
              <p className="text-xs text-muted-foreground/60">Add revenue KPIs to the budget system to populate this report</p>
            </CardContent>
          </Card>
        )}
      </SectionRenderer>

      <SectionRenderer id="composition" sectionRefs={sectionRefs}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><PieChartIcon className="size-4 text-primary" />Revenue Composition</CardTitle>
            <CardDescription>Total revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RechartPie>
                <Pie data={[
                  { name: "Total Revenue", value: totalBudget / 1e9, fill: "hsl(142 76% 36%)" },
                  { name: "Other", value: 0, fill: "hsl(221 83% 53%)" },
                ].filter((d) => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  <Label value={`KES ${(totalBudget / 1e12).toFixed(2)}T`} position="center" className="text-lg font-bold" />
                </Pie>
                <Tooltip formatter={formatKesBillions as any} />
              </RechartPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </SectionRenderer>
    </div>
  );
}

function SectorAllocations({ approvedAllocations, totalBudget, selectedYearLabel, sectionRefs }: any) {
  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of approvedAllocations) {
      const sector = a.entity_name.split(" - ")[0] || a.entity_name;
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 12).map(([name, value], i) => ({
      name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  }, [approvedAllocations]);

  const totalSectorAllocation = approvedAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);

  return (
    <div className="space-y-12">
      <SectionRenderer id="breakdown" sectionRefs={sectionRefs}>
        <ReportHeader title="Sector Allocations" description="Budget distribution across economic sectors" icon={PieChartIcon} selectedYearLabel={selectedYearLabel} />
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Sector Allocation</CardTitle>
            <CardDescription>Top 12 sectors by approved budget</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? emptyDataFallback() : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                  <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {sectorBreakdown.map((entry: any, idx: number) => (<Cell key={idx} fill={entry.fill} />))}
                    <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </SectionRenderer>

      <SectionRenderer id="details" sectionRefs={sectionRefs}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Sector Share Comparison</CardTitle>
            <CardDescription>How each sector compares to the total budget</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? emptyDataFallback() : (
              <div className="space-y-3">
                {sectorBreakdown.map((sector: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate max-w-[200px]">{sector.name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatKesBillions(sector.value)} ({totalSectorAllocation > 0 ? ((sector.value * 1e8 / totalSectorAllocation) * 100).toFixed(1) : "0"}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${totalSectorAllocation > 0 ? (sector.value * 1e8 / totalSectorAllocation) * 100 : 0}%`, backgroundColor: sector.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </SectionRenderer>
    </div>
  );
}
