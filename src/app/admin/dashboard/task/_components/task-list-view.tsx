"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Circle,
  FilterX,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task, TaskPriority, TaskStatus, TaskTag } from "@/types/tasks";
import { TAG_LABELS, PRIORITY_LABELS } from "@/types/tasks";
import { TaskBulkActionsBar } from "./task-bulk-actions-bar";
import { TaskRowMobileMeta } from "./task-row-mobile-meta";

const PRIORITY_ICONS: Record<TaskPriority, { color: string }> = {
  urgent: { color: "text-destructive fill-destructive" },
  high: { color: "text-orange-500 fill-orange-500" },
  medium: { color: "text-yellow-500 fill-yellow-500" },
  low: { color: "text-slate-400 fill-slate-400" },
};

const TAG_COLORS: Record<TaskTag, string> = {
  feature: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  bug: "bg-red-500/10 text-red-700 dark:text-red-300",
  improvement: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  research: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  documentation: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  design: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  testing: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  devops: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  meeting: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  review: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "draft", label: "To do" },
  { value: "audited", label: "In progress" },
  { value: "published", label: "Done" },
];

type Props = {
  tasks: Task[];
  onRefresh: () => void;
  query: string;
  statusFilter: string;
  priorityFilter: string;
  onStatusFilterChange: (v: string) => void;
  onPriorityFilterChange: (v: string) => void;
  onClearFilters: () => void;
};

