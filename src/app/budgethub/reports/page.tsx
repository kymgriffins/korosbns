"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  ChevronDown,
  Crosshair,
  Download,
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
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  fetchBudgetFiscalYears,
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetEntities,
  fetchBudgetHighlights,
  type BudgetFiscalYear,
  type BudgetAllocation,
  type BudgetKpiRaw,
  type BudgetEntity,
  type BudgetHighlightRaw,
} from "@/lib/budget-api";
import { formatKesBillions, formatKesTrillions, percentChange, shareOfTotal } from "@/lib/budget-format";
import { COUNTIES } from "@/constants/counties";

const SECTOR_COLORS = [
  "hsl(221 83% 53%)", "hsl(262 83% 58%)", "hsl(199 89% 48%)",
  "hsl(142 76% 36%)", "hsl(24 95% 53%)", "hsl(346 77% 50%)",
  "hsl(47 95% 48%)", "hsl(173 80% 40%)", "hsl(271 81% 56%)",
  "hsl(12 76% 61%)", "hsl(160 84% 39%)", "hsl(31 95% 50%)",
];

const SECTIONS = [
  { id: "overview", label: "National Overview", icon: Landmark },
  { id: "counties", label: "County Budgets", icon: Building2 },
  { id: "defense", label: "Defense & Security", icon: Shield },
  { id: "projects", label: "Projects & Development", icon: Target },
  { id: "documents", label: "Source Documents", icon: FileText },
] as const;

function formatValue(value: number): string {
  if (value >= 1000) return formatKesTrillions(value);
  return formatKesBillions(value);
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs"><ArrowUpRight className="size-3" />{value.toFixed(1)}%</span>;
  if (value < 0) return <span className="flex items-center gap-0.5 text-red-600 text-xs"><ArrowDownRight className="size-3" />{Math.abs(value).toFixed(1)}%</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="size-3" />0%</span>;
}

function KpiCard({ label, value, trend, subtitle }: { label: string; value: string; trend?: number; subtitle?: string }) {
  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-1.5">
        <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        {trend !== undefined && <TrendIndicator value={trend} />}
        {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function TocNav({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  return (
    <nav className="space-y-0.5 sticky top-24">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">Contents</p>
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onNavigate(s.id)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left",
            activeSection === s.id
              ? "bg-primary/10 text-primary shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <s.icon className="size-3.5 shrink-0" />
          {s.label}
        </button>
      ))}
    </nav>
  );
}

