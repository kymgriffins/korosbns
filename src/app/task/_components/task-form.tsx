"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
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
import { Slider } from "@/ui/slider";

import { taskApi } from "@/lib/task-api";
import type {
  Task, TaskCreatePayload, ChecklistItem, AssignableUser,
} from "@/types/tasks";
import { TEAM_OPTIONS, autoHue } from "@/types/tasks";
import { ChecklistEditor } from "./checklist-editor";

export type TaskFormMode = "create" | "edit";

export function TaskForm({
  mode,
  task,
  onSaved,
}: {
  mode: TaskFormMode;
  task?: Task;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [form, setForm] = useState<TaskCreatePayload>(() => ({
    week_label: task?.week_label ?? format(new Date(), "'Week' w 'of' MMM yyyy"),
    title: task?.title ?? "",
    content: task?.content ?? "",
    status: task?.status ?? "draft",
    due_date: task?.due_date ?? null,
    assignee: task?.assignee ?? null,
    assigned_team: task?.assigned_team ?? null,
    progress: task?.progress ?? 0,
    checklist: task?.checklist ?? [],
    due_label: task?.due_label ?? null,
    hue: task?.hue ?? autoHue(task?.assigned_team) ?? null,
  }));

  useEffect(() => {
    taskApi.getAssignableUsers()
      .then(setAssignableUsers)
      .catch(() => {
        toast.error("Failed to load assignable users");
      })
      .finally(() => setUsersLoading(false));
  }, []);

  function updateField<K extends keyof TaskCreatePayload>(key: K, value: TaskCreatePayload[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "assigned_team" && !prev.hue) {
        next.hue = autoHue(value as string | null | undefined) ?? null;
      }
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "edit" && task) {
        await taskApi.update(task.id, form);
        toast.success("Task updated");
      } else {
        await taskApi.create(form);
        toast.success("Task created");
      }
      onSaved?.();
      router.push("/task");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  const selectedUser = assignableUsers.find((u) => u.email === form.assignee);

  return (
    <div className="space-y-6">
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
            onValueChange={(v: any) => updateField("status", v)}
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
          placeholder="Add details, requirements, or notes... Supports markdown."
          rows={5}
          className="min-h-[100px] resize-y rounded-lg bg-background text-sm"
        />
      </div>

      <ChecklistEditor
        items={form.checklist ?? []}
        onChange={(items) => updateField("checklist", items)}
      />

      <div className="space-y-2">
        <Label>Progress ({form.progress ?? 0}%)</Label>
        <Slider
          value={[form.progress ?? 0]}
          onValueChange={([v]) => updateField("progress", v)}
          max={100}
          step={5}
        />
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
          <Label htmlFor="task-assignee">Assignee</Label>
          <Select
            value={form.assignee ?? ""}
            onValueChange={(v) =>
              updateField("assignee", v || null)
            }
            disabled={usersLoading}
          >
            <SelectTrigger id="task-assignee" className="rounded-lg bg-background text-sm">
              <SelectValue placeholder={usersLoading ? "Loading users..." : "Select assignee"} />
            </SelectTrigger>
            <SelectContent>
              {assignableUsers.map((u) => (
                <SelectItem key={u.id} value={u.email}>
                  {u.display_name || `${u.first_name} ${u.last_name}`.trim() || u.email}
                  <span className="ml-2 text-[10px] text-muted-foreground">({u.role})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedUser && (
            <p className="text-[10px] text-muted-foreground">
              {selectedUser.display_name || `${selectedUser.first_name} ${selectedUser.last_name}`.trim()}
              {" · "}{selectedUser.role}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-team">Assigned Team</Label>
          <Select
            value={form.assigned_team ?? ""}
            onValueChange={(v) => updateField("assigned_team", v || null)}
          >
            <SelectTrigger id="task-team" className="rounded-lg bg-background text-sm">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_OPTIONS.map((team) => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Palette className="size-3.5" />
          Hue / Color
        </Label>
        <div className="flex gap-2">
          <Input
            value={form.hue ?? ""}
            onChange={(e) => updateField("hue", e.target.value || null)}
            placeholder={autoHue(form.assigned_team) ?? "Auto from team"}
            className="rounded-lg bg-background text-sm font-mono flex-1"
          />
          {(form.hue || autoHue(form.assigned_team)) && (
            <div
              className="size-9 rounded-lg border shrink-0"
              style={{ backgroundColor: form.hue ?? autoHue(form.assigned_team) }}
            />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Auto-assigned from team if left empty. Can override manually.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
          {mode === "create" ? "Create Task" : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/task")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
