"use client";

import React from "react";
import { Pie as RePie, PieChart as RePieChart, Label as ReLabel, Cell as ReCell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/ui/chart";
import {
  BudgetBarChart,
  BudgetComparisonTable,
  BudgetCalloutCard,
} from "@/components/budget-news/report-blocks";
import { shareOfTotal, formatKesBillions } from "@/lib/budget-format";
import type { ChapterReportData } from "@/types/budget-report";

const INLINE_COLORS = [
  "hsl(221 83% 53%)",
  "hsl(262 83% 58%)",
  "hsl(142 76% 36%)",
  "hsl(24 95% 53%)",
  "hsl(346 77% 50%)",
  "hsl(173 80% 40%)",
];

export function BudgetInlineSnapshot({ report }: { report: ChapterReportData }) {
  if (!report.kpis?.length) return null;
  return (
    <div className="rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 to-transparent p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        Sector at a glance
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {report.kpis.map((kpi) => (
          <div key={kpi.key} className="text-xs">
            <span className="text-muted-foreground">{kpi.label}: </span>
            <span className="font-semibold tabular-nums">
              {kpi.suffix === "trillion-scale"
                ? `KES ${(kpi.value / 1000).toFixed(2)}T`
                : `KES ${kpi.value.toFixed(1)}B`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetInlineDeepDive({ report }: { report: ChapterReportData }) {
  const hasData = report.chart?.data?.length || report.comparison_rows?.length || report.callouts?.length;
  if (!hasData) return null;
  return (
    <div className="space-y-5 pt-2 border-t border-border/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        Data deep dive
      </p>
      {report.chart?.data?.length ? (
        report.chart.type === "pie" ? (
          <BudgetPieChartInline config={report.chart} />
        ) : (
          <BudgetBarChart config={report.chart} />
        )
      ) : null}
      {report.comparison_rows?.length ? (
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Year-over-Year</h5>
          <BudgetComparisonTable rows={report.comparison_rows} />
        </div>
      ) : null}
      {report.callouts?.length ? (
        <div className="grid gap-3">
          {report.callouts.map((callout, i) => (
            <BudgetCalloutCard key={callout.title} callout={callout} index={i} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function BudgetPieChartInline({ config }: { config: { title: string; data: Array<{ name: string; value: number; fill?: string }>; valueLabel?: string } }) {
  const localChartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? INLINE_COLORS[i % INLINE_COLORS.length] },
    ]),
  );
  const total = config.data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-xl border border-border/60 py-4">
      <div className="px-4 pb-2">
        <h4 className="text-sm font-semibold">{config.title}</h4>
      </div>
      <ChartContainer config={localChartConfig} className="h-[200px] sm:h-[240px] w-full aspect-auto">
        <RePieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value: any, name: any) => [
                  `${formatKesBillions(Number(value), { prefix: false })} (${shareOfTotal(Number(value), total)})`,
                  String(name),
                ]}
              />
            }
          />
          <RePie
            data={config.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="80%"
            paddingAngle={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {config.data.map((entry, index) => (
              <ReCell
                key={entry.name}
                fill={entry.fill ?? INLINE_COLORS[index % INLINE_COLORS.length]}
                stroke="transparent"
              />
            ))}
            <ReLabel content={<PieCenterLabelInline total={total} label="Total" />} position="center" />
          </RePie>
        </RePieChart>
      </ChartContainer>
      <div className="mt-2 px-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {config.data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="size-2 rounded-full shrink-0" style={{ background: d.fill ?? INLINE_COLORS[i % INLINE_COLORS.length] }} />
            <span className="truncate text-muted-foreground flex-1">{d.name}</span>
            <span className="tabular-nums font-medium">{d.value.toFixed(1)}B</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieCenterLabelInline({ total, label }: { total: number; label: string }) {
  return (
    <text textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
      <tspan x={0} dy={-6} className="fill-muted-foreground text-[10px]">{label}</tspan>
      <tspan x={0} dy={18} className="font-bold text-sm tabular-nums">
        {total.toFixed(1)}B
      </tspan>
    </text>
  );
}
