"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import type { Task } from "@/types/tasks";

import { Kanban } from "./_components/kanban";

function mapTasksToBoard(tasks: Task[]) {
  const board: Record<string, Task[]> = {
    ideas: [],
    planned: [],
    building: [],
    qa: [],
    shipped: [],
  };

  for (const task of tasks) {
    const col = task.kanban_column ?? "ideas";
    if (board[col]) {
      board[col].push(task);
    } else {
      board.ideas.push(task);
    }
  }

  return board;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.listAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleColumnChange = useCallback(async (taskId: string, newColumn: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, kanban_column: newColumn as Task["kanban_column"] } : t)),
    );
    try {
      await taskApi.update(taskId, { kanban_column: newColumn as Task["kanban_column"] });
    } catch {
      toast.error("Failed to update task column");
      fetchTasks();
    }
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
        <div className="flex shrink-0 gap-4 border-b px-4 py-3 lg:px-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex-1 overflow-hidden px-4 pt-4">
          <div className="inline-grid h-full min-w-full grid-cols-[repeat(5,minmax(20rem,1fr))] gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-8" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={fetchTasks} className="text-sm text-primary underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const board = mapTasksToBoard(tasks);

  return (
    <div data-content-padding="false">
      <Kanban
        initialBoard={board as any}
        onColumnChange={handleColumnChange}
      />
    </div>
  );
}
