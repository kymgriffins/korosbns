"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Download,
  ExternalLink,
  Award,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Separator } from "@/ui/separator";
import { cn } from "@/utils";
import { learnHubApi } from "@/lib/learn-hub";
import { useSidebar } from "@/ui/sidebar";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { triviaForStep } from "@/lib/learn-trivia";
import { certificateDownloadHref } from "@/lib/certificate-url";
import { renderContent } from "@/lib/render-content";
import { resolveYoutubeId } from "@/lib/learn-video";
import { apiFetch } from "@/lib/api-client";
import { YouTubePlayer } from "./youtube-player";
import { TriviaSection } from "./trivia-section";
import type { ChapterStep, CivicModule } from "@/types/learn";

function parseVideoEntries(step: ChapterStep | null): { videoId: string; title: string }[] {
  if (!step) return [];
  const entries: { videoId: string; title: string }[] = [];

  if (step.videos?.length) {
    for (const v of step.videos) {
      const id = v.youtube_video_id || (v.url ? resolveYoutubeId(v.url) : "");
      if (id) entries.push({ videoId: id, title: v.title || v.role || "Video" });
    }
  }
  if (step.youtube_urls?.length) {
    for (const url of step.youtube_urls) {
      const id = resolveYoutubeId(url);
      if (id && !entries.some((e) => e.videoId === id)) {
        entries.push({ videoId: id, title: "Video" });
      }
    }
  }
  if (step.youtube_url) {
    const id = resolveYoutubeId(step.youtube_url);
    if (id && !entries.some((e) => e.videoId === id)) {
      entries.push({ videoId: id, title: "Video" });
    }
  }

  return entries;
}

type TabId = "read" | "watch" | "quiz";

