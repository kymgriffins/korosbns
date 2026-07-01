"use client";

import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import {
  Calendar, CalendarDays, User, Users, Hash, MoreHorizontal,
  Pencil, Trash2,
} from "lucide-react";
import type { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { safeFormat, STATUS_STYLES_CARD } from "@/components/tasks/task-constants";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  canManage: boolean;
  basePath?: string;
}

export function TaskCard({ task, onDelete, isDragging, canManage, basePath = "/task" }: TaskCardProps) {
  const router = useRouter();
  const {
    attributes, listeners, setNodeRef, transform, transition,
    isDragging: isSortDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const statusStyle = STATUS_STYLES_CARD[task.status] ?? STATUS_STYLES_CARD.draft;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(`${basePath}/${task.id}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`${basePath}/${task.id}`); }}
      role="button"
      tabIndex={0}
      className={`group rounded-xl border border-border/60 bg-card p-3.5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        isDragging || isSortDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: statusStyle.bg }}
            />
            <span className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: statusStyle.text }}>
              {task.status}
            </span>
            {task.due_label && (
              <span className="text-[9px] text-muted-foreground truncate">
                · {task.due_label}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold leading-snug truncate">{task.title}</h4>
          {task.week_label && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{task.week_label}</p>
          )}
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon-xs" className="-mr-1.5 -mt-1 shrink-0 opacity-0 group-hover:opacity-100" aria-label="Task actions">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36" onClick={(e) => e.stopPropagation()}>
              {task.status !== "published" && (
                <DropdownMenuItem onSelect={() => router.push(`${basePath}/${task.id}`)}>
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => router.push(`${basePath}/${task.id}`)}>
                <Pencil className="mr-2 size-3.5" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onDelete(task.id)}
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {task.content && (
        <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
          {task.content}
        </p>
      )}

      {(task.priority || task.tag) && (
        <div className="mt-2 flex flex-wrap gap-1.5 items-center">
          {task.priority && (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              task.priority === "urgent" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              task.priority === "high" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
              task.priority === "medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
              "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            }`}>
              {task.priority}
            </span>
          )}
          {task.tag && (
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
              #{task.tag}
            </span>
          )}
        </div>
      )}

      {task.progress !== undefined && task.progress > 0 && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[9px] text-muted-foreground font-medium">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3" />
          {task.author_name}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {safeFormat(task.created_at, "MMM d")}
        </span>
        {task.due_date && (
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {safeFormat(task.due_date, "MMM d")}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="size-3" />
          {task.assignee ? task.assignee : <span className="italic text-[9px] text-muted-foreground/60">Unassigned</span>}
        </span>
        {task.section_count != null && (
          <span className="flex items-center gap-1">
            <Hash className="size-3" />
            {task.section_count}
          </span>
        )}
      </div>
    </div>
  );
}
