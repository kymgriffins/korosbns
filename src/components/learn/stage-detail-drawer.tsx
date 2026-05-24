"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";
import { Textarea } from "@/ui/textarea";
import {
  Play, Pause, CheckCircle2, AlertCircle, Clock, ExternalLink,
  BookOpen, Trophy, ArrowRight, ArrowLeft, X, Sparkles, HelpCircle, RefreshCw,
  Volume2, VolumeX, FileText, Search, DownloadCloud, Award, Lock, FileCheck, Share2, History
} from "lucide-react";
import { cn } from "@/utils";
import {
  getDocumentsForStage,
  GovernmentDocument,
  CONSTITUTION_HISTORICAL_DOCS,
  PARTICIPATION_TOOLKIT_DOCS
} from "@/constants/documents-registry";

// Types matching the updated stages step schema
interface TriviaItem {
  type: "multiple-choice" | "reflection";
  question: string;
  options?: string[];
  answer?: number;
  explanation?: string;
  placeholder?: string;
}

interface Step {
  id: number;
  title: string;
  youtubeId: string;
  audioUrl: string;
  transcript: string;
  text: string;
  trivia: TriviaItem[];
  duration?: string;
}


interface Stage {
  id: number;
  title: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: "Published" | "Gazetted" | "Comment Open" | "Closed";
  credits?: string;
  description: string;
  expectations: string[];
  steps: Step[];
}

const getStepTakeaway = (stageId: number, stepId: number): { type: "info" | "warning"; title: string; text: string } | null => {
  if (stageId === 1) {
    if (stepId === 1) return { type: "info", title: "Key Principle", text: "Article 201 mandates that the public finance system must promote an equitable society and be open to public participation." };
    if (stepId === 2) return { type: "info", title: "Access to Info", text: "Article 35 gives you the right to access county budgets and plans. Transparency is a legal requirement, not a favor." };
    if (stepId === 3) return { type: "warning", title: "Independent Watchdog", text: "The Controller of Budget (COB) must approve all withdrawals from public funds, preventing unauthorized spending." };
  }
  if (stageId === 2) {
    if (stepId === 1) return { type: "info", title: "Critical Date", text: "By law, the Treasury must submit the BPS to Parliament by February 15th annually to guide the national budget." };
    if (stepId === 2) return { type: "info", title: "BETA Pillars", text: "The 2026 BPS prioritizes Agriculture and MSMEs through Hustler Fund expansion and county-level training hubs." };
    if (stepId === 3) return { type: "info", title: "UHC Target", text: "The Universal Health Coverage goal is to enroll 35 million Kenyans into the Social Health Authority (SHA)." };
    if (stepId === 4) return { type: "warning", title: "Debt Ceiling Impact", text: "With over KES 1 Trillion in debt interest, development budgets are squeezed, requiring strict fiscal discipline." };
  }
  return null;
};

interface StageDetailDrawerProps {
  stage: Stage;
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
  // Tabs Navigation: learn (Guided Journey) or documents (Repository)
  const [activeSubTab, setActiveSubTab] = useState<"learn" | "documents">("learn");

  // Step state (0: Overview, 1..N: Steps, N+1: Mastery)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Active delivery format
  const [activeFormat, setActiveFormat] = useState<"video" | "audio" | "text">("video");

  // Simulated audio player
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Gating & completion flag for current step - unlocked by default
  const [contentConsumed, setContentConsumed] = useState<boolean>(true);

  // Trivia inline state (no modal — renders below content automatically)
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [activeTriviaIdx, setActiveTriviaIdx] = useState<number>(0);
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState<boolean>(false);
  const [triviaCooldown, setTriviaCooldown] = useState<number>(0);
  const [triviaSkipped, setTriviaSkipped] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");

  // Search inside transcript
  const [transcriptSearch, setTranscriptSearch] = useState<string>( "");
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Document Repository states
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

  // YouTube references (none required, standard iframe works natively)

  // Fetch live documents from API on mount
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

  // Initialize selectedYear from URL query parameters on load
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

  // Load state when stage.id changes
  useEffect(() => {
    setActiveSubTab("learn");
    
    const storedStep = localStorage.getItem(`stage_${stage.id}_current_step`);
    const initialStep = storedStep ? parseInt(storedStep, 10) : 0;
    setCurrentStep(initialStep);
    
    // reset format and tracking states
    setActiveFormat("video");
    setAudioPlaying(false);
    setContentConsumed(true);
    setActiveTriviaIdx(0);
    setShowTrivia(false);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaCooldown(0);
    setTriviaSkipped(false);
    setReflectionText("");
    setTranscriptSearch("");
    setShowTranscript(false);

    // Default selected year based on stage
    if (stage.id === 1) {
      setSelectedYear(2010);
    } else {
      setSelectedYear(2026);
    }
  }, [stage.id]);

