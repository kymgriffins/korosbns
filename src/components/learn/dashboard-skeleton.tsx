"use client";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-8 p-4 md:p-6">
      <section className="space-y-5">
        <div className="flex items-center gap-3.5">
          <div className="size-14 rounded-2xl bg-muted sm:size-16" />
          <div className="space-y-2">
            <div className="h-2.5 w-20 rounded bg-muted" />
            <div className="h-7 w-40 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted/70" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted/70" />
          </div>
          <div className="h-2 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="h-11 flex-1 rounded-xl bg-muted" />
          <div className="h-11 w-28 rounded-xl bg-muted/70" />
        </div>
      </section>

      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/50 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 px-2 py-4 text-center">
            <div className="mx-auto size-3.5 rounded bg-muted" />
            <div className="mx-auto h-7 w-10 rounded bg-muted" />
            <div className="mx-auto h-2 w-14 rounded bg-muted/70" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <div className="h-36 rounded-2xl bg-muted/40" />
          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border/40">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 rounded bg-muted" />
                    <div className="h-1 rounded-full bg-muted/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-48 rounded-2xl border border-border/40 bg-muted/30" />
          <div className="h-56 rounded-2xl border border-border/40 bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
