"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight, GripVertical, Loader2, Paperclip, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskApi } from "@/lib/task-api";
import type { AssignableUser, ChecklistItem, ChecklistItemStatus, TaskPriority } from "@/types/tasks";

function genId() {
  return `local-${Math.random().toString(36).slice(2, 9)}`;
}

function isPersistedId(id: string) {
  return !id.startsWith("local-");
}

const STATUS_OPTIONS: { value: ChecklistItemStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

export function ChecklistEditor({
  items,
  onChange,
  taskId,
  assignableUsers = [],
  readonly = false,
}: {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  taskId?: string;
  assignableUsers?: AssignableUser[];
  readonly?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [previewTab, setPreviewTab] = useState<Record<string, "write" | "preview">>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    taskApi.listChecklistItems(taskId)
      .then((apiItems) => {
        if (apiItems.length > 0) onChange(apiItems);
      })
      .catch(() => toast.error("Failed to load checklist items"));
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addItem() {
    const item: ChecklistItem = {
      id: genId(),
      title: "",
      text: "",
      checked: false,
      status: "todo",
      description_text: "",
      progress: 0,
      priority: "medium",
      attachments: [],
    };
    onChange([...items, item]);
    setExpanded((prev) => ({ ...prev, [item.id]: true }));
  }

  async function persistItem(id: string, patch: Partial<ChecklistItem>) {
    if (!taskId) return;
    const current = items.find((i) => i.id === id);
    if (!current) return;
    try {
      if (isPersistedId(id)) {
        const updated = await taskApi.updateChecklistItem(taskId, id, patch);
        onChange(items.map((i) => (i.id === id ? updated : i)));
      } else {
        const created = await taskApi.addChecklistItem(taskId, { ...current, ...patch });
        onChange(items.map((i) => (i.id === id ? created : i)));
        setExpanded((prev) => {
          const next = { ...prev };
          if (next[id]) {
            next[created.id] = true;
            delete next[id];
          }
          return next;
        });
      }
    } catch {
      toast.error("Failed to save checklist item");
    }
  }

  function updateItem(id: string, patch: Partial<ChecklistItem>) {
    const next = items.map((i) => {
      if (i.id !== id) return i;
      const merged = { ...i, ...patch };
      if (patch.title !== undefined) merged.text = patch.title;
      if (patch.text !== undefined) merged.title = patch.text;
      if (patch.checked !== undefined) {
        merged.status = patch.checked ? "done" : merged.status === "done" ? "todo" : merged.status;
      }
      if (patch.status !== undefined) {
        merged.checked = patch.status === "done";
      }
      return merged;
    });
    onChange(next);
    if (taskId) void persistItem(id, patch);
  }

  async function removeItem(id: string) {
    if (taskId && isPersistedId(id)) {
      try {
        await taskApi.deleteChecklistItem(taskId, id);
      } catch {
        toast.error("Failed to delete checklist item");
        return;
      }
    }
    onChange(items.filter((i) => i.id !== id));
  }

  async function handleUpload(id: string, file: File) {
    if (!taskId || !isPersistedId(id)) {
      toast.error("Save the item before uploading files");
      return;
    }
    setUploading(id);
    try {
      const attachment = await taskApi.uploadChecklistAttachment(taskId, id, file);
      const current = items.find((i) => i.id === id);
      if (!current) return;
      const attachments = [...(current.attachments ?? []), {
        id: attachment.id,
        url: attachment.url ?? "",
        file_name: attachment.file_name,
        file_size: attachment.file_size,
        content_type: attachment.content_type,
        is_image: attachment.is_image,
        uploaded_by_name: attachment.uploaded_by_name,
        created_at: attachment.created_at,
      }];
      onChange(items.map((i) => (i.id === id ? { ...i, attachments, attachment_count: attachments.length } : i)));
      toast.success("File uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Checklist Items</Label>
        {!readonly && (
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" />
            Add item
          </Button>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground py-2">
          No checklist items yet. Each item supports rich notes, files, assignee, and status tracking.
        </p>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const open = expanded[item.id] ?? false;
          const tab = previewTab[item.id] ?? "write";
          return (
            <div key={item.id} className="rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center gap-2 p-2">
                <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40" />
                <Checkbox
                  checked={item.checked || item.status === "done"}
                  disabled={readonly}
                  onCheckedChange={(checked) => updateItem(item.id, { checked: checked === true, status: checked ? "done" : "todo" })}
                />
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => toggleExpanded(item.id)}
                >
                  {open ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
                  <span className={`truncate text-sm font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    {item.title || item.text || "Untitled item"}
                  </span>
                  {item.attachment_count ? (
                    <span className="text-[10px] text-muted-foreground">{item.attachment_count} files</span>
                  ) : null}
                </button>
                {!readonly && (
                  <button
                    type="button"
                    onClick={() => void removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove checklist item"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>

              {open && (
                <div className="space-y-3 border-t border-border/50 p-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={item.title || item.text}
                      disabled={readonly}
                      onChange={(e) => updateItem(item.id, { title: e.target.value, text: e.target.value })}
                      placeholder="Short title for this sub-task"
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={item.status ?? "todo"}
                        disabled={readonly}
                        onValueChange={(v) => updateItem(item.id, { status: v as ChecklistItemStatus })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Priority</Label>
                      <Select
                        value={item.priority ?? "medium"}
                        disabled={readonly}
                        onValueChange={(v) => updateItem(item.id, { priority: v as TaskPriority })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Assignee</Label>
                      <Select
                        value={item.assignee || "unassigned"}
                        disabled={readonly}
                        onValueChange={(v) => updateItem(item.id, { assignee: v === "unassigned" ? null : v })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {assignableUsers.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.display_name || u.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Due date</Label>
                      <Input
                        type="date"
                        disabled={readonly}
                        value={item.due_date ?? ""}
                        onChange={(e) => updateItem(item.id, { due_date: e.target.value || null })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Details (markdown)</Label>
                      <div className="ml-auto flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={tab === "write" ? "secondary" : "ghost"}
                          className="h-6 px-2 text-[10px]"
                          onClick={() => setPreviewTab((prev) => ({ ...prev, [item.id]: "write" }))}
                        >
                          Write
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={tab === "preview" ? "secondary" : "ghost"}
                          className="h-6 px-2 text-[10px]"
                          onClick={() => setPreviewTab((prev) => ({ ...prev, [item.id]: "preview" }))}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                    {tab === "write" ? (
                      <Textarea
                        value={item.description_text ?? ""}
                        disabled={readonly}
                        onChange={(e) => updateItem(item.id, { description_text: e.target.value })}
                        placeholder="Add context, steps, links, and notes. Markdown supported."
                        rows={5}
                        className="text-sm"
                      />
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/50 bg-background p-3 text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.description_text || "_No content yet._"}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {!readonly && taskId && (
                    <div className="space-y-2">
                      <Label className="text-xs">Attachments</Label>
                      <div className="flex flex-wrap gap-2">
                        {(item.attachments ?? []).map((att) => (
                          <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted"
                          >
                            <Paperclip className="size-3" />
                            {att.file_name}
                          </a>
                        ))}
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                        {uploading === item.id ? <Loader2 className="size-3.5 animate-spin" /> : <Paperclip className="size-3.5" />}
                        Upload file or image
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleUpload(item.id, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
