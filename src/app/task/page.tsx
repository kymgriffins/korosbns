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
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  Hash,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
  Pencil,
  Palette,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
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
import type { Task, TaskStatus, TaskColumn, TaskCreatePayload } from "@/types/tasks";
import { useAuth } from "@/contexts/auth-context";

const COLUMNS: TaskStatus[] = ["draft", "audited", "published"];

const COLUMN_META: Record<TaskStatus, { title: string; icon: any; color: string }> = {
  draft: { title: "To Do", icon: Circle, color: "border-t-amber-500" },
  audited: { title: "In Progress", icon: CircleDot, color: "border-t-blue-500" },
  published: { title: "Done", icon: CheckCircle2, color: "border-t-emerald-500" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#f59e0b", text: "#f59e0b" },
  audited: { bg: "#3b82f6", text: "#3b82f6" },
  published: { bg: "#10b981", text: "#10b981" },
};

function defaultCreatePayload(): TaskCreatePayload {
  return {
    week_label: format(new Date(), "'Week' w 'of' MMM yyyy"),
    title: "",
    content: "",
    status: "draft",
    due_date: null,
    assignee: null,
    assignee_name: null,
    assigned_team: null,
    hue: undefined,
    due_label: undefined,
  };
}

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

  const statusStyle = STATUS_STYLES[task.status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-3.5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/20 ${
        isDragging || isSortDragging ? "opacity-50 shadow-lg" : ""
      } ${task.hue ? "" : ""}`}
    >
      {task.hue && (
        <div className="absolute inset-0 rounded-xl opacity-[0.04] pointer-events-none"
          style={{ backgroundColor: task.hue }}
        />
      )}

      <div className="flex items-start justify-between gap-2 relative">
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
          {format(new Date(task.created_at), "MMM d")}
        </span>
        {task.due_date && (
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {format(new Date(task.due_date), "MMM d")}
          </span>
        )}
        {task.assignee_name && (
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {task.assignee_name}
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

export default function TaskPage() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TaskCreatePayload>(defaultCreatePayload());

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
        search
          ? t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.content ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (t.assignee_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
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

    setTasks((prev) => prev.map((t) => (t.id === activeId ? { ...t, status: overColumn.id } : t)));

    try {
      if (overColumn.id === "published") {
        await taskApi.publish(activeId);
      } else if (overColumn.id === "audited") {
        await taskApi.audit(activeId, "approved", "Moved to in progress");
      } else {
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
    setEditingTask(null);
    setForm(defaultCreatePayload());
    setDialogOpen(true);
  }

  async function openEdit(task: Task) {
    if (!isLoggedIn) {
      toast.error("Sign in to edit tasks");
      return;
    }
    setEditingTask(task);
    setForm({
      week_label: task.week_label,
      title: task.title,
      content: task.content ?? "",
      status: task.status,
      due_date: task.due_date ?? null,
      assignee: task.assignee ?? null,
      assignee_name: task.assignee_name ?? null,
      assigned_team: task.assigned_team ?? null,
      hue: task.hue ?? null,
      due_label: task.due_label ?? null,
    });
    if (!task.content) {
      try {
        const detail = await taskApi.get(task.id);
        setForm((prev) => ({
          ...prev,
          content: detail.content,
        }));
      } catch {
        // fall back to list data
      }
    }
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingTask) {
        const updated = await taskApi.update(editingTask.id, form);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Task updated");
      } else {
        const created = await taskApi.create(form);
        setTasks((prev) => [...prev, created]);
        toast.success("Task created");
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

  function updateField<K extends keyof TaskCreatePayload>(key: K, value: TaskCreatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((c) => (
            <Card key={c}
              className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
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
    <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount} task{totalCount !== 1 ? "s" : ""} across {COLUMNS.length} stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-56 pl-8 rounded-lg bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className={`border-border/60 bg-card/80 backdrop-blur-sm shadow-sm border-t-2 ${meta.color} flex flex-col`}
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
                <CardContent className="p-3 pt-0 overflow-hidden flex-1">
                  <SortableContext
                    items={column.items.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1
                      scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                      {column.items.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                          <p className="text-xs">No tasks</p>
                        </div>
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
            <div className="w-72 opacity-90">
              <TaskCard task={activeTask} onEdit={openEdit} onDelete={handleDelete} isDragging canManage={isLoggedIn} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">

            <div className="space-y-2">
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="What needs to be done?"
                className="rounded-lg bg-background text-sm"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-week-label">Week Label</Label>
                <Input
                  id="task-week-label"
                  value={form.week_label}
                  onChange={(e) => updateField("week_label", e.target.value)}
                  className="rounded-lg bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={form.status ?? "draft"}
                  onValueChange={(v: TaskStatus) => updateField("status", v)}
                >
                  <SelectTrigger id="task-status" className="rounded-lg bg-background text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="audited">Audited</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-content">Description</Label>
              <Textarea
                id="task-content"
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Add details, requirements, or notes..."
                rows={6}
                className="min-h-[120px] resize-y rounded-lg bg-background text-sm"
              />
              <p className="text-xs text-muted-foreground">Supports markdown formatting</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={form.due_date ?? ""}
                  onChange={(e) => updateField("due_date", e.target.value || null)}
                  className="rounded-lg bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-label">Due Label</Label>
                <Input
                  id="task-due-label"
                  value={form.due_label ?? ""}
                  onChange={(e) => updateField("due_label", e.target.value || null)}
                  placeholder="e.g. End of sprint"
                  className="rounded-lg bg-background text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assignee (email)</Label>
                <Input
                  id="task-assignee"
                  value={form.assignee ?? ""}
                  onChange={(e) => updateField("assignee", e.target.value || null)}
                  placeholder="user@example.com"
                  className="rounded-lg bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-assignee-name">Assignee Name</Label>
                <Input
                  id="task-assignee-name"
                  value={form.assignee_name ?? ""}
                  onChange={(e) => updateField("assignee_name", e.target.value || null)}
                  placeholder="Display name"
                  className="rounded-lg bg-background text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-assigned-team">Assigned Team</Label>
                <Input
                  id="task-assigned-team"
                  value={form.assigned_team ?? ""}
                  onChange={(e) => updateField("assigned_team", e.target.value || null)}
                  placeholder="Team slug or ID"
                  className="rounded-lg bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-hue" className="flex items-center gap-1.5">
                  <Palette className="size-3.5" />
                  Hue / Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="task-hue"
                    value={form.hue ?? ""}
                    onChange={(e) => updateField("hue", e.target.value || null)}
                    placeholder="#ff6b35"
                    className="rounded-lg bg-background text-sm font-mono flex-1"
                  />
                  {form.hue && (
                    <div
                      className="size-9 rounded-lg border shrink-0"
                      style={{ backgroundColor: form.hue }}
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
