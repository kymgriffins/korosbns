"use client";

import { useMemo } from "react";
import {
  ArrowUpRight, BookOpen, Building2, Calendar, FileText,
  Landmark, Scale, TrendingUp, TriangleAlert,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart as RechartPie,
  ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList,
} from "recharts";
import type { BudgetSchema } from "@/lib/budget-schema";
import { KpiCard } from "@/components/reports/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKesBillions, formatKesTrillions } from "@/lib/budget-format";

interface OverviewTabProps {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  selectedYear: string;
}

export function OverviewTab({ currentData, allYears, fiscalYears, selectedYear }: OverviewTabProps) {
  const { metadata, macro_modules, tier_1_national_sectors } = currentData;
  const { revenue_engine, debt_portfolio } = macro_modules;
  const selectedLabel = fiscalYears.find((y) => y.id === selectedYear)?.label ?? "FY";

  const totalRev = revenue_engine.total_projected_revenue;
  const ordinaryRev = revenue_engine.streams[0]?.amount ?? 0;
  const aia = revenue_engine.streams[1]?.amount ?? 0;
  const grants = revenue_engine.streams[2]?.amount ?? 0;
  const deficit = debt_portfolio.fiscal_deficit_gap;
  const interest = debt_portfolio.total_interest_service_obligation;
  const deficitPct = debt_portfolio.deficit_gdp_ratio_pct;

  const revenueStreams = useMemo(() => [
    { name: "Ordinary Revenue (KRA)", value: ordinaryRev / 1e9, fill: "hsl(221 83% 53%)" },
    { name: "Appropriations-in-Aid", value: aia / 1e9, fill: "hsl(142 76% 36%)" },
    { name: "External Grants", value: grants / 1e9, fill: "hsl(47 95% 48%)" },
  ].filter((d) => d.value > 0), [ordinaryRev, aia, grants]);

  const revenueHistory = useMemo(() =>
    fiscalYears.map((fy) => {
      const d = allYears[fy.id];
      if (!d) return { label: fy.label.replace("FY ", ""), revenue: 0 };
      return { label: fy.label.replace("FY ", ""), revenue: Math.round(d.macro_modules.revenue_engine.total_projected_revenue / 1e8) / 10 };
    }), [allYears, fiscalYears]);

  const shortSectorName = (name: string) => {
    const map: Record<string, string> = {
      "Governance, Justice, Law & Order": "Govt, Justice & Order",
      "Social Protection, Youth, Water & Climate Infrastructure Cluster": "Social Protection & Climate",
      "Energy, ICT & Digital Economy Cluster": "Energy, ICT & Digital",
      "Infrastructure & Roads": "Infrastructure & Roads",
      "Housing & Urban Development": "Housing & Urban Dev",
      "Agriculture & Rural Development": "Agriculture & Rural Dev",
    };
    return map[name] ?? name;
  };

  const sectorData = useMemo(() =>
    tier_1_national_sectors.map((s) => ({
      name: shortSectorName(s.name),
      fullName: s.name,
      allocation: s.total_allocation,
      share: s.national_budget_share_pct,
    })).sort((a, b) => b.allocation - a.allocation),
  [tier_1_national_sectors]);

  const sectorHistory = useMemo(() => {
    return fiscalYears.map((fy) => {
      const d = allYears[fy.id];
      if (!d) return null;
      return {
        label: fy.label.replace("FY ", ""),
        ...Object.fromEntries(
          d.tier_1_national_sectors.map((s) => [shortSectorName(s.name), Math.round(s.total_allocation / 1e8) / 10]),
        ),
      };
    }).filter(Boolean) as Record<string, string | number>[];
  }, [allYears, fiscalYears, tier_1_national_sectors]);

  const sectorColors = [
    "hsl(221 83% 53%)", "hsl(262 83% 58%)", "hsl(199 89% 48%)",
    "hsl(142 76% 36%)", "hsl(24 95% 53%)", "hsl(346 77% 50%)",
    "hsl(47 95% 48%)", "hsl(173 80% 40%)", "hsl(12 76% 61%)",
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="border-border/60 shadow-sm bg-gradient-to-r from-primary/5 via-primary/3 to-transparent overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                {selectedLabel} Budget Theme
              </span>
              <p className="text-sm font-medium leading-relaxed mt-2 sm:text-base">{metadata.theme}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Landmark className="size-3" />{metadata.presented_by}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" />Presented {metadata.presented_date}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1"><Scale className="size-3" />Approved {metadata.approved_date}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={formatKesTrillions(totalRev / 1e9)} trend={8.1} subtitle={selectedLabel} />
        <KpiCard label="Ordinary Revenue" value={formatKesBillions(ordinaryRev / 1e9)} trend={7.2} subtitle="KRA collections" />
        <KpiCard label="Interest Obligation" value={formatKesBillions(interest / 1e9)} trend={-5.2} subtitle="Debt service cost" />
        <KpiCard label="Fiscal Deficit" value={formatKesBillions(deficit / 1e9)} trend={-deficitPct} subtitle={`${deficitPct}% of GDP`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="size-4 text-primary" />Revenue Composition
            </CardTitle>
            <CardDescription>Breakdown of total projected revenue for {selectedLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueStreams.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <Landmark className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No data</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={240}>
                  <RechartPie>
                    <Pie data={revenueStreams} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                      paddingAngle={3} dataKey="value" strokeWidth={0}
                      isAnimationActive={true} animationDuration={1000} animationEasing="ease-out"
                    >
                      {revenueStreams.map((e, i) => (<Cell key={i} fill={e.fill} />))}
                      <Label value={formatKesTrillions(totalRev / 1e9)} position="center" className="text-base font-bold" />
                    </Pie>
                    <Tooltip formatter={(v: any) => formatKesBillions(v)} />
                  </RechartPie>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {revenueStreams.map((e, i) => (
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
              <TrendingUp className="size-4 text-primary" />Revenue Trend
            </CardTitle>
            <CardDescription>Total projected revenue across fiscal years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueHistory} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: any) => formatKesBillions(v)} />
                <defs>
                  <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={60}
                  isAnimationActive={true} animationDuration={800} animationEasing="ease-out" fill="url(#rev-grad)">
                  <LabelList dataKey="revenue" position="top" formatter={(v: any) => `${v.toFixed(0)}B`}
                    className="text-[10px] tabular-nums" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="size-4 text-primary" />Sector Allocations
          </CardTitle>
          <CardDescription>National budget distribution across sectors ({selectedLabel})</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={sectorData} layout="vertical" margin={{ left: 180, right: 80, top: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} strokeOpacity={0.2} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1e9).toFixed(0)}B`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={180} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v: any) => formatKesBillions(v / 1e9)} />
              <Bar dataKey="allocation" radius={[0, 6, 6, 0]} maxBarSize={24}
                isAnimationActive={true} animationDuration={1000} animationEasing="ease-out">
                {sectorData.map((_, i) => (
                  <Cell key={i} fill={sectorColors[i % sectorColors.length]} fillOpacity={0.85} />
                ))}
                <LabelList dataKey="allocation" position="right"
                  formatter={(v: any) => `${(v / 1e9).toFixed(0)}B`}
                  className="text-[10px] tabular-nums" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {sectorHistory.length > 1 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />Sector Trends Across Years
            </CardTitle>
            <CardDescription>Year-over-year allocation comparison by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorHistory} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}B`} />
                <Tooltip formatter={(v: any) => `${v.toFixed(1)}B`} />
                {tier_1_national_sectors.map((s, i) => (
                  <Bar key={s.sector_code} dataKey={shortSectorName(s.name)} stackId="a" radius={[0, 0, 0, 0]}
                    fill={sectorColors[i % sectorColors.length]} fillOpacity={0.85}
                    isAnimationActive={true} animationDuration={800} animationEasing="ease-out"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {tier_1_national_sectors.map((s, i) => (
                <div key={s.sector_code} className="flex items-center gap-1.5 text-xs">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: sectorColors[i % sectorColors.length] }} />
                  <span className="text-muted-foreground">{shortSectorName(s.name)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="size-4 text-primary" />Debt & Financing
          </CardTitle>
          <CardDescription>Borrowing plan and fiscal sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Fiscal Deficit</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(deficit / 1e9)}</p>
              <p className="text-xs text-muted-foreground">{deficitPct}% of GDP</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Domestic Borrowing</p>
              <p className="text-xl font-bold tabular-nums mt-1">
                {formatKesBillions(debt_portfolio.financing_plan.domestic_borrowing_target / 1e9)}
              </p>
              <p className="text-xs text-muted-foreground">Target {selectedLabel}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">External Borrowing</p>
              <p className="text-xl font-bold tabular-nums mt-1">
                {formatKesBillions(debt_portfolio.financing_plan.external_borrowing_target / 1e9)}
              </p>
              <p className="text-xs text-muted-foreground">Target {selectedLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Interest Obligation</p>
              <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(interest / 1e9)}</p>
              <p className="text-xs text-muted-foreground">Debt service cost for {selectedLabel}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Target Deficit (FY 2028/29)</p>
              <p className="text-xl font-bold tabular-nums mt-1">{debt_portfolio.target_deficit_fy2028_29_pct}%</p>
              <p className="text-xs text-muted-foreground">of GDP (fiscal consolidation goal)</p>
            </div>
          </div>

          {debt_portfolio.systemic_risks.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <TriangleAlert className="size-3" /> Systemic Risks
              </p>
              {debt_portfolio.systemic_risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <a href="/budgethub/dashboard/lms/documents"
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

function PieChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
