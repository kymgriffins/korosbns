"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, PlayCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { learnHubApi } from "@/lib/learn-hub";
import { useLearn } from "@/contexts/learn-context";
import { readProgress, writeProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";

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
  stage,
  profile,
  onClose,
  onUpdateProfile,
  onPrevStage,
  onNextStage,
  hasPrev,
  hasNext
}: StageDetailDrawerProps) {
  const { totalStages } = useLearn();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "task">("description");
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

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
      toast.success("Correct! +5 Sovereigns awarded!");
    } else {
      toast.success("Correct!");
    }
  };

  const handleFinishTrivia = () => {
    const step = stage.steps[currentStep - 1];
    const p = readProgress(stage.slug, stage.order);
    writeProgress(stage.slug, { ...p, stepsCompleted: { ...p.stepsCompleted, [step.order]: true }, currentStep: currentStep + 1 });
    toast.success("Knowledge Check complete! \u2B50");
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
        learnHubApi.markProgress({
          content_type: "path",
          content_id: stage.id,
          progress_percent: 100,
        }).catch(() => {});

        toast.success(`🎉 Stage Mastered! +25 Sovereigns (SVG) earned. ${stage.badge} Badge unlocked!`);
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

  // Local override for BPS module videos provided by user
  if (stage.slug === "budget-policy-statement" && !videoUrl && currentStepObj) {
    if (currentStep === 1) videoUrl = "https://www.youtube.com/embed/Ed9lP0-komE";
    else if (currentStep === 2) videoUrl = "https://www.youtube.com/embed/wkPe3sWomoA";
    else if (currentStep === 3) videoUrl = "https://www.youtube.com/embed/FkgRz4v2Llk";
  } else if (videoUrl && !videoUrl.includes("embed/")) {
    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|v=)([^&?]+)/);
    if (videoIdMatch) {
      videoUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      
      {/* Breadcrumb Header */}
      <div className="px-6 md:px-10 py-5 border-b border-border flex flex-col md:flex-row md:justify-between md:items-center shrink-0 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">My modules / {stage.badgeName} / {stage.title}</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors -ml-1.5">
              <ChevronLeft className="size-5" />
            </button>
            <h2 className="text-2xl font-black tracking-tight">{stage.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 bg-[#F97316] text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-sm">
            {stage.steps.length} lessons
          </span>
          <span className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-xs font-black rounded-full flex items-center gap-1.5 shadow-sm">
            4h 5min
          </span>
          <span className="px-3 py-1 bg-[#F97316] text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-sm">
            ★ 4.9 (142 reviews)
          </span>
        </div>
      </div>

      {/* Two-Column Content Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Left Column: Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {isMastery ? (
             <MasteryPage
               badge={stage.badge}
               badgeName={stage.badgeName}
               title={stage.documentName || "Stage Mastered"}
               hasNext={hasNext}
               onNextStage={onNextStage}
               onClose={onClose}
             />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Video Player */}
              {videoUrl ? (
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-sm">
                  <iframe 
                    src={videoUrl} 
                    title={`${currentStepObj?.title || stage.title} Lesson Video`} 
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-[#0f172a] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                  <div className="z-10 flex flex-col items-center space-y-4">
                    <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <PlayCircle className="size-8 text-white/40" />
                    </div>
                    <p className="text-white/60 font-bold text-sm tracking-wide">Video coming soon</p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-4">
                {[
                  { id: "description", label: "Description" },
                  { id: "materials", label: "Materials" },
                  { id: "task", label: "Home task" }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-colors shadow-sm ${
                      activeTab === tab.id 
                        ? "bg-[#2563EB] text-white border-transparent" 
                        : "bg-background border border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <button className="ml-auto text-xs font-bold text-orange-500 hover:underline">
                  Share lesson
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="animate-in fade-in duration-300">
                {activeTab === "description" && currentStep > 0 && (
                  <div className="space-y-6">
                    {/* Article Header */}
                    <div className="space-y-2 border-b border-border pb-6">
                      <h3 className="text-2xl font-black">{currentStepObj?.title || stage.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                        {stage.description}
                      </p>
                    </div>
                    {/* Article Content */}
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed">
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
                {activeTab === "task" && currentStep > 0 && (
                  <div className="pt-4">
                    {!showTrivia ? (
                      <Button onClick={() => setShowTrivia(true)} className="rounded-full bg-[#CEFF00] text-black font-bold border-none hover:bg-[#b5e600]">
                        Start Knowledge Check
                      </Button>
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
                {activeTab === "materials" && (
                  <div className="py-8 text-center text-muted-foreground text-sm font-semibold">
                    No extra materials attached to this lesson.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Right Column: Curriculum Accordion */}
        <div className="w-full md:w-[380px] bg-muted/30 border-l border-border flex flex-col shrink-0">
          <div className="p-6 border-b border-border bg-card/50">
            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Curriculum</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stage.steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isExpanded = expandedStep === stepNum;
              const isPassed = isStepTriviaPassed(step.order);
              const isCurrent = currentStep === stepNum;

              return (
                <div key={step.id} className="border-b border-border/50">
                  <button 
                    onClick={() => setExpandedStep(isExpanded ? null : stepNum)}
                    className={`w-full flex items-center justify-between p-5 transition-colors hover:bg-muted/50 ${isCurrent ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isPassed 
                          ? "bg-emerald-500 text-white" 
                          : isCurrent
                            ? "bg-[#2563EB] text-white"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {isPassed ? <CheckCircle2 className="size-4" /> : stepNum}
                      </div>
                      <span className={`text-sm font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {step.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <span>15 min</span>
                      <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-muted/10 space-y-1">
                      {/* Sub-items mock */}
                      <button 
                        onClick={() => selectStep(stepNum)}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <PlayCircle className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
                            Reading & Comprehension
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">10 min</span>
                      </button>
                      <button 
                        onClick={() => {
                          selectStep(stepNum);
                          setActiveTab("task");
                          setShowTrivia(true);
                        }}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="size-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                          <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
                            Knowledge Check
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">5 min</span>
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
