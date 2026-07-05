"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { usePageView } from "@/hooks/use-page-view";
import { useTaskList } from "@/hooks/use-task-list";

import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskToolbar, type ViewMode } from "@/app/admin/dashboard/task/_components/task-toolbar";
import { TaskBoardView } from "@/app/admin/dashboard/task/_components/task-board-view";
import { TaskTilesView } from "@/app/admin/dashboard/task/_components/task-tiles-view";
import { TaskListView } from "@/app/admin/dashboard/task/_components/task-list-view";
import { AsyncListShell, EmptyStateShell } from "@/components/patterns";

export default function AdminTaskPage() {
  usePageView();
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

  const hasFilters =
    Boolean(query) || statusFilter !== "all_statuses" || priorityFilter !== "all_priorities";

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
        <AsyncListShell
          loading={loading}
          error={error}
          isEmpty={!loading && !error && filteredTasks.length === 0}
          onRetry={() => void fetchTasks()}
          empty={
            <EmptyStateShell
              title="No tasks match your filters"
              description={
                hasFilters
                  ? "Try clearing filters or search."
                  : "Create your first weekly note to get started."
              }
              action={
                <Button asChild size="sm">
                  <Link href="/admin/dashboard/task/new">New task</Link>
                </Button>
              }
            />
          }
        >
          {viewMode === "board" ? (
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
        </AsyncListShell>
      </div>
    </TaskPageShell>
  );
}
