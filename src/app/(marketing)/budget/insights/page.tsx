"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3, Building2, Hammer, TrendingUp, Info, AlertTriangle,
  CheckCircle2, ArrowRight, Search, ChevronRight, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";
import { seedCountyProfiles } from "@/lib/reports-api";

const SECTOR_COLORS: Record<string, string> = {
  Education: "#10b981", Infrastructure: "#3b82f6", Health: "#f59e0b",
  Security: "#ef4444", Agriculture: "#8b5cf6", Housing: "#06b6d4",
  "Social Protection": "#ec4899", Governance: "#64748b",
};

export default function BudgetInsightsPage() {
  const [data, setData] = useState<BudgetSchema | null>(null);
  const [tab, setTab] = useState<"overview" | "sectors" | "counties" | "projects">("overview");

  useEffect(() => {
    fetchReportData().then((r) => setData(r.allYears[r.selectedYear] ?? null));
  }, []);

  const sectors = data?.sector_chart ?? [];
  const highlights = data?.highlights ?? [];
  const projects = data?.projects ?? [];
  const kpis = data?.kpis ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-[#020304]">Budget Insights</h1>
        <p className="mt-0.5 text-sm text-[#5f6368]">Explore Kenya&apos;s national budget data</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex items-center gap-1 border-b border-[#e1e4e8]">
        {(["overview", "sectors", "counties", "projects"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium border-b-2 transition-all capitalize",
              tab === t
                ? "border-[#006d37] text-[#006d37]"
                : "border-transparent text-[#5f6368] hover:text-[#020304]",
            )}
          >
            {t === "overview" ? "Overview" :
             t === "sectors" ? "Sectors" :
             t === "counties" ? "Counties" : "Projects"}
          </button>
        ))}
      </div>

      {/* === OVERVIEW TAB === */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.key} className="rounded-xl border border-[#e1e4e8] bg-white p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">{kpi.label}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-[#020304]">
                  {kpi.prefix}{kpi.value.toLocaleString()}{kpi.suffix}
                </p>
                {kpi.previous && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#006d37]">
                    <TrendingUp className="size-3" />+{Math.round((kpi.value - kpi.previous) / kpi.previous * 100)}% YoY
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Sector Allocation</h3>
              <div className="space-y-2.5">
                {sectors.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.fill }} />
                    <span className="flex-1 text-xs text-[#5f6368]">{s.name}</span>
                    <span className="text-xs font-medium text-[#020304]">KES {s.value}B</span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e1e4e8]">
                      <div className="h-full rounded-full" style={{ width: `${(s.value / Math.max(...sectors.map((x) => x.value))) * 100}%`, backgroundColor: s.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {highlights.map((h, i) => {
                const iconMap = {
                  success: CheckCircle2, trend: TrendingUp, info: Info, warning: AlertTriangle,
                };
                const colorMap = {
                  success: "border-[#006d37]/20 bg-[#e8f5e9] text-[#006d37]",
                  trend: "border-[#006d37]/20 bg-[#e8f5e9] text-[#006d37]",
                  info: "border-[#3b82f6]/20 bg-[#eff6ff] text-[#3b82f6]",
                  warning: "border-[#f59e0b]/20 bg-[#fef7e0] text-[#735c00]",
                };
                const Icon = iconMap[h.type] ?? Info;
                return (
                  <div key={i} className={cn("rounded-xl border p-3.5", colorMap[h.type])}>
                    <div className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#020304]">{h.title}</p>
                        <p className="text-xs text-[#5f6368] mt-0.5">{h.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === SECTORS TAB === */}
      {tab === "sectors" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
            <Link key={sector.name} href={`/budget/insights/sectors/${sector.name.toLowerCase()}`}
              className="group rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all hover:border-[#006d37]/30 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${SECTOR_COLORS[sector.name] ?? "#64748b"}15` }}>
                    <BarChart3 className="size-4" style={{ color: SECTOR_COLORS[sector.name] ?? "#64748b" }} />
                  </div>
                  <span className="text-sm font-semibold text-[#020304]">{sector.name}</span>
                </div>
                <ChevronRight className="size-4 text-[#5f6368] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="text-lg font-bold text-[#020304]">KES {sector.value}B</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e1e4e8]">
                <div className="h-full rounded-full transition-all" style={{
                  width: `${(sector.value / Math.max(...sectors.map((s) => s.value))) * 100}%`,
                  backgroundColor: SECTOR_COLORS[sector.name] ?? "#64748b",
                }} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* === COUNTIES TAB === */}
      {tab === "counties" && (
        <CountiesView />
      )}

      {/* === PROJECTS TAB === */}
      {tab === "projects" && (
        <div className="space-y-3">
          {projects.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Total Projects" value={projects.length.toString()} />
              <SummaryCard label="Total Budget" value={`KES ${projects.reduce((s, p) => s + p.budget, 0).toLocaleString()}M`} />
              <SummaryCard label="Capital Deployed" value={`KES ${projects.reduce((s, p) => s + p.spent, 0).toLocaleString()}M`} />
              <SummaryCard label="Completion" value={`${projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.spent, 0) / projects.reduce((s, p) => s + p.budget, 0) * 100) : 0}%`} />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono text-[#5f6368]">{project.id}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm font-semibold text-[#020304]">{project.title}</p>
                  </div>
                  <Hammer className="size-4 shrink-0 text-[#5f6368]/40" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-[#5f6368]">
                  <span>{project.sector}</span>
                  <span className="text-[#e1e4e8]">|</span>
                  <span>{project.county}</span>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-[#5f6368]">Budget utilization</span>
                    <span className="font-medium text-[#020304]">
                      {project.budget > 0 ? Math.round(project.spent / project.budget * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e4e8]">
                    <div className={cn("h-full rounded-full", project.status === "completed" ? "bg-[#006d37]" : "bg-[#3b82f6]")}
                      style={{ width: `${project.budget > 0 ? Math.round(project.spent / project.budget * 100) : 0}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#5f6368] mt-1">
                    <span>KES {project.spent.toLocaleString()}M spent</span>
                    <span>of KES {project.budget.toLocaleString()}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e1e4e8] bg-white p-3.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6368]">{label}</p>
      <p className="mt-1 text-base font-bold text-[#020304]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    completed: "bg-[#e8f5e9] text-[#006d37]",
    in_progress: "bg-[#eff6ff] text-[#3b82f6]",
    planned: "bg-[#fef7e0] text-[#735c00]",
  };
  return (
    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", variants[status] ?? variants.planned)}>
      {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CountiesView() {
  const counties = seedCountyProfiles();
  const [search, setSearch] = useState("");
  const allCountyNames = Object.values(counties).map((c) => c.name);

  const filtered = allCountyNames.filter((c) =>
    !search || c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5f6368]" />
        <input
          placeholder="Search counties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e1e4e8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#020304] outline-none placeholder:text-[#5f6368] focus:border-[#006d37]/40"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((name) => {
          const profile = counties[name.toLowerCase().replace(/\s/g, "")];
          if (!profile) return null;
          return (
            <Link key={name} href={`/budget/insights/counties/${name.toLowerCase()}`}
              className="group rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all hover:border-[#006d37]/30 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f5e9]">
                    <MapPin className="size-4 text-[#006d37]" />
                  </div>
                  <span className="text-sm font-semibold text-[#020304]">{name}</span>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  profile.transparency_rating === "High" ? "bg-[#e8f5e9] text-[#006d37]" :
                  profile.transparency_rating === "Moderate" ? "bg-[#fef7e0] text-[#735c00]" :
                  "bg-[#fce8e6] text-[#c5221f]",
                )}>
                  {profile.transparency_rating}
                </span>
              </div>
              <p className="text-lg font-bold text-[#020304]">KES {profile.total_allocation.toLocaleString()}B</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-[#5f6368]">
                <span>Rating: {profile.citizen_rating}/5</span>
                <span>KES {profile.allocation_per_capita.toLocaleString()}/cap</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
