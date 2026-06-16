import { Download, FileText, FolderOpen } from "lucide-react";
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
      <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-xs ring-1 ring-border/40">
        <p className="font-semibold text-foreground">Official documents</p>
        <p className="mt-1 text-muted-foreground">
          No repository files matched this unit yet.
          {error ? ` (${error})` : " Files may still be syncing."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-xs ring-1 ring-border/40 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <FolderOpen className="size-4.5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold sm:text-base">{unitTitle}</h2>
          <p className="text-[11px] text-muted-foreground">Document repository</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-border bg-background/40 p-4 ring-1 ring-border/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{doc.folderName}</p>
            <p className="mt-1 font-semibold text-foreground">{doc.fullName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {doc.files.length} file{doc.files.length === 1 ? "" : "s"}
              {doc.years.length ? ` · ${doc.years.join(", ")}` : ""}
            </p>
            <ul className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
              {doc.files.slice(0, 8).map((file) => (
                <li key={file.url}>
                  <a
                    href={file.downloadUrl || file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate text-foreground/80 group-hover:text-foreground">{file.name}</span>
                    </span>
                    <Download className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ul>
            {doc.files.length > 8 ? (
              <p className="mt-2 text-xs text-muted-foreground">+ {doc.files.length - 8} more files</p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        External statutory PDFs stay on government servers; we link and organize them here.
      </p>
    </div>
  );
}
