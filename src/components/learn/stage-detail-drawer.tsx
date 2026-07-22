"use client";

import React, { useState, useEffect } from "react";
import { usePageView } from "@/hooks/use-page-view";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle2, BookOpen, BookOpenText, Video, Brain, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learnHubApi } from "@/lib/learn-hub";
import {
  recordLearnProgressWithQueue,
  trackGamificationWithQueue,
} from "@/lib/sync-profile";
import { useLearn } from "@/contexts/learn-context";
import { useSidebar } from "@/components/ui/sidebar";
import { readProgress, writeProgress } from "@/lib/module-progress";
import { triviaForStep } from "@/lib/learn-trivia";
import { certificateDownloadHref } from "@/lib/certificate-url";
import type { CivicModule, ChapterStep, ChapterVideo } from "@/types/learn";
import {
  allocationsToChartPoints,
  kpiRawToKpi,
  allocationToComparisonRows,
  highlightRawToCallout,
} from "@/lib/budget-api";
import {
  BudgetModuleReportOverview,
} from "@/components/budget-news/report-blocks";
import type {
  ChapterReportData,
} from "@/types/budget-report";
import { resolveYoutubeId, videoEmbedUrl } from "@/lib/learn-video";
import { useBudgetData } from "@/hooks/use-budget-data";
import { BudgetInlineSnapshot, BudgetInlineDeepDive } from "./budget-inline";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { RatingSection } from "./rating-section";
import { YouTubePlayer } from "./youtube-player";

import { StepContent } from "./step-content";
import { TriviaSection } from "./trivia-section";
import { MasteryPage } from "./mastery-page";
import { getModuleEmoji } from "@/lib/learn-module-display";


