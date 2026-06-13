"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle2, ChevronDown, Clock, BookOpen, Star, BookOpenText, Video, Brain } from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { learnHubApi } from "@/lib/learn-hub";
import { useLearn } from "@/contexts/learn-context";
import { readProgress, writeProgress } from "@/lib/module-progress";
import type { CivicModule, ChapterStep, ChapterVideo } from "@/types/learn";

import { StepContent } from "./step-content";
import { TriviaSection } from "./trivia-section";
import { MasteryPage } from "./mastery-page";

interface StageDetailDrawerProps {
  stage: CivicModule;
  profile: any;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: any) => void;
  onPrevStage?: () => void;
  onNextStage?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StageDetailDrawer({
  stage, profile, onClose, onUpdateProfile, onPrevStage, onNextStage, hasPrev, hasNext
}: StageDetailDrawerProps) {
  const { totalStages } = useLearn();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"read" | "watch" | "quiz">("read");
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  useEffect(() => {
    const moduleProgress = readProgress(stage.slug, stage.order);
    const initialStep = moduleProgress.currentStep || 1;
    setCurrentStep(initialStep);
    setExpandedStep(initialStep);
  }, [stage.slug, stage.order]);

  const isStepTriviaPassed = (stepId: number) => {
    return readProgress(stage.slug, stage.order).stepsCompleted[stepId] === true;
  };

  const handleCorrectAnswer = (qIdx: number) => {
    const step = stage.steps[currentStep - 1];
    const rewardTag = `${step.order}_${qIdx}`;
    const p = readProgress(stage.slug, stage.order);
    if (!p.triviaRewards.includes(rewardTag)) {
      writeProgress(stage.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
      const updated = { ...profile, sovereigns: profile.sovereigns + 5 };
      onUpdateProfile(updated);
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
    learnHubApi.completeChapter(step.id).catch(() => {});
    setCurrentStep((prev) => prev + 1);
    setExpandedStep((prev) => (prev ? prev + 1 : null));
    setShowTrivia(false);
  };

  useEffect(() => {
    if (activeTab === "quiz" && !((stage.steps[currentStep - 1]?.trivia?.length ?? 0) > 0)) {
      setActiveTab("read");
    }
  }, [currentStep, activeTab]);

  useEffect(() => {
    if (currentStep === stage.steps.length + 1) {
      const p = readProgress(stage.slug, stage.order);
      if (!p.masteryAwarded) {
        writeProgress(stage.slug, { ...p, masteryAwarded: true });
        const newProgress = profile.stageProgress ? [...profile.stageProgress] : [1];
        const nextStageId = stage.order + 1;
        if (nextStageId <= totalStages && !newProgress.includes(nextStageId)) {
          newProgress.push(nextStageId);
        }
        const newBadges = profile.badges ? [...profile.badges] : [];
        if (!newBadges.includes(stage.badge)) {
          newBadges.push(stage.badge);
        }
        const updatedProfile = {
          ...profile,
          sovereigns: profile.sovereigns + 25,
          stageProgress: newProgress,
          badges: newBadges,
        };
        onUpdateProfile(updatedProfile);
        learnHubApi.markProgress({ content_type: "path", content_id: stage.id, progress_percent: 100 }).catch(() => {});
        const lastStep = stage.steps[stage.steps.length - 1];
        if (lastStep) {
          learnHubApi.completeChapter(lastStep.id).then((res) => {
            if (res.certificate_id) {
              setCertificateId(res.certificate_id);
              const profileCertUrl = `/api/v1/content/learn/certificates/${res.certificate_id}/download/`;
              setCertificateUrl(profileCertUrl);
            }
          }).catch(() => {});
        }
        toast.success(`Mastered! +25 SVG. ${stage.badge} Badge unlocked!`);
      }
    }
  }, [currentStep, stage.order]);

  const selectStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    setExpandedStep(stepNum);
    setShowTrivia(false);
    const nextStep = stage.steps[stepNum - 1];
    if (activeTab === "quiz" && !((nextStep?.trivia?.length ?? 0) > 0)) {
      setActiveTab("read");
    }
  };

  const isMastery = currentStep > stage.steps.length;
  const currentStepObj = currentStep > 0 && !isMastery ? stage.steps[currentStep - 1] : null;
  const hasQuiz = (currentStepObj?.trivia?.length ?? 0) > 0;

  function resolveYoutubeId(input: string): string | undefined {
    if (!input) return undefined;
    if (input.includes("embed/")) {
      const m = input.match(/embed\/([^/?]+)/);
      return m ? m[1] : input;
    }
    const m = input.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    return m ? m[1] : input;
  }

  function parseStepVideos(step: ChapterStep | null): ChapterVideo[] {
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
    if (!step.youtube_url) return [];
    return [{
      order: 1,
      role: "lecture",
      title: "Video",
      youtube_video_id: resolveYoutubeId(step.youtube_url),
    }];
  }

  const stepVideos = parseStepVideos(currentStepObj);

  function videoEmbedUrl(idOrUrl: string): string {
    const id = resolveYoutubeId(idOrUrl);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : idOrUrl;
  }

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const showNav = stepVideos.length > 1;
  const currentVideoUrl = stepVideos.length > 0 ? videoEmbedUrl(stepVideos[activeVideoIdx]?.youtube_video_id || stepVideos[activeVideoIdx]?.url || "") : null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="px-4 md:px-5 py-2.5 border-b border-border/30 flex items-center justify-between shrink-0 gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Back to modules"
            className="-ml-1 size-8"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium truncate">{stage.badgeName} / {stage.title}</p>
            <h2 className="text-sm font-semibold tracking-tight truncate">{stage.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="secondary" className="gap-1 text-xs">
            <BookOpen className="size-3" aria-hidden /> {stage.steps.length} lessons
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <Clock className="size-3" aria-hidden /> 4h 5min
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-500/20 bg-amber-500/10">
            <Star className="size-3" aria-hidden /> 4.9
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 min-w-0 overflow-y-auto p-3 md:p-4 lg:p-5">
          {isMastery ? (
            <MasteryPage badge={stage.badge} badgeName={stage.badgeName} title={stage.documentName || "Stage Mastered"} hasNext={hasNext} onNextStage={onNextStage} onClose={onClose} certificateUrl={certificateUrl} certificateId={certificateId} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Format tabs using shadcn Tabs */}
              <div className="flex items-center gap-2">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as typeof activeTab)}
                  className="flex-1"
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="read" className="text-xs gap-1.5 h-7">
                      <BookOpenText className="size-3.5" aria-hidden /> Read
                    </TabsTrigger>
                    <TabsTrigger value="watch" className="text-xs gap-1.5 h-7">
                      <Video className="size-3.5" aria-hidden /> Watch
                    </TabsTrigger>
                    {hasQuiz && (
                      <TabsTrigger value="quiz" className="text-xs gap-1.5 h-7">
                        <Brain className="size-3.5" aria-hidden /> Quiz
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
                <span className="text-xs text-muted-foreground font-medium shrink-0">
                  Step {currentStep} of {stage.steps.length}
                </span>
              </div>

              <div className="animate-in fade-in duration-200">
                {activeTab === "watch" && (
                  currentVideoUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {stepVideos[activeVideoIdx]?.title || stepVideos[activeVideoIdx]?.role || `Video ${activeVideoIdx + 1}`}
                          {showNav && <span> · {activeVideoIdx + 1} of {stepVideos.length}</span>}
                        </p>
                        {showNav && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6"
                              onClick={() => setActiveVideoIdx((p) => Math.max(0, p - 1))}
                              disabled={activeVideoIdx === 0}
                              aria-label="Previous video"
                            >
                              <ChevronLeft className="size-3.5" aria-hidden />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6"
                              onClick={() => setActiveVideoIdx((p) => Math.min(stepVideos.length - 1, p + 1))}
                              disabled={activeVideoIdx === stepVideos.length - 1}
                              aria-label="Next video"
                            >
                              <ChevronRight className="size-3.5" aria-hidden />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xs">
                        <iframe src={currentVideoUrl} title={`${currentStepObj?.title || stage.title} Lesson`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                      {showNav && (
                        <div className="flex items-center justify-center gap-1.5 py-1" aria-hidden>
                          {Array.from({ length: stepVideos.length }, (_, i) => (
                            <span key={i} className={`block rounded-full transition-all duration-200 ${i === activeVideoIdx ? "bg-primary w-5 h-1.5" : "bg-muted-foreground/25 w-1.5 h-1.5"}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex flex-col items-center justify-center shadow-xs">
                      <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center">
                        <PlayCircle className="size-5 text-muted-foreground/40" aria-hidden />
                      </div>
                      <p className="text-xs text-muted-foreground/60 font-medium mt-2">Video coming soon</p>
                    </div>
                  )
                )}

                {activeTab === "read" && currentStep > 0 && (
                  <div className="space-y-3">
                    <div className="space-y-1 pb-3 border-b border-border/30">
                      <h3 className="text-base font-semibold">{currentStepObj?.title || stage.title}</h3>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed">
                      <StepContent
                        step={stage.steps[currentStep - 1]}
                        currentStep={currentStep}
                        totalSteps={stage.steps.length}
                        activeFormat="text"
                        showTrivia={showTrivia}
                        origin=""
                        getPersonalizedText={(txt) => txt}
                        onFormatChange={() => {}}
                        onStartTrivia={() => setShowTrivia(true)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && currentStep > 0 && (
                  <div className="pt-2">
                    {!showTrivia ? (
                      <div className="space-y-3">
                        <div className="space-y-1 pb-3 border-b border-border/30">
                          <h3 className="text-base font-semibold">Knowledge Check</h3>
                          <p className="text-sm text-muted-foreground">Test what you learned in this step.</p>
                        </div>
                        <Button onClick={() => setShowTrivia(true)} size="sm" className="rounded-lg text-xs font-semibold">
                          Start Knowledge Check
                        </Button>
                      </div>
                    ) : (
                      <TriviaSection
                        trivia={stage.steps[currentStep - 1]?.trivia ?? []}
                        stepId={stage.steps[currentStep - 1].order}
                        showTrivia={showTrivia}
                        isStepTriviaPassed={isStepTriviaPassed}
                        onCorrectAnswer={handleCorrectAnswer}
                        onFinish={handleFinishTrivia}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Curriculum sidebar */}
        <div className="hidden md:flex md:w-[260px] bg-muted/10 border-l border-border/30 flex-col shrink-0">
          <div className="p-3 border-b border-border/30">
            <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Curriculum</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stage.steps.map((step, idx) => {
              const stepNum   = idx + 1;
              const isExpanded = expandedStep === stepNum;
              const isPassed   = isStepTriviaPassed(step.order);
              const isCurrent  = currentStep === stepNum;

              return (
                <div key={step.id} className="border-b border-border/20">
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between p-2.5 transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${isCurrent ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-left min-w-0">
                      <div className={`size-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isPassed  ? "bg-emerald-500 text-white" :
                        isCurrent ? "bg-primary text-white" :
                        "bg-muted/50 text-muted-foreground"
                      }`}>
                        {isPassed ? <CheckCircle2 className="size-3" aria-hidden /> : stepNum}
                      </div>
                      <span className={`text-xs font-medium truncate ${isCurrent ? "text-primary" : "text-foreground"}`}>
                        {step.title}
                      </span>
                    </div>
                    <ChevronDown className={`size-3 text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} aria-hidden />
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-2.5 pt-0.5 space-y-0.5">
                      <button
                        onClick={() => selectStep(stepNum)}
                        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <PlayCircle className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden />
                          <span className="text-xs text-foreground/70 group-hover:text-foreground truncate">Reading</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">10 min</span>
                      </button>
                      <button
                        onClick={() => { selectStep(stepNum); setActiveTab("quiz"); setShowTrivia(true); }}
                        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircle2 className="size-3 text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0" aria-hidden />
                          <span className="text-xs text-foreground/70 group-hover:text-foreground truncate">Quiz</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">5 min</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
