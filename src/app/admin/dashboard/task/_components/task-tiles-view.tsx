"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import { TaskCard } from "./task-card";

type Props = {
  tasks: Task[];
  onRefresh: () => void;
  query: string;
};

export function TaskTilesView({ tasks, onRefresh, query }: Props) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
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
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <span className="font-medium">{selectedIds.size} selected</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear
          </Button>
          <div className="ml-auto flex gap-1">
            <Select onValueChange={handleBulkStatus}>
              <SelectTrigger className="h-7 w-[130px] text-xs">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">To do</SelectItem>
                <SelectItem value="audited">In progress</SelectItem>
                <SelectItem value="published">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleBulkPriority}>
              <SelectTrigger className="h-7 w-[130px] text-xs">
                <SelectValue placeholder="Set priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={handleBulkDelete}
            >
              <Trash2 className="size-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

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
