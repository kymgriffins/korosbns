"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Loader2,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Tablet,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  adminAnalyticsApi,
  type AdminAnalyticsSummary,
  type ModuleAnalytics,
} from "@/lib/admin-api";

type Period = "today" | "7d" | "30d" | "all";

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "all", label: "All Time" },
];

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const areaConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  pageviews: { label: "Pageviews", color: "var(--chart-2)" },
  tasks: { label: "Tasks created", color: "var(--chart-1)" },
  users: { label: "New users", color: "var(--chart-2)" },
  completions: { label: "Completions", color: "var(--chart-1)" },
} satisfies ChartConfig;

const barConfig = {
  completions: { label: "Completions", color: "var(--chart-3)" },
} satisfies ChartConfig;

function kpiValue(summary: AdminAnalyticsSummary | null, key: keyof AdminAnalyticsSummary): number {
  const v = summary?.[key];
  return typeof v === "number" ? v : 0;
}

function periodValue(
  s: AdminAnalyticsSummary | null,
  today: keyof AdminAnalyticsSummary,
  _7d: keyof AdminAnalyticsSummary,
  _30d: keyof AdminAnalyticsSummary,
  all: keyof AdminAnalyticsSummary,
  period: Period,
): number {
  const map: Record<Period, keyof AdminAnalyticsSummary> = { today, "7d": _7d, "30d": _30d, all };
  return kpiValue(s, map[period]);
}

