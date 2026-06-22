"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  Landmark,
  Loader2,
  MapPin,
  PieChart as PieChartIcon,
  RefreshCw,
  Scale,
  TrendingUp,
  Users,
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

import { KpiCard, SECTOR_COLORS, TrendIndicator } from "@/components/reports/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COUNTIES } from "@/constants/counties";
import budgetJson from "@/data/budget-fy2026-27.json";
import { formatKesBillions, formatKesTrillions } from "@/lib/budget-format";
import { fetchReportData, type ReportPageData } from "@/lib/reports-hub";
import { cn } from "@/lib/utils";

const schema = budgetJson as any;

export default function ReportsPage() {
  const [data, setData] = useState<ReportPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [tab, setTab] = useState<"national" | "counties">("national");
  const [selectedCounty, setSelectedCounty] = useState<{ id: string; name: string; allocation: number } | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<{ id: string; name: string } | null>(null);

  const fetchData = useCallback(async (year?: string) => {
    setLoading(true);
    try {
      const result = await fetchReportData("budget-overview", year);
      setData(result);
      setSelectedYear(result.selectedYear);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fiscalYears = data?.fiscalYears ?? [];
  const allocations = data?.allocations ?? [];
  const kpis = data?.kpis ?? [];
  const entities = data?.entities ?? [];
  const highlights = data?.highlights ?? [];
  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";

  const approved = allocations.filter((a) => a.allocation_type === "approved");
  const totalBudget = approved.reduce((s, a) => s + Number(a.amount), 0);

  const nationalEntities = entities.filter((e) => e.type === "national").map((e) => e.id);
  const nationalAllocs = approved.filter((a) => nationalEntities.includes(a.entity));

  const countyEntityIds = entities.filter((e) => e.type === "county").map((e) => e.id);
  const countyAllocs = approved.filter((a) => countyEntityIds.includes(a.entity));
  const totalCounty = countyAllocs.reduce((s, a) => s + Number(a.amount), 0);

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of nationalAllocs) {
      const sector = a.entity_name.split(" - ")[0];
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value: Math.round(value / 1e8) / 10,
        fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
      }));
  }, [nationalAllocs]);

  const countyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of countyAllocs) map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
    return Object.entries(map)
      .map(([name, value]) => ({
        id: countyEntityIds[COUNTIES.findIndex((c) => `${c} County Government` === name)] ?? "",
        name: name.replace(" County Government", ""),
        value: Math.round(value / 1e8) / 10,
      }))
      .sort((a, b) => b.value - a.value);
  }, [countyAllocs, countyEntityIds]);

  const revKpi = (key: string) => kpis.find((k) => k.key === key);
  const rv = (key: string) => {
    const k = revKpi(key);
    return k ? Number(k.value) : 0;
  };

  const handleBack = useCallback(() => {
    if (selectedConstituency) setSelectedConstituency(null);
    else setSelectedCounty(null);
  }, [selectedConstituency]);

  const r = (key: string) => rv(key);
  const deficit = r("fiscal_deficit");
  const ordinary = r("ordinary_revenue");

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Sticky Header with Year Pills ─── */}
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
                    <button
                      key={fy.id}
                      onClick={() => {
                        setSelectedYear(fy.id);
                        fetchData(fy.id);
                        setSelectedCounty(null);
                        setSelectedConstituency(null);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40",
                      )}
                    >
                      {isCurrent && (
                        <span className="relative flex size-2">
                          <span
                            className={cn(
                              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                              isSelected ? "bg-primary-foreground/60" : "bg-primary/40",
                            )}
                          />
                          <span
                            className={cn(
                              "relative inline-flex size-2 rounded-full",
                              isSelected ? "bg-primary-foreground" : "bg-primary",
                            )}
                          />
                        </span>
                      )}
                      {fy.label.replace("FY ", "")}
                    </button>
                  );
                })}
              </div>
            )}
            <Button variant="outline" size="icon-sm" onClick={() => fetchData(selectedYear)} disabled={loading}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Outer Container ─── */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {!selectedCounty && !selectedConstituency && (
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setTab("national")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                tab === "national"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
              )}
            >
              <Landmark className="size-4" /> National
            </button>
            <button
              onClick={() => setTab("counties")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                tab === "counties"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
              )}
            >
              <Building2 className="size-4" /> Counties
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : selectedConstituency ? (
          <WardView
            constituency={selectedConstituency}
            allocations={approved}
            entities={entities}
            onBack={handleBack}
            selectedYearLabel={selectedYearLabel}
          />
        ) : tab === "national" ? (
          <NationalContent
            kpis={kpis}
            sectorBreakdown={sectorBreakdown}
            highlights={highlights}
            totalBudget={totalBudget}
            selectedYearLabel={selectedYearLabel}
            r={r}
            deficit={deficit}
            ordinary={ordinary}
          />
        ) : (
          <CountySelector
            countyBreakdown={countyBreakdown}
            selectedCounty={selectedCounty}
            allocations={approved}
            entities={entities}
            selectedYearLabel={selectedYearLabel}
            onSelectCounty={(c: { id: string; name: string; allocation: number } | null) => setSelectedCounty(c)}
            onSelectConstituency={setSelectedConstituency}
          />
        )}
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground">
          <Landmark className="size-4 mx-auto mb-1" />
          <p>Kenya National Budget Data — {selectedYearLabel}</p>
          <p className="mt-0.5">Presented by {schema.metadata?.presented_by ?? "National Treasury"}</p>
        </div>
      </footer>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-28 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-border/60 p-5">
        <div className="h-4 w-28 bg-muted rounded-full mb-2" />
        <div className="h-5 w-3/4 bg-muted rounded mb-2" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
      {/* Charts skeleton */}
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

