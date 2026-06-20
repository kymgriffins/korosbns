"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await learnHubApi.stage(slug);
      setMod(res);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-96" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">Module not found.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/learning-hub/modules">Back to Modules</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/dashboard/learning-hub/modules">
            <ArrowLeft className="size-4" />
            Back to Modules
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
            {mod.description && (
              <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
            )}
          </div>
          {mod.badgeName && (
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium uppercase leading-none text-secondary-foreground">
              {mod.badgeName}
            </span>
          )}
        </div>
      </div>

      {mod.author && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Author</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {mod.author.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{mod.author.name}</p>
              {mod.author.role && (
                <p className="text-xs text-muted-foreground">{mod.author.role}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Steps ({mod.steps?.length ?? 0})
        </h2>
        {!mod.steps?.length ? (
          <p className="text-sm text-muted-foreground">No steps in this module.</p>
        ) : (
          <div className="space-y-2">
            {mod.steps.map((step, idx) => (
              <Card
                key={step.id}
                className={cn(
                  "transition-colors",
                  step.is_locked && "pointer-events-none opacity-50",
                )}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {step.is_completed ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : step.is_locked ? (
                      <Lock className="size-3.5 text-muted-foreground" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{step.title}</p>
                    {step.estimated_minutes && (
                      <p className="text-xs text-muted-foreground">
                        ~{step.estimated_minutes} min
                      </p>
                    )}
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
