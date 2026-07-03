export type AttachmentRecord = {
  id: string;
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  is_image: boolean;
  uploaded_by_name?: string;
  created_at: string;
  /** In-memory file before upload (create mode / unsaved sub-task). */
  _file?: File;
};

export function isLocalAttachmentId(id: string): boolean {
  return id.startsWith("local-att-");
}

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function attachmentDownloadUrl(url: string, filename: string): string {
  const path = url.replace(/^\//, "");
  return `/api/download?path=${encodeURIComponent(path)}&name=${encodeURIComponent(filename)}`;
}

export function fileToLocalAttachment(file: File): AttachmentRecord {
  return {
    id: `local-att-${crypto.randomUUID()}`,
    url: URL.createObjectURL(file),
    file_name: file.name,
    file_size: file.size,
    content_type: file.type,
    is_image: file.type.startsWith("image/"),
    created_at: new Date().toISOString(),
    _file: file,
  };
}

export function revokeLocalAttachmentUrls(attachments: AttachmentRecord[] | undefined) {
  for (const att of attachments ?? []) {
    if (att._file && att.url.startsWith("blob:")) {
      URL.revokeObjectURL(att.url);
    }
  }
}
