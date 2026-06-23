"use client";

import { useCallback, useEffect, useState } from "react";

import { BookOpen, FileText, Film, GraduationCap, Loader2, Newspaper, RefreshCw, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

import { LearningHubCard } from "./_components/learning-hub-card";

export default function LearningHubPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, stagesRes] = await Promise.all([
        learnHubApi.summary(),
        learnHubApi.stages(),
      ]);
      setCounts(summaryRes.counts);
      setModules(stagesRes.results ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSteps = modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0);
  const publishedModules = modules.filter((m) => m.status === "published").length;
  const moduleKeys = Object.keys(counts ?? {});
  const totalContent = moduleKeys.reduce((sum, k) => sum + ((counts as any)?.[k] ?? 0), 0);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Learning Hub</h1>
          <p className="text-sm text-muted-foreground">
            Budget literacy content — modules, articles, videos, and more
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="mt-1 h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  <BookOpen className="size-4" />
                </div>
              </CardTitle>
              <CardDescription>Modules</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{modules.length}</div>
                <Badge>
                  <TrendingUp className="size-3" />
                  {publishedModules} published
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">{totalSteps} total steps across all modules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  <Newspaper className="size-4" />
                </div>
              </CardTitle>
              <CardDescription>Articles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{counts?.articles ?? 0}</div>
              </div>
              <p className="text-muted-foreground text-sm">Budget explainers and analysis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  <Film className="size-4" />
                </div>
              </CardTitle>
              <CardDescription>Videos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{counts?.videos ?? 0}</div>
              </div>
              <p className="text-muted-foreground text-sm">Video explainers and tutorials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  <GraduationCap className="size-4" />
                </div>
              </CardTitle>
              <CardDescription>Total Content</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{totalContent}</div>
                <Badge>
                  <TrendingUp className="size-3" />
                  items
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Modules, articles, videos, stories & documents</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="leading-none">Content Overview</CardTitle>
          <CardDescription>
            <span className="@[540px]/card:block hidden">Distribution of content across the Learning Hub</span>
            <span className="@[540px]/card:hidden">Content distribution</span>
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger size="sm" className="w-28">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Period</SelectLabel>
                  <SelectItem value="all">All time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              View report
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Modules", value: modules.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Articles", value: counts?.articles ?? 0, icon: Newspaper, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Videos", value: counts?.videos ?? 0, icon: Film, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Stories", value: counts?.stories ?? 0, icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Documents", value: counts?.documents ?? 0, icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center">
                <div className={cn("flex size-10 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <div className="text-2xl font-bold tabular-nums">{String(stat.value)}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Modules</h2>
          {modules.length > 6 && (
            <Button variant="ghost" size="sm" asChild>
              <a href="/budgethub/dashboard/learning-hub/modules">View all</a>
            </Button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : modules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12">
              <BookOpen className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No modules available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.slice(0, 6).map((mod) => (
              <LearningHubCard
                key={mod.id}
                title={mod.title}
                description={mod.description}
                href={`/dashboard/learning-hub/modules/${mod.slug}`}
                icon={<BookOpen className="size-4" />}
                badge={mod.badgeName}
                meta={`${mod.steps?.length ?? 0} steps`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
