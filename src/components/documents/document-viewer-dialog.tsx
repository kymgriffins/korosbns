"use client";

import { useState } from "react";
import { ExternalLink, Download, FileText, Calendar, Building2, HardDrive, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatBytes, formatDate, type FlatFile } from "@/data/documents";

type SummaryItem = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function SummaryCard({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
        >
          <span className="size-3.5 shrink-0 text-muted-foreground/60">
            {item.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            <p className="truncate text-xs font-medium text-foreground">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

type DocumentViewerDialogProps = {
  file: FlatFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName?: string;
  docType?: string;
};

export function DocumentViewerDialog({
  file,
  open,
  onOpenChange,
  folderName,
  docType,
}: DocumentViewerDialogProps) {
  const [pdfError, setPdfError] = useState(false);

  if (!file) return null;

  const isPdf =
    file.name.toLowerCase().endsWith(".pdf") ||
    file.url?.toLowerCase().includes("pdf");

  const breadcrumbSegments = [
    { label: "Document Hub", href: "#" },
    ...(folderName
      ? [{ label: folderName, href: "#" }]
      : []),
  ];

  const summaryItems: SummaryItem[] = [
    ...(file.year
      ? [
          {
            label: "Fiscal Year",
            value: `FY ${file.year - 1}/${String(file.year).slice(-2)}`,
            icon: <Calendar className="size-3.5" />,
          },
        ]
      : []),
    ...(file.county
      ? [
          {
            label: "County",
            value: file.county,
            icon: <Building2 className="size-3.5" />,
          },
        ]
      : []),
    ...(file.size > 0
      ? [
          {
            label: "Size",
            value: formatBytes(file.size),
            icon: <HardDrive className="size-3.5" />,
          },
        ]
      : []),
    ...(file.modified > 0
      ? [
          {
            label: "Modified",
            value: formatDate(file.modified),
            icon: <FileText className="size-3.5" />,
          },
        ]
      : []),
    ...(docType
      ? [
          {
            label: "Type",
            value: docType,
            icon: <FileText className="size-3.5" />,
          },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header with breadcrumb */}
        <div className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-3 shrink-0">
          <div className="min-w-0 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbSegments.map((seg, idx) => (
                  <BreadcrumbItem key={seg.label}>
                    <BreadcrumbLink href={seg.href} className="text-xs">
                      {seg.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-semibold truncate max-w-[300px]">
                    {file.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {file.url && file.url !== "#" && (
              <Button variant="outline" size="sm" asChild>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  Open
                </a>
              </Button>
            )}
            {file.downloadUrl && file.downloadUrl !== "#" && (
              <Button variant="outline" size="sm" asChild>
                <a href={file.downloadUrl} download>
                  <Download className="size-3.5" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Summary + PDF content */}
        <div className="flex flex-1 min-h-0">
          {/* Summary sidebar */}
          <div className="hidden md:flex w-72 shrink-0 flex-col gap-3 border-r border-border/50 p-4 overflow-y-auto">
            <div>
              <h2 className="text-sm font-bold text-foreground truncate">
                {file.name}
              </h2>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </h3>
              <SummaryCard items={summaryItems} />
            </div>

            {file.docType && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {file.docType}
                    </Badge>
                    {file.year && (
                      <Badge variant="outline" className="text-[10px]">
                        FY {file.year - 1}/{String(file.year).slice(-2)}
                      </Badge>
                    )}
                    {file.county && (
                      <Badge variant="outline" className="text-[10px]">
                        {file.county}
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PDF Viewer area */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
            {pdfError || !isPdf ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                <div className="size-14 rounded-full bg-muted/30 flex items-center justify-center ring-1 ring-border/30">
                  <Eye className="size-6 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {pdfError ? "Preview unavailable" : "No preview available"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    {pdfError
                      ? "This file could not be displayed inline."
                      : "Only PDF files can be previewed inline."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {file.url && file.url !== "#" && (
                    <Button variant="default" size="sm" asChild>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                        Open in new tab
                      </a>
                    </Button>
                  )}
                  {file.downloadUrl && file.downloadUrl !== "#" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.downloadUrl} download>
                        <Download className="size-3.5" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <iframe
                  src={`${file.url}#view=FitH`}
                  className="w-full h-full min-h-[60vh]"
                  title={file.name}
                  onError={() => setPdfError(true)}
                />
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Mobile summary footer */}
        <div className="md:hidden border-t border-border/50 px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            {summaryItems.slice(0, 4).map((item) => (
              <Badge
                key={item.label}
                variant="secondary"
                className="text-[10px] shrink-0 whitespace-nowrap"
              >
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
