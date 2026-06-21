"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await learnHubApi.stage(slug);
      setMod(res);
    } catch { } finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="mb-4 size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">The course you are looking for does not exist or has been removed.</p>
        <Button variant="outline" className="mt-4" asChild><Link href="/dashboard/lms/courses">Back to courses</Link></Button>
      </div>
    );
  }

  const step = mod.steps[currentStep] ?? null;
  const completedSteps = mod.steps.filter((s) => s.is_completed).length;
  const progress = mod.steps.length > 0 ? Math.round((completedSteps / mod.steps.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/lms/courses"><ChevronLeft className="size-5" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
            {mod.badgeName && <Badge variant="secondary" className="rounded-full">{mod.badgeName}</Badge>}
            <Badge variant={mod.status === "published" ? "default" : "outline"} className="capitalize">{mod.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{mod.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><BookOpen className="size-4" />{mod.steps.length} steps</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="size-4" />{completedSteps} completed</span>
        {mod.author && <span>By {mod.author.name}</span>}
      </div>

      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-medium tabular-nums">{progress}%</span>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-semibold">Course Steps</h2>
          {mod.steps.map((s, idx) => (
            <button key={s.id} onClick={() => setCurrentStep(idx)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm",
                idx === currentStep && "border-primary/60 bg-primary/5",
                s.is_completed && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
              )}>
              <div className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                s.is_completed ? "bg-green-500 text-white" : idx === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}>
                {s.is_completed ? <CheckCircle2 className="size-4" /> : idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.title}</p>
                {s.estimated_minutes && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{s.estimated_minutes} min</span>
                )}
              </div>
              {s.youtube_url && <PlayCircle className="mt-1 size-4 shrink-0 text-muted-foreground" />}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">{step?.title ?? "Step Detail"}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {step ? (
                <>
                  {step.youtube_url && (
                    <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                      <iframe src={step.youtube_url.replace("watch?v=", "embed/")} title={step.title}
                        className="h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    </div>
                  )}
                  {step.text && <p className="text-muted-foreground leading-relaxed">{step.text}</p>}
                  {step.transcript && (
                    <details className="group">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">Transcript</summary>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{step.transcript}</p>
                    </details>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" disabled={currentStep === 0} onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}>
                      <ChevronLeft className="mr-1 size-4" /> Previous
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums">{currentStep + 1} / {mod.steps.length}</span>
                    <Button variant="outline" size="sm" disabled={currentStep >= mod.steps.length - 1} onClick={() => setCurrentStep((p) => Math.min(mod.steps.length - 1, p + 1))}>
                      Next <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Select a step to view details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
