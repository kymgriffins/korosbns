"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSurveysApi, type AdminSurveyResults } from "@/lib/admin-api";

export default function SurveyResultsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [results, setResults] = useState<AdminSurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await adminSurveysApi.results(id);
      setResults(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
      toast.error("Failed to load survey results");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard/surveys">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Survey results</h1>
          <p className="text-sm text-muted-foreground">{results?.title || id}</p>
        </div>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error && results ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                Responses
                <Badge variant="secondary">
                  {String(results.total_responses ?? results.response_count ?? 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {(results.questions ?? []).map((q) => (
              <Card key={q.question_id || q.id || q.text}>
                <CardHeader>
                  <CardTitle className="text-base">{q.text}</CardTitle>
                  <p className="text-xs text-muted-foreground">{q.type || q.question_type}</p>
                </CardHeader>
                <CardContent>
                  {q.counts ? (
                    <ul className="space-y-1 text-sm">
                      {Object.entries(q.counts).map(([label, count]) => (
                        <li key={label} className="flex justify-between gap-4">
                          <span>{label}</span>
                          <span className="tabular-nums text-muted-foreground">
                            {count}
                            {q.percentages?.[label] != null ? ` (${q.percentages[label]}%)` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : q.average != null ? (
                    <p className="text-sm">Average: {q.average}</p>
                  ) : (
                    <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
                      {JSON.stringify(q.samples ?? q.aggregates ?? q, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
            {(results.questions ?? []).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
