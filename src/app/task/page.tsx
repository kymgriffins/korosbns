"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
import {
  Calendar,
  CheckCircle2,
  Circle,
  CircleDot,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Skeleton } from "@/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import type { Task, TaskStatus, TaskColumn } from "@/types/tasks";
import { useAuth } from "@/contexts/auth-context";

const COLUMN_CONFIG: Record<TaskStatus, { title: string; icon: any; color: string }> = {
  draft: { title: "To Do", icon: Circle, color: "border-t-amber-500" },
  audited: { title: "In Progress", icon: CircleDot, color: "border-t-blue-500" },
  published: { title: "Done", icon: CheckCircle2, color: "border-t-emerald-500" },
};

const COLUMNS: TaskStatus[] = ["draft", "audited", "published"];

function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
  canManage,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  canManage: boolean;
}) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-lg border bg-card p-3 shadow-xs transition-all hover:shadow-sm ${
        isDragging || isSortDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="flex-1 text-sm font-medium leading-tight">{task.title}</h4>
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs" className="-mr-1.5 -mt-1 shrink-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {task.content && (
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{task.content}</p>
      )}

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3" />
          {task.author_name}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {format(new Date(task.created_at), "MMM d")}
        </span>
      </div>
    </div>
  );
}

function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function TaskPage() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.list();
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
        search ? t.title.toLowerCase().includes(search.toLowerCase()) || (t.content ?? "").toLowerCase().includes(search.toLowerCase()) : true,
      ),
    [tasks, search],
  );

  const columns: TaskColumn[] = useMemo(
    () =>
      COLUMNS.map((status) => ({
        id: status,
        title: COLUMN_CONFIG[status].title,
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

    // Determine target status from the column the item was dropped on
    const overColumn = columns.find((c) => c.id === overId || c.items.some((i) => i.id === overId));
    if (!overColumn || overColumn.id === activeTask_.status) return;

    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === activeId ? { ...t, status: overColumn.id } : t)));

    try {
      if (overColumn.id === "published") {
        await taskApi.publish(activeId);
      } else if (overColumn.id === "audited") {
        await taskApi.audit(activeId, "approved", "Moved to in progress");
      } else {
        // Revert — you can't go back via API, so we'd just re-fetch
        await fetchTasks();
        return;
      }
      toast.success(`Moved to ${overColumn.title}`);
    } catch {
      toast.error("Failed to update task status");
      fetchTasks();
    }
  }

  function openCreate() {
    if (!isLoggedIn) {
      toast.error("Sign in to create tasks");
      return;
    }
    setFormMode("create");
    setFormTitle("");
    setFormContent("");
    setDialogOpen(true);
  }

  async function openEdit(task: Task) {
    if (!isLoggedIn) {
      toast.error("Sign in to edit tasks");
      return;
    }
    setFormMode("edit");
    setSelectedTask(task);
    setFormTitle(task.title);
    setFormContent(task.content ?? "");
    // Fetch full detail to get content if not present in list
    if (!task.content) {
      try {
        const detail = await taskApi.get(task.id);
        setFormContent(detail.content ?? "");
        setSelectedTask(detail);
      } catch {
        // Fall back to list data
      }
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (formMode === "create") {
        const created = await taskApi.create({
          week_label: format(new Date(), "'Week' w 'of' MMM yyyy"),
          title: formTitle.trim(),
          content: formContent.trim(),
        });
        setTasks((prev) => [...prev, created]);
        toast.success("Task created");
      } else if (selectedTask) {
        const updated = await taskApi.update(selectedTask.id, {
          title: formTitle.trim(),
          content: formContent.trim(),
        });
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Task updated");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((c) => (
            <Card key={c}>
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
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} across {COLUMNS.length} stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-56 pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          {isLoggedIn ? (
            <Button onClick={openCreate}>
              <Plus className="mr-1.5 size-4" />
              New Task
            </Button>
          ) : (
            <Button asChild variant="outline">
              <a href={`/auth/login?next=${encodeURIComponent(pathname)}`}>Sign in to manage</a>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
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
            const config = COLUMN_CONFIG[column.id];
            const Icon = config.icon;
            return (
              <Card key={column.id} className={`border-t-2 ${config.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">
                      {column.items.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="min-h-[200px]">
                  <SortableContext
                    items={column.items.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {column.items.length === 0 && (
                        <p className="py-8 text-center text-xs text-muted-foreground">No tasks</p>
                      )}
                      {column.items.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                          canManage={isLoggedIn}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="w-80 opacity-90">
              <TaskCard task={activeTask} onEdit={openEdit} onDelete={handleDelete} isDragging canManage={isLoggedIn} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "New Task" : "Edit Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-content">Description</Label>
              <Textarea
                id="task-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Add details, requirements, or notes..."
                rows={8}
                className="min-h-[200px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Supports markdown formatting
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {formMode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
