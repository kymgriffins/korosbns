"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { usePageView } from "@/hooks/use-page-view";
import { useTaskList } from "@/hooks/use-task-list";
import { invalidateTaskList } from "@/lib/task-events";
import type { TaskStatus, TaskPriority } from "@/types/tasks";

import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskToolbar, type ViewMode } from "@/app/admin/dashboard/task/_components/task-toolbar";
import { TaskBoardView } from "@/app/admin/dashboard/task/_components/task-board-view";
import { TaskTilesView } from "@/app/admin/dashboard/task/_components/task-tiles-view";
import { TaskListView } from "@/app/admin/dashboard/task/_components/task-list-view";

export default function AdminTaskPage() {
  usePageView();
  const { isLoggedIn } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTaskList();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all_statuses");
  const [priorityFilter, setPriorityFilter] = useState("all_priorities");

  const clearFilters = useCallback(() => {
    setStatusFilter("all_statuses");
    setPriorityFilter("all_priorities");
    setQuery("");
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== "all_statuses" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all_priorities" && (t.priority ?? "medium") !== priorityFilter) return false;
    return true;
  });

  return (
    <TaskPageShell>
      <TaskToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onClearFilters={clearFilters}
      />

      <div className="px-2 md:px-3">
        {error && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
            <Button variant="link" className="h-auto px-2" onClick={() => void fetchTasks()}>
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : viewMode === "board" ? (
          <TaskBoardView tasks={filteredTasks} onRefresh={() => void fetchTasks()} query={query} />
        ) : viewMode === "tiles" ? (
          <TaskTilesView tasks={filteredTasks} onRefresh={() => void fetchTasks()} query={query} />
        ) : (
          <TaskListView
            tasks={filteredTasks}
            onRefresh={() => void fetchTasks()}
            query={query}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </TaskPageShell>
  );
}
