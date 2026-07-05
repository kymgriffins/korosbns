"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2, FileText, Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGamificationMe } from "@/hooks/use-gamification";
import { safeArray, safeLen, safeMap } from "@/lib/safe-data";
import { StudioPage } from "../components/studio-page";
import { StudioPageHeader } from "../components/studio-page-header";
import { AlertsPulse } from "../illustrations/alerts-pulse";
import type { LearnHubProfile } from "@/lib/learn-data";

function progressIcon(contentType: string) {
  switch (contentType) {
    case "lesson":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "document":
      return <FileText className="size-4 text-blue-500" />;
    case "path":
      return <MessageSquare className="size-4 text-amber-500" />;
    default:
      return <CheckCircle2 className="size-4 text-muted-foreground" />;
  }
}

export function LearnAlertsView({ profile }: { profile: LearnHubProfile }) {
  const queryClient = useQueryClient();
  const { data: gamification, isLoading: gamificationLoading } = useGamificationMe();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <StudioPage width="default">
      <StudioPageHeader
        eyebrow="Activity"
        title="Alerts"
        description="Recent learning activity and participation you've logged."
        illustration={<AlertsPulse className="h-24 w-32 opacity-90" />}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await queryClient.invalidateQueries({ queryKey: ["gamification", "me"] });
              } finally {
                setRefreshing(false);
              }
            }}
          >
            <RefreshCw className={`mr-1.5 size-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
        {gamificationLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : gamification && safeLen(gamification.recent_progress) > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {safeMap(safeArray(gamification.recent_progress).slice(0, 6), (item, idx) => (
              <Card key={idx} className="border-border/50 shadow-none">
                <CardContent className="flex items-start gap-3 p-4">
                  {progressIcon(item.content_type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">{item.content_type}</p>
                    <p className="text-xs text-muted-foreground">{item.progress_percent}% complete</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-border/60 bg-muted/15 shadow-none">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No recent activity</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Complete a module to see your progress here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-sm font-semibold tracking-tight">Logged submissions</h2>
        {profile.participationLogs && profile.participationLogs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.participationLogs.map((entry, idx) => {
              const log = entry as {
                documentName: string;
                method: string;
                dateSubmitted: string;
                draftText: string;
              };
              return (
              <Card key={idx} className="border-border/50 shadow-none">
                <CardContent className="space-y-2 p-4 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{log.documentName}</p>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                      {log.method}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.dateSubmitted).toLocaleString()}
                  </p>
                  <p className="line-clamp-3 rounded-lg bg-muted/40 p-2 font-mono text-[11px] leading-relaxed">
                    {log.draftText}
                  </p>
                </CardContent>
              </Card>
            );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-border/60 bg-muted/15 shadow-none">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Bell className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">No submissions yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                When you participate in budget consultations, they&apos;ll appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </StudioPage>
  );
}
