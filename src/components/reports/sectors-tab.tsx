"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  GraduationCap, Wrench, HeartPulse, Shield, Sprout, Building, Users, Scale,
  Search, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/motion/motion-tokens";
import type { BudgetSchema, BudgetProject } from "@/lib/budget-schema";
import type { FiscalYearMeta } from "@/lib/reports-api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface Props {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}

const SECTOR_META: Record<string, { icon: typeof GraduationCap; color: string; description: string }> = {
  Education: { icon: GraduationCap, color: "#10b981", description: "Primary, secondary, TVET, and university education" },
  Infrastructure: { icon: Wrench, color: "#3b82f6", description: "Roads, bridges, public works, and digital infrastructure" },
  Health: { icon: HeartPulse, color: "#f59e0b", description: "Primary healthcare, hospitals, and UHC programs" },
  Security: { icon: Shield, color: "#ef4444", description: "National defense, internal security, and policing" },
  Agriculture: { icon: Sprout, color: "#8b5cf6", description: "Food security, irrigation, and value addition" },
  Housing: { icon: Building, color: "#06b6d4", description: "Affordable housing and urban development" },
  "Social Protection": { icon: Users, color: "#ec4899", description: "Cash transfers, elderly care, and safety nets" },
  Governance: { icon: Scale, color: "#64748b", description: "Judiciary, devolution, and public administration" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

export function SectorsTab({ currentData }: Props) {
  const [search, setSearch] = useState("");
  const sectors = currentData.sector_chart ?? [];
  const projects = currentData.projects ?? [];

  const filtered = sectors.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeItem}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-primary" />
                Sector Allocation Comparison
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectors} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `KES ${v}B`} />
                  <ReTooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sectors.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search sectors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sector) => {
          const meta = SECTOR_META[sector.name];
          const Icon = meta?.icon ?? Building;
          const color = meta?.color ?? "#64748b";
          const sectorProjects = projects.filter((p) => p.sector === sector.name);
          return (
            <motion.div key={sector.name} variants={fadeItem}>
              <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="size-4" style={{ color }} />
                      </div>
                      <span className="text-sm font-semibold">{sector.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {sectorProjects.length} projects
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-lg font-bold tabular-nums">KES {sector.value}B</span>
                      <p className="text-micro text-muted-foreground">{meta?.description}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${(sector.value / Math.max(...sectors.map((s) => s.value))) * 100}%`,
                      backgroundColor: color,
                    }} />
                  </div>
                  {sectorProjects.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      {sectorProjects.slice(0, 2).map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground truncate max-w-[160px]">{p.title}</span>
                          <ProjectStatusBadge status={p.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProjectStatusBadge({ status }: { status: BudgetProject["status"] }) {
  const variants: Record<string, { label: string; classes: string }> = {
    completed: { label: "Done", classes: "bg-success/10 text-success border-success/20" },
    in_progress: { label: "Active", classes: "bg-info/10 text-info border-info/20" },
    planned: { label: "Planned", classes: "bg-warning/10 text-warning border-warning/20" },
  };
  const v = variants[status] ?? variants.planned;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-1.5 py-0.5 text-micro font-medium", v.classes)}>
      {v.label}
    </span>
  );
}
