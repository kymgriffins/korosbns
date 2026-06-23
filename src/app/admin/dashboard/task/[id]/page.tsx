"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import type { TaskDetail } from "@/types/tasks";
import { autoHue } from "@/types/tasks";

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  draft: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: "Draft" },
  audited: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "In Progress" },
  published: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", label: "Published" },
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await taskApi.get(id);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
        toast.error("Failed to load task");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isLoggedIn]);

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    try {
      await taskApi.delete(id);
      toast.success("Task deleted");
      router.push("/dashboard/task");
    } catch {
      toast.error("Failed to delete task");
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-6">
        <Card className="w-full text-center">
          <CardContent className="py-12">
            <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to view tasks.</p>
            <Button asChild>
              <a href={`/budgethub/auth/login?next=/dashboard/task/${id}`}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <p className="text-destructive">{error || "Task not found"}</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/task">Back to Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[task.status];
  const teamColor = task.hue ? `hsl(${task.hue}, 50%, 35%)` : undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/task" className="hover:text-foreground">Tasks</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{task.title}</span>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            {task.week_label && (
              <p className="text-sm text-muted-foreground">{task.week_label}</p>
            )}
          </div>
          <Badge className={`shrink-0 ${statusStyle.bg}`} variant="outline">
            {statusStyle.label}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="size-3.5" />
              {task.author_name}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5" />
              {format(new Date(task.created_at), "MMM d, yyyy")}
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                Due {format(new Date(task.due_date), "MMM d, yyyy")}
              </div>
            )}
            {task.assignee && (
              <Badge variant="secondary" className="text-xs">{task.assignee}</Badge>
            )}
            {task.assigned_team && (
              <Badge variant="outline" className="text-xs" style={teamColor ? { borderColor: teamColor, color: teamColor } : undefined}>
                {task.assigned_team}
              </Badge>
            )}
            {task.due_label && (
              <Badge variant="secondary" className="text-xs">{task.due_label}</Badge>
            )}
          </div>

          {task.sections && task.sections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Sections</h3>
              {task.sections.map((section, i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Checklist</h3>
              {task.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox checked={item.checked} disabled />
                  <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {task.progress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{task.progress}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, parseInt(task.progress) || 0)}%` }}
                />
              </div>
            </div>
          )}

          {task.audit_trails && task.audit_trails.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Audit Trail</h3>
              {task.audit_trails.map((trail, i) => (
                <div key={i} className="rounded-lg border border-border/50 p-3 text-sm">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{trail.action}</span>
                    <span>{format(new Date(trail.timestamp), "MMM d, HH:mm")}</span>
                  </div>
                  <p>{trail.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
