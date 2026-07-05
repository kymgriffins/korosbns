"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  Loader2, FileText, ClipboardList, CalendarClock,
  Tag, User, Paperclip, AlignLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/index";
import { isChecklistItemDone } from "./checklist-utils";

import { ApiRequestError } from "@/lib/api-errors";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { invalidateTaskList } from "@/lib/task-events";
import type {
  Task, TaskStatus, TaskCreatePayload, AssignableTeam, AssignableUser, TaskPriority, TaskTag, TaskAttachment,
} from "@/types/tasks";
import { ChecklistEditor } from "./checklist-editor";
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

type TaskFormTab = "basics" | "content" | "checklist" | "schedule" | "files";

function TabCount({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <Badge variant="secondary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px] font-semibold tabular-nums">
      {count}
    </Badge>
  );
}

export function TaskForm({
  mode,
  task,
  onSaved,
  redirectTo,
  layout = "default",
}: {
  mode: TaskFormMode;
  task?: Task;
  onSaved?: () => void;
  redirectTo?: string;
  layout?: "default" | "workspace";
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
            const createdItem = await taskApi.addChecklistItem(created.id, item);
            for (const att of item.attachments ?? []) {
              if (!att._file) continue;
              try {
                await taskApi.uploadChecklistAttachment(created.id, createdItem.id, att._file);
              } catch {
                // keep going; checklist item already created
              }
            }
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
  const checklistOpen = (form.checklist ?? []).filter((i) => !isChecklistItemDone(i)).length;
  const defaultTab: TaskFormTab =
    mode === "edit" && (form.checklist?.length ?? 0) > 0 ? "checklist" : "basics";
  const [activeTab, setActiveTab] = useState<TaskFormTab>(defaultTab);

  function fieldAlert(key: string) {
    const msgs = fieldErrors[key];
    if (!msgs || msgs.length === 0) return null;
    return (
      <Alert variant="destructive" className="mt-1 py-1.5 px-2.5">
        <AlertDescription className="text-[11px]">{msgs[0]}</AlertDescription>
      </Alert>
    );
  }

  const isWorkspace = layout === "workspace";
  const edgePad = isWorkspace ? "px-3 sm:px-5 md:px-6" : "px-5 md:px-6";
  const edgeNeg = isWorkspace ? "-mx-3 sm:-mx-5 md:-mx-6" : "-mx-5 md:-mx-6";

  return (
    <div className="flex min-w-0 flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TaskFormTab)}
        className="flex flex-col gap-0"
      >
        <div
          className={cn(
            "sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
            edgeNeg,
            edgePad,
            isWorkspace ? "top-[3.25rem] z-[15] lg:top-0 lg:z-10" : undefined,
          )}
        >
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0 pb-px scrollbar-thin"
          >
            <TabsTrigger
              value="basics"
              className="shrink-0 rounded-none border-b-2 border-transparent px-2.5 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-3 sm:text-sm"
            >
              <FileText className="mr-1.5 size-3.5 opacity-60" />
              Basics
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="shrink-0 rounded-none border-b-2 border-transparent px-2.5 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-3 sm:text-sm"
            >
              <AlignLeft className="mr-1.5 size-3.5 opacity-60" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="checklist"
              className="shrink-0 rounded-none border-b-2 border-transparent px-2.5 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-3 sm:text-sm"
            >
              <ClipboardList className="mr-1.5 size-3.5 opacity-60" />
              Checklist
              <TabCount count={checklistOpen} />
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="shrink-0 rounded-none border-b-2 border-transparent px-2.5 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-3 sm:text-sm"
            >
              <CalendarClock className="mr-1.5 size-3.5 opacity-60" />
              Schedule
            </TabsTrigger>
            {mode === "edit" && task && (
              <TabsTrigger
                value="files"
                className="shrink-0 rounded-none border-b-2 border-transparent px-2.5 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-3 sm:text-sm"
              >
                <Paperclip className="mr-1.5 size-3.5 opacity-60" />
                Files
                <TabCount count={attachments.length} />
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <div
          className={cn(
            "py-4 pr-1 sm:py-5",
            edgePad,
            isWorkspace
              ? "max-h-none overflow-visible"
              : "max-h-[calc(100vh-15rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
          )}
        >
          <TabsContent value="basics" className="mt-0 space-y-4 focus-visible:ring-0">
            <p className="text-[11px] text-muted-foreground">Title, status, and week context for this note.</p>
            <div className="space-y-2">
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="What needs to be done?"
                className={cn("rounded-lg bg-background text-sm", fieldErrors.title && "border-destructive")}
                autoFocus={activeTab === "basics"}
              />
              {fieldAlert("title")}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-week-label">Week label</Label>
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
                  <SelectTrigger id="task-status" className={cn("rounded-lg bg-background text-sm", fieldErrors.status && "border-destructive")}>
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
          </TabsContent>

          <TabsContent value="content" className="mt-0 space-y-4 focus-visible:ring-0">
            <p className="text-[11px] text-muted-foreground">Description and meeting notes — markdown supported.</p>
            <div className="space-y-2">
              <Label htmlFor="task-content">Description</Label>
              <Textarea
                id="task-content"
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Add details, requirements, or notes..."
                rows={6}
                className={cn("min-h-[120px] resize-y rounded-lg bg-background text-sm", fieldErrors.content && "border-destructive")}
              />
              {fieldAlert("content")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-notes">Meeting notes</Label>
              <Textarea
                id="task-notes"
                value={form.notes ?? ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Agenda, decisions, action points..."
                rows={8}
                className="min-h-[160px] resize-y rounded-lg bg-background text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-0 focus-visible:ring-0">
            <ChecklistEditor
              items={form.checklist ?? []}
              onChange={(itemsOrFn) => {
                setForm((prev) => ({
                  ...prev,
                  checklist:
                    typeof itemsOrFn === "function"
                      ? itemsOrFn(prev.checklist ?? [])
                      : itemsOrFn,
                }));
              }}
              taskId={mode === "edit" && task ? task.id : undefined}
              assignableUsers={assignableUsers}
              readonly={task?.status === "published"}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0 space-y-5 focus-visible:ring-0">
            <p className="text-[11px] text-muted-foreground">Due dates, priority, progress, and ownership.</p>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={form.due_date ?? ""}
                  onChange={(e) => updateField("due_date", e.target.value || null)}
                  className={cn("rounded-lg bg-background text-sm", fieldErrors.due_date && "border-destructive")}
                />
                {fieldAlert("due_date")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-label">Due label</Label>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 border-t border-border/50 pt-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-assignee" className="flex items-center gap-1.5">
                  <User className="size-3.5 opacity-60" />
                  Assignee
                </Label>
                <Select
                  value={form.assignee || "unassigned_value_placeholder"}
                  onValueChange={(v) => updateField("assignee", v === "unassigned_value_placeholder" ? null : v)}
                  disabled={usersLoading}
                >
                  <SelectTrigger id="task-assignee" className={cn("rounded-lg bg-background text-sm", fieldErrors.assignee && "border-destructive")}>
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
                <Label htmlFor="task-team">Assigned team</Label>
                <Select
                  value={form.assigned_team ?? ""}
                  onValueChange={(v) => updateField("assigned_team", v || null)}
                >
                  <SelectTrigger id="task-team" className={cn("rounded-lg bg-background text-sm", fieldErrors.assigned_team && "border-destructive")}>
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
          </TabsContent>

          {mode === "edit" && task && (
            <TabsContent value="files" className="mt-0 space-y-4 focus-visible:ring-0">
              <p className="text-[11px] text-muted-foreground">Images and documents attached to this task.</p>
              <TaskAttachmentsGrid
                attachments={attachments}
                taskId={task.id}
                onUploaded={(a) => setAttachments((prev) => [...prev, a])}
                onDeleted={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
                readonly={task.status === "published"}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* ── Sticky footer action bar ──────────────────────────── */}
      <div
        className={cn(
          "sticky bottom-0 z-10 mt-2 border-t bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          edgeNeg,
          edgePad,
          isWorkspace && "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[11px] text-muted-foreground sm:text-left">
            {mode === "create" ? "New weekly note" : `Saving changes to ref ${task?.id.slice(0, 8)}`}
          </p>
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Button variant="outline" className="min-w-0 flex-1 sm:flex-none" onClick={() => router.push(cancelHref)}>
              Cancel
            </Button>
            <Button className="min-w-0 flex-1 sm:flex-none" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {mode === "create" ? "Create task" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
