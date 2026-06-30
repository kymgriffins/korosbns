"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { format } from "date-fns";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  Download,
  FileText,
  Hash,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X,
  Pencil,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { usePageView } from "@/hooks/use-page-view";
import { taskData } from "@/data/tasks";
import { taskApi } from "@/lib/task-api";
import { useAuth } from "@/contexts/auth-context";
import type { Task, TaskStatus, TaskColumn } from "@/types/tasks";

import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { AdminTaskBreadcrumbs } from "@/components/admin/admin-task-breadcrumb";

const COLUMNS: TaskStatus[] = ["draft", "audited", "published"];

const COLUMN_META: Record<TaskStatus, { title: string; icon: LucideIcon; color: string }> = {
  draft: { title: "Undone", icon: Circle, color: "border-t-amber-500" },
  audited: { title: "In Progress", icon: CircleDot, color: "border-t-blue-500" },
  published: { title: "Done", icon: CheckCircle2, color: "border-t-emerald-500" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#f59e0b", text: "#f59e0b" },
  audited: { bg: "#3b82f6", text: "#3b82f6" },
  published: { bg: "#10b981", text: "#10b981" },
};

function safeFormat(date: string | Date | null | undefined, fmt: string): string {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return format(d, fmt);
  } catch {
    return "";
  }
}

function TaskCard({
  task,
  onDelete,
  isDragging,
  canManage,
}: {
  task: Task;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  canManage: boolean;
}) {
  const router = useRouter();
  const routeBase = useRouteBase();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const statusStyle = STATUS_STYLES[task.status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(getFullUrl(routeBase, `/dashboard/task/${task.id}`))}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(getFullUrl(routeBase, `/dashboard/task/${task.id}`)); }}
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
                <DropdownMenuItem onSelect={() => router.push(getFullUrl(routeBase, `/dashboard/task/${task.id}`))}>
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => router.push(getFullUrl(routeBase, `/dashboard/task/${task.id}`))}>
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
        {task.assignee && (
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {task.assignee}
          </span>
        )}
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

function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminTaskPage() {
  usePageView();
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const routeBase = useRouteBase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskData.tasks.fetch();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        search
          ? t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.content ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (t.assignee ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (t.team_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (t.author_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (t.week_label ?? "").toLowerCase().includes(search.toLowerCase())
          : true,
      ),
    [tasks, search],
  );

  const columns: TaskColumn[] = useMemo(
    () =>
      COLUMNS.map((status) => ({
        id: status,
        title: COLUMN_META[status].title,
        items: filteredTasks.filter((t) => t.status === status),
      })),
    [filteredTasks],
  );

  function getTaskById(id: string) {
    return tasks.find((t) => t.id === id) ?? null;
  }

  function handleDragStart(event: DragStartEvent) {
    const task = getTaskById(String(event.active.id));
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    if (!isLoggedIn) {
      toast.error("Sign in to move tasks");
      return;
    }
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask_ = getTaskById(activeId);
    if (!activeTask_) return;

    const overColumn = columns.find((c) => c.id === overId || c.items.some((i) => i.id === overId));
    if (!overColumn || overColumn.id === activeTask_.status) return;

    if (activeTask_.status === "published") {
      toast.error("Done tasks cannot be moved");
      fetchTasks();
      return;
    }

    setTasks((prev) => prev.map((t) => (t.id === activeId ? { ...t, status: overColumn.id } : t)));

    try {
      if (overColumn.id === "published") {
        await taskApi.publish(activeId);
      } else if (overColumn.id === "audited") {
        await taskApi.audit(activeId, "approved", "Moved to in progress");
      } else {
        await taskApi.update(activeId, { status: "draft" });
      }
      toast.success(`Moved to ${overColumn.title}`);
    } catch {
      toast.error("Failed to update task status");
      fetchTasks();
    }
  }

  async function handleDelete(id: string) {
    if (!isLoggedIn) {
      toast.error("Sign in to delete tasks");
      return;
    }
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  }

  const exportTasks = useCallback((format: "csv" | "json" | "markdown") => {
    const cols = ["id","title","status","assignee","priority","due_date","tags","team","progress"];
    const rows = tasks.map(t => cols.map(c => String((t as Record<string, unknown>)[c] ?? "")).join(","));
    const csvContent = cols.join(",") + "\n" + rows.join("\n");
    const filename = `tasks-${new Date().toISOString().slice(0, 10)}`;
    if (format === "csv") {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filename}.json`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const md = tasks.map(t =>
        `- **${t.title}** (${t.status}) — ${t.assignee ?? "unassigned"}${t.priority ? ` [${t.priority}]` : ""}`
      ).join("\n");
      const blob = new Blob([`# Tasks Export — ${new Date().toISOString().slice(0, 10)}\n\n${md}`], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filename}.md`; a.click();
      URL.revokeObjectURL(url);
    }
    toast.success(`Exported ${tasks.length} tasks as ${format.toUpperCase()}`);
  }, [tasks]);

  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <AdminTaskBreadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((c) => (
            <Card key={c}
              className="border-border/60 bg-card shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <ColumnSkeleton />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-6 md:gap-8">
      <AdminTaskBreadcrumbs />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount} task{totalCount !== 1 ? "s" : ""} across {COLUMNS.length} stages
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-full sm:w-64 pl-8 rounded-lg bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSearch(""); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default">
                <Download className="mr-1.5 size-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => exportTasks("csv")}>
                <FileText className="mr-2 size-4" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportTasks("json")}>
                <Hash className="mr-2 size-4" />
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportTasks("markdown")}>
                <FileText className="mr-2 size-4" />
                Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isLoggedIn ? (
            <Link href={getFullUrl(routeBase, "/dashboard/task/new")} className="shrink-0">
              <Button size="default" className="w-full sm:w-auto">
                <Plus className="mr-1.5 size-4" />
                New Task
              </Button>
            </Link>
          ) : (
            <Button asChild variant="outline">
              <a href={`/budgethub/auth/login?next=${encodeURIComponent(pathname)}`}>Sign in to manage</a>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button variant="ghost" size="xs" onClick={fetchTasks} className="ml-3">
            Retry
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const meta = COLUMN_META[column.id];
            const Icon = meta.icon;
            return (
              <Card
                key={column.id}
                className={`border-border/60 bg-card shadow-sm border-t-2 ${meta.color} flex flex-col`}
              >
                <CardHeader className="pb-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-medium tabular-nums rounded-full px-2 py-0.5">
                      {column.items.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 overflow-hidden flex-1 flex flex-col">
                  <SortableContext
                    items={column.items.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1
                      scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent flex-1">
                      {column.items.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                          <p className="text-xs">No tasks</p>
                        </div>
                      )}
                      {column.items.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={(id) => setDeleteConfirmId(id)}
                          canManage={isLoggedIn}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  {isLoggedIn && (
                    <Link
                      href={getFullUrl(routeBase, "/dashboard/task/new")}
                      className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/50 py-2 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      <Plus className="size-3.5" />
                      Add Task
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="w-72 opacity-90">
              <TaskCard task={activeTask} onDelete={(id) => setDeleteConfirmId(id)} isDragging canManage={isLoggedIn} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) handleDelete(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
