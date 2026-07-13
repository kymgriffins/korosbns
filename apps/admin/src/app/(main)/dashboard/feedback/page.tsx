"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
  adminContentFeedbackApi,
  normalizeListResponse,
  type ContentFeedbackItem,
} from "@/lib/admin-api";

const CONTENT_TYPES = [
  { value: "all", label: "All types" },
  { value: "civic_module", label: "Civic module" },
  { value: "civic_chapter", label: "Civic chapter" },
  { value: "article", label: "Article" },
  { value: "knowledge_entry", label: "Knowledge" },
] as const;

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "ACTIONED", label: "Actioned" },
] as const;

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<ContentFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contentType, setContentType] = useState("all");
  const [status, setStatus] = useState("all");
  const [summary, setSummary] = useState<{
    total: number;
    average_rating: number;
    by_status: Record<string, number>;
  } | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listRes, summaryRes] = await Promise.all([
        adminContentFeedbackApi.list({
          content_type: contentType === "all" ? undefined : contentType,
          status: status === "all" ? undefined : status,
        }),
        adminContentFeedbackApi.summary().catch(() => null),
      ]);
      const { results, count } = normalizeListResponse(listRes);
      // Client-side page slice — API may already paginate; keep simple when unpaginated.
      const pageSize = 25;
      const start = (page - 1) * pageSize;
      const pageResults = results.length > pageSize ? results.slice(start, start + pageSize) : results;
      setItems(pageResults);
      setTotalPages(Math.max(1, Math.ceil((count || results.length) / pageSize)));
      if (summaryRes) {
        setSummary({
          total: summaryRes.total,
          average_rating: summaryRes.average_rating,
          by_status: summaryRes.by_status ?? {},
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, [contentType, status, page]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filtered = search
    ? items.filter(
        (i) =>
          (i.comment || "").toLowerCase().includes(search.toLowerCase()) ||
          (i.created_by_email || "").toLowerCase().includes(search.toLowerCase()) ||
          i.content_id.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const columns: Column<ContentFeedbackItem>[] = [
    {
      key: "rating",
      header: "Rating",
      cell: (i) => <span className="tabular-nums font-medium">{i.rating}/5</span>,
    },
    {
      key: "type",
      header: "Type",
      cell: (i) => (
        <Badge variant="secondary" className="text-[10px]">
          {i.content_type}
        </Badge>
      ),
    },
    {
      key: "comment",
      header: "Comment",
      cell: (i) => (
        <span className="text-sm text-muted-foreground line-clamp-2">{i.comment || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => (
        <Badge variant={i.status === "NEW" ? "default" : "outline"} className="text-[10px]">
          {i.status_display || i.status}
        </Badge>
      ),
    },
    {
      key: "by",
      header: "From",
      cell: (i) => (
        <span className="text-sm text-muted-foreground">{i.created_by_email || "Anonymous"}</span>
      ),
    },
    {
      key: "when",
      header: "When",
      cell: (i) => (
        <span className="text-sm text-muted-foreground">
          {i.created_at ? new Date(i.created_at).toLocaleString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Learner ratings and comments. Status updates (READ/ACTIONED) are not available via JSON yet.
        </p>
      </div>

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{summary.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {Number(summary.average_rating || 0).toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{summary.by_status?.NEW ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select
              value={contentType}
              onValueChange={(v) => {
                setContentType(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            searchable
            searchPlaceholder="Search comment, email, content id…"
            searchValue={search}
            onSearchChange={setSearch}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            emptyMessage="No feedback yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
