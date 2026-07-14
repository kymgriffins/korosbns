"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, GraduationCap, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouteBase, getLocalPath } from "@/lib/route-base";
import { cn } from "@/lib/utils";
import { resolveTeachingGuide } from "./teaching-catalog";
import { resolveLearnTeachingGuide } from "./learn-teaching-catalog";
import { useTeachingOptional } from "./teaching-context";

type Props = {
  /** Admin dashboard vs Learning Hub */
  surface?: "admin" | "learn";
};

export function PageTeachingBanner({ surface = "admin" }: Props) {
  const pathname = usePathname();
  const routeBase = useRouteBase();
  const teaching = useTeachingOptional();
  const [expanded, setExpanded] = useState(false);

  const local = useMemo(() => {
    if (surface === "learn") {
      const path = pathname.replace(/\/$/, "") || "/";
      return path.replace(/^\/learn\/?/, "").replace(/\/$/, "");
    }
    const full = getLocalPath(routeBase, pathname);
    return full.replace(/^\/dashboard\/?/, "").replace(/\/$/, "");
  }, [pathname, routeBase, surface]);

  const guide = useMemo(
    () => (surface === "learn" ? resolveLearnTeachingGuide(local) : resolveTeachingGuide(local)),
    [local, surface],
  );

  // Analytics page: breadcrumb + inline helpers only — skip tip banners.
  if (surface === "admin" && (local === "analytics" || local.startsWith("analytics/"))) {
    return null;
  }

  if (!teaching?.ready || teaching.muted || !guide || teaching.isPageDismissed(guide.id)) return null;

  const { setMuted, dismissPage } = teaching;

  return (
    <aside
      className={cn(
        "mb-4 rounded-lg border text-sky-950",
        surface === "learn"
          ? "border-amber-800/15 bg-amber-50/90 dark:border-amber-400/20 dark:bg-amber-950/35 dark:text-amber-50"
          : "border-sky-700/15 bg-sky-50/80 dark:border-sky-400/20 dark:bg-sky-950/40 dark:text-sky-50",
      )}
      aria-label={`Teaching: ${guide.title}`}
    >
      <div className="flex items-start gap-3 px-3 py-3 sm:px-4">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
            surface === "learn" ? "bg-amber-700/10 dark:bg-amber-400/15" : "bg-sky-600/10 dark:bg-sky-400/15",
          )}
        >
          <GraduationCap
            className={cn(
              "size-4",
              surface === "learn" ? "text-amber-800 dark:text-amber-300" : "text-sky-700 dark:text-sky-300",
            )}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold tracking-tight">{guide.title}</p>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                surface === "learn"
                  ? "bg-amber-700/10 text-amber-900 dark:text-amber-200"
                  : "bg-sky-600/10 text-sky-800 dark:text-sky-200",
              )}
            >
              Tip
            </span>
          </div>
          <p className="text-sm leading-relaxed opacity-85">{guide.purpose}</p>
          {expanded ? (
            <div className="space-y-3 pt-1">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">How to use this page</p>
                <ul className="list-inside list-disc space-y-1 text-sm opacity-85">
                  {guide.howTo.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              {guide.actions.length > 0 ? (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
                    What the controls do
                  </p>
                  <ul className="space-y-2">
                    {guide.actions.map((action) => (
                      <li key={action.id} className="text-sm">
                        <span className="font-medium">{action.label}</span>
                        <span className="opacity-70"> — {action.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-1 size-3.5" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 size-3.5" />
                  Show how-to & buttons
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 opacity-70 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => dismissPage(guide.id)}
            >
              Dismiss for this page
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 opacity-70 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMuted(true)}
            >
              Mute all tips
            </Button>
          </div>
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="shrink-0 opacity-60 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss page tip"
          onClick={() => dismissPage(guide.id)}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </aside>
  );
}