  // Load state when currentStep or stage.id changes
  useEffect(() => {
    if (currentStep < 1 || currentStep > stage.steps.length) {
      setAudioPlaying(false);
      setContentConsumed(true);
      return;
    }

    const step = stage.steps[currentStep - 1];
    
    // Check if trivia is already passed
    setContentConsumed(true);
    
    // Reset step states
    setAudioPlaying(false);
    setShowTrivia(false);
    setActiveTriviaIdx(0);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaSkipped(false);
    setReflectionText("");
    setShowTranscript(false);
    setTranscriptSearch("");

    // Check for cooldowns for this specific step's trivia questions
    const cooldownKey = `stage_${stage.id}_step_${step.id}_cooldown`;
    const storedCooldown = localStorage.getItem(cooldownKey);
    if (storedCooldown) {
      const diff = Math.floor((parseInt(storedCooldown, 10) - Date.now()) / 1000);
      if (diff > 0) {
        setTriviaCooldown(diff);
      } else {
        setTriviaCooldown(0);
      }
    } else {
      setTriviaCooldown(0);
    }
  }, [currentStep, stage.id]);

  // Cooldown countdown timer
  useEffect(() => {
    if (triviaCooldown <= 0) return;
    const interval = setInterval(() => {
      setTriviaCooldown((prev) => {
        if (prev <= 1) {
          const step = stage.steps[currentStep - 1];
          localStorage.removeItem(`stage_${stage.id}_step_${step.id}_cooldown`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [triviaCooldown, stage.id, currentStep]);

  // No timing logic needed as lessons are unlocked by default

  // Start Learning Button
  const handleStartLearning = () => {
    setCurrentStep(1);
    localStorage.setItem(`stage_${stage.id}_current_step`, "1");
  };

  // Check if a step's trivia is passed
  const isStepTriviaPassed = (stepId: number) => {
    return localStorage.getItem(`stage_${stage.id}_step_${stepId}_trivia_passed`) === "true";
  };

  // Submit MCQ Answer
  const handleAnswerMCQ = (qIdx: number, selectedIdx: number, correctIdx: number) => {
    if (triviaSubmitted || triviaCooldown > 0) return;
    setSelectedTriviaAnswer(selectedIdx);
    setTriviaSubmitted(true);

    if (selectedIdx === correctIdx) {
      const step = stage.steps[currentStep - 1];
      const rewardKey = `stage_${stage.id}_step_${step.id}_trivia_${qIdx}_reward`;
      if (!localStorage.getItem(rewardKey)) {
        localStorage.setItem(rewardKey, "true");
        const updated = {
          ...profile,
          sovereigns: profile.sovereigns + 5
        };
        onUpdateProfile(updated);
        toast.success("Correct! +5 Sovereigns (SVG) awarded!");
      } else {
        toast.success("Correct!");
      }
    } else {
      const step = stage.steps[currentStep - 1];
      const cooldownTime = Date.now() + 5 * 60 * 1000;
      localStorage.setItem(`stage_${stage.id}_step_${step.id}_cooldown`, cooldownTime.toString());
      setTriviaCooldown(300);
      toast.error("Incorrect answer! Cooldown locked for 5 minutes to review materials.");
    }
  };

  // Submit Reflection Answer
  const handleSubmitReflection = (qIdx: number) => {
    if (reflectionText.trim().length < 10) {
      toast.error("Please share a meaningful reflection (minimum 10 characters).");
      return;
    }
    
    setTriviaSubmitted(true);
    const step = stage.steps[currentStep - 1];
    const rewardKey = `stage_${stage.id}_step_${step.id}_trivia_${qIdx}_reward`;
    if (!localStorage.getItem(rewardKey)) {
      localStorage.setItem(rewardKey, "true");
      const updated = {
        ...profile,
        sovereigns: profile.sovereigns + 5
      };
      onUpdateProfile(updated);
      toast.success("Reflection submitted! +5 Sovereigns (SVG) awarded!");
    } else {
      toast.success("Reflection logged!");
    }
  };

  // Proceed to next trivia question or complete step
  const handleNextTriviaQuestion = () => {
    const step = stage.steps[currentStep - 1];
    if (activeTriviaIdx < step.trivia.length - 1) {
      setActiveTriviaIdx((prev) => prev + 1);
      setSelectedTriviaAnswer(null);
      setTriviaSubmitted(false);
      setReflectionText("");
    } else {
      localStorage.setItem(`stage_${stage.id}_step_${step.id}_trivia_passed`, "true");
      setContentConsumed(true);
      toast.success("Step complete! Tap Next to continue. ⭐");
    }
  };

  // Clear Cooldown (Debug Bypass)
  const handleClearCooldown = () => {
    const step = stage.steps[currentStep - 1];
    localStorage.removeItem(`stage_${stage.id}_step_${step.id}_cooldown`);
    setTriviaCooldown(0);
    toast.success("Cooldown cleared (Debug Shortcut)!");
  };

  // Award mastery on Stage Completion screen
  const masteryAwardedKey = `stage_${stage.id}_mastery_awarded`;
  useEffect(() => {
    if (currentStep === stage.steps.length + 1) {
      if (!localStorage.getItem(masteryAwardedKey)) {
        localStorage.setItem(masteryAwardedKey, "true");
        
        const newProgress = profile.stageProgress ? [...profile.stageProgress] : [1];
        const nextStageId = stage.id + 1;
        if (nextStageId <= 8 && !newProgress.includes(nextStageId)) {
          newProgress.push(nextStageId);
        }
        
        const newBadges = profile.badges ? [...profile.badges] : [];
        if (!newBadges.includes(stage.badge)) {
          newBadges.push(stage.badge);
        }

        let allStagesDoneBonus = 0;
        if (newProgress.length === 8 && newBadges.length === 8 && !profile.allStagesBonusEarned) {
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
        toast.success(`🎉 Stage Mastered! +25 Sovereigns (SVG) earned. ${stage.badge} Badge unlocked!`);
      }
    }
  }, [currentStep, stage.id]);

  // Track Document Toggle
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

    onUpdateProfile({
      ...profile,
      trackedDocs: updatedTracked
    });
  };

  const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
  const isCached = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bns_cached_stages") || "[]").includes(stage.id) : false;

  // Personalize text with county
  const getPersonalizedText = (rawText: string) => {
    if (!rawText) return "";
    return rawText.replace(/\[Selected County\]/g, profile.county || "your County");
  };

  // Year Change update with URL shareability query parameters
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("year", year.toString());
      url.searchParams.set("stage", stage.id.toString());
      window.history.pushState({}, "", url.toString());
    }
    toast.info(`Filtered documents for year ${year}`);
  };

  // Copy share URL link to clipboard
  const handleCopyShareLink = (pdfUrl: string) => {
    navigator.clipboard.writeText(pdfUrl);
    toast.success("Direct PDF URL copied to clipboard for sharing!");
  };

  // Request Document simulation
  const handleRequestDocument = (docType: string, year: number) => {
    toast.success(`Request for ${docType} (${year}) has been generated and queued for submission to the county assembly clerk.`);
  };

  // Fetch filtered documents from registry database (combining API + static fallbacks)
  const currentStageDocs = getDocumentsForStage(
    stage.id,
    selectedYear,
    profile.county || "",
    liveRepoDocs
  );

  // Available year pills definition
  const constitutionYears = [2010, 2005, 1997, 1991, 1982, 1969, 1964, 1963];
  const standardYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
  const yearOptions = stage.id === 1 ? constitutionYears : standardYears;

  return (
    <div className="absolute inset-0 z-20 bg-background flex flex-col overflow-hidden md:relative md:inset-auto md:z-auto md:h-full">
          {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 w-full h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 gap-3 shrink-0">
        {/* Mobile header: logo back + stage label */}
        <div className="flex md:hidden items-center gap-3 min-w-0">
          <button onClick={onClose} aria-label="Back" className="shrink-0 flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="BNS" className="h-7 w-auto" />
          </button>
          <div className="flex items-center gap-1.5 border-l border-border pl-2 min-w-0">
            <span className="text-base shrink-0">{stage.badge}</span>
            <h2 className="text-[11px] font-black uppercase tracking-tight truncate">{stage.title}</h2>
          </div>
        </div>
        {/* Desktop header: breadcrumb navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm min-w-0 flex-1">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs shrink-0"
            aria-label="Back to Learn"
          >
            Learn
          </button>
          <span className="text-border text-xs shrink-0">/</span>
          <span className="text-xs font-semibold text-foreground truncate">{stage.title}</span>
          {currentStep > 0 && (
            <>
              <span className="text-border text-xs shrink-0">/</span>
              <span className="text-xs font-semibold text-primary shrink-0">
                Step {currentStep <= stage.steps.length ? currentStep : stage.steps.length} of {stage.steps.length}
              </span>
            </>
          )}
        </nav>
        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isCached && (
            <span className="hidden sm:flex text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-extrabold px-1.5 py-0.5 rounded-full items-center gap-0.5">
              📦 Cached
            </span>
          )}
          <Button size="icon-sm" variant="ghost" onClick={onClose} className="rounded-full md:hidden">
            <X className="size-5" />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onClose} className="hidden md:flex rounded-full" title="Back to roadmap">
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {/* Sub-tabs: pill style on desktop, grid on mobile */}
      <div className="shrink-0 border-b border-border bg-muted/20">
        {/* Mobile: two large grid tabs */}
        <div className="grid grid-cols-2 md:hidden">
          <button
            onClick={() => setActiveSubTab("learn")}
            className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 transition-all ${activeSubTab === "learn" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            <BookOpen className="size-4" />
            <span>Learn</span>
          </button>
          <button
            onClick={() => setActiveSubTab("documents")}
            className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 transition-all ${activeSubTab === "documents" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          >
            <FileCheck className="size-4" />
            <span>Documents</span>
          </button>
        </div>
        {/* Desktop: horizontal pill tabs */}
        <div className="hidden md:flex items-center gap-1 px-6 py-2">
          <button
            onClick={() => setActiveSubTab("learn")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeSubTab === "learn" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <BookOpen className="size-3.5" /> Guided Journey
          </button>
          <button
            onClick={() => setActiveSubTab("documents")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeSubTab === "documents" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <FileCheck className="size-3.5" /> Documents
          </button>
        </div>
      </div>

      {/* ── Desktop 2-panel body: content LEFT + steps sidebar RIGHT ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Scrollable content + sticky footer */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-8 relative">
        
        {activeSubTab === "learn" ? (
          <div className="space-y-6">
            
            {/* STEP 0: COURSE OVERVIEW */}
            {currentStep === 0 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl space-y-4">
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xs relative">
                    <span className="text-3xl">{stage.badge}</span>
                    <Sparkles className="size-4 text-primary absolute -top-1 -right-1 fill-primary animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stage.credits || "Credits: BNS Team"}</span>
                    <h3 className="font-black text-base text-foreground mt-1">{stage.title} Overview</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Trophy className="size-3.5" /> What to expect
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {stage.expectations.map((exp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/80 leading-normal">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleStartLearning}
                  className="w-full h-12 rounded-xl font-bold gap-2 text-sm text-primary-foreground bg-primary hover:bg-primary/95 transition-all shadow-md active:scale-[0.98]"
                >
                  Start Learning Course <ArrowRight className="size-4" />
                </Button>
              </div>
            )}

            {/* STEP 1..N: GUIDED STEPS */}
            {currentStep >= 1 && currentStep <= stage.steps.length && (
              <div className="space-y-5 animate-in fade-in duration-300">
                
                {/* Step Progress and Header */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-primary uppercase tracking-wider">Step {currentStep} of {stage.steps.length}</span>
                    <span className="text-muted-foreground">{Math.round(((currentStep - 1) / stage.steps.length) * 100)}% Complete</span>
                  </div>
                  <Progress value={((currentStep - 1) / stage.steps.length) * 100} className="h-1.5 rounded-full" />
                  <h3 className="text-sm font-black text-foreground mt-1">
                    {stage.steps[currentStep - 1].title}
                  </h3>
                </div>

                {/* Format Toggle Group & Content Player (Hidden when taking trivia to avoid commotion) */}
                {!showTrivia && (
                  <>
                    <div className="grid grid-cols-3 gap-2 bg-muted/60 p-1 rounded-xl">
                      <button
                        onClick={() => setActiveFormat("video")}
                        className={cn(
                          "py-2 text-[11px] font-black rounded-lg flex items-center justify-center gap-1.5 transition-all",
                          activeFormat === "video" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🎥 Video
                      </button>
                      <button
                        onClick={() => setActiveFormat("audio")}
                        className={cn(
                          "py-2 text-[11px] font-black rounded-lg flex items-center justify-center gap-1.5 transition-all",
                          activeFormat === "audio" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🎧 Audio
                      </button>
                      <button
                        onClick={() => setActiveFormat("text")}
                        className={cn(
                          "py-2 text-[11px] font-black rounded-lg flex items-center justify-center gap-1.5 transition-all",
                          activeFormat === "text" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        📖 Text
                      </button>
                    </div>

                    {/* Content Panel */}
                    <div className="p-4 border border-border bg-card rounded-2xl shadow-xs space-y-4">
                      
                      {/* VIDEO FORMAT */}
                      {activeFormat === "video" && origin && (
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                            <iframe
                              className="w-full h-full border-0"
                              src={`https://www.youtube-nocookie.com/embed/${stage.steps[currentStep - 1].youtubeId}?rel=0&modestbranding=1`}
                              title="Budget Ndio Story Step Video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {/* AUDIO FORMAT */}
                      {activeFormat === "audio" && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col items-center justify-center text-center space-y-3">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Volume2 className="size-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">Podcast Audio Lesson</p>
                              <p className="text-[10px] text-muted-foreground">Listen to this step's key takeaways</p>
                            </div>
                            
                            <div className="w-full flex items-center justify-center gap-3">
                              <Button
                                onClick={() => setAudioPlaying(!audioPlaying)}
                                className="rounded-xl shadow-xs shrink-0 font-bold text-xs gap-1.5"
                              >
                                {audioPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                                <span>{audioPlaying ? "Pause Audio" : "Listen to Lesson"}</span>
                              </Button>
                            </div>
                          </div>

                          {/* Searchable Transcript */}
                          <div className="border-t border-border pt-3 space-y-2">
                            <button
                              onClick={() => setShowTranscript(!showTranscript)}
                              className="text-xs font-bold text-primary flex items-center gap-1 underline"
                            >
                              <FileText className="size-3.5" />
                              <span>{showTranscript ? "Hide Searchable Transcript" : "Show Searchable Transcript"}</span>
                            </button>

                            {showTranscript && (
                              <div className="space-y-2 border border-border bg-muted/20 p-3 rounded-xl animate-in fade-in duration-200">
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                  <input
                                    type="text"
                                    placeholder="Search transcript..."
                                    value={transcriptSearch}
                                    onChange={(e) => setTranscriptSearch(e.target.value)}
                                    className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-card text-xs focus-visible:outline-none"
                                  />
                                </div>
                                <div className="max-h-24 overflow-y-auto font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-foreground/80 scrollbar-thin">
                                  {stage.steps[currentStep - 1].transcript
                                    .split("\n")
                                    .filter(line => line.toLowerCase().includes(transcriptSearch.toLowerCase()))
                                    .join("\n") || "No matching lines found."}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TEXT FORMAT */}
                      {activeFormat === "text" && (
                        <article className="
                          /* Layout & Container */
                          w-full max-w-none md:max-w-[720px] mx-auto px-4 py-6 md:px-8 md:py-8
                          bg-white dark:bg-card/50 border border-gray-200 dark:border-border/50 rounded-2xl shadow-sm md:shadow-md
                          
                          /* Typography Core */
                          prose prose-base prose-neutral dark:prose-invert max-w-none
                          
                          /* Paragraphs & Text */
                          prose-p:text-gray-800 prose-p:dark:text-gray-300
                          prose-p:leading-7 md:prose-p:leading-relaxed
                          prose-p:my-3 md:prose-p:my-4
                          
                          /* Headings */
                          prose-headings:text-gray-900 dark:prose-headings:text-white
                          prose-headings:font-semibold
                          
                          /* Common */
                          prose-strong:text-gray-900 dark:prose-strong:text-white
                          prose-ul:my-3 md:prose-ul:my-4
                          prose-li:my-1
                        ">
                          {getPersonalizedText(stage.steps[currentStep - 1].text)
                            .split("\n\n")
                            .map((para, pIdx) => (
                              <p key={pIdx} className="whitespace-pre-wrap">
                                {para}
                              </p>
                            ))}

                          {/* Educational Takeaway Callout Box */}
                          {(() => {
                            const takeaway = getStepTakeaway(stage.id, stage.steps[currentStep - 1].id);
                            if (!takeaway) return null;

                            if (takeaway.type === "info") {
                              return (
                                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400 not-prose">
                                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                    💡 {takeaway.title}
                                  </p>
                                  <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">
                                    {takeaway.text}
                                  </p>
                                </div>
                              );
                            } else {
                              return (
                                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 dark:bg-amber-900/20 dark:border-amber-400 not-prose">
                                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                                    ⚠️ {takeaway.title}
                                  </p>
                                  <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">
                                    {takeaway.text}
                                  </p>
                                </div>
                              );
                            }
                          })()}
                        </article>
                      )}

                    </div>
                  </>
                )}

                {/* ─── INLINE TRIVIA (no modal, auto-rendered) ─── */}
                <div className="mt-6 space-y-4">
                  {isStepTriviaPassed(stage.steps[currentStep - 1].id) ? (
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Step Complete!</h4>
                        <p className="text-[10px] text-muted-foreground">Tap Next below to continue your journey.</p>
                      </div>
                    </div>
                  ) : triviaSkipped ? (
                    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
                      <HelpCircle className="size-5 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300">Trivia Skipped</h4>
                        <p className="text-[10px] text-muted-foreground">You can retake this later. Tap Next to continue.</p>
                      </div>
                    </div>
                  ) : showTrivia ? (
                    <div className="space-y-4 border border-border bg-card rounded-2xl p-4 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Trivia header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Sparkles className="size-4" />
                          <span className="text-xs font-black uppercase tracking-wide">
                            Quick Check {activeTriviaIdx + 1} of {stage.steps[currentStep - 1].trivia.length}
                          </span>
                        </div>
                        <button
                          onClick={() => setTriviaSkipped(true)}
                          className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Skip for now
                        </button>
                      </div>

                      {/* Trivia question body */}
                      {(() => {
                        const step = stage.steps[currentStep - 1];
                        const q = step.trivia[activeTriviaIdx];

                        if (q.type === "multiple-choice") {
                          return (
                            <div className="space-y-3">
                              <h4 className="text-sm font-black text-foreground leading-snug">{q.question}</h4>

                              {triviaCooldown > 0 && (
                                <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-xl text-center space-y-1">
                                  <Clock className="size-5 text-destructive mx-auto animate-pulse" />
                                  <p className="text-[11px] font-bold text-destructive">Review cooldown</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {Math.floor(triviaCooldown / 60)}m {triviaCooldown % 60}s remaining
                                  </p>
                                  <Button size="xs" variant="outline" onClick={handleClearCooldown} className="text-[9px] gap-1 mt-1">
                                    <RefreshCw className="size-3" /> Clear (Debug)
                                  </Button>
                                </div>
                              )}

                              <div className="grid gap-2">
                                {q.options?.map((opt, idx) => {
                                  const isSelected = selectedTriviaAnswer === idx;
                                  const isCorrect = q.answer === idx;
                                  let optStyle = "border-border bg-card hover:bg-muted/40";
                                  if (isSelected) {
                                    if (triviaSubmitted) {
                                      optStyle = isCorrect
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                                        : "border-destructive bg-destructive/10 text-destructive font-bold";
                                    } else {
                                      optStyle = "border-primary bg-primary/5 text-primary font-bold";
                                    }
                                  } else if (triviaSubmitted && isCorrect) {
                                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                                  }
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleAnswerMCQ(activeTriviaIdx, idx, q.answer!)}
                                      disabled={triviaSubmitted || triviaCooldown > 0}
                                      className={cn(
                                        "w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]",
                                        optStyle
                                      )}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {triviaSubmitted && (
                                <div className={cn(
                                  "p-3 rounded-xl border text-xs leading-normal animate-in zoom-in-95 duration-200",
                                  selectedTriviaAnswer === q.answer
                                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                                    : "border-destructive/20 bg-destructive/5 text-destructive"
                                )}>
                                  <h5 className="font-bold flex items-center gap-1.5 mb-1">
                                    {selectedTriviaAnswer === q.answer ? (
                                      <><CheckCircle2 className="size-4 text-emerald-600" /> Correct!⭐</>
                                    ) : (
                                      <><AlertCircle className="size-4 text-destructive" /> Not quite—try again</>
                                    )}
                                  </h5>
                                  <p>{q.explanation}</p>
                                </div>
                              )}

                              {triviaSubmitted && (
                                selectedTriviaAnswer === q.answer ? (
                                  <Button
                                    onClick={handleNextTriviaQuestion}
                                    className="w-full h-10 rounded-xl font-bold text-xs gap-1.5"
                                  >
                                    {activeTriviaIdx < step.trivia.length - 1 ? (
                                      <>Next Question <ArrowRight className="size-4" /></>
                                    ) : (
                                      <>Complete Check <CheckCircle2 className="size-4" /></>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => { setSelectedTriviaAnswer(null); setTriviaSubmitted(false); }}
                                    variant="outline"
                                    className="w-full h-10 rounded-xl font-bold text-xs"
                                    disabled={triviaCooldown > 0}
                                  >
                                    Try Again
                                  </Button>
                                )
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="space-y-3">
                              <h4 className="text-sm font-black text-foreground leading-snug">{q.question}</h4>

                              {q.options && q.options.length > 0 && (
                                <div className="grid gap-2">
                                  {q.options.map((opt, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setReflectionText(opt)}
                                      className={cn(
                                        "w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all",
                                        reflectionText === opt
                                          ? "border-primary bg-primary/5 text-primary font-bold"
                                          : "border-border bg-card hover:bg-muted/40"
                                      )}
                                      disabled={triviaSubmitted}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Reflection:</label>
                                <Textarea
                                  placeholder={q.placeholder || "Enter your comment..."}
                                  value={reflectionText}
                                  onChange={(e) => setReflectionText(e.target.value)}
                                  disabled={triviaSubmitted}
                                  className="rounded-xl text-xs min-h-[80px]"
                                />
                              </div>

                              {!triviaSubmitted && (
                                <Button
                                  onClick={() => handleSubmitReflection(activeTriviaIdx)}
                                  className="w-full h-10 rounded-xl font-bold text-xs"
                                >
                                  Submit Reflection
                                </Button>
                              )}

                              {triviaSubmitted && (
                                <>
                                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 text-xs">
                                    <h5 className="font-bold flex items-center gap-1.5 mb-1">
                                      <CheckCircle2 className="size-4 text-emerald-600" /> Reflection Logged
                                    </h5>
                                    <p>Your civic opinion has been recorded.</p>
                                  </div>
                                  <Button
                                    onClick={handleNextTriviaQuestion}
                                    className="w-full h-10 rounded-xl font-bold text-xs gap-1.5"
                                  >
                                    {activeTriviaIdx < step.trivia.length - 1 ? (
                                      <>Next Question <ArrowRight className="size-4" /></>
                                    ) : (
                                      <>Complete Check <CheckCircle2 className="size-4" /></>
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ) : null}
                </div>

              </div>
            )}

            {/* STAGE MASTERY PAGE */}
            {currentStep === stage.steps.length + 1 && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 animate-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 size-24 rounded-full bg-primary/25 blur-xl animate-ping mx-auto" />
                  <div className="size-24 rounded-full bg-card border border-primary/30 flex items-center justify-center text-5xl shadow-2xl relative mx-auto">
                    {stage.badge}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    <Award className="size-4 fill-primary" /> Badge Unlocked!
                  </div>
                  <h3 className="font-black text-xl text-foreground">Stage Mastered successfully!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    You've completed all guided steps for the **{stage.documentName}** course and earned the **{stage.badgeName}** credentials.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card w-full text-xs font-semibold grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px]">REWARDS CREDITED:</span>
                    <p className="text-primary font-bold flex items-center gap-1 text-sm">
                      <Sparkles className="size-4 fill-primary" /> +25 SVG Points
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px]">CREDENTIAL ID:</span>
                    <p className="text-foreground font-mono text-[10px] mt-0.5">BNS-{stage.badgeName.toUpperCase()}-2026</p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (hasNext && onNextStage) {
                      onNextStage();
                    } else {
                      onClose();
                    }
                  }}
                  className="w-full h-12 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary/95 transition-all shadow-md"
                >
                  {hasNext ? "Continue to Next Stage" : "Finish Journey"}
                </Button>
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* STATUTORY DOCUMENTATION REPOSITORY TAB */}
            
            {/* Header info */}
            <div className="space-y-1">
              <h3 className="font-black text-sm flex items-center gap-1.5">
                <FileCheck className="size-4.5 text-primary" /> Documents Repository
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Access official statutory and planning records. Filter historical archives and download PDFs for offline analysis.
              </p>
            </div>

            {/* Document stage-specific warning/notice */}
            {apiLoading && (
              <div className="flex items-center justify-center py-4 gap-2 text-xs text-muted-foreground">
                <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Loading live API files...</span>
              </div>
            )}

            {/* View toggler for Constitution (Stage 1) */}
            {stage.id === 1 && (
              <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setConstitutionTab("current")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all",
                    constitutionTab === "current" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  Current Document
                </button>
                <button
                  onClick={() => setConstitutionTab("timeline")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all",
                    constitutionTab === "timeline" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  <History className="inline size-3.5 mr-1" /> Historical Timeline
                </button>
              </div>
            )}

            {/* Render Year Selector (Pills) for current view / standard stages */}
            {(stage.id !== 1 || constitutionTab === "current") && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Select Financial Year:</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {yearOptions.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => handleYearChange(yr)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 transition-all",
                        selectedYear === yr
                          ? "bg-primary border-primary text-primary-foreground shadow-sm"
                          : "bg-card border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {yr === 2010 && stage.id === 1 ? "2010 (Current)" : yr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Constitution Timeline View Special Case */}
            {stage.id === 1 && constitutionTab === "timeline" ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-3 bg-muted/20 border border-border rounded-xl text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
                  <History className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Select a year on the timeline below to open its historical draft details, referendums context, and download PDFs.
                  </span>
                </div>

                {/* Timeline UI */}
                <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {CONSTITUTION_HISTORICAL_DOCS.map((doc) => {
                    const isDocSelected = selectedYear === doc.year;
                    
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleYearChange(doc.year)}
                        className={cn(
                          "relative cursor-pointer transition-all p-3 rounded-xl border",
                          isDocSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border bg-card hover:bg-muted/40"
                        )}
                      >
                        {/* Timeline Circle Dot */}
                        <div className={cn(
                          "absolute -left-[22px] top-[14px] size-3.5 rounded-full border-2 transition-all",
                          isDocSelected
                            ? "bg-primary border-primary scale-110"
                            : "bg-background border-muted-foreground/40"
                        )} />
                        
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-foreground">{doc.title}</h4>
                          <span className="text-[9px] bg-muted border border-border px-1.5 py-0.5 rounded-full font-bold text-muted-foreground">
                            {doc.year}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                          {doc.historicalContext || doc.description}
                        </p>
                        
                        {isDocSelected && (
                          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                            {doc.isAvailable ? (
                              <>
                                <a
                                  href={doc.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-primary/95 transition-all"
                                >
                                  📄 View PDF
                                </a>
                                <a
                                  href={`${doc.pdfUrl}?download=1`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/80 transition-all"
                                >
                                  <DownloadCloud className="size-3" /> Download
                                </a>
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col space-y-2">
                                <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold px-2 py-1.5 rounded-lg text-center">
                                  ⚠️ PDF Not Available (Archived)
                                </span>
                                <Button
                                  size="xs"
                                  onClick={() => handleRequestDocument(doc.title, doc.year)}
                                  className="w-full text-[9px] font-bold"
                                >
                                  Request PDF Copy
                                </Button>
                              </div>
                            )}
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/70"
                            >
                              🔗 Source Portal
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              
              /* STANDARD STAGES LIST & CARDS */
              <div className="space-y-4">
                
                {/* Stage-level Track Document toggle */}
                <div className="p-3.5 border border-border bg-card rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground">Alert Subscriptions</h4>
                    <p className="text-[9px] text-muted-foreground">Subscribe to alerts when counties upload local updates.</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isDocTracked ? "outline" : "default"}
                    onClick={handleToggleTrackDoc}
                    className="font-bold shrink-0 text-xs h-9 rounded-xl px-3"
                  >
                    {isDocTracked ? "Tracking" : "Track Stage"}
                  </Button>
                </div>

                {/* Documents List */}
                {currentStageDocs.length > 0 ? (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <span>Auditable Documents ({currentStageDocs.length})</span>
                      <span>{selectedYear}</span>
                    </div>

                    {currentStageDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-border bg-card rounded-xl space-y-3 shadow-xs animate-in slide-in-from-bottom-1 duration-200"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-black text-foreground truncate max-w-[200px] sm:max-w-xs">
                              {doc.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")}
                            </h4>
                            <p className="text-[9px] text-muted-foreground mt-0.5">
                              {doc.issuingBody} · {doc.financialYear}
                            </p>
                          </div>
                          {doc.isCurrent && (
                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {doc.description}
                        </p>

                        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={doc.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/95 transition-all shadow-xs"
                            >
                              📄 View
                            </a>
                            <a
                              href={doc.pdfUrl}
                              download={doc.name}
                              className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-border bg-muted/20 text-foreground text-[10px] font-bold hover:bg-muted/50 transition-all"
                            >
                              <DownloadCloud className="size-3" /> Get
                            </a>
                            <button
                              onClick={() => handleCopyShareLink(doc.pdfUrl)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-foreground transition-all"
                              title="Share Document Link"
                            >
                              <Share2 className="size-3.5" />
                            </button>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground shrink-0 uppercase">
                            {doc.sizeBytes ? `${(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "PDF"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  
                  /* EMPTY STATE FALLBACK */
                  <div className="p-6 border border-dashed border-border bg-muted/15 rounded-xl text-center space-y-4">
                    <AlertCircle className="size-10 mx-auto text-muted-foreground/60" />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">No stage documents found for year {selectedYear}</h4>
                      <p className="text-[10px] text-muted-foreground max-w-xs mx-auto mt-1 leading-normal">
                        The statutory document may not have been gazetted or uploaded for this financial year yet.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
                      <Button
                        size="sm"
                        onClick={() => handleYearChange(2026)}
                        className="rounded-xl text-xs font-bold"
                      >
                        Reset to Current Year (2026)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestDocument(stage.documentName, selectedYear)}
                        className="rounded-xl text-xs font-bold"
                      >
                        Request Document from Authority
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </div>

          {/* ── Navigation Footer (sticky bottom of LEFT col) ── */}
          {currentStep > 0 && (
            <footer className="shrink-0 h-16 border-t border-border bg-card flex items-center justify-between px-4 gap-2 z-10">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (showTrivia) {
                    setShowTrivia(false);
                    return;
                  }
                  const nextVal = currentStep - 1;
                  setCurrentStep(nextVal);
                  localStorage.setItem(`stage_${stage.id}_current_step`, nextVal.toString());
                }}
                className="rounded-xl flex-1 gap-1 text-xs"
              >
                <ArrowLeft className="size-4" /> Back
              </Button>

              <span className="text-[10px] font-black text-muted-foreground shrink-0 uppercase tracking-widest">
                {currentStep > stage.steps.length ? "Mastery" : `${currentStep} / ${stage.steps.length}`}
              </span>

              {currentStep <= stage.steps.length ? (
                <Button
                  size="sm"
                  onClick={() => {
                    const step = stage.steps[currentStep - 1];
                    const passed = isStepTriviaPassed(step.id);
                    if (!passed && !triviaSkipped && !showTrivia) {
                      setShowTrivia(true);
                      toast.info("Let's test your understanding with a quick check! 📝");
                      return;
                    }
                    const nextVal = currentStep + 1;
                    setCurrentStep(nextVal);
                    localStorage.setItem(`stage_${stage.id}_current_step`, nextVal.toString());
                  }}
                  disabled={showTrivia && !isStepTriviaPassed(stage.steps[currentStep - 1].id) && !triviaSkipped}
                  className="rounded-xl flex-1 gap-1 text-xs"
                >
                  Next <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => { if (hasNext && onNextStage) { onNextStage(); } else { onClose(); } }}
                  className="rounded-xl flex-1 gap-1 text-xs"
                >
                  Finish <CheckCircle2 className="size-4" />
                </Button>
              )}
            </footer>
          )}
        </div>{/* end left col */}

        {/* RIGHT: Steps sidebar — desktop only (Udemy-style Course Content) */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 border-l border-border bg-card/30 overflow-hidden">
          {/* Sidebar header */}
          <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Stage Content</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {stage.steps.filter(s => isStepTriviaPassed(s.id)).length} / {stage.steps.length} steps complete
            </p>
          </div>

          {/* Steps list */}
          <div className="flex-1 overflow-y-auto">
            {/* Step 0: Overview */}
            <button
              onClick={() => setCurrentStep(0)}
              className={cn(
                "w-full flex items-start gap-3 p-4 text-left border-b border-border/40 transition-all hover:bg-muted/30",
                currentStep === 0
                  ? "bg-gradient-to-r from-primary/8 to-transparent border-l-2 border-l-primary"
                  : ""
              )}
            >
              <div className={cn(
                "size-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 border",
                currentStep === 0
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-border text-muted-foreground"
              )}>
                <BookOpen className="size-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[11px] font-bold", currentStep === 0 ? "text-primary" : "text-foreground")}>Stage Overview</p>
                <p className="text-[10px] text-muted-foreground">Introduction &amp; expectations</p>
              </div>
              {currentStep === 0 && <span className="size-1.5 rounded-full bg-primary animate-pulse shrink-0 mt-2" />}
            </button>

            {/* Content steps */}
            {stage.steps.map((step, i) => {
              const stepNum = i + 1;
              const isComplete = isStepTriviaPassed(step.id);
              const isActive = currentStep === stepNum;
              const isLocked = stepNum > 1 && !isStepTriviaPassed(stage.steps[i - 1].id) && !isComplete;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentStep(stepNum);
                      setTriviaSkipped(false);
                      localStorage.setItem(`stage_${stage.id}_current_step`, stepNum.toString());
                    }
                  }}
                  disabled={isLocked}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 text-left border-b border-border/40 transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary/8 to-transparent border-l-2 border-l-primary"
                      : isLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-muted/30"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 border transition-all",
                    isComplete
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-muted border-border text-muted-foreground"
                  )}>
                    {isComplete ? <CheckCircle2 className="size-3.5" /> : stepNum}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-[11px] font-bold truncate",
                      isActive ? "text-primary" : isComplete ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                    )}>{step.title}</p>
                    <p className="text-[10px] text-muted-foreground">{step.duration || "~5 min read"}</p>
                  </div>
                  {isActive && <span className="size-1.5 rounded-full bg-primary animate-pulse shrink-0 mt-2" />}
                  {isComplete && !isActive && <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-1" />}
                </button>
              );
            })}

            {/* Completion state */}
            {stage.steps.every(s => isStepTriviaPassed(s.id)) && (
              <div className="p-4 text-center space-y-1">
                <span className="text-2xl">🏆</span>
                <p className="text-xs font-black text-emerald-600">{stage.badgeName} Badge Earned!</p>
                <p className="text-[10px] text-muted-foreground">All steps complete</p>
              </div>
            )}
          </div>
        </aside>{/* end steps sidebar */}

      </div>{/* end desktop 2-panel body */}

    </div>
  );
}

