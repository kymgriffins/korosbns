"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-3 max-w-5xl mx-auto p-3 md:p-4 pb-20 animate-pulse">
      <div className="relative overflow-hidden rounded-2xl bg-muted/30 p-4 md:p-6 h-24 md:h-28">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-12 md:size-14 rounded-full bg-muted/50 shrink-0 ring-1 ring-border/20" />
            <div className="space-y-2 min-w-0">
              <div className="h-4 bg-muted/50 rounded w-32" />
              <div className="h-3 bg-muted/30 rounded w-20" />
            </div>
          </div>
          <div className="h-8 w-12 bg-muted/40 rounded-xl shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-3 h-16 ring-1 ring-border/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-2.5 bg-muted/40 rounded w-12" />
                <div className="h-4 bg-muted/30 rounded w-8" />
              </div>
              <div className="size-8 bg-muted/20 rounded-lg shrink-0 ring-1 ring-border/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-3">
        <div className="space-y-3">
          <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10">
            <div className="bg-card rounded-[calc(0.75rem-1px)] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted/30 rounded-lg shrink-0 ring-1 ring-border/20" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-muted/30 rounded w-10" />
                    <div className="h-3 bg-muted/40 rounded w-28" />
                  </div>
                </div>
                <div className="h-8 bg-primary/20 rounded-lg w-16 shrink-0" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-3 h-36 ring-1 ring-border/30">
            <div className="h-3 bg-muted/30 rounded w-16 mb-3" />
            <div className="h-[120px] bg-muted/10 rounded-lg" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-card rounded-xl p-3 h-32 ring-1 ring-border/30">
            <div className="h-3 bg-muted/30 rounded w-16 mb-3" />
            <div className="h-[100px] bg-muted/10 rounded-lg" />
          </div>
          <div className="bg-card rounded-xl p-3 h-48 ring-1 ring-border/30">
            <div className="h-3 bg-muted/30 rounded w-20 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-2">
                  <div className="size-6 bg-muted/30 rounded-full shrink-0 ring-1 ring-border/20" />
                  <div className="space-y-1 flex-1">
                    <div className="h-2.5 bg-muted/30 rounded w-20" />
                    <div className="h-2 bg-muted/20 rounded w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
