"use client";

import { TrendingDown, TrendingUp, Minus, Info, AlertTriangle, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  LabelList,
  Label,
} from "recharts";
import type {
  BudgetCallout,
  BudgetChartConfig,
  BudgetComparisonRow,
  BudgetKpi,
  BudgetReportProfile,
} from "@/types/budget-report";
import { formatKesBillions, formatKesTrillions, percentChange, shareOfTotal } from "@/lib/budget-format";
import { filterRealImageUrls, parseArticleBlocks } from "@/lib/budget-report-data";
import { isEditorJsBody } from "@/lib/editorjs";
import { renderArticleBody } from "@/lib/render-content";
import type { ChapterReportData } from "@/types/budget-report";
import { budgetNewsChapterPath } from "@/constants/routes";
import { HarmonizedImage } from "@/components/ui/harmonized-image";

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



// ── KPI Grid ──

export function BudgetKpiGrid({ kpis }: { kpis: BudgetKpi[] }) {
  const maxValue = Math.max(...kpis.map((k) => k.value), 1);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <BudgetKpiCard key={kpi.key} kpi={kpi} scale={kpi.value / maxValue} />
      ))}
    </div>
  );
}

function BudgetKpiCard({ kpi, scale }: { kpi: BudgetKpi; scale: number }) {
  const display =
    kpi.suffix === "trillion-scale"
      ? formatKesTrillions(kpi.value)
      : formatKesBillions(kpi.value);

  const isUp = kpi.trend === "up";
  const isDown = kpi.trend === "down";
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-sm py-4 gap-3 shadow-sm group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 space-y-2.5">
        <p className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">{display}</p>
        <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(scale * 100, 8)}%`,
              backgroundColor: isUp ? "hsl(142 76% 36%)" : isDown ? "hsl(24 95% 53%)" : "hsl(221 83% 53%)",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {kpi.previous != null && (
            <span className="inline-flex items-center gap-1">
              <TrendIcon className={cn("size-3.5", isUp && "text-emerald-600", isDown && "text-amber-600")} />
              <span className={cn("font-semibold", isUp && "text-emerald-600", isDown && "text-amber-600")}>
                {percentChange(kpi.value, kpi.previous)}
              </span>
            </span>
          )}
          {kpi.suffix && kpi.suffix !== "trillion-scale" && (
            <Badge variant="secondary" className="text-[10px] font-normal">{kpi.suffix}</Badge>
          )}
        </div>
        {kpi.description && (
          <p className="text-[11px] leading-relaxed text-muted-foreground">{kpi.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Callout Card ──

export function BudgetCalloutCard({ callout, index = 0 }: { callout: BudgetCallout; index?: number }) {
  const Icon =
    callout.type === "warning"
      ? AlertTriangle
      : callout.type === "trend"
        ? Sparkles
        : Info;

  const iconColors = {
    info: "text-sky-600 dark:text-sky-400",
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-emerald-600 dark:text-emerald-400",
    trend: "text-violet-600 dark:text-violet-400",
  };

  const styles = {
    info: "border-sky-500/30 bg-sky-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    trend: "border-violet-500/30 bg-violet-500/5",
  };

  return (
    <div
      className={cn("rounded-xl border p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-2 duration-500", styles[callout.type])}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-3">
        <Icon className={cn("size-5 shrink-0 mt-0.5", iconColors[callout.type])} />
        <div>
          <p className="font-semibold text-sm mb-1">{callout.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{callout.text}</p>
        </div>
      </div>
    </div>
  );
}

// ── Comparison Table ──

export function BudgetComparisonTable({ rows }: { rows: BudgetComparisonRow[] }) {
  const maxChange = Math.max(...rows.map((r) => {
    const m = r.change.match(/[+-]?\d+(\.\d+)?/);
    return m ? Math.abs(parseFloat(m[0])) : 0;
  }), 1);

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="text-right font-semibold whitespace-nowrap">FY2025/26</TableHead>
              <TableHead className="text-right font-semibold whitespace-nowrap">FY2026/27</TableHead>
              <TableHead className="text-right font-semibold whitespace-nowrap">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const changeMatch = row.change.match(/[+-]?\d+(\.\d+)?/);
              const changeVal = changeMatch ? parseFloat(changeMatch[0]) : 0;
              const isPositive = changeVal > 0;
              const barWidth = Math.min(Math.abs(changeVal) / maxChange * 100, 100);
              return (
                <TableRow
                  key={row.label}
                  className={cn(
                    row.highlight ? "bg-primary/5" : undefined,
                    "transition-colors"
                  )}
                >
                  <TableCell className="font-medium whitespace-nowrap">{row.label}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{row.fy2025}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{row.fy2026}</TableCell>
                  <TableCell className="text-right tabular-nums min-w-[140px]">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:block w-16 h-2 bg-muted-foreground/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700 ease-out",
                            isPositive ? "bg-emerald-500/60" : "bg-amber-500/60"
                          )}
                          style={{ width: `${barWidth}%`, marginLeft: isPositive ? 0 : "auto" }}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-semibold whitespace-nowrap",
                          row.change.startsWith("+") && row.highlight && "text-amber-700 dark:text-amber-400",
                          isPositive && !row.highlight && "text-emerald-700 dark:text-emerald-400",
                          !isPositive && changeVal !== 0 && "text-amber-700 dark:text-amber-400"
                        )}
                      >
                        {isPositive ? <ArrowUpRight className="size-3 inline -mt-0.5" /> : changeVal !== 0 ? <ArrowDownRight className="size-3 inline -mt-0.5" /> : null}
                        {row.change}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Bar Chart ──

export function BudgetBarChart({ config }: { config: BudgetChartConfig }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] },
    ]),
  );

  const total = config.data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="border-border/60 py-4 gap-2 group/chart">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{config.title}</CardTitle>
            {config.subtitle && (
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            )}
          </div>
          {config.valueLabel && (
            <Badge variant="outline" className="text-[10px] font-normal">{config.valueLabel}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="h-[220px] sm:h-[280px] w-full aspect-auto">
          <BarChart data={config.data} margin={{ left: 0, right: 8, top: 20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.4} />
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
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted-foreground) / 0.08)" }}
              content={
                <ChartTooltipContent
                  formatter={(value: any) => `${formatKesBillions(Number(value), { prefix: false })}`}
                />
              }
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
              animationBegin={0}
            >
              {config.data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill ?? SECTOR_COLORS[index % SECTOR_COLORS.length]}
                  className="transition-opacity duration-200 group-hover/chart:opacity-80 hover:!opacity-100"
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fontSize={10}
                formatter={(v: any) => `${Number(v).toFixed(1)}`}
                fill="hsl(var(--muted-foreground))"
                className="tabular-nums"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Pie Chart ──

function PieCenterLabel({ total, label }: { total: number; label: string }) {
  return (
    <text textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
      <tspan x={0} dy={-6} className="fill-muted-foreground text-[10px]">{label}</tspan>
      <tspan x={0} dy={18} className="font-bold text-sm tabular-nums">
        {total.toFixed(1)}B
      </tspan>
    </text>
  );
}

export function BudgetPieChart({ config }: { config: BudgetChartConfig }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    config.data.map((d, i) => [
      d.name,
      { label: d.name, color: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] },
    ]),
  );

  const total = config.data.reduce((s, d) => s + d.value, 0);

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
            <Pie
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
                <Cell
                  key={entry.name}
                  fill={entry.fill ?? SECTOR_COLORS[index % SECTOR_COLORS.length]}
                  className="transition-opacity duration-200 hover:opacity-80"
                  stroke="transparent"
                />
              ))}
              <Label content={<PieCenterLabel total={total} label="Total" />} position="center" />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {config.data.map((d, i) => {
            const pct = shareOfTotal(d.value, total);
            return (
              <div key={d.name} className="flex items-center gap-2 group">
                <span
                  className="size-2.5 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                  style={{ background: d.fill ?? SECTOR_COLORS[i % SECTOR_COLORS.length] }}
                />
                <span className="truncate text-muted-foreground flex-1">{d.name}</span>
                <span className="tabular-nums font-medium text-foreground">{d.value.toFixed(1)}B</span>
                <span className="tabular-nums text-muted-foreground/60 w-10 text-right">{pct}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetReportHero({
  title,
  description,
  report,
  imageUrl,
}: {
  title: string;
  description: string;
  report: BudgetReportProfile;
  imageUrl?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-background to-violet-500/5 p-6 sm:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      {imageUrl && (
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <HarmonizedImage src={imageUrl} alt="" className="h-full w-full rounded-none border-0" fallbackLabel="" />
        </div>
      )}
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-primary/90 text-primary-foreground">FY{report.fiscal_year} Report</Badge>
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
    <div className="space-y-8 mb-10">
      {report.executive_summary && (
        <div className="rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 p-4 sm:p-6">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {report.executive_summary}
          </p>
        </div>
      )}
      {report.kpis?.length ? (
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Indicators</h4>
          <BudgetKpiGrid kpis={report.kpis} />
        </section>
      ) : null}
      {(sectorChart || revenueChart || expenditureChart) && (
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Charts</h4>
          <div className="grid gap-4 lg:grid-cols-2">
            {sectorChart && <BudgetBarChart config={sectorChart} />}
            {revenueChart && <BudgetPieChart config={revenueChart} />}
            {expenditureChart && <BudgetPieChart config={expenditureChart} />}
          </div>
        </section>
      )}
      {report.comparison_rows?.length ? (
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Year-over-Year Comparison</h4>
          <BudgetComparisonTable rows={report.comparison_rows} />
        </section>
      ) : null}
      {report.highlights?.length ? (
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Takeaways</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.highlights.map((callout, i) => (
              <BudgetCalloutCard key={callout.title} callout={callout} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function BudgetChapterReportBlocks({ report }: { report: ChapterReportData }) {
  const chart = report.chart;

  return (
    <div className="space-y-6 mb-6">
      {report.kpis?.length ? (
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sector KPIs</h5>
          <BudgetKpiGrid kpis={report.kpis} />
        </div>
      ) : null}
      {chart?.data?.length ? (
        chart.type === "pie" ? (
          <BudgetPieChart config={chart} />
        ) : (
          <BudgetBarChart config={chart} />
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

const HAS_HTML = /<[a-z][\s\S]*>/i;

export function BudgetArticleBody({ text, imageUrls }: { text: string; imageUrls?: string[] }) {
  const realImages = filterRealImageUrls(imageUrls);
  const trimmed = text?.trim() ?? "";

  if (trimmed && (isEditorJsBody(trimmed) || HAS_HTML.test(trimmed))) {
    return (
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        {renderArticleBody(trimmed, null)}
        {realImages.map((url, i) => (
          <figure key={`img-${i}`} className="my-6 not-prose">
            <HarmonizedImage src={url} alt="" aspectClassName="aspect-[16/10]" className="w-full rounded-xl" fallbackLabel="Inline image" />
          </figure>
        ))}
      </div>
    );
  }

  const blocks = parseArticleBlocks(text);

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
              <HarmonizedImage
                src={block.src}
                alt={block.alt}
                aspectClassName="aspect-[16/10]"
                className="w-full rounded-xl"
                fallbackLabel="Inline image"
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
          <HarmonizedImage src={url} alt="" aspectClassName="aspect-[16/10]" className="w-full rounded-xl" fallbackLabel="Inline image" />
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
        const href = budgetNewsChapterPath(slug, ch.article_slug);
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
