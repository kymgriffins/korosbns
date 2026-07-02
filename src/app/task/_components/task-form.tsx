"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  Loader2, FileText, ClipboardList, CalendarClock,
  Tag, User, Paperclip, AlignLeft, StickyNote,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ApiRequestError } from "@/lib/api-errors";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import type {
  Task, TaskStatus, TaskCreatePayload, AssignableTeam, AssignableUser, TaskPriority, TaskTag, TaskAttachment,
} from "@/types/tasks";
import { ChecklistEditor } from "./checklist-editor";
import { TaskFileUpload } from "./task-file-upload";
import { TaskAttachmentsGrid } from "./task-attachments";

export type TaskFormMode = "create" | "edit";

function generateWeekLabel(refDate: Date = new Date()): string {
  const monday = startOfWeek(refDate, { weekStartsOn: 1 });
  const sunday = endOfWeek(refDate, { weekStartsOn: 1 });
  const weekOfMonth = 1 + Math.floor((monday.getDate() - 1) / 7);
  const monthName = format(refDate, "MMMM");
  const year = refDate.getFullYear();
  return `Week ${weekOfMonth} of ${monthName} ${year}, ${format(monday, "MMM d")} - ${format(sunday, "MMM d, yyyy")}`;
}

const FIELD_LABELS: Record<string, string> = {
  week_label: "Week Label",
  title: "Title",
  content: "Description",
  notes: "Meeting Notes",
  status: "Status",
  due_date: "Due Date",
  assignee: "Assignee",
  assigned_team: "Assigned Team",
  progress: "Progress",
  due_label: "Due Label",
  checklist: "Checklist",
};

