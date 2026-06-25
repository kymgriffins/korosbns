"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Film,
  GraduationCap,
  Loader2,
  Newspaper,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { cn } from "@/utils";
import { learnHubApi, type LearnHubItem } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

export function LearnAnalyticsView() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [articles, setArticles] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, stagesRes, articlesRes] = await Promise.all([
        learnHubApi.summary(),
        learnHubApi.stages(),
        learnHubApi.articles().catch(() => ({ results: [] as LearnHubItem[] })),
      ]);
      setCounts(summaryRes.counts);
      setModules(stagesRes.results ?? []);
      setArticles(articlesRes.results ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalContent = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const totalSteps = modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0);
  const topModules = [...modules].sort((a, b) => (b.steps?.length ?? 0) - (a.steps?.length ?? 0)).slice(0, 5);

  const kpiItems = [
    { label: "All Content", value: totalContent, icon: FileText, color: "text-blue-500", change: `${modules.length} modules` },
    { label: "Modules", value: modules.length, icon: BookOpen, color: "text-emerald-500", change: `${totalSteps} steps` },
    { label: "Articles", value: counts?.articles ?? 0, icon: Newspaper, color: "text-purple-500", change: "published" },
    { label: "Videos", value: counts?.videos ?? 0, icon: Film, color: "text-amber-500", change: "published" },
    { label: "Stories", value: counts?.stories ?? 0, icon: GraduationCap, color: "text-rose-500", change: "published" },
    { label: "Documents", value: counts?.documents ?? 0, icon: FileText, color: "text-cyan-500", change: "uploaded" },
  ];

  const barItems = [
    { label: "Modules", value: modules.length, color: "bg-blue-500", max: Math.max(totalContent, 1) },
    { label: "Articles", value: counts?.articles ?? 0, color: "bg-emerald-500", max: Math.max(totalContent, 1) },
    { label: "Videos", value: counts?.videos ?? 0, color: "bg-purple-500", max: Math.max(totalContent, 1) },
    { label: "Stories", value: counts?.stories ?? 0, color: "bg-amber-500", max: Math.max(totalContent, 1) },
    { label: "Documents", value: counts?.documents ?? 0, color: "bg-rose-500", max: Math.max(totalContent, 1) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Learning Hub content metrics and insights</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-5">
        <TabsList variant="line" className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-3 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {kpiItems.map((kpi) => (
                <Card key={kpi.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                    <kpi.icon className={cn("size-4", kpi.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold tabular-nums">{String(kpi.value)}</div>
                    <p className="text-sm text-muted-foreground">{kpi.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Content Distribution</CardTitle>
              <CardDescription>Breakdown by content type</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <div className="space-y-3">
                  {barItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-muted-foreground">{item.label}</span>
                      <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: `${(item.value / item.max) * 100}%` }} />
                      </div>
                      <span className="w-10 text-right text-sm font-medium tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Top Articles</CardTitle>
              <CardDescription>Most recent articles published</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : articles.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No articles yet.</p>
              ) : (
                <div className="space-y-2">
                  {articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {article.difficulty && `${article.difficulty} · `}
                          {article.published_at && new Date(article.published_at).toLocaleDateString()}
                        </p>
                      </div>
                      {article.tags?.length ? (
                        <div className="ml-2 flex gap-1">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag.slug} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{tag.name}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Top Modules by Steps</CardTitle>
              <CardDescription>Modules ranked by content volume</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : topModules.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No modules yet.</p>
              ) : (
                <div className="space-y-2">
                  {topModules.map((mod, idx) => (
                    <div key={mod.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{mod.title}</p>
                        <p className="text-sm text-muted-foreground">{mod.steps?.length ?? 0} steps{mod.badgeName && ` · ${mod.badgeName}`}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <TrendingUp className="size-3" />
                        {mod.steps?.length ?? 0}
                      </Badge>
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
