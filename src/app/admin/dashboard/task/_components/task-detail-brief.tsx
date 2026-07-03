"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, CalendarClock, CheckCircle2, Circle, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskDetail, TaskStatus } from "@/types/tasks";
import { PRIORITY_LABELS } from "@/types/tasks";

const WORKFLOW: { status: TaskStatus; label: string; hint: string }[] = [
  { status: "draft", label: "Draft", hint: "Work in progress" },
  { status: "audited", label: "Audited", hint: "Reviewed by a lead" },
  { status: "published", label: "Published", hint: "Visible to the team" },
];

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

function workflowIndex(status: TaskStatus) {
  return WORKFLOW.findIndex((s) => s.status === status);
}

export function TaskDetailBrief({
  task,
  detail,
  backHref,
}: {
  task: Task;
  detail: TaskDetail | null;
  backHref: string;
}) {
  const activeIdx = workflowIndex(task.status);
  const checklist = detail?.checklist_items ?? [];
  const doneCount = checklist.filter((c) => c.is_completed || c.status === "done").length;
  const accent = task.hue ?? "var(--primary)";

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to board
      </Link>

      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="h-1 w-full" style={{ background: accent }} aria-hidden />
        <div className="space-y-5 p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {task.week_label}
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold leading-tight tracking-tight text-foreground md:text-[1.65rem]">
              {task.title}
            </h1>
            {task.tag && (
              <p className="mt-2 text-xs text-muted-foreground capitalize">{task.tag.replace(/_/g, " ")}</p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Priority</dt>
              <dd className="mt-1 flex items-center gap-2 font-medium">
                <span
                  className={cn("size-2 rounded-full", PRIORITY_DOT[task.priority ?? "medium"])}
                  aria-hidden
                />
                {PRIORITY_LABELS[task.priority ?? "medium"]}
              </dd>
            </div>
            {task.due_date && (
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Due</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium">
                  <CalendarClock className="size-3.5 text-muted-foreground" />
                  {format(new Date(task.due_date), "MMM d, yyyy")}
                </dd>
              </div>
            )}
            {task.progress !== undefined && task.progress > 0 && (
              <div className="col-span-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Progress
                </dt>
                <dd className="mt-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{task.progress}% complete</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Publication workflow
        </p>
        <ol className="mt-4 space-y-0" aria-label="Task publication status">
          {WORKFLOW.map((step, idx) => {
            const reached = idx <= activeIdx;
            const current = idx === activeIdx;
            return (
              <li key={step.status} className="relative flex gap-3 pb-5 last:pb-0">
                {idx < WORKFLOW.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[11px] top-6 h-[calc(100%-12px)] w-px",
                      reached ? "bg-primary/40" : "bg-border",
                    )}
                    aria-hidden
                  />
                )}
                <span className="relative z-[1] mt-0.5 shrink-0">
                  {reached ? (
                    <CheckCircle2
                      className={cn("size-[22px]", current ? "text-primary" : "text-primary/60")}
                    />
                  ) : (
                    <Circle className="size-[22px] text-muted-foreground/40" />
                  )}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      current ? "text-foreground" : reached ? "text-muted-foreground" : "text-muted-foreground/60",
                    )}
                  >
                    {step.label}
                    {current && (
                      <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-primary">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.hint}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5 text-sm">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Author</p>
          <p className="mt-1 font-medium">{detail?.author_name ?? task.author_name}</p>
        </div>
        {(task.assignee_name || task.assignee) && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Assignee</p>
            <p className="mt-1 font-medium">{task.assignee_name ?? task.assignee}</p>
            {detail?.assignee_email && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="size-3" />
                {detail.assignee_email}
              </p>
            )}
          </div>
        )}
        {task.team_name && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Team</p>
            <p className="mt-1 flex items-center gap-1.5 font-medium">
              <Users className="size-3.5 text-muted-foreground" />
              {task.team_name}
            </p>
          </div>
        )}
        <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <p>Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</p>
          <p>Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</p>
          <p className="mt-2 font-mono text-[10px]">ref {task.id.slice(0, 8)}</p>
        </div>
      </div>

      {checklist.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Checklist · {doneCount}/{checklist.length}
          </p>
          <ul className="mt-3 space-y-2">
            {checklist.slice(0, 6).map((item) => {
              const done = item.is_completed || item.status === "done";
              return (
                <li key={item.id} className="flex items-start gap-2 text-sm">
                  <span
                    className={cn(
                      "mt-1 size-1.5 shrink-0 rounded-full",
                      done ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                    aria-hidden
                  />
                  <span className={cn(done && "text-muted-foreground line-through")}>
                    {item.title || item.text}
                  </span>
                </li>
              );
            })}
            {checklist.length > 6 && (
              <li className="text-xs text-muted-foreground">+{checklist.length - 6} more items</li>
            )}
          </ul>
        </div>
      )}

      {detail?.audit_trails && detail.audit_trails.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Recent audit
          </p>
          <ul className="mt-3 space-y-2">
            {detail.audit_trails.slice(0, 4).map((trail) => (
              <li key={trail.id} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{trail.auditor_name}</span>
                {" · "}
                {trail.action}
                {trail.created_at && (
                  <span> · {formatDistanceToNow(new Date(trail.created_at), { addSuffix: true })}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
