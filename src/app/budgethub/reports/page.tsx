"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Landmark,
  Loader2,
  Minus,
  PieChart as PieChartIcon,
  RefreshCw,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatKesBillions, shareOfTotal } from "@/lib/budget-format";
import { fetchReportData, type ReportPageData } from "@/lib/reports-hub";
import {
  KpiCard,
  TrendIndicator,
  SECTOR_COLORS,
  BarChartIcon,
} from "@/components/reports/shared";

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

  const approvedAllocations = allocations.filter((a) => a.allocation_type === "approved");
  const totalBudget = approvedAllocations.reduce((sum, a) => sum + Number(a.amount), 0);

  const nationalEntities = entities.filter((e) => e.type === "national").map((e) => e.id);
  const nationalAllocations = approvedAllocations.filter((a) => nationalEntities.includes(a.entity));

  const countyEntities = entities.filter((e) => e.type === "county").map((e) => e.id);
  const countyAllocations = approvedAllocations.filter((a) => countyEntities.includes(a.entity));
  const totalCountyAllocation = countyAllocations.reduce((s, a) => s + Number(a.amount), 0);

  const nationalDeficit = useMemo(() => {
    const rev = kpis.find((k) => k.key === "total_revenue");
    const exp = kpis.find((k) => k.key === "total_expenditure");
    if (rev && exp) return Number(rev.value) - Number(exp.value);
    return 0;
  }, [kpis]);

  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    const src = tab === "national" ? nationalAllocations : countyAllocations;
    for (const a of src) {
      const sector = a.entity_name.split(" - ")[0] || a.entity_name;
      map[sector] = (map[sector] || 0) + Number(a.amount);
    }
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 12).map(([name, value], i) => ({
      name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  }, [nationalAllocations, countyAllocations, tab]);

  const revenueExpenditure = useMemo(() => {
    const rev = kpis.find((k) => k.key === "total_revenue");
    const exp = kpis.find((k) => k.key === "total_expenditure");
    return [
      { name: "Revenue", value: rev ? Number(rev.value) / 1e9 : 0, fill: "hsl(142 76% 36%)" },
      { name: "Expenditure", value: exp ? Number(exp.value) / 1e9 : totalBudget / 1e9, fill: "hsl(346 77% 50%)" },
      { name: "Deficit", value: Math.abs(nationalDeficit) / 1e9, fill: "hsl(47 95% 48%)" },
    ].filter((d) => d.value > 0);
  }, [kpis, totalBudget, nationalDeficit]);

  const countyBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of countyAllocations) {
      const county = a.entity_name.split(" - ")[0] || a.entity_name;
      map[county] = (map[county] || 0) + Number(a.amount);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value / 1e8) / 10 })).sort((a, b) => b.value - a.value);
  }, [countyAllocations]);

  const topCounties = countyBreakdown.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Sticky Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <h1 className="text-base font-bold tracking-tight md:text-lg">Budget Reports</h1>
          </div>

          <div className="flex items-center gap-2">
            {fiscalYears.length > 0 && (
              <div className="flex items-center gap-1 rounded-lg border bg-background p-0.5">
                {fiscalYears.map((fy) => (
                  <button
                    key={fy.id}
                    onClick={() => { setSelectedYear(fy.id); fetchData(fy.id); }}
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

      <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-6">
        {/* National / Counties Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setTab("national")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              tab === "national"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            <Landmark className="size-4" />
            National
          </button>
          <button
            onClick={() => setTab("counties")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              tab === "counties"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            <Building2 className="size-4" />
            Counties
          </button>
        </div>

        {loading ? <LoadingSkeleton /> : (
          tab === "national" ? (
            <NationalView
              kpis={kpis}
              totalBudget={totalBudget}
              nationalDeficit={nationalDeficit}
              revenueExpenditure={revenueExpenditure}
              sectorBreakdown={sectorBreakdown}
              highlights={highlights}
              selectedYearLabel={selectedYearLabel}
            />
          ) : (
            <CountiesView
              countyBreakdown={countyBreakdown}
              topCounties={topCounties}
              totalCountyAllocation={totalCountyAllocation}
              totalBudget={totalBudget}
              selectedYearLabel={selectedYearLabel}
              countyAllocations={countyAllocations}
            />
          )
        )}
      </div>

      <footer className="border-t bg-card/30 mt-12">
        <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-6">
          <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
            <Landmark className="size-4" />
            <p>Budget data sourced from the Kenya National Treasury and County Governments — {selectedYearLabel}</p>
          </div>
        </div>
      </footer>
    </div>
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

function NationalView({ kpis, totalBudget, nationalDeficit, revenueExpenditure, sectorBreakdown, highlights, selectedYearLabel }: any) {
  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Budget" value={`KES ${(totalBudget / 1e12).toFixed(2)}T`} subtitle={selectedYearLabel} />
        <KpiCard
          label="Revenue"
          value={(() => {
            const r = kpis.find((k: any) => k.key === "total_revenue");
            return r ? formatKesBillions(Number(r.value) / 1e9) : "—";
          })()}
        />
        <KpiCard
          label="Expenditure"
          value={(() => {
            const e = kpis.find((k: any) => k.key === "total_expenditure");
            return e ? formatKesBillions(Number(e.value) / 1e9) : formatKesBillions(totalBudget / 1e9);
          })()}
        />
        <KpiCard
          label="Fiscal Deficit"
          value={formatKesBillions(Math.abs(nationalDeficit) / 1e9)}
          trend={(() => {
            const rev = kpis.find((k: any) => k.key === "total_revenue");
            return nationalDeficit < 0 && rev ? -Math.abs(nationalDeficit) / Number(rev.value) * 100 : undefined;
          })()}
          subtitle={nationalDeficit < 0 ? "Expenditure exceeds revenue" : "Budget surplus"}
        />
      </div>

      {/* Revenue vs Expenditure + Sector Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="size-4 text-primary" />
              Revenue vs Expenditure
            </CardTitle>
            <CardDescription>Budget composition for {selectedYearLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueExpenditure.length === 0 ? <EmptyChart /> : (
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
                <Legend items={revenueExpenditure} />
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
            <CardDescription>Top sectors by approved budget</CardDescription>
          </CardHeader>
          <CardContent>
            {sectorBreakdown.length === 0 ? <EmptyChart /> : (
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
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
    </div>
  );
}

function CountiesView({ countyBreakdown, topCounties, totalCountyAllocation, totalBudget, selectedYearLabel, countyAllocations }: any) {
  const totalApproved = countyAllocations.reduce((s: number, a: any) => s + Number(a.amount), 0);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total County Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatKesBillions(totalCountyAllocation / 1e9)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{selectedYearLabel}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Counties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">47</p>
            <p className="text-[10px] text-muted-foreground mt-1">Total counties</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Share of National Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {totalBudget > 0 ? `${((totalCountyAllocation / totalBudget) * 100).toFixed(1)}%` : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Equitable share + own revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Counties */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Top 10 Counties by Allocation
          </CardTitle>
          <CardDescription>Counties with the largest approved budgets for {selectedYearLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          {topCounties.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={topCounties} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.3} />
                <XAxis type="number" tickFormatter={((v: number) => `${v}B`) as any} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
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

      {/* Highest & Lowest */}
      {countyBreakdown.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">County Allocation Range</CardTitle>
            <CardDescription>Highest and lowest county budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20 p-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ArrowUpRight className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Highest</span>
                </div>
                <p className="text-lg font-bold">{countyBreakdown[0]?.name}</p>
                <p className="text-sm text-muted-foreground tabular-nums">{formatKesBillions(countyBreakdown[0]?.value ?? 0)}</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20 p-4">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <ArrowDownRight className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Lowest</span>
                </div>
                <p className="text-lg font-bold">{countyBreakdown[countyBreakdown.length - 1]?.name}</p>
                <p className="text-sm text-muted-foreground tabular-nums">{formatKesBillions(countyBreakdown[countyBreakdown.length - 1]?.value ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Counties Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">All 47 Counties</CardTitle>
          <CardDescription>Full list of county budget allocations for {selectedYearLabel}</CardDescription>
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
                  <tr key={c.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2 pr-4 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 px-4 text-right tabular-nums">{formatKesBillions(c.value)}</td>
                    <td className="py-2 pl-4 text-right tabular-nums text-muted-foreground">
                      {totalApproved > 0 ? `${((c.value * 1e8 / totalApproved) * 100).toFixed(1)}%` : "—"}
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

function Legend({ items }: { items: { name: string; value: number; fill: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {items.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1.5 text-xs">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="font-medium tabular-nums">{formatKesBillions(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <PieChartIcon className="size-10 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">No data available</p>
    </div>
  );
}
