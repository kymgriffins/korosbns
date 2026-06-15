"use client";

import { TrendingDown, TrendingUp, Minus, Info, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BudgetCallout,
  BudgetChartConfig,
  BudgetComparisonRow,
  BudgetKpi,
  BudgetReportProfile,
} from "@/types/budget-report";
import { formatKesBillions, formatKesTrillions, percentChange } from "@/lib/budget-format";
import { filterRealImageUrls, parseArticleBlocks } from "@/lib/budget-report-data";
import type { ChapterReportData } from "@/types/budget-report";

const SECTOR_COLORS = [
  "hsl(221 83% 53%)",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
  "hsl(142 76% 36%)",
  "hsl(24 95% 53%)",
  "hsl(346 77% 50%)",
  "hsl(47 95% 48%)",
  "hsl(173 80% 40%)",
];

export function BudgetKpiGrid({ kpis }: { kpis: BudgetKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <BudgetKpiCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  );
}

function BudgetKpiCard({ kpi }: { kpi: BudgetKpi }) {
  const display =
    kpi.suffix === "trillion-scale"
      ? formatKesTrillions(kpi.value)
      : formatKesBillions(kpi.value);

  const TrendIcon =
    kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;

  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-sm py-4 gap-3 shadow-sm">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">{display}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {kpi.previous != null && (
            <span className="inline-flex items-center gap-1">
              <TrendIcon className={cn("size-3", kpi.trend === "up" && "text-amber-600", kpi.trend === "down" && "text-emerald-600")} />
              {percentChange(kpi.value, kpi.previous)} vs prior FY
            </span>
          )}
          {kpi.suffix && kpi.suffix !== "trillion-scale" && (
            <Badge variant="secondary" className="text-[10px] font-normal">{kpi.suffix}</Badge>
          )}
        </div>
        {kpi.description && (
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{kpi.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function BudgetCalloutCard({ callout }: { callout: BudgetCallout }) {
  const Icon =
    callout.type === "warning"
      ? AlertTriangle
      : callout.type === "trend"
        ? Sparkles
        : Info;

  const styles = {
    info: "border-sky-500/30 bg-sky-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    trend: "border-violet-500/30 bg-violet-500/5",
  };

  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", styles[callout.type])}>
      <div className="flex gap-3">
        <Icon className="size-5 shrink-0 text-primary mt-0.5" />
        <div>
          <p className="font-semibold text-sm mb-1">{callout.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{callout.text}</p>
        </div>
      </div>
    </div>
  );
}

export function BudgetComparisonTable({ rows }: { rows: BudgetComparisonRow[] }) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold">Item</TableHead>
            <TableHead className="text-right font-semibold">FY2025/26</TableHead>
            <TableHead className="text-right font-semibold">FY2026/27</TableHead>
            <TableHead className="text-right font-semibold">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label} className={row.highlight ? "bg-primary/5" : undefined}>
              <TableCell className="font-medium whitespace-nowrap">{row.label}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">{row.fy2025}</TableCell>
              <TableCell className="text-right tabular-nums font-medium">{row.fy2026}</TableCell>
              <TableCell className="text-right tabular-nums">
                <span className={row.change.startsWith("+") && row.highlight ? "text-amber-700 dark:text-amber-400" : ""}>
                  {row.change}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function BudgetBarChart({ config }: { config: BudgetChartConfig }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] },
    ]),
  );

  return (
    <Card className="border-border/60 py-4 gap-2">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-base">{config.title}</CardTitle>
        {config.subtitle && (
          <p className="text-xs text-muted-foreground">{config.subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="h-[220px] sm:h-[280px] w-full aspect-auto">
          <BarChart data={config.data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 10 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {config.data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill ?? SECTOR_COLORS[index % SECTOR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BudgetPieChart({ config }: { config: BudgetChartConfig }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] },
    ]),
  );

  return (
    <Card className="border-border/60 py-4 gap-2">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-base">{config.title}</CardTitle>
        {config.subtitle && (
          <p className="text-xs text-muted-foreground">{config.subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-[220px] sm:h-[260px] w-full aspect-auto">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={config.data}
              dataKey="value"
              nameKey="name"
              innerRadius="45%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {config.data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill ?? SECTOR_COLORS[index % SECTOR_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {config.data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ background: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">{d.name}</span>
              <span className="ml-auto tabular-nums font-medium">{d.value}B</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetReportHero({
  title,
  description,
  report,
}: {
  title: string;
  description: string;
  report: BudgetReportProfile;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-background to-violet-500/5 p-6 sm:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-primary/90">FY{report.fiscal_year} Report</Badge>
          {report.approved_date && (
            <span className="text-xs text-muted-foreground">
              Approved {new Date(report.approved_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 max-w-3xl">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-4">
          {description}
        </p>
        {report.theme && (
          <p className="text-xs sm:text-sm italic text-muted-foreground/80 border-l-2 border-primary/40 pl-3 max-w-2xl">
            &ldquo;{report.theme}&rdquo;
          </p>
        )}
        {report.presented_by && (
          <p className="mt-4 text-xs text-muted-foreground">
            Presented by {report.presented_by}
            {report.source && <> · Source: {report.source}</>}
          </p>
        )}
      </div>
    </section>
  );
}

function chartFromPoints(
  data: BudgetReportProfile["sector_chart"],
  title: string,
  subtitle?: string,
): BudgetChartConfig | null {
  if (!data?.length) return null;
  return { type: "bar", title, subtitle, data };
}

export function BudgetModuleReportOverview({ report }: { report: BudgetReportProfile }) {
  const sectorChart = chartFromPoints(
    report.sector_chart,
    "Sector Allocations (KES Billions)",
    `FY${report.fiscal_year}`,
  );
  const revenueChart = report.revenue_chart?.length
    ? { type: "pie" as const, title: "Revenue Composition", subtitle: `FY${report.fiscal_year}`, data: report.revenue_chart }
    : null;
  const expenditureChart = report.expenditure_chart?.length
    ? { type: "pie" as const, title: "Expenditure Split", subtitle: `FY${report.fiscal_year}`, data: report.expenditure_chart }
    : null;

  return (
    <div className="space-y-6 mb-10">
      {report.executive_summary && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {report.executive_summary}
        </p>
      )}
      {report.kpis?.length ? <BudgetKpiGrid kpis={report.kpis} /> : null}
      {(sectorChart || revenueChart || expenditureChart) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sectorChart && <BudgetBarChart config={sectorChart} />}
          {revenueChart && <BudgetPieChart config={revenueChart} />}
          {expenditureChart && <BudgetPieChart config={expenditureChart} />}
        </div>
      )}
      {report.comparison_rows?.length ? (
        <BudgetComparisonTable rows={report.comparison_rows} />
      ) : null}
      {report.highlights?.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {report.highlights.map((callout) => (
            <BudgetCalloutCard key={callout.title} callout={callout} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function BudgetChapterReportBlocks({ report }: { report: ChapterReportData }) {
  const chart = report.chart;

  return (
    <div className="space-y-6 mb-8">
      {report.kpis?.length ? <BudgetKpiGrid kpis={report.kpis} /> : null}
      {chart?.data?.length ? (
        chart.type === "pie" ? (
          <BudgetPieChart config={chart} />
        ) : (
          <BudgetBarChart config={chart} />
        )
      ) : null}
      {report.comparison_rows?.length ? (
        <BudgetComparisonTable rows={report.comparison_rows} />
      ) : null}
      {report.callouts?.length ? (
        <div className="grid gap-3">
          {report.callouts.map((callout) => (
            <BudgetCalloutCard key={callout.title} callout={callout} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function BudgetArticleBody({ text, imageUrls }: { text: string; imageUrls?: string[] }) {
  const blocks = parseArticleBlocks(text);
  const realImages = filterRealImageUrls(imageUrls);

  return (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2 key={i} id={block.content.toLowerCase().replace(/\s+/g, "-")} className="text-lg font-bold mt-8 mb-3 scroll-mt-24">
              {block.content}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 mb-4 text-muted-foreground not-prose">
              {block.items.map((item, j) => (
                <li key={j} className="text-sm leading-relaxed">{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={i} className="my-6 not-prose">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                alt={block.alt}
                className="w-full rounded-xl border border-border/60 object-cover max-h-[400px]"
              />
              {block.alt && block.alt !== "Chart" && (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">{block.alt}</figcaption>
              )}
            </figure>
          );
        }
        return (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{block.content}</p>
        );
      })}
      {realImages.map((url, i) => (
        <figure key={`img-${i}`} className="my-6 not-prose">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="w-full rounded-xl border border-border/60 object-cover max-h-[400px]" />
        </figure>
      ))}
    </div>
  );
}

export function BudgetReportToc({
  chapters,
  slug,
  activeSlug,
}: {
  chapters: Array<{ title: string; article_slug?: string | null; order: number }>;
  slug: string;
  activeSlug?: string;
}) {
  return (
    <nav className="sticky top-20 space-y-1" aria-label="Report sections">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
        Sections
      </p>
      {chapters.map((ch) => {
        if (!ch.article_slug) return null;
        const href = `/budgetnews/${slug}/${ch.article_slug}`;
        const isActive = ch.article_slug === activeSlug;
        return (
          <a
            key={ch.article_slug}
            href={href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <span className="text-[10px] text-muted-foreground mr-2">{ch.order}.</span>
            {ch.title}
          </a>
        );
      })}
    </nav>
  );
}
