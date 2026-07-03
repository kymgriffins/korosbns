"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Loader2, Paperclip, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/index";
import type { AssignableUser, ChecklistItem, ChecklistItemStatus, TaskPriority } from "@/types/tasks";
import { isChecklistItemDone } from "./checklist-utils";

const STATUS_OPTIONS: { value: ChecklistItemStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

export function ChecklistItemFocus({
  item,
  assignableUsers,
  readonly,
  taskId,
  uploading,
  onBack,
  onUpdate,
  onRemove,
  onUpload,
}: {
  item: ChecklistItem;
  assignableUsers: AssignableUser[];
  readonly?: boolean;
  taskId?: string;
  uploading?: boolean;
  onBack: () => void;
  onUpdate: (patch: Partial<ChecklistItem>, options?: { debounce?: boolean }) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const title = item.title || item.text || "Untitled item";
  const done = isChecklistItemDone(item);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm" aria-label="Checklist navigation">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Checklist
        </button>
        <span className="text-muted-foreground/50" aria-hidden>
          /
        </span>
        <span className={cn("truncate font-medium", done && "text-muted-foreground line-through")}>
          {title}
        </span>
      </nav>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm",
          done && "opacity-90",
        )}
      >
        <div
          className="absolute inset-y-0 left-0 w-1 bg-primary/80"
          style={{ background: done ? "var(--muted-foreground)" : undefined }}
          aria-hidden
        />

        <div className="space-y-5 p-4 pl-5 md:p-5 md:pl-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Checkbox
                checked={done}
                disabled={readonly}
                className="mt-1"
                onCheckedChange={(checked) =>
                  onUpdate({ checked: checked === true, status: checked ? "done" : "todo" })
                }
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Sub-task
                </p>
                <Input
                  value={item.title || item.text}
                  disabled={readonly}
                  onChange={(e) => onUpdate({ title: e.target.value, text: e.target.value })}
                  placeholder="What needs to happen?"
                  className="h-9 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!readonly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={onRemove}
                  aria-label="Remove sub-task"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
              <Button type="button" variant="secondary" size="sm" onClick={onBack}>
                Done editing
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={item.status ?? "todo"}
                disabled={readonly}
                onValueChange={(v) => onUpdate({ status: v as ChecklistItemStatus })}
              >
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select
                value={item.priority ?? "medium"}
                disabled={readonly}
                onValueChange={(v) => onUpdate({ priority: v as TaskPriority })}
              >
                <SelectTrigger className="h-9 bg-background text-sm">
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
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Assignee</Label>
              <Select
                value={item.assignee || "unassigned"}
                disabled={readonly}
                onValueChange={(v) => onUpdate({ assignee: v === "unassigned" ? null : v })}
              >
                <SelectTrigger className="h-9 bg-background text-sm">
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
              <Label className="text-xs text-muted-foreground">Due date</Label>
              <Input
                type="date"
                disabled={readonly}
                value={item.due_date ?? ""}
                onChange={(e) => onUpdate({ due_date: e.target.value || null })}
                className="h-9 bg-background text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Details</Label>
              <div className="ml-auto flex gap-1 rounded-md border border-border/50 p-0.5">
                <Button
                  type="button"
                  size="sm"
                  variant={tab === "write" ? "secondary" : "ghost"}
                  className="h-7 px-2.5 text-[11px]"
                  onClick={() => setTab("write")}
                >
                  Write
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={tab === "preview" ? "secondary" : "ghost"}
                  className="h-7 px-2.5 text-[11px]"
                  onClick={() => setTab("preview")}
                >
                  Preview
                </Button>
              </div>
            </div>
            {tab === "write" ? (
              <Textarea
                value={item.description_text ?? ""}
                disabled={readonly}
                onChange={(e) => onUpdate({ description_text: e.target.value }, { debounce: true })}
                placeholder="Steps, links, context — markdown supported."
                rows={8}
                className="min-h-[160px] resize-y bg-background text-sm leading-relaxed"
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border/50 bg-muted/20 p-4 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.description_text || "_No content yet._"}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {!readonly && taskId && (
            <div className="space-y-2 border-t border-border/50 pt-4">
              <Label className="text-xs text-muted-foreground">Attachments</Label>
              <div className="flex flex-wrap gap-2">
                {(item.attachments ?? []).map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-[11px] hover:bg-muted/50"
                  >
                    <Paperclip className="size-3" />
                    {att.file_name}
                  </a>
                ))}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Paperclip className="size-3.5" />}
                Upload file or image
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
