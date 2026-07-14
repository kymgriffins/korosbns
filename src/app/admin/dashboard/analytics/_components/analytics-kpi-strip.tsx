import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type AnalyticsKpiItem = {
  label: string;
  value: string;
  changePct?: number | null;
  fromLabel?: string;
  periodLabel?: string;
};

function ChangeBadge({ changePct }: { changePct: number }) {
  const up = changePct >= 0;
  return (
    <Badge
      className={cn(
        up
          ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {up ? <ArrowUpRight /> : <ArrowDownRight />}
      {Math.abs(changePct).toFixed(1)}%
    </Badge>
  );
}

export function AnalyticsKpiStrip({
  items,
  loading,
}: {
  items: AnalyticsKpiItem[];
  loading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div
        className={cn(
          "grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:shadow-none *:data-[slot=card]:ring-0",
          "md:grid-cols-2 md:divide-x md:divide-y-0",
          items.length >= 5 ? "xl:grid-cols-5" : "xl:grid-cols-4",
        )}
      >
        {(loading ? Array.from({ length: Math.max(items.length, 4) }) : items).map((item, i) => {
          const kpi = loading ? null : (item as AnalyticsKpiItem);
          return (
            <Card key={kpi?.label ?? `kpi-skel-${i}`} data-slot="card">
              <CardHeader>
                <CardTitle className="font-normal text-sm">
                  {loading ? <Skeleton className="h-4 w-20" /> : kpi!.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {loading ? (
                  <>
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-2xl leading-none tracking-tight tabular-nums">
                        {kpi!.value}
                      </div>
                      {typeof kpi!.changePct === "number" ? (
                        <ChangeBadge changePct={kpi!.changePct} />
                      ) : null}
                    </div>
                    {(kpi!.fromLabel || kpi!.periodLabel) && (
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        {kpi!.fromLabel ? (
                          <span>
                            from <span className="text-foreground">{kpi!.fromLabel}</span>
                          </span>
                        ) : null}
                        {kpi!.fromLabel && kpi!.periodLabel ? <span>•</span> : null}
                        {kpi!.periodLabel ? <span>{kpi!.periodLabel}</span> : null}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
