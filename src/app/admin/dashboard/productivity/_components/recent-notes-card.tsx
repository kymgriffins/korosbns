"use client";

import { useCallback, useEffect, useState } from "react";

import { format, isToday, isYesterday } from "date-fns";
import { BookOpen, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import { TASK_LIST_INVALIDATED_EVENT } from "@/lib/task-events";
import type { Task } from "@/types/tasks";

function formatNoteDate(date: string | Date) {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

export function RecentNotesCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskApi.listAll();
      const sorted = [...data]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
      setTasks(sorted);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecent();
    const refresh = () => {
      void fetchRecent();
    };
    window.addEventListener(TASK_LIST_INVALIDATED_EVENT, refresh);
    return () => window.removeEventListener(TASK_LIST_INVALIDATED_EVENT, refresh);
  }, [fetchRecent]);

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="size-5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No recent tasks.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-4">
              <FileText className="size-5 text-muted-foreground" />
              <div className="min-w-0">
                <div className="truncate font-medium text-sm leading-none">{task.title}</div>
                <div className="text-muted-foreground text-xs">{formatNoteDate(task.created_at)}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
