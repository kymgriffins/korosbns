"use client";

import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { LearnEmptyState } from "./learn-empty-state";

interface AlertsViewProps {
  profile: any;
}

export function AlertsView({ profile }: AlertsViewProps) {
  const logs: any[] = profile.participationLogs ?? [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Participation Alerts</h2>
        <p className="text-sm text-muted-foreground">
          Hyper-local alerts matching your county and tracked documents.
        </p>
      </div>

      <Separator />

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Logged Submissions
        </h3>

        {logs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {logs.map((log: any, idx: number) => (
              <Card key={idx} className="shadow-xs">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold truncate leading-tight">
                      {log.documentName}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 uppercase text-xs">
                      {log.method}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {new Date(log.dateSubmitted).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <pre className="bg-muted/30 p-3 rounded-lg ring-1 ring-border/50 font-mono text-xs leading-relaxed whitespace-pre-wrap truncate max-h-24 overflow-hidden">
                    {log.draftText}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <LearnEmptyState
            icon={Bell}
            heading="No commentaries submitted yet."
            description="Complete a learning stage to draft and submit a memorandum."
          />
        )}
      </section>
    </div>
  );
}
