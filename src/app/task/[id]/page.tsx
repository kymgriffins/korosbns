"use client";

import { use, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";

import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Skeleton } from "@/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { taskApi } from "@/lib/task-api";
import type { TaskDetail } from "@/types/tasks";
import { autoHue } from "@/types/tasks";
import { TaskForm } from "../_components/task-form";

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  draft: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: "Draft" },
  audited: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "In Progress" },
  published: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", label: "Published" },
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

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    taskApi.get(id)
      .then(setTask)
      .catch(() => {
        toast.error("Failed to load task");
        router.push("/task");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleToggleChecklistItem(itemId: string, currentChecked: boolean) {
    if (!isLoggedIn) return;
    setTogglingItems((prev) => new Set(prev).add(itemId));
    try {
      const updated = await taskApi.updateChecklistItem(id, itemId, { is_completed: !currentChecked });
      setTask((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checklist: prev.checklist?.map((c) =>
            c.id === itemId ? { ...c, checked: updated.is_completed } : c
          ),
        };
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update item";
      toast.error(msg);
    } finally {
      setTogglingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }

  async function handleDelete() {
    if (!isLoggedIn) {
      toast.error("Sign in to delete tasks");
      return;
    }
    setDeleting(true);
    try {
      await taskApi.delete(id);
      toast.success("Task deleted");
      router.push("/task");
    } catch {
      toast.error("Failed to delete task");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Skeleton className="h-5 w-48" />
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <Skeleton className="h-7 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Task Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The task you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/task")}>
              Back to Task Board
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[task.status] ?? STATUS_STYLES.draft;
  const hue = task.hue ?? autoHue(task.assigned_team);
  const doneCount = task.checklist?.filter((c) => c.checked).length ?? 0;
  const totalItems = task.checklist?.length ?? 0;

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PageBreadcrumbs
          items={[
            { label: "Task Board", href: "/task" },
            { label: task.title || "Edit Task" },
          ]}
        />
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm mode="edit" task={task} onSaved={() => setEditing(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageBreadcrumbs
        items={[
          { label: "Task Board", href: "/task" },
          { label: task.title },
        ]}
      />

      {/* Header card */}
      <Card
        className="border-border/60 bg-card shadow-sm"
        style={hue ? { borderTopColor: hue, borderTopWidth: 2 } : undefined}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusStyle.bg}>
                  {statusStyle.label}
                </Badge>
                {task.due_label && (
                  <span className="text-[10px] text-muted-foreground">{task.due_label}</span>
                )}
              </div>
              <CardTitle className="text-2xl tracking-tight">{task.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{task.week_label}</p>
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-2 shrink-0">
                {task.status !== "published" && (
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)} aria-label="Edit task">
                    Edit
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => setDeleteConfirmOpen(true)} disabled={deleting} aria-label="Delete task">
                  {deleting ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Overview */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {task.author_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Created {safeFormat(task.created_at, "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Updated {safeFormat(task.updated_at, "MMM d, yyyy")}
            </span>
            {task.due_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Due {safeFormat(task.due_date, "MMM d, yyyy")}
              </span>
            )}
          </div>

          {task.assignee && (
            <div className="rounded-lg border bg-card p-3 text-sm">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Assignee</span>
              <p className="mt-0.5">{task.assignee_email || task.assignee}</p>
              {task.assigned_team && (
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {task.assigned_team}
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Progress ({task.progress ?? 0}%)
            </span>
            <div className="h-2 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(task.progress ?? 0, 0)}%`,
                  backgroundColor: hue ?? "hsl(221 83% 53%)",
                }}
              />
            </div>
          </div>

          {task.content && (
            <div className="space-y-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </span>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
                {task.content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Checklist ({doneCount}/{totalItems})
          </span>
          {task.checklist && task.checklist.length > 0 ? (
            <div className="space-y-3 mt-2">
              {/* Active (incomplete) items */}
              {(() => {
                const active = task.checklist!.filter((c) => !c.checked);
                return active.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={false}
                      disabled={!isLoggedIn || togglingItems.has(item.id)}
                      onCheckedChange={() => handleToggleChecklistItem(item.id, false)}
                    />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ));
              })()}

              {/* Completed items */}
              {(() => {
                const done = task.checklist!.filter((c) => c.checked);
                if (done.length === 0) return null;
                return (
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground">Completed</span>
                    {done.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={true}
                          disabled={!isLoggedIn || togglingItems.has(item.id)}
                          onCheckedChange={() => handleToggleChecklistItem(item.id, true)}
                        />
                        <span className="text-sm line-through text-muted-foreground">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No checklist items.</p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {task.notes && (
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Notes</span>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground mt-2">
              {task.notes}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Trail */}
      {task.audit_trails && task.audit_trails.length > 0 && (
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-4 space-y-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Audit Trail</span>
            {task.audit_trails.map((trail) => (
              <div key={trail.id} className="rounded-lg border bg-card/50 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trail.auditor_name}</span>
                  <span className="text-muted-foreground">
                    {safeFormat(trail.created_at, "MMM d, yyyy HH:mm")}
                  </span>
                </div>
                <p className="mt-0.5 text-muted-foreground">
                  <Badge variant="outline" className="text-[9px] mr-1">{trail.action}</Badge>
                  {trail.comment}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteConfirmOpen(false);
                handleDelete();
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
