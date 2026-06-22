"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  BookOpen,
  Building2,
  FileText,
  Globe,
  Landmark,
  Loader2,
  PieChart as PieChartIcon,
  RefreshCw,
  Scale,
  Shield,
  TrendingUp,
  User,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatKesBillions, formatKesTrillions, shareOfTotal } from "@/lib/budget-format";
import { fetchReportData, type ReportPageData } from "@/lib/reports-hub";
import { KpiCard, TrendIndicator, SECTOR_COLORS } from "@/components/reports/shared";
import { COUNTIES } from "@/constants/counties";

import budgetJson from "@/data/budget-fy2026-27.json";
const schema = budgetJson as any;

export default function ReportsPage() {
  const [data, setData] = useState<ReportPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [tab, setTab] = useState<"national" | "counties">("national");

  const fetchData = useCallback(async (year?: string) => {
    setLoading(true);
    try {
      const result = await fetchReportData("budget-overview", year);
      setData(result);
      setSelectedYear(result.selectedYear);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  const revKpi = (key: string) => kpis.find((k) => k.key === key);
  const rev = (key: string) => {
    const k = revKpi(key);
    return k ? Number(k.value) : 0;
  };

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of nationalAllocs) {
      const sector = a.entity_name.split(" - ")[0];
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).map(([name, value], i) => ({
      name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  }, [nationalAllocs]);

  const countyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of countyAllocs) map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);
    return Object.entries(map).map(([name, value]) => ({
      name: name.replace(" County Government", ""),
      value: Math.round(value / 1e8) / 10,
    })).sort((a, b) => b.value - a.value);
  }, [countyAllocs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <h1 className="text-base font-bold tracking-tight md:text-lg">Budget Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            {fiscalYears.length > 0 && (
              <div className="flex items-center gap-1 rounded-lg border bg-background p-0.5">
                {fiscalYears.map((fy) => (
                  <button key={fy.id} onClick={() => { setSelectedYear(fy.id); fetchData(fy.id); }}
                    className={cn("rounded-md px-2.5 py-1 text-[10px] font-bold whitespace-nowrap transition-all",
                      selectedYear === fy.id ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )} >
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

      <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setTab("national")} className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            tab === "national" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          )}>
            <Landmark className="size-4" /> National
          </button>
          <button onClick={() => setTab("counties")} className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            tab === "counties" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
          )}>
            <Building2 className="size-4" /> Counties
          </button>
        </div>

        {loading ? <LoadingSkeleton /> : tab === "national" ? (
          <NationalContent
            kpis={kpis} sectorBreakdown={sectorBreakdown} highlights={highlights}
            totalBudget={totalBudget} selectedYearLabel={selectedYearLabel}
          />
        ) : (
          <CountyContent
            countyBreakdown={countyBreakdown} totalCounty={totalCounty}
            totalBudget={totalBudget} selectedYearLabel={selectedYearLabel}
          />
        )}
      </div>

      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-screen-xl px-4 py-6 text-center text-xs text-muted-foreground">
          <Landmark className="size-4 mx-auto mb-1" />
          <p>Kenya National Budget Data — {selectedYearLabel}</p>
          <p className="mt-0.5">Presented by {schema.metadata?.presented_by ?? "National Treasury"} · Theme: {schema.metadata?.theme?.split(" for ")[0] ?? ""}</p>
        </div>
      </footer>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-28 rounded-xl" />))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

function NationalContent({ kpis, sectorBreakdown, highlights, totalBudget, selectedYearLabel }: any) {
  const r = (key: string) => { const k = kpis.find((x: any) => x.key === key); return k ? Number(k.value) : 0; };

  const revenueStreams = useMemo(() => [
    { name: "Ordinary Revenue (KRA)", value: r("ordinary_revenue") / 1e9, fill: "hsl(221 83% 53%)" },
    { name: "Appropriations-in-Aid", value: r("appropriations_in_aid") / 1e9, fill: "hsl(142 76% 36%)" },
    { name: "External Grants", value: r("grants") / 1e9, fill: "hsl(47 95% 48%)" },
  ].filter((d) => d.value > 0), [kpis]);

  const deficit = r("fiscal_deficit");
  const interest = r("interest_obligation");
  const ordinary = r("ordinary_revenue");

  return (
    <div className="space-y-8">
      {/* Theme Banner */}
      <Card className="border-border/60 shadow-sm bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <BookOpen className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Budget Theme</p>
              <p className="text-sm font-medium leading-relaxed">{schema.metadata?.theme ?? "Kenya Budget"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Presented by {schema.metadata?.presented_by ?? "National Treasury"} · {schema.metadata?.presented_date ?? selectedYearLabel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={formatKesTrillions(r("total_revenue") / 1e12)} subtitle={selectedYearLabel} />
        <KpiCard label="Ordinary Revenue" value={formatKesBillions(ordinary / 1e9)} subtitle="KRA collections" />
        <KpiCard label="Interest Obligation" value={formatKesBillions(interest / 1e9)} trend={-5.2} subtitle="Debt service cost" />
        <KpiCard label="Fiscal Deficit" value={formatKesBillions(deficit / 1e9)} trend={-((deficit / r("total_revenue")) * 100)} subtitle={`${(deficit / r("total_revenue") * 100).toFixed(1)}% of revenue`} />
      </div>

      {/* Revenue Breakdown + Sector Allocation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><PieChartIcon className="size-4 text-primary" />Revenue Streams</CardTitle>
            <CardDescription>Composition of total projected revenue for {selectedYearLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueStreams.length === 0 ? <EmptyState /> : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <RechartPie>
                    <Pie data={revenueStreams} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {revenueStreams.map((e: any, i: number) => (<Cell key={i} fill={e.fill} />))}
                      <Label value={formatKesTrillions(r("total_revenue") / 1e12)} position="center" className="text-lg font-bold" />
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
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Sector Allocation</CardTitle>
            <CardDescription>National budget share by sector</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sectorBreakdown} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                  <XAxis type="number" tickFormatter={(v: number) => `${v}B`} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={formatKesBillions as any} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {sectorBreakdown.map((e: any, i: number) => (<Cell key={i} fill={e.fill} />))}
                    <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debt & Borrowing */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Scale className="size-4 text-primary" />Debt & Financing</CardTitle>
          <CardDescription>Borrowing plan and fiscal sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Fiscal Deficit</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(deficit / 1e9)}</p>
              <p className="text-xs text-muted-foreground">{schema.macro_modules?.debt_portfolio?.deficit_gdp_ratio_pct ?? 5.5}% of GDP</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Domestic Borrowing</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions((schema.macro_modules?.debt_portfolio?.financing_plan?.domestic_borrowing_target ?? deficit * 0.9) / 1e9)}</p>
              <p className="text-xs text-muted-foreground">Target FY {selectedYearLabel.slice(-5)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">External Borrowing</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions((schema.macro_modules?.debt_portfolio?.financing_plan?.external_borrowing_target ?? deficit * 0.1) / 1e9)}</p>
              <p className="text-xs text-muted-foreground">Target FY {selectedYearLabel.slice(-5)}</p>
            </div>
          </div>

          {/* Systemic Risks */}
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

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((hl: any) => (
            <Card key={hl.id} className={cn(
              "border-l-4 shadow-sm",
              hl.type === "success" && "border-l-emerald-500",
              hl.type === "warning" && "border-l-amber-500",
              hl.type === "trend" && "border-l-blue-500",
              hl.type === "info" && "border-l-slate-400",
            )}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {hl.type === "success" ? <TrendingUp className="size-4 text-emerald-500 shrink-0 mt-0.5" /> :
                   hl.type === "warning" ? <ArrowUpRight className="size-4 text-amber-500 shrink-0 mt-0.5" /> :
                   <PieChartIcon className="size-4 text-blue-500 shrink-0 mt-0.5" />}
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

      {/* Source Documents Link */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <a href="/budgethub/dashboard/lms/documents" className="flex items-center gap-3 text-sm font-medium text-primary hover:underline">
            <FileText className="size-4" />
            View source budget documents
            <ArrowUpRight className="size-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function CountyContent({ countyBreakdown, totalCounty, totalBudget, selectedYearLabel }: any) {
  const envelope = schema.tier_2_county_devolution_envelope;
  const totalCountyActual = countyBreakdown.reduce((s: number, c: any) => s + c.value, 0) * 1e8;

  return (
    <div className="space-y-8">
      {/* Funding Split */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total Devolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatKesBillions((envelope?.total_devolution_allocation ?? totalCounty) / 1e9)}</p>
            <p className="text-[10px] text-muted-foreground">{envelope?.national_budget_share_pct ?? ((totalCounty / totalBudget) * 100).toFixed(1)}% of national</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Equitable Share</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatKesBillions((envelope?.funding_split?.unconditional_equitable_share ?? totalCounty * 0.85) / 1e9)}</p>
            <p className="text-[10px] text-muted-foreground">Unconditional</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Conditional Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatKesBillions((envelope?.funding_split?.additional_national_conditional_allocations ?? totalCounty * 0.1) / 1e9)}</p>
            <p className="text-[10px] text-muted-foreground">National + partner grants</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Counties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">47</p>
            <p className="text-[10px] text-muted-foreground">+ {COUNTIES.length} counties</p>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Allocation Breakdown */}
      {envelope?.conditional_allocation_breakdown?.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="size-4 text-primary" />Conditional Allocations Breakdown</CardTitle>
            <CardDescription>National conditional grants to county governments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {envelope.conditional_allocation_breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.item}</span>
                  <span className="tabular-nums text-muted-foreground">{formatKesBillions(item.amount / 1e9)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 10 Counties */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Top 10 Counties by Allocation</CardTitle>
          <CardDescription>Counties with the largest approved budgets for {selectedYearLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          {countyBreakdown.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={countyBreakdown.slice(0, 10)} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                <XAxis type="number" tickFormatter={(v: number) => `${v}B`} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Tooltip formatter={formatKesBillions as any} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18} fill="hsl(199 89% 48%)">
                  <LabelList dataKey="value" position="right" formatter={((v: number) => `${v}B`) as any} className="text-[10px] tabular-nums" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* All 47 Counties Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">All 47 Counties</CardTitle>
          <CardDescription>Full county budget allocations for {selectedYearLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-4 text-left font-medium">#</th>
                  <th className="py-2 pr-4 text-left font-medium">County</th>
                  <th className="py-2 px-4 text-right font-medium">Allocation (KES)</th>
                  <th className="py-2 pl-4 text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {countyBreakdown.map((c: any, i: number) => (
                  <tr key={c.name} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 pr-4 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 px-4 text-right tabular-nums">{formatKesBillions(c.value)}</td>
                    <td className="py-2 pl-4 text-right tabular-nums text-muted-foreground">
                      {totalCountyActual > 0 ? `${((c.value * 1e8 / totalCountyActual) * 100).toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
