"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Loader2,
  Play,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import type {
  ContentLabSnapshot,
  PresenceCell,
  PresenceStatus,
  SuiteCheck,
} from "@/lib/content-lab";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  PresenceStatus,
  { label: string; className: string }
> = {
  API: {
    label: "API",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  FALLBACK: {
    label: "FALLBACK",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  MISSING: {
    label: "MISSING",
    className: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

function StatusBadge({ status }: { status: PresenceStatus }) {
  const meta = STATUS_STYLES[status];
  return (
    <Badge variant="secondary" className={cn("font-mono text-[10px]", meta.className)}>
      {meta.label}
    </Badge>
  );
}

function SuiteRow({
  check,
  getHref,
}: {
  check: SuiteCheck;
  getHref: (url: string) => string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3 py-2.5",
        check.pass
          ? "border-border/60 bg-card"
          : "border-red-200/60 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20",
      )}
    >
      {check.pass ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{check.name}</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {check.pass ? "PASS" : "FAIL"}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{check.message}</p>
      </div>
      {check.editUrl ? (
        <Button asChild variant="ghost" size="sm" className="shrink-0 gap-1 text-xs">
          <Link href={getHref(check.editUrl)}>
            Edit
            <ExternalLink className="size-3" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function ContentLab() {
  const routeBase = useRouteBase();
  const getHref = useCallback(
    (url: string) => getFullUrl(routeBase, url),
    [routeBase],
  );

  const [snapshot, setSnapshot] = useState<ContentLabSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/content-lab", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Suite failed (${res.status})`);
      }
      const data = (await res.json()) as ContentLabSnapshot;
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content lab");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const runSuite = async () => {
    setRunning(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content-lab", {
        method: "POST",
        cache: "no-store",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Suite failed (${res.status})`);
      }
      const data = (await res.json()) as ContentLabSnapshot;
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suite run failed");
    } finally {
      setRunning(false);
    }
  };

  const surfaceIds = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.surfaces.map((s) => s.id);
  }, [snapshot]);

  const cellsBySurface = useMemo(() => {
    const map = new Map<string, PresenceCell[]>();
    if (!snapshot) return map;
    for (const cell of snapshot.matrix) {
      const list = map.get(cell.surfaceId) ?? [];
      list.push(cell);
      map.set(cell.surfaceId, list);
    }
    return map;
  }, [snapshot]);

  if (loading && !snapshot) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading content lab…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <FlaskConical className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wide">P0 · Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Lab</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Inventory Level-1 sources, inspect surface required keys, and run the presence suite.
            Citizen apps keep serving fallbacks when Django is down.
          </p>
        </div>
        <Button onClick={runSuite} disabled={running} className="gap-2 shrink-0">
          {running ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4" />
          )}
          Run suite
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {snapshot ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Suite pass</CardDescription>
                <CardTitle className="text-2xl text-emerald-600">{snapshot.summary.pass}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Suite fail</CardDescription>
                <CardTitle className="text-2xl text-red-600">{snapshot.summary.fail}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>API cells</CardDescription>
                <CardTitle className="text-2xl">{snapshot.summary.api}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Fallback cells</CardDescription>
                <CardTitle className="text-2xl">{snapshot.summary.fallback}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Missing cells</CardDescription>
                <CardTitle className="text-2xl">{snapshot.summary.missing}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground">
            Last run {new Date(snapshot.ranAt).toLocaleString()}
            {snapshot.sourcesUpdated ? ` · sources file updated ${snapshot.sourcesUpdated}` : ""}
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Level-1 sources</CardTitle>
              <CardDescription>
                From audit/data/budget-sources.json — government provenance whitelist
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Org</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>lastChecked</TableHead>
                    <TableHead className="w-[80px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.level1Sources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="text-sm">{source.org}</TableCell>
                      <TableCell className="text-sm">{source.name}</TableCell>
                      <TableCell className="font-mono text-xs">{source.lastChecked}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                          <a href={source.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-3.5" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Presence matrix</CardTitle>
              <CardDescription>
                learn.hub.* mirrors + budget year critical keys · cell = API / FALLBACK / MISSING
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {surfaceIds.map((surfaceId) => {
                const surface = snapshot.surfaces.find((s) => s.id === surfaceId);
                const cells = cellsBySurface.get(surfaceId) ?? [];
                return (
                  <div key={surfaceId} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm font-medium">{surfaceId}</p>
                        {surface?.job ? (
                          <p className="text-xs text-muted-foreground">{surface.job}</p>
                        ) : null}
                      </div>
                      {surface?.editUrl ? (
                        <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                          <Link href={getHref(surface.editUrl)}>
                            Edit content
                            <ExternalLink className="size-3" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                    <div className="overflow-x-auto rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Key</TableHead>
                            <TableHead className="w-[110px]">Status</TableHead>
                            <TableHead>Detail</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cells.map((cell) => (
                            <TableRow key={`${cell.surfaceId}:${cell.key}`}>
                              <TableCell className="font-mono text-xs">{cell.key}</TableCell>
                              <TableCell>
                                <StatusBadge status={cell.status} />
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {cell.detail}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suite results</CardTitle>
              <CardDescription>Pass/fail list from the latest run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {snapshot.suite.map((check) => (
                <SuiteRow key={check.id} check={check} getHref={getHref} />
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Quick edits:</span>
            <Link className="underline-offset-2 hover:underline" href={getHref("/dashboard/modules")}>
              Modules
            </Link>
            <span>·</span>
            <Link className="underline-offset-2 hover:underline" href={getHref("/dashboard/stories")}>
              Stories
            </Link>
            <span>·</span>
            <Link className="underline-offset-2 hover:underline" href={getHref("/dashboard/media")}>
              Media
            </Link>
            <span>·</span>
            <Link className="underline-offset-2 hover:underline" href={getHref("/dashboard/ke-budget")}>
              KE Budget
            </Link>
            <span>·</span>
            <Link
              className="underline-offset-2 hover:underline"
              href={getHref("/dashboard/content-inventory")}
            >
              Content inventory
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
