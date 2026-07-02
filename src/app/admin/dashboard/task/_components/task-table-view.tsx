"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, FileText, Paperclip, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { taskData } from "@/data/tasks";
import { useTaskList } from "@/hooks/use-task-list";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import { invalidateTaskList } from "@/lib/task-events";
import type { Task, TaskDetail, TaskStatus } from "@/types/tasks";

type Props = {
  heading: string;
  description: string;
  singleTaskId?: string;
};

export function TaskTableView({ heading, description, singleTaskId }: Props) {
  const routeBase = useRouteBase();
  const { isLoggedIn } = useAuth();
  const { tasks, loading, error, fetchTasks, upsertTask, removeTask } = useTaskList();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(singleTaskId ?? null);
  const [detailTab, setDetailTab] = useState<Record<string, "notes" | "files">>({});
  const [details, setDetails] = useState<Record<string, TaskDetail>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});

  const filteredTasks = useMemo(() => {
    const scoped = singleTaskId ? tasks.filter((task) => task.id === singleTaskId) : tasks;
    if (!query) return scoped;
    const q = query.toLowerCase();
    return scoped.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        (task.assignee ?? "").toLowerCase().includes(q) ||
        (task.author_name ?? "").toLowerCase().includes(q) ||
          (task.content ?? "").toLowerCase().includes(q),
    );
  }, [query, singleTaskId, tasks]);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Assignee</TableHead>
                <TableHead className="hidden lg:table-cell">Updated</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const expanded = expandedId === task.id;
                const detail = details[task.id];
                const activeTab = detailTab[task.id] ?? "notes";
                return (
                  <Fragment key={task.id}>
                    <TableRow>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onToggleExpand(task.id)}>
                          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground">{task.id}</div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.status}
                          onValueChange={(value) => void onChangeStatus(task, value as TaskStatus)}
                        >
                          <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">To do</SelectItem>
                            <SelectItem value="audited">In progress</SelectItem>
                            <SelectItem value="published">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{task.assignee || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
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
                        <TableCell colSpan={6} className="bg-muted/20 p-4">
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
                            </div>

                            {loadingDetails[task.id] ? (
                              <Skeleton className="h-20 w-full" />
                            ) : activeTab === "notes" ? (
                              <div className="rounded-md border bg-background p-3 text-sm">
                                {detail?.notes?.trim() || "No meeting notes yet."}
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
        )}
      </CardContent>
    </Card>
  );
}
