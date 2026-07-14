import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type TimeSpentRow = {
  path: string;
  total_seconds: number;
  avg_seconds: number;
  hits: number;
  share_pct: number;
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function TimeSpentTable({
  rows,
  emptyLabel = "No pageleave durations yet — browse the site to collect dwell time.",
}: {
  rows: TimeSpentRow[];
  emptyLabel?: string;
}) {
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Where people spend time</CardTitle>
        <CardDescription>
          Ranked by total dwell from first-party <code className="text-[10px]">pageleave</code> events
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
            <TableHeader className="[&_tr]:border-border/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 font-normal">Path</TableHead>
                <TableHead className="h-8 w-24 text-right font-normal">Total</TableHead>
                <TableHead className="h-8 w-24 text-right font-normal">Avg</TableHead>
                <TableHead className="h-8 w-16 text-right font-normal">Hits</TableHead>
                <TableHead className="h-8 w-16 text-right font-normal">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-border/50">
              {rows.map((row) => (
                <TableRow className="hover:bg-transparent" key={row.path}>
                  <TableCell className="max-w-0 truncate py-3 font-medium">{row.path}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatDuration(row.total_seconds)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {formatDuration(row.avg_seconds)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.hits}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {row.share_pct}%
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
