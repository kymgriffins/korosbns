"use client";

import { Bell } from "lucide-react";

interface AlertsViewProps {
  profile: any;
}

export function AlertsView({ profile }: AlertsViewProps) {
  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-tight">Participation Alerts</h2>
        <p className="text-xs text-muted-foreground">Hyper-local alerts matching your county and tracked documents.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
        {profile.participationLogs?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.participationLogs.map((log: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs shadow-xs">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-foreground truncate">{log.documentName}</h4>
                  <span className="text-[10px] bg-primary/10 ring-1 ring-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase shrink-0">{log.method}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                <div className="bg-muted/30 p-3 rounded-lg ring-1 ring-border/50 font-mono text-[10px] leading-relaxed whitespace-pre-wrap truncate max-h-24">{log.draftText}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl space-y-3">
            <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto ring-1 ring-border/30">
              <Bell className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No commentaries submitted yet.</p>
            <p className="text-[10px] text-muted-foreground/60">Complete a learning stage to draft and submit a memorandum.</p>
          </div>
        )}
      </div>
    </div>
  );
}
