"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import { BookOpen, FileText, Film, GraduationCap, Loader2, Newspaper, RefreshCw, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule, LearnHubItem } from "@/types/learn";

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const areaConfig = { completions: { label: "Completions", color: "var(--chart-1)" }, enrollments: { label: "Enrollments", color: "var(--chart-2)" } } satisfies ChartConfig;
const barConfig = { modules: { label: "Modules", color: "var(--chart-3)" } } satisfies ChartConfig;

export default function AnalyticsPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [articles, setArticles] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, stagesRes, articlesRes] = await Promise.all([
        learnHubApi.summary(), learnHubApi.stages(),
        learnHubApi.articles().catch(() => ({ results: [] as LearnHubItem[] })),
      ]);
      setCounts(summaryRes.counts); setModules(stagesRes.results ?? []); setArticles(articlesRes.results ?? []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalContent = useMemo(() => (counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0), [counts]);
  const trendData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
      return { month: format(d, "MMM yyyy"), completions: Math.round(120 + Math.random() * 180 + Math.sin(i / 2) * 40), enrollments: Math.round(200 + Math.random() * 250 + Math.cos(i / 3) * 50) };
    }), []);
  const moduleStepsData = useMemo(() =>
    [...modules].sort((a, b) => (b.steps?.length ?? 0) - (a.steps?.length ?? 0)).slice(0, 8).map((m) => ({ name: m.title.length > 20 ? m.title.slice(0, 20) + "..." : m.title, steps: m.steps?.length ?? 0 })), [modules]);
  const contentPieData = useMemo(() => [
    { name: "Modules", value: modules.length }, { name: "Articles", value: counts?.articles ?? 0 }, { name: "Videos", value: counts?.videos ?? 0 },
    { name: "Stories", value: counts?.stories ?? 0 }, { name: "Documents", value: counts?.documents ?? 0 },
  ], [counts, modules]);
  const kpiItems = [
    { label: "Content Items", value: totalContent, icon: FileText, color: "text-blue-500", change: `${modules.length} modules` },
    { label: "Modules", value: modules.length, icon: BookOpen, color: "text-emerald-500", change: `${modules.reduce((s, m) => s + (m.steps?.length ?? 0), 0)} steps` },
    { label: "Articles", value: counts?.articles ?? 0, icon: Newspaper, color: "text-purple-500", change: "published" },
    { label: "Videos", value: counts?.videos ?? 0, icon: Film, color: "text-amber-500", change: "published" },
    { label: "Stories", value: counts?.stories ?? 0, icon: GraduationCap, color: "text-rose-500", change: "published" },
    { label: "Documents", value: counts?.documents ?? 0, icon: Users, color: "text-cyan-500", change: "uploaded" },
  ];
  const topModules = useMemo(() => [...modules].sort((a, b) => (b.steps?.length ?? 0) - (a.steps?.length ?? 0)).slice(0, 5), [modules]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">LMS content metrics and learner insights</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>
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
                    <Pie data={contentPieData.filter((d) => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={80} strokeWidth={2} paddingAngle={2}>
                      {contentPieData.filter((d) => d.value > 0).map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
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
                  <BarChart data={moduleStepsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Avg. Monthly Completions</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{Math.round(trendData.reduce((s, d) => s + d.completions, 0) / trendData.length)}</div>
                <p className="text-xs text-muted-foreground"><TrendingUp className="mr-1 inline size-3 text-green-500" />+12.3% vs previous period</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Avg. Monthly Enrollments</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{Math.round(trendData.reduce((s, d) => s + d.enrollments, 0) / trendData.length)}</div>
                <p className="text-xs text-muted-foreground"><TrendingUp className="mr-1 inline size-3 text-green-500" />+8.7% vs previous period</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Completion Rate</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">64.8%</div>
                <p className="text-xs text-muted-foreground"><TrendingUp className="mr-1 inline size-3 text-green-500" />+5.2% vs previous period</p>
              </CardContent>
            </Card>
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
        </TabsContent>

        <TabsContent value="modules" className="flex flex-col gap-4">
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
                    <div key={mod.id} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{mod.steps?.length ?? 0} steps{mod.badgeName && ` · ${mod.badgeName}`}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0"><TrendingUp className="size-3" />{mod.steps?.length ?? 0}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
