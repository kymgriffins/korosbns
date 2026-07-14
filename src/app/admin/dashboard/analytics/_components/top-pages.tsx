import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Page performance</CardTitle>
        <CardDescription>Top routes from analytics traffic</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        {pages.length === 0 ? (
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
              {pages.slice(0, 8).map((page) => (
                <TableRow className="hover:bg-transparent" key={page.path}>
                  <TableCell className="max-w-0 truncate py-3 font-medium">{page.path}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCount(page.views)}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {page.visitors != null ? formatCount(page.visitors) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
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