export function ModuleDetailView() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("read");
  const [showTrivia, setShowTrivia] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const { setOpen: setSidebarOpen } = useSidebar();

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  const fetchModule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await learnHubApi.stage(slug);
      setMod(res);
      if (res.steps?.length) {
        const p = readProgress(res.slug, res.order);
        const startStep = p.currentStep || 1;
        setCurrentStep(startStep);
        const completed = new Set<number>();
        for (const step of res.steps) {
          if (p.stepsCompleted[step.order]) {
            completed.add(step.order);
          }
        }
        setCompletedSteps(completed);
      }
    } catch {
      setMod(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  useEffect(() => {
    if (mod?.steps?.length && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [mod, currentStep]);

  const isMastery = currentStep > (mod?.steps?.length ?? 0);
  const currentStepObj = !isMastery && currentStep > 0 ? mod?.steps?.[currentStep - 1] ?? null : null;
  const currentTrivia = useMemo(
    () => (mod ? triviaForStep(mod, currentStepObj, currentStep - 1) : []),
    [mod, currentStepObj, currentStep],
  );
  const hasQuiz = currentTrivia.length > 0;
  const videoEntries = parseVideoEntries(currentStepObj);
  const steps = mod?.steps ?? [];
  const progressPercent = steps.length ? Math.round((completedSteps.size / steps.length) * 100) : 0;

  const isStepPassed = (stepNum: number) => {
    const step = steps[stepNum - 1];
    return step ? completedSteps.has(step.order) : false;
  };

  const handleSelectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    setShowTrivia(false);
    setActiveTab("read");
    setActiveVideoIdx(0);
    if (mod) {
      const p = readProgress(mod.slug, mod.order);
      writeProgress(mod.slug, { ...p, currentStep: stepNum });
    }
  };

  const handleCorrectAnswer = (qIdx: number) => {
    if (!mod || !currentStepObj) return;
    const rewardTag = `${currentStepObj.order}_${qIdx}`;
    const p = readProgress(mod.slug, mod.order);
    if (!p.triviaRewards.includes(rewardTag)) {
      writeProgress(mod.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
      apiFetch<{ points: number }>("/gamification/trivia-answers/", {
        method: "POST",
        body: JSON.stringify({
          module_slug: mod.slug,
          chapter_order: currentStepObj.order,
          question_index: qIdx,
          is_correct: true,
          idempotency_key: rewardTag,
        }),
      }).catch(() => {});
    }
  };

  const handleFinishTrivia = () => {
    if (!mod || !currentStepObj) return;
    const p = readProgress(mod.slug, mod.order);
    writeProgress(mod.slug, {
      ...p,
      stepsCompleted: { ...p.stepsCompleted, [currentStepObj.order]: true },
      currentStep: currentStep + 1,
    });
    setCompletedSteps((prev) => new Set(prev).add(currentStepObj.order));
    learnHubApi.completeChapter(currentStepObj.id).catch(() => {});
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      setShowTrivia(false);
      setActiveTab("read");
      setActiveVideoIdx(0);
    } else {
      handleFinishModule();
    }
  };

  const handleFinishModule = () => {
    if (!mod) return;
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      mod.steps.forEach((_step: ChapterStep, i: number) => next.add(i + 1));
      return next;
    });
    const p = readProgress(mod.slug, mod.order);
    writeProgress(mod.slug, { ...p, masteryAwarded: true, stepsCompleted: Object.fromEntries(mod.steps.map((s: ChapterStep) => [s.order, true])) });
    learnHubApi.markProgress({ content_type: "path", content_id: mod.id, progress_percent: 100 }).catch(() => {});
    const lastStep = mod.steps[mod.steps.length - 1];
    if (lastStep) {
      learnHubApi.completeChapter(lastStep.id).then((res) => {
        if (res.certificate_id) {
          setCertificateId(res.certificate_id);
          setCertificateUrl(certificateDownloadHref(res.certificate_id));
        }
      }).catch(() => {});
    }
    setCurrentStep(mod.steps.length + 1);
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center bg-background"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!mod) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background p-6">
        <BookOpen className="size-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Module not found.</p>
        <Button asChild variant="outline" size="sm"><Link href="/learn">Back to Learning Hub</Link></Button>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background p-6">
        <BookOpen className="size-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">This module has no steps yet.</p>
        <Button asChild variant="outline" size="sm"><Link href="/learn">Back to Learning Hub</Link></Button>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: typeof BookOpenText }[] = [
    { id: "read", label: "Read", icon: BookOpenText },
    ...(videoEntries.length > 0 ? [{ id: "watch" as const, label: "Watch", icon: Video }] : []),
    ...(hasQuiz ? [{ id: "quiz" as const, label: "Quiz", icon: Brain }] : []),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-2 border-b px-3 py-2 md:px-5 md:py-2.5 md:bg-background md:sticky md:top-0 md:z-10">
        <button onClick={() => router.push("/learn")} className="p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1 md:hidden">
          <ChevronLeft className="size-4" />
        </button>
        <Link href="/learn" className="hidden md:flex p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1">
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-medium truncate">
            <Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="truncate text-foreground font-semibold">{mod.title}</span>
          </nav>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {mod.badgeName && (
            <Badge variant="outline" className="text-xs hidden sm:flex">
              <BookOpen className="size-3" /> {mod.badgeName}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">{steps.length} steps</Badge>
          <div className="hidden items-center gap-1.5 sm:flex">
            <Progress value={progressPercent} className="h-1.5 w-16" />
            <span className="text-xs tabular-nums text-muted-foreground">{completedSteps.size}/{steps.length}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        {/* Content area */}
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          {/* Step dots — mobile */}
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 py-2 scrollbar-hide md:hidden border-b">
            {steps.map((step: ChapterStep, idx: number) => {
              const stepNum = idx + 1;
              const isCurrent = currentStep === stepNum;
              const passed = isStepPassed(stepNum);
              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(stepNum)}
                  className={cn(
                    "shrink-0 size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCurrent && passed && "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600",
                    !isCurrent && !passed && "border bg-muted/40 text-muted-foreground",
                  )}
                  title={step.title}
                >
                  {passed ? <CheckCircle2 className="size-3.5" /> : stepNum}
                </button>
              );
            })}
          </div>

          {/* Tab bar */}
          {!isMastery && (
            <div className="flex shrink-0 items-center gap-1 px-3 py-2 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-3.5" />
                  {tab.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground font-medium">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain md:border-t">
            <div className="mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
              {isMastery ? (
                <div className="flex flex-col items-center gap-5 py-16 text-center">
                  <div className="text-5xl">{mod.badge || "🎉"}</div>
                  {mod.badgeName && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600">
                      {mod.badgeName} Unlocked!
                    </span>
                  )}
                  <h2 className="text-2xl font-bold tracking-tight">{mod.title}</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">You completed all steps in this module.</p>

                  <div className="rounded-xl border bg-card p-4 space-y-2 max-w-xs">
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5"><Award className="size-4" /> Rewards Earned</p>
                    <p className="text-xl font-bold text-emerald-600">+25 SVG</p>
                    {certificateId && (
                      <p className="text-xs text-muted-foreground">Credential: BNS-{mod.badgeName}-{certificateId.slice(0, 8).toUpperCase()}</p>
                    )}
                  </div>

                  {certificateUrl && (
                    <a href={certificateUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm">
                      <Download className="size-5 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-bold">Download Certificate</p>
                        <p className="text-xs text-muted-foreground">Printable certificate — BNS Certified</p>
                      </div>
                      <ExternalLink className="size-4 text-muted-foreground/40" />
                    </a>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm"><Link href="/learn">Back to Hub</Link></Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Step header */}
                  <div className="space-y-1">
                    <h1 className="text-lg font-bold md:text-xl">{currentStepObj?.title || `Step ${currentStep}`}</h1>
                    {mod.description && (
                      <p className="text-sm text-muted-foreground">{mod.description}</p>
                    )}
                  </div>

                  {/* Watch tab */}
                  {activeTab === "watch" && (
                    <div className="space-y-3">
                      {videoEntries.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              {videoEntries[activeVideoIdx]?.title || `Video ${activeVideoIdx + 1}`}
                              {videoEntries.length > 1 && <span> · {activeVideoIdx + 1} of {videoEntries.length}</span>}
                            </span>
                            {videoEntries.length > 1 && (
                              <div className="flex items-center gap-1">
                                <button onClick={() => setActiveVideoIdx((p) => Math.max(0, p - 1))} disabled={activeVideoIdx === 0}
                                  className="size-7 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                  <ChevronLeft className="size-3.5" />
                                </button>
                                <button onClick={() => setActiveVideoIdx((p) => Math.min(videoEntries.length - 1, p + 1))} disabled={activeVideoIdx === videoEntries.length - 1}
                                  className="size-7 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                  <ChevronRight className="size-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                          <YouTubePlayer videoId={videoEntries[activeVideoIdx].videoId} title={videoEntries[activeVideoIdx].title} />
                          {videoEntries.length > 1 && (
                            <div className="flex items-center justify-center gap-1.5">
                              {videoEntries.map((_, i) => (
                                <span key={i} className={cn("block rounded-full transition-all duration-200", i === activeVideoIdx ? "bg-primary w-5 h-1.5" : "bg-muted-foreground/25 w-1.5 h-1.5")} />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-muted">
                          <PlayCircle className="size-8 text-muted-foreground/40" />
                          <p className="mt-2 text-sm font-medium text-muted-foreground/60">Video coming soon</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Read tab */}
                  {activeTab === "read" && currentStepObj && (
                    <div className="space-y-5">
                      {currentStepObj.learning_outcomes && currentStepObj.learning_outcomes.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">Learning Outcomes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {currentStepObj.learning_outcomes.map((outcome: { id: string; description: string }) => (
                                <li key={outcome.id} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                  <span>{outcome.description}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {currentStepObj.image_urls && currentStepObj.image_urls.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentStepObj.image_urls.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`${currentStepObj.title} image ${i + 1}`}
                              className="rounded-xl object-cover w-full aspect-[4/3] bg-muted/40" loading="lazy" />
                          ))}
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed">
                        {renderContent(currentStepObj.text)}
                      </div>

                      {currentStepObj.takeaways && currentStepObj.takeaways.length > 0 && (
                        <Card className="border-primary/20 bg-primary/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Key Takeaways</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {currentStepObj.takeaways.map((t: { type?: string; title?: string; text: string }, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className={cn("mt-1 size-2 shrink-0 rounded-full", t.type === "warning" && "bg-amber-500", t.type === "tip" && "bg-blue-500", (t.type === "info" || !t.type) && "bg-emerald-500")} />
                                  <div>
                                    {t.title && <span className="font-semibold">{t.title}: </span>}
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
                          <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Transcript</summary>
                          <div className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground">{currentStepObj.transcript}</div>
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
                              <h3 className="text-base font-bold">Knowledge Check</h3>
                              <p className="text-sm text-muted-foreground">Test what you learned in this step.</p>
                            </div>
                            <Button onClick={() => setShowTrivia(true)} size="sm" className="rounded-lg text-sm font-bold">
                              Start Knowledge Check
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <TriviaSection
                          trivia={currentTrivia}
                          stepId={currentStepObj?.order ?? currentStep}
                          showTrivia={showTrivia}
                          isStepTriviaPassed={(stepId) => isStepPassed(stepId)}
                          onCorrectAnswer={handleCorrectAnswer}
                          onFinish={handleFinishTrivia}
                        />
                      )}
                    </div>
                  )}

                  {/* Step navigation */}
                  {!isMastery && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between gap-2 pb-4">
                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleSelectStep(Math.max(1, currentStep - 1))}
                          disabled={currentStep <= 1}
                          className="gap-1 rounded-lg text-sm font-semibold"
                        >
                          <ChevronLeft className="size-3.5" /> Previous
                        </Button>

                        <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                          Step {currentStep} of {steps.length}
                        </span>

                        {currentStep < steps.length ? (
                          currentStepObj && isStepPassed(currentStepObj.order) ? (
                            <Button variant="outline" size="sm" onClick={() => handleSelectStep(currentStep + 1)} className="gap-1 rounded-lg text-sm font-semibold">
                              Next <ChevronRight className="size-3.5" />
                            </Button>
                          ) : activeTab === "quiz" ? (
                            <Button size="sm" onClick={handleFinishTrivia} className="gap-1 rounded-lg text-sm font-semibold">
                              <CheckCircle2 className="size-3.5" /> Complete & Continue
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => { if (hasQuiz) setActiveTab("quiz"); else handleFinishTrivia(); }} className="gap-1 rounded-lg text-sm font-semibold">
                              {hasQuiz ? "Take Quiz" : "Complete"} <ArrowRight className="size-3.5" />
                            </Button>
                          )
                        ) : currentStep === steps.length && !isStepPassed(steps[steps.length - 1]?.order) ? (
                          <Button size="sm" onClick={handleFinishModule} className="gap-1 rounded-lg text-sm font-semibold">
                            <CheckCircle2 className="size-3.5" /> Finish Module
                          </Button>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 border-l md:flex md:flex-col md:h-[calc(100dvh-8rem)]">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {mod.author && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-muted/30 p-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {mod.author.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{mod.author.name}</p>
                    {mod.author.role && <p className="truncate text-xs text-muted-foreground">{mod.author.role}</p>}
                  </div>
                </div>
              )}

              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Curriculum</h3>
                <span className="text-xs text-muted-foreground">{completedSteps.size}/{steps.length}</span>
              </div>

              <div className="space-y-1">
                {steps.map((step: ChapterStep, idx: number) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const passed = isStepPassed(stepNum);
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleSelectStep(stepNum)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-sm transition-colors",
                        isCurrent && "bg-primary/10 text-primary",
                        !isCurrent && "hover:bg-muted/50",
                      )}
                    >
                      <span className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        isCurrent && "bg-primary text-primary-foreground",
                        !isCurrent && passed && "bg-emerald-500/15 text-emerald-600",
                        !isCurrent && !passed && "bg-muted text-muted-foreground",
                      )}>
                        {passed ? <CheckCircle2 className="size-3" /> : stepNum}
                      </span>
                      <span className={cn("line-clamp-2 leading-tight", passed && !isCurrent && "text-muted-foreground")}>{step.title}</span>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
