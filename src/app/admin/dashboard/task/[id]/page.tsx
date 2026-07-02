"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Loader2,
  Calendar,
  User,
  Clock,
  Pencil,
  Trash2,
  FileText,
  ImageIcon,
  CheckCircle2,
  Circle,
  Download,
  Plus,
  Check,
  X,
  ListChecks,
  ScrollText,
  History,
  ArrowLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TaskForm } from "@/app/task/_components/task-form";
import { TaskAttachmentsGrid } from "@/app/task/_components/task-attachments";
import { TaskFileUpload } from "@/app/task/_components/task-file-upload";
import { usePageView } from "@/hooks/use-page-view";
import { taskData } from "@/data/tasks";
import { taskApi } from "@/lib/task-api";
import type { TaskDetail, TaskAttachment } from "@/types/tasks";
import type { ChecklistItemApi } from "@/types/notes";

import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { SetBreadcrumbTitle } from "@/app/admin/dashboard/_components/breadcrumb/breadcrumb-title-context";

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  draft: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: "Draft" },
  audited: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "In Progress" },
  published: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", label: "Published" },
};

function safeFormat(date: string | Date | undefined | null, fmt: string, fallback = ""): string {
  if (!date) return fallback;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return format(d, fmt);
  } catch {
    return fallback;
  }
}

function sortChecklist(items: ChecklistItemApi[]) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));
}

