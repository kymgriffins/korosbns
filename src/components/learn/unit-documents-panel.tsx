import { Download, FolderOpen } from "lucide-react";
import type { DocumentType } from "@/constants/documents";

export function UnitDocumentsPanel({
  documents,
  error,
  unitTitle,
}: {
  documents: DocumentType[];
  error?: string;
  unitTitle: string;
}) {
  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-foreground/60">
        <p className="font-medium text-foreground/80">Official documents</p>
        <p className="mt-1">
          No repository files matched this unit yet.
          {error ? ` (${error})` : " Files may still be syncing."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <FolderOpen className="size-5 text-primary" />
        <h2 className="text-sm font-semibold sm:text-base">
          {unitTitle} — document repository
        </h2>
      </div>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-foreground/50">{doc.folderName}</p>
            <p className="mt-1 font-semibold">{doc.fullName}</p>
            <p className="mt-1 text-xs text-foreground/60">
              {doc.files.length} file{doc.files.length === 1 ? "" : "s"}
              {doc.years.length ? ` · ${doc.years.join(", ")}` : ""}
            </p>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
              {doc.files.slice(0, 8).map((file) => (
                <li key={file.url} className="flex items-center justify-between gap-2">
                  <span className="truncate text-foreground/80">{file.name}</span>
                  <a
                    href={file.downloadUrl || file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Download className="size-3" />
                    Open
                  </a>
                </li>
              ))}
            </ul>
            {doc.files.length > 8 ? (
              <p className="mt-2 text-xs text-foreground/50">+ {doc.files.length - 8} more files</p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-foreground/50">
        External statutory PDFs stay on government servers; we link and organize them here.
      </p>
    </div>
  );
}
