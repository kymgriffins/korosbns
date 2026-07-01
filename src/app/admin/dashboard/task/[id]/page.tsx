"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Calendar, User, Clock, Pencil, Trash2, ArrowLeft, FileText, ImageIcon, CheckCircle2, Circle, Download, Plus, Check, X } from "lucide-react";
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
import { AdminTaskBreadcrumbs } from "@/components/admin/admin-task-breadcrumb";

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

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  usePageView();
  const { id } = use(params);
  const router = useRouter();
  const routeBase = useRouteBase();
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
  const [activeSection, setActiveSection] = useState("task");

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
        headers: {
          "Content-Type": "application/json",
        },
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
      router.push(getFullUrl(routeBase, "/dashboard/task"));
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function handleToggleChecklist(itemId: string, currentCompleted: boolean) {
    setTogglingItem(itemId);
    try {
      const updated = await taskApi.updateChecklistItem(id, itemId, {
        is_completed: !currentCompleted,
      });
      setChecklistItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated : item)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update checklist item";
      toast.error(msg);
      console.error("Checklist toggle error:", err);
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
      const msg = err instanceof Error ? err.message : "Failed to update checklist item";
      toast.error(msg);
      console.error("Checklist edit error:", err);
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete checklist item";
      toast.error(msg);
      console.error("Checklist delete error:", err);
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
      const msg = err instanceof Error ? err.message : "Failed to add checklist item";
      toast.error(msg);
      console.error("Checklist add error:", err);
    } finally {
      setAddingItem(false);
    }
  }

  function handleAttachmentDeleted(attachmentId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }

  function handleAttachmentUploaded(attachment: TaskAttachment) {
    setAttachments((prev) => [...prev, attachment]);
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-6">
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
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <AdminTaskBreadcrumbs />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <AdminTaskBreadcrumbs />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <p className="text-destructive">{error || "Task not found"}</p>
            <Button variant="outline" asChild>
              <Link href={getFullUrl(routeBase, "/dashboard/task")}>Back to Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <AdminTaskBreadcrumbs />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1 size-4" />
          Back to task
        </Button>
        <TaskForm
          mode="edit"
          task={task}
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
  const completedCount = checklistItems.filter((i) => i.is_completed).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminTaskBreadcrumbs />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative" ref={exportRef}>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(!exportOpen)}>
              <Download className="mr-1 size-3.5" />
              Export
            </Button>
            {exportOpen && (
              <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-border/50 bg-popover p-1 shadow-lg">
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
                  onClick={() => handleExportCalendar()}
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
          {task.status !== "published" && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 size-3.5" />
              Edit
            </Button>
          )}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1 size-3.5" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            {task.week_label && (
              <CardDescription>{task.week_label}</CardDescription>
            )}
          </div>
          <Badge className={`shrink-0 ${statusStyle.bg}`} variant="outline">
            {statusStyle.label}
          </Badge>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="task" className="gap-1.5">
                <FileText className="size-3.5" /> Task
              </TabsTrigger>
              <TabsTrigger value="meeting" className="gap-1.5">
                <FileText className="size-3.5" /> Meeting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="task" className="space-y-8">
              {/* Meta bar */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="size-3.5" />
                  {task.author_name}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {safeFormat(task.created_at, "MMM d, yyyy")}
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    Due {safeFormat(task.due_date, "MMM d, yyyy")}
                  </div>
                )}
                {task.assignee && (
                  <Badge variant="secondary" className="text-xs">{task.assignee}</Badge>
                )}
                {task.assigned_team && (
                  <Badge variant="outline" className="text-xs">{task.assigned_team}</Badge>
                )}
                {task.due_label && (
                  <Badge variant="secondary" className="text-xs">{task.due_label}</Badge>
                )}
              </div>

              {/* Description */}
              {task.content && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <FileText className="size-4" />
                    Description
                  </h3>
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground">{task.content}</div>
                </div>
              )}

              {/* Checklist Items with inline edit */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <CheckCircle2 className="size-4" />
                  Checklist ({completedCount}/{checklistItems.length})
                </h3>
                <div className="space-y-1.5">
                  {checklistItems
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 transition-colors hover:bg-muted/30 group"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleChecklist(item.id, item.is_completed)}
                          disabled={togglingItem === item.id}
                          className="shrink-0"
                        >
                          {togglingItem === item.id ? (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                          ) : item.is_completed ? (
                            <CheckCircle2 className="size-4 text-emerald-500" />
                          ) : (
                            <Circle className="size-4 text-muted-foreground hover:text-primary" />
                          )}
                        </button>

                        {editingItemId === item.id ? (
                          <div className="flex flex-1 items-center gap-1">
                            <Input
                              value={editingItemText}
                              onChange={(e) => setEditingItemText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEditSave(item.id);
                                if (e.key === "Escape") handleEditCancel();
                              }}
                              className="h-8 text-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleEditSave(item.id)}
                              disabled={savingItem === item.id}
                              className="shrink-0 rounded p-1 text-muted-foreground hover:text-emerald-500"
                            >
                              {savingItem === item.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`flex-1 text-sm ${
                                item.is_completed
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }`}
                            >
                              {item.text}
                            </span>
                            <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleEditStart(item)}
                                className="rounded p-1 text-muted-foreground hover:text-foreground"
                                title="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              {task.status !== "published" && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={savingItem === item.id}
                                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                                  title="Delete"
                                >
                                  {savingItem === item.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>

                {/* Add new item */}
                {task.status !== "published" && (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/50 px-3 py-2">
                    <Input
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddItem();
                      }}
                      placeholder="Add a checklist item..."
                      className="h-8 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleAddItem}
                      disabled={addingItem || !newItemText.trim()}
                      className="shrink-0 h-7 px-2"
                    >
                      {addingItem ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {typeof task.progress === "number" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
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

              {/* Attachments */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <ImageIcon className="size-4" />
                  Attachments ({attachments.length})
                </h3>
                <TaskAttachmentsGrid
                  attachments={attachments}
                  taskId={id}
                  onDeleted={handleAttachmentDeleted}
                  readonly={task.status === "published"}
                />
                {task.status !== "published" && (
                  <div className="rounded-lg border border-dashed border-border/50 p-4">
                    <TaskFileUpload taskId={id} onUploaded={handleAttachmentUploaded} />
                  </div>
                )}
              </div>

              {/* Audit trail */}
              {task.audit_trails && task.audit_trails.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Audit Trail</h3>
                  {task.audit_trails.map((trail, i) => (
                    <div key={i} className="rounded-lg border border-border/50 p-3 text-sm">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium capitalize">{trail.action}</span>
                        <span>{safeFormat(trail.created_at, "MMM d, HH:mm")}</span>
                      </div>
                      {trail.comment && <p className="text-sm">{trail.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="meeting" className="space-y-4">
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <FileText className="size-4" />
                  Meeting Notes
                </h3>
                {task.notes ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {task.notes}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">No meeting notes for this task.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
