"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle, ArrowLeft, Building2, CheckCircle2, Clock, Hammer,
  MapPin, Search, TrendingUp, Users, XCircle,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, RadialBar, RadialBarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { BudgetSchema, WardProject } from "@/lib/budget-schema";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatKesBillions } from "@/lib/budget-format";
import { generateCountyAllocations } from "@/lib/reports-api";

interface ProjectsTabProps {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: { id: string; label: string; is_current: boolean }[];
  selectedYear: string;
}

const STATUS_COLORS: Record<string, string> = {
  ONGOING: "hsl(221 83% 53%)",
  COMPLETED: "hsl(142 76% 36%)",
  STALLED: "hsl(24 95% 53%)",
  PLANNED: "hsl(47 95% 48%)",
  CANCELLED: "hsl(346 77% 50%)",
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  ONGOING: Clock,
  COMPLETED: CheckCircle2,
  STALLED: AlertCircle,
  PLANNED: Clock,
  CANCELLED: XCircle,
};

function ProjectCard({
  project, onClick,
}: {
  project: WardProject;
  onClick: () => void;
}) {
  const StatusIcon = STATUS_ICONS[project.lifecycle_status] ?? Clock;
  const statusColor = STATUS_COLORS[project.lifecycle_status] ?? "hsl(0 0% 60%)";
  const absorption = project.financials.allocated_amount > 0
    ? (project.financials.expenditure_to_date / project.financials.allocated_amount) * 100
    : 0;
  const releaseRate = project.financials.allocated_amount > 0
    ? (project.financials.released_amount / project.financials.allocated_amount) * 100
    : 0;
  let countyName = `County ${project.location.county_id}`;

  return (
    <button onClick={onClick} className="group text-left w-full">
      <Card className="border-border/60 group-hover:border-primary/20 transition-all duration-300 h-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{project.project_name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3" />
                {countyName} · {project.location.ward_name}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium whitespace-nowrap"
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
              <StatusIcon className="size-2.5" />
              {project.lifecycle_status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[9px] text-muted-foreground">Allocated</p>
              <p className="text-xs font-bold tabular-nums">{formatKesBillions(project.financials.allocated_amount / 1e9)}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Released</p>
              <p className="text-xs font-bold tabular-nums">{formatKesBillions(project.financials.released_amount / 1e9)}</p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground">Spent</p>
              <p className="text-xs font-bold tabular-nums">{formatKesBillions(project.financials.expenditure_to_date / 1e9)}</p>
            </div>
          </div>

          {/* Absorption meter */}
          <div>
            <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
              <span>Absorption</span>
              <span>{absorption.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(absorption, 100)}%`,
                  backgroundColor: absorption > 80 ? "hsl(142 76% 36%)" : absorption > 50 ? "hsl(47 95% 48%)" : "hsl(24 95% 53%)",
                }} />
            </div>
          </div>

          {/* Contractor */}
          {project.contractor_metadata.company_name && (
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <Hammer className="size-3" />
              <span className="truncate">{project.contractor_metadata.company_name}</span>
            </div>
          )}

          {/* Oversight */}
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
            {project.oversight_metrics.stalled_flag && (
              <span className="flex items-center gap-0.5 text-amber-600">
                <AlertCircle className="size-3" /> Stalled
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Users className="size-3" /> {project.oversight_metrics.citizen_reports_count} reports
            </span>
            {project.oversight_metrics.last_audit_date && (
              <span>Audited: {project.oversight_metrics.last_audit_date}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function ProjectDetailView({
  project, onBack, allYears,
}: {
  project: WardProject;
  onBack: () => void;
  allYears: Record<string, BudgetSchema>;
}) {
  const statusColor = STATUS_COLORS[project.lifecycle_status] ?? "hsl(0 0% 60%)";
  const absorption = project.financials.allocated_amount > 0
    ? (project.financials.expenditure_to_date / project.financials.allocated_amount) * 100
    : 0;

  const radialData = [
    { name: "Allocated", value: project.financials.allocated_amount, fill: "hsl(221 83% 53%)" },
    { name: "Released", value: project.financials.released_amount, fill: "hsl(142 76% 36%)" },
    { name: "Expended", value: project.financials.expenditure_to_date, fill: "hsl(47 95% 48%)" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" /> Back to projects
      </button>

      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Hammer className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{project.project_name}</h2>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
              {project.lifecycle_status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {project.location.ward_name} · County {project.location.county_id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Allocated</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(project.financials.allocated_amount / 1e9)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Released</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(project.financials.released_amount / 1e9)}</p>
          <p className="text-xs text-muted-foreground">
            {project.financials.allocated_amount > 0
              ? `${((project.financials.released_amount / project.financials.allocated_amount) * 100).toFixed(0)}% of allocation`
              : ""}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Expenditure</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatKesBillions(project.financials.expenditure_to_date / 1e9)}</p>
          <p className="text-xs text-muted-foreground">{absorption.toFixed(0)}% absorption rate</p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />Financial Overview
          </h3>
          <CardDescription>Allocation vs release vs expenditure breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={radialData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => formatKesBillions(v / 1e9)} />
              <Tooltip formatter={(v: any) => formatKesBillions(v / 1e9)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}
                isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                {radialData.map((d, i) => (
                  <Cell key={i} fill={d.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Hammer className="size-4 text-primary" />Contractor Details
            </h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{project.contractor_metadata.company_name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CR12 Reg No.</span>
              <span className="tabular-nums font-medium">{project.contractor_metadata.cr12_registration_number}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Contract Value</span>
              <span className="tabular-nums font-medium">{formatKesBillions(project.contractor_metadata.contract_value / 1e9)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Funding Source</span>
              <span className="font-medium">{project.funding_source_entity}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Users className="size-4 text-primary" />Oversight & Compliance
            </h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Absorption Rate</span>
              <span className={cn("tabular-nums font-medium",
                absorption >= 80 ? "text-emerald-600" : absorption >= 50 ? "text-amber-600" : "text-red-600")}>
                {absorption.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Audit</span>
              <span className="tabular-nums font-medium">{project.oversight_metrics.last_audit_date ?? "N/A"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Stalled</span>
              <span className={cn("tabular-nums font-medium", project.oversight_metrics.stalled_flag ? "text-amber-600" : "text-emerald-600")}>
                {project.oversight_metrics.stalled_flag ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Citizen Reports</span>
              <span className="tabular-nums font-medium">{project.oversight_metrics.citizen_reports_count}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="size-4 text-primary" />Line Item Mapping
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parent Sector</span>
            <span className="font-medium">{project.line_item_mapping.parent_sector_code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">National Vote Head</span>
            <span className="font-medium text-right max-w-[60%]">{project.line_item_mapping.national_vote_head_reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parent Macro Allocation</span>
            <span className="tabular-nums font-medium">{formatKesBillions(project.line_item_mapping.parent_macro_allocation_ref_kes / 1e9)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProjectsTab({ currentData }: ProjectsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string | null>(null);

  const counties = useMemo(() => generateCountyAllocations(currentData), [currentData]);
  const projects = currentData.tier_3_ward_project_relational_schema_simulation;

  const stats = useMemo(() => {
    const total = projects.length;
    const totalAllocated = projects.reduce((s, p) => s + p.financials.allocated_amount, 0);
    const totalReleased = projects.reduce((s, p) => s + p.financials.released_amount, 0);
    const totalExpended = projects.reduce((s, p) => s + p.financials.expenditure_to_date, 0);
    const stalled = projects.filter((p) => p.oversight_metrics.stalled_flag).length;
    const ongoing = projects.filter((p) => p.lifecycle_status === "ONGOING").length;
    const avgAbsorption = totalAllocated > 0 ? (totalExpended / totalAllocated) * 100 : 0;
    return { total, totalAllocated, totalReleased, totalExpended, stalled, ongoing, avgAbsorption };
  }, [projects]);

  const statuses = useMemo(() => {
    const set = new Set(projects.map((p) => p.lifecycle_status));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.project_name.toLowerCase().includes(q) ||
        p.location.ward_name.toLowerCase().includes(q) ||
        p.contractor_metadata.company_name.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.lifecycle_status === statusFilter);
    }
    return result;
  }, [projects, search, statusFilter]);

  const selectedProject = selectedProjectUuid
    ? projects.find((p) => p.project_uuid === selectedProjectUuid)
    : null;

  // Special case: if we only have 1 project (from mock), show it as a preview but still let user browse
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProjectUuid(null)}
        allYears={{}}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
          <p className="text-lg font-bold tabular-nums mt-1">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Allocated</p>
          <p className="text-lg font-bold tabular-nums mt-1">{formatKesBillions(stats.totalAllocated / 1e9)}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Released</p>
          <p className="text-lg font-bold tabular-nums mt-1">{formatKesBillions(stats.totalReleased / 1e9)}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Avg Absorption</p>
          <p className="text-lg font-bold tabular-nums mt-1">{stats.avgAbsorption.toFixed(0)}%</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Stalled</p>
          <p className="text-lg font-bold tabular-nums mt-1" style={{ color: stats.stalled > 0 ? "hsl(24 95% 53%)" : undefined }}>
            {stats.stalled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input type="text" placeholder="Search projects, wards, contractors..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
          ))}
        </select>
        <select className="rounded-lg border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Hammer className="size-10 text-muted-foreground/20" />
          <p className="text-sm">No projects match your filters</p>
          <p className="text-xs">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.project_uuid}
              project={project}
              onClick={() => setSelectedProjectUuid(project.project_uuid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
