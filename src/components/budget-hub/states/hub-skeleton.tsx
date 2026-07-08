import { cn } from "@/utils";

export function HubSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-8", className)}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-12 w-full max-w-lg rounded bg-muted" />
          <div className="h-20 w-full max-w-md rounded bg-muted" />
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/3] rounded-lg bg-muted" />
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
