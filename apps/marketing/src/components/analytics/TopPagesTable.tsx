"use client";

import { Globe } from "lucide-react";

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesTable({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <Globe className="size-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No page data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {data.map((page, index) => (
        <div
          key={page.path}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-muted-foreground w-6 shrink-0">
              #{index + 1}
            </span>
            <span className="text-sm truncate">{page.path}</span>
          </div>
          <span className="text-sm font-medium tabular-nums shrink-0 ml-4">
            {page.views.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