function ChecklistRow({
  item,
  toggling,
  saving,
  editing,
  editingText,
  onToggle,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditTextChange,
  onDelete,
}: {
  item: ChecklistItemApi;
  toggling: boolean;
  saving: boolean;
  editing: boolean;
  editingText: string;
  onToggle: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onEditTextChange: (value: string) => void;
  onDelete: () => void;
}) {
  const completed = item.is_completed;

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
        completed
          ? "border-border/30 bg-muted/20"
          : "border-border/50 bg-card hover:border-border hover:bg-muted/10"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={toggling}
        className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-muted"
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        {toggling ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : completed ? (
          <CheckCircle2 className="size-4 text-emerald-600" />
        ) : (
          <Circle className="size-4 text-muted-foreground group-hover:text-primary" />
        )}
      </button>

      {editing ? (
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Input
            value={editingText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditSave();
              if (e.key === "Escape") onEditCancel();
            }}
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="button" size="icon" variant="ghost" className="size-7 shrink-0" onClick={onEditSave} disabled={saving}>
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          </Button>
          <Button type="button" size="icon" variant="ghost" className="size-7 shrink-0" onClick={onEditCancel}>
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={`min-w-0 flex-1 text-sm leading-snug ${
              completed ? "text-muted-foreground/70 line-through decoration-muted-foreground/50" : "text-foreground"
            }`}
          >
            {item.text}
          </span>
          <div className="flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
            <Button type="button" size="icon" variant="ghost" className="size-7" onClick={onEditStart} title="Edit">
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              disabled={saving}
              title="Delete"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  usePageView();
  const { id } = use(params);
  const router = useRouter();
  const routeBase = useRouteBase();
  const taskListHref = getFullUrl(routeBase, "/dashboard/task");
  const { isLoggedIn } = useAuth();

  const exportRef = useRef<HTMLDivElement>(null);
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportingCalendar, setExportingCalendar] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItemApi[]>([]);
  const [togglingItem, setTogglingItem] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState("");
  const [savingItem, setSavingItem] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [activeTab, setActiveTab] = useState("tasks");

  const pendingItems = useMemo(
    () => sortChecklist(checklistItems.filter((i) => !i.is_completed)),
    [checklistItems],
  );
  const doneItems = useMemo(
    () => sortChecklist(checklistItems.filter((i) => i.is_completed)),
    [checklistItems],
  );
  const completedCount = doneItems.length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [exportOpen]);

  async function handleExportCalendar() {
    setExportingCalendar(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiBase}/notes/${id}/export_calendar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Export failed" }));
        throw new Error(err.detail || "Export failed");
      }
      const data = await res.json();
      if (data.htmlLink) {
        window.open(data.htmlLink, "_blank");
        toast.success("Calendar event created");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export to calendar");
    } finally {
      setExportingCalendar(false);
      setExportOpen(false);
    }
  }

  const fetchTask = useCallback(async () => {
    try {
      const data = await taskData.tasks.fetchById(id);
      setTask(data);
      setChecklistItems(data.checklist_items ?? []);
      setAttachments(data.attachments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    fetchTask();
  }, [id, isLoggedIn, fetchTask]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await taskApi.delete(id);
      toast.success("Task deleted");
      router.push(taskListHref);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function handleToggleChecklist(itemId: string, currentCompleted: boolean) {
    const nextCompleted = !currentCompleted;
    setTogglingItem(itemId);
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, is_completed: nextCompleted } : item)),
    );
    try {
      const updated = await taskApi.updateChecklistItem(id, itemId, { is_completed: nextCompleted });
      setChecklistItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (err) {
      setChecklistItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, is_completed: currentCompleted } : item)),
      );
      toast.error(err instanceof Error ? err.message : "Failed to update checklist item");
    } finally {
      setTogglingItem(null);
    }
  }

  function handleEditStart(item: ChecklistItemApi) {
    setEditingItemId(item.id);
    setEditingItemText(item.text);
  }

  function handleEditCancel() {
    setEditingItemId(null);
    setEditingItemText("");
  }

  async function handleEditSave(itemId: string) {
    const trimmed = editingItemText.trim();
    if (!trimmed) return;
    setSavingItem(itemId);
    try {
      const updated = await taskApi.updateChecklistItem(id, itemId, { text: trimmed });
      setChecklistItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
      setEditingItemId(null);
      setEditingItemText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update checklist item");
    } finally {
      setSavingItem(null);
    }
  }

  async function handleDeleteItem(itemId: string) {
    setSavingItem(itemId);
    try {
      await taskApi.deleteChecklistItem(id, itemId);
      setChecklistItems((prev) => prev.filter((item) => item.id !== itemId));
      if (editingItemId === itemId) handleEditCancel();
      toast.success("Checklist item removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete checklist item");
    } finally {
      setSavingItem(null);
    }
  }

  async function handleAddItem() {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    setAddingItem(true);
    try {
      const newItem = await taskApi.addChecklistItem(id, trimmed);
      setChecklistItems((prev) => [...prev, newItem]);
      setNewItemText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add checklist item");
    } finally {
      setAddingItem(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center">
        <Card className="w-full text-center">
          <CardContent className="py-12">
            <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to view tasks.</p>
            <Button asChild>
              <a href={`/budgethub/auth/login?next=${getFullUrl(routeBase, `/dashboard/task/${id}`)}`}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <p className="text-destructive">{error || "Task not found"}</p>
            <Button variant="outline" asChild>
              <Link href={taskListHref}>Back to Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <SetBreadcrumbTitle title={`Edit: ${task.title}`} />
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="-ml-2 w-fit">
          <ArrowLeft className="mr-1 size-4" />
          Back to task
        </Button>
        <TaskForm
          mode="edit"
          task={task}
          redirectTo={getFullUrl(routeBase, `/dashboard/task/${id}`)}
          onSaved={() => {
            setEditing(false);
            setLoading(true);
            fetchTask();
          }}
        />
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[task.status] ?? STATUS_STYLES.draft;
  const checklistProgress =
    checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SetBreadcrumbTitle title={task.title} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusStyle.bg} variant="outline">
              {statusStyle.label}
            </Badge>
            {task.week_label && (
              <span className="text-xs text-muted-foreground">{task.week_label}</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{task.title}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" />
              {task.author_name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {safeFormat(task.created_at, "MMM d, yyyy")}
            </span>
            {task.due_date && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Due {safeFormat(task.due_date, "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="relative" ref={exportRef}>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(!exportOpen)}>
              <Download className="mr-1 size-3.5" />
              Export
            </Button>
            {exportOpen && (
              <div className="absolute right-0 z-50 mt-1 w-52 rounded-lg border border-border/50 bg-popover p-1 shadow-lg">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || ""}/notes/${id}/download_markdown/`}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                  download
                  onClick={() => setExportOpen(false)}
                >
                  <FileText className="size-4" />
                  Download Markdown
                </a>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || ""}/notes/${id}/download_pdf/`}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                  download
                  onClick={() => setExportOpen(false)}
                >
                  <FileText className="size-4" />
                  Download PDF
                </a>
                <button
                  type="button"
                  onClick={handleExportCalendar}
                  disabled={exportingCalendar}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
                >
                  {exportingCalendar ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Calendar className="size-4" />
                  )}
                  Export to Google Calendar
                </button>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-1 size-3.5" />
            Edit
          </Button>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1 size-3.5" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete task</DialogTitle>
                <DialogDescription>
                  Delete &ldquo;{task.title}&rdquo;? This removes the task, checklist, and attachments permanently.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {deleting ? "Deleting…" : "Delete task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Meta chips */}
      {(task.assignee || task.assigned_team || task.due_label) && (
        <div className="flex flex-wrap gap-2">
          {task.assignee && <Badge variant="secondary">{task.assignee}</Badge>}
          {task.assigned_team && <Badge variant="outline">{task.assigned_team}</Badge>}
          {task.due_label && <Badge variant="secondary">{task.due_label}</Badge>}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg border bg-muted/30 p-1">
          <TabsTrigger value="tasks" className="gap-1.5">
            <ListChecks className="size-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5">
            <ScrollText className="size-3.5" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-1.5">
            <ImageIcon className="size-3.5" />
            Files ({attachments.length})
          </TabsTrigger>
          {task.audit_trails && task.audit_trails.length > 0 && (
            <TabsTrigger value="audit" className="gap-1.5">
              <History className="size-3.5" />
              Audit
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-4">
          {(task.content || typeof task.progress === "number") && (
            <Card>
              <CardContent className="space-y-4 p-5">
                {task.content && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{task.content}</p>
                  </div>
                )}
                {typeof task.progress === "number" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall progress</span>
                      <span className="font-medium tabular-nums">{task.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(100, task.progress)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Checklist</CardTitle>
                  <CardDescription>
                    {completedCount} of {checklistItems.length} complete
                    {checklistProgress !== null ? ` · ${checklistProgress}%` : ""}
                  </CardDescription>
                </div>
              </div>
              {checklistItems.length > 0 && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500/80 transition-all"
                    style={{ width: `${checklistProgress ?? 0}%` }}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-5 px-5 pb-5">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">To do</p>
                {pendingItems.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border/50 px-3 py-4 text-center text-sm text-muted-foreground">
                    {checklistItems.length === 0 ? "No checklist items yet." : "All items completed."}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingItems.map((item) => (
                      <ChecklistRow
                        key={item.id}
                        item={item}
                        toggling={togglingItem === item.id}
                        saving={savingItem === item.id}
                        editing={editingItemId === item.id}
                        editingText={editingItemText}
                        onToggle={() => handleToggleChecklist(item.id, item.is_completed)}
                        onEditStart={() => handleEditStart(item)}
                        onEditCancel={handleEditCancel}
                        onEditSave={() => handleEditSave(item.id)}
                        onEditTextChange={setEditingItemText}
                        onDelete={() => handleDeleteItem(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {doneItems.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Done</p>
                    <div className="space-y-2">
                      {doneItems.map((item) => (
                        <ChecklistRow
                          key={item.id}
                          item={item}
                          toggling={togglingItem === item.id}
                          saving={savingItem === item.id}
                          editing={editingItemId === item.id}
                          editingText={editingItemText}
                          onToggle={() => handleToggleChecklist(item.id, item.is_completed)}
                          onEditStart={() => handleEditStart(item)}
                          onEditCancel={handleEditCancel}
                          onEditSave={() => handleEditSave(item.id)}
                          onEditTextChange={setEditingItemText}
                          onDelete={() => handleDeleteItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/10 px-3 py-2">
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                  }}
                  placeholder="Add checklist item…"
                  className="h-9 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={addingItem || !newItemText.trim()}
                  className="shrink-0"
                >
                  {addingItem ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Attachments</CardTitle>
              <CardDescription>{attachments.length} file{attachments.length === 1 ? "" : "s"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              <TaskAttachmentsGrid
                attachments={attachments}
                taskId={id}
                onDeleted={(aId) => setAttachments((prev) => prev.filter((a) => a.id !== aId))}
              />
              <div className="rounded-lg border border-dashed border-border/50 p-4">
                <TaskFileUpload taskId={id} onUploaded={(a) => setAttachments((prev) => [...prev, a])} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardContent className="p-5">
              {task.notes ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.notes}</ReactMarkdown>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No meeting notes yet.{" "}
                  <button type="button" className="text-primary underline-offset-4 hover:underline" onClick={() => setEditing(true)}>
                    Add notes
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <TaskAttachmentsGrid
                attachments={attachments}
                taskId={id}
                onDeleted={(aId) => setAttachments((prev) => prev.filter((a) => a.id !== aId))}
              />
              <div className="rounded-lg border border-dashed border-border/50 p-4">
                <TaskFileUpload taskId={id} onUploaded={(a) => setAttachments((prev) => [...prev, a])} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {task.audit_trails && task.audit_trails.length > 0 && (
          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardContent className="space-y-2 p-5">
                {task.audit_trails.map((trail, i) => (
                  <div key={i} className="rounded-lg border border-border/50 p-3 text-sm">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium capitalize">{trail.action}</span>
                      <span>{safeFormat(trail.created_at, "MMM d, HH:mm")}</span>
                    </div>
                    {trail.comment && <p>{trail.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
