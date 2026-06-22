"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  MapPin,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReportPageData } from "@/lib/reports-hub";
import type { BudgetFiscalYear } from "@/lib/budget-api";
import { KpiCard, SECTOR_COLORS } from "@/components/reports/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatKesBillions } from "@/lib/budget-format";
import { COUNTIES } from "@/constants/counties";

interface CountyRank {
  rank: number;
  id: string;
  name: string;
  allocation: number;
  prevAllocation: number;
  change: number;
  share: number;
}

interface CountyViewProps {
  byYear: Record<string, ReportPageData>;
  selectedYear: string;
  fiscalYears: BudgetFiscalYear[];
}

export function CountyView({ byYear, selectedYear, fiscalYears }: CountyViewProps) {
  const current = byYear[selectedYear];
  const [search, setSearch] = useState("");
  const [selectedCountyId, setSelectedCountyId] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<{ id: string; name: string } | null>(null);

  const countyRanking = useMemo(() => {
    if (!current) return [];
    const approved = current.allocations.filter((a: any) => a.allocation_type === "approved");
    const countyIds = current.entities.filter((e: any) => e.type === "county").map((e: any) => e.id);
    const countyAllocs = approved.filter((a: any) => countyIds.includes(a.entity));

    const map: Record<string, number> = {};
    for (const a of countyAllocs) map[a.entity_name] = (map[a.entity_name] || 0) + Number(a.amount);

    // Previous year data
    const prevYear = fiscalYears.find((y) => y.id !== selectedYear);
    const prevData = prevYear ? byYear[prevYear.id] : null;
    const prevMap: Record<string, number> = {};
    if (prevData) {
      const prevApproved = prevData.allocations.filter((a: any) => a.allocation_type === "approved");
      const prevCounty = prevApproved.filter((a: any) => countyIds.includes(a.entity));
      for (const a of prevCounty) prevMap[a.entity_name] = (prevMap[a.entity_name] || 0) + Number(a.amount);
    }

    const total = Object.values(map).reduce((s, v) => s + v, 0);
    const countyEntityIds = countyIds;

    return Object.entries(map)
      .map(([name, value], i) => {
        const idx = COUNTIES.findIndex((c) => `${c} County Government` === name);
        const id = countyEntityIds[idx] ?? "";
        const prev = prevMap[name] || 0;
        const change = prev > 0 ? ((value - prev) / prev) * 100 : 0;
        return {
          rank: 0,
          id,
          name: name.replace(" County Government", ""),
          allocation: Math.round(value / 1e8) / 10,
          prevAllocation: Math.round(prev / 1e8) / 10,
          change,
          share: total > 0 ? (value / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.allocation - a.allocation)
      .map((c, i) => ({ ...c, rank: i + 1 }));
  }, [current, byYear, selectedYear, fiscalYears]);

  const selectedRank = selectedCountyId ? countyRanking.find((c) => c.id === selectedCountyId) : null;
  const filtered = search
    ? countyRanking.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countyRanking;

  const totalDevolution = countyRanking.reduce((s, c) => s + c.allocation, 0);
  const avgAllocation = countyRanking.length > 0 ? totalDevolution / countyRanking.length : 0;

  const handleBack = useCallback(() => {
    if (selectedConstituency) setSelectedConstituency(null);
    else setSelectedCountyId(null);
  }, [selectedConstituency]);

  const selectedYearLabel = fiscalYears.find((y) => y.id === selectedYear)?.label || "FY";

  if (selectedConstituency) {
    return (
      <WardView
        constituency={selectedConstituency}
        allocations={current?.allocations ?? []}
        entities={current?.entities ?? []}
        onBack={handleBack}
        selectedYearLabel={selectedYearLabel}
      />
    );
  }

  if (selectedCountyId && selectedRank) {
    return (
      <CountyProfile
        county={{ id: selectedRank.id, name: selectedRank.name, allocation: selectedRank.allocation * 1e8 }}
        allocations={current?.allocations ?? []}
        entities={current?.entities ?? []}
        onBack={() => setSelectedCountyId(null)}
        onSelectConstituency={setSelectedConstituency}
        selectedYearLabel={selectedYearLabel}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── County KPIs ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Devolution" value={formatKesBillions(totalDevolution)} trend={10.4} subtitle={selectedYearLabel} />
        <KpiCard label="Counties" value="47" subtitle="All county governments" />
        <KpiCard label="Average per County" value={formatKesBillions(avgAllocation)} subtitle="Equally weighted" />
        <KpiCard label="National Budget Share" value="10.4%" trend={1.2} subtitle="Devolution allocation" />
      </div>

      {/* ── Search + Dropdown ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search counties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>
        <select
          value={selectedCountyId ?? ""}
          onChange={(e) => setSelectedCountyId(e.target.value || null)}
          className="rounded-lg border bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
        >
          <option value="">Jump to county...</option>
          {countyRanking.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* ── Ranking Table ── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="size-4 text-primary" />County Allocations
          </CardTitle>
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
                      <td className="py-2.5 px-2 text-right tabular-nums">{formatKesBillions(c.allocation)}</td>
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
    </div>
  );
}

// ─── County Profile (reused from previous but extracted) ───
function CountyProfile({ county, allocations, entities, onBack, onSelectConstituency, selectedYearLabel }: any) {
  const countyAllocs = allocations.filter((a: any) => a.entity_type === "county" && a.entity === county.id);
  const countyTotal = countyAllocs.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const constituencyEntities = entities.filter((e: any) => e.type === "constituency" && e.parent === county.id);
  const constituencyAllocs = allocations.filter((a: any) => a.entity_type === "constituency" && a.entity.startsWith(`const-${county.id.split("-")[1]}`));
  const totalConstituency = constituencyAllocs.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const constWithAllocs = constituencyEntities
    .map((e: any) => {
      const alloc = constituencyAllocs.filter((a: any) => a.entity === e.id);
      return { ...e, totalAlloc: alloc.reduce((s: number, a: any) => s + Number(a.amount), 0) };
    })
    .sort((a: any, b: any) => b.totalAlloc - a.totalAlloc);

  const sectorMap: Record<string, number> = {};
  for (const a of countyAllocs) {
    const parts = a.entity_name.split(" - ");
    const sector = parts.length > 1 ? parts[0] : a.entity_name;
    sectorMap[sector] = (sectorMap[sector] || 0) + Number(a.amount);
  }
  const countySectors = Object.entries(sectorMap)
    .map(([name, value], i) => ({ name, value: Math.round(value / 1e8) / 10, fill: SECTOR_COLORS[i % SECTOR_COLORS.length] }))
    .sort((a: any, b: any) => b.value - a.value);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" /> Back to all counties
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
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Sector Allocations</CardTitle>
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
                    <div className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${((s.value * 1e8) / countyTotal) * 100}%`, backgroundColor: s.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {constWithAllocs.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Users className="size-4 text-primary" />Constituencies</CardTitle>
            <CardDescription>{constWithAllocs.length} constituencies in {county.name} County</CardDescription>
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
                      <tr key={c.id} onClick={() => onSelectConstituency({ id: c.id, name: c.name })}
                        className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 pr-4 font-medium flex items-center gap-1">
                          {c.name} <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums">{formatKesBillions(c.totalAlloc / 1e9)}</td>
                        <td className="py-2.5 pl-4 text-right tabular-nums text-muted-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <div className="hidden sm:block w-14 h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-primary/50 transition-all duration-700 ease-out" style={{ width: `${Math.min(share, 100)}%` }} />
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
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" /> Back to county profile
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
          <CardTitle className="text-sm flex items-center gap-2"><MapPin className="size-4 text-primary" />Wards</CardTitle>
          <CardDescription>{wardsWithAllocs.length} wards in {constituency.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {wardsWithAllocs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12"><MapPin className="size-10 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No ward data</p></div>
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
                              <div className="h-full rounded-full bg-amber-500/50 transition-all duration-700 ease-out" style={{ width: `${Math.min(share, 100)}%` }} />
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
