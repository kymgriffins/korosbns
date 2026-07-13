"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ClipboardList, MessageSquare, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminForumApi, adminSurveysApi, adminTriviaApi } from "@/lib/admin-api";
import { apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";

type EventListItem = { id: string; title?: string; name?: string };

export default function EngagementHubPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [surveyCount, setSurveyCount] = useState(0);
  const [triviaCount, setTriviaCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const settled = await Promise.allSettled([
      adminSurveysApi.list(),
      adminTriviaApi.list(),
      adminForumApi.listThreads({ page: 1 }),
      apiFetch<ApiListResponse<EventListItem> | EventListItem[]>("/content/events/", { auth: true }),
    ]);

    const failures: string[] = [];
    const countOf = (value: unknown) => {
      if (!value || typeof value !== "object") return 0;
      if (Array.isArray(value)) return value.length;
      const obj = value as ApiListResponse<unknown>;
      if (typeof obj.count === "number") return obj.count;
      return obj.results?.length ?? 0;
    };

    if (settled[0].status === "fulfilled") setSurveyCount(countOf(settled[0].value));
    else failures.push("surveys");
    if (settled[1].status === "fulfilled") setTriviaCount(countOf(settled[1].value));
    else failures.push("trivia");
    if (settled[2].status === "fulfilled") setForumCount(countOf(settled[2].value));
    else failures.push("forum");
    if (settled[3].status === "fulfilled") setEventCount(countOf(settled[3].value));
    else failures.push("events");

    if (failures.length === settled.length) {
      setError("Failed to load engagement overview. Check auth and API availability.");
    } else if (failures.length > 0) {
      setError(`Partial load — could not fetch: ${failures.join(", ")}.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis = [
    { label: "Surveys", value: surveyCount, icon: ClipboardList, href: "/dashboard/surveys" },
    { label: "Trivia", value: triviaCount, icon: Trophy, href: "/dashboard/trivia" },
    { label: "Forum threads", value: forumCount, icon: MessageSquare, href: "/dashboard/forum" },
    {
      label: "Events",
      value: eventCount,
      icon: CalendarDays,
      href: "/dashboard/events",
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Engagement</h1>
        <p className="text-sm text-muted-foreground">
          Overview of surveys, trivia, forum, and events.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="block">
            <Card className="transition-colors hover:bg-accent/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <span className="text-muted-foreground">…</span> : kpi.value}
                </div>
                {"note" in kpi && kpi.note ? (
                  <p className="mt-1 text-xs text-muted-foreground">{kpi.note}</p>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