function PriorityCell({ task, onUpdate }: { task: Task; onUpdate: (task: Task, priority: TaskPriority) => void }) {
  const [open, setOpen] = useState(false);
  const icons = PRIORITY_ICONS[task.priority ?? "medium"];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-accent"
          onClick={(e) => e.stopPropagation()}
        >
          <Circle className={`size-3 ${icons.color}`} />
          {PRIORITY_LABELS[task.priority ?? "medium"]}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {(Object.keys(PRIORITY_ICONS) as TaskPriority[]).map((p) => {
            const pi = PRIORITY_ICONS[p];
            return (
              <button
                key={p}
                className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent ${
                  (task.priority ?? "medium") === p ? "bg-accent" : ""
                }`}
                onClick={() => {
                  onUpdate(task, p);
                  setOpen(false);
                }}
              >
                <Circle className={`size-3 ${pi.color}`} />
                {PRIORITY_LABELS[p]}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function useKeyboardNav(taskIds: string[]) {
  const router = useRouter();
  const routeBase = useRouteBase();
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (taskIds.length === 0) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;

      if (e.key === "j" || (e.key === "ArrowDown" && e.shiftKey)) {
        e.preventDefault();
        setFocusedIdx((prev) => {
          const next = prev < taskIds.length - 1 ? prev + 1 : 0;
          document.getElementById(`task-row-${taskIds[next]}`)?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === "k" || (e.key === "ArrowUp" && e.shiftKey)) {
        e.preventDefault();
        setFocusedIdx((prev) => {
          const next = prev > 0 ? prev - 1 : taskIds.length - 1;
          document.getElementById(`task-row-${taskIds[next]}`)?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === "Enter" && focusedIdx >= 0 && focusedIdx < taskIds.length) {
        e.preventDefault();
        router.push(getFullUrl(routeBase, `/dashboard/task/${taskIds[focusedIdx]}`));
      }
    },
    [taskIds, focusedIdx, router, routeBase],
  );

  return { focusedIdx, onKeyDown };
}

export function TaskListView({
  tasks,
  onRefresh,
  query,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onClearFilters,
}: Props) {
  const routeBase = useRouteBase();
  const { isLoggedIn } = useAuth();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const q = query.toLowerCase();
  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          (t.assignee_name ?? t.assignee ?? "").toLowerCase().includes(q) ||
          (t.author_name ?? "").toLowerCase().includes(q) ||
          (t.content ?? "").toLowerCase().includes(q),
      ),
    [tasks, q],
  );

  const filteredTaskIds = useMemo(() => filtered.map((t) => t.id), [filtered]);
  const { focusedIdx, onKeyDown } = useKeyboardNav(filteredTaskIds);

  const priorityUpdate = useCallback(
    async (task: Task, priority: TaskPriority) => {
      if (!isLoggedIn) { toast.error("Sign in to update tasks"); return; }
      try {
        const updated = await taskData.tasks.update(task.id, { priority });
        onRefresh();
        invalidateTaskList();
        toast.success("Priority updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update priority");
      }
    },
    [isLoggedIn, onRefresh],
  );

  const onChangeStatus = useCallback(
    async (task: Task, nextStatus: TaskStatus) => {
      if (!isLoggedIn) { toast.error("Sign in to update tasks"); return; }
      if (task.status === nextStatus) return;
      try {
        const updated =
          nextStatus === "published"
            ? await taskData.tasks.publish(task.id)
            : await taskData.tasks.update(task.id, { status: nextStatus });
        onRefresh();
        invalidateTaskList();
        toast.success("Task status updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    [isLoggedIn, onRefresh],
  );

  const onDelete = useCallback(
    async (taskId: string) => {
      if (!isLoggedIn) { toast.error("Sign in to delete tasks"); return; }
      if (!window.confirm("Delete this task permanently?")) return;
      try {
        await taskData.tasks.delete(taskId);
        onRefresh();
        invalidateTaskList();
        toast.success("Task deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete task");
      }
    },
    [isLoggedIn, onRefresh],
  );

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="space-y-4">
      {(statusFilter !== "all_statuses" || priorityFilter !== "all_priorities") && (
        <div className="flex items-center gap-1.5">
          {statusFilter !== "all_statuses" && (
            <span className="inline-flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs">
              <span className="px-2 font-medium text-foreground">Status: {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? statusFilter}</span>
              <span className="h-full w-px bg-border" />
              <button className="inline-flex h-full w-7 items-center justify-center rounded-r-md text-foreground/70 hover:bg-accent/70 hover:text-foreground" onClick={() => onStatusFilterChange("all_statuses")}>
                <Trash2 className="size-3" />
              </button>
            </span>
          )}
          {priorityFilter !== "all_priorities" && (
            <span className="inline-flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs">
              <span className="px-2 font-medium text-foreground">Priority: {PRIORITY_LABELS[priorityFilter as TaskPriority] ?? priorityFilter}</span>
              <span className="h-full w-px bg-border" />
              <button className="inline-flex h-full w-7 items-center justify-center rounded-r-md text-foreground/70 hover:bg-accent/70 hover:text-foreground" onClick={() => onPriorityFilterChange("all_priorities")}>
                <Trash2 className="size-3" />
              </button>
            </span>
          )}
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={onClearFilters}>
            <FilterX className="size-3" />
            Clear
          </Button>
        </div>
      )}

      <TaskBulkActionsBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onBulkStatus={async (val) => {
          if (!val) return;
          const ids = Array.from(selectedIds);
          try {
            for (const id of ids) await taskData.tasks.update(id, { status: val as TaskStatus });
            invalidateTaskList();
            await onRefresh();
            toast.success(`Updated ${ids.length} tasks`);
            setSelectedIds(new Set());
          } catch {
            toast.error("Bulk update failed");
          }
        }}
        onBulkPriority={async (val) => {
          if (!val) return;
          const ids = Array.from(selectedIds);
          try {
            for (const id of ids) await taskData.tasks.update(id, { priority: val as TaskPriority });
            invalidateTaskList();
            await onRefresh();
            toast.success(`Updated ${ids.length} tasks`);
            setSelectedIds(new Set());
          } catch {
            toast.error("Bulk update failed");
          }
        }}
        onBulkDelete={async () => {
          const ids = Array.from(selectedIds);
          if (!window.confirm(`Delete ${ids.length} tasks?`)) return;
          try {
            for (const id of ids) await taskData.tasks.delete(id);
            invalidateTaskList();
            await onRefresh();
            toast.success(`Deleted ${ids.length} tasks`);
            setSelectedIds(new Set());
          } catch {
            toast.error("Bulk delete failed");
          }
        }}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        <div tabIndex={-1} onKeyDown={onKeyDown} className="outline-none rounded-lg border">
          <div className="flex items-center gap-3 border-b border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground sm:px-4">
            <div className="flex w-8 items-center">
              <input
                type="checkbox"
                className="size-4"
                checked={allSelected}
                onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(filtered.map((t) => t.id)));
                  else setSelectedIds(new Set());
                }}
              />
            </div>
            <div className="flex-1 min-w-0">Task</div>
            <div className="w-24 shrink-0 hidden sm:block">Priority</div>
            <div className="w-28 shrink-0 hidden md:block">Status</div>
            <div className="w-20 shrink-0 hidden lg:block">Assignee</div>
            <div className="w-20 shrink-0 hidden lg:block">Updated</div>
            <div className="w-16 shrink-0 text-right sm:w-20">Actions</div>
          </div>

          {filtered.map((task, idx) => {
            const isFocused = focusedIdx === idx;
            const isSelected = selectedIds.has(task.id);
            return (
              <div
                key={task.id}
                id={`task-row-${task.id}`}
                className={`group relative flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border/50 px-3 py-2.5 transition-colors last:border-b-0 sm:flex-nowrap sm:px-4 ${
                  isSelected ? "bg-accent/45" : "hover:bg-accent/60"
                } ${isFocused ? "ring-2 ring-inset ring-ring/50" : ""}`}
              >
                <div className="flex w-8 shrink-0 items-center">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(task.id)) next.delete(task.id);
                        else next.add(task.id);
                        return next;
                      });
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={getFullUrl(routeBase, `/dashboard/task/${task.id}`)}
                    className="text-sm text-foreground font-medium hover:underline truncate block"
                  >
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {task.tag && (
                      <span className={`inline-flex items-center rounded px-1 py-0 text-[10px] font-medium ${TAG_COLORS[task.tag]}`}>
                        {TAG_LABELS[task.tag]}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="size-2.5" />
                        {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <TaskRowMobileMeta
                    task={task}
                    onChangeStatus={onChangeStatus}
                    PriorityCell={PriorityCell}
                    onPriorityUpdate={priorityUpdate}
                  />
                </div>

                <div className="w-24 shrink-0 hidden sm:block">
                  <PriorityCell task={task} onUpdate={priorityUpdate} />
                </div>

                <div className="w-28 shrink-0 hidden md:block">
                  <Select
                    value={task.status}
                    onValueChange={(value) => void onChangeStatus(task, value as TaskStatus)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">To do</SelectItem>
                      <SelectItem value="audited">In progress</SelectItem>
                      <SelectItem value="published">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-20 shrink-0 hidden lg:flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border/30">
                    {(task.assignee_name ?? task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-12">
                    {task.assignee_name || task.assignee || "-"}
                  </span>
                </div>

                <div className="w-24 shrink-0 hidden lg:block text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
                </div>

                <div className="ml-auto w-auto shrink-0 text-right sm:ml-0 sm:w-16 md:w-20">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs max-sm:size-7 max-sm:p-0" asChild>
                      <Link href={getFullUrl(routeBase, `/dashboard/task/${task.id}`)}>
                        <span className="max-sm:sr-only">Open</span>
                        <span className="sm:hidden" aria-hidden>→</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => void onDelete(task.id)}>
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
