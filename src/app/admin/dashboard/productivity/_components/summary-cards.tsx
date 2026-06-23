"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowRight, Clock3, Focus, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";

type SummaryData = {
  todayTasks: number;
  weekProgress: number;
  focusStatus: string;
};

export function SummaryCards() {
  const [data, setData] = useState<SummaryData>({ todayTasks: 0, weekProgress: 0, focusStatus: "Ready" });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasks, goalSummary, focusSession] = await Promise.allSettled([
        taskApi.listAll(),
        taskApi.getGoalSummary(),
        taskApi.getActiveFocusSession(),
      ]);

      const allTasks = tasks.status === "fulfilled" ? tasks.value : [];
      const today = new Date().toISOString().split("T")[0];
      const todayTasks = allTasks.filter(
        (t) => t.due_date === today && t.status !== "published",
      ).length;

      const weekProgress = goalSummary.status === "fulfilled" ? goalSummary.value.completion_rate : 0;
      const focusActive = focusSession.status === "fulfilled" && focusSession.value.active;

      setData({
        todayTasks: todayTasks || allTasks.filter((t) => t.status === "draft").length,
        weekProgress,
        focusStatus: focusActive ? "In Progress" : "Deep Work",
      });
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summaryCards = [
    { title: "Today", value: String(data.todayTasks), description: "tasks scheduled", icon: Clock3 },
    { title: "This Week", value: `${data.weekProgress}%`, description: "progress", icon: TrendingUp },
    { title: "Focus", value: data.focusStatus, description: "2 hours remaining", icon: Focus },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryCards.map((item) => (
        <Card key={item.title} className="shadow-xs">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="grid size-7 place-items-center rounded-lg border bg-muted">
                  <item.icon className="size-4" />
                </div>
                {item.title}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl leading-none tracking-tight">{item.value}</div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground tabular-nums leading-none">{item.description}</p>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
