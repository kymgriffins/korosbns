import { useMemo } from "react";
import { Globe } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isShowcasePage } from "@/lib/page-categories";

export type TopPageRow = {
  path: string;
  views: number;
  visitors?: number;
  percentage?: number;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}



export function TopPages({
  pages,
  emptyLabel = "No page data yet",
}: {
  pages: TopPageRow[];
  emptyLabel?: string;
}) {
  const { showcasePages, marketingViews, marketingVisitors, marketingShare } = useMemo(() => {
    const showcase = pages.filter((p) => isShowcasePage(p.path));
    const mViews = showcase.reduce((sum, p) => sum + (p.views ?? 0), 0);
    const mVisitors = showcase.reduce((sum, p) => sum + (p.visitors ?? 0), 0);
    const totalViews = pages.reduce((sum, p) => sum + (p.views ?? 0), 0);
    const mShare = totalViews > 0 ? Math.round((mViews / totalViews) * 100) : 0;
    return { showcasePages: showcase.slice(0, 8), marketingViews: mViews, marketingVisitors: mVisitors, marketingShare: mShare };
  }, [pages]);

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-normal">Page performance</CardTitle>
            <CardDescription>Showcase pages from analytics traffic</CardDescription>
          </div>
          {pages.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="size-3" />
              <span>
                {formatCount(marketingViews)} views · {marketingShare}% of traffic
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {showcasePages.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
            <TableHeader className="[&_tr]:border-border/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 font-normal">Path</TableHead>
                <TableHead className="h-8 w-24 text-right font-normal">Views</TableHead>
                <TableHead className="h-8 w-24 text-right font-normal">Visitors</TableHead>
                <TableHead className="h-8 w-16 text-right font-normal">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-border/50">
              {showcasePages.map((page) => (
                <TableRow className="hover:bg-transparent" key={page.path}>
                  <TableCell className="max-w-0 truncate py-3 font-medium">{page.path}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCount(page.views)}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {page.visitors != null ? formatCount(page.visitors) : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {page.percentage != null ? `${page.percentage}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
