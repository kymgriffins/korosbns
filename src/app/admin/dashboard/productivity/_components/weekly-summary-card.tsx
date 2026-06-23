"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";

export function WeeklySummaryCard() {
  const [summary, setSummary] = useState<{
    total: number;
    completed: number;
    in_progress: number;
    completion_rate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskApi.getGoalSummary();
      setSummary(data);
    } catch {
      // silently fail - show static fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <Card className="shadow-xs">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const completed = summary?.completed ?? 0;
  const total = summary?.total ?? 0;
  const rate = summary?.completion_rate ?? 0;

  const message = rate >= 80
    ? "Excellent work! Keep it up."
    : rate >= 50
      ? "You're doing great. Keep the momentum going."
      : "Let's get started on your goals.";

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>This Week</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">
            {total > 0 ? `${completed} of ${total} goals completed` : "No goals set"}
          </div>
          <Progress value={rate} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
