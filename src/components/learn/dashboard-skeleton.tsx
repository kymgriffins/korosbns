"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-2 max-w-6xl mx-auto p-3 md:p-4 pb-20 animate-pulse">
      {/* Hero */}
      <div className="bg-card rounded-xl p-3 ring-1 ring-border/20 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-full bg-muted/40 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 bg-muted/30 rounded w-24" />
            <div className="h-2 bg-muted/20 rounded w-16" />
          </div>
        </div>
        <div className="h-6 w-14 bg-muted/30 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-2.5 flex items-center gap-2 ring-1 ring-border/20 h-12">
            <div className="size-7 rounded-md bg-muted/30 shrink-0" />
            <div className="space-y-1">
              <div className="h-2 bg-muted/30 rounded w-10" />
              <div className="h-3 bg-muted/20 rounded w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-2">
        <div className="space-y-2">
          {/* Stories */}
          <div className="bg-card rounded-xl p-3 ring-1 ring-border/20">
            <div className="h-2.5 bg-muted/30 rounded w-14 mb-2" />
            <div className="flex gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="size-13 rounded-full bg-muted/30" />
                  <div className="h-2 bg-muted/20 rounded w-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden ring-1 ring-border/20">
                <div className="aspect-video bg-muted/30" />
                <div className="p-2 space-y-1.5">
                  <div className="h-3 bg-muted/30 rounded w-3/4" />
                  <div className="h-2 bg-muted/20 rounded w-full" />
                  <div className="h-2 bg-muted/20 rounded w-1/2" />
                  <div className="h-2 bg-muted/20 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-card rounded-xl p-3 ring-1 ring-border/20">
            <div className="h-2.5 bg-muted/30 rounded w-20 mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted/30 rounded" />
                  <div className="size-5 rounded-full bg-muted/30" />
                  <div className="h-2.5 bg-muted/30 rounded w-20" />
                </div>
                <div className="h-2 bg-muted/20 rounded w-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-2">
          <div className="bg-card rounded-xl p-3 ring-1 ring-border/20">
            <div className="h-2.5 bg-muted/30 rounded w-16 mb-3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-muted/30" />
                  <div className="h-2.5 bg-muted/30 rounded w-12" />
                </div>
                <div className="h-3 bg-muted/20 rounded w-8" />
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl p-3 ring-1 ring-border/20">
            <div className="h-2.5 bg-muted/30 rounded w-20 mb-2" />
            <div className="h-2 bg-muted/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
