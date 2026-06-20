"use client";

import { useCallback, useEffect, useState } from "react";

import { BookOpen, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { learnHubApi } from "@/lib/learn-hub";
import { cn } from "@/lib/utils";
import type { CivicModule } from "@/types/learn";

import { LearningHubCard } from "../_components/learning-hub-card";

export default function ModulesPage() {
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await learnHubApi.stages();
      setModules(res.results ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Modules</h1>
          <p className="text-sm text-muted-foreground">Civic learning modules</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
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
                <Skeleton className="mt-2 h-3 w-1/2" />
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
          {modules.map((mod) => (
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
  );
}