function MobileToc({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const active = SECTIONS.find((s) => s.id === activeSection);
  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium shadow-xs"
      >
        <ListTree className="size-4 text-muted-foreground" />
        <span className="flex-1 text-left">{active?.label ?? "Table of Contents"}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-card p-1 shadow-lg">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => { onNavigate(s.id); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <s.icon className="size-3.5" />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export ListTree for the mobile toc
function ListTree({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h10"/><path d="M8 18h7"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>;
}

export default function ReportsPage() {
  const [fiscalYears, setFiscalYears] = useState<BudgetFiscalYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [kpis, setKpis] = useState<BudgetKpiRaw[]>([]);
  const [entities, setEntities] = useState<BudgetEntity[]>([]);
  const [highlights, setHighlights] = useState<BudgetHighlightRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const fetchData = useCallback(async (year?: string) => {
    setLoading(true);
    try {
      const [yearsRes, entitiesRes] = await Promise.all([
        fetchBudgetFiscalYears(),
        fetchBudgetEntities(),
      ]);
      setFiscalYears(yearsRes);
      setEntities(entitiesRes);

      const targetYear = year || yearsRes.find((y) => y.is_current)?.id || yearsRes[0]?.id || "";
      if (targetYear) {
        setSelectedYear(targetYear);
        const [allocRes, kpiRes, hlRes] = await Promise.all([
          fetchBudgetAllocations({ fiscal_year: targetYear }),
          fetchBudgetKpis({ fiscal_year: targetYear }),
          fetchBudgetHighlights({ fiscal_year: targetYear }),
        ]);
        setAllocations(allocRes);
        setKpis(kpiRes);
        setHighlights(hlRes);
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleYearChange = useCallback((yearId: string) => {
    setSelectedYear(yearId);
    fetchData(yearId);
  }, [fetchData]);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
    for (const ref of Object.values(sectionRefs.current)) {
      if (ref) observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [loading]);

  // ── Derived Data ──
  const approvedAllocations = useMemo(() => allocations.filter((a) => a.allocation_type === "approved"), [allocations]);
  const proposedAllocations = useMemo(() => allocations.filter((a) => a.allocation_type === "proposed"), [allocations]);

  const nationalAllocations = useMemo(() => {
    const nationalEntities = entities.filter((e) => e.type === "national").map((e) => e.id);
    return approvedAllocations.filter((a) => nationalEntities.includes(a.entity));
  }, [approvedAllocations, entities]);

  const countyAllocations = useMemo(() => {
    const countyEntities = entities.filter((e) => e.type === "county").map((e) => e.id);
    return approvedAllocations.filter((a) => countyEntities.includes(a.entity));
  }, [approvedAllocations, entities]);

  const defenseAllocations = useMemo(() => {
    const defenseEntities = entities.filter((e) => e.type === "defense" || e.name.toLowerCase().includes("defence") || e.name.toLowerCase().includes("security")).map((e) => e.id);
    return approvedAllocations.filter((a) => defenseEntities.includes(a.entity));
  }, [approvedAllocations, entities]);

  const developmentAllocations = useMemo(() => {
    return approvedAllocations.filter((a) => a.entity_name.toLowerCase().includes("development"));
  }, [approvedAllocations]);

  const totalBudget = useMemo(() => approvedAllocations.reduce((sum, a) => sum + Number(a.amount), 0), [approvedAllocations]);

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of approvedAllocations) {
      const sector = a.entity_name.split(" - ")[0] || a.entity_name;
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([name, value], i) => ({ name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length] }));
  }, [approvedAllocations]);

  const revenueExpenditure = useMemo(() => {
    const kpi = kpis.find((k) => k.key === "total_revenue" || k.key === "total_expenditure");
    return [
      { name: "Revenue", value: kpis.find((k) => k.key === "total_revenue") ? Number(kpis.find((k) => k.key === "total_revenue")!.value) / 1e9 : 0, fill: "hsl(142 76% 36%)" },
      { name: "Expenditure", value: kpis.find((k) => k.key === "total_expenditure") ? Number(kpis.find((k) => k.key === "total_expenditure")!.value) / 1e9 : totalBudget / 1e9, fill: "hsl(346 77% 50%)" },
      { name: "Deficit", value: Math.abs((kpis.find((k) => k.key === "total_revenue") ? Number(kpis.find((k) => k.key === "total_revenue")!.value) : 0) - (kpis.find((k) => k.key === "total_expenditure") ? Number(kpis.find((k) => k.key === "total_expenditure")!.value) : totalBudget)) / 1e9, fill: "hsl(47 95% 48%)" },
    ].filter((d) => d.value > 0);
  }, [kpis, totalBudget]);

  const countyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of countyAllocations) {
      map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value / 1e8) / 10 }))
      .sort((a, b) => b.value - a.value);
  }, [countyAllocations]);

  const topCounties = useMemo(() => countyBreakdown.slice(0, 10), [countyBreakdown]);
  const nationalDeficit = useMemo(() => {
    const rev = kpis.find((k) => k.key === "total_revenue");
    const exp = kpis.find((k) => k.key === "total_expenditure");
    if (rev && exp) return Number(rev.value) - Number(exp.value);
    return 0;
  }, [kpis]);
  const budgetGrowth = useMemo(() => {
    const current = kpis.find((k) => k.key === "total_expenditure");
    if (current?.previous_value) return percentChange(Number(current.value), Number(current.previous_value));
    return "—";
  }, [kpis]);

  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight md:text-lg">Budget Reports</h1>
              <p className="truncate text-[10px] text-muted-foreground hidden sm:block">
                Kenya Budget Analysis & Visualization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {fiscalYears.length > 0 && (
              <div className="flex items-center gap-1 rounded-lg border bg-background p-0.5">
                {fiscalYears.slice(0, 5).map((fy) => (
                  <button
                    key={fy.id}
                    onClick={() => handleYearChange(fy.id)}
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
            <Button variant="outline" size="icon-sm" onClick={() => fetchData(selectedYear)} disabled={loading}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
        {/* Mobile ToC */}
        <div className="mb-4 lg:hidden">
          <MobileToc activeSection={activeSection} onNavigate={scrollToSection} />
        </div>

        <div className="flex gap-8">
          {/* Desktop ToC */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <TocNav activeSection={activeSection} onNavigate={scrollToSection} />
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1 space-y-12">
            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}><CardHeader><Skeleton className="h-3 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-28" /><Skeleton className="mt-1 h-3 w-16" /></CardContent></Card>
                  ))}
                </div>
                <Skeleton className="h-72 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ) : (
              <>
                {/* ── National Overview ── */}
                <section id="overview" ref={(el) => { sectionRefs.current["overview"] = el; }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <Landmark className="size-5 text-primary" />
                      National Budget Overview
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Key fiscal indicators for {selectedYearLabel}
                    </p>
                  </div>

                  {/* KPI Cards */}
                  <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <KpiCard
                      label="Total Budget"
                      value={formatValue(totalBudget / 1e9)}
                      subtitle={`${selectedYearLabel}`}
                    />
                    <KpiCard
                      label="Revenue"
                      value={kpis.find((k) => k.key === "total_revenue") ? formatKesBillions(Number(kpis.find((k) => k.key === "total_revenue")!.value) / 1e9) : "—"}
                    />
                    <KpiCard
                      label="Expenditure"
                      value={kpis.find((k) => k.key === "total_expenditure") ? formatKesBillions(Number(kpis.find((k) => k.key === "total_expenditure")!.value) / 1e9) : formatKesBillions(totalBudget / 1e9)}
                    />
                    <KpiCard
                      label="Fiscal Deficit"
                      value={formatKesBillions(Math.abs(nationalDeficit) / 1e9)}
                      trend={nationalDeficit < 0 ? -Math.abs(nationalDeficit) / (kpis.find((k) => k.key === "total_revenue") ? Number(kpis.find((k) => k.key === "total_revenue")!.value) : 1) * 100 : undefined}
                      subtitle={nationalDeficit < 0 ? "Expenditure exceeds revenue" : "Budget surplus"}
                    />
                  </div>

                  {/* Additional KPIs from API */}
                  {kpis.length > 3 && (
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {kpis.filter((k) => !["total_revenue", "total_expenditure"].includes(k.key)).slice(0, 5).map((kpi) => (
                        <KpiCard key={kpi.key} label={kpi.label} value={`${kpi.value}${kpi.suffix || ""}`} />
                      ))}
                    </div>
                  )}

                  {/* Revenue vs Expenditure + Sector Breakdown */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Revenue vs Expenditure Pie */}
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <PieChartIcon className="size-4 text-primary" />
                          Revenue vs Expenditure
                        </CardTitle>
                        <CardDescription>Budget composition for {selectedYearLabel}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {revenueExpenditure.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-12"><PieChartIcon className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No budget data available</p></div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={260}>
                              <PieChart>
                                <Pie data={revenueExpenditure} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                  {revenueExpenditure.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.fill} />
                                  ))}
                                  <Label value={`KES ${(totalBudget / 1e12).toFixed(2)}T`} position="center" className="text-lg font-bold" />
                                </Pie>
                                <Tooltip formatter={formatKesBillions as any} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-4 mt-2">
                              {revenueExpenditure.map((entry, idx) => (
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

                    {/* Sector Breakdown Bar */}
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="size-4 text-primary" />
                          Sector Allocation
                        </CardTitle>
                        <CardDescription>Top sectors by approved budget</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {sectorBreakdown.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-12"><TrendingUp className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No sector data available</p></div>
                        ) : (
                          <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                              <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                              <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                              <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                              <Tooltip formatter={formatKesBillions as any} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                                {sectorBreakdown.map((entry, idx) => (
                                  <Cell key={idx} fill={entry.fill} />
                                ))}
                                <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {highlights.slice(0, 3).map((hl) => (
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
                  )}

                  {/* Budget Growth */}
                  {budgetGrowth !== "—" && (
                    <Card className="mt-6 border-border/60 shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
                      <CardContent className="flex items-center gap-3 p-4">
                        <TrendingUp className="size-5 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Budget Growth</p>
                          <p className="text-xs text-muted-foreground">
                            The total budget changed by <span className="font-bold text-foreground">{budgetGrowth}</span> compared to the previous fiscal year
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>

                {/* ── County Budgets ── */}
                <section id="counties" ref={(el) => { sectionRefs.current["counties"] = el; }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <Building2 className="size-5 text-primary" />
                      County Budgets
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Budget allocations across 47 counties — equitable share and own-source revenue
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="border-border/60 shadow-sm lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BarChartIcon className="size-4 text-primary" />
                          Top 10 Counties by Allocation
                        </CardTitle>
                        <CardDescription>Counties with the largest approved budgets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {topCounties.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-12"><Building2 className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No county data available</p></div>
                        ) : (
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

                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="size-4 text-primary" />
                          County Summary
                        </CardTitle>
                        <CardDescription>Aggregate county budget metrics</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total County Allocation</p>
                          <p className="text-2xl font-bold tabular-nums mt-1">
                            {formatKesBillions(countyAllocations.reduce((s, a) => s + Number(a.amount), 0) / 1e9)}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-[10px] text-muted-foreground">Counties</p>
                            <p className="text-lg font-bold tabular-nums">47</p>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-[10px] text-muted-foreground">Share of Budget</p>
                            <p className="text-lg font-bold tabular-nums">
                              {totalBudget > 0 ? `${((countyAllocations.reduce((s, a) => s + Number(a.amount), 0) / totalBudget) * 100).toFixed(1)}%` : "—"}
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
                  </div>

                  {/* County Allocation Comparison (if proposed data exists) */}
                  {countyAllocations.length > 0 && proposedAllocations.length > 0 && (
                    <Card className="mt-6 border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm">Approved vs Proposed - County Allocations</CardTitle>
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
                  )}
                </section>

                {/* ── Defense & Security ── */}
                <section id="defense" ref={(el) => { sectionRefs.current["defense"] = el; }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <Shield className="size-5 text-primary" />
                      Defense & Security Budget
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allocation to national defense, internal security, and peace initiatives
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm">Total Defense Allocation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold tabular-nums">
                          {formatKesBillions(defenseAllocations.reduce((s, a) => s + Number(a.amount), 0) / 1e9)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalBudget > 0 ? `${((defenseAllocations.reduce((s, a) => s + Number(a.amount), 0) / totalBudget) * 100).toFixed(1)}% of total budget` : ""}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Crosshair className="size-4 text-primary" />
                          Defense Entities Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {defenseAllocations.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-8"><Shield className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No defense allocation data available</p></div>
                        ) : (
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={defenseAllocations.map((a) => ({ name: a.entity_name.split(" - ").pop() || a.entity_name, value: Math.round(Number(a.amount) / 1e8) / 10 }))} layout="vertical" margin={{ left: 0, right: 30 }}>
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
                  </div>
                </section>

                {/* ── Projects & Development ── */}
                <section id="projects" ref={(el) => { sectionRefs.current["projects"] = el; }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <Target className="size-5 text-primary" />
                      Projects & Development
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Development expenditure, capital projects, and sector investments
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Target className="size-4 text-primary" />
                          Development vs Recurrent
                        </CardTitle>
                        <CardDescription>Split between development and recurrent expenditure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {approvedAllocations.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-12"><Target className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No allocation data available</p></div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={240}>
                              <PieChart>
                                <Pie data={[
                                  { name: "Development", value: developmentAllocations.reduce((s, a) => s + Number(a.amount), 0) / 1e9, fill: "hsl(142 76% 36%)" },
                                  { name: "Recurrent", value: (approvedAllocations.reduce((s, a) => s + Number(a.amount), 0) - developmentAllocations.reduce((s, a) => s + Number(a.amount), 0)) / 1e9, fill: "hsl(221 83% 53%)" },
                                ].filter((d) => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                  {(developmentAllocations.length > 0 ? [
                                    { name: "Development", value: developmentAllocations.reduce((s, a) => s + Number(a.amount), 0) / 1e9, fill: "hsl(142 76% 36%)" },
                                    { name: "Recurrent", value: (approvedAllocations.reduce((s, a) => s + Number(a.amount), 0) - developmentAllocations.reduce((s, a) => s + Number(a.amount), 0)) / 1e9, fill: "hsl(221 83% 53%)" },
                                  ].filter((d) => d.value > 0) : []).map((entry, idx) => (
                                    <Cell key={idx} fill={entry.fill} />
                                  ))}
                                  <Label value={`KES ${(approvedAllocations.reduce((s, a) => s + Number(a.amount), 0) / 1e12).toFixed(2)}T`} position="center" className="text-sm font-bold" />
                                </Pie>
                                <Tooltip formatter={formatKesBillions as any} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-4 mt-2">
                              {[
                                { name: "Development", value: developmentAllocations.reduce((s, a) => s + Number(a.amount), 0), fill: "hsl(142 76% 36%)" },
                                { name: "Recurrent", value: approvedAllocations.reduce((s, a) => s + Number(a.amount), 0) - developmentAllocations.reduce((s, a) => s + Number(a.amount), 0), fill: "hsl(221 83% 53%)" },
                              ].filter((d) => d.value > 0).map((entry, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs">
                                  <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                                  <span className="text-muted-foreground">{entry.name}</span>
                                  <span className="font-medium tabular-nums">{shareOfTotal(entry.value, approvedAllocations.reduce((s, a) => s + Number(a.amount), 0))}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Globe className="size-4 text-primary" />
                          Sector Investment
                        </CardTitle>
                        <CardDescription>Development allocations by sector</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {developmentAllocations.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 py-12"><Globe className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No project data available</p></div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={(() => {
                                const map: Record<string, number> = {};
                                for (const a of developmentAllocations) {
                                  map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
                                }
                                return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value], i) => ({
                                  name: name.length > 20 ? name.slice(0, 20) + "…" : name,
                                  value: Math.round(value / 1e8) / 10,
                                  fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
                                }));
                              })()}
                              layout="vertical" margin={{ left: 0, right: 30 }}
                            >
                              <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                              <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                              <YAxis type="category" dataKey="name" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                              <Tooltip formatter={formatKesBillions as any} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                                {(() => {
                                  const map: Record<string, number> = {};
                                  for (const a of developmentAllocations) {
                                    map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
                                  }
                                  return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 8).map((_, i) => i);
                                })().map((i) => (
                                  <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                                ))}
                                <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Budget Comparison Table */}
                  {(() => {
                    const rows = approvedAllocations.slice(0, 10).map((a) => ({
                      name: a.entity_name,
                      amount: Number(a.amount),
                      prev: a.amount_previous ? Number(a.amount_previous) : 0,
                    }));
                    if (rows.length === 0) return null;
                    return (
                      <Card className="mt-6 border-border/60 shadow-sm">
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
                                {rows.map((row, i) => {
                                  const diff = row.amount - row.prev;
                                  const pct = row.prev > 0 ? ((diff / row.prev) * 100).toFixed(1) : "—";
                                  const isUp = diff > 0;
                                  return (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                      <td className="py-2.5 pr-4 font-medium truncate max-w-[200px]">{row.name}</td>
                                      <td className="py-2.5 px-4 text-right tabular-nums">{formatKesBillions(row.amount / 1e9, { prefix: false })}</td>
                                      <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">{row.prev > 0 ? formatKesBillions(row.prev / 1e9, { prefix: false }) : "—"}</td>
                                      <td className="py-2.5 pl-4 text-right">
                                        <span className={cn(
                                          "inline-flex items-center gap-0.5 tabular-nums font-medium",
                                          isUp ? "text-emerald-600" : diff < 0 ? "text-red-600" : "text-muted-foreground"
                                        )}>
                                          {isUp ? <ArrowUpRight className="size-3" /> : diff < 0 ? <ArrowDownRight className="size-3" /> : null}
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
                    );
                  })()}
                </section>

                {/* ── Source Documents ── */}
                <section id="documents" ref={(el) => { sectionRefs.current["documents"] = el; }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <FileText className="size-5 text-primary" />
                      Source Documents
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Official budget documents underlying these reports
                    </p>
                  </div>

                  <Card className="border-border/60 shadow-sm">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { name: "Budget Policy Statement", doc: "BPS", desc: "National budget framework and fiscal strategy" },
                          { name: "County Fiscal Strategy Papers", doc: "CFSP", desc: "County-level fiscal strategies" },
                          { name: "Annual Development Plan", doc: "ADP", desc: "Development plan and project priorities" },
                          { name: "Programme-Based Budgeting", doc: "PBB", desc: "Programme-based budget estimates" },
                          { name: "Appropriation Act", doc: "APP ACT", desc: "Legal appropriation of funds" },
                          { name: "Controller & Auditor General", doc: "CFA", desc: "Audit reports and financial oversight" },
                        ].map((item) => (
                          <a key={item.doc}
                            href={`/budgethub/dashboard/lms/documents`}
                            className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/40 hover:shadow-sm group"
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                              <FileText className="size-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                            </div>
                            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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

// SVG icon component for BarChartIcon
function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );
}