/** Small reusable section header with icon, title and optional description. */
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-sm font-medium leading-none">{title}</h3>
        {description && (
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function TaskForm({
  mode,
  task,
  onSaved,
  redirectTo,
}: {
  mode: TaskFormMode;
  task?: Task;
  onSaved?: () => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [teams, setTeams] = useState<AssignableTeam[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [attachments, setAttachments] = useState<TaskAttachment[]>(
    (task as (Task & { attachments?: TaskAttachment[] }) | undefined)?.attachments ?? []
  );
  const [form, setForm] = useState<TaskCreatePayload>(() => ({
    week_label: task?.week_label ?? generateWeekLabel(),
    title: task?.title ?? "",
    content: task?.content ?? "",
    status: task?.status ?? "draft",
    due_date: task?.due_date ?? null,
    assignee: task?.assignee ?? null,
    assigned_team: task?.assigned_team ?? null,
    progress: task?.progress ?? 0,
    checklist: task?.checklist ?? [],
    due_label: task?.due_label ?? null,
    priority: task?.priority ?? "medium",
    tag: task?.tag ?? undefined,
  }));

  const cancelHref = redirectTo ?? "/admin/dashboard/task";

  useEffect(() => {
    Promise.all([
      taskData.users.fetchAssignable(),
      taskApi.getTeams(),
    ])
      .then(([users, teamList]) => {
        setAssignableUsers(users);
        setTeams(teamList);
      })
      .catch(() => {
        toast.error("Failed to load assignable users");
      })
      .finally(() => setUsersLoading(false));
  }, []);

  function updateField<K extends keyof TaskCreatePayload>(key: K, value: TaskCreatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
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
            await taskApi.addChecklistItem(created.id, item);
          } catch {
            // keep going; parent task already created
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
          .map((k) => FIELD_LABELS[k] || k)
          .join(", ");
        toast.error(`Validation failed: ${fieldList}`);
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to save task");
      }
    } finally {
      setSaving(false);
    }
  }

  const selectedUser = assignableUsers.find((u) => u.id === form.assignee);

  function fieldAlert(key: string) {
    const msgs = fieldErrors[key];
    if (!msgs || msgs.length === 0) return null;
    return (
      <Alert variant="destructive" className="mt-1 py-1.5 px-2.5">
        <AlertDescription className="text-[11px]">{msgs[0]}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Scrollable form body ──────────────────────────────── */}
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent pb-4">

        {/* Section: Basic Information */}
        <section className="space-y-4">
          <SectionHeader
            icon={FileText}
            title="Basic Information"
            description="Title, status, and scheduling context"
          />
          <div className="space-y-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="What needs to be done?"
              className={`rounded-lg bg-background text-sm ${fieldErrors.title ? "border-destructive" : ""}`}
              autoFocus
            />
            {fieldAlert("title")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-week-label">Week Label</Label>
              <Input
                id="task-week-label"
                value={form.week_label}
                onChange={(e) => updateField("week_label", e.target.value)}
                className="rounded-lg bg-background text-sm text-muted-foreground"
                readOnly
              />
              <p className="text-[10px] text-muted-foreground">Auto-populated from current date</p>
              {fieldAlert("week_label")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select
                value={form.status ?? "draft"}
                onValueChange={(v) => updateField("status", v as TaskStatus)}
              >
                <SelectTrigger id="task-status" className={`rounded-lg bg-background text-sm ${fieldErrors.status ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="audited">Audited</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              {fieldAlert("status")}
            </div>
          </div>
        </section>

        <Separator />

        {/* Section: Content & Notes */}
        <section className="space-y-4">
          <SectionHeader
            icon={AlignLeft}
            title="Content & Notes"
            description="Detailed description and meeting notes"
          />
          <div className="space-y-2">
            <Label htmlFor="task-content">Description</Label>
            <Textarea
              id="task-content"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Add details, requirements, or notes... Supports markdown."
              rows={5}
              className={`min-h-[100px] resize-y rounded-lg bg-background text-sm ${fieldErrors.content ? "border-destructive" : ""}`}
            />
            {fieldAlert("content")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-notes">Meeting Notes (markdown)</Label>
            <Textarea
              id="task-notes"
              value={form.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Long-form meeting notes, agenda, decisions, action points... Supports markdown."
              rows={6}
              className="min-h-[150px] resize-y rounded-lg bg-background text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Supports markdown formatting. These notes are displayed in the task detail view.
            </p>
          </div>
        </section>

        <Separator />

        {/* Section: Checklist */}
        <section className="space-y-4">
          <SectionHeader
            icon={ClipboardList}
            title="Checklist"
            description="Break the task into sub-items with assignees and deadlines"
          />
          <ChecklistEditor
            items={form.checklist ?? []}
            onChange={(items) => updateField("checklist", items)}
            taskId={mode === "edit" && task ? task.id : undefined}
            assignableUsers={assignableUsers}
            readonly={task?.status === "published"}
          />
        </section>

        <Separator />

        {/* Section: Schedule & Priority */}
        <section className="space-y-4">
          <SectionHeader
            icon={CalendarClock}
            title="Schedule & Priority"
            description="Due dates, progress tracking, and priority level"
          />
          <div className="space-y-2">
            <Label>Progress ({form.progress ?? 0}%)</Label>
            <Slider
              value={[form.progress ?? 0]}
              onValueChange={([v]) => updateField("progress", v)}
              max={100}
              step={5}
            />
            {fieldAlert("progress")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={form.due_date ?? ""}
                onChange={(e) => updateField("due_date", e.target.value || null)}
                className={`rounded-lg bg-background text-sm ${fieldErrors.due_date ? "border-destructive" : ""}`}
              />
              {fieldAlert("due_date")}
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
              {fieldAlert("due_label")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select
                value={form.priority ?? "medium"}
                onValueChange={(v) => updateField("priority", v as TaskPriority)}
              >
                <SelectTrigger id="task-priority" className="rounded-lg bg-background text-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {fieldAlert("priority")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-tag">Tag</Label>
              <Select
                value={form.tag ?? ""}
                onValueChange={(v) => updateField("tag", (v || undefined) as TaskTag)}
              >
                <SelectTrigger id="task-tag" className="rounded-lg bg-background text-sm">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="devops">Devops</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
              {fieldAlert("tag")}
            </div>
          </div>
        </section>

        <Separator />

        {/* Section: Assignment */}
        <section className="space-y-4">
          <SectionHeader
            icon={User}
            title="Assignment"
            description="Who is responsible and which team owns this task"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Select
                value={form.assignee || "unassigned_value_placeholder"}
                onValueChange={(v) => updateField("assignee", v === "unassigned_value_placeholder" ? null : v)}
                disabled={usersLoading}
              >
                <SelectTrigger id="task-assignee" className={`rounded-lg bg-background text-sm ${fieldErrors.assignee ? "border-destructive" : ""}`}>
                  <SelectValue placeholder={usersLoading ? "Loading users..." : "Select assignee"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned_value_placeholder">None (Unassigned)</SelectItem>
                  {assignableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.display_name || `${u.first_name} ${u.last_name}`.trim() || u.email}
                      <span className="ml-2 text-[10px] text-muted-foreground">
                        ({u.role}{u.team ? ` · ${u.team.name}` : ""})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUser && (
                <p className="text-[10px] text-muted-foreground">
                  {selectedUser.display_name || `${selectedUser.first_name} ${selectedUser.last_name}`.trim()}
                  {" · "}{selectedUser.role}
                  {selectedUser.team ? ` · ${selectedUser.team.name}` : ""}
                </p>
              )}
              {fieldAlert("assignee")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-team">Assigned Team</Label>
              <Select
                value={form.assigned_team ?? ""}
                onValueChange={(v) => updateField("assigned_team", v || null)}
              >
                <SelectTrigger id="task-team" className={`rounded-lg bg-background text-sm ${fieldErrors.assigned_team ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldAlert("assigned_team")}
            </div>
          </div>
        </section>

        <Separator />

        {/* Section: Attachments — shown for edit mode or after create */}
        {(mode === "edit" && task) && (
          <section className="space-y-4">
            <SectionHeader
              icon={Paperclip}
              title="Attachments"
              description="Upload images, documents, and files related to this task"
            />
            <TaskAttachmentsGrid
              attachments={attachments}
              taskId={task.id}
              onDeleted={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
              readonly={task.status === "published"}
            />
            {task.status !== "published" && (
              <div className="rounded-lg border border-dashed border-border/50 p-4">
                <TaskFileUpload
                  taskId={task.id}
                  onUploaded={(a) => setAttachments((prev) => [...prev, a])}
                />
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── Sticky footer action bar ──────────────────────────── */}
      <div className="sticky bottom-0 z-10 -mx-6 mt-2 border-t bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            {mode === "create" ? "Creating a new task" : `Editing task · ID: ${task?.id.slice(0, 8)}`}
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push(cancelHref)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {mode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
