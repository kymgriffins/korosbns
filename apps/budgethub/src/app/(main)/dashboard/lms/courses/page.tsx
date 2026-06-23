"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { BookOpen, GraduationCap, Info, RefreshCw, Search, Trophy, Users, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const pieConfig = { published: { label: "Published", color: "var(--chart-2)" }, draft: { label: "Draft", color: "var(--chart-4)" }, archived: { label: "Archived", color: "var(--chart-5)" } } satisfies ChartConfig;

export default function CoursesPage() {
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBadge, setFilterBadge] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await learnHubApi.stages(); setModules(res.results ?? []); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalSteps = useMemo(() => modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0), [modules]);
  const badges = useMemo(() => new Set(modules.map((m) => m.badgeName).filter((b): b is string => !!b)), [modules]);
  const authors = useMemo(() => new Set(modules.map((m) => m.author?.slug).filter(Boolean)), [modules]);
  const statusCounts = useMemo(() => {
    const c: Record<string, number> = {};
    modules.forEach((m) => { const s = m.status || "draft"; c[s] = (c[s] ?? 0) + 1; });
    return c;
  }, [modules]);

  const stepsDistribution = useMemo(() => {
    const b = [0, 0, 0, 0, 0];
    modules.forEach((m) => { const s = m.steps?.length ?? 0; if (s <= 2) b[0]++; else if (s <= 5) b[1]++; else if (s <= 10) b[2]++; else if (s <= 20) b[3]++; else b[4]++; });
    return [{ name: "1-2", value: b[0] }, { name: "3-5", value: b[1] }, { name: "6-10", value: b[2] }, { name: "11-20", value: b[3] }, { name: "20+", value: b[4] }];
  }, [modules]);

  const filteredModules = useMemo(() => modules.filter((mod) => {
    if (searchQuery) { const q = searchQuery.toLowerCase(); if (!mod.title.toLowerCase().includes(q) && !mod.description?.toLowerCase().includes(q)) return false; }
    if (filterBadge && mod.badgeName !== filterBadge) return false;
    return true;
  }), [modules, searchQuery, filterBadge]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">Browse and manage civic learning modules</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}><RefreshCw className={cn("size-4", loading && "animate-spin")} />Refresh</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-3 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /><Skeleton className="mt-1 h-3 w-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card><CardHeader><CardTitle className="text-sm">Total Courses</CardTitle><CardAction><Info className="size-3 text-muted-foreground" /></CardAction></CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-3xl text-foreground leading-none tracking-tight">{modules.length}</span>
                <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300"><BookOpen className="size-3" />{statusCounts["published"] ?? 0} published</Badge>
              </div>
              <div className="text-right text-muted-foreground text-xs">{statusCounts["draft"] ?? 0} drafts · {statusCounts["archived"] ?? 0} archived</div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm">Total Steps</CardTitle><CardAction><Info className="size-3 text-muted-foreground" /></CardAction></CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-3xl text-foreground leading-none tracking-tight">{totalSteps}</span>
                <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300"><GraduationCap className="size-3" />lessons</Badge>
              </div>
              <div className="text-right text-muted-foreground text-xs">avg {(totalSteps / Math.max(modules.length, 1)).toFixed(1)} per course</div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm">Authors</CardTitle><CardAction><Info className="size-3 text-muted-foreground" /></CardAction></CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-3xl text-foreground leading-none tracking-tight">{authors.size}</span>
                <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300"><Users className="size-3" />contributors</Badge>
              </div>
              <div className="text-right text-muted-foreground text-xs">creating budget literacy content</div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm">Categories</CardTitle><CardAction><Info className="size-3 text-muted-foreground" /></CardAction></CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-3xl text-foreground leading-none tracking-tight">{badges.size}</span>
                <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300"><Trophy className="size-3" />badges</Badge>
              </div>
              <div className="text-right text-muted-foreground text-xs">unique course categories</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader><CardTitle className="text-sm">Course Status</CardTitle><CardDescription>Distribution by publication status</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="mx-auto aspect-square h-52">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent className="w-32" />} />
                <Pie data={Object.entries(statusCounts).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} strokeWidth={2}>
                  {Object.keys(statusCounts).map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {Object.entries(statusCounts).map(([name, value], idx) => (
                <div key={name} className="flex items-center gap-1.5 text-xs">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="capitalize text-muted-foreground">{name}</span>
                  <span className="font-medium tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader><CardTitle className="text-sm">Steps Distribution</CardTitle><CardDescription>Courses grouped by step count</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={{ steps: { label: "Courses", color: "var(--chart-1)" } } satisfies ChartConfig} className="aspect-auto h-52 w-full">
              <BarChart data={stepsDistribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent className="w-32" />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border bg-background pl-9 pr-8 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", ...badges].map((badge) => (
            <button key={badge} onClick={() => setFilterBadge(badge === "All" ? null : badge)}
              className={cn("shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all",
                filterBadge === badge || (badge === "All" && !filterBadge) ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground")}>
              {badge === "All" ? "All" : badge}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-0">
              <Skeleton className="aspect-video w-full rounded-t-xl" />
              <div className="p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="mt-2 h-3 w-full" /></div>
            </CardContent></Card>
          ))}
        </div>
      ) : filteredModules.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-12">
          <Search className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No courses match your filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setFilterBadge(null); }}>Clear filters</Button>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((mod) => (
            <Link key={mod.id} href={`/budgethub/dashboard/lms/courses/${mod.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-md">
              {mod.image_url ? (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img src={mod.image_url} alt={mod.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"><BookOpen className="size-10 text-primary/40" /></div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  {mod.badgeName && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase leading-none text-secondary-foreground">{mod.badgeName}</span>}
                  {mod.author?.name && <span className="text-[10px] text-muted-foreground">{mod.author.name}</span>}
                  {mod.status === "draft" && <Badge variant="outline" className="ml-auto rounded-full px-1.5 text-[10px]">Draft</Badge>}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{mod.title}</h3>
                {mod.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{mod.description}</p>}
                <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted-foreground">
                  <span>{mod.steps?.length ?? 0} steps</span>
                  {mod.is_financial_year_analysis && <span>Budget Analysis</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
