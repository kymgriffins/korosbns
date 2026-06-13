"use client";

import Link from "next/link";
import { X, Calendar, ListChecks } from "lucide-react";
import { cn } from "@/utils";
import type { HubEvent } from "@/lib/citizen-content";
import type { SurveyListItemApi } from "@/lib/api-client";

interface LearnSidebarPromoCardProps {
  events: HubEvent[];
  surveys: SurveyListItemApi[];
  loading: boolean;
  eventsHref: string;
  surveysHref: string;
  onDismiss: () => void;
  className?: string;
}

export function LearnSidebarPromoCard({
  events,
  surveys,
  loading,
  eventsHref,
  surveysHref,
  onDismiss,
  className,
}: LearnSidebarPromoCardProps) {
  if (loading) {
    return (
      <div className={cn("rounded-xl bg-muted/50 p-4 animate-pulse space-y-3", className)}>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-muted-foreground/20" />
          <div className="h-3 w-24 rounded bg-muted-foreground/20" />
        </div>
        <div className="h-3 w-full rounded bg-muted-foreground/20" />
        <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
      </div>
    );
  }

  const hasEvents = events.length > 0;
  const hasContent = hasEvents || surveys.length > 0;

  if (!hasContent) return null;

  const href = hasEvents ? eventsHref : surveysHref;

  return (
    <Link
      href={href}
      className={cn(
        "relative block overflow-hidden rounded-xl p-4 shadow-xs group",
        "bg-gradient-to-br from-emerald-500 via-emerald-500/90 to-teal-600 text-white",
        className,
      )}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(); }}
        aria-label="Dismiss"
        className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors z-20 focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <X className="size-3" aria-hidden />
      </button>

      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-2">
          {hasEvents
            ? <Calendar className="size-4" aria-hidden />
            : <ListChecks className="size-4" aria-hidden />}
          <h4 className="font-bold text-xs">
            {hasEvents ? "Upcoming Events" : "Active Surveys"}
          </h4>
        </div>

        {hasEvents
          ? events.slice(0, 2).map((ev) => (
              <div key={ev.id} className="space-y-0.5">
                <p className="text-xs text-white/80">{ev.title}</p>
                <p className="text-xs text-white/60">
                  {ev.location} · {new Date(ev.starts_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))
          : surveys.slice(0, 2).map((sv) => (
              <div key={sv.id} className="space-y-0.5">
                <p className="text-xs text-white/80">{sv.title}</p>
                {sv.description && (
                  <p className="text-xs text-white/60 line-clamp-1">{sv.description}</p>
                )}
              </div>
            ))}
      </div>
    </Link>
  );
}
