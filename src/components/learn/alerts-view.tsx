"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle2,
  FileText,
  MessageSquare,
  MapPin,
  ScrollText,
} from "lucide-react";
import { useGamificationMe } from "@/hooks/use-gamification";
import { safeArray, safeLen, safeMap } from "@/lib/safe-data";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnCardGrid,
  LearnEmptyState,
  LearnLoadingState,
  LearnPageBody,
  LearnPanel,
  LearnRefreshButton,
  LearnSection,
} from "@/components/learn/learn-ui-primitives";
import { cn } from "@/utils";

interface AlertsViewProps {
  profile: any;
}

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

export function AlertsView({ profile }: AlertsViewProps) {
  const queryClient = useQueryClient();
  const { data: gamification, isLoading: gamificationLoading } = useGamificationMe();
  const [refreshing, setRefreshing] = useState(false);

  const county = profile?.county || "Kenya";
  const trackedCount = profile?.trackedDocs?.length ?? 0;
  const submissionCount = profile?.participationLogs?.length ?? 0;

  return (
    <LearnPageShell
      navId="participation"
      actions={
        <LearnRefreshButton
          refreshing={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              await queryClient.invalidateQueries({ queryKey: ["gamification", "me"] });
            } finally {
              setRefreshing(false);
            }
          }}
        />
      }
    >
      <LearnPageBody narrow>
        <div className="space-y-6">
          {/* Agency: local context strip */}
          <LearnPanel className="border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-card">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
                <MapPin className="size-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Your county
                </p>
                <p className="text-sm font-semibold">{county}</p>
                <p className="text-xs text-muted-foreground">
                  {trackedCount} tracked document{trackedCount !== 1 ? "s" : ""} ·{" "}
                  {submissionCount} submission{submissionCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </LearnPanel>

          <LearnSection
            title="Recent learning"
            hint="Activity that shapes your participation profile"
          >
            {gamificationLoading ? (
              <LearnLoadingState />
            ) : gamification && safeLen(gamification.recent_progress) > 0 ? (
              <LearnCardGrid columns={2}>
                {safeMap(safeArray(gamification.recent_progress).slice(0, 6), (item, idx) => (
                  <LearnPanel key={idx} padding="sm" className="!p-3">
                    <div className="flex items-center gap-2">
                      {progressIcon(item.content_type)}
                      <span className="text-xs font-semibold capitalize">{item.content_type}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {new Date(item.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {item.progress_percent}% complete
                    </p>
                  </LearnPanel>
                ))}
              </LearnCardGrid>
            ) : (
              <LearnEmptyState
                icon={Bell}
                title="No recent activity"
                description="Complete a module or track a document to build your participation record."
              />
            )}
          </LearnSection>

          <LearnSection
            title="Your submissions"
            hint="Memoranda and commentaries you've drafted"
          >
            {profile.participationLogs?.length > 0 ? (
              <div className="space-y-3">
                {profile.participationLogs.map((log: {
                  documentName: string;
                  method: string;
                  dateSubmitted: string;
                  draftText: string;
                }, idx: number) => (
                  <LearnPanel key={idx} padding="sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <ScrollText className="size-4 shrink-0 text-primary" />
                          <h4 className="truncate text-sm font-semibold">{log.documentName}</h4>
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Submitted {new Date(log.dateSubmitted).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                          "bg-primary/10 text-primary ring-1 ring-primary/20",
                        )}
                      >
                        {log.method}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 rounded-lg bg-muted/40 p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                      {log.draftText}
                    </p>
                  </LearnPanel>
                ))}
              </div>
            ) : (
              <LearnEmptyState
                icon={ScrollText}
                title="No submissions yet"
                description="Complete a learning stage to draft and submit a memorandum on budget documents."
              />
            )}
          </LearnSection>
        </div>
      </LearnPageBody>
    </LearnPageShell>
  );
}
