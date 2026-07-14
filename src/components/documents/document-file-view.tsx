"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink, Download, Calendar, Building2, HardDrive, FileText, Eye,
} from "lucide-react";

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
import { formatBytes, formatDate, type FlatFile } from "@/data/documents";

type DocumentFileViewProps = {
  file: FlatFile;
  folderName: string;
  docType?: string;
  onBack: () => void;
};

export function DocumentFileView({
  file,
  folderName,
  docType,
  onBack,
}: DocumentFileViewProps) {
  const [pdfError, setPdfError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setChecking(true);
    setPdfError(false);

    if (!file.url || file.url === "#") {
      setPdfError(true);
      setChecking(false);
      return;
    }

    fetch(file.url, { method: "HEAD", signal: AbortSignal.timeout(5000) })
      .then((res) => {
        if (cancelled) return;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("pdf") && !ct.includes("octet-stream") && !ct.includes("application")) {
          setPdfError(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setPdfError(true);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => { cancelled = true; };
  }, [file.url]);

  const segments = [
    { label: "Document Hub", onClick: onBack },
    { label: folderName, onClick: onBack },
    { label: file.name },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between gap-4 border-b border-border/50 px-4 py-3 md:px-6">
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((seg, i) => (
              <BreadcrumbItem key={seg.label}>
                {i < segments.length - 1 ? (
                  <>
                    <BreadcrumbLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        seg.onClick?.();
                      }}
                      className="text-xs hover:text-foreground"
                    >
                      {seg.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage className="text-xs font-semibold truncate max-w-[200px] sm:max-w-[400px]">
                    {seg.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

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

      {/* Content: summary + PDF */}
      <div className="flex flex-col md:flex-row min-h-[70vh]">
        {/* Summary sidebar — desktop */}
        <div className="md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground break-words">
              {file.name}
            </h2>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {file.year && (
                <SummaryItem
                  icon={<Calendar className="size-3.5" />}
                  label="Fiscal Year"
                  value={`FY ${file.year - 1}/${String(file.year).slice(-2)}`}
                />
              )}
              {file.county && (
                <SummaryItem
                  icon={<Building2 className="size-3.5" />}
                  label="County"
                  value={file.county}
                />
              )}
              {file.size > 0 && (
                <SummaryItem
                  icon={<HardDrive className="size-3.5" />}
                  label="Size"
                  value={formatBytes(file.size)}
                />
              )}
              {file.modified > 0 && (
                <SummaryItem
                  icon={<FileText className="size-3.5" />}
                  label="Modified"
                  value={formatDate(file.modified)}
                />
              )}
              {docType && (
                <SummaryItem
                  icon={<FileText className="size-3.5" />}
                  label="Type"
                  value={docType}
                />
              )}
            </div>
          </div>

          {docType && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">{docType}</Badge>
                  {file.year && (
                    <Badge variant="outline" className="text-xs">
                      FY {file.year - 1}/{String(file.year).slice(-2)}
                    </Badge>
                  )}
                  {file.county && (
                    <Badge variant="outline" className="text-xs">{file.county}</Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PDF viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
          {checking ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="size-8 animate-pulse rounded-full bg-muted/50" />
            </div>
          ) : pdfError ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center min-h-[50vh]">
              <div className="size-14 rounded-full bg-muted/30 flex items-center justify-center ring-1 ring-border/30">
                <Eye className="size-6 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Preview unavailable</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  This file could not be displayed inline.
                </p>
              </div>
              {file.url && file.url !== "#" && (
                <Button variant="default" size="sm" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    Open in new tab
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <embed
              src={file.url}
              type="application/pdf"
              className="w-full min-h-[70vh] flex-1"
              title={file.name}
            />
          )}
        </div>
      </div>

      {/* Mobile summary footer */}
      <div className="md:hidden border-t border-border/50 px-4 py-2.5 flex gap-2 overflow-x-auto">
        {file.year && (
          <Badge variant="secondary" className="text-xs shrink-0 whitespace-nowrap">
            FY {file.year - 1}/{String(file.year).slice(-2)}
          </Badge>
        )}
        {file.county && (
          <Badge variant="secondary" className="text-xs shrink-0">{file.county}</Badge>
        )}
        {file.size > 0 && (
          <Badge variant="outline" className="text-xs shrink-0">{formatBytes(file.size)}</Badge>
        )}
        {docType && (
          <Badge variant="outline" className="text-xs shrink-0">{docType}</Badge>
        )}
      </div>
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
      <span className="size-3.5 shrink-0 text-muted-foreground/60">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-xs font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
