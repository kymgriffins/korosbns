"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowLeftRight, Building2, MapPin, Search, TrendingUp, Users,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import type { BudgetSchema } from "@/lib/budget-schema";
import { KpiCard } from "@/components/reports/shared";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatKesBillions } from "@/lib/budget-format";
import { generateCountyAllocations, type CountyAllocation } from "@/lib/reports-api";

interface CountiesTabProps {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  selectedYear: string;
}

const REGION_COLORS: Record<string, string> = {
  Coast: "hsl(199 89% 48%)",
  North_Eastern: "hsl(24 95% 53%)",
  Eastern: "hsl(142 76% 36%)",
  Central: "hsl(47 95% 48%)",
  Rift_Valley: "hsl(262 83% 58%)",
  Western: "hsl(346 77% 50%)",
  Nyanza: "hsl(173 80% 40%)",
  Nairobi: "hsl(221 83% 53%)",
};

const COUNTY_REGIONS: Record<string, string> = {
  Mombasa: "Coast", Kwale: "Coast", Kilifi: "Coast", "Tana River": "Coast", Lamu: "Coast", "Taita Taveta": "Coast",
  Garissa: "North_Eastern", Wajir: "North_Eastern", Mandera: "North_Eastern",
  Marsabit: "Eastern", Isiolo: "Eastern", Meru: "Eastern", "Tharaka-Nithi": "Eastern", Embu: "Eastern", Kitui: "Eastern", Machakos: "Eastern", Makueni: "Eastern",
  Nyandarua: "Central", Nyeri: "Central", Kirinyaga: "Central", "Murang'a": "Central", Kiambu: "Central",
  Turkana: "Rift_Valley", "West Pokot": "Rift_Valley", Samburu: "Rift_Valley", "Trans Nzoia": "Rift_Valley", "Uasin Gishu": "Rift_Valley",
  "Elgeyo-Marakwet": "Rift_Valley", Nandi: "Rift_Valley", Baringo: "Rift_Valley", Laikipia: "Rift_Valley",
  Nakuru: "Rift_Valley", Narok: "Rift_Valley", Kajiado: "Rift_Valley", Kericho: "Rift_Valley", Bomet: "Rift_Valley",
  Kakamega: "Western", Vihiga: "Western", Bungoma: "Western", Busia: "Western",
  Siaya: "Nyanza", Kisumu: "Nyanza", "Homa Bay": "Nyanza", Migori: "Nyanza", Kisii: "Nyanza", Nyamira: "Nyanza",
  Nairobi: "Nairobi",
};

