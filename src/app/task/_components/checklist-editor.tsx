"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { taskApi } from "@/lib/task-api";
import type { AssignableUser, ChecklistItem, ChecklistItemStatus } from "@/types/tasks";
import { ChecklistItemFocus } from "./checklist-item-focus";
import { isChecklistItemDone, mergeChecklistOrder, partitionChecklistItems } from "./checklist-utils";
import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist";
import { fileToLocalAttachment, isLocalAttachmentId } from "@/lib/attachment-display";

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

  async function flushPendingUploads(
    serverItemId: string,
    currentAttachments: ChecklistItem["attachments"],
  ) {
    if (!taskId) return currentAttachments ?? [];
    const pending = (currentAttachments ?? []).filter((a) => a._file);
    let next = (currentAttachments ?? []).filter((a) => !a._file);
    for (const att of pending) {
      if (!att._file) continue;
      const uploaded = await taskApi.uploadChecklistAttachment(taskId, serverItemId, att._file);
      if (att.url.startsWith("blob:")) URL.revokeObjectURL(att.url);
      next = [
        ...next,
        {
          id: uploaded.id,
          url: uploaded.url ?? "",
          file_name: uploaded.file_name,
          file_size: uploaded.file_size,
          content_type: uploaded.content_type,
          is_image: uploaded.is_image,
          uploaded_by_name: uploaded.uploaded_by_name,
          created_at: uploaded.created_at,
        },
      ];
    }
    return next;
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
        const attachments = await flushPendingUploads(id, current.attachments);
        applyItemsChange((prev) =>
          mergeChecklistOrder(
            prev.map((i) =>
              i.id === id
                ? {
                    ...updated,
                    attachments,
                    attachment_count: attachments.length,
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
        const attachments = await flushPendingUploads(created.id, current.attachments);
        const newId = created.id;
        applyItemsChange((prev) =>
          mergeChecklistOrder(
            prev.map((i) =>
              i.id === id
                ? {
                    ...created,
                    attachments,
                    attachment_count: attachments.length,
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

  async function handleUpload(id: string, files: File[]) {
    if (!files.length) return;

    if (!taskId || !isPersistedId(id)) {
      applyItemsChange((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const added = files.map((file) => fileToLocalAttachment(file));
          const attachments = [...(i.attachments ?? []), ...added];
          return { ...i, attachments, attachment_count: attachments.length };
        }),
      );
      toast.success(files.length === 1 ? "File added" : `${files.length} files added`);
      return;
    }

    setUploading(id);
    try {
      let attachments = [...(items.find((i) => i.id === id)?.attachments ?? [])];
      for (const file of files) {
        const attachment = await taskApi.uploadChecklistAttachment(taskId, id, file);
        attachments = [
          ...attachments,
          {
            id: attachment.id,
            url: attachment.url ?? "",
            file_name: attachment.file_name,
            file_size: attachment.file_size,
            content_type: attachment.content_type,
            is_image: attachment.is_image,
            uploaded_by_name: attachment.uploaded_by_name,
            created_at: attachment.created_at,
          },
        ];
      }
      applyItemsChange((prev) =>
        prev.map((i) => (i.id === id ? { ...i, attachments, attachment_count: attachments.length } : i)),
      );
      toast.success(files.length === 1 ? "File uploaded" : `${files.length} files uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleDeleteAttachment(itemId: string, attachmentId: string) {
    const item = items.find((i) => i.id === itemId);
    const att = item?.attachments?.find((a) => a.id === attachmentId);

    if (isLocalAttachmentId(attachmentId)) {
      if (att?.url.startsWith("blob:")) URL.revokeObjectURL(att.url);
      applyItemsChange((prev) =>
        prev.map((i) => {
          if (i.id !== itemId) return i;
          const attachments = (i.attachments ?? []).filter((a) => a.id !== attachmentId);
          return { ...i, attachments, attachment_count: attachments.length };
        }),
      );
      return;
    }

    if (taskId && isPersistedId(itemId)) {
      try {
        await taskApi.deleteChecklistAttachment(taskId, itemId, attachmentId);
      } catch {
        toast.error("Failed to delete attachment");
        return;
      }
    }

    applyItemsChange((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const attachments = (i.attachments ?? []).filter((a) => a.id !== attachmentId);
        return { ...i, attachments, attachment_count: attachments.length };
      }),
    );
    toast.success("Attachment removed");
  }

  if (focusedItem) {
    return (
      <ChecklistItemFocus
        item={focusedItem}
        assignableUsers={assignableUsers}
        readonly={readonly}
        uploading={uploading === focusedItem.id}
        onBack={() => setFocusedId(null)}
        onUpdate={(patch, options) => updateItem(focusedItem.id, patch, options)}
        onRemove={() => void removeItem(focusedItem.id)}
        onUpload={(files) => void handleUpload(focusedItem.id, files)}
        onDeleteAttachment={(attachmentId) => void handleDeleteAttachment(focusedItem.id, attachmentId)}
        pendingHint={
          !taskId || !isPersistedId(focusedItem.id)
            ? "Files are stored on this device until the task and sub-task are saved."
            : undefined
        }
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

      <PlayfulTodolist
        items={items.map((item) => ({
          id: item.id,
          label: item.title || item.text || "Untitled item",
          checked: isChecklistItemDone(item),
          hint: [
            item.assignee_name,
            item.status && item.status !== "todo" ? STATUS_LABEL[item.status] : null,
            (item.attachment_count ?? item.attachments?.length ?? 0) > 0
              ? `${item.attachment_count ?? item.attachments?.length} files`
              : null,
          ]
            .filter(Boolean)
            .join(" · ") || undefined,
        }))}
        onToggle={
          readonly
            ? undefined
            : (id, checked) => updateItem(id, { checked, status: checked ? "done" : "todo" })
        }
        onSelect={(id) => setFocusedId(id)}
        onAdd={readonly ? undefined : addItem}
        disabled={readonly}
        emptyLabel="No sub-tasks yet — add the first one to start this week."
        addLabel="Add sub-task"
      />
    </div>
  );
}
