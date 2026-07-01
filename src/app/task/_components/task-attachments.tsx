"use client";

import { useState } from "react";
import { ImageIcon, FileIcon, Download, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/utils/index";
import { taskApi } from "@/lib/task-api";
import type { TaskAttachment } from "@/types/tasks";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TaskAttachmentsGrid({
  attachments,
  taskId,
  onDeleted,
  readonly = false,
}: {
  attachments: TaskAttachment[];
  taskId: string;
  onDeleted?: (id: string) => void;
  readonly?: boolean;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const images = attachments.filter((a) => a.is_image);
  const files = attachments.filter((a) => !a.is_image);

  async function handleDelete(attachmentId: string) {
    setDeleting(attachmentId);
    try {
      await taskApi.deleteAttachment(taskId, attachmentId);
      toast.success("Attachment deleted");
      onDeleted?.(attachmentId);
    } catch {
      toast.error("Failed to delete attachment");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
            Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setLightbox(img.url)}
                  className="block w-full overflow-hidden rounded-lg border border-border/50"
                >
                  <img
                    src={img.url}
                    alt={img.file_name}
                    className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-6"
                    asChild
                  >
                    <a href={img.url} download={img.file_name}>
                      <Download className="size-3" />
                    </a>
                  </Button>
                  {!readonly && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-6"
                      onClick={() => handleDelete(img.id)}
                      disabled={deleting === img.id}
                    >
                      {deleting === img.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="mt-1 truncate px-0.5 text-[10px] text-muted-foreground">
                  {img.file_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
            Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <FileIcon className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.file_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatFileSize(file.file_size)}
                    {file.uploaded_by_name ? ` · by ${file.uploaded_by_name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8" asChild>
                    <a href={file.url} download={file.file_name}>
                      <Download className="size-4" />
                    </a>
                  </Button>
                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                    >
                      {deleting === file.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {attachments.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <ImageIcon className="size-8 opacity-40" />
          <p>No attachments yet</p>
        </div>
      )}

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-0">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {lightbox && (
            <div className="relative flex items-center justify-center p-2">
              <img
                src={lightbox}
                alt="Preview"
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setLightbox(null)}
              >
                <X className="size-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
