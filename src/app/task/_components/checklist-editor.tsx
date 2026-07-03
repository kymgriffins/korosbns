"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/index";
import { taskApi } from "@/lib/task-api";
import type { AssignableUser, ChecklistItem, ChecklistItemStatus } from "@/types/tasks";
import { ChecklistItemFocus } from "./checklist-item-focus";
import { isChecklistItemDone, mergeChecklistOrder, partitionChecklistItems } from "./checklist-utils";

function genId() {
  return `local-${Math.random().toString(36).slice(2, 9)}`;
}

function isPersistedId(id: string) {
  return !id.startsWith("local-");
}

const STATUS_LABEL: Record<ChecklistItemStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

function ChecklistRow({
  item,
  readonly,
  isFocused,
  onOpen,
  onToggleDone,
}: {
  item: ChecklistItem;
  readonly?: boolean;
  isFocused?: boolean;
  onOpen: () => void;
  onToggleDone: (checked: boolean) => void;
}) {
  const done = isChecklistItemDone(item);
  const assigneeLabel = item.assignee_name?.split(" ")[0];

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg border px-2 py-2 transition-colors",
        isFocused ? "border-primary/40 bg-primary/5" : "border-border/50 bg-background hover:border-border hover:bg-muted/30",
        done && "opacity-75",
      )}
    >
      <Checkbox
        checked={done}
        disabled={readonly}
        onCheckedChange={(checked) => onToggleDone(checked === true)}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span className={cn("min-w-0 flex-1 truncate text-sm font-medium", done && "line-through text-muted-foreground")}>
          {item.title || item.text || "Untitled item"}
        </span>
        {item.status && item.status !== "todo" && (
          <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            {STATUS_LABEL[item.status]}
          </span>
        )}
        {assigneeLabel && (
          <span className="hidden shrink-0 text-[10px] text-muted-foreground md:inline">{assigneeLabel}</span>
        )}
        {(item.attachment_count ?? item.attachments?.length ?? 0) > 0 && (
          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
            {item.attachment_count ?? item.attachments?.length} files
          </span>
        )}
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export function ChecklistEditor({
  items,
  onChange,
  taskId,
  assignableUsers = [],
  readonly = false,
}: {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[] | ((prev: ChecklistItem[]) => ChecklistItem[])) => void;
  taskId?: string;
  assignableUsers?: AssignableUser[];
  readonly?: boolean;
}) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const persistSeqRef = useRef<Record<string, number>>({});
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function applyItemsChange(
    updater: ChecklistItem[] | ((prev: ChecklistItem[]) => ChecklistItem[]),
  ) {
    onChange(updater);
  }

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;
    taskApi.listChecklistItems(taskId)
      .then((apiItems) => {
        if (!cancelled && apiItems.length > 0) applyItemsChange(apiItems);
      })
      .catch(() => toast.error("Failed to load checklist items"));
    return () => {
      cancelled = true;
    };
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timers = debounceTimersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const focusedItem = focusedId ? items.find((i) => i.id === focusedId) : null;
  const { active, done } = partitionChecklistItems(items);

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
    applyItemsChange((prev) => [item, ...prev]);
    setFocusedId(item.id);
  }

  async function persistItem(id: string, patch: Partial<ChecklistItem>) {
    if (!taskId) return;
    const seq = (persistSeqRef.current[id] ?? 0) + 1;
    persistSeqRef.current[id] = seq;
    const current = items.find((i) => i.id === id);
    if (!current) return;
    try {
      if (isPersistedId(id)) {
        const updated = await taskApi.updateChecklistItem(taskId, id, patch);
        if (persistSeqRef.current[id] !== seq) return;
        applyItemsChange((prev) =>
          mergeChecklistOrder(
            prev.map((i) =>
              i.id === id
                ? {
                    ...updated,
                    description_text:
                      patch.description_text !== undefined ? i.description_text : updated.description_text,
                  }
                : i,
            ),
          ),
        );
      } else {
        const created = await taskApi.addChecklistItem(taskId, { ...current, ...patch });
        if (persistSeqRef.current[id] !== seq) return;
        const newId = created.id;
        applyItemsChange((prev) =>
          mergeChecklistOrder(
            prev.map((i) =>
              i.id === id
                ? {
                    ...created,
                    description_text:
                      patch.description_text !== undefined ? i.description_text : created.description_text,
                  }
                : i,
            ),
          ),
        );
        setFocusedId((currentFocus) => (currentFocus === id ? newId : currentFocus));
      }
    } catch {
      toast.error("Failed to save checklist item");
    }
  }

  function schedulePersist(id: string, patch: Partial<ChecklistItem>, delayMs = 450) {
    if (!taskId) return;
    const timers = debounceTimersRef.current;
    if (timers[id]) clearTimeout(timers[id]);
    timers[id] = setTimeout(() => {
      delete timers[id];
      void persistItem(id, patch);
    }, delayMs);
  }

  function updateItem(id: string, patch: Partial<ChecklistItem>, options?: { debounce?: boolean }) {
    applyItemsChange((prev) =>
      mergeChecklistOrder(
        prev.map((i) => {
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
        }),
      ),
    );

    if (!taskId) return;
    if (options?.debounce) {
      schedulePersist(id, patch);
      return;
    }
    void persistItem(id, patch);
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
    applyItemsChange((prev) => prev.filter((i) => i.id !== id));
    if (focusedId === id) setFocusedId(null);
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
      applyItemsChange((prev) =>
        prev.map((i) => (i.id === id ? { ...i, attachments, attachment_count: attachments.length } : i)),
      );
      toast.success("File uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  }

  if (focusedItem) {
    return (
      <ChecklistItemFocus
        item={focusedItem}
        assignableUsers={assignableUsers}
        readonly={readonly}
        taskId={taskId}
        uploading={uploading === focusedItem.id}
        onBack={() => setFocusedId(null)}
        onUpdate={(patch, options) => updateItem(focusedItem.id, patch, options)}
        onRemove={() => void removeItem(focusedItem.id)}
        onUpload={(file) => void handleUpload(focusedItem.id, file)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label className="text-sm font-medium">Sub-tasks</Label>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {active.length} open · {done.length} completed
          </p>
        </div>
        {!readonly && (
          <Button type="button" size="sm" onClick={addItem}>
            <Plus className="mr-1.5 size-3.5" />
            Add sub-task
          </Button>
        )}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">No sub-tasks yet.</p>
          {!readonly && (
            <Button type="button" variant="link" size="sm" className="mt-2" onClick={addItem}>
              Add the first one
            </Button>
          )}
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-1.5">
          {active.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              readonly={readonly}
              isFocused={focusedId === item.id}
              onOpen={() => setFocusedId(item.id)}
              onToggleDone={(checked) => updateItem(item.id, { checked, status: checked ? "done" : "todo" })}
            />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Completed · {done.length}
          </p>
          <div className="space-y-1.5">
            {done.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                readonly={readonly}
                onOpen={() => setFocusedId(item.id)}
                onToggleDone={(checked) => updateItem(item.id, { checked, status: checked ? "done" : "todo" })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
