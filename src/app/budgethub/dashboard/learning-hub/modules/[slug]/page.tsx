"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  BookOpenText,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PlayCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { ChapterStep, CivicModule, StageTrivia } from "@/types/learn";
import { usePageView } from "@/hooks/use-page-view";

function triviaForStep(stage: CivicModule, step: ChapterStep | undefined | null, stepIdx: number): StageTrivia[] {
  if (!step) return [];
  if (step.trivia?.length) return step.trivia;
  if (stage.trivia?.length) {
    if (stepIdx < stage.steps.length) {
      const perStep = Math.ceil(stage.trivia.length / stage.steps.length);
      const start = stepIdx * perStep;
      return stage.trivia.slice(start, start + perStep);
    }
  }
  return [];
}

export default function ModuleDetailPage() {
  usePageView();
  const params = useParams();
  const slug = params.slug as string;

  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"read" | "watch" | "quiz">("read");
  const [showTrivia, setShowTrivia] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (mod?.steps && currentStep === 0 && mod.steps.length > 0) {
      setCurrentStep(1);
    }
  }, [mod, currentStep]);

  const isMastery = currentStep > (mod?.steps?.length ?? 0);
  const currentStepObj = mod?.steps?.[currentStep - 1] ?? null;
  const currentTrivia = useMemo(
    () => (mod ? triviaForStep(mod, currentStepObj, currentStep - 1) : []),
    [mod, currentStepObj, currentStep],
  );
  const hasQuiz = currentTrivia.length > 0;

  const isStepPassed = (stepNum: number) => completedSteps.has(stepNum);

  const handleSelectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    setShowTrivia(false);
    setActiveTab("read");
  };

  const handleStepComplete = () => {
    if (!mod) return;
    const step = mod.steps[currentStep - 1];
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
    setShowTrivia(false);
    setActiveTab("read");

    if (step) {
      learnHubApi.completeChapter(step.id).catch(() => {});
    }
  };

  const handleFinishModule = () => {
    if (!mod) return;
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      mod.steps.forEach((_, i) => next.add(i + 1));
      return next;
    });
    learnHubApi.markProgress({ content_type: "path", content_id: mod.id, progress_percent: 100 }).catch(() => {});
    const lastStep = mod.steps[mod.steps.length - 1];
    if (lastStep) {
      learnHubApi.completeChapter(lastStep.id).then((res) => {
        if (res.certificate_id) {
          setCertificateId(res.certificate_id);
          setCertificateUrl(res.certificate_id ? `/api/v1/content/learn/certificate/${res.certificate_id}/download/` : null);
        }
      }).catch(() => {});
    }
    setCurrentStep(mod.steps.length + 1);
  };

  const parseVideoUrl = (step: ChapterStep | null): string | null => {
    if (!step) return null;
    if (step.videos?.length && step.videos[0]?.youtube_video_id) {
      return `https://www.youtube.com/embed/${step.videos[0].youtube_video_id}`;
    }
    if (step.youtube_urls?.length) {
      const match = step.youtube_urls[0].match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }
    if (step.youtube_url) {
      const match = step.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }
    return null;
  };

  const videoUrl = parseVideoUrl(currentStepObj);
  const progressPercent = mod?.steps?.length
    ? Math.round((completedSteps.size / mod.steps.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-var(--dashboard-header-height,3rem))] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-muted-foreground">Module not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/budgethub/dashboard/learning-hub/modules">Back to Modules</Link>
        </Button>
      </div>
    );
  }

  if (!mod.steps?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <BookOpen className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">This module has no steps yet.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/budgethub/dashboard/learning-hub/modules">Back to Modules</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      data-content-padding="false"
      className="flex h-[calc(100vh-var(--dashboard-header-height,3rem))] flex-col overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5 md:px-6">
        <Button asChild variant="ghost" size="icon-xs">
          <Link href="/budgethub/dashboard/learning-hub/modules">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Link href="/budgethub/dashboard/learning-hub/modules" className="hover:text-foreground">
              Modules
            </Link>
            <span>/</span>
            <span className="truncate text-foreground">{mod.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mod.badgeName && (
            <Badge variant="outline" className="text-[10px]">
              <BookOpen className="size-3" />
              {mod.badgeName}
            </Badge>
          )}
          <Badge variant="secondary" className="text-[10px]">
            {mod.steps.length} steps
          </Badge>
          <div className="hidden items-center gap-1.5 sm:flex">
            <Progress value={progressPercent} className="h-1.5 w-20" />
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {completedSteps.size}/{mod.steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Step viewer */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
            {isMastery ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Module Complete!</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  You&apos;ve completed all steps in {mod.title}.
                </p>
                {certificateUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={certificateUrl} target="_blank" rel="noreferrer">
                      Download Certificate
                    </a>
                  </Button>
                )}
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/budgethub/dashboard/learning-hub/modules">Back to Modules</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Step header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold tracking-tight">
                      {currentStepObj?.title || `Step ${currentStep}`}
                    </h1>
                    <span className="text-xs text-muted-foreground">
                      Step {currentStep} of {mod.steps.length}
                    </span>
                  </div>
                  {mod.description && (
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                  )}
                </div>

                {/* Step dots (mobile) */}
                <div className="flex items-center gap-1.5 overflow-x-auto md:hidden">
                  {mod.steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCurrent = currentStep === stepNum;
                    const passed = isStepPassed(step.order);
                    return (
                      <button
                        key={step.id}
                        onClick={() => handleSelectStep(stepNum)}
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                          isCurrent && "scale-110 bg-primary text-primary-foreground shadow-xs",
                          !isCurrent && passed && "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600",
                          !isCurrent && !passed && "border border-border/40 bg-muted/40 text-muted-foreground",
                        )}
                      >
                        {passed ? <CheckCircle2 className="size-3.5" /> : stepNum}
                      </button>
                    );
                  })}
                </div>

                {/* Tab bar */}
                <div className="flex items-center gap-1">
                  {[
                    { id: "read" as const, label: "Read", icon: BookOpenText },
                    { id: "watch" as const, label: "Watch", icon: Video },
                    ...(hasQuiz ? [{ id: "quiz" as const, label: "Quiz", icon: Brain }] : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                      )}
                    >
                      <tab.icon className="size-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Watch tab */}
                {activeTab === "watch" && (
                  <div className="space-y-3">
                    {videoUrl ? (
                      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                        <iframe
                          src={videoUrl}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentStepObj?.title ?? "Video"}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted/30">
                          <PlayCircle className="size-5 text-muted-foreground/40" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-muted-foreground/60">
                          Video coming soon
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Read tab */}
                {activeTab === "read" && currentStepObj && (
                  <div className="space-y-4">
                    {currentStepObj.learning_outcomes && currentStepObj.learning_outcomes.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-semibold text-muted-foreground">
                            Learning Outcomes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {currentStepObj.learning_outcomes.map((outcome) => (
                              <li key={outcome.id} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                <span>{outcome.description}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <div
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed"
                    >
                      {currentStepObj.text.split("\n").map((line, i) => (
                        line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                      ))}
                    </div>

                    {currentStepObj.takeaways && currentStepObj.takeaways.length > 0 && (
                      <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-semibold">Key Takeaways</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentStepObj.takeaways.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span
                                  className={cn(
                                    "mt-1 size-2 shrink-0 rounded-full",
                                    t.type === "warning" && "bg-amber-500",
                                    t.type === "tip" && "bg-blue-500",
                                    t.type === "info" && "bg-emerald-500",
                                  )}
                                />
                                <div>
                                  {t.title && (
                                    <span className="font-semibold">{t.title}: </span>
                                  )}
                                  <span className="text-muted-foreground">{t.text}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {currentStepObj.transcript && (
                      <details className="rounded-lg border bg-card">
                        <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                          Transcript
                        </summary>
                        <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                          {currentStepObj.transcript}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {/* Quiz tab */}
                {activeTab === "quiz" && (
                  <div className="space-y-4">
                    {!showTrivia ? (
                      <Card>
                        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                          <Brain className="size-10 text-primary/40" />
                          <div>
                            <h3 className="text-sm font-bold">Knowledge Check</h3>
                            <p className="text-xs text-muted-foreground">
                              Test what you learned in this step.
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowTrivia(true)}
                            size="sm"
                            className="rounded-lg text-xs font-bold"
                          >
                            Start Knowledge Check
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Brain className="size-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wide">
                            Knowledge Check
                          </span>
                        </div>
                        {currentTrivia.map((q, qIdx) => (
                          <TriviaQuestion key={qIdx} question={q} />
                        ))}
                        <Button
                          onClick={handleStepComplete}
                          className="w-full rounded-lg text-xs font-bold"
                          size="sm"
                        >
                          Complete Step
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step navigation */}
                <Separator />
                <div className="flex items-center justify-between gap-2 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep <= 1}
                    className="gap-1 rounded-lg text-xs font-bold"
                  >
                    <ChevronLeft className="size-3.5" />
                    Previous
                  </Button>

                  {currentStep < mod.steps.length ? (
                    currentStepObj && isStepPassed(currentStepObj.order) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectStep(currentStep + 1)}
                        className="gap-1 rounded-lg text-xs font-bold"
                      >
                        Next
                        <ChevronRight className="size-3.5" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleStepComplete}
                        className="gap-1 rounded-lg text-xs font-bold"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Complete & Continue
                      </Button>
                    )
                  ) : currentStep === mod.steps.length && !isStepPassed(mod.steps.length) ? (
                    <Button
                      size="sm"
                      onClick={handleFinishModule}
                      className="gap-1 rounded-lg text-xs font-bold"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Finish Module
                    </Button>
                  ) : currentStep === mod.steps.length + 1 ? null : (
                    <Button
                      size="sm"
                      onClick={handleFinishModule}
                      className="gap-1 rounded-lg text-xs font-bold"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Finish Module
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Curriculum sidebar */}
        <aside className="hidden w-72 shrink-0 border-l md:block">
          <ScrollArea className="h-full">
            <div className="p-4">
              {mod.author && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-muted/30 p-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {mod.author.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{mod.author.name}</p>
                    {mod.author.role && (
                      <p className="truncate text-[10px] text-muted-foreground">{mod.author.role}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold">Curriculum</h3>
                <span className="text-[10px] text-muted-foreground">
                  {completedSteps.size}/{mod.steps.length}
                </span>
              </div>

              <div className="space-y-1">
                {mod.steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const passed = isStepPassed(step.order);

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleSelectStep(stepNum)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-xs transition-colors",
                        isCurrent && "bg-primary/10 text-primary",
                        !isCurrent && "hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          isCurrent && "bg-primary text-primary-foreground",
                          !isCurrent && passed && "bg-emerald-500/15 text-emerald-600",
                          !isCurrent && !passed && "bg-muted text-muted-foreground",
                        )}
                      >
                        {passed ? <CheckCircle2 className="size-3" /> : stepNum}
                      </span>
                      <span
                        className={cn(
                          "line-clamp-2 leading-tight",
                          passed && !isCurrent && "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function TriviaQuestion({ question }: { question: StageTrivia }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = question.type === "reflection" ? true : question.answer === selected;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{question.question}</p>
          {question.type === "reflection" && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Reflection
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {question.options?.map((opt, optIdx) => {
            let style = "border-border/50 bg-card hover:bg-muted/30";
            if (submitted) {
              if (selected === optIdx) {
                style = isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 font-semibold dark:text-emerald-300"
                  : "border-destructive bg-destructive/10 text-destructive font-semibold";
              } else if (question.answer === optIdx && !isCorrect) {
                style = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
              } else {
                style = "border-border/30 opacity-50";
              }
            } else if (selected === optIdx) {
              style = "border-primary bg-primary/5";
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                disabled={submitted}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left text-sm transition-all",
                  style,
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {submitted && question.explanation && (
          <div
            className={cn(
              "mt-3 rounded-lg border p-2.5 text-xs leading-relaxed",
              isCorrect
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                : "border-destructive/20 bg-destructive/5 text-destructive",
            )}
          >
            <p className="font-semibold">
              {isCorrect ? "Correct!" : "Not quite"}
            </p>
            <p className="mt-0.5 text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
