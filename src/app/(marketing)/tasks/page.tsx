"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { useEffect, useState } from "react";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
type TaskPriority = "low" | "medium" | "high";

type TaskItem = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: TaskStatus;
  priority: TaskPriority;
  notes?: string;
};

type TasksResponse = {
  source: "seed" | "endpoint";
  tasks: TaskItem[];
};

const statusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "Progress",
  done: "Done",
  blocked: "Blocked",
};

const statusClasses: Record<TaskStatus, string> = {
  todo: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  in_progress: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  blocked: "bg-red-500/15 text-red-300 border-red-500/30",
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  high: "bg-red-500/10 text-red-300 border-red-500/20",
};

const formatDate = (value: string) => {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
};

export default function TasksPage() {
  const [data, setData] = useState<TasksResponse>({ source: "seed", tasks: [] });
  const tasks = data.tasks;

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        const response = await fetch("/api/tasks", { cache: "no-store" });
        if (!response.ok) throw new Error("Tasks API request failed");
        const payload = (await response.json()) as TasksResponse;
        if (active) setData(payload);
      } catch {
        if (active) setData({ source: "seed", tasks: [] });
      }
    };

    void loadTasks();
    return () => {
      active = false;
    };
  }, []);

  const statusCount = {
    todo: tasks.filter((task) => task.status === "todo").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    done: tasks.filter((task) => task.status === "done").length,
    blocked: tasks.filter((task) => task.status === "blocked").length,
  };

  return (
    <section className="w-full py-16 lg:py-24">
      <Wrapper>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <SectionBadge title="Task Tracker" />
            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">BNS Action Items</h1>
            <p className="mt-4 text-muted-foreground">
              Track ownership, deadlines, and execution status from leadership decisions.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">To do</p>
              <p className="mt-1 text-2xl font-semibold">{statusCount.todo}</p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Progress</p>
              <p className="mt-1 text-2xl font-semibold">{statusCount.in_progress}</p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Done</p>
              <p className="mt-1 text-2xl font-semibold">{statusCount.done}</p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Blocked</p>
              <p className="mt-1 text-2xl font-semibold">{statusCount.blocked}</p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-5 text-sm text-muted-foreground">
                No tasks loaded yet. Set `TASKS_API_URL` (or `NEXT_PUBLIC_TASKS_ENDPOINT`) and refresh.
              </div>
            ) : (
              tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-xl border border-foreground/10 bg-foreground/5 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[task.status]}`}
                    >
                      {statusLabel[task.status]}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium uppercase ${priorityClasses[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{task.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>Owner: {task.owner}</span>
                    <span>Due: {formatDate(task.due)}</span>
                  </div>
                  {task.notes ? <p className="mt-2 text-sm text-muted-foreground">{task.notes}</p> : null}
                </article>
              ))
            )}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
