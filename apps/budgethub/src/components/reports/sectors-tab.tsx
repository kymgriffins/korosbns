"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight, Building2, ChevronRight, PieChart, TrendingUp,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { BudgetSchema } from "@/lib/budget-schema";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatKesBillions } from "@/lib/budget-format";

interface SectorsTabProps {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  selectedYear: string;
}

const SECTOR_COLORS = [
  "hsl(221 83% 53%)", "hsl(262 83% 58%)", "hsl(199 89% 48%)",
  "hsl(142 76% 36%)", "hsl(24 95% 53%)", "hsl(346 77% 50%)",
  "hsl(47 95% 48%)", "hsl(173 80% 40%)", "hsl(12 76% 61%)",
];

function SectorDetailView({
  sectorCode, allYears, fiscalYears, onBack,
}: {
  sectorCode: string;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  onBack: () => void;
}) {
  const sector = allYears["fy2026"]?.tier_1_national_sectors.find((s) => s.sector_code === sectorCode);
  if (!sector) return null;

  const multiYear = fiscalYears.map((fy) => {
    const d = allYears[fy.id];
    const s = d?.tier_1_national_sectors.find((x) => x.sector_code === sectorCode);
    return { label: fy.label.replace("FY ", ""), allocation: s?.total_allocation ?? 0 };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="size-3.5 rotate-180" /> Back to all sectors
      </button>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <Building2 className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{sector.name}</h2>
          <p className="text-xs text-muted-foreground">Sector Code: {sector.sector_code}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(sector.total_allocation / 1e9)}</p>
          <p className="text-[10px] text-muted-foreground">Total Allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Budget Share</p>
          <p className="text-xl font-bold tabular-nums mt-1">{sector.national_budget_share_pct}%</p>
          <p className="text-xs text-muted-foreground">of national budget</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Recurrent</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions((sector.expenditure_type_split?.recurrent ?? 0) / 1e9)}</p>
          <p className="text-xs text-muted-foreground">Operational expenditure</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Development</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions((sector.expenditure_type_split?.development ?? 0) / 1e9)}</p>
          <p className="text-xs text-muted-foreground">Capital expenditure</p>
        </div>
      </div>

      {sector.beta_alignment_tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sector.beta_alignment_tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {multiYear.length > 1 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />Multi-Year Trend
            </h3>
            <CardDescription>{sector.name} allocation across fiscal years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={multiYear} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: any) => formatKesBillions(v / 1e9)} />
                <Bar dataKey="allocation" radius={[6, 6, 0, 0]} maxBarSize={50}
                  isAnimationActive={true} animationDuration={600} animationEasing="ease-out">
                  {multiYear.map((_, i) => (
                    <Cell key={i} fill="hsl(221 83% 53%)" fillOpacity={0.6 + i * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <PieChart className="size-4 text-primary" />Sub-Vote Breakdown
          </h3>
          <CardDescription>{sector.sub_vote_breakdown.length} sub-votes under {sector.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sector.sub_vote_breakdown.map((sv, i) => {
              const pct = sv.share_of_vote_pct ?? ((sv.amount / sector.total_allocation) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate mr-2">{sv.vote_head}</span>
                    <span className="tabular-nums shrink-0 ml-2">{formatKesBillions(sv.amount / 1e9)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{pct.toFixed(1)}% of sector budget</span>
                    {sv.beneficiaries_count && <span>{sv.beneficiaries_count.toLocaleString()} beneficiaries</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SectorsTab({ currentData, allYears, fiscalYears }: SectorsTabProps) {
  const [selectedSectorCode, setSelectedSectorCode] = useState<string | null>(null);
  const [compareSectorA, setCompareSectorA] = useState<string>("SEC-EDU");
  const [compareSectorB, setCompareSectorB] = useState<string>("SEC-HEA");

  const sectors = currentData.tier_1_national_sectors;
  const totalNational = sectors.reduce((s, sec) => s + sec.total_allocation, 0);

  const treemapData = useMemo(() =>
    sectors.map((s, i) => ({
      name: s.name,
      value: s.total_allocation,
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
      share: ((s.total_allocation / totalNational) * 100).toFixed(1),
    })).sort((a, b) => b.value - a.value),
  [sectors, totalNational]);

  const radarData = useMemo(() => {
    const maxAlloc = Math.max(...sectors.map((s) => s.total_allocation));
    return sectors.map((s) => ({
      sector: s.name,
      allocation: (s.total_allocation / maxAlloc) * 100,
      recurrent: s.expenditure_type_split
        ? ((s.expenditure_type_split.recurrent / s.total_allocation) * 100)
        : 50,
      development: s.expenditure_type_split
        ? ((s.expenditure_type_split.development / s.total_allocation) * 100)
        : 50,
      share: s.national_budget_share_pct,
    }));
  }, [sectors]);

  const sectorA = sectors.find((s) => s.sector_code === compareSectorA);
  const sectorB = sectors.find((s) => s.sector_code === compareSectorB);

  const comparisonData = useMemo(() => {
    if (!sectorA || !sectorB) return [];
    const maxLen = Math.max(sectorA.sub_vote_breakdown.length, sectorB.sub_vote_breakdown.length);
    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const a = sectorA.sub_vote_breakdown[i];
      const b = sectorB.sub_vote_breakdown[i];
      result.push({
        label: a?.vote_head ?? b?.vote_head ?? "",
        [sectorA.name]: a ? Math.round(a.amount / 1e8) / 10 : 0,
        [sectorB.name]: b ? Math.round(b.amount / 1e8) / 10 : 0,
      });
    }
    return result;
  }, [sectorA, sectorB]);

  if (selectedSectorCode) {
    return (
      <SectorDetailView
        sectorCode={selectedSectorCode}
        allYears={allYears}
        fiscalYears={fiscalYears}
        onBack={() => setSelectedSectorCode(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">All Sectors</h3>
          <p className="text-xs text-muted-foreground ml-1">
            {sectors.length} sectors · Click to drill down
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {treemapData.map((s, i) => (
            <button key={s.name} onClick={() => setSelectedSectorCode(sectors[i]?.sector_code ?? "")}
              className="group text-left"
            >
              <Card className="border-border/60 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}15` }}>
                      <Building2 className="size-4.5" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{s.name}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg font-bold tabular-nums">{formatKesBillions(s.value / 1e9)}</span>
                        <span className="text-xs text-muted-foreground">{s.share}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden mt-1.5">
                        <div className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${Math.min((s.value / treemapData[0].value) * 100, 100)}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <PieChart className="size-4 text-primary" />Sector Comparison Radar
          </h3>
          <CardDescription>Relative allocation, recurrent, and development expenditure by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid strokeOpacity={0.2} />
              <PolarAngleAxis dataKey="sector" tick={{ fontSize: 9 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Allocation %" dataKey="allocation" stroke="hsl(221 83% 53%)" fill="hsl(221 83% 53%)" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Recurrent %" dataKey="recurrent" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Development %" dataKey="development" stroke="hsl(24 95% 53%)" fill="hsl(24 95% 53%)" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <ArrowLeftRight className="size-4 text-primary" />Side-by-Side Sector Comparison
          </h3>
          <CardDescription>Select two sectors to compare their sub-vote breakdowns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Sector A:</span>
              <select value={compareSectorA} onChange={(e) => setCompareSectorA(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sectors.map((s) => (
                  <option key={s.sector_code} value={s.sector_code}>{s.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-muted-foreground">vs</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Sector B:</span>
              <select value={compareSectorB} onChange={(e) => setCompareSectorB(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sectors.map((s) => (
                  <option key={s.sector_code} value={s.sector_code}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {sectorA && sectorB && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs font-bold text-center mb-1" style={{ color: "hsl(221 83% 53%)" }}>{sectorA.name}</p>
                <p className="text-lg font-bold tabular-nums text-center">{formatKesBillions(sectorA.total_allocation / 1e9)}</p>
                <p className="text-[10px] text-center text-muted-foreground">{sectorA.national_budget_share_pct}% of budget</p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs font-bold text-center mb-1" style={{ color: "hsl(142 76% 36%)" }}>{sectorB.name}</p>
                <p className="text-lg font-bold tabular-nums text-center">{formatKesBillions(sectorB.total_allocation / 1e9)}</p>
                <p className="text-[10px] text-center text-muted-foreground">{sectorB.national_budget_share_pct}% of budget</p>
              </div>
            </div>
          )}

          {comparisonData.length > 0 && (
            <ResponsiveContainer width="100%" height={Math.max(200, comparisonData.length * 40)}>
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 140, right: 60, top: 8, bottom: 8 }}>
                <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}B`} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 9 }} width={140} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: any) => `${v.toFixed(1)}B`} />
                {sectorA && <Bar dataKey={sectorA.name} radius={[0, 4, 4, 0]} maxBarSize={16}
                  fill="hsl(221 83% 53%)" fillOpacity={0.85} />}
                {sectorB && <Bar dataKey={sectorB.name} radius={[0, 4, 4, 0]} maxBarSize={16}
                  fill="hsl(142 76% 36%)" fillOpacity={0.85} />}
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />Multi-Year Sector Allocation Trend
          </h3>
          <CardDescription>How each sector's allocation changed across fiscal years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-4 text-left font-medium">Sector</th>
                  {fiscalYears.map((fy) => (
                    <th key={fy.id} className="py-2 px-3 text-right font-medium">
                      {fy.label.replace("FY ", "")}
                    </th>
                  ))}
                  <th className="py-2 pl-3 text-right font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((s, i) => {
                  const values = fiscalYears.map((fy) => {
                    const d = allYears[fy.id];
                    const sec = d?.tier_1_national_sectors.find((x) => x.sector_code === s.sector_code);
                    return sec?.total_allocation ?? 0;
                  });
                  const first = values.find((v) => v > 0) ?? values[0];
                  const last = values[values.length - 1];
                  const change = first > 0 ? ((last - first) / first) * 100 : 0;
                  return (
                    <tr key={s.sector_code} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 pr-4 font-medium flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                        {s.name}
                      </td>
                      {values.map((v, j) => (
                        <td key={j} className="py-2.5 px-3 text-right tabular-nums">
                          {formatKesBillions(v / 1e9)}
                        </td>
                      ))}
                      <td className={cn("py-2.5 pl-3 text-right tabular-nums font-medium",
                        change >= 0 ? "text-emerald-600" : "text-red-600")}>
                        {change >= 0 ? "+" : ""}{change.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
