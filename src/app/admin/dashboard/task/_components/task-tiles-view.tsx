"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import { TaskCard } from "./task-card";
import { TaskBulkActionsBar } from "./task-bulk-actions-bar";

type Props = {
  tasks: Task[];
  onRefresh: () => void;
  query: string;
};

export function TaskTilesView({ tasks, onRefresh, query }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const q = query.toLowerCase();
  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          (t.assignee_name ?? t.assignee ?? "").toLowerCase().includes(q) ||
          (t.content ?? "").toLowerCase().includes(q),
      ),
    [tasks, q],
  );

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBulkStatus = async (val: string) => {
    if (!val) return;
    const ids = Array.from(selectedIds);
    try {
      for (const id of ids) {
        await taskData.tasks.update(id, { status: val as TaskStatus });
      }
      invalidateTaskList();
      await onRefresh();
      toast.success(`Updated ${ids.length} tasks`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk update failed");
    }
  };

  const handleBulkPriority = async (val: string) => {
    if (!val) return;
    const ids = Array.from(selectedIds);
    try {
      for (const id of ids) {
        await taskData.tasks.update(id, { priority: val as TaskPriority });
      }
      invalidateTaskList();
      await onRefresh();
      toast.success(`Updated ${ids.length} tasks`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk update failed");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!window.confirm(`Delete ${ids.length} tasks?`)) return;
    try {
      for (const id of ids) {
        await taskData.tasks.delete(id);
      }
      invalidateTaskList();
      await onRefresh();
      toast.success(`Deleted ${ids.length} tasks`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <TaskBulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onBulkStatus={handleBulkStatus}
        onBulkPriority={handleBulkPriority}
        onBulkDelete={handleBulkDelete}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={selectedIds.has(task.id)}
              onSelectChange={handleSelect}
              showCheckbox={selectedIds.size > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
