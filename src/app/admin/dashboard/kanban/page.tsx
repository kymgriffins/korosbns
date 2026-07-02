"use client";

import { useCallback } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { usePageView } from "@/hooks/use-page-view";
import { useTaskList } from "@/hooks/use-task-list";
import { taskData } from "@/data/tasks";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task as DjangoTask } from "@/types/tasks";

import { Kanban } from "./_components/kanban";
import type { BoardState, Task as KanbanTask } from "./_components/types";

const TEAM_MAP: Record<string, "MEDIA" | "ICT" | "MANAGERIAL"> = {
  MEDIA: "MEDIA",
  ICT: "ICT",
  MANAGERIAL: "MANAGERIAL",
};

function toKanbanTask(t: DjangoTask): KanbanTask {
  const team = t.assigned_team && TEAM_MAP[t.assigned_team] ? TEAM_MAP[t.assigned_team] : "ICT";
  return {
    id: t.id,
    title: t.title,
    description: t.content ?? "",
    priority: (t.priority ?? "medium") as KanbanTask["priority"],
    dueDate: t.due_date ?? "",
    progress: t.progress ?? 0,
    owner: {
      name: t.owner_name ?? t.author_name ?? "Unknown",
      tone: t.owner_tone ?? "",
    },
    team,
    insights: [],
  };
}

function mapTasksToBoard(tasks: DjangoTask[]) {
  const board: Record<string, KanbanTask[]> = {
    ideas: [],
    planned: [],
    building: [],
    qa: [],
    shipped: [],
  };

  for (const task of tasks) {
    const col = task.kanban_column ?? "ideas";
    if (board[col]) {
      board[col].push(toKanbanTask(task));
    } else {
      board.ideas.push(toKanbanTask(task));
    }
  }

  return board;
}

export default function Page() {
  usePageView();
  const routeBase = useRouteBase();
  const { tasks, setTasks, loading, error, fetchTasks, upsertTask } = useTaskList();

  const handleColumnChange = useCallback(async (taskId: string, newColumn: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, kanban_column: newColumn as DjangoTask["kanban_column"] } : t)),
    );
    try {
      const updated = await taskData.tasks.update(taskId, { kanban_column: newColumn as DjangoTask["kanban_column"] });
      upsertTask(updated);
      invalidateTaskList();
    } catch {
      toast.error("Failed to update task column");
      fetchTasks();
    }
  }, [fetchTasks, upsertTask, setTasks]);

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
          <button onClick={() => void fetchTasks()} className="text-sm text-primary underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const board = mapTasksToBoard(tasks);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <div />
        <Button asChild><Link href={getFullUrl(routeBase, "/dashboard/task/new")}>New Task</Link></Button>
      </div>
      <div data-content-padding="false">
        <Kanban
          initialBoard={board as BoardState}
          onColumnChange={handleColumnChange}
        />
      </div>
    </div>
  );
}
