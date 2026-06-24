"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, FileIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { cn } from "@/utils/index";
import { taskApi } from "@/lib/task-api";
import type { TaskAttachment } from "@/types/tasks";

export function TaskFileUpload({
  taskId,
  onUploaded,
}: {
  taskId: string;
  onUploaded?: (attachment: TaskAttachment) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; preview?: string }[]>([]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newPreviews = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return { file, preview: URL.createObjectURL(file) };
      }
      return { file };
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (inputRef.current) inputRef.current.value = "";
  }

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
        const result = await taskApi.uploadAttachment(taskId, item.file);
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
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-1.5 size-4" />
          Choose Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {previews.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg border border-border/50 p-2 pr-8",
                  item.preview ? "w-32" : "w-full max-w-xs",
                )}
              >
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt=""
                    className="h-16 w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded bg-muted">
                    <FileIcon className="size-5 text-muted-foreground" />
                  </div>
                )}
                {!item.preview && (
                  <span className="min-w-0 flex-1 truncate text-xs">
                    {item.file.name}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
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
