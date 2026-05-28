"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { DrawerHeader } from "./drawer-header";
import { CourseOverview } from "./course-overview";
import { MasteryPage } from "./mastery-page";
import { NavigationFooter } from "./navigation-footer";
import { TriviaSection } from "./trivia-section";
import { DocumentsTab } from "./documents-tab";
import { StepContent } from "./step-content";
import {
  getDocumentsForStage,
} from "@/constants/documents-registry";
import { learnHubApi } from "@/lib/learn-hub";
import { useLearn } from "@/contexts/learn-context";
import { readProgress, writeProgress } from "@/lib/module-progress";
import type { CivicModule, ChapterStep } from "@/types/learn";

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
  const { totalStages, updateCurrentStep } = useLearn();
  const [activeSubTab, setActiveSubTab] = useState<"learn" | "documents">("learn");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeFormat, setActiveFormat] = useState<"video" | "text">("video");
  const [contentConsumed, setContentConsumed] = useState<boolean>(true);
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [activeTriviaIdx, setActiveTriviaIdx] = useState<number>(0);
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState<boolean>(false);
  const [triviaSkipped, setTriviaSkipped] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [selectedReflectionOption, setSelectedReflectionOption] = useState<string>("");
  const [transcriptSearch, setTranscriptSearch] = useState<string>("");
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [constitutionTab, setConstitutionTab] = useState<"current" | "timeline">("current");
  const [liveRepoDocs, setLiveRepoDocs] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const loadRepo = async () => {
      setApiLoading(true);
      try {
        const res = await fetch("/api/docrepository");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.documents)) {
            setLiveRepoDocs(data.documents);
          }
        }
      } catch (err) {
        console.error("Failed to load live doc repository:", err);
      } finally {
        setApiLoading(false);
      }
    };
    loadRepo();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const yearParam = params.get("year");
      if (yearParam) {
        const yr = parseInt(yearParam, 10);
        if (!isNaN(yr)) {
          setSelectedYear(yr);
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveSubTab("learn");
    const moduleProgress = readProgress(stage.slug, stage.order);
    const initialStep = moduleProgress.currentStep;
    setCurrentStep(initialStep);
    setActiveFormat("video");
    setContentConsumed(true);
    setActiveTriviaIdx(0);
    setShowTrivia(false);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaSkipped(false);
    setReflectionText("");
    setTranscriptSearch("");
    setShowTranscript(false);
    if (stage.order === 1) {
      setSelectedYear(2010);
    } else {
      setSelectedYear(2026);
    }
  }, [stage.order]);

  useEffect(() => {
    if (currentStep < 1 || currentStep > stage.steps.length) {
      setContentConsumed(true);
      return;
    }
    const step = stage.steps[currentStep - 1];
    setContentConsumed(true);
    setShowTrivia(false);
    setActiveTriviaIdx(0);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaSkipped(false);
    setReflectionText("");
    setSelectedReflectionOption("");
    setShowTranscript(false);
    setTranscriptSearch("");
  }, [currentStep, stage.order]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const handleStartLearning = () => {
    setCurrentStep(1);
    const p = { ...readProgress(stage.slug, stage.order), currentStep: 1 };
    writeProgress(stage.slug, p);
  };

  const isStepTriviaPassed = (stepId: number) => {
    return readProgress(stage.slug, stage.order).stepsCompleted[stepId] === true;
  };

  const handleAnswerMCQ = (qIdx: number, selectedIdx: number, correctIdx: number) => {
    if (triviaSubmitted) return;
    setSelectedTriviaAnswer(selectedIdx);
    setTriviaSubmitted(true);
    if (selectedIdx === correctIdx) {
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
      autoAdvanceRef.current = setTimeout(() => handleNextTriviaQuestion(), 1500);
    } else {
      toast.error("Not quite—try again.");
    }
  };

  const handleSubmitReflection = (qIdx: number) => {
    const text = selectedReflectionOption || reflectionText.trim();
    if (!text) {
      toast.error("Please share a meaningful reflection.");
      return;
    }
    setTriviaSubmitted(true);
    const step = stage.steps[currentStep - 1];
    const rewardTag = `${step.order}_${qIdx}`;
    const p = readProgress(stage.slug, stage.order);
    if (!p.triviaRewards.includes(rewardTag)) {
      writeProgress(stage.slug, { ...p, triviaRewards: [...p.triviaRewards, rewardTag] });
      const updated = { ...profile, sovereigns: profile.sovereigns + 5 };
      onUpdateProfile(updated);
      toast.success("Reflection submitted! +5 Sovereigns awarded!");
    } else {
      toast.success("Reflection logged!");
    }
    autoAdvanceRef.current = setTimeout(() => handleNextTriviaQuestion(), 1500);
  };

  // Sync currentStep back to context so sidebar curriculum rail stays in sync
  useEffect(() => {
    updateCurrentStep(currentStep);
  }, [currentStep, updateCurrentStep]);

  const handleNextTriviaQuestion = useCallback(() => {
    const step = stage.steps[currentStep - 1];
    if (activeTriviaIdx < step.trivia.length - 1) {
      setActiveTriviaIdx((prev) => prev + 1);
      setSelectedTriviaAnswer(null);
      setTriviaSubmitted(false);
      setReflectionText("");
      setSelectedReflectionOption("");
    } else {
      const p = readProgress(stage.slug, stage.order);
      writeProgress(stage.slug, { ...p, stepsCompleted: { ...p.stepsCompleted, [step.order]: true }, currentStep: currentStep + 1 });
      setContentConsumed(true);
      toast.success("Step complete! ⭐");
      // Sync step progress to backend
      learnHubApi.markProgress({
        content_type: "article",
        content_id: `stage-${stage.order}-step-${step.order}`,
        progress_percent: Math.round((currentStep / stage.steps.length) * 100),
      }).catch(() => {});
      autoAdvanceRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2000);
    }
  }, [activeTriviaIdx, currentStep, stage.order, stage.steps]);

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
        let allStagesDoneBonus = 0;
        if (newProgress.length >= totalStages && newBadges.length >= totalStages && !profile.allStagesBonusEarned) {
          allStagesDoneBonus = 100;
        }
        const updatedProfile = {
          ...profile,
          sovereigns: profile.sovereigns + 25 + allStagesDoneBonus,
          stageProgress: newProgress,
          badges: newBadges,
          allStagesBonusEarned: allStagesDoneBonus > 0 ? true : profile.allStagesBonusEarned
        };
        onUpdateProfile(updatedProfile);

        // Sync stage mastery to backend
        learnHubApi.markProgress({
          content_type: "path",
          content_id: `stage-${stage.order}`,
          progress_percent: 100,
        }).catch(() => {});

        toast.success(`🎉 Stage Mastered! +25 Sovereigns (SVG) earned. ${stage.badge} Badge unlocked!`);
      }
    }
  }, [currentStep, stage.order]);

  const handleToggleTrackDoc = () => {
    const tracked = profile.trackedDocs || [];
    let updatedTracked = [];
    if (tracked.includes(stage.documentName)) {
      updatedTracked = tracked.filter((d: string) => d !== stage.documentName);
      toast.info(`Stopped tracking ${stage.documentName}`);
    } else {
      updatedTracked = [...tracked, stage.documentName];
      toast.success(`Tracking ${stage.documentName}! You will receive alerts when counties upload files.`);
    }
    onUpdateProfile({ ...profile, trackedDocs: updatedTracked });
  };

  const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
  const isCached = stage.steps.length > 0;

  const getPersonalizedText = (rawText: string) => {
    if (!rawText) return "";
    return rawText.replace(/\[Selected County\]/g, profile.county || "your County");
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("year", year.toString());
      url.searchParams.set("stage", stage.order.toString());
      window.history.pushState({}, "", url.toString());
    }
    toast.info(`Filtered documents for year ${year}`);
  };

  const handleCopyShareLink = (pdfUrl: string) => {
    navigator.clipboard.writeText(pdfUrl);
    toast.success("Direct PDF URL copied to clipboard for sharing!");
  };

  const handleRequestDocument = (docType: string, year: number) => {
    toast.success(`Request for ${docType} (${year}) has been generated and queued for submission to the county assembly clerk.`);
  };

  const currentStageDocs = getDocumentsForStage(stage.order, selectedYear, profile.county || "", liveRepoDocs);
  const constitutionYears = [2010, 2005, 1997, 1991, 1982, 1969, 1964, 1963];
  const standardYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
  const yearOptions = stage.order === 1 ? constitutionYears : standardYears;

  const totalSteps = stage.steps.length;

  const handlePrevStep = () => {
    const nextVal = currentStep - 1;
    setCurrentStep(nextVal);
    const p = readProgress(stage.slug, stage.order);
    writeProgress(stage.slug, { ...p, currentStep: nextVal });
    setShowTrivia(false);
  };

  const handleNextStep = () => {
    const nextVal = currentStep + 1;
    setCurrentStep(nextVal);
    const p = readProgress(stage.slug, stage.order);
    writeProgress(stage.slug, { ...p, currentStep: nextVal });
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background md:relative md:inset-auto md:z-auto md:h-full">

      <DrawerHeader
        title={stage.title}
        badge={stage.badge}
        currentStep={currentStep}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        isCached={isCached}
        onClose={onClose}
        author={stage.author}
      />

      {/* ── Body: full-width scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

        {activeSubTab === "learn" ? (
          <div className="space-y-6 max-w-4xl mx-auto">

            {/* STEP 0: COURSE OVERVIEW */}
            {currentStep === 0 && (
              <CourseOverview
                badge={stage.badge}
                title={stage.title}
                credits={stage.credits}
                author={stage.author}
                description={stage.description}
                expectations={stage.expectations}
                onStartLearning={handleStartLearning}
              />
            )}

            {/* STEP 1..N: GUIDED STEPS */}
            {currentStep >= 1 && currentStep <= stage.steps.length && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <StepContent
                  step={stage.steps[currentStep - 1]}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  activeFormat={activeFormat}
                  showTrivia={showTrivia}
                  origin={origin}
                  getPersonalizedText={getPersonalizedText}
                  onFormatChange={setActiveFormat}
                />

                <TriviaSection
                  trivia={stage.steps[currentStep - 1].trivia}
                  stepId={stage.steps[currentStep - 1].order}
                  stageId={stage.order}
                  currentStep={currentStep}
                  showTrivia={showTrivia}
                  triviaSkipped={triviaSkipped}
                  activeTriviaIdx={activeTriviaIdx}
                  selectedTriviaAnswer={selectedTriviaAnswer}
                  triviaSubmitted={triviaSubmitted}
                  reflectionText={reflectionText}
                  selectedReflectionOption={selectedReflectionOption}
                  onAnswerMCQ={handleAnswerMCQ}
                  onSubmitReflection={handleSubmitReflection}
                  onNextQuestion={handleNextTriviaQuestion}
                  onSkip={() => setTriviaSkipped(true)}
                  onResetMCQ={() => { setSelectedTriviaAnswer(null); setTriviaSubmitted(false); }}
                  onReflectionOptionSelect={setSelectedReflectionOption}
                  onReflectionTextChange={setReflectionText}
                  isStepTriviaPassed={isStepTriviaPassed}
                />
              </div>
            )}

            {/* STAGE MASTERY PAGE */}
            {currentStep === stage.steps.length + 1 && (
              <MasteryPage
                badge={stage.badge}
                badgeName={stage.badgeName}
                title={stage.documentName || "Stage Mastered"}
                hasNext={hasNext}
                onNextStage={onNextStage}
                onClose={onClose}
              />
            )}

          </div>
        ) : (
          <DocumentsTab
            stageId={stage.order}
            documentName={stage.documentName}
            selectedYear={selectedYear}
            constitutionTab={constitutionTab}
            apiLoading={apiLoading}
            currentStageDocs={currentStageDocs}
            yearOptions={yearOptions}
            isDocTracked={isDocTracked}
            onYearChange={handleYearChange}
            onConstitutionTabChange={setConstitutionTab}
            onToggleTrackDoc={handleToggleTrackDoc}
            onCopyShareLink={handleCopyShareLink}
            onRequestDocument={handleRequestDocument}
          />
        )}

      </div>

      <NavigationFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        hasNext={currentStep <= totalSteps}
        hasPrev={currentStep > 0}
        onClose={onClose}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onStartLearning={handleStartLearning}
        onPrevStage={onPrevStage}
        onNextStage={onNextStage}
      />

    </div>
  );
}
