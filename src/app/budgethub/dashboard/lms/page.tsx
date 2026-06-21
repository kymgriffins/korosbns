"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { addHours, endOfToday, format, parseISO, subHours } from "date-fns";
import { ArrowRight, BookOpen, FileText, Film, GraduationCap, Loader2, Newspaper, RefreshCw, Trophy, TrendingUp, Users } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule, LearnHubItem } from "@/types/learn";
import { LearningHubCard } from "../learning-hub/_components/learning-hub-card";

const chartDays = 30;
const endDate = endOfToday();
const startDate = subHours(endDate, chartDays * 24);

const chartData = Array.from({ length: chartDays }, (_, i) => {
  const base = Math.round(40 + Math.random() * 60);
  const trend = Math.sin(i / 5) * 15 + (i / chartDays) * 10;
  return {
    date: format(addHours(startDate, i * 24), "yyyy-MM-dd"),
    completions: Math.max(0, Math.round(base + trend)),
    enrollments: Math.max(0, Math.round(base * 0.6 + trend * 0.5)),
    activeUsers: Math.max(0, Math.round(base * 0.8 + Math.sin(i / 3) * 10)),
  };
});

const chartConfig = {
  completions: { label: "Completions", color: "var(--chart-1)" },
  enrollments: { label: "Enrollments", color: "var(--chart-2)" },
  activeUsers: { label: "Active Users", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function LMSPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [trending, setTrending] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, stagesRes] = await Promise.all([learnHubApi.summary(), learnHubApi.stages()]);
      setCounts(summaryRes.counts);
      setModules(stagesRes.results ?? []);
      setTrending(summaryRes.trending ?? []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalSteps = useMemo(() => modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0), [modules]);
  const publishedModules = useMemo(() => modules.filter((m) => m.status === "published").length, [modules]);
  const totalContent = useMemo(() => counts ? Object.values(counts).reduce((a, b) => a + b, 0) + modules.length : 0, [counts, modules]);

  const kpiItems = [
    { label: "Total Content", value: totalContent, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", change: `${modules.length} modules`, trend: "+12.5%", trendUp: true },
    { label: "Active Learners", value: "1,247", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "past 30 days", trend: "+8.3%", trendUp: true },
    { label: "Completions", value: totalSteps, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10", change: "total steps completed", trend: "+23.1%", trendUp: true },
    { label: "Engagement", value: `${Math.round((publishedModules / Math.max(modules.length, 1)) * 100)}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", change: "publish rate", trend: "+5.2%", trendUp: true },
  ];

  const popularModules = useMemo(() => [...modules].sort((a, b) => (b.steps?.length ?? 0) - (a.steps?.length ?? 0)).slice(0, 6), [modules]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">LMS Overview</h1>
          <p className="text-sm text-muted-foreground">Learning Management System — content, analytics, and learner progress</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="size-7 rounded-lg" /><Skeleton className="mt-1 h-3 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /><Skeleton className="mt-1 h-3 w-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiItems.map((kpi) => (
            <Card key={kpi.label} className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div><CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle></div>
                <div className={cn("flex size-8 items-center justify-center rounded-lg", kpi.bg)}><kpi.icon className={cn("size-4", kpi.color)} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums leading-none tracking-tight">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className={cn("rounded-sm px-1 font-normal", kpi.trendUp ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-destructive/10 text-destructive")}>
                    <TrendingUp className="mr-0.5 size-3" />{kpi.trend}
                  </Badge>
                  <span className="text-muted-foreground">{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardTitle className="leading-none">Learner Activity</CardTitle>
          <CardDescription><span className="@[540px]/card:block hidden">Daily completions, enrollments, and active users over the last 30 days</span><span className="@[540px]/card:hidden">Last 30 days activity</span></CardDescription>
          <CardAction className="flex items-center gap-2"><Button variant="outline" size="sm">View report</Button></CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <ComposedChart data={chartData} margin={{ top: 0 }}>
              <defs>
                {(["completions", "enrollments", "activeUsers"] as const).map((key) => (
                  <linearGradient key={key} id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeOpacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={48}
                tickFormatter={(value) => parseISO(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-56" indicator="line" labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")} />} />
              <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-4 justify-end" />} />
              <Area dataKey="completions" type="natural" fill="url(#fillCompletions)" stroke="var(--color-completions)" strokeWidth={1.5} dot={false} fillOpacity={1} />
              <Line dataKey="enrollments" type="natural" stroke="var(--color-enrollments)" strokeWidth={1.5} dot={false} />
              <Line dataKey="activeUsers" type="natural" stroke="var(--color-activeUsers)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="@container/card shadow-xs lg:col-span-1">
          <CardHeader><CardTitle className="leading-none">Content Distribution</CardTitle><CardDescription>Breakdown by content type</CardDescription></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <div className="space-y-4">
                {[
                  { label: "Modules", value: modules.length, color: "bg-blue-500", icon: BookOpen, max: Math.max(totalContent, 1) },
                  { label: "Articles", value: counts?.articles ?? 0, color: "bg-emerald-500", icon: Newspaper, max: Math.max(totalContent, 1) },
                  { label: "Videos", value: counts?.videos ?? 0, color: "bg-purple-500", icon: Film, max: Math.max(totalContent, 1) },
                  { label: "Stories", value: counts?.stories ?? 0, color: "bg-amber-500", icon: GraduationCap, max: Math.max(totalContent, 1) },
                  { label: "Documents", value: counts?.documents ?? 0, color: "bg-rose-500", icon: FileText, max: Math.max(totalContent, 1) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="w-20 text-sm text-muted-foreground">{item.label}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full transition-all duration-700 ease-out", item.color)} style={{ width: `${(item.value / item.max) * 100}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm font-medium tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="@container/card shadow-xs lg:col-span-2">
          <CardHeader><CardTitle className="leading-none">Trending Content</CardTitle><CardDescription>Most popular content across the platform</CardDescription></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : trending.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No trending content yet.</p>
            ) : (
              <div className="space-y-2">
                {trending.slice(0, 5).map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">{idx + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full px-1.5 py-0 text-[10px]">{item.content_type}</Badge>
                        {item.published_at && <span>{new Date(item.published_at).toLocaleDateString()}</span>}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Popular Modules</h2>
          {modules.length > 6 && <Button variant="ghost" size="sm" asChild><a href="/dashboard/lms/courses">View all</a></Button>}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-3 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : popularModules.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center gap-2 py-12"><BookOpen className="size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">No modules available yet.</p></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularModules.map((mod) => (
              <LearningHubCard key={mod.id} title={mod.title} description={mod.description} href={`/dashboard/lms/courses/${mod.slug}`}
                icon={<BookOpen className="size-4" />} badge={mod.badgeName} meta={`${mod.steps?.length ?? 0} steps`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