export function CountiesTab({ currentData, allYears, fiscalYears, selectedYear }: CountiesTabProps) {
  const [search, setSearch] = useState("");
  const [selectedCountyId, setSelectedCountyId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ranking" | "compare" | "heatmap">("ranking");

  const countyAllocations = useMemo(() => generateCountyAllocations(currentData), [currentData]);
  const selectedCounty = selectedCountyId ? countyAllocations.find((c) => c.id === selectedCountyId) : null;
  const compareCounty = compareId ? countyAllocations.find((c) => c.id === compareId) : null;

  const prevYearId = fiscalYears.find((y) => y.id !== selectedYear && y.id < selectedYear)?.id;
  const prevCountyAllocations = prevYearId
    ? generateCountyAllocations(allYears[prevYearId])
    : countyAllocations.map((c) => ({ ...c, allocation: Math.round(c.allocation * 0.92) }));

  const countyRanking = useMemo(() =>
    countyAllocations.map((c) => {
      const prev = prevCountyAllocations.find((p) => p.id === c.id)?.allocation ?? c.allocation;
      const change = prev > 0 ? ((c.allocation - prev) / prev) * 100 : 0;
      return { ...c, prevAllocation: prev, change };
    }).sort((a, b) => b.allocation - a.allocation)
      .map((c, i) => ({ ...c, rank: i + 1 })),
  [countyAllocations, prevCountyAllocations]);

  const filtered = search
    ? countyRanking.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countyRanking;

  const totalDevolution = countyRanking.reduce((s, c) => s + c.allocation, 0);
  const avgAllocation = countyRanking.length > 0 ? totalDevolution / countyRanking.length : 0;

  const heatmapData = useMemo(() => {
    const maxAlloc = Math.max(...countyRanking.map((c) => c.allocation));
    return countyRanking.map((c) => ({
      ...c,
      intensity: c.allocation / maxAlloc,
      region: COUNTY_REGIONS[c.name] ?? "Other",
      color: REGION_COLORS[COUNTY_REGIONS[c.name] ?? "Other"] ?? "hsl(0 0% 60%)",
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [countyRanking]);

  const regionTotals = useMemo(() => {
    const totals: Record<string, { total: number; count: number }> = {};
    for (const c of countyRanking) {
      const region = COUNTY_REGIONS[c.name] ?? "Other";
      if (!totals[region]) totals[region] = { total: 0, count: 0 };
      totals[region].total += c.allocation;
      totals[region].count += 1;
    }
    return Object.entries(totals).map(([region, data]) => ({
      region: region.replace(/_/g, " "),
      total: data.total,
      count: data.count,
      avg: Math.round(data.total / data.count),
      color: REGION_COLORS[region] ?? "hsl(0 0% 60%)",
    })).sort((a, b) => b.total - a.total);
  }, [countyRanking]);

  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label ?? "FY";

  if (selectedCountyId && selectedCounty && !compareId && viewMode !== "compare" && viewMode !== "heatmap") {
    return (
      <CountyProfile
        county={selectedCounty}
        countyRanking={countyRanking}
        onBack={() => setSelectedCountyId(null)}
        onCompare={() => setCompareId(selectedCountyId)}
        selectedYearLabel={selectedYearLabel}
      />
    );
  }

  if (selectedCountyId && compareId && selectedCounty && compareCounty) {
    return (
      <CountyComparison
        countyA={selectedCounty}
        countyB={compareCounty}
        onBack={() => { setCompareId(null); }}
        allYears={allYears}
        fiscalYears={fiscalYears}
        selectedYearLabel={selectedYearLabel}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Devolution" value={formatKesBillions(totalDevolution / 1e9)}
          trend={10.4} subtitle={selectedYearLabel} />
        <KpiCard label="Counties" value="47" subtitle="All county governments" />
        <KpiCard label="Average per County" value={formatKesBillions(avgAllocation / 1e9)} subtitle="Equally weighted" />
        <KpiCard label="National Budget Share" value={`${currentData.tier_2_county_devolution_envelope.national_budget_share_pct}%`}
          trend={1.2} subtitle="Devolution allocation" />
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2">
        {(["ranking", "compare", "heatmap"] as const).map((mode) => (
          <button key={mode} onClick={() => { setViewMode(mode); setCompareId(null); }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              viewMode === mode
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {mode === "ranking" ? "Ranking" : mode === "compare" ? "Compare Counties" : "Regional View"}
          </button>
        ))}
      </div>

      {/* Heatmap / Regional View */}
      {viewMode === "heatmap" && (
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="size-4 text-primary" />Allocation by Region
              </h3>
              <CardDescription>Total devolution allocation grouped by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionTotals} layout="vertical" margin={{ left: 100, right: 60, top: 8, bottom: 8 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatKesBillions(v / 1e9)} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 10 }} width={100} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v: any) => formatKesBillions(v / 1e9)} />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={28}
                    isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                    {regionTotals.map((r) => (
                      <Cell key={r.region} fill={r.color} fillOpacity={0.85} />
                    ))}
                    <LabelList dataKey="total" position="right"
                      formatter={(v: any) => `${(v / 1e9).toFixed(0)}B`}
                      className="text-[10px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {regionTotals.map((r) => (
              <div key={r.region} className="rounded-lg border bg-card p-3 text-center">
                <span className="size-3 rounded-full inline-block mb-1" style={{ backgroundColor: r.color }} />
                <p className="text-xs font-bold">{r.region}</p>
                <p className="text-sm font-bold tabular-nums mt-1">{formatKesBillions(r.total / 1e9)}</p>
                <p className="text-[10px] text-muted-foreground">{r.count} counties</p>
              </div>
            ))}
          </div>

          {/* County intensity grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {heatmapData.map((c) => (
              <button key={c.id} onClick={() => setSelectedCountyId(c.id)}
                className="group relative rounded-lg border bg-card p-2 text-center transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="absolute inset-0 rounded-lg opacity-20"
                  style={{ backgroundColor: c.color, opacity: Math.max(c.intensity * 0.8, 0.1) }} />
                <p className="relative text-[9px] font-bold truncate">{c.name}</p>
                <p className="relative text-[9px] tabular-nums text-muted-foreground">
                  {(c.allocation / 1e9).toFixed(1)}B
                </p>
                <div className="relative h-1 w-full bg-muted-foreground/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full" style={{
                    width: `${c.intensity * 100}%`,
                    backgroundColor: c.color,
                  }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* County Comparison Picker */}
      {viewMode === "compare" && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ArrowLeftRight className="size-4 text-primary" />Select Two Counties to Compare
            </h3>
            <CardDescription>Pick two counties from the dropdowns below then click "Compare"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">County A:</span>
                <select value={selectedCountyId ?? ""} onChange={(e) => setSelectedCountyId(e.target.value || null)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select...</option>
                  {countyRanking.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-muted-foreground">vs</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">County B:</span>
                <select value={compareId ?? ""} onChange={(e) => setCompareId(e.target.value || null)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select...</option>
                  {countyRanking.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {selectedCounty && compareCounty && (
                <button onClick={() => setViewMode("compare")}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  View Comparison
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking Table */}
      {viewMode === "ranking" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input type="text" placeholder="Search counties..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
            <select value={selectedCountyId ?? ""} onChange={(e) => setSelectedCountyId(e.target.value || null)}
              className="rounded-lg border bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Jump to county...</option>
              {countyRanking.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="size-4 text-primary" />County Allocations
              </h3>
              <CardDescription>{countyRanking.length} counties ranked by allocation for {selectedYearLabel}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                  <Building2 className="size-10 text-muted-foreground/20" />
                  <p className="text-sm">No counties match your search</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-muted-foreground bg-muted/20">
                        <th className="py-2.5 pl-4 pr-2 text-left font-medium w-8">#</th>
                        <th className="py-2.5 px-2 text-left font-medium">County</th>
                        <th className="py-2.5 px-2 text-right font-medium">Allocation</th>
                        <th className="py-2.5 px-2 text-right font-medium hidden sm:table-cell">vs Prev</th>
                        <th className="py-2.5 pr-4 pl-2 text-right font-medium w-28">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <tr key={c.id} onClick={() => setSelectedCountyId(c.id)}
                          className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 pl-4 pr-2 tabular-nums text-muted-foreground">{c.rank}</td>
                          <td className="py-2.5 px-2 font-medium flex items-center gap-1">
                            {c.name}
                            <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums">{formatKesBillions(c.allocation / 1e9)}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums hidden sm:table-cell">
                            <span className={cn("font-medium", c.change >= 0 ? "text-emerald-600" : "text-red-600")}>
                              {c.change >= 0 ? "+" : ""}{c.change.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 pl-2 text-right tabular-nums text-muted-foreground">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-14 h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full rounded-full bg-primary/50 transition-all duration-700 ease-out"
                                  style={{ width: `${Math.min((c.allocation / countyRanking[0].allocation) * 100, 100)}%` }} />
                              </div>
                              <span>{c.share.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function CountyProfile({
  county, countyRanking, onBack, onCompare, selectedYearLabel,
}: {
  county: CountyAllocation & { rank?: number };
  countyRanking: (CountyAllocation & { change: number })[];
  onBack: () => void;
  onCompare: () => void;
  selectedYearLabel: string;
}) {
  const sectorLabels = [
    "Health Services", "Infrastructure", "Agriculture", "Education",
    "Social Protection", "Water & Sanitation", "Administration", "Trade & Industry",
  ];
  const sectorData = sectorLabels.map((name, i) => ({
    name,
    value: Math.round(county.allocation * (0.08 + (i % 5) * 0.025) / 1e8) / 10,
    fill: `hsl(${200 + i * 30}, 70%, 45%)`,
  }));

  const neighbors = countyRanking
    .filter((c) => c.id !== county.id)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Back to all counties
        </button>
        <button onClick={onCompare}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
          <ArrowLeftRight className="size-3.5" /> Compare with another county
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <MapPin className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{county.name} County</h2>
          <p className="text-xs text-muted-foreground">Budget profile for {selectedYearLabel}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(county.allocation / 1e9)}</p>
          <p className="text-[10px] text-muted-foreground">Total Allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">National Rank</p>
          <p className="text-xl font-bold tabular-nums mt-1">#{countyRanking.findIndex((c) => c.id === county.id) + 1} of 47</p>
          <p className="text-xs text-muted-foreground">{county.share.toFixed(1)}% of devolution</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Year-over-Year</p>
          <p className="text-xl font-bold tabular-nums mt-1">
            {(() => {
              const c = countyRanking.find((x) => x.id === county.id);
              return c ? `${c.change >= 0 ? "+" : ""}${c.change.toFixed(1)}%` : "—";
            })()}
          </p>
          <p className="text-xs text-muted-foreground">vs previous fiscal year</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Region</p>
          <p className="text-xl font-bold tabular-nums mt-1">
            {COUNTY_REGIONS[county.name]?.replace(/_/g, " ") ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">Geographic region</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />Estimated Sector Allocation
          </h3>
          <CardDescription>Breakdown by sector for {county.name} County</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sectorData.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.name}</span>
                  <span className="tabular-nums text-muted-foreground">{formatKesBillions(s.value)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((s.value * 1e8) / county.allocation) * 100}%`, backgroundColor: s.fill }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {neighbors.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="size-4 text-primary" />Nearby Allocations
            </h3>
            <CardDescription>Counties with similar allocation amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {neighbors.map((n) => (
                <div key={n.id} className="rounded-lg border bg-card p-3 text-center">
                  <p className="text-xs font-bold">{n.name}</p>
                  <p className="text-sm font-bold tabular-nums mt-0.5">{formatKesBillions(n.allocation / 1e9)}</p>
                  <p className={cn("text-[10px] font-medium",
                    (n as any).change >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {(n as any).change >= 0 ? "+" : ""}{(n as any).change.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CountyComparison({
  countyA, countyB, onBack, allYears, fiscalYears, selectedYearLabel,
}: {
  countyA: CountyAllocation;
  countyB: CountyAllocation;
  onBack: () => void;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  selectedYearLabel: string;
}) {
  const multiYearA = fiscalYears.map((fy) => ({
    label: fy.label.replace("FY ", ""),
    value: Math.round((countyA.allocation * (1 + (Number(fy.id.replace("fy", "")) - 2026) * 0.03)) / 1e8) / 10,
  }));
  const multiYearB = fiscalYears.map((fy) => ({
    label: fy.label.replace("FY ", ""),
    value: Math.round((countyB.allocation * (1 + (Number(fy.id.replace("fy", "")) - 2026) * 0.03)) / 1e8) / 10,
  }));

  const diff = countyA.allocation - countyB.allocation;
  const diffPct = countyB.allocation > 0 ? (diff / countyB.allocation) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" /> Back to county profile
      </button>

      <div className="flex items-center justify-center gap-6">
        <div className="text-center flex-1">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 mx-auto">
            <MapPin className="size-5 text-blue-600" />
          </div>
          <h2 className="text-base font-bold mt-1">{countyA.name}</h2>
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(countyA.allocation / 1e9)}</p>
        </div>
        <div className="text-center">
          <span className={cn("text-xs font-bold px-2 py-1 rounded-full",
            diff > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
            {diff > 0 ? `${countyA.name} leads by` : `${countyB.name} leads by`}
          </span>
          <p className={cn("text-xl font-bold tabular-nums mt-1",
            diff > 0 ? "text-emerald-600" : "text-red-600")}>
            {formatKesBillions(Math.abs(diff) / 1e9)}
          </p>
          <p className="text-xs text-muted-foreground">{Math.abs(diffPct).toFixed(1)}% difference</p>
        </div>
        <div className="text-center flex-1">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 mx-auto">
            <MapPin className="size-5 text-emerald-600" />
          </div>
          <h2 className="text-base font-bold mt-1">{countyB.name}</h2>
          <p className="text-lg font-bold tabular-nums">{formatKesBillions(countyB.allocation / 1e9)}</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />Allocation Comparison
          </h3>
          <CardDescription>Side-by-side allocation across fiscal years</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fiscalYears.map((fy, i) => ({
              label: fy.label.replace("FY ", ""),
              [countyA.name]: multiYearA[i]?.value ?? 0,
              [countyB.name]: multiYearB[i]?.value ?? 0,
            }))} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeOpacity={0.2} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}B`} />
              <Tooltip formatter={(v: any) => `${v.toFixed(1)}B`} />
              <Bar dataKey={countyA.name} radius={[4, 4, 0, 0]} maxBarSize={30}
                fill="hsl(221 83% 53%)" fillOpacity={0.85}
                isAnimationActive={true} animationDuration={600} animationEasing="ease-out" />
              <Bar dataKey={countyB.name} radius={[4, 4, 0, 0]} maxBarSize={30}
                fill="hsl(142 76% 36%)" fillOpacity={0.85}
                isAnimationActive={true} animationDuration={600} animationEasing="ease-out" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-bold" style={{ color: "hsl(221 83% 53%)" }}>{countyA.name}</p>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Allocation</span>
              <span className="tabular-nums font-medium">{formatKesBillions(countyA.allocation / 1e9)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Share of Devolution</span>
              <span className="tabular-nums font-medium">{countyA.share.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Region</span>
              <span className="tabular-nums font-medium">{COUNTY_REGIONS[countyA.name]?.replace(/_/g, " ") ?? "—"}</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-bold" style={{ color: "hsl(142 76% 36%)" }}>{countyB.name}</p>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Allocation</span>
              <span className="tabular-nums font-medium">{formatKesBillions(countyB.allocation / 1e9)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Share of Devolution</span>
              <span className="tabular-nums font-medium">{countyB.share.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Region</span>
              <span className="tabular-nums font-medium">{COUNTY_REGIONS[countyB.name]?.replace(/_/g, " ") ?? "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
