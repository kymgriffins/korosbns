"use client";

import { FileText, Folder, Calendar, ChevronRight } from "lucide-react";

import type { DocumentType } from "@/data/documents";

type DocumentFolderCardProps = {
  doc: DocumentType;
  onClick: () => void;
};

export function DocumentFolderCard({ doc, onClick }: DocumentFolderCardProps) {
  const yearRange = doc.years.length
    ? `${doc.years[0]}\u2013${doc.years[doc.years.length - 1]}`
    : null;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-3.5 text-left ring-1 ring-border/40 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
          <Folder className="size-5 text-primary" />
        </div>
        <ChevronRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div className="min-w-0 space-y-0.5">
        <h3 className="truncate text-[13px] font-bold leading-tight">
          {doc.title}
        </h3>
        <p className="truncate text-[10px] font-medium text-muted-foreground">
          {doc.fullName}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-bold text-muted-foreground ring-1 ring-border/30">
          <FileText className="size-2.5" />
          {doc.files.length} file{doc.files.length !== 1 ? "s" : ""}
        </span>
        {yearRange && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/5 px-2 py-0.5 text-[9px] font-bold text-blue-600 ring-1 ring-blue-500/20">
            <Calendar className="size-2.5" />
            {yearRange}
          </span>
        )}
      </div>
    </button>
  );
}
