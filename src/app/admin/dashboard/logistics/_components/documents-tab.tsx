"use client";

import { Ban, CheckCircle2, Clock, Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentsForShipment, type DocumentStatus } from "./shipment-data";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Transport: FileText,
  Customs: FileText,
  Compliance: FileText,
  Insurance: FileText,
};

const statusStyles: Record<DocumentStatus, string> = {
  approved: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  rejected: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
};

const statusIcons: Record<DocumentStatus, React.ComponentType<{ className?: string }>> = {
  approved: CheckCircle2,
  pending: Clock,
  rejected: Ban,
};

type DocumentsTabProps = {
  shipmentId: string;
};

export function DocumentsTab({ shipmentId }: DocumentsTabProps) {
  const docs = getDocumentsForShipment(shipmentId);

  if (docs.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
        No documents available for this shipment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {docs.map((doc) => {
        const StatusIcon = statusIcons[doc.status];
        const DocIcon = typeIcons[doc.type] ?? FileText;

        return (
          <Card key={doc.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <DocIcon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm">{doc.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>{doc.type}</span>
                    <span>·</span>
                    <span className="font-mono">{doc.reference}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`gap-1 ${statusStyles[doc.status]}`}>
                  <StatusIcon className="size-3" />
                  {doc.status}
                </Badge>
                <Button size="icon-sm" variant="ghost">
                  <Download />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex items-center gap-4 text-muted-foreground text-xs">
              <span>Issued: {doc.issuedDate}</span>
              {doc.expiryDate && (
                <>
                  <span>·</span>
                  <span>Expires: {doc.expiryDate}</span>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
