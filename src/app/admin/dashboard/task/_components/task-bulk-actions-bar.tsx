"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskPriority } from "@/types/tasks";
import { PRIORITY_LABELS } from "@/types/tasks";

export function TaskBulkActionsBar({
  count,
  onClear,
  onBulkStatus,
  onBulkPriority,
  onBulkDelete,
}: {
  count: number;
  onClear: () => void;
  onBulkStatus: (status: string) => void;
  onBulkPriority: (priority: string) => void;
  onBulkDelete: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <span className="font-medium">{count} selected</span>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1 sm:ml-auto">
        <Select onValueChange={onBulkStatus}>
          <SelectTrigger className="h-7 w-full min-w-[7.5rem] max-w-[9rem] text-xs sm:w-[7.5rem]">
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">To do</SelectItem>
            <SelectItem value="audited">In progress</SelectItem>
            <SelectItem value="published">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onBulkPriority}>
          <SelectTrigger className="h-7 w-full min-w-[7.5rem] max-w-[9rem] text-xs sm:w-[7.5rem]">
            <SelectValue placeholder="Set priority" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <SelectItem key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={onBulkDelete}>
          <Trash2 className="mr-1 size-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