// ─── National ───
function NationalContent({
  kpis,
  sectorBreakdown,
  highlights,
  totalBudget,
  selectedYearLabel,
  r,
  deficit,
  ordinary,
}: any) {
  const revenueStreams = useMemo(
    () =>
      [
        {
          name: "Ordinary Revenue (KRA)",
          value: r("appropriations_in_aid")
            ? (r("total_revenue") - r("appropriations_in_aid") - r("grants")) / 1e9
            : r("ordinary_revenue") / 1e9,
          fill: "hsl(221 83% 53%)",
        },
        { name: "Appropriations-in-Aid", value: r("appropriations_in_aid") / 1e9, fill: "hsl(142 76% 36%)" },
        { name: "External Grants", value: r("grants") / 1e9, fill: "hsl(47 95% 48%)" },
      ].filter((d) => d.value > 0),
    [kpis, r],
  );

  const interest = r("interest_obligation");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Hero/Budget Theme ── */}
      <Card className="border-border/60 shadow-sm bg-gradient-to-r from-primary/5 via-primary/3 to-transparent overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                {selectedYearLabel} Budget Theme
              </span>
              <p className="text-sm font-medium leading-relaxed mt-2 sm:text-base">
                {schema.metadata?.theme ?? "Kenya Budget"}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Landmark className="size-3" />
                  {schema.metadata?.presented_by ?? "National Treasury"}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {schema.metadata?.presented_date ?? selectedYearLabel}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatKesTrillions(r("total_revenue") / 1e12)}
          trend={8.1}
          subtitle={selectedYearLabel}
        />
        <KpiCard
          label="Ordinary Revenue"
          value={formatKesBillions(ordinary / 1e9)}
          trend={7.2}
          subtitle="KRA collections"
        />
        <KpiCard
          label="Interest Obligation"
          value={formatKesBillions(interest / 1e9)}
          trend={-5.2}
          subtitle="Debt service cost"
        />
        <KpiCard
          label="Fiscal Deficit"
          value={formatKesBillions(deficit / 1e9)}
          trend={-((deficit / r("total_revenue")) * 100)}
          subtitle={`${((deficit / r("total_revenue")) * 100).toFixed(1)}% of revenue`}
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="size-4 text-primary" />
              Revenue Streams
            </CardTitle>
            <CardDescription>Composition of total projected revenue for {selectedYearLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueStreams.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <RechartPie>
                    <Pie
                      data={revenueStreams}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {revenueStreams.map((e: any, i: number) => (
                        <Cell key={i} fill={e.fill} />
                      ))}
                      <Label
                        value={formatKesTrillions(r("total_revenue") / 1e12)}
                        position="center"
                        className="text-lg font-bold"
                      />
                    </Pie>
                    <Tooltip formatter={formatKesBillions as any} />
                  </RechartPie>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {revenueStreams.map((e: any, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: e.fill }} />
                      <span className="text-muted-foreground">{e.name}</span>
                      <span className="font-medium tabular-nums">{formatKesBillions(e.value)}</span>
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
              <TrendingUp className="size-4 text-primary" />
              Sector Allocation
            </CardTitle>
            <CardDescription>National budget share by sector</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <defs>
                    {sectorBreakdown.map((e: any, i: number) => (
                      <linearGradient key={e.name} id={`sector-bar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={e.fill} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={e.fill} stopOpacity={0.5} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                  <XAxis
                    type="number"
                    tickFormatter={((v: number) => `${v}B`) as any}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={18}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {sectorBreakdown.map((e: any, i: number) => (
                      <Cell key={i} fill={`url(#sector-bar-grad-${i})`} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={((v: number) => `${v}B`) as any}
                      className="text-[10px] tabular-nums"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Debt & Financing ── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="size-4 text-primary" />
            Debt & Financing
          </CardTitle>
          <CardDescription>Borrowing plan and fiscal sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Fiscal Deficit</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(deficit / 1e9)}</p>
              <p className="text-xs text-muted-foreground">
                {schema.macro_modules?.debt_portfolio?.deficit_gdp_ratio_pct ?? 5.5}% of GDP
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Domestic Borrowing
              </p>
              <p className="text-xl font-bold tabular-nums mt-1">
                {formatKesBillions(
                  (schema.macro_modules?.debt_portfolio?.financing_plan?.domestic_borrowing_target ?? deficit * 0.9) /
                    1e9,
                )}
              </p>
              <p className="text-xs text-muted-foreground">Target FY {selectedYearLabel.slice(-5)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                External Borrowing
              </p>
              <p className="text-xl font-bold tabular-nums mt-1">
                {formatKesBillions(
                  (schema.macro_modules?.debt_portfolio?.financing_plan?.external_borrowing_target ?? deficit * 0.1) /
                    1e9,
                )}
              </p>
              <p className="text-xs text-muted-foreground">Target FY {selectedYearLabel.slice(-5)}</p>
            </div>
          </div>
          {schema.macro_modules?.debt_portfolio?.systemic_risks?.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Systemic Risks</p>
              {schema.macro_modules.debt_portfolio.systemic_risks.map((risk: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Highlights ── */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {highlights.map((hl: any, i: number) => (
            <Card
              key={hl.id}
              className={cn(
                "border-l-4 shadow-sm",
                hl.type === "success" && "border-l-emerald-500",
                hl.type === "warning" && "border-l-amber-500",
                hl.type === "trend" && "border-l-blue-500",
                hl.type === "info" && "border-l-slate-400",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {hl.type === "success" ? (
                    <TrendingUp className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : hl.type === "warning" ? (
                    <ArrowUpRight className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <PieChartIcon className="size-4 text-blue-500 shrink-0 mt-0.5" />
                  )}
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

      {/* ── Source Documents ── */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <a
            href="/budgethub/dashboard/lms/documents"
            className="flex items-center gap-3 text-sm font-medium text-primary hover:underline"
          >
            <FileText className="size-4" />
            View source budget documents
            <ArrowUpRight className="size-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── County Selector (dropdown + profile) ───
function CountySelector({
  countyBreakdown,
  selectedCounty,
  allocations,
  entities,
  selectedYearLabel,
  onSelectCounty,
  onSelectConstituency,
}: any) {
  const matchingCounty = selectedCounty ? countyBreakdown.find((c: any) => c.id === selectedCounty.id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="size-5 text-primary shrink-0" />
        <select
          value={selectedCounty?.id ?? ""}
          onChange={(e) => {
            const found = countyBreakdown.find((c: any) => c.id === e.target.value);
            onSelectCounty(found ? { id: found.id, name: found.name, allocation: found.value * 1e8 } : null);
          }}
          className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
        >
          <option value="">Select a county...</option>
          {countyBreakdown.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCounty && matchingCounty && (
        <CountyProfile
          county={selectedCounty}
          allocations={allocations}
          entities={entities}
          onBack={() => onSelectCounty(null)}
          onSelectConstituency={onSelectConstituency}
          selectedYearLabel={selectedYearLabel}
        />
      )}

      {!selectedCounty && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Building2 className="size-12 text-muted-foreground/20" />
          <p className="text-sm">Select a county above to view its budget profile</p>
        </div>
      )}
    </div>
  );
}

// ─── County Profile (sectors + constituencies) ───
function CountyProfile({ county, allocations, entities, onBack, onSelectConstituency, selectedYearLabel }: any) {
  const countyAllocs = allocations.filter((a: any) => a.entity_type === "county" && a.entity === county.id);
  const countyTotal = countyAllocs.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const constituencyEntities = entities.filter((e: any) => e.type === "constituency" && e.parent === county.id);
  const constituencyAllocs = allocations.filter(
    (a: any) => a.entity_type === "constituency" && a.entity.startsWith(`const-${county.id.split("-")[1]}`),
  );
  const totalConstituency = constituencyAllocs.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const constWithAllocs = constituencyEntities
    .map((e: any) => {
      const alloc = constituencyAllocs.filter((a: any) => a.entity === e.id);
      return { ...e, totalAlloc: alloc.reduce((s: number, a: any) => s + Number(a.amount), 0) };
    })
    .sort((a: any, b: any) => b.totalAlloc - a.totalAlloc);

  const maxConstAlloc = constWithAllocs.length > 0 ? Math.max(...constWithAllocs.map((c: any) => c.totalAlloc)) : 1;

  // Sector breakdown for county
  const sectorMap: Record<string, number> = {};
  for (const a of countyAllocs) {
    const parts = a.entity_name.split(" - ");
    const sector = parts.length > 1 ? parts[0] : a.entity_name;
    sectorMap[sector] = (sectorMap[sector] || 0) + Number(a.amount);
  }
  const countySectors = Object.entries(sectorMap)
    .map(([name, value], i) => ({
      name,
      value: Math.round(value / 1e8) / 10,
      fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }))
    .sort((a: any, b: any) => b.value - a.value);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to all counties
      </button>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <MapPin className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{county.name} County</h2>
          <p className="text-xs text-muted-foreground">Budget profile for {selectedYearLabel}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(countyTotal / 1e9)}</p>
          <p className="text-[10px] text-muted-foreground">Total Allocation</p>
        </div>
      </div>

      {countySectors.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Sector Allocations
            </CardTitle>
            <CardDescription>Budget breakdown by sector for {county.name} County</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countySectors.map((s: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{s.name}</span>
                    <span className="tabular-nums text-muted-foreground">{formatKesBillions(s.value)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${((s.value * 1e8) / countyTotal) * 100}%`, backgroundColor: s.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constituencies table with mini bars */}
      {constWithAllocs.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Constituencies
            </CardTitle>
            <CardDescription>
              {constWithAllocs.length} constituencies in {county.name} County
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4 text-left font-medium">Constituency</th>
                    <th className="py-2 px-4 text-right font-medium">Allocation (KES)</th>
                    <th className="py-2 pl-4 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {constWithAllocs.map((c: any) => {
                    const share = totalConstituency > 0 ? (c.totalAlloc / totalConstituency) * 100 : 0;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => onSelectConstituency({ id: c.id, name: c.name })}
                        className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 pr-4 font-medium flex items-center gap-1">
                          {c.name}
                          <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums">{formatKesBillions(c.totalAlloc / 1e9)}</td>
                        <td className="py-2.5 pl-4 text-right tabular-nums text-muted-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <div className="hidden sm:block w-14 h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary/50 transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(share, 100)}%` }}
                              />
                            </div>
                            <span>{share.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Ward View ───
function WardView({ constituency, allocations, entities, onBack, selectedYearLabel }: any) {
  const wardEntities = entities.filter((e: any) => e.type === "ward" && e.parent === constituency.id);
  const constPrefix = constituency.id.split("-").slice(0, 3).join("-");
  const wardAllocs = allocations.filter((a: any) => a.entity_type === "ward" && a.entity.startsWith(constPrefix));
  const totalWards = wardAllocs.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const wardsWithAllocs = wardEntities
    .map((e: any) => {
      const alloc = wardAllocs.filter((a: any) => a.entity === e.id);
      return { ...e, totalAlloc: alloc.reduce((s: number, a: any) => s + Number(a.amount), 0) };
    })
    .sort((a: any, b: any) => b.totalAlloc - a.totalAlloc);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to county profile
      </button>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5">
          <MapPin className="size-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{constituency.name}</h2>
          <p className="text-xs text-muted-foreground">Ward-level budget breakdown for {selectedYearLabel}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(totalWards / 1e9)}</p>
          <p className="text-[10px] text-muted-foreground">Total Ward Allocation</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            Wards
          </CardTitle>
          <CardDescription>
            {wardsWithAllocs.length} wards in {constituency.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wardsWithAllocs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4 text-left font-medium">Ward</th>
                    <th className="py-2 px-4 text-right font-medium">Allocation (KES)</th>
                    <th className="py-2 pl-4 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {wardsWithAllocs.map((w: any) => {
                    const share = totalWards > 0 ? (w.totalAlloc / totalWards) * 100 : 0;
                    return (
                      <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 pr-4 font-medium">{w.name}</td>
                        <td className="py-2.5 px-4 text-right tabular-nums">{formatKesBillions(w.totalAlloc / 1e9)}</td>
                        <td className="py-2.5 pl-4 text-right tabular-nums text-muted-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <div className="hidden sm:block w-14 h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-amber-500/50 transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(share, 100)}%` }}
                              />
                            </div>
                            <span>{share.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <PieChartIcon className="size-10 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">No data available</p>
    </div>
  );
}
