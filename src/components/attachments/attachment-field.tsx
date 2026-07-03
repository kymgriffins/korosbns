"use client";

import { useRef, useState } from "react";
import { Download, Eye, FileIcon, Paperclip, Trash2, Upload } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/index";
import {
  attachmentDownloadUrl,
  formatAttachmentSize,
  isLocalAttachmentId,
  type AttachmentRecord,
} from "@/lib/attachment-display";

export function AttachmentField({
  attachments,
  readonly = false,
  uploading = false,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv",
  multiple = true,
  emptyHint = "No files attached yet.",
  pendingHint,
  onUpload,
  onDelete,
  className,
}: {
  attachments: AttachmentRecord[];
  readonly?: boolean;
  uploading?: boolean;
  accept?: string;
  multiple?: boolean;
  emptyHint?: string;
  pendingHint?: string;
  onUpload?: (files: File[]) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const images = attachments.filter((a) => a.is_image);
  const files = attachments.filter((a) => !a.is_image);

  async function handleDelete(id: string) {
    if (!onDelete) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList?.length || !onUpload) return;
    onUpload(Array.from(fileList));
    if (inputRef.current) inputRef.current.value = "";
  }

  function renderAttachment(att: AttachmentRecord, orientation: "horizontal" | "vertical" = "horizontal") {
    const isLocal = isLocalAttachmentId(att.id);
    const isDeleting = deletingId === att.id;

    return (
      <Attachment
        key={att.id}
        size="sm"
        orientation={orientation}
        state={isDeleting ? "processing" : isLocal ? "idle" : "done"}
        className={cn(orientation === "vertical" && "w-28")}
      >
        <AttachmentMedia variant={att.is_image ? "image" : "icon"}>
          {att.is_image ? (
            <img src={att.url} alt={att.file_name} className="size-full object-cover" />
          ) : (
            <FileIcon className="size-4" />
          )}
          {isDeleting && <Spinner className="absolute" />}
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{att.file_name}</AttachmentTitle>
          <AttachmentDescription>
            {formatAttachmentSize(att.file_size)}
            {isLocal ? " · pending upload" : att.uploaded_by_name ? ` · ${att.uploaded_by_name}` : ""}
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {att.is_image && (
            <AttachmentAction
              type="button"
              aria-label="Preview image"
              onClick={() => setLightbox(att.url)}
            >
              <Eye className="size-3.5" />
            </AttachmentAction>
          )}
          <AttachmentAction asChild>
            <a
              href={isLocal ? att.url : attachmentDownloadUrl(att.url, att.file_name)}
              download={att.file_name}
              target={isLocal ? undefined : "_blank"}
              rel={isLocal ? undefined : "noreferrer"}
              aria-label="Download file"
            >
              <Download className="size-3.5" />
            </a>
          </AttachmentAction>
          {!readonly && onDelete && (
            <AttachmentAction
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              aria-label="Remove attachment"
              disabled={isDeleting}
              onClick={() => void handleDelete(att.id)}
            >
              {isDeleting ? <Spinner className="size-3.5" /> : <Trash2 className="size-3.5" />}
            </AttachmentAction>
          )}
        </AttachmentActions>
      </Attachment>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {attachments.length === 0 && (
        <p className="text-xs text-muted-foreground">{emptyHint}</p>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Images ({images.length})
          </p>
          <AttachmentGroup className="gap-2">
            {images.map((att) => renderAttachment(att, "vertical"))}
          </AttachmentGroup>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Files ({files.length})
          </p>
          <AttachmentGroup className="flex-col items-stretch gap-2">
            {files.map((att) => renderAttachment(att, "horizontal"))}
          </AttachmentGroup>
        </div>
      )}

      {!readonly && onUpload && (
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Spinner className="size-3.5" /> : <Upload className="size-3.5" />}
            {uploading ? "Uploading…" : "Add files"}
          </Button>
          {pendingHint && (
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Paperclip className="mt-0.5 size-3 shrink-0" />
              {pendingHint}
            </p>
          )}
        </div>
      )}

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-0">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {lightbox && (
            <div className="flex items-center justify-center p-2">
              <img
                src={lightbox}
                alt="Preview"
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
