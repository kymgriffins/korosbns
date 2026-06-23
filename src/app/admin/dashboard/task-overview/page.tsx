"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Circle,
  CircleDot,
  FileBarChart,
  ListTodo,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import { useAuth } from "@/contexts/auth-context";
import type { Task, TaskStatus } from "@/types/tasks";

const STATUS_META: Record<TaskStatus, { title: string; icon: typeof Circle; color: string; bg: string }> = {
  draft: { title: "Draft", icon: Circle, color: "text-amber-500", bg: "bg-amber-500/10" },
  audited: { title: "In Progress", icon: CircleDot, color: "text-blue-500", bg: "bg-blue-500/10" },
  published: { title: "Done", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "text-red-600 border-red-300 bg-red-50 dark:bg-red-950" },
  high: { label: "High", color: "text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-950" },
  medium: { label: "Med", color: "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950" },
  low: { label: "Low", color: "text-gray-600 border-gray-300 bg-gray-50 dark:bg-gray-950" },
};

const KANBAN_META: Record<string, { label: string; color: string }> = {
  ideas: { label: "Ideas", color: "text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950" },
  planned: { label: "Planned", color: "text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950" },
  building: { label: "Building", color: "text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-950" },
  qa: { label: "QA", color: "text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950" },
  shipped: { label: "Shipped", color: "text-green-600 border-green-300 bg-green-50 dark:bg-green-950" },
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

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: typeof TrendingUp;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`size-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{(value ?? 0).toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}

function TaskRow({ task }: { task: Task }) {
  const meta = STATUS_META[task.status];
  const Icon = meta.icon;
  const priority = task.priority ? PRIORITY_META[task.priority.toLowerCase()] : null;
  const kanban = task.kanban_column ? KANBAN_META[task.kanban_column] : null;

  return (
    <Link
      href={`/dashboard/task/${task.id}`}
      className="flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/50"
    >
      <Icon className={`size-4 shrink-0 ${meta.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
          <span>{task.author_name}</span>
          {task.due_date && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Calendar className="size-2.5" />
                {safeFormat(task.due_date, "MMM d")}
              </span>
            </>
          )}
          {task.assignee && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Users className="size-2.5" />
                {task.assignee}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {priority && (
          <Badge variant="outline" className={`text-[9px] font-medium ${priority.color} shrink-0`}>
            {priority.label}
          </Badge>
        )}
        {kanban && (
          <Badge variant="outline" className={`text-[9px] font-medium ${kanban.color} shrink-0`}>
            {kanban.label}
          </Badge>
        )}
        <Badge variant="outline" className={`text-[9px] font-medium ${meta.color} border-current/20 shrink-0`}>
          {meta.title}
        </Badge>
      </div>
    </Link>
  );
}

export default function TaskOverviewPage() {
  const { isLoggedIn } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.listAll();
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

  const stats = useMemo(() => {
    const total = tasks.length;
    const draft = tasks.filter((t) => t.status === "draft").length;
    const inProgress = tasks.filter((t) => t.status === "audited").length;
    const done = tasks.filter((t) => t.status === "published").length;
    const avgProgress = total > 0
      ? Math.round(tasks.reduce((sum, t) => sum + (t.progress ?? 0), 0) / total)
      : 0;
    return { total, draft, inProgress, done, avgProgress };
  }, [tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8),
    [tasks],
  );

  const overdueTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (!t.due_date || t.status === "published") return false;
        return new Date(t.due_date) < new Date();
      }),
    [tasks],
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Overview of all tasks across your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/task/report">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-1.5 size-3.5" />
              Report
            </Button>
          </Link>
          <Link href="/dashboard/task">
            <Button variant="outline" size="sm">
              <ListTodo className="mr-1.5 size-3.5" />
              Board
            </Button>
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard/task/new">
              <Button size="sm">
                <Plus className="mr-1.5 size-3.5" />
                New Task
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button variant="ghost" size="sm" onClick={fetchTasks} className="ml-3">
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="text-foreground" loading={loading} />
        <StatCard title="Draft" value={stats.draft} icon={Circle} color="text-amber-500" loading={loading} />
        <StatCard title="In Progress" value={stats.inProgress} icon={CircleDot} color="text-blue-500" loading={loading} />
        <StatCard title="Done" value={stats.done} icon={CheckCircle2} color="text-emerald-500" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">Recent Tasks</CardTitle>
              <CardDescription>Latest {recentTasks.length} tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No tasks yet.</p>
              ) : (
                recentTasks.map((task) => <TaskRow key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
              <CardDescription>Average task completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">{stats.avgProgress}%</span>
                <TrendingUp className="size-5 text-emerald-500 mb-1" />
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.avgProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {overdueTasks.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">Overdue</CardTitle>
                <CardDescription>{overdueTasks.length} task{overdueTasks.length !== 1 ? "s" : ""} past due</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {overdueTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/task/${task.id}`}
                    className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-destructive/10"
                  >
                    <Circle className="size-3 text-destructive shrink-0" />
                    <span className="truncate">{task.title}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
