"use client";

import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  FileText,
  FilterX,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { useTaskList } from "@/hooks/use-task-list";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task, TaskDetail, TaskPriority, TaskStatus } from "@/types/tasks";

const ALL_STATUSES = "all_statuses";
const ALL_PRIORITIES = "all_priorities";

const STATUS_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: ALL_STATUSES, label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "audited", label: "In progress" },
  { value: "published", label: "Done" },
];

const PRIORITY_ICONS: Record<TaskPriority, { icon: typeof Circle; color: string }> = {
  urgent: { icon: Circle, color: "text-destructive fill-destructive" },
  high:   { icon: Circle, color: "text-orange-500 fill-orange-500" },
  medium: { icon: Circle, color: "text-yellow-500 fill-yellow-500" },
  low:    { icon: Circle, color: "text-slate-400 fill-slate-400" },
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

type Props = {
  heading: string;
  description: string;
  singleTaskId?: string;
};

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

function PriorityCell({ task, onUpdate }: { task: Task; onUpdate: (task: Task, priority: TaskPriority) => void }) {
  const [open, setOpen] = useState(false);
  const icons = PRIORITY_ICONS[task.priority ?? "medium"];
  const Icon = icons.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-accent"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon className={`size-3 ${icons.color}`} />
          {PRIORITY_LABELS[task.priority ?? "medium"]}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {(Object.keys(PRIORITY_ICONS) as TaskPriority[]).map((p) => {
            const pi = PRIORITY_ICONS[p];
            const PIcon = pi.icon;
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
                <PIcon className={`size-3 ${pi.color}`} />
                {PRIORITY_LABELS[p]}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="ml-0.5 text-muted-foreground hover:text-foreground">&times;</button>
    </span>
  );
}

export function TaskTableView({ heading, description, singleTaskId }: Props) {
  const routeBase = useRouteBase();
  const { isLoggedIn } = useAuth();
  const { tasks, loading, error, fetchTasks, upsertTask, removeTask } = useTaskList();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [priorityFilter, setPriorityFilter] = useState(ALL_PRIORITIES);
  const [expandedId, setExpandedId] = useState<string | null>(singleTaskId ?? null);
  const [detailTab, setDetailTab] = useState<Record<string, "notes" | "files">>({});
  const [details, setDetails] = useState<Record<string, TaskDetail>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const priorityUpdate = useCallback(
    async (task: Task, priority: TaskPriority) => {
      if (!isLoggedIn) { toast.error("Sign in to update tasks"); return; }
      try {
        const updated = await taskData.tasks.update(task.id, { priority });
        upsertTask(updated);
        invalidateTaskList();
        toast.success("Priority updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update priority");
      }
    },
    [isLoggedIn, upsertTask],
  );

  const filteredTasks = useMemo(() => {
    let scoped = singleTaskId ? tasks.filter((task) => task.id === singleTaskId) : tasks;
    if (statusFilter !== ALL_STATUSES) scoped = scoped.filter((t) => t.status === statusFilter);
    if (priorityFilter !== ALL_PRIORITIES) scoped = scoped.filter((t) => (t.priority ?? "medium") === priorityFilter);
    if (!query) return scoped;
    const q = query.toLowerCase();
    return scoped.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        (task.assignee ?? "").toLowerCase().includes(q) ||
        (task.author_name ?? "").toLowerCase().includes(q) ||
          (task.content ?? "").toLowerCase().includes(q),
    );
  }, [query, statusFilter, priorityFilter, singleTaskId, tasks]);

  const filteredTaskIds = useMemo(() => filteredTasks.map((t) => t.id), [filteredTasks]);
  const { focusedIdx, onKeyDown } = useKeyboardNav(filteredTaskIds);

  const loadDetail = useCallback(
    async (taskId: string) => {
      if (details[taskId] || loadingDetails[taskId]) return;
      setLoadingDetails((prev) => ({ ...prev, [taskId]: true }));
      try {
        const detail = await taskData.tasks.fetchById(taskId);
        setDetails((prev) => ({ ...prev, [taskId]: detail }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load task details");
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [taskId]: false }));
      }
    },
    [details, loadingDetails],
  );

  const onToggleExpand = useCallback(
    (taskId: string) => {
      setExpandedId((prev) => (prev === taskId ? null : taskId));
      void loadDetail(taskId);
      setDetailTab((prev) => ({ ...prev, [taskId]: prev[taskId] ?? "notes" }));
    },
    [loadDetail],
  );

  const onChangeStatus = useCallback(
    async (task: Task, nextStatus: TaskStatus) => {
      if (!isLoggedIn) {
        toast.error("Sign in to update tasks");
        return;
      }
      if (task.status === nextStatus) return;
      try {
        const updated =
          nextStatus === "published"
            ? await taskData.tasks.publish(task.id)
            : await taskData.tasks.update(task.id, { status: nextStatus });
        upsertTask(updated);
        setDetails((prev) => (prev[task.id] ? { ...prev, [task.id]: { ...prev[task.id], ...updated } } : prev));
        invalidateTaskList();
        toast.success("Task status updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    [isLoggedIn, upsertTask],
  );

  const onDelete = useCallback(
    async (taskId: string) => {
      if (!isLoggedIn) {
        toast.error("Sign in to delete tasks");
        return;
      }
      if (!window.confirm("Delete this task permanently?")) return;
      try {
        await taskData.tasks.delete(taskId);
        removeTask(taskId);
        setDetails((prev) => {
          const next = { ...prev };
          delete next[taskId];
          return next;
        });
        if (expandedId === taskId) setExpandedId(null);
        invalidateTaskList();
        toast.success("Task deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete task");
      }
    },
    [expandedId, isLoggedIn, removeTask],
  );

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{heading}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Input
              placeholder="Search task, assignee..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:w-64"
            />
            <Button asChild>
              <Link href={getFullUrl(routeBase, "/dashboard/task/new")}>
                <Plus className="size-4" />
                New
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ── Filter toolbar ── */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PRIORITIES}>All priorities</SelectItem>
              {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(statusFilter !== ALL_STATUSES || priorityFilter !== ALL_PRIORITIES) && (
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => { setStatusFilter(ALL_STATUSES); setPriorityFilter(ALL_PRIORITIES); }}>
              <FilterX className="size-3" />
              Clear
            </Button>
          )}
          <div className="flex flex-wrap gap-1 ml-1">
            {statusFilter !== ALL_STATUSES && <FilterChip label={`Status: ${STATUS_FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label ?? statusFilter}`} onRemove={() => setStatusFilter(ALL_STATUSES)} />}
            {priorityFilter !== ALL_PRIORITIES && <FilterChip label={`Priority: ${PRIORITY_LABELS[priorityFilter as TaskPriority] ?? priorityFilter}`} onRemove={() => setPriorityFilter(ALL_PRIORITIES)} />}
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
            <Button variant="link" className="h-auto px-2" onClick={() => void fetchTasks()}>
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No tasks found.
          </div>
        ) : (
          <>
            {/* ── Bulk action bar ── */}
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
                  <Select
                    value=""
                    onValueChange={async (val) => {
                      if (!val) return;
                      const ids = Array.from(selectedIds);
                      try {
                        for (const id of ids) {
                          await taskData.tasks.update(id, { status: val as TaskStatus });
                        }
                        invalidateTaskList();
                        await fetchTasks();
                        toast.success(`Updated ${ids.length} tasks`);
                        setSelectedIds(new Set());
                      } catch { toast.error("Bulk update failed"); }
                    }}
                  >
                    <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue placeholder="Set status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">To do</SelectItem>
                      <SelectItem value="audited">In progress</SelectItem>
                      <SelectItem value="published">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value=""
                    onValueChange={async (val) => {
                      if (!val) return;
                      const ids = Array.from(selectedIds);
                      try {
                        for (const id of ids) {
                          await taskData.tasks.update(id, { priority: val as TaskPriority });
                        }
                        invalidateTaskList();
                        await fetchTasks();
                        toast.success(`Updated ${ids.length} tasks`);
                        setSelectedIds(new Set());
                      } catch { toast.error("Bulk update failed"); }
                    }}
                  >
                    <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue placeholder="Set priority" /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                        <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={async () => {
                      if (!window.confirm(`Delete ${selectedIds.size} tasks?`)) return;
                      const ids = Array.from(selectedIds);
                      try {
                        for (const id of ids) {
                          await taskData.tasks.delete(id);
                          removeTask(id);
                        }
                        invalidateTaskList();
                        await fetchTasks();
                        toast.success(`Deleted ${ids.length} tasks`);
                        setSelectedIds(new Set());
                      } catch { toast.error("Bulk delete failed"); }
                    }}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            <div tabIndex={-1} onKeyDown={onKeyDown} className="outline-none -mx-2 overflow-x-auto sm:mx-0">
              <Table className="min-w-[40rem]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        className="size-4"
                        checked={selectedIds.size === filteredTasks.length && filteredTasks.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(new Set(filteredTasks.map((t) => t.id)));
                          else setSelectedIds(new Set());
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-10" />
                    <TableHead>Task</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Assignee</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task, idx) => {
                    const expanded = expandedId === task.id;
                    const detail = details[task.id];
                    const activeTab = detailTab[task.id] ?? "notes";
                    const isFocused = focusedIdx === idx;
                    return (
                      <Fragment key={task.id}>
                        <TableRow
                          id={`task-row-${task.id}`}
                          className={isFocused ? "bg-accent/40" : ""}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              className="size-4"
                              checked={selectedIds.has(task.id)}
                              onChange={() => {
                                setSelectedIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(task.id)) next.delete(task.id);
                                  else next.add(task.id);
                                  return next;
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => onToggleExpand(task.id)}>
                              {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="min-w-[200px]">
                            <Link
                              href={getFullUrl(routeBase, `/dashboard/task/${task.id}`)}
                              className="font-medium hover:underline"
                            >
                              {task.title}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {task.tag && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                  {task.tag}
                                </Badge>
                              )}
                              {task.due_date && (
                                <span className="text-[10px] text-muted-foreground">
                                  Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <PriorityCell task={task} onUpdate={priorityUpdate} />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={task.status}
                              onValueChange={(value) => void onChangeStatus(task, value as TaskStatus)}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">To do</SelectItem>
                                <SelectItem value="audited">In progress</SelectItem>
                                <SelectItem value="published">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                                {(task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="text-sm">{task.assignee || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={getFullUrl(routeBase, `/dashboard/task/${task.id}`)}>Open</Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => void onDelete(task.id)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {expanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/20 p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant={activeTab === "notes" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setDetailTab((prev) => ({ ...prev, [task.id]: "notes" }))}
                                  >
                                    <FileText className="size-4" />
                                    Meeting notes
                                  </Button>
                                  <Button
                                    variant={activeTab === "files" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setDetailTab((prev) => ({ ...prev, [task.id]: "files" }))}
                                  >
                                    <Paperclip className="size-4" />
                                    Files
                                    <Badge variant="secondary" className="ml-1">
                                      {detail?.attachments?.length ?? 0}
                                    </Badge>
                                  </Button>
                                  {detail?.progress !== undefined && detail.progress > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full rounded-full bg-primary" style={{ width: `${detail.progress}%` }} />
                                      </div>
                                      {detail.progress}%
                                    </div>
                                  )}
                                </div>

                                {loadingDetails[task.id] ? (
                                  <Skeleton className="h-20 w-full" />
                                ) : activeTab === "notes" ? (
                                  <div className="space-y-3">
                                    <div className="rounded-md border bg-background p-3 text-sm">
                                      {detail?.notes?.trim() || "No meeting notes yet."}
                                    </div>
                                    {detail?.checklist && detail.checklist.length > 0 && (
                                      <div className="rounded-md border bg-background p-3">
                                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                          Sub-tasks ({detail.checklist.length})
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                          {detail.checklist.map((item) => {
                                            const done = item.checked || item.status === "done";
                                            return (
                                              <li key={item.id} className="flex items-start gap-2">
                                                <span className="mt-0.5 text-muted-foreground">{done ? "☑" : "☐"}</span>
                                                <div>
                                                  <div className={done ? "line-through text-muted-foreground" : ""}>
                                                    {item.title || item.text}
                                                  </div>
                                                  {item.assignee_name && (
                                                    <div className="text-xs text-muted-foreground">{item.assignee_name}</div>
                                                  )}
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="rounded-md border bg-background p-3">
                                    {detail?.attachments && detail.attachments.length > 0 ? (
                                      <ul className="space-y-1 text-sm">
                                        {detail.attachments.map((file) => (
                                          <li key={file.id}>
                                            <a href={file.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                              {file.file_name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No files uploaded.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
