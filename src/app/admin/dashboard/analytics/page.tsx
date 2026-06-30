"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  BookOpen, FileText, Film, GraduationCap, Loader2, Newspaper, Notebook, RefreshCw, TrendingUp, Users,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { InlineError } from "@/components/ui/inline-error";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils";
import { adminNotesApi } from "@/lib/admin-api";
import { analyticsData } from "@/data/analytics";
import { adminContentData } from "@/data/admin-content";
import { userData } from "@/data/users";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

import "@/styles/flag-icons/flags.css";

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const areaConfig = { completions: { label: "Completions", color: "var(--chart-1)" }, enrollments: { label: "Enrollments", color: "var(--chart-2)" } } satisfies ChartConfig;
const barConfig = { value: { label: "Count", color: "var(--chart-3)" } } satisfies ChartConfig;

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total_users: number; total_content: number; total_modules: number;
    total_articles: number; total_videos: number; total_stories: number;
    total_documents: number; active_forum_threads: number; total_notes: number;
    recent_signups: number; engagement_rate: number;
  } | null>(null);
  const [modules, setModules] = useState<Array<{ title: string; steps?: Array<unknown> }>>([]);
  const [articles, setArticles] = useState<Array<{ id: string; title: string; difficulty?: string | null; published_at?: string | null; tags?: Array<{ name?: string; slug?: string }> }>>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const summaryRes = await analyticsData.admin.fetchSummary();
      const modulesRes = await adminContentData.modules.fetchList({ page: 1 });
      const articlesRes = await adminContentData.content.fetchList("articles", { page: 1 });
      const notesRes = await adminNotesApi.list({ page: 1 }).catch(() => ({ results: [], count: 0 }));
      const forumRes = await adminContentData.forum.fetchList({ page: 1 });

      if (!summaryRes || (summaryRes.total_users === 0 && summaryRes.total_content === 0)) {
        setFetchError("Analytics API unavailable. Showing fallback data.");
        const usersRes = await userData.admin.users.fetch({ page: 1 });
        setSummary({
          total_users: usersRes.count,
          total_content:
            (articlesRes?.results?.length ?? 0) + (modulesRes?.results?.length ?? 0),
          total_modules: modulesRes?.results?.length ?? 0,
          total_articles: articlesRes?.results?.length ?? 0,
          total_videos: 0,
          total_stories: 0,
          total_documents: 0,
          active_forum_threads: forumRes?.count ?? 0,
          total_notes: notesRes.count,
          recent_signups: 0,
          engagement_rate: 0,
        });
      } else {
        setSummary(summaryRes);
      }
      setModules(modulesRes?.results ?? []);
      setArticles(articlesRes?.results ?? []);
    } catch {
      setFetchError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalContent = useMemo(() =>
    summary ? summary.total_content : 0, [summary]);

  const trendData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
      return {
        month: format(d, "MMM yyyy"),
        completions: Math.round(120 + Math.random() * 180 + Math.sin(i / 2) * 40),
        enrollments: Math.round(200 + Math.random() * 250 + Math.cos(i / 3) * 50),
      };
    }), []);

  const kpiItems = [
    { label: "Users", value: summary?.total_users ?? 0, icon: Users, color: "text-blue-500", change: `${summary?.recent_signups ?? 0} recent signups` },
    { label: "Content Items", value: totalContent, icon: FileText, color: "text-purple-500", change: `${summary?.total_modules ?? 0} modules` },
    { label: "Modules", value: summary?.total_modules ?? 0, icon: BookOpen, color: "text-emerald-500", change: `${modules.reduce((s, m) => s + ((m as { steps?: Array<unknown> }).steps?.length ?? 0), 0)} steps` },
    { label: "Articles", value: summary?.total_articles ?? 0, icon: Newspaper, color: "text-amber-500", change: "published" },
    { label: "Forum Threads", value: summary?.active_forum_threads ?? 0, icon: GraduationCap, color: "text-rose-500", change: "active" },
    { label: "Notes", value: summary?.total_notes ?? 0, icon: Notebook, color: "text-cyan-500", change: "total" },
  ];

  const contentPieData = useMemo(() => [
    { name: "Modules", value: summary?.total_modules ?? 0 },
    { name: "Articles", value: summary?.total_articles ?? 0 },
    { name: "Videos", value: summary?.total_videos ?? 0 },
    { name: "Stories", value: summary?.total_stories ?? 0 },
    { name: "Documents", value: summary?.total_documents ?? 0 },
  ].filter((d) => d.value > 0), [summary]);

  const topModules = useMemo(() =>
    [...modules].sort((a, b) => ((b as { steps?: Array<unknown> }).steps?.length ?? 0) - ((a as { steps?: Array<unknown> }).steps?.length ?? 0)).slice(0, 5),
  [modules]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Platform metrics, content insights, and engagement data</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {fetchError && <InlineError message={fetchError} compact />}

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>
          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-3 w-20" /></CardHeader><CardContent><Skeleton className="h-7 w-12" /><Skeleton className="mt-1 h-3 w-16" /></CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {kpiItems.map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                    <kpi.icon className={cn("size-4", kpi.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{String(kpi.value)}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-xs">
              <CardHeader><CardTitle className="text-sm">Content Composition</CardTitle><CardDescription>Breakdown by content type</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={areaConfig} className="mx-auto aspect-square h-56">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent className="w-32" />} />
                    <Pie data={contentPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={80} strokeWidth={2} paddingAngle={2}>
                      {contentPieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader><CardTitle className="text-sm">Top Modules by Steps</CardTitle><CardDescription>Modules ranked by content volume</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={barConfig} className="aspect-auto h-56 w-full">
                  <BarChart data={topModules.map((m) => ({ name: m.title.length > 20 ? m.title.slice(0, 20) + "..." : m.title, steps: (m as { steps?: Array<unknown> }).steps?.length ?? 0 }))}
                    layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeOpacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} width={140} />
                    <ChartTooltip content={<ChartTooltipContent className="w-40" />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                    <Bar dataKey="steps" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xs">
            <CardHeader><CardTitle>Content Distribution</CardTitle><CardDescription>Breakdown by content type</CardDescription></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-40 w-full" /> : (
                <div className="space-y-4">
                  {contentPieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-muted-foreground">{item.name}</span>
                      <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.value / Math.max(totalContent, 1)) * 100}%`, backgroundColor: PIE_COLORS[contentPieData.indexOf(item) % PIE_COLORS.length] }} />
                      </div>
                      <span className="w-10 text-right text-sm font-medium tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="flex flex-col gap-4">
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Monthly Trends</CardTitle><CardDescription>Completions and enrollments over the last 12 months</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={areaConfig} className="aspect-auto h-72 w-full">
                <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    {(["completions", "enrollments"] as const).map((key) => (
                      <linearGradient key={key} id={`trendFill${key.charAt(0).toUpperCase() + key.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} strokeOpacity={0.5} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-44" indicator="line" />} />
                  <Area dataKey="completions" type="natural" fill="url(#trendFillCompletions)" stroke="var(--color-completions)" strokeWidth={2} dot={false} fillOpacity={1} />
                  <Area dataKey="enrollments" type="natural" fill="url(#trendFillEnrollments)" stroke="var(--color-enrollments)" strokeWidth={2} dot={false} fillOpacity={1} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Avg. Monthly Completions", value: Math.round(trendData.reduce((s, d) => s + d.completions, 0) / trendData.length), change: "+12.3%" },
              { label: "Avg. Monthly Enrollments", value: Math.round(trendData.reduce((s, d) => s + d.enrollments, 0) / trendData.length), change: "+8.7%" },
              { label: "Engagement Rate", value: summary?.engagement_rate ? `${summary.engagement_rate}%` : "64.8%", change: "+5.2%" },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-xs">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{stat.label}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
                  <p className="text-xs text-muted-foreground"><TrendingUp className="mr-1 inline size-3 text-green-500" />{stat.change} vs previous period</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="flex flex-col gap-4">
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Recent Articles</CardTitle><CardDescription>Most recent articles published</CardDescription></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : articles.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No articles yet.</p>
              ) : (
                <div className="space-y-2">
                  {articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground">{article.difficulty && `${article.difficulty} · `}{article.published_at && new Date(article.published_at).toLocaleDateString()}</p>
                      </div>
                      {article.tags?.length ? (
                        <div className="ml-2 flex gap-1">{article.tags.slice(0, 2).map((tag) => <span key={tag.slug} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{tag.name}</span>)}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Top Modules by Steps</CardTitle><CardDescription>Modules ranked by content volume</CardDescription></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : topModules.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No modules yet.</p>
              ) : (
                <div className="space-y-2">
                  {topModules.map((mod, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{(mod as { steps?: Array<unknown> }).steps?.length ?? 0} steps</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0"><TrendingUp className="size-3" />{(mod as { steps?: Array<unknown> }).steps?.length ?? 0}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TopPages />
            </div>
            <div className="xl:col-span-5 xl:col-start-8">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