function EmptySeries({ label = "No series yet" }: { label?: string }) {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">{label}</div>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [moduleAnalytics, setModuleAnalytics] = useState<ModuleAnalytics | null>(null);
  const [period, setPeriod] = useState<Period>("30d");

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    setFetchError(null);
    try {
      const [summaryRes, moduleRes] = await Promise.allSettled([
        adminAnalyticsApi.summary(p),
        adminAnalyticsApi.moduleAnalytics({ period: "weekly" }),
      ]);

      if (summaryRes.status === "fulfilled") {
        setSummary(summaryRes.value);
      } else {
        setSummary(null);
        setFetchError("Failed to load analytics summary from the API.");
      }

      if (moduleRes.status === "fulfilled") {
        setModuleAnalytics(moduleRes.value);
      } else {
        setModuleAnalytics(null);
      }
    } catch {
      setSummary(null);
      setModuleAnalytics(null);
      setFetchError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(period);
  }, [period, fetchData]);

  const visitorTotal = periodValue(summary, "visitors_today", "visitors_7d", "visitors_30d", "total_users", period);
  const pageviewTotal = periodValue(summary, "pageviews_today", "pageviews_7d", "pageviews_30d", "total_content", period);
  const newUsers = periodValue(summary, "users_new_today", "users_new_7d", "users_new_30d", "total_users", period);
  const contentPublished = periodValue(
    summary,
    "content_published_today",
    "content_published_7d",
    "content_published_30d",
    "total_content",
    period,
  );

  const kpiItems = [
    { label: "Visitors", value: visitorTotal, icon: Eye, color: "text-primary", sub: `Last ${period === "today" ? "day" : period}` },
    { label: "Page views", value: pageviewTotal, icon: MousePointerClick, color: "text-purple-500", sub: period === "all" ? "total" : `Last ${period}` },
    { label: "New users", value: newUsers, icon: UserPlus, color: "text-emerald-500", sub: `${summary?.users_growth_pct ?? 0}% growth` },
    {
      label: "Active users",
      value: periodValue(summary, "users_active_7d", "users_active_7d", "users_active_30d", "total_users", period),
      icon: Activity,
      color: "text-amber-500",
      sub: period === "today" ? "7d proxy" : period,
    },
    { label: "Bounce rate", value: `${summary?.bounce_rate ?? 0}%`, icon: TrendingDown, color: "text-rose-500", sub: "avg" },
    {
      label: "Avg session",
      value: summary?.avg_session_seconds
        ? `${Math.round(summary.avg_session_seconds / 60)}m ${summary.avg_session_seconds % 60}s`
        : "—",
      icon: Clock,
      color: "text-cyan-500",
      sub: "per visit",
    },
    { label: "Content published", value: contentPublished, icon: FileText, color: "text-indigo-500", sub: `+${summary?.content_drafts ?? 0} drafts` },
    { label: "Engagement rate", value: `${summary?.engagement_rate ?? 0}%`, icon: TrendingUp, color: "text-emerald-500", sub: period === "all" ? "overall" : "notes publish rate" },
  ];

  const deviceData = useMemo(
    () => summary?.device_breakdown ?? summary?.vercel_traffic?.devices ?? [],
    [summary],
  );
  const sourceData = useMemo(
    () => summary?.traffic_sources ?? summary?.vercel_traffic?.traffic_sources ?? [],
    [summary],
  );
  const dailyData = useMemo(() => {
    const raw = summary?.daily_visitors ?? summary?.vercel_traffic?.daily_visitors ?? [];
    return raw.map((d) => ({
      date: d.date,
      count: d.count ?? d.visitors ?? 0,
      pageviews: d.pageviews ?? 0,
    }));
  }, [summary]);
  const topPages = useMemo(
    () => summary?.top_pages ?? summary?.vercel_traffic?.top_pages ?? [],
    [summary],
  );
  const monthlyTrends = useMemo(() => summary?.monthly_trends ?? [], [summary]);
  const completionSeries = useMemo(() => {
    const rows = moduleAnalytics?.completions_over_time ?? [];
    return [...rows]
      .reverse()
      .map((r) => ({
        period: r.period ? r.period.slice(0, 10) : "—",
        completions: r.count,
      }));
  }, [moduleAnalytics]);
  const topModules = useMemo(() => moduleAnalytics?.top_modules ?? [], [moduleAnalytics]);

  const contentPieData = useMemo(
    () =>
      [
        { name: "Modules", value: summary?.total_modules ?? 0 },
        { name: "Articles", value: summary?.total_articles ?? 0 },
        { name: "Videos", value: summary?.total_videos ?? 0 },
        { name: "Stories", value: summary?.total_stories ?? 0 },
        { name: "Documents", value: summary?.total_documents ?? 0 },
      ].filter((d) => d.value > 0),
    [summary],
  );

  const deviceIcons: Record<string, typeof Smartphone> = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
  };

  const hasAnySeries =
    dailyData.length > 0 || monthlyTrends.length > 0 || completionSeries.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Users, traffic, and content performance
            {summary?.traffic_source === "vercel" && summary.traffic_synced_at
              ? ` · Vercel synced ${new Date(summary.traffic_synced_at).toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-muted/30 p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-all",
                  period === p.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetchData(period)} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {fetchError ? (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertTitle>Analytics unavailable</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{fetchError}</span>
            <Button variant="outline" size="sm" onClick={() => void fetchData(period)}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {loading && !summary ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-3 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-10" />
                <Skeleton className="mt-1 h-3 w-14" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {kpiItems.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium">{kpi.label}</CardTitle>
                <kpi.icon className={cn("size-3.5", kpi.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold tabular-nums">{String(kpi.value)}</div>
                <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && summary && !hasAnySeries ? (
        <p className="text-sm text-muted-foreground">
          KPI totals loaded. Chart series are empty until traffic snapshots or module completions exist.
        </p>
      ) : null}

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Daily visitors</CardTitle>
                <CardDescription>From analytics summary traffic series</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyData.length === 0 ? (
                  <EmptySeries />
                ) : (
                  <ChartContainer config={areaConfig} className="aspect-auto h-48 w-full">
                    <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeOpacity={0.5} />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v: string) => v.slice(5)}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area
                        dataKey="count"
                        type="natural"
                        fill="url(#dailyFill)"
                        stroke="var(--color-visitors)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Traffic sources</CardTitle>
                <CardDescription>Where visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                {sourceData.length === 0 ? (
                  <EmptySeries />
                ) : (
                  <div className="space-y-3">
                    {sourceData.map((s, i) => (
                      <div key={s.source} className="flex items-center gap-3">
                        <Globe className="size-4 shrink-0 text-muted-foreground" />
                        <span className="w-28 text-xs text-muted-foreground">{s.source}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${s.percentage ?? 0}%`,
                              backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-medium tabular-nums">{s.count}</span>
                        <span className="w-8 text-right text-[10px] text-muted-foreground">
                          {s.percentage ?? 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Devices</CardTitle>
                <CardDescription>By device type</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceData.length === 0 ? (
                  <EmptySeries />
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {deviceData.map((d) => {
                      const Icon = deviceIcons[d.device_type] ?? Smartphone;
                      return (
                        <div
                          key={d.device_type}
                          className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center"
                        >
                          <Icon className="size-6 text-muted-foreground" />
                          <span className="text-2xl font-bold tabular-nums">{d.percentage}%</span>
                          <span className="text-[10px] text-muted-foreground">{d.device_type}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top pages</CardTitle>
                <CardDescription>Most visited routes</CardDescription>
              </CardHeader>
              <CardContent>
                {topPages.length === 0 ? (
                  <EmptySeries />
                ) : (
                  <div className="space-y-1">
                    {topPages.slice(0, 6).map((p) => (
                      <div
                        key={p.path}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                          <span className="truncate">{p.path}</span>
                        </span>
                        <span className="ml-2 shrink-0 text-xs font-medium tabular-nums">
                          {(p.pageviews ?? p.views ?? 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly trends</CardTitle>
              <CardDescription>Tasks created and new users from analytics summary</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyTrends.length === 0 ? (
                <EmptySeries label="No monthly series yet" />
              ) : (
                <ChartContainer config={areaConfig} className="aspect-auto h-72 w-full">
                  <AreaChart data={monthlyTrends} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeOpacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-44" indicator="line" />} />
                    <Area
                      dataKey="tasks_created"
                      name="tasks"
                      type="natural"
                      fill="var(--color-tasks)"
                      fillOpacity={0.15}
                      stroke="var(--color-tasks)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      dataKey="new_users"
                      name="users"
                      type="natural"
                      fill="var(--color-users)"
                      fillOpacity={0.1}
                      stroke="var(--color-users)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module completions</CardTitle>
              <CardDescription>
                From module analytics API
                {moduleAnalytics
                  ? ` · ${moduleAnalytics.total_modules_published} published modules`
                  : " · unavailable"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completionSeries.length === 0 ? (
                <EmptySeries label="No completion series yet" />
              ) : (
                <ChartContainer config={areaConfig} className="aspect-auto h-56 w-full">
                  <AreaChart data={completionSeries} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeOpacity={0.5} />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area
                      dataKey="completions"
                      type="natural"
                      fill="var(--color-completions)"
                      fillOpacity={0.15}
                      stroke="var(--color-completions)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tasks created (window)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {monthlyTrends.reduce((s, d) => s + d.tasks_created, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Sum of monthly_trends series</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New users (window)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {monthlyTrends.reduce((s, d) => s + d.new_users, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Sum of monthly_trends series</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Engagement rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{summary?.engagement_rate ?? 0}%</div>
                <p className="text-xs text-muted-foreground">Published notes / total notes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{visitorTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {period === "today" ? "Today" : `Last ${period}`}
                  {summary?.bounce_rate ? ` · ${summary.bounce_rate}% bounce` : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Page views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{pageviewTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {period === "today" ? "Today" : `Last ${period}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Unique (period)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {(summary?.unique_visitors ?? visitorTotal).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Source: {summary?.traffic_source ?? "unknown"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Daily visitors trend</CardTitle>
              <CardDescription>Real traffic series only — no synthetic data</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <EmptySeries />
              ) : (
                <ChartContainer config={areaConfig} className="aspect-auto h-64 w-full">
                  <AreaChart data={dailyData}>
                    <CartesianGrid vertical={false} strokeOpacity={0.5} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area
                      dataKey="count"
                      type="natural"
                      fill="var(--color-visitors)"
                      fillOpacity={0.15}
                      stroke="var(--color-visitors)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Content composition</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent>
                {contentPieData.length === 0 ? (
                  <EmptySeries label="No content counts yet" />
                ) : (
                  <ChartContainer config={areaConfig} className="mx-auto aspect-square h-56">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent className="w-32" />} />
                      <Pie
                        data={contentPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        strokeWidth={2}
                        paddingAngle={2}
                      >
                        {contentPieData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top modules by completions</CardTitle>
                <CardDescription>From module analytics</CardDescription>
              </CardHeader>
              <CardContent>
                {topModules.length === 0 ? (
                  <EmptySeries label="No module completion series yet" />
                ) : (
                  <ChartContainer config={barConfig} className="aspect-auto h-56 w-full">
                    <BarChart
                      data={topModules.map((m) => ({
                        name: m.title.length > 20 ? `${m.title.slice(0, 20)}…` : m.title,
                        completions: m.completions,
                      }))}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid horizontal={false} strokeOpacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 11 }}
                        width={140}
                      />
                      <ChartTooltip content={<ChartTooltipContent className="w-40" />} />
                      <Bar dataKey="completions" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Users", value: summary?.total_users ?? 0 },
              { label: "Modules", value: summary?.total_modules ?? 0 },
              { label: "Articles", value: summary?.total_articles ?? 0 },
              { label: "Forum threads", value: summary?.active_forum_threads ?? 0 },
              { label: "Notes", value: summary?.total_notes ?? 0 },
              { label: "Videos", value: summary?.total_videos ?? 0 },
              { label: "Stories", value: summary?.total_stories ?? 0 },
              { label: "Documents", value: summary?.total_documents ?? 0 },
            ].map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums">{item.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
