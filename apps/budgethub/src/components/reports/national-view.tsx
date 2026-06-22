"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  Heart,
  Landmark,
  PieChart as PieChartIcon,
  Scale,
  Shield,
  TrendingUp,
  Users,
  Wheat,
  Wrench,
  Zap,
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
import type { ReportPageData } from "@/lib/reports-hub";
import type { BudgetFiscalYear } from "@/lib/budget-api";
import { KpiCard, SECTOR_COLORS } from "@/components/reports/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatKesBillions, formatKesTrillions } from "@/lib/budget-format";

const SECTOR_ICONS: Record<string, typeof Landmark> = {
  Education: GraduationCap,
  Security: Shield,
  Health: Heart,
  Infrastructure: Wrench,
  Agriculture: Wheat,
  "Social Services": Users,
  Housing: Building2,
  Energy: Zap,
  "Public Administration": Landmark,
};

function sectorIcon(name: string) {
  for (const [key, Icon] of Object.entries(SECTOR_ICONS))
    if (name.includes(key)) return Icon;
  return Landmark;
}

interface SectorCardProps {
  name: string;
  currentAlloc: number;
  change: number;
  history: { label: string; amount: number }[];
  subVotes: { name: string; amount: number }[];
  color: string;
  index: number;
}

function SectorCard({ name, currentAlloc, change, history, subVotes, color, index }: SectorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = sectorIcon(name);
  const isUp = change >= 0;

  return (
    <Card className={cn("border-border/60 shadow-sm group transition-all duration-300",
      expanded ? "shadow-md border-primary/20" : "hover:shadow-md hover:border-primary/20"
    )}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
              <Icon className="size-4.5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold truncate">{name}</p>
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")} />
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold tabular-nums">{formatKesBillions(currentAlloc)}</span>
                <span className={cn("text-xs font-medium flex items-center gap-0.5",
                  isUp ? "text-emerald-600" : "text-red-600")}>
                  {isUp ? "+" : ""}{change.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden mt-1.5">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(index === 0 ? 100 : (currentAlloc / 150) * 100, 100)}%`, backgroundColor: color }} />
              </div>
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Multi-year chart */}
          {history.length > 1 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Trend Across Fiscal Years</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={history} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                  <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={0} />
                  <YAxis hide={true} />
                  <Tooltip formatter={(v: any) => formatKesBillions(v)} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={40}
                    isAnimationActive={true} animationDuration={600} animationEasing="ease-out">
                    {history.map((_, i) => <Cell key={i} fill={color} fillOpacity={0.7 + i * 0.15} />)}
                    <LabelList dataKey="amount" position="top" formatter={(v: any) => `${(Number(v) / 1e9).toFixed(0)}B`} className="text-[9px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sub-votes */}
          {subVotes.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Sub-Vote Breakdown</p>
              <div className="space-y-1.5">
                {subVotes.map((sv, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-muted-foreground truncate mr-2">{sv.name}</span>
                    <span className="tabular-nums font-medium shrink-0">{formatKesBillions(sv.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

interface NationalViewProps {
  byYear: Record<string, ReportPageData>;
  selectedYear: string;
  fiscalYears: BudgetFiscalYear[];
  schema: any;
}

export function NationalView({ byYear, selectedYear, fiscalYears, schema }: NationalViewProps) {
  const current = byYear[selectedYear];
  if (!current) return null;

  const currentKpis = current.kpis;
  const r = (key: string) => { const k = currentKpis.find((k: any) => k.key === key); return k ? Number(k.value) : 0; };
  const deficit = r("fiscal_deficit");
  const ordinary = r("ordinary_revenue");
  const interest = r("interest_obligation");
  const totalRev = r("total_revenue");

  // Build sector data across all years
  const sectorData = useMemo(() => {
    const yearLabels: Record<string, string> = {};
    for (const fy of fiscalYears) yearLabels[fy.id] = fy.label.replace("FY ", "");

    // Collect sector names from current year
    const currentApproved = current.allocations.filter((a: any) => a.allocation_type === "approved");
    const nationalEntIds = current.entities.filter((e: any) => e.type === "national").map((e: any) => e.id);
    const currentNational = currentApproved.filter((a: any) => nationalEntIds.includes(a.entity));

    const sectorNames = [...new Set(currentNational.map((a: any) => a.entity_name.split(" - ")[0]))] as string[];

    return sectorNames.map((name, i) => {
      const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
      const history: { label: string; amount: number }[] = [];
      let currentAlloc = 0;
      let prevAlloc = 0;

      for (const fy of fiscalYears) {
        const yrData = byYear[fy.id];
        if (!yrData) continue;
        const yrApproved = yrData.allocations.filter((a: any) => a.allocation_type === "approved");
        const yrNational = yrApproved.filter((a: any) => nationalEntIds.includes(a.entity));
        const total = yrNational
          .filter((a: any) => a.entity_name.startsWith(name))
          .reduce((s: number, a: any) => s + Number(a.amount), 0);
        const amtB = Math.round(total / 1e8) / 10;
        history.push({ label: yearLabels[fy.id] || "", amount: amtB });
        if (fy.id === selectedYear) currentAlloc = amtB;
        if (history.length >= 2) prevAlloc = history[history.length - 2]?.amount ?? 0;
      }

      // Sub-votes from current year
      const subVoteMap: Record<string, number> = {};
      for (const a of currentNational) {
        if (!a.entity_name.startsWith(name)) continue;
        const parts = a.entity_name.split(" - ");
        const sub = parts.length > 1 ? parts[1] : "General";
        subVoteMap[sub] = (subVoteMap[sub] || 0) + Number(a.amount);
      }
      const subVotes = Object.entries(subVoteMap)
        .map(([n, v]) => ({ name: n, amount: Math.round(v / 1e8) / 10 }))
        .sort((a, b) => b.amount - a.amount);
      const change = prevAlloc > 0 ? ((currentAlloc - prevAlloc) / prevAlloc) * 100 : 0;

      return { name, currentAlloc, change, history, subVotes, color };
    }).sort((a, b) => b.currentAlloc - a.currentAlloc);
  }, [byYear, selectedYear, fiscalYears, current]);

  // Revenue streams for pie chart
  const revenueStreams = useMemo(() => [
    { name: "Ordinary Revenue (KRA)", value: r("appropriations_in_aid") ? (totalRev - r("appropriations_in_aid") - r("grants")) / 1e9 : ordinary / 1e9, fill: "hsl(221 83% 53%)" },
    { name: "Appropriations-in-Aid", value: r("appropriations_in_aid") / 1e9, fill: "hsl(142 76% 36%)" },
    { name: "External Grants", value: r("grants") / 1e9, fill: "hsl(47 95% 48%)" },
  ].filter((d) => d.value > 0), [currentKpis]);

  // Multi-year revenue comparison
  const revenueHistory = useMemo(() => {
    return fiscalYears.map((fy) => {
      const yrData = byYear[fy.id];
      if (!yrData) return { label: fy.label.replace("FY ", ""), revenue: 0 };
      const k = yrData.kpis.find((k: any) => k.key === "total_revenue");
      return { label: fy.label.replace("FY ", ""), revenue: k ? Math.round(Number(k.value) / 1e8) / 10 : 0 };
    });
  }, [byYear, fiscalYears]);

  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";
  const highlights = current.highlights ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Hero ── */}
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
                <span className="flex items-center gap-1"><Landmark className="size-3" />{schema.metadata?.presented_by ?? "National Treasury"}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" />{schema.metadata?.presented_date ?? selectedYearLabel}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={formatKesTrillions(totalRev / 1e12)} trend={8.1} subtitle={selectedYearLabel} />
        <KpiCard label="Ordinary Revenue" value={formatKesBillions(ordinary / 1e9)} trend={7.2} subtitle="KRA collections" />
        <KpiCard label="Interest Obligation" value={formatKesBillions(interest / 1e9)} trend={-5.2} subtitle="Debt service cost" />
        <KpiCard label="Fiscal Deficit" value={formatKesBillions(deficit / 1e9)} trend={-((deficit / totalRev) * 100)} subtitle={`${((deficit / totalRev) * 100).toFixed(1)}% of revenue`} />
      </div>

      {/* ── Revenue Streams + Multi-Year ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><PieChartIcon className="size-4 text-primary" />Revenue Streams</CardTitle>
            <CardDescription>Composition of total projected revenue for {selectedYearLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueStreams.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12"><PieChartIcon className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No data</p></div>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <RechartPie>
                    <Pie data={revenueStreams} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}
                      isAnimationActive={true} animationDuration={1000} animationEasing="ease-out">
                      {revenueStreams.map((e: any, i: number) => (<Cell key={i} fill={e.fill} />))}
                      <Label value={formatKesTrillions(totalRev / 1e12)} position="center" className="text-base font-bold" />
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
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Revenue Trend</CardTitle>
            <CardDescription>Total projected revenue across fiscal years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueHistory} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis hide={true} />
                <Tooltip formatter={(v: any) => formatKesBillions(v)} />
                <defs>
                  <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={60}
                  isAnimationActive={true} animationDuration={800} animationEasing="ease-out"
                  fill="url(#rev-grad)">
                  <LabelList dataKey="revenue" position="top" formatter={(v: any) => `${Number(v).toFixed(0)}B`} className="text-[10px] tabular-nums" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Sector Grid ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="size-4 text-primary" />
          <CardTitle className="text-sm">Sector Performance</CardTitle>
          <CardDescription className="text-xs ml-1">Click a sector to expand and view sub-votes + multi-year trend</CardDescription>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectorData.map((s, i) => (
            <SectorCard key={s.name} {...s} index={i} />
          ))}
        </div>
      </div>

      {/* ── Debt & Financing ── */}
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
          {highlights.map((hl: any) => (
            <Card key={hl.id} className={cn("border-l-4 shadow-sm",
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

      {/* ── Source Docs ── */}
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
