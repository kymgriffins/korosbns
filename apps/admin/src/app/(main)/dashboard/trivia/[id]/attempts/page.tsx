"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
  adminTriviaApi,
  type AdminTriviaAttemptDetail,
  type AdminTriviaAttemptsPage,
} from "@/lib/admin-api";

type AttemptRow = AdminTriviaAttemptsPage["results"][number];

export default function TriviaAttemptsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminTriviaAttemptsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<AdminTriviaAttemptDetail | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminTriviaApi.listAttempts(id, page);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (attemptId: string) => {
    if (!id) return;
    try {
      const res = await adminTriviaApi.getAttempt(id, attemptId);
      setDetail(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load attempt");
    }
  };

  const columns: Column<AttemptRow>[] = [
    { key: "user", header: "User", cell: (r) => <span className="font-medium">{r.user_email}</span> },
    { key: "score", header: "Score", cell: (r) => <span className="tabular-nums">{r.score}</span> },
    {
      key: "completed",
      header: "Completed",
      cell: (r) => (
        <span className="text-sm text-muted-foreground">{new Date(r.completed_at).toLocaleString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <Button variant="ghost" size="sm" onClick={() => openDetail(r.id)}>
          Detail
        </Button>
      ),
    },
  ];

  const totalPages = data ? Math.max(1, Math.ceil(data.count / (data.page_size || 25))) : 1;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard/trivia">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trivia attempts</h1>
          <p className="text-sm text-muted-foreground">{id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data?.results ?? []}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {detail ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Attempt detail
              <Badge variant="secondary">{detail.user_email}</Badge>
              <Badge>Score {String(detail.score ?? 0)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(detail.questions ?? []).map((q) => (
              <div key={q.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{q.question_text}</p>
                <p className="mt-1 text-muted-foreground">
                  Selected: {q.selected_label ?? "—"}{" "}
                  {q.is_correct ? (
                    <Badge className="ml-2" variant="default">
                      correct
                    </Badge>
                  ) : (
                    <Badge className="ml-2" variant="secondary">
                      incorrect
                    </Badge>
                  )}
                </p>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setDetail(null)}>
              Close
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
