"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AttachmentField } from "@/components/attachments/attachment-field";
import { taskData } from "@/data/tasks";
import type { TaskAttachment } from "@/types/tasks";

export function TaskAttachmentsGrid({
  attachments,
  taskId,
  onDeleted,
  onUploaded,
  readonly = false,
}: {
  attachments: TaskAttachment[];
  taskId: string;
  onDeleted?: (id: string) => void;
  onUploaded?: (attachment: TaskAttachment) => void;
  readonly?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <AttachmentField
      attachments={attachments}
      readonly={readonly}
      uploading={uploading}
      emptyHint="No attachments yet. Add images or documents below."
      onUpload={
        readonly
          ? undefined
          : async (files) => {
              setUploading(true);
              try {
                for (const file of files) {
                  const uploaded = await taskData.tasks.uploadAttachment(taskId, file);
                  onUploaded?.(uploaded);
                }
                toast.success(files.length === 1 ? "File uploaded" : `${files.length} files uploaded`);
              } catch {
                toast.error("Failed to upload files");
              } finally {
                setUploading(false);
              }
            }
      }
      onDelete={
        readonly
          ? undefined
          : async (id) => {
              try {
                await taskData.tasks.deleteAttachment(taskId, id);
                toast.success("Attachment deleted");
                onDeleted?.(id);
              } catch {
                toast.error("Failed to delete attachment");
              }
            }
      }
    />
  );
}
