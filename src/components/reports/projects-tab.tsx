"use client";

import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { Search, Hammer, MapPin, Building2, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/motion/motion-tokens";
import type { BudgetSchema, BudgetProject } from "@/lib/budget-schema";
import type { FiscalYearMeta } from "@/lib/reports-api";

interface Props {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

export function ProjectsTab({ currentData }: Props) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projects = currentData.projects ?? [];

  const sectors = useMemo(() => {
    const set = new Set(projects.map((p) => p.sector));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (sectorFilter && p.sector !== sectorFilter) return false;
      return true;
    });
  }, [projects, search, sectorFilter]);

  const totalBudget = useMemo(() => projects.reduce((sum, p) => sum + p.budget, 0), [projects]);
  const totalSpent = useMemo(() => projects.reduce((sum, p) => sum + p.spent, 0), [projects]);
  const completionRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeItem} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Total Projects</span>
            <p className="text-lg font-bold tabular-nums">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Capital Deployed</span>
            <p className="text-lg font-bold tabular-nums">KES {totalSpent.toLocaleString()}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Total Budget</span>
            <p className="text-lg font-bold tabular-nums">KES {totalBudget.toLocaleString()}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground">Completion Rate</span>
            <p className="text-lg font-bold tabular-nums">{completionRate}%</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${completionRate}%` }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeItem} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((s) => (
            <button key={s} onClick={() => setSectorFilter(sectorFilter === s ? null : s)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                sectorFilter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/50 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="grid gap-3 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} expandedId={expandedId} onToggle={setExpandedId} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Hammer className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No projects match your search</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, expandedId, onToggle }: {
  project: BudgetProject;
  expandedId: string | null;
  onToggle: (id: string | null) => void;
}) {
  const isExpanded = expandedId === project.id;
  const progress = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-micro text-muted-foreground font-mono">{project.id}</span>
              <ProjectBadge status={project.status} />
            </div>
            <h3 className="text-sm font-semibold truncate">{project.title}</h3>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={() => onToggle(isExpanded ? null : project.id)}>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="size-3" />
            {project.sector}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {project.county}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Budget utilization</span>
            <span className="font-medium tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", progress >= 90 ? "bg-success" : progress >= 50 ? "bg-info" : "bg-warning")}
              style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-micro text-muted-foreground mt-1">
            <span>KES {project.spent.toLocaleString()}M spent</span>
            <span>of KES {project.budget.toLocaleString()}M</span>
          </div>
        </div>

        {isExpanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="space-y-2 pt-1 border-t border-border/30">
            <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Impact</span>
              <span className="font-medium">{project.impact}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectBadge({ status }: { status: BudgetProject["status"] }) {
  const variants: Record<string, { label: string; classes: string }> = {
    completed: { label: "Completed", classes: "bg-success/10 text-success border-success/20" },
    in_progress: { label: "In Progress", classes: "bg-info/10 text-info border-info/20" },
    planned: { label: "Planned", classes: "bg-warning/10 text-warning border-warning/20" },
  };
  const v = variants[status] ?? variants.planned;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-1.5 py-0.5 text-micro font-medium", v.classes)}>
      {v.label}
    </span>
  );
}
