"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Loader2, X, FileIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/index";
import { taskData } from "@/data/tasks";
import type { TaskAttachment } from "@/types/tasks";

/** Map common MIME types to a short label + color. */
function fileTypeBadge(file: File): { label: string; color: string } {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type;

  if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) {
    return { label: "IMG", color: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" };
  }
  if (mime === "application/pdf" || ext === "pdf") {
    return { label: "PDF", color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" };
  }
  if (["doc", "docx"].includes(ext) || mime.includes("word")) {
    return { label: "DOC", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" };
  }
  if (["xls", "xlsx"].includes(ext) || mime.includes("spreadsheet") || mime.includes("excel")) {
    return { label: "XLS", color: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" };
  }
  if (["csv", "txt"].includes(ext)) {
    return { label: ext.toUpperCase(), color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" };
  }
  return { label: ext.toUpperCase() || "FILE", color: "bg-muted text-muted-foreground" };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TaskFileUpload({
  taskId,
  onUploaded,
}: {
  taskId: string;
  onUploaded?: (attachment: TaskAttachment) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; preview?: string }[]>([]);

  function addFiles(files: File[]) {
    const newPreviews = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return { file, preview: URL.createObjectURL(file) };
      }
      return { file };
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type.startsWith("image/") ||
          [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv"].some((ext) =>
            f.name.toLowerCase().endsWith(ext),
          ),
      );
      if (files.length > 0) {
        addFiles(files);
      } else {
        toast.error("Unsupported file type. Accepted: images, PDF, DOC, XLS, TXT, CSV.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function removePreview(index: number) {
    setPreviews((prev) => {
      const item = prev[index];
      if (item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUpload() {
    if (previews.length === 0) return;
    setUploading(true);
    try {
      for (const item of previews) {
        const result = await taskData.tasks.uploadAttachment(taskId, item.file);
        onUploaded?.(result);
      }
      toast.success(`${previews.length} file(s) uploaded`);
      setPreviews([]);
    } catch {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone + button */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
          dragOver
            ? "border-primary/60 bg-primary/5"
            : "border-border/50 hover:border-border/80 hover:bg-muted/20",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        <Upload className={cn("size-8 text-muted-foreground/60", dragOver && "text-primary/60")} />
        <p className="text-sm text-muted-foreground">
          {dragOver ? "Drop files here" : "Drag & drop files here, or"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Choose Files
        </Button>
        <p className="text-[10px] text-muted-foreground/60">
          Images, PDF, DOC, XLS, TXT, CSV
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {/* Preview list */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {previews.length} file{previews.length !== 1 ? "s" : ""} selected
          </p>
          <div className="space-y-1.5">
            {previews.map((item, i) => {
              const badge = fileTypeBadge(item.file);
              return (
                <div
                  key={i}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg border border-border/50 bg-background p-2",
                    item.preview && "pr-8",
                  )}
                >
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt=""
                      className="size-12 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.file.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="secondary"
                        className={cn("h-4 px-1 text-[9px] font-semibold leading-4 rounded", badge.color)}
                      >
                        {badge.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatFileSize(item.file.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute top-1.5 right-1.5 rounded-full bg-muted p-0.5 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {uploading ? "Uploading..." : `Upload ${previews.length} file(s)`}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                previews.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
                setPreviews([]);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
