import { Lightbulb, TriangleAlert, TrendingUp, Info } from "lucide-react";

import { cn } from "@/lib/utils";

export type AnalyticsInsight = {
  id: string;
  severity: "info" | "positive" | "warning" | "attention";
  title: string;
  body: string;
};

const severityStyles: Record<AnalyticsInsight["severity"], string> = {
  info: "border-border/60 bg-muted/30",
  positive: "border-emerald-500/25 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  attention: "border-sky-500/30 bg-sky-500/5",
};

const severityIcon: Record<AnalyticsInsight["severity"], typeof Info> = {
  info: Info,
  positive: TrendingUp,
  warning: TriangleAlert,
  attention: Lightbulb,
};

/** Inline first-party helpers — no popovers; lives on the analytics page. */
export function AnalyticsInsightsPanel({ insights }: { insights: AnalyticsInsight[] }) {
  if (!insights.length) return null;

  return (
    <section className="flex flex-col gap-3" aria-label="Analytics helpers">
      <div>
        <h2 className="text-sm font-medium tracking-tight">Helpers</h2>
        <p className="text-xs text-muted-foreground">
          Reading dwell time and paths from BNS Tracker — what people open and where they stay.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = severityIcon[insight.severity] ?? Info;
          return (
            <article
              key={insight.id}
              className={cn(
                "rounded-xl border px-4 py-3 shadow-xs",
                severityStyles[insight.severity],
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-medium leading-snug">{insight.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{insight.body}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
