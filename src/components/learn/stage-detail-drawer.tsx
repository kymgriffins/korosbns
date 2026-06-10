"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, PlayCircle, CheckCircle2, ChevronDown, Clock, BookOpen, Star, BookOpenText, Video, Brain } from "lucide-react";
import { Button } from "@/ui/button";
import { learnHubApi } from "@/lib/learn-hub";
import { useLearn } from "@/contexts/learn-context";
import { readProgress, writeProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";

import { StepContent } from "./step-content";
import { TriviaSection } from "./trivia-section";
import { MasteryPage } from "./mastery-page";

const FALLBACK_VIDEO_URLS: Record<string, Record<number, string>> = {
  "budget-policy-statement": {
    1: "https://www.youtube.com/embed/Ed9lP0-komE",
    2: "https://www.youtube.com/embed/wkPe3sWomoA",
    3: "https://www.youtube.com/embed/FkgRz4v2Llk",
  },
};

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
  };

  const isMastery = currentStep > stage.steps.length;
  const currentStepObj = currentStep > 0 && !isMastery ? stage.steps[currentStep - 1] : null;
  let videoUrl = currentStepObj?.youtube_url || null;

  if (!videoUrl && FALLBACK_VIDEO_URLS[stage.slug]?.[currentStep]) {
    videoUrl = FALLBACK_VIDEO_URLS[stage.slug][currentStep];
  } else if (videoUrl && !videoUrl.includes("embed/")) {
    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    if (videoIdMatch) {
      videoUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 md:px-5 py-2.5 border-b border-border/30 flex items-center justify-between shrink-0 gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg transition-colors -ml-1">
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold truncate">{stage.badgeName} / {stage.title}</p>
            <h2 className="text-sm font-black tracking-tight truncate">{stage.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded flex items-center gap-1">
            <BookOpen className="size-3" /> {stage.steps.length} lessons
          </span>
          <span className="px-2 py-0.5 bg-muted/40 text-muted-foreground text-[10px] font-bold rounded flex items-center gap-1">
            <Clock className="size-3" /> 4h 5min
          </span>
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded flex items-center gap-1">
            <Star className="size-3" /> 4.9
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 min-w-0 overflow-y-auto p-3 md:p-4 lg:p-5">
          {isMastery ? (
            <MasteryPage badge={stage.badge} badgeName={stage.badgeName} title={stage.documentName || "Stage Mastered"} hasNext={hasNext} onNextStage={onNextStage} onClose={onClose} certificateUrl={certificateUrl} certificateId={certificateId} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {[
                  { id: "read", label: "Read", icon: BookOpenText },
                  { id: "watch", label: "Watch", icon: Video },
                  { id: "quiz", label: "Quiz", icon: Brain }
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

              <div className="animate-in fade-in duration-200">
                {activeTab === "watch" && (
                  videoUrl ? (
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xs">
                      <iframe src={videoUrl} title={`${currentStepObj?.title || stage.title} Lesson`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
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
                      <h3 className="text-base font-black">{currentStepObj?.title || stage.title}</h3>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed">
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
                          <h3 className="text-base font-black">Knowledge Check</h3>
                          <p className="text-xs text-muted-foreground">Test what you learned in this step.</p>
                        </div>
                        <Button onClick={() => setShowTrivia(true)} size="sm" className="rounded-lg text-xs font-bold">
                          Start Knowledge Check
                        </Button>
                      </div>
                    ) : (
                      <TriviaSection
                        trivia={stage.steps[currentStep - 1].trivia}
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

        <div className="hidden md:flex md:w-[260px] bg-muted/10 border-l border-border/30 flex-col shrink-0">
          <div className="p-3 border-b border-border/30">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Curriculum</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stage.steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isExpanded = expandedStep === stepNum;
              const isPassed = isStepTriviaPassed(step.order);
              const isCurrent = currentStep === stepNum;

              return (
                <div key={step.id} className="border-b border-border/20">
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                    className={`w-full flex items-center justify-between p-2.5 transition-colors hover:bg-muted/30 ${isCurrent ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-center gap-2 text-left min-w-0">
                      <div className={`size-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isPassed ? "bg-emerald-500 text-white" :
                        isCurrent ? "bg-primary text-white" :
                        "bg-muted/50 text-muted-foreground"
                      }`}>
                        {isPassed ? <CheckCircle2 className="size-3" /> : stepNum}
                      </div>
                      <span className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{step.title}</span>
                    </div>
                    <ChevronDown className={`size-3 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-2.5 pt-0.5 space-y-0.5">
                      <button onClick={() => selectStep(stepNum)}
                        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <PlayCircle className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Reading</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold shrink-0">10 min</span>
                      </button>
                      <button onClick={() => { selectStep(stepNum); setActiveTab("quiz"); setShowTrivia(true); }}
                        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors text-left group">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircle2 className="size-3 text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0" />
                          <span className="text-[10px] font-semibold text-foreground/70 group-hover:text-foreground truncate">Quiz</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold shrink-0">5 min</span>
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