interface StageDetailDrawerProps {
  stage: CivicModule;
  profile: Record<string, unknown>;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: Record<string, unknown>) => void;
  onPrevStage?: () => void;
  onNextStage?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StageDetailDrawer({
  stage, profile, onClose, onUpdateProfile, onPrevStage, onNextStage, hasPrev, hasNext
}: StageDetailDrawerProps) {
  usePageView();
  const { totalStages } = useLearn();
  const { setOpen: setSidebarOpen } = useSidebar();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"read" | "watch" | "quiz">("read");
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  const isBudgetModule = stage.is_financial_year_analysis === true;

  const { budgetAllocations, budgetKpis, budgetHighlights, budgetLoading, budgetReportProfile } = useBudgetData(
    isBudgetModule ? stage.fiscal_year_id : null,
    stage.fiscal_year_label,
  );

  function getChapterReport(step: ChapterStep | null): ChapterReportData | null {
    if (!step?.budget_entity_id || !budgetAllocations) return null;
    const entityAllocs = budgetAllocations.filter((a) => a.entity === step.budget_entity_id);
    const entityKpis = budgetKpis?.filter((k) => k.entity === step.budget_entity_id).map(kpiRawToKpi);
    const entityHighlights = budgetHighlights?.filter((h) => h.entity === step.budget_entity_id).map(highlightRawToCallout);
    const approvedPoints = allocationsToChartPoints(entityAllocs, "approved");
    const comparisonRows = allocationToComparisonRows(entityAllocs);
    return {
      kpis: entityKpis,
      chart: approvedPoints.length
        ? { type: "bar", title: step.budget_entity_name || "Sector Allocation", data: approvedPoints, valueLabel: "KES Bn" }
        : undefined,
      comparison_rows: comparisonRows,
      callouts: entityHighlights,
    };
  }

  useEffect(() => {
    const moduleProgress = readProgress(stage.slug, stage.order);
    const initialStep = moduleProgress.currentStep || 1;
    setCurrentStep(initialStep);
    setExpandedStep(initialStep);
  }, [stage.slug, stage.order]);

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  const isStepTriviaPassed = (stepId: number) => {
    return readProgress(stage.slug, stage.order).stepsCompleted[stepId] === true;
  };

  const handleCorrectAnswer = (qIdx: number) => {
    const step = stage.steps[currentStep - 1];
    const rewardTag = `${step.order}_${qIdx}`;
    const p = readProgress(stage.slug, stage.order);
    if (!p.triviaRewards.includes(rewardTag)) {
      writeProgress(stage.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
      const pointsToAward = 5;
      void trackGamificationWithQueue({
        event_type: "trivia_correct",
        points: pointsToAward,
        object_id: `${stage.slug}/ch${step.order}/q${qIdx}`,
        idempotency_key: `trivia:${stage.slug}:${step.order}:${qIdx}:${rewardTag}`,
        metadata: {
          module_slug: stage.slug,
          chapter_order: step.order,
          question_index: qIdx,
        },
      });
      onUpdateProfile({
        ...profile,
        sovereigns: Number(profile.sovereigns ?? 0) + pointsToAward,
      });
      toast.success("Correct! +5 SVG!");
    } else {
      toast.success("Correct!");
    }
  };

  const handleFinishTrivia = () => {
    const step = stage.steps[currentStep - 1];
    const p = readProgress(stage.slug, stage.order);
    writeProgress(stage.slug, {
      ...p,
      stepsCompleted: { ...p.stepsCompleted, [step.order]: true },
      currentStep: currentStep + 1
    });
    toast.success("Knowledge Check complete!");
    void recordLearnProgressWithQueue({
      content_type: "lesson",
      content_id: step.id,
      progress_percent: 100,
    });
    learnHubApi.completeChapter(step.id).catch(() => {
      // server recording failed silently
    });
    setCurrentStep((prev) => prev + 1);
    setExpandedStep((prev) => (prev ? prev + 1 : null));
    setShowTrivia(false);
  };

  useEffect(() => {
    if (activeTab === "quiz" && triviaForStep(stage, stage.steps[currentStep - 1], currentStep - 1).length === 0) {
      setActiveTab("read");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, activeTab]);

  useEffect(() => {
    if (currentStep === stage.steps.length + 1) {
      const p = readProgress(stage.slug, stage.order);
      if (!p.masteryAwarded) {
        writeProgress(stage.slug, { ...p, masteryAwarded: true });
        const stageProgress = Array.isArray(profile.stageProgress) ? profile.stageProgress : [];
        const newProgress = stageProgress.length > 0 ? [...stageProgress] : [1];
        const nextStageId = stage.order + 1;
        if (nextStageId <= totalStages && !newProgress.includes(nextStageId)) {
          newProgress.push(nextStageId);
        }
        const badges = Array.isArray(profile.badges) ? profile.badges : [];
        const newBadges = badges.length > 0 ? [...badges] : [];
        if (!newBadges.includes(stage.badge)) {
          newBadges.push(stage.badge);
        }
        const updatedProfile = {
          ...profile,
          sovereigns: Number(profile.sovereigns ?? 0) + 25,
          stageProgress: newProgress,
          badges: newBadges,
        };
        onUpdateProfile(updatedProfile);
        void recordLearnProgressWithQueue({
          content_type: "path",
          content_id: stage.id,
          progress_percent: 100,
        });
        const lastStep = stage.steps[stage.steps.length - 1];
        if (lastStep) {
          learnHubApi.completeChapter(lastStep.id).then((res) => {
            if (res.certificate_id) {
              setCertificateId(res.certificate_id);
              setCertificateUrl(certificateDownloadHref(res.certificate_id));
            }
          }).catch(() => {
            // server chapter completion failed silently
          });
        }
        toast.success(`Mastered! +25 SVG. ${getModuleEmoji(stage.badge)} Badge unlocked!`);
      }
    }
  }, [currentStep, stage.steps.length]);

  const selectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    setExpandedStep(stepNum);
    setShowTrivia(false);
    const nextStep = stage.steps[stepNum - 1];
    if (activeTab === "quiz" && triviaForStep(stage, nextStep, stepNum - 1).length === 0) {
      setActiveTab("read");
    }
  };

  const isMastery = currentStep > stage.steps.length;
  const currentStepObj = currentStep > 0 && !isMastery ? stage.steps[currentStep - 1] : null;
  const currentStepTrivia = triviaForStep(stage, currentStepObj, currentStep - 1);
  const hasQuiz = currentStepTrivia.length > 0;

  function parseStepVideos(step: ChapterStep | null, allSteps?: ChapterStep[]): ChapterVideo[] {
    if (!step) return [];
    if (step.videos && step.videos.length > 0) return step.videos;
    if (step.youtube_urls && step.youtube_urls.length > 0) {
      return step.youtube_urls.map((url) => ({
        order: 1,
        role: "lecture",
        title: "Video",
        youtube_video_id: resolveYoutubeId(url),
      }));
    }
    if (step.youtube_url) return [{
      order: 1,
      role: "lecture",
      title: "Video",
      youtube_video_id: resolveYoutubeId(step.youtube_url),
    }];
    // Cascade: search sibling steps for module-level videos
    if (allSteps) {
      for (const other of allSteps) {
        if (other.order === step.order) continue;
        const fallback = parseStepVideos(other);
        if (fallback.length > 0) return fallback;
      }
    }
    return [];
  }

  const stepVideos = parseStepVideos(currentStepObj, currentStepObj ? stage.steps : undefined);

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const showNav = stepVideos.length > 1;
  const currentVideoUrl = stepVideos.length > 0 ? videoEmbedUrl(stepVideos[activeVideoIdx]?.youtube_video_id || stepVideos[activeVideoIdx]?.url || "") : null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 md:px-5 py-2.5 border-b border-border/30 flex items-center justify-between shrink-0 gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1">
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold truncate">
              <button onClick={onClose} className="hover:text-foreground transition-colors">Home</button>
              <span className="text-muted-foreground/40">/</span>
              <button onClick={onClose} className="hover:text-foreground transition-colors">Civic Modules</button>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground truncate">{stage.title}</span>
            </nav>
            <h2 className="text-sm font-black tracking-tight truncate">{currentStepObj?.title || stage.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded flex items-center gap-1">
            <BookOpen className="size-3" /> {stage.steps.length} lessons
          </span>
          {stage.documentName && (
            <span className="hidden sm:flex px-2 py-0.5 bg-muted/40 text-muted-foreground text-[10px] font-bold rounded items-center gap-1">
              <BookOpenText className="size-3" /> {stage.documentName}
            </span>
          )}
          <RatingSection contentId={stage.id} contentType="civic_module" readonly />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 min-w-0 overflow-y-auto p-3 md:p-4 lg:p-5">
          {isMastery ? (
            <MasteryPage badge={getModuleEmoji(stage.badge)} badgeName={stage.badgeName} title={stage.documentName || "Stage Mastered"} hasNext={hasNext} onNextStage={onNextStage} onClose={onClose} certificateUrl={certificateUrl} certificateId={certificateId} />
          ) : (
            <div className="mx-auto w-full max-w-5xl space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {[
                  { id: "read", label: "Read", icon: BookOpenText },
                  { id: "watch", label: "Watch", icon: Video },
                  ...(hasQuiz ? [{ id: "quiz", label: "Quiz", icon: Brain }] : []),
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}>
                    <tab.icon className="size-3.5" />
                    {tab.label}
                  </button>
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground font-semibold shrink-0">
                  Step {currentStep} of {stage.steps.length}
                </span>
              </div>

              {/* Mobile step dots — tap to jump between chapters */}
              <div className="md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {stage.steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = currentStep === stepNum;
                  const isPassed = isStepTriviaPassed(step.order);
                  return (
                    <button
                      key={step.id}
                      onClick={() => selectStep(stepNum)}
                      className={`shrink-0 size-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-xs scale-110"
                          : isPassed
                            ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                            : "bg-muted/40 text-muted-foreground border border-border/40"
                      }`}
                      title={step.title}
                    >
                      {isPassed ? <CheckCircle2 className="size-3.5" /> : stepNum}
                    </button>
                  );
                })}
              </div>

              <div className="animate-in fade-in duration-200">
                {activeTab === "watch" && (
                  currentVideoUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] font-semibold text-muted-foreground">
                          {stepVideos[activeVideoIdx]?.title || stepVideos[activeVideoIdx]?.role || `Video ${activeVideoIdx + 1}`}
                          {showNav && <span> · {activeVideoIdx + 1} of {stepVideos.length}</span>}
                        </div>
                        {showNav && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setActiveVideoIdx((p) => Math.max(0, p - 1))}
                              disabled={activeVideoIdx === 0}
                              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronLeft className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveVideoIdx((p) => Math.min(stepVideos.length - 1, p + 1))}
                              disabled={activeVideoIdx === stepVideos.length - 1}
                              className="size-6 flex items-center justify-center rounded-md bg-muted/40 hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ChevronRight className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <YouTubePlayer
                        videoId={stepVideos[activeVideoIdx]?.youtube_video_id || stepVideos[activeVideoIdx]?.url || ""}
                        title={`${currentStepObj?.title || stage.title} Lesson`}
                      />
                      {showNav && (
                        <div className="flex items-center justify-center gap-1.5 py-1">
                          {Array.from({ length: stepVideos.length }, (_, i) => (
                            <span
                              key={i}
                              className={`block rounded-full transition-all duration-200 ${
                                i === activeVideoIdx ? "bg-primary w-5 h-1.5" : "bg-muted-foreground/25 w-1.5 h-1.5"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex flex-col items-center justify-center shadow-xs">
                      <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center">
                        <PlayCircle className="size-5 text-muted-foreground/40" />
                      </div>
                      <p className="text-xs text-muted-foreground/60 font-semibold mt-2">Video coming soon</p>
                    </div>
                  )
                )}

                {activeTab === "read" && currentStep > 0 && (
                  <div className="space-y-3">
                    <div className="space-y-1 pb-3 border-b border-border/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black">{currentStepObj?.title || stage.title}</h3>
                        {isBudgetModule && currentStepObj?.budget_entity_name && (
                          <Badge variant="outline" className="text-[10px] font-normal border-primary/30 text-primary">
                            Sector: {currentStepObj.budget_entity_name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>

                    {isBudgetModule && budgetLoading && (
                      <div className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4 space-y-3 animate-pulse">
                              <div className="h-3 w-20 bg-muted-foreground/10 rounded" />
                              <div className="h-6 w-24 bg-muted-foreground/10 rounded" />
                              <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
                            </div>
                          ))}
                        </div>
                        <div className="h-[220px] sm:h-[280px] rounded-xl border border-border/60 bg-card/80 animate-pulse flex items-center justify-center">
                          <Loader2 className="size-5 animate-spin text-muted-foreground/40" />
                        </div>
                      </div>
                    )}

                    {isBudgetModule && !budgetLoading && budgetReportProfile && currentStep === 1 && (
                      <BudgetModuleReportOverview report={budgetReportProfile} />
                    )}

                    {isBudgetModule && !budgetLoading && getChapterReport(currentStepObj) && currentStep > 1 && (
                      <BudgetInlineSnapshot report={getChapterReport(currentStepObj)!} />
                    )}

                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed">
                      <StepContent
                        step={stage.steps[currentStep - 1]}
                        currentStep={currentStep}
                        totalSteps={stage.steps.length}
                        activeFormat="text"
                        showTrivia={showTrivia}
                        origin=""
                        hasTrivia={hasQuiz}
                        getPersonalizedText={(txt) => txt}
                        onFormatChange={() => {}}
                        onStartTrivia={() => { setActiveTab("quiz"); setShowTrivia(true); }}
                      />
                    </div>

                    {isBudgetModule && !budgetLoading && getChapterReport(currentStepObj) && currentStep > 1 && (
                      <BudgetInlineDeepDive report={getChapterReport(currentStepObj)!} />
                    )}
                  </div>
                )}

                {activeTab === "quiz" && currentStep > 0 && !showTrivia && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1 border-b border-border/30 pb-3">
                      <h3 className="text-base font-black">Knowledge Check</h3>
                      <p className="text-xs text-muted-foreground">
                        One question at a time in full screen.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowTrivia(true)}
                      size="sm"
                      className="rounded-lg text-xs font-bold"
                    >
                      Start Knowledge Check
                    </Button>
                  </div>
                )}

                {/* Prev / Next — fixed slots */}
                {!isMastery && !showTrivia && (
                  <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-border/20 pt-4 pb-4">
                    <div className="justify-self-start">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectStep(currentStep - 1)}
                        disabled={currentStep <= 1}
                        className="min-w-[7.5rem] gap-1 rounded-lg text-xs font-bold"
                      >
                        <ChevronLeft className="size-3.5" />
                        Previous
                      </Button>
                    </div>
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                      Step {currentStep} of {stage.steps.length}
                    </span>
                    <div className="justify-self-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const step = stage.steps[currentStep - 1];
                          const hasStepQuiz = triviaForStep(stage, step, currentStep - 1).length > 0;
                          const passed = step ? isStepTriviaPassed(step.order) : false;
                          const isLast = currentStep >= stage.steps.length;

                          if (!passed && hasStepQuiz) {
                            setActiveTab("quiz");
                            setShowTrivia(true);
                            return;
                          }

                          if (!passed && !hasStepQuiz) {
                            // No quiz: mark step complete then advance (or finish)
                            handleFinishTrivia();
                            return;
                          }

                          // Already passed — advance to next step or mastery
                          if (isLast) {
                            setCurrentStep(stage.steps.length + 1);
                            setShowTrivia(false);
                          } else {
                            selectStep(currentStep + 1);
                          }
                        }}
                        className="min-w-[7.5rem] gap-1 rounded-lg text-xs font-bold"
                      >
                        {currentStep >= stage.steps.length ? (
                          <>
                            Finish
                            <CheckCircle2 className="size-3.5" />
                          </>
                        ) : (
                          <>
                            Next
                            <ChevronRight className="size-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showTrivia && currentStep > 0 ? (
          <TriviaSection
            trivia={currentStepTrivia}
            stepId={stage.steps[currentStep - 1].order}
            showTrivia={showTrivia}
            isStepTriviaPassed={isStepTriviaPassed}
            onCorrectAnswer={handleCorrectAnswer}
            onFinish={handleFinishTrivia}
            onClose={() => {
              setShowTrivia(false);
              setActiveTab("read");
            }}
            title={stage.steps[currentStep - 1]?.title || "Knowledge Check"}
          />
        ) : null}

        <CurriculumSidebar
          steps={stage.steps}
          stage={stage}
          currentStep={currentStep}
          expandedStep={expandedStep}
          setExpandedStep={setExpandedStep}
          selectStep={selectStep}
          triviaForStepFn={triviaForStep}
          setActiveTab={setActiveTab}
          setShowTrivia={setShowTrivia}
          isStepTriviaPassed={isStepTriviaPassed}
        />
      </div>
    </div>
  );
}
