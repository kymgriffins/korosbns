"use client";

import { Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type CountryRow = {
  code: string;
  pageviews: number;
  visitors: number;
  percentage?: number;
};

function flag(code: string): string {
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(...code.split("").map((c) => c.charCodeAt(0) + offset));
}

export function RealtimeVisitors({ countries }: { countries: CountryRow[] }) {
  if (countries.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-normal">Visitors by location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No country data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalVisitors = countries.reduce((s, c) => s + c.visitors, 0);
  const sorted = [...countries].sort((a, b) => b.visitors - a.visitors);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Visitors by location</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl tabular-nums leading-none tracking-tight">
              {totalVisitors.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">visitors</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Globe className="size-3.5" />
            <span>{countries.length} countries</span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          {sorted.map((c, i) => {
            const isLastRow = i >= sorted.length - (sorted.length % 2 || 2);
            const showBorder = i < sorted.length - (sorted.length % 2 || 2);
            return (
              <div
                key={c.code}
                className={`flex items-center gap-3 ${
                  showBorder ? "border-border/50 border-r border-b pb-4" : ""
                } ${isLastRow && i % 2 === 0 ? "" : ""}`}
                style={{ paddingTop: 4, paddingBottom: 4 }}
              >
                <span className="text-lg">{flag(c.code)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{c.code}</span>
                <span className="text-sm tabular-nums">{c.visitors}</span>
                {c.percentage != null ? (
                  <span className="text-xs text-muted-foreground tabular-nums">{c.percentage}%</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
