"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import type { TaskPriority, TaskTag } from "@/types/tasks";
import { TAG_LABELS, PRIORITY_LABELS } from "@/types/tasks";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "text-destructive fill-destructive",
  high: "text-orange-500 fill-orange-500",
  medium: "text-yellow-500 fill-yellow-500",
  low: "text-slate-400 fill-slate-400",
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

type Task = {
  id: string;
  title: string;
  status: string;
  priority?: TaskPriority;
  tag?: TaskTag;
  assignee?: string | null;
  assignee_name?: string | null;
  assigned_team?: string | null;
  due_date?: string | null;
  updated_at: string;
  created_at: string;
  author_name?: string;
};

type Props = {
  task: Task;
  selected?: boolean;
  onSelectChange?: (id: string, selected: boolean) => void;
  showCheckbox?: boolean;
};

export function TaskCard({ task, selected, onSelectChange, showCheckbox }: Props) {
  const routeBase = useRouteBase();
  const priority = task.priority ?? "medium";
  const PriorityIcon = PRIORITY_COLORS[priority] ? Circle : Circle;
  const priorityColor = PRIORITY_COLORS[priority];
  const tag = task.tag;

  return (
    <Link
      href={getFullUrl(routeBase, `/dashboard/task/${task.id}`)}
      className={`group relative block rounded-lg border bg-background p-3 shadow-xs/5 transition-all duration-200 ease-out hover:border-border/90 hover:bg-background hover:shadow-sm ${
        selected
          ? "border-ring/40 bg-accent/50 shadow-sm ring-1 ring-inset ring-ring/30"
          : "border-border"
      }`}
    >
      {showCheckbox && (
        <div className="absolute right-2.5 top-2.5 z-10">
          <input
            type="checkbox"
            className="size-4"
            checked={!!selected}
            onChange={(e) => onSelectChange?.(task.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mb-2 pr-6">
        <div
          className="overflow-hidden break-words text-sm leading-5 font-medium text-foreground/95"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {task.title}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded border border-border/70 bg-muted/55 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Circle className={`size-2.5 ${priorityColor}`} />
          {PRIORITY_LABELS[priority]}
        </span>

        {tag && (
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag]}`}>
            {TAG_LABELS[tag]}
          </span>
        )}

        {task.due_date && (
          <span className="inline-flex items-center gap-1 rounded border border-border/70 bg-muted/55 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Calendar className="size-2.5" />
            {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {task.assignee_name || task.assignee ? (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border/30">
              {(task.assignee_name ?? task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
            </span>
          ) : (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-medium text-muted-foreground">
              ?
            </span>
          )}
          <span className="text-[11px] text-muted-foreground truncate max-w-20">
            {task.assignee_name || task.assignee || "Unassigned"}
          </span>
        </div>

        <span className="text-[10px] text-muted-foreground/70">
          {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
}
