"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePageView } from "@/hooks/use-page-view";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import { learnHubApi } from "@/lib/learn-hub";
import { learningData } from "@/data/learning";
import { useSidebar } from "@/components/ui/sidebar";
import { useLearn } from "@/contexts/learn-context";
import { LearnProgressRail, LearnStageShell } from "@/components/learn/learn-stage";
import { formatSovereignGain } from "@/lib/learn-gamification";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { triviaForStep } from "@/lib/learn-trivia";
import { certificateDownloadHref } from "@/lib/certificate-url";
import { renderContent } from "@/lib/render-content";
import { resolveYoutubeId } from "@/lib/learn-video";
import { apiFetch } from "@/lib/api-client";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/motion/hooks";
import { learnPageTurn, learnTransition } from "@/components/learn/learn-motion";
import { ChamberSealOverlay } from "@/components/learn/learn-chamber-ui";
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
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { setActiveLesson, updateCurrentStep } = useLearn();

  const [mod, setMod] = useState<CivicModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("read");
  const [showTrivia, setShowTrivia] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [showSeal, setShowSeal] = useState(false);
  const [sealLabel, setSealLabel] = useState("Step recorded");
  const [pendingAfterSeal, setPendingAfterSeal] = useState<"next" | null>(null);
  const reduced = useReducedMotionSafe();
  const { setOpen: setSidebarOpen } = useSidebar();

  usePageView();

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  const fetchModule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await learningData.modules.fetchBySlug(slug);
      if (!res) {
        setMod(null);
        return;
      }
      setMod(res);
      if (res.steps?.length) {
        const p = readProgress(res.slug, res.order);
        const stepFromUrl = Number(searchParams.get("step"));
        const startStep = stepFromUrl > 0 ? stepFromUrl : (p.currentStep || 1);
        setCurrentStep(startStep);
        const completed = new Set<number>();
        for (const step of res.steps) {
          if (p.stepsCompleted[step.order]) {
            completed.add(step.order);
          }
        }
        setCompletedSteps(completed);
        setActiveLesson({
          stageId: res.slug,
          stageTitle: res.title,
          stageBadge: res.badge,
          stageOrder: res.order,
          currentStep: startStep,
          totalSteps: res.steps.length,
          completedStepIds: [...completed],
          stepTitles: res.steps.map((s) => ({ id: s.order, title: s.title })),
        });
      }
    } catch {
      setMod(null);
    } finally {
      setLoading(false);
    }
  }, [slug, searchParams, setActiveLesson]);

  useEffect(() => {
    return () => setActiveLesson(null);
  }, [setActiveLesson]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  useEffect(() => {
    if (mod?.steps?.length && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [mod, currentStep]);

  useEffect(() => {
    if (currentStep > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const isMastery = currentStep > (mod?.steps?.length ?? 0);
  const currentStepObj = !isMastery && currentStep > 0 ? mod?.steps?.[currentStep - 1] ?? null : null;
  const currentTrivia = useMemo(
    () => (mod ? triviaForStep(mod, currentStepObj, currentStep - 1) : []),
    [mod, currentStepObj, currentStep],
  );
  const hasQuiz = currentTrivia.length > 0;
  const videoEntries = parseVideoEntries(currentStepObj);
  const steps = mod?.steps ?? [];

  const readingTime = useMemo(() => {
    if (!currentStepObj) return "";
    const words = (currentStepObj.text || "").split(/\s+/).filter(Boolean).length;
    const textMinutes = Math.ceil(words / 200);
    const mediaCount = (currentStepObj.image_urls?.length || 0) + videoEntries.length;
    const totalMinutes = textMinutes + Math.ceil((mediaCount * 30) / 60);
    return totalMinutes < 1 ? "<1 min read" : `${totalMinutes} min read`;
  }, [currentStepObj, videoEntries]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.key === "ArrowLeft" || e.key === "j") && currentStep > 1) {
        handleSelectStep(currentStep - 1);
      } else if ((e.key === "ArrowRight" || e.key === "k") && currentStep < steps.length) {
        handleSelectStep(currentStep + 1);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [currentStep, steps.length, mod]);

  const isStepPassed = (stepNum: number) => {
    const step = steps[stepNum - 1];
    return step ? completedSteps.has(step.order) : false;
  };

  const handleSelectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    updateCurrentStep(stepNum);
    setShowTrivia(false);
    setActiveTab("read");
    setActiveVideoIdx(0);
    if (mod) {
      const p = readProgress(mod.slug, mod.order);
      writeProgress(mod.slug, { ...p, currentStep: stepNum });
      router.replace(`/learn/modules/${mod.slug}?step=${stepNum}`, { scroll: false });
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
    if (currentStep >= steps.length) {
      const p = readProgress(mod.slug, mod.order);
      writeProgress(mod.slug, {
        ...p,
        stepsCompleted: { ...p.stepsCompleted, [currentStepObj.order]: true },
      });
      setCompletedSteps((prev) => new Set(prev).add(currentStepObj.order));
      learnHubApi.completeChapter(currentStepObj.id).catch(() => {});
      handleFinishModule();
      return;
    }
    const p = readProgress(mod.slug, mod.order);
    writeProgress(mod.slug, {
      ...p,
      stepsCompleted: { ...p.stepsCompleted, [currentStepObj.order]: true },
      currentStep: currentStep + 1,
    });
    setCompletedSteps((prev) => new Set(prev).add(currentStepObj.order));
    setSealLabel("Step recorded in your dossier");
    setPendingAfterSeal("next");
    setShowSeal(true);
    learnHubApi.completeChapter(currentStepObj.id).catch(() => {});
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
    setSealLabel("Module certified — seal applied");
    setShowSeal(true);
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
    <>
      <ChamberSealOverlay
        show={showSeal}
        label={sealLabel}
        onDone={() => {
          setShowSeal(false);
          if (pendingAfterSeal === "next") {
            const next = currentStep + 1;
            setCurrentStep(next);
            updateCurrentStep(next);
            setShowTrivia(false);
            setActiveTab("read");
            setActiveVideoIdx(0);
            if (mod) {
              const p = readProgress(mod.slug, mod.order);
              writeProgress(mod.slug, { ...p, currentStep: next });
              router.replace(`/learn/modules/${mod.slug}?step=${next}`, { scroll: false });
            }
          }
          setPendingAfterSeal(null);
        }}
      />
    <LearnStageShell className={cn(
      activeTab === "watch" && !isMastery
        ? "bg-[var(--learn-chamber-ink)] text-[var(--learn-chamber-paper)]"
        : "bg-[var(--learn-chamber-paper)] dark:bg-background",
    )}>
      <LearnProgressRail
        fyLabel={mod.fiscal_year_label ?? "FY Chamber"}
        moduleTitle={mod.title}
        currentStep={isMastery ? steps.length : currentStep}
        totalSteps={steps.length}
      />

      <div className="flex items-center gap-2 border-b px-3 py-2 md:hidden">
        <button type="button" onClick={() => router.push("/learn")} className="-ml-1 rounded-lg p-1 hover:bg-muted/50">
          <ChevronLeft className="size-4" />
        </button>
        <span className="truncate text-xs font-semibold">{mod.title}</span>
      </div>

      {/* === Main === */}
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          {/* Step dots — mobile */}
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 py-2 scrollbar-hide md:hidden border-b border-border/20">
            {steps.map((step: ChapterStep, idx: number) => {
              const stepNum = idx + 1;
              const isCurrent = currentStep === stepNum;
              const passed = isStepPassed(stepNum);
              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(stepNum)}
                  className={cn(
                    "shrink-0 size-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200",
                    isCurrent && "scale-110 bg-primary text-primary-foreground shadow-xs",
                    !isCurrent && passed && "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600",
                    !isCurrent && !passed && "border border-border/40 bg-muted/40 text-muted-foreground",
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
            <div className="flex shrink-0 items-center gap-1 px-3 py-2 border-b border-border/20">
              {tabs.map((tab) => (
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
              <span className="ml-auto text-[10px] text-muted-foreground font-semibold">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 md:border-t md:border-border/20">
            <div className="mx-auto max-w-[var(--learn-stage-width)] p-4 md:p-6 lg:p-8">
              {isMastery ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="text-5xl">{mod.badge || "🎉"}</div>
                  {mod.badgeName && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">{mod.badgeName} Unlocked!</span>
                  )}
                  <h2 className="text-xl font-black tracking-tight">{mod.title}</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">You completed all steps in this module.</p>

                  <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-xl p-4 space-y-2 max-w-xs shadow-xs">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><Award className="size-3.5" /> Rewards Earned</p>
                    <p className="text-lg font-black text-[var(--learn-vote-green)]">{formatSovereignGain(25)}</p>
                    {certificateId && (
                      <p className="text-[9px] text-muted-foreground">Credential: BNS-{mod.badgeName}-{certificateId.slice(0, 8).toUpperCase()}</p>
                    )}
                  </div>

                  {certificateUrl && (
                    <a href={certificateUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/40 shadow-xs hover:bg-accent/30 hover:border-primary/30 transition-all group">
                      <Download className="size-4 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <p className="text-xs font-bold group-hover:text-primary transition-colors">Download Certificate</p>
                        <p className="text-[9px] text-muted-foreground">Printable certificate — BNS Certified</p>
                      </div>
                      <ExternalLink className="size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </a>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm"><Link href="/learn">Back to Hub</Link></Button>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-${currentStep}-${activeTab}`}
                    initial={reduced ? false : "initial"}
                    animate="animate"
                    exit="exit"
                    variants={learnPageTurn}
                    transition={learnTransition(reduced, 0.28)}
                    className="space-y-5"
                  >
                  {/* Step header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h1 className="text-base font-black md:text-lg">{currentStepObj?.title || `Step ${currentStep}`}</h1>
                      {readingTime && <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">{readingTime}</span>}
                    </div>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground">{mod.description}</p>
                    )}
                  </div>

                  {/* === WATCH TAB === */}
                  {activeTab === "watch" && (
                    <div className="space-y-3">
                      {videoEntries.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {videoEntries[activeVideoIdx]?.title || `Video ${activeVideoIdx + 1}`}
                              {videoEntries.length > 1 && <span> · {activeVideoIdx + 1} of {videoEntries.length}</span>}
                            </span>
                            {videoEntries.length > 1 && (
                              <div className="flex items-center gap-1">
                                <button onClick={() => setActiveVideoIdx((p) => Math.max(0, p - 1))} disabled={activeVideoIdx === 0}
                                  className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                  <ChevronLeft className="size-3.5" />
                                </button>
                                <button onClick={() => setActiveVideoIdx((p) => Math.min(videoEntries.length - 1, p + 1))} disabled={activeVideoIdx === videoEntries.length - 1}
                                  className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none">
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
                        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                          <PlayCircle className="size-8 text-muted-foreground/40" />
                          <p className="mt-2 text-xs font-semibold text-muted-foreground/60">Video coming soon</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* === READ TAB === */}
                  {activeTab === "read" && currentStepObj && (
                    <div className="space-y-4">
                      {currentStepObj.learning_outcomes && currentStepObj.learning_outcomes.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-muted-foreground">Learning Outcomes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {currentStepObj.learning_outcomes.map((outcome: { id: string; description: string }) => (
                                <li key={outcome.id} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
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
                              className="rounded-xl shadow-xs object-cover w-full aspect-[4/3] bg-muted/40" loading="lazy" />
                          ))}
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed">
                        {renderContent(currentStepObj.text)}
                      </div>

                      {currentStepObj.takeaways && currentStepObj.takeaways.length > 0 && (
                        <Card className="border-primary/20 bg-primary/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold">Key Takeaways</CardTitle>
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

                  {/* === QUIZ TAB === */}
                  {activeTab === "quiz" && (
                    <div className="space-y-4">
                      {!showTrivia ? (
                        <Card>
                          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                            <Brain className="size-10 text-primary/40" />
                            <div>
                              <h3 className="text-sm font-bold">Knowledge Check</h3>
                              <p className="text-xs text-muted-foreground">Test what you learned in this step.</p>
                            </div>
                            <Button onClick={() => setShowTrivia(true)} size="sm" className="rounded-lg text-xs font-bold">
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

                  {/* === Step navigation === */}
                  {!isMastery && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between gap-2 pb-4">
                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleSelectStep(Math.max(1, currentStep - 1))}
                          disabled={currentStep <= 1}
                          className="gap-1 rounded-lg text-xs font-bold"
                        >
                          <ChevronLeft className="size-3.5" /> Previous
                        </Button>

                        <span className="text-[10px] text-muted-foreground font-semibold hidden sm:block">
                          Step {currentStep} of {steps.length}
                        </span>

                        {currentStep < steps.length ? (
                          currentStepObj && isStepPassed(currentStepObj.order) ? (
                            <Button variant="outline" size="sm" onClick={() => handleSelectStep(currentStep + 1)} className="gap-1 rounded-lg text-xs font-bold">
                              Next <ChevronRight className="size-3.5" />
                            </Button>
                          ) : activeTab === "quiz" ? (
                            <Button size="sm" onClick={handleFinishTrivia} className="gap-1 rounded-lg text-xs font-bold">
                              <CheckCircle2 className="size-3.5" /> Complete & Continue
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => { if (hasQuiz) setActiveTab("quiz"); else handleFinishTrivia(); }} className="gap-1 rounded-lg text-xs font-bold">
                              {hasQuiz ? "Take Quiz" : "Complete"} <ArrowRight className="size-3.5" />
                            </Button>
                          )
                        ) : currentStep === steps.length && !isStepPassed(steps[steps.length - 1]?.order) ? (
                          <Button size="sm" onClick={handleFinishModule} className="gap-1 rounded-lg text-xs font-bold">
                            <CheckCircle2 className="size-3.5" /> Finish Module
                          </Button>
                        ) : null}
                      </div>
                    </>
                  )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </LearnStageShell>
    </>
  );
}
