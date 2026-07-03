"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskPriority, TaskStatus } from "@/types/tasks";

export function TaskRowMobileMeta({
  task,
  onChangeStatus,
  PriorityCell,
  onPriorityUpdate,
}: {
  task: Task;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
  PriorityCell: React.ComponentType<{
    task: Task;
    onUpdate: (task: Task, priority: TaskPriority) => void;
  }>;
  onPriorityUpdate: (task: Task, priority: TaskPriority) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 lg:hidden">
      <PriorityCell task={task} onUpdate={onPriorityUpdate} />
      <Select
        value={task.status}
        onValueChange={(value) => void onChangeStatus(task, value as TaskStatus)}
      >
        <SelectTrigger className="h-7 w-[7.5rem] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">To do</SelectItem>
          <SelectItem value="audited">In progress</SelectItem>
          <SelectItem value="published">Done</SelectItem>
        </SelectContent>
      </Select>
      <span className="inline-flex max-w-[8rem] items-center gap-1.5 text-xs text-muted-foreground">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/30 bg-muted text-[10px] font-medium">
          {(task.assignee_name ?? task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
        </span>
        <span className="truncate">{task.assignee_name || task.assignee || "Unassigned"}</span>
      </span>
      <span className="text-[10px] text-muted-foreground sm:hidden">
        {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
      </span>
    </div>
  );
}
