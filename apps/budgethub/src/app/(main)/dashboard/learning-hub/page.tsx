"use client";

import { useCallback, useEffect, useState } from "react";

import { BookOpen, FileText, Film, GraduationCap, Newspaper, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

  const statCards = [
    { label: "Modules", value: counts?.modules ?? counts?.stages ?? modules.length, icon: BookOpen, color: "text-blue-500" },
    { label: "Articles", value: counts?.articles ?? 0, icon: Newspaper, color: "text-emerald-500" },
    { label: "Videos", value: counts?.videos ?? 0, icon: Film, color: "text-purple-500" },
    { label: "Stories", value: counts?.stories ?? 0, icon: GraduationCap, color: "text-amber-500" },
    { label: "Documents", value: counts?.documents ?? 0, icon: FileText, color: "text-rose-500" },
  ];

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
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={cn("size-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{String(stat.value)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Modules</h2>
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
          <p className="text-sm text-muted-foreground">No modules available yet.</p>
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
