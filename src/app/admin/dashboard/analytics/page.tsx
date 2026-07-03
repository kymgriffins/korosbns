"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FileText, Eye, MousePointerClick, TrendingUp, TrendingDown,
  Loader2, RefreshCw, Clock, UserPlus, Activity, Smartphone, Monitor,
  Tablet, Globe, ExternalLink, Search,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, XAxis, YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { InlineError } from "@/components/ui/inline-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils";
import { analyticsData } from "@/data/analytics";
import type { AdminAnalyticsSummary } from "@/lib/admin-api";

type Period = "today" | "7d" | "30d" | "all";

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "all", label: "All Time" },
];

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function kpiValue(summary: AdminAnalyticsSummary | null, key: keyof AdminAnalyticsSummary, period: Period): number {
  const v = summary?.[key];
  if (typeof v === "number") return v;
  return 0;
}

function periodValue(s: AdminAnalyticsSummary | null, today: keyof AdminAnalyticsSummary, _7d: keyof AdminAnalyticsSummary, _30d: keyof AdminAnalyticsSummary, all: keyof AdminAnalyticsSummary, period: Period): number {
  const map: Record<Period, keyof AdminAnalyticsSummary> = { today, "7d": _7d, "30d": _30d, all };
  return kpiValue(s, map[period], period);
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [period, setPeriod] = useState<Period>("30d");

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await analyticsData.admin.fetchSummary(p);
      setSummary(res);
    } catch {
      setFetchError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(period); }, [period, fetchData]);

  const visitorTotal = periodValue(summary, "visitors_today", "visitors_7d", "visitors_30d", "total_users", period);
  const pageviewTotal = periodValue(summary, "pageviews_today", "pageviews_7d", "pageviews_30d", "total_content", period);
  const newUsers = periodValue(summary, "users_new_today", "users_new_7d", "users_new_30d", "total_users", period);
  const contentPublished = periodValue(summary, "content_published_today", "content_published_7d", "content_published_30d", "total_content", period);

  const kpiItems = [
    { label: "Visitors", value: visitorTotal, icon: Eye, color: "text-primary", sub: `Last ${period === "today" ? "day" : period}` },
    { label: "Page Views", value: pageviewTotal, icon: MousePointerClick, color: "text-purple-500", sub: period === "all" ? "total" : `Last ${period}` },
    { label: "New Users", value: newUsers, icon: UserPlus, color: "text-emerald-500", sub: `${summary?.users_growth_pct ?? 0}% growth` },
    { label: "Active Users", value: periodValue(summary, "users_active_7d", "users_active_7d", "users_active_30d", "total_users", period), icon: Activity, color: "text-amber-500", sub: `${period === "today" ? "24h" : period}` },
    { label: "Bounce Rate", value: `${summary?.bounce_rate ?? 0}%`, icon: TrendingDown, color: "text-rose-500", sub: "avg" },
    { label: "Avg Session", value: summary?.avg_session_seconds ? `${Math.round(summary.avg_session_seconds / 60)}m ${summary.avg_session_seconds % 60}s` : "--", icon: Clock, color: "text-cyan-500", sub: "per visit" },
    { label: "Content Published", value: contentPublished, icon: FileText, color: "text-indigo-500", sub: `+${summary?.content_drafts ?? 0} drafts` },
    { label: "Engagement Rate", value: `${summary?.engagement_rate ?? 0}%`, icon: TrendingUp, color: "text-emerald-500", sub: period === "all" ? "overall" : "avg" },
  ];

  const deviceData = useMemo(() => (summary?.device_breakdown ?? summary?.vercel_traffic?.devices ?? []), [summary]);
  const sourceData = useMemo(() => (summary?.traffic_sources ?? summary?.vercel_traffic?.traffic_sources ?? []), [summary]);
  const dailyData = useMemo(() => (summary?.daily_visitors ?? summary?.vercel_traffic?.daily_visitors ?? []), [summary]);
  const topPages = useMemo(() => (summary?.top_pages ?? summary?.vercel_traffic?.top_pages ?? []), [summary]);
  const topRoutes = useMemo(() => (summary?.top_routes ?? summary?.vercel_traffic?.top_routes ?? []), [summary]);
  const referrers = useMemo(() => (summary?.referrers ?? summary?.vercel_traffic?.referrers ?? []), [summary]);
  const countries = useMemo(() => (summary?.countries ?? summary?.vercel_traffic?.countries ?? []), [summary]);
  const operatingSystems = useMemo(() => (summary?.operating_systems ?? summary?.vercel_traffic?.operating_systems ?? []), [summary]);
  const browsers = useMemo(() => (summary?.browsers ?? summary?.vercel_traffic?.browsers ?? []), [summary]);

  const deviceIcons: Record<string, typeof Smartphone> = { Mobile: Smartphone, Desktop: Monitor, Tablet: Tablet };

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
          <div className="flex rounded-lg border p-0.5 bg-muted/30">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-all",
                  period === p.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchData(period)} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          </Button>
        </div>
      </div>

      {fetchError && <InlineError message={fetchError} compact />}

      {loading && !summary ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-3 w-16" /></CardHeader><CardContent><Skeleton className="h-7 w-10" /><Skeleton className="mt-1 h-3 w-14" /></CardContent></Card>
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

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Daily Visitors */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Daily Visitors</CardTitle><CardDescription>Last 30 days</CardDescription></CardHeader>
              <CardContent>
                {dailyData.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <ChartContainer config={{ visitors: { label: "Visitors", color: "var(--chart-1)" } }} className="aspect-auto h-48 w-full">
                    <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeOpacity={0.5} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area dataKey="count" type="natural" fill="url(#dailyFill)" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Traffic Sources</CardTitle><CardDescription>Where visitors come from</CardDescription></CardHeader>
              <CardContent>
                {sourceData.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <div className="space-y-3">
                    {sourceData.map((s, i) => (
                      <div key={s.source} className="flex items-center gap-3">
                        <Globe className="size-4 shrink-0 text-muted-foreground" />
                        <span className="w-28 text-xs text-muted-foreground">{s.source}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full transition-all" style={{ width: `${s.percentage}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        </div>
                        <span className="w-10 text-right text-xs font-medium tabular-nums">{s.count}</span>
                        <span className="w-8 text-right text-[10px] text-muted-foreground">{s.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Device Breakdown */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Devices</CardTitle><CardDescription>By device type</CardDescription></CardHeader>
              <CardContent>
                {deviceData.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {deviceData.map((d) => {
                      const Icon = deviceIcons[d.device_type] ?? Smartphone;
                      return (
                        <div key={d.device_type} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
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

            {/* Top Pages */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Top Pages</CardTitle><CardDescription>Most visited routes</CardDescription></CardHeader>
              <CardContent>
                {topPages.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <div className="space-y-1">
                    {topPages.slice(0, 6).map((p) => (
                      <div key={p.path} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted/50 text-sm">
                        <span className="flex items-center gap-2 truncate">
                          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                          <span className="truncate">{p.path}</span>
                        </span>
                        <span className="ml-2 shrink-0 font-medium tabular-nums text-xs">{(p.pageviews ?? p.views ?? 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Traffic ── */}
        <TabsContent value="traffic" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Visitors</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{visitorTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {period === "today" ? "Today" : `Last ${period}`}
                  {summary?.bounce_rate ? ` · ${summary.bounce_rate}% bounce rate` : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Page Views</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{pageviewTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {period === "today" ? "Today" : `Last ${period}`}
                  {summary?.avg_session_seconds ? ` · ${Math.round(summary.avg_session_seconds / 60)}m avg session` : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Engagement</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{summary?.engagement_rate ?? 0}%</div>
                <p className="text-xs text-muted-foreground">Rate · {summary?.bounce_rate ?? 0}% bounce</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Daily Visitors Trend</CardTitle><CardDescription>Last 30 days</CardDescription></CardHeader>
              <CardContent>
                {dailyData.length === 0 ? (
                  <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <ChartContainer config={{ visitors: { label: "Visitors", color: "var(--chart-1)" } }} className="aspect-auto h-56 w-full">
                    <BarChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeOpacity={0.5} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                      <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.3 }} content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-visitors)" radius={[2, 2, 0, 0]} barSize={8} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Traffic Sources</CardTitle><CardDescription>Breakdown by source</CardDescription></CardHeader>
              <CardContent>
                {sourceData.length === 0 ? (
                  <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">No data</div>
                ) : (
                  <ChartContainer config={{ count: { label: "Visits", color: "var(--chart-1)" } }} className="aspect-auto h-56 w-full">
                    <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid horizontal={false} strokeOpacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="source" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={90} />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">Top Pages</CardTitle><CardDescription>Most visited routes this period</CardDescription></CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No data</p>
              ) : (
                <div className="divide-y">
                  {topPages.map((p) => (
                    <div key={p.path} className="flex items-center justify-between py-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Search className="size-3.5 text-muted-foreground" />
                        <span className="font-mono text-xs">{p.path}</span>
                      </div>
                      <span className="tabular-nums font-medium">{(p.pageviews ?? p.views ?? 0).toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Framework Routes</CardTitle><CardDescription>Vercel `route` dimension</CardDescription></CardHeader>
              <CardContent>
                {topRoutes.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No route data</p>
                ) : (
                  <div className="divide-y">
                    {topRoutes.slice(0, 8).map((row) => (
                      <div key={row.route} className="flex items-center justify-between py-2 text-sm">
                        <span className="truncate font-mono text-xs">{row.route}</span>
                        <span className="ml-2 shrink-0 tabular-nums text-xs">{row.pageviews} pv · {row.visitors} uv</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Referrers</CardTitle><CardDescription>Incoming hostnames</CardDescription></CardHeader>
              <CardContent>
                {referrers.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No referrer data</p>
                ) : (
                  <div className="divide-y">
                    {referrers.slice(0, 8).map((row) => (
                      <div key={row.hostname} className="flex items-center justify-between py-2 text-sm">
                        <span className="truncate">{row.label}</span>
                        <span className="ml-2 shrink-0 tabular-nums text-xs">{row.pageviews} pv · {row.percentage ?? 0}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">Countries</CardTitle><CardDescription>Visitor geography</CardDescription></CardHeader>
              <CardContent>
                {countries.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No country data</p>
                ) : (
                  <div className="divide-y">
                    {countries.slice(0, 8).map((row) => (
                      <div key={row.code} className="flex items-center justify-between py-2 text-sm">
                        <span className="font-medium">{row.code}</span>
                        <span className="tabular-nums text-xs">{row.pageviews} pv · {row.visitors} uv</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Operating Systems</CardTitle><CardDescription>OS breakdown</CardDescription></CardHeader>
              <CardContent>
                {operatingSystems.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No OS data</p>
                ) : (
                  <div className="divide-y">
                    {operatingSystems.slice(0, 8).map((row) => (
                      <div key={row.os_name} className="flex items-center justify-between py-2 text-sm">
                        <span>{row.os_name}</span>
                        <span className="tabular-nums text-xs">{row.percentage ?? 0}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Browsers</CardTitle><CardDescription>Browser breakdown</CardDescription></CardHeader>
              <CardContent>
                {browsers.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No browser data</p>
                ) : (
                  <div className="divide-y">
                    {browsers.slice(0, 8).map((row) => (
                      <div key={row.browser_name} className="flex items-center justify-between py-2 text-sm">
                        <span>{row.browser_name}</span>
                        <span className="tabular-nums text-xs">{row.pageviews} pv</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Users ── */}
        <TabsContent value="users" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Users</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.total_users?.toLocaleString() ?? 0}</div>
                <p className="text-xs text-muted-foreground">All time registered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">New Users</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{newUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last {period === "today" ? "24h" : period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Active (7d)</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.users_active_7d?.toLocaleString() ?? 0}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Active (30d)</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.users_active_30d?.toLocaleString() ?? 0}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">User Growth</CardTitle><CardDescription>New user signups over time</CardDescription></CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data</div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <ChartContainer config={{ users: { label: "Users", color: "var(--chart-2)" } }} className="aspect-auto h-48 w-full">
                      <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.5} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area dataKey="count" type="natural" fill="url(#userFill)" stroke="var(--color-users)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Growth</p>
                      <p className="text-lg font-bold text-emerald-600">+{summary?.users_growth_pct ?? 0}%</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-xs text-muted-foreground">Recent</p>
                      <p className="text-lg font-bold">{summary?.recent_signups ?? 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Content ── */}
        <TabsContent value="content" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {([
              { label: "Total", key: "total_content" as const },
              { label: "Modules", key: "total_modules" as const },
              { label: "Articles", key: "total_articles" as const },
              { label: "Videos", key: "total_videos" as const },
              { label: "Documents", key: "total_documents" as const },
            ]).map((c) => (
              <Card key={c.label}>
                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium">{c.label}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiValue(summary, c.key, period).toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Content Composition</CardTitle><CardDescription>Breakdown by type</CardDescription></CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="mx-auto h-48 w-48 rounded-full" />
                ) : (
                  <ChartContainer config={{ value: { label: "Count", color: "var(--chart-1)" } }} className="mx-auto aspect-square h-56">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent className="w-32" />} />
                      <Pie data={[
                        { name: "Modules", value: summary?.total_modules ?? 0 },
                        { name: "Articles", value: summary?.total_articles ?? 0 },
                        { name: "Videos", value: summary?.total_videos ?? 0 },
                        { name: "Stories", value: summary?.total_stories ?? 0 },
                        { name: "Documents", value: summary?.total_documents ?? 0 },
                      ].filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={80} strokeWidth={2} paddingAngle={2}>
                        {[0,1,2,3,4].map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Publishing Activity</CardTitle><CardDescription>Content published this period</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">Published {period === "today" ? "Today" : `in Last ${period}`}</p>
                      <p className="text-xs text-muted-foreground">Articles, modules, videos, stories</p>
                    </div>
                    <span className="text-2xl font-bold">{contentPublished}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">Drafts</p>
                      <p className="text-xs text-muted-foreground">Unpublished items</p>
                    </div>
                    <span className="text-2xl font-bold">{summary?.content_drafts ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">Forum Threads</p>
                      <p className="text-xs text-muted-foreground">Active discussions</p>
                    </div>
                    <span className="text-2xl font-bold">{summary?.active_forum_threads?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-xs text-muted-foreground">Total internal notes</p>
                    </div>
                    <span className="text-2xl font-bold">{summary?.total_notes?.toLocaleString() ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
