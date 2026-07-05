"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Info, CheckCircle2,
  BarChart3, DollarSign, PiggyBank, Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/motion/motion-tokens";
import type { BudgetSchema, BudgetTimelinePhase } from "@/lib/budget-schema";
import type { BudgetKpi, BudgetCallout, BudgetComparisonRow } from "@/types/budget-report";
import type { FiscalYearMeta } from "@/lib/reports-api";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  currentData: BudgetSchema;
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}

const LABEL_MAP: Record<string, string> = { fy2024: "FY 2024/25", fy2025: "FY 2025/26", fy2026: "FY 2026/27" };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

export function OverviewTab({ currentData, selectedYear }: Props) {
  const { kpis, sector_chart, comparison_rows, highlights, timeline, metadata } = currentData;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {metadata && (
        <motion.div variants={fadeItem} className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/10 p-5 sm:p-6">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="w-fit mb-1">{LABEL_MAP[selectedYear] ?? metadata.fiscal_year}</Badge>
            <h2 className="text-lg font-bold tracking-tight">{metadata.theme}</h2>
            <p className="text-sm text-muted-foreground">Presented by {metadata.presented_by}</p>
          </div>
        </motion.div>
      )}

      {kpis && kpis.length > 0 && (
        <motion.div variants={fadeItem} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.key} kpi={kpi} />
          ))}
        </motion.div>
      )}

      {sector_chart && sector_chart.length > 0 && (
        <motion.div variants={fadeItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PieChart className="size-4 text-primary" />
                Sector Allocation Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-56 w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sector_chart} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                        {sector_chart.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ReTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-1/2">
                  {sector_chart.slice(0, 8).map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: s.fill }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-medium tabular-nums">KES {s.value}B</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {timeline && timeline.length > 0 && (
        <motion.div variants={fadeItem}>
          <BudgetTimelineCard phases={timeline} />
        </motion.div>
      )}

      {highlights && highlights.length > 0 && (
        <motion.div variants={fadeItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-primary" />
                Key Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <CalloutCard key={i} callout={h} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {comparison_rows && comparison_rows.length > 0 && (
        <motion.div variants={fadeItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="size-4 text-primary" />
                Year-over-Year Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-xs text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Sector</th>
                      <th className="px-5 py-3 font-medium tabular-nums">FY 2025/26</th>
                      <th className="px-5 py-3 font-medium tabular-nums">FY 2026/27</th>
                      <th className="px-5 py-3 font-medium tabular-nums">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison_rows.map((row, i) => (
                      <ComparisonRow key={i} row={row} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function KpiCard({ kpi }: { kpi: BudgetKpi }) {
  const isUp = kpi.trend === "up";
  const Icon = isUp ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : TrendingUp;
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">{kpi.label}</span>
          <span className={cn("flex items-center gap-0.5 text-xs font-medium",
            isUp ? "text-success" : kpi.trend === "down" ? "text-destructive" : "text-muted-foreground")}>
            <Icon className="size-3" />
            {kpi.trend === "up" ? "+" : kpi.trend === "down" ? "-" : ""}{kpi.previous ? Math.round((kpi.value - kpi.previous) / kpi.previous * 100) : 0}%
          </span>
        </div>
        <div className="text-lg font-bold tabular-nums tracking-tight">
          {kpi.prefix}{kpi.value.toLocaleString()}{kpi.suffix}
        </div>
        {kpi.previous && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>vs prev</span>
              <span>{kpi.prefix}{kpi.previous.toLocaleString()}{kpi.suffix}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full transition-all", isUp ? "bg-success" : "bg-destructive")}
                style={{ width: `${Math.min((kpi.value / (kpi.previous || 1)) * 100, 100)}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CalloutCard({ callout }: { callout: BudgetCallout }) {
  const config = {
    info: { icon: Info, border: "border-info/20", bg: "bg-info/5", text: "text-info" },
    warning: { icon: AlertTriangle, border: "border-warning/20", bg: "bg-warning/5", text: "text-warning" },
    success: { icon: CheckCircle2, border: "border-success/20", bg: "bg-success/5", text: "text-success" },
    trend: { icon: TrendingUp, border: "border-primary/20", bg: "bg-primary/5", text: "text-primary" },
  };
  const c = config[callout.type] ?? config.info;
  const Icon = c.icon;
  return (
    <div className={cn("rounded-xl border p-4", c.border, c.bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", c.text)} />
        <div>
          <h4 className="text-sm font-semibold mb-0.5">{callout.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{callout.text}</p>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ row, index }: { row: BudgetComparisonRow; index: number }) {
  const isPositive = row.change.startsWith("+");
  return (
    <tr className={cn("border-b border-border/20 text-sm transition-colors hover:bg-muted/40", index % 2 === 0 ? "bg-background" : "bg-muted/20")}>
      <td className="px-5 py-3 font-medium">{row.label}</td>
      <td className="px-5 py-3 tabular-nums text-muted-foreground">{row.fy2025}</td>
      <td className="px-5 py-3 tabular-nums">{row.fy2026}</td>
      <td className={cn("px-5 py-3 tabular-nums font-medium", isPositive ? "text-success" : "text-destructive")}>
        {row.change}
      </td>
    </tr>
  );
}

function BudgetTimelineCard({ phases }: { phases: BudgetTimelinePhase[] }) {
  const currentIndex = phases.findIndex((p) => p.is_current);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Landmark className="size-4 text-primary" />
          Budget Cycle Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {phases.map((phase, i) => {
            const isActive = phase.is_current;
            const isPast = currentIndex > -1 && i < currentIndex;
            return (
              <div key={phase.phase} className="flex flex-col items-center min-w-[120px] flex-1">
                <div className={cn(
                  "flex items-center justify-center size-8 rounded-full text-xs font-bold border-2 transition-all",
                  isActive ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30" :
                  isPast ? "border-success/40 bg-success/10 text-success" :
                  "border-border/50 bg-muted/30 text-muted-foreground",
                )}>
                  {isPast ? <CheckCircle2 className="size-4" /> : i + 1}
                </div>
                <div className={cn("h-1 w-full -mt-4 rounded-full", i < phases.length - 1 ? "block" : "invisible",
                  isPast ? "bg-success/40" : "bg-border/30")} />
                <span className={cn("mt-2 text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {phase.label}
                </span>
                <span className="text-micro text-muted-foreground">{phase.period}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
