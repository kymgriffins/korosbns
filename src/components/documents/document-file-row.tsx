"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, Calendar, Building2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, type FlatFile } from "@/data/documents";
import { DocumentViewerDialog } from "./document-viewer-dialog";

type DocumentFileRowProps = {
  file: FlatFile;
  viewMode?: "table" | "card";
  folderName?: string;
  docType?: string;
};

export function DocumentFileRow({
  file,
  viewMode = "table",
  folderName,
  docType,
}: DocumentFileRowProps) {
  const [viewerOpen, setViewerOpen] = useState(false);

  if (viewMode === "card") {
    return (
      <>
        <div className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 ring-1 ring-border/30 hover:shadow-sm">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold truncate max-w-[220px]">
                  {file.name}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setViewerOpen(true)}
                  title="View"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="size-3.5" />
                </Button>
                {file.url && file.url !== "#" && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
                {file.downloadUrl && file.downloadUrl !== "#" && (
                  <a
                    href={file.downloadUrl}
                    className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    title="Download"
                  >
                    <Download className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {file.year && (
                <Badge
                  variant="outline"
                  className="text-[9px] gap-1 px-1.5 py-0"
                >
                  <Calendar className="size-2.5" />
                  FY {file.year - 1}/{String(file.year).slice(-2)}
                </Badge>
              )}
              {file.county && (
                <Badge
                  variant="secondary"
                  className="text-[9px] gap-1 px-1.5 py-0"
                >
                  <Building2 className="size-2.5" />
                  {file.county}
                </Badge>
              )}
              {file.size > 0 && (
                <span className="text-[9px] font-medium text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              )}
            </div>
          </div>
        </div>
        <DocumentViewerDialog
          file={file}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          folderName={folderName}
          docType={docType}
        />
      </>
    );
  }

  return (
    <>
      <tr className="hover:bg-muted/20 transition-colors group">
        <td className="px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="size-3.5 shrink-0 text-primary" />
            <p className="font-semibold text-[11px] truncate max-w-[180px] lg:max-w-[280px]">
              {file.name}
            </p>
          </div>
        </td>
        <td className="px-3 py-2 hidden md:table-cell text-muted-foreground text-[10px]">
          {file.county ?? "\u2014"}
        </td>
        <td className="px-3 py-2 hidden md:table-cell text-muted-foreground text-[10px]">
          {file.year
            ? `FY ${file.year - 1}/${String(file.year).slice(-2)}`
            : "\u2014"}
        </td>
        <td className="px-3 py-2 hidden lg:table-cell text-muted-foreground text-[10px]">
          {formatBytes(file.size)}
        </td>
        <td className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setViewerOpen(true)}
              title="View"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="size-3.5" />
            </Button>
            {file.url && file.url !== "#" && (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
            {file.downloadUrl && file.downloadUrl !== "#" && (
              <a
                href={file.downloadUrl}
                className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                title="Download"
              >
                <Download className="size-3.5" />
              </a>
            )}
          </div>
        </td>
      </tr>
      <DocumentViewerDialog
        file={file}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        folderName={folderName}
        docType={docType}
      />
    </>
  );
}
