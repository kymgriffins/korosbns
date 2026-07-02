"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarClock, ListTodo, Loader2, Mail, User, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TaskForm } from "@/app/task/_components/task-form";
import { TaskExportDialog } from "@/app/task/_components/task-export-dialog";
import { usePageView } from "@/hooks/use-page-view";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import type { Task, TaskDetail } from "@/types/tasks";

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", label: "Urgent" },
  high: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400", label: "High" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-600 dark:text-yellow-400", label: "Medium" },
  low: { bg: "bg-slate-50 dark:bg-slate-950/30", text: "text-slate-500 dark:text-slate-400", label: "Low" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground", label: "Draft" },
  audited: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-600", label: "Audited" },
  published: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-600 dark:text-green-400", dot: "bg-green-600", label: "Published" },
};

function AuthorCard({ detail, task }: { detail: TaskDetail | null; task: Task }) {
  const name = detail?.author_name || task.author_name || "Unknown";
  const email = detail?.assignee_email;
  const team = detail?.author_team || task.team_name;
  const initial = name[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {initial}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {email}
            </span>
          )}
          {team && (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {team}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  usePageView();
  const { id } = use(params);
  const routeBase = useRouteBase();
  const [task, setTask] = useState<Task | null>(null);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [t, d] = await Promise.all([
          taskApi.listAll().then((tasks) => tasks.find((x) => x.id === id)),
          taskData.tasks.fetchById(id),
        ]);
        if (!cancelled) {
          if (t) setTask(t);
          setDetail(d);
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to load task");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <TaskPageShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </TaskPageShell>
    );
  }

  if (!task) {
    return (
      <TaskPageShell>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">Task not found.</p>
            <Button asChild variant="outline">
              <Link href={getFullUrl(routeBase, "/dashboard/task")}>Back to Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </TaskPageShell>
    );
  }

  const ps = PRIORITY_STYLES[task.priority ?? "medium"];
  const ss = STATUS_STYLES[task.status];

  return (
    <TaskPageShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={getFullUrl(routeBase, "/dashboard/task")} className="hover:text-foreground transition-colors">
          Tasks
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[300px]">{task.title}</span>
      </div>

      {/* Task metadata card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ListTodo className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl truncate flex items-center gap-2">
                  {task.title}
                  {detail && <TaskExportDialog task={detail} />}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">ID: {task.id.slice(0, 8)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs">{task.week_label}</span>
                  {task.section_count !== undefined && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs">{task.section_count} section{task.section_count !== 1 ? "s" : ""}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ss.bg} ${ss.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ss.dot}`} />
                {ss.label}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ps.bg} ${ps.text}`}>
                {ps.label}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Author & Assignee */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Author</p>
                <AuthorCard detail={detail} task={task} />
              </div>

              {(task.assignee_name || task.assignee) && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Assignee</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {(task.assignee_name ?? task.assignee ?? "?")[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="text-sm">{task.assignee_name || task.assignee}</div>
                  </div>
                </div>
              )}

              {task.assigned_team && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Team</p>
                  <Badge variant="secondary" className="text-xs">{task.assigned_team}</Badge>
                </div>
              )}
            </div>

            {/* Dates & Progress */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Timeline</p>
                <div className="space-y-2 text-sm">
                  {task.due_date && (
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 text-muted-foreground" />
                      <span>Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                      {task.due_label && (
                        <span className="text-xs text-muted-foreground">({task.due_label})</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                    <span>·</span>
                    <span>Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {task.progress !== undefined && task.progress > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Progress ({task.progress}%)
                  </p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags & Meta */}
            <div className="space-y-4">
              {task.tag && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Tag</p>
                  <Badge variant="outline" className="text-xs">{task.tag}</Badge>
                </div>
              )}
              {detail?.checklist_items && detail.checklist_items.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Checklist ({detail.checklist_items.filter((c) => c.is_completed || c.status === "done").length}/{detail.checklist_items.length})
                  </p>
                  <div className="space-y-1">
                    {detail.checklist_items.slice(0, 5).map((item) => {
                      const done = item.is_completed || item.status === "done";
                      return (
                        <div key={item.id} className="flex items-center gap-1.5 text-xs">
                          <span className={done ? "text-green-600" : "text-muted-foreground"}>{done ? "✓" : "○"}</span>
                          <span className={done ? "line-through text-muted-foreground" : ""}>{item.title || item.text}</span>
                        </div>
                      );
                    })}
                    {detail.checklist_items.length > 5 && (
                      <p className="text-[10px] text-muted-foreground">+{detail.checklist_items.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}
              {detail?.audit_trails && detail.audit_trails.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Audit Trail</p>
                  <div className="space-y-1">
                    {detail.audit_trails.slice(0, 3).map((trail, i) => (
                      <div key={i} className="text-[11px] text-muted-foreground flex gap-1">
                        <span className="text-foreground">{trail.auditor_name || "System"}</span>
                        <span>{trail.action}</span>
                        {trail.created_at && (
                          <span>· {formatDistanceToNow(new Date(trail.created_at), { addSuffix: true })}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Edit Task</CardTitle>
              <CardDescription>Update task details, checklist, assignee, and attachments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <TaskForm
            mode="edit"
            task={detail ?? task}
            redirectTo={getFullUrl(routeBase, "/dashboard/task")}
          />
        </CardContent>
      </Card>
    </TaskPageShell>
  );
}
