"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";

import { ApiRequestError } from "@/lib/api-errors";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import { taskCreateSchema, TASK_FIELD_LABELS, type TaskCreateFormValues } from "@/lib/task-schema";
import { buildRosterChecklist } from "@/app/task/_components/task-checklist-templates";
import type {
  Task,
  TaskCreatePayload,
  AssignableTeam,
  AssignableUser,
  TaskAttachment,
} from "@/types/tasks";

export type TaskFormMode = "create" | "edit";

export function generateWeekLabel(refDate: Date = new Date()): string {
  const monday = startOfWeek(refDate, { weekStartsOn: 1 });
  const sunday = endOfWeek(refDate, { weekStartsOn: 1 });
  const weekOfMonth = 1 + Math.floor((monday.getDate() - 1) / 7);
  const monthName = format(refDate, "MMMM");
  return `Week ${weekOfMonth} of ${monthName} ${format(refDate, "yyyy")}, ${format(monday, "MMM d")} - ${format(sunday, "MMM d, yyyy")}`;
}

function toInitialForm(task: Task | undefined, mode: TaskFormMode): TaskCreatePayload {
  return {
    week_label: task?.week_label ?? generateWeekLabel(),
    title: task?.title ?? "",
    content: task?.content ?? "",
    status: task?.status ?? "draft",
    due_date: task?.due_date ?? null,
    assignee: task?.assignee ?? null,
    assigned_team: task?.assigned_team ?? null,
    progress: task?.progress ?? 0,
    checklist: task?.checklist ?? (mode === "create" ? buildRosterChecklist() : []),
    due_label: task?.due_label ?? null,
    priority: task?.priority ?? "medium",
    tag: task?.tag ?? undefined,
    notes: (task as Task & { notes?: string })?.notes,
  };
}

export function useTaskForm({
  mode,
  task,
  redirectTo,
  onSaved,
}: {
  mode: TaskFormMode;
  task?: Task;
  redirectTo?: string;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const cancelHref = redirectTo ?? "/admin/dashboard/task";
  const [saving, setSaving] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [teams, setTeams] = useState<AssignableTeam[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [attachments, setAttachments] = useState<TaskAttachment[]>(
    (task as (Task & { attachments?: TaskAttachment[] }) | undefined)?.attachments ?? [],
  );
  const [form, setForm] = useState<TaskCreatePayload>(() => toInitialForm(task, mode));

  useEffect(() => {
    Promise.all([taskData.users.fetchAssignable(), taskApi.getTeams()])
      .then(([users, teamList]) => {
        setAssignableUsers(users);
        setTeams(teamList);
      })
      .catch(() => toast.error("Failed to load assignable users"))
      .finally(() => setUsersLoading(false));
  }, []);

  const updateField = useCallback(<K extends keyof TaskCreatePayload>(key: K, value: TaskCreatePayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const parsed = taskCreateSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = [issue.message];
      }
      setFieldErrors(next);
      toast.error(parsed.error.issues[0]?.message ?? "Validation failed");
      return false;
    }
    return true;
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setSaving(true);
    setFieldErrors({});
    try {
      if (mode === "edit" && task) {
        await taskData.tasks.update(task.id, form);
        invalidateTaskList();
        toast.success("Task updated");
        onSaved?.();
        router.push(redirectTo ?? "/admin/dashboard/task");
      } else {
        const created = await taskData.tasks.create(form);
        for (const item of form.checklist ?? []) {
          if (!item.title?.trim() && !item.text?.trim()) continue;
          try {
            const createdItem = await taskApi.addChecklistItem(created.id, item);
            for (const att of item.attachments ?? []) {
              if (!att._file) continue;
              try {
                await taskApi.uploadChecklistAttachment(created.id, createdItem.id, att._file);
              } catch {
                /* continue */
              }
            }
          } catch {
            /* continue */
          }
        }
        invalidateTaskList();
        toast.success("Task created");
        onSaved?.();
        router.push(redirectTo ?? `/admin/dashboard/task/${created.id}`);
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.fields) {
        setFieldErrors(err.fields);
        const fieldList = Object.keys(err.fields)
          .map((k) => TASK_FIELD_LABELS[k] || k)
          .join(", ");
        toast.error(`Validation failed: ${fieldList}`);
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to save task");
      }
    } finally {
      setSaving(false);
    }
  }, [form, mode, onSaved, redirectTo, router, task, validate]);

  return {
    form,
    setForm,
    updateField,
    handleSave,
    saving,
    assignableUsers,
    usersLoading,
    teams,
    fieldErrors,
    attachments,
    setAttachments,
    cancelHref,
  };
}
