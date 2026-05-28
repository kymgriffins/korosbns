"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";
import { Textarea } from "@/ui/textarea";
import {
  Play, Pause, CheckCircle2, AlertCircle, ExternalLink,
  BookOpen, Trophy, ArrowRight, ArrowLeft, X, Sparkles, HelpCircle,
  FileText, Search, DownloadCloud, Award, Lock, FileCheck, Share2, History, Volume2, MessageSquare, Send
} from "lucide-react";
import { cn } from "@/utils";
import {
  getDocumentsForStage,
  GovernmentDocument,
  CONSTITUTION_HISTORICAL_DOCS,
  PARTICIPATION_TOOLKIT_DOCS
} from "@/constants/documents-registry";
import { learnHubApi } from "@/lib/learn-hub";
import type { StageTakeaway, StageTrivia } from "@/lib/learn-hub";

interface TriviaItem extends StageTrivia {
  placeholder?: string;
}

interface Step {
  id: string;
  title: string;
  youtubeId: string;
  audioUrl: string;
  transcript: string;
  text: string;
  trivia: TriviaItem[];
  takeaways: StageTakeaway[];
  duration?: string;
}

interface Stage {
  id: string;
  title: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: string;
  credits?: string;
  description: string;
  expectations: string[];
  order: number;
  steps: Step[];
}

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
  const [activeSubTab, setActiveSubTab] = useState<"learn" | "documents">("learn");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeFormat, setActiveFormat] = useState<"video" | "audio" | "text" | "trivia" | "discuss">("video");
  const [contentConsumed, setContentConsumed] = useState<boolean>(true);
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [activeTriviaIdx, setActiveTriviaIdx] = useState<number>(0);
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState<boolean>(false);
  const [triviaSkipped, setTriviaSkipped] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [selectedReflectionOption, setSelectedReflectionOption] = useState<string>("");
  const [triviaAnswersByQuestion, setTriviaAnswersByQuestion] = useState<Record<string, number>>({});
  const [transcriptSearch, setTranscriptSearch] = useState<string>("");
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [constitutionTab, setConstitutionTab] = useState<"current" | "timeline">("current");
  const [liveRepoDocs, setLiveRepoDocs] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>("");
  const [stageStats, setStageStats] = useState<{ total_users: number; avg_trivia_score: number | null } | null>(null);
  
  // Forum State
  const [forumThreads, setForumThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [forumLoading, setForumLoading] = useState(false);
  
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const loadForumThreads = async (chapterId: string) => {
    setForumLoading(true);
    try {
      const res = await learnHubApi.getForumThreads(chapterId);
      setForumThreads(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setForumLoading(false);
    }
  };

  const loadThreadDetail = async (threadId: string) => {
    setForumLoading(true);
    try {
      const res = await learnHubApi.getForumThread(threadId);
      setActiveThread(res);
    } catch (err) {
      console.error(err);
    } finally {
      setForumLoading(false);
    }
  };

  const handleCreateThread = async (chapterId: string) => {
    if (!newThreadTitle.trim()) return;
    try {
      await learnHubApi.createForumThread({
        title: newThreadTitle,
        civic_module: stage.id,
        civic_chapter: chapterId,
      });
      setNewThreadTitle("");
      loadForumThreads(chapterId);
      toast.success("Discussion started!");
    } catch (err) {
      toast.error("Failed to start discussion.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !activeThread) return;
    try {
      await learnHubApi.createForumPost(activeThread.id, newPostContent);
      setNewPostContent("");
      loadThreadDetail(activeThread.id);
      toast.success("Reply posted!");
    } catch (err) {
      toast.error("Failed to post reply.");
    }
  };
  const [serverProgress, setServerProgress] = useState<
    Array<{ content_type: string; content_id: string; progress_percent: number }>
  >([]);

  const refreshServerProgress = useCallback(async () => {
    try {
      const profileData = await learnHubApi.profile();
      setServerProgress(profileData.progress ?? []);
    } catch {
      /* profile may be empty for fresh guests */
    }
  }, []);

  useEffect(() => {
    void refreshServerProgress();
  }, [stage.id, refreshServerProgress]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    learnHubApi.stageLeaderboard(stage.id).then(setStageStats).catch(() => {});
  }, [stage.id]);

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
    const storedStep = localStorage.getItem(`stage_${stage.order}_current_step`);
    const initialStep = storedStep ? parseInt(storedStep, 10) : 0;
    setCurrentStep(initialStep);
    
    if (initialStep > 0 && stage.steps[initialStep - 1]) {
      const st = stage.steps[initialStep - 1];
      if (st.youtubeId) setActiveFormat("video");
      else if (st.audioUrl) setActiveFormat("audio");
      else setActiveFormat("text");
    } else {
      setActiveFormat("text");
    }
    
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
    if (step.youtubeId) {
      setActiveFormat("video");
    } else if (step.audioUrl) {
      setActiveFormat("audio");
    } else {
      setActiveFormat("text");
    }
    setContentConsumed(true);
    setShowTrivia(true);
    setActiveTriviaIdx(0);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaSkipped(false);
    setReflectionText("");
    setSelectedReflectionOption("");
    setTriviaAnswersByQuestion({});
    setShowTranscript(false);
    setTranscriptSearch("");
    setActiveThread(null);
    if (step.id) {
      loadForumThreads(step.id);
    }
  }, [currentStep, stage.order]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const handleStartLearning = () => {
    setCurrentStep(1);
    localStorage.setItem(`stage_${stage.order}_current_step`, "1");
  };

  const isStepTriviaPassed = (stepId: string) => {
    return localStorage.getItem(`stage_${stage.order}_step_${stepId}_trivia_passed`) === "true";
  const isStepTriviaPassed = (step: Step & { chapterId?: string; triviaId?: string | null }) => {
    if (step.chapterId) {
      const chapterDone = serverProgress.some(
        (row) =>
          row.content_type === "lesson" &&
          row.content_id === step.chapterId &&
          row.progress_percent >= 100,
      );
      if (chapterDone) return true;
    }
    if (step.triviaId) {
      const triviaDone = serverProgress.some(
        (row) =>
          row.content_type === "quest" &&
          row.content_id === step.triviaId &&
          row.progress_percent >= 100,
      );
      if (triviaDone) return true;
    }
    return localStorage.getItem(`stage_${stage.id}_step_${step.id}_trivia_passed`) === "true";
  };

  const syncStepCompletion = async (step: Step & { chapterId?: string; triviaId?: string | null }) => {
    try {
      if (step.triviaId) {
        await learnHubApi.markProgress({
          content_type: "quest",
          content_id: step.triviaId,
          progress_percent: 100,
        });
      }
      if (step.chapterId) {
        const result = await learnHubApi.completeChapter(step.chapterId);
        if (result.module_completed) {
          toast.success("Module completed! Certificate unlocked.");
        }
      } else {
        await learnHubApi.markProgress({
          content_type: "path",
          content_id: `stage-${stage.id}-step-${step.id}`,
          progress_percent: Math.round((currentStep / stage.steps.length) * 100),
        });
      }
      await refreshServerProgress();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save progress to server.");
      throw err;
    }
  };

  const recordTriviaAnswer = (qIdx: number, selectedIdx: number) => {
    const step = stage.steps[currentStep - 1];
    const q = step.trivia[qIdx];
    const questionKey = q?.id ?? `inline-${qIdx}`;
    setTriviaAnswersByQuestion((prev) => ({ ...prev, [questionKey]: selectedIdx }));
  };

  const submitServerTriviaIfReady = async (
    step: Step & { chapterId?: string; triviaId?: string | null },
    answers: Record<string, number>,
  ) => {
    if (!step.triviaId || Object.keys(answers).length === 0) {
      return;
    }
    const serverQuestionIds = step.trivia.filter((q) => q.id).map((q) => q.id as string);
    if (serverQuestionIds.length === 0) {
      return;
    }
    const payload = Object.fromEntries(
      Object.entries(answers).filter(([key]) => serverQuestionIds.includes(key)),
    );
    if (Object.keys(payload).length !== serverQuestionIds.length) {
      return;
    }
    try {
      await learnHubApi.submitTriviaAttempt(step.triviaId, payload);
      await refreshServerProgress();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit trivia to server.");
    }
  };

  const handleAnswerMCQ = (qIdx: number, selectedIdx: number, correctIdx: number) => {
    if (triviaSubmitted) return;
    recordTriviaAnswer(qIdx, selectedIdx);
    setSelectedTriviaAnswer(selectedIdx);
    setTriviaSubmitted(true);
    if (selectedIdx === correctIdx) {
      const step = stage.steps[currentStep - 1];
      const rewardKey = `stage_${stage.order}_step_${step.id}_trivia_${qIdx}_reward`;
      if (!localStorage.getItem(rewardKey)) {
        localStorage.setItem(rewardKey, "true");
        void postGamificationEvent({
          event_type: "lesson_complete",
          object_id: step.chapterId ?? `stage-${stage.id}-step-${step.id}`,
          idempotency_key: `trivia-mcq:${stage.id}:${step.id}:${qIdx}`,
        }).then((state) => {
          if (state) {
            onUpdateProfile({ ...profile, sovereigns: state.points });
          }
        });
        toast.success("Correct! XP awarded from server rules.");
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
    const step = stage.steps[currentStep - 1];
    const rewardKey = `stage_${stage.order}_step_${step.id}_trivia_${qIdx}_reward`;
    const q = step.trivia[qIdx];
    const optionIdx = q?.options?.length
      ? Math.max(0, q.options.indexOf(selectedReflectionOption))
      : 0;
    recordTriviaAnswer(qIdx, optionIdx >= 0 ? optionIdx : 0);
    setTriviaSubmitted(true);
    const rewardKey = `stage_${stage.id}_step_${step.id}_trivia_${qIdx}_reward`;
    if (!localStorage.getItem(rewardKey)) {
      localStorage.setItem(rewardKey, "true");
      void postGamificationEvent({
        event_type: "lesson_complete",
        object_id: step.chapterId ?? `stage-${stage.id}-step-${step.id}`,
        idempotency_key: `trivia-reflect:${stage.id}:${step.id}:${qIdx}`,
      }).then((state) => {
        if (state) {
          onUpdateProfile({ ...profile, sovereigns: state.points });
        }
      });
      toast.success("Reflection submitted! XP synced.");
    } else {
      toast.success("Reflection logged!");
    }
    autoAdvanceRef.current = setTimeout(() => handleNextTriviaQuestion(), 1500);
  };

  const handleNextTriviaQuestion = useCallback(() => {
    const step = stage.steps[currentStep - 1];
    if (activeTriviaIdx < step.trivia.length - 1) {
      setActiveTriviaIdx((prev) => prev + 1);
      setSelectedTriviaAnswer(null);
      setTriviaSubmitted(false);
      setReflectionText("");
      setSelectedReflectionOption("");
    } else {
      localStorage.setItem(`stage_${stage.order}_step_${step.id}_trivia_passed`, "true");
      setContentConsumed(true);
      toast.success("Step complete! ⭐");
      // Sync step progress and unlock next chapter on backend
      learnHubApi.markProgress({
        content_type: "article",
        content_id: `stage-${stage.order}-step-${step.id}`,
        progress_percent: Math.round((currentStep / stage.steps.length) * 100),
      }).catch(() => {});
      learnHubApi.completeChapter(step.id).catch(() => {});
      toast.success("Chapter check complete! ⭐");
      void (async () => {
        await submitServerTriviaIfReady(step, triviaAnswersByQuestion);
        await syncStepCompletion(step);
      })().catch(() => {});
      autoAdvanceRef.current = setTimeout(() => {
        setCurrentStep((prev) => {
          const nextVal = prev + 1;
          localStorage.setItem(`stage_${stage.order}_current_step`, nextVal.toString());
          return nextVal;
        });
      }, 2000);
    }
  }, [activeTriviaIdx, currentStep, stage.order, stage.steps]);

  const masteryAwardedKey = `stage_${stage.order}_mastery_awarded`;
  useEffect(() => {
    if (currentStep === stage.steps.length + 1) {
      if (!localStorage.getItem(masteryAwardedKey)) {
        localStorage.setItem(masteryAwardedKey, "true");
        const newProgress = profile.stageProgress ? [...profile.stageProgress] : [1];
        const nextStageId = stage.order + 1;
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
          sovereigns: profile.sovereigns + allStagesDoneBonus,
          stageProgress: newProgress,
          badges: newBadges,
          allStagesBonusEarned: allStagesDoneBonus > 0 ? true : profile.allStagesBonusEarned
        };
        onUpdateProfile(updatedProfile);

        void postGamificationEvent({
          event_type: "path_complete",
          object_id: stage.moduleId ?? `stage-${stage.id}`,
          idempotency_key: `path_complete:${stage.id}`,
        }).then((state) => {
          if (state) {
            onUpdateProfile({ ...updatedProfile, sovereigns: state.points });
          }
        });

        // Sync stage mastery to backend
        learnHubApi.markProgress({
          content_type: "path",
          content_id: `stage-${stage.order}`,
          progress_percent: 100,
        }).catch((err) => {
          toast.error(err instanceof Error ? err.message : "Could not sync stage mastery.");
        });

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
  const isCached = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bns_cached_stages") || "[]").includes(stage.order) : false;

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

  /* Progress dots helper */
  const totalSteps = stage.steps.length;
  const progressDots = () => {
    if (currentStep < 1 || currentStep > totalSteps) return null;
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "size-2 rounded-full transition-all duration-300",
              i + 1 === currentStep
                ? "bg-primary scale-125"
                : i + 1 < currentStep
                  ? "bg-emerald-500"
                  : "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background md:relative md:inset-auto md:z-auto md:h-full">

      {/* ── Compressed Header (48px) with inline sub-tab pills ── */}
      <header className="sticky top-0 z-10 w-full h-12 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 gap-2 shrink-0">
        {/* Left: breadcrumb (desktop) / back + logo (mobile) */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile back */}
          <button onClick={onClose} className="md:hidden shrink-0 flex items-center hover:opacity-80 transition-opacity" aria-label="Back">
            <img src="/logo.svg" alt="BNS" className="h-6 w-auto" />
          </button>
          {/* Desktop breadcrumb */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors font-medium shrink-0">
              Learn
            </button>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground truncate max-w-[200px]">{stage.title}</span>
            {currentStep > 0 && (
              <>
                <span className="text-border">/</span>
                <span className="text-primary font-semibold shrink-0">
                  Step {Math.min(currentStep, stage.steps.length)} of {stage.steps.length}
                </span>
              </>
            )}
          </nav>
          {/* Mobile stage title */}
          <div className="md:hidden flex items-center gap-1.5 min-w-0 border-l border-border pl-2">
            <span className="text-sm shrink-0">{stage.badge}</span>
            <h2 className="text-[10px] font-black uppercase tracking-tight truncate">{stage.title}</h2>
          </div>
        </div>

        {/* Right: sub-tab pills + close */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg">
            <button
              onClick={() => setActiveSubTab("learn")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                activeSubTab === "learn" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Guided Journey
            </button>
            <button
              onClick={() => setActiveSubTab("documents")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                activeSubTab === "documents" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Documents
            </button>
          </div>
          {isCached && (
            <span className="hidden sm:flex text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-extrabold px-1.5 py-0.5 rounded-full">
              📦 Cached
            </span>
          )}
          <Button size="icon-sm" variant="ghost" onClick={onClose} className="rounded-full" title="Close">
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {/* ── Body: full-width scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

        {activeSubTab === "learn" ? (
          <div className="space-y-6 max-w-4xl mx-auto">

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
                  <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
                </div>

                {stageStats && (
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl border border-border/50">
                    <div className="text-center">
                      <p className="font-black text-foreground text-sm">{stageStats.total_users}</p>
                      <p className="text-[10px] font-semibold">Learners</p>
                    </div>
                    {stageStats.avg_trivia_score != null && (
                      <div className="text-center">
                        <p className="font-black text-foreground text-sm">{stageStats.avg_trivia_score}</p>
                        <p className="text-[10px] font-semibold">Avg Score</p>
                      </div>
                    )}
                  </div>
                )}

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

                <Button onClick={handleStartLearning} className="w-full h-12 rounded-xl font-bold gap-2 text-sm bg-primary hover:bg-primary/95 transition-all shadow-md active:scale-[0.98]">
                  Start Learning Course <ArrowRight className="size-4" />
                </Button>
              </div>
            )}

            {/* STEP 1..N: GUIDED STEPS */}
            {currentStep >= 1 && currentStep <= stage.steps.length && (
              <div className="space-y-5 animate-in fade-in duration-300">

                {/* Step Progress Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Step {currentStep} of {stage.steps.length} · ~3 min remaining
                    </p>
                    <h3 className="text-base font-black text-foreground">
                      {stage.steps[currentStep - 1].title}
                    </h3>
                  </div>
                </div>
                <Progress value={((currentStep - 1) / stage.steps.length) * 100} className="h-1.5 rounded-full" />

                {/* Format Toggle: Watch / Read / Listen / Trivia pill */}
                <div className="inline-flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg overflow-x-auto">
                  {stage.steps[currentStep - 1].youtubeId && (
                    <button
                      onClick={() => setActiveFormat("video")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                        activeFormat === "video" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      🎥 Watch
                    </button>
                  )}
                  {stage.steps[currentStep - 1].audioUrl && (
                    <button
                      onClick={() => setActiveFormat("audio")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                        activeFormat === "audio" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      🎧 Listen
                    </button>
                  )}
                  <button
                    onClick={() => setActiveFormat("text")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                      activeFormat === "text" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    📖 Read
                  </button>
                  {stage.steps[currentStep - 1].trivia && stage.steps[currentStep - 1].trivia.length > 0 && (
                    <button
                      onClick={() => { setActiveFormat("trivia"); setShowTrivia(true); }}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                        activeFormat === "trivia" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                        isStepTriviaPassed(stage.steps[currentStep - 1].id) && activeFormat !== "trivia" && "text-emerald-500"
                      )}
                    >
                      💡 Check Knowledge {isStepTriviaPassed(stage.steps[currentStep - 1].id) && <CheckCircle2 className="size-3.5 inline" />}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveFormat("discuss")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                      activeFormat === "discuss" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    💬 Discuss
                  </button>
                </div>

                {/* Content Area */}
                {activeFormat !== "trivia" && activeFormat !== "discuss" && (
                  <>
                    {/* VIDEO FORMAT */}
                    {activeFormat === "video" && origin && (
                      <div className="max-w-[78%] mx-auto">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
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

                    {/* TEXT FORMAT */}
                    {activeFormat === "text" && (
                      <article className="
                        w-full max-w-none mx-auto px-4 py-6 md:px-8 md:py-8
                        prose prose-base prose-neutral dark:prose-invert max-w-none
                        prose-p:text-gray-800 prose-p:dark:text-gray-300
                        prose-p:leading-7 md:prose-p:leading-relaxed prose-p:my-3 md:prose-p:my-4
                        prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold
                        prose-strong:text-gray-900 dark:prose-strong:text-white
                        prose-ul:my-3 md:prose-ul:my-4 prose-li:my-1
                      ">
                        {getPersonalizedText(stage.steps[currentStep - 1].text)
                          .split("\n\n")
                          .map((para, pIdx) => (
                            <p key={pIdx} className="whitespace-pre-wrap">{para}</p>
                          ))}

                        {(() => {
                          const step = stage.steps[currentStep - 1];
                          const takeaway = step?.takeaways?.[0] || null;
                          if (!takeaway) return null;
                          if (takeaway.type === "info") {
                            return (
                              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400 not-prose">
                                <p className="text-xs font-bold text-blue-700 dark:text-blue-300">💡 {takeaway.title}</p>
                                <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">{takeaway.text}</p>
                              </div>
                            );
                          } else {
                            return (
                              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 dark:bg-amber-900/20 dark:border-amber-400 not-prose">
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">⚠️ {takeaway.title}</p>
                                <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 leading-normal">{takeaway.text}</p>
                              </div>
                            );
                          }
                        })()}
                      </article>
                    )}

                    {/* AUDIO FORMAT */}
                    {activeFormat === "audio" && stage.steps[currentStep - 1].audioUrl && (
                      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-card border border-border flex flex-col items-center space-y-4 shadow-sm">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Volume2 className="size-8" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">Audio Lesson</h4>
                        <audio 
                          controls 
                          className="w-full" 
                          src={stage.steps[currentStep - 1].audioUrl}
                          controlsList="nodownload"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </>
                )}

                {/* INLINE TRIVIA */}
                {activeFormat === "trivia" && (
                  <div className="space-y-4">
                    {isStepTriviaPassed(stage.steps[currentStep - 1]) ? (
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Sparkles className="size-4" />
                          <span className="text-xs font-black uppercase tracking-wide">
                            Quick Check {activeTriviaIdx + 1} of {stage.steps[currentStep - 1].trivia.length}
                          </span>
                        </div>
                        <button onClick={() => setTriviaSkipped(true)} className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
                          Skip for now
                        </button>
                      </div>

                      {(() => {
                        const step = stage.steps[currentStep - 1];
                        const q = step.trivia[activeTriviaIdx];
                        if (q.type === "multiple-choice") {
                          return (
                            <div className="space-y-3">
                              <h4 className="text-sm font-black text-foreground leading-snug">{q.question}</h4>

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
                                      disabled={triviaSubmitted}
                                      className={cn("w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]", optStyle)}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                              {triviaSubmitted && (
                                <div className={cn("p-3 rounded-xl border text-xs leading-normal animate-in zoom-in-95 duration-200",
                                  selectedTriviaAnswer === q.answer
                                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                                    : "border-destructive/20 bg-destructive/5 text-destructive"
                                )}>
                                  <h5 className="font-bold flex items-center gap-1.5 mb-1">
                                    {selectedTriviaAnswer === q.answer ? <><CheckCircle2 className="size-4 text-emerald-600" /> Correct!⭐</> : <><AlertCircle className="size-4 text-destructive" /> Not quite—try again</>}
                                  </h5>
                                  <p>{q.explanation}</p>
                                </div>
                              )}
                              {triviaSubmitted && (
                                selectedTriviaAnswer === q.answer ? (
                                  <Button onClick={handleNextTriviaQuestion} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5">
                                    {activeTriviaIdx < step.trivia.length - 1 ? <>Next Question <ArrowRight className="size-4" /></> : <>Complete Check <CheckCircle2 className="size-4" /></>}
                                  </Button>
                                ) : (
                                  <Button onClick={() => { setSelectedTriviaAnswer(null); setTriviaSubmitted(false); }} variant="outline" className="w-full h-10 rounded-xl font-bold text-xs">
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
                                      onClick={() => setSelectedReflectionOption(opt)}
                                      className={cn("w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all",
                                        selectedReflectionOption === opt ? "border-primary bg-primary/5 text-primary font-bold" : "border-border bg-card hover:bg-muted/40"
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
                                  value={selectedReflectionOption || reflectionText}
                                  onChange={(e) => { setReflectionText(e.target.value); setSelectedReflectionOption(""); }}
                                  disabled={triviaSubmitted}
                                  className="rounded-xl text-xs min-h-[80px]"
                                />
                              </div>
                              {!triviaSubmitted && (
                                <Button onClick={() => handleSubmitReflection(activeTriviaIdx)} className="w-full h-10 rounded-xl font-bold text-xs">
                                  Submit Reflection
                                </Button>
                              )}
                              {triviaSubmitted && (
                                <>
                                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 text-xs">
                                    <h5 className="font-bold flex items-center gap-1.5 mb-1"><CheckCircle2 className="size-4 text-emerald-600" /> Reflection Logged</h5>
                                    <p>Your civic opinion has been recorded.</p>
                                  </div>
                                  <Button onClick={handleNextTriviaQuestion} className="w-full h-10 rounded-xl font-bold text-xs gap-1.5">
                                    {activeTriviaIdx < step.trivia.length - 1 ? <>Next Question <ArrowRight className="size-4" /></> : <>Complete Check <CheckCircle2 className="size-4" /></>}
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
                )}

                {/* DISCUSS FORMAT */}
                {activeFormat === "discuss" && (
                  <div className="space-y-4 max-w-2xl mx-auto w-full">
                    {!activeThread ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm">Community Discussion</h4>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            value={newThreadTitle} 
                            onChange={(e) => setNewThreadTitle(e.target.value)} 
                            placeholder="Start a new discussion..." 
                            className="flex-1 h-10 px-3 rounded-xl border bg-card text-xs" 
                          />
                          <Button size="sm" className="h-10 rounded-xl" onClick={() => handleCreateThread(stage.steps[currentStep - 1].id)}>Post</Button>
                        </div>
                        {forumLoading ? (
                          <p className="text-xs text-muted-foreground text-center py-4">Loading discussions...</p>
                        ) : forumThreads.length > 0 ? (
                          <div className="space-y-2">
                            {forumThreads.map(thread => (
                              <button key={thread.id} onClick={() => loadThreadDetail(thread.id)} className="w-full text-left p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                                <h5 className="font-bold text-sm text-foreground">{thread.title}</h5>
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-semibold">
                                  <span className="flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary">{thread.author_initials}</span>
                                  <span>{thread.author_name}</span>
                                  <span>•</span>
                                  <span>{thread.posts_count} replies</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-dashed rounded-xl border-border bg-muted/10">
                            <MessageSquare className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-xs text-muted-foreground">No discussions yet. Be the first to start one!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setActiveThread(null)} className="text-xs font-bold text-muted-foreground hover:text-foreground">← Back</button>
                        </div>
                        <h4 className="font-black text-lg leading-tight">{activeThread.title}</h4>
                        <div className="space-y-3">
                          {activeThread.posts?.map((post: any) => (
                            <div key={post.id} className="p-4 rounded-xl border bg-card space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                <span className="flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary">{post.author_initials}</span>
                                <span>{post.author_name}</span>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">{post.content}</p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-border space-y-2">
                          <Textarea 
                            value={newPostContent} 
                            onChange={(e) => setNewPostContent(e.target.value)} 
                            placeholder="Write your reply..." 
                            className="min-h-[80px] text-xs rounded-xl"
                          />
                          <Button onClick={handleCreatePost} className="w-full h-10 rounded-xl text-xs font-bold gap-1.5"><Send className="size-3.5" /> Reply to Thread</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    <p className="text-primary font-bold flex items-center gap-1 text-sm"><Sparkles className="size-4 fill-primary" /> +25 SVG Points</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px]">CREDENTIAL ID:</span>
                    <p className="text-foreground font-mono text-[10px] mt-0.5">BNS-{stage.badgeName.toUpperCase()}-2026</p>
                  </div>
                </div>
                <Button
                  onClick={() => { if (hasNext && onNextStage) { onNextStage(); } else { onClose(); } }}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-primary hover:bg-primary/95 transition-all shadow-md"
                >
                  {hasNext ? "Continue to Next Stage" : "Finish Journey"}
                </Button>
              </div>
            )}

          </div>
        ) : (
          /* ── DOCUMENTS TAB ── */
          <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="font-black text-sm flex items-center gap-1.5">
                <FileCheck className="size-4.5 text-primary" /> Documents Repository
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Access official statutory and planning records. Filter historical archives and download PDFs for offline analysis.
              </p>
            </div>

            {apiLoading && (
              <div className="flex items-center justify-center py-4 gap-2 text-xs text-muted-foreground">
                <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Loading live API files...</span>
              </div>
            )}

            {stage.order === 1 && (
              <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setConstitutionTab("current")}
                  className={cn("py-1.5 rounded-lg transition-all", constitutionTab === "current" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                >
                  Current Document
                </button>
                <button
                  onClick={() => setConstitutionTab("timeline")}
                  className={cn("py-1.5 rounded-lg transition-all", constitutionTab === "timeline" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                >
                  <History className="inline size-3.5 mr-1" /> Historical Timeline
                </button>
              </div>
            )}

            {(stage.order !== 1 || constitutionTab === "current") && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Select Financial Year:</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {yearOptions.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => handleYearChange(yr)}
                      className={cn("px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 transition-all",
                        selectedYear === yr ? "bg-primary border-primary text-primary-foreground shadow-sm" : "bg-card border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {yr === 2010 && stage.order === 1 ? "2010 (Current)" : yr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage.order === 1 && constitutionTab === "timeline" ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-3 bg-muted/20 border border-border rounded-xl text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
                  <History className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Select a year on the timeline below to open its historical draft details, referendums context, and download PDFs.</span>
                </div>
                <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {CONSTITUTION_HISTORICAL_DOCS.map((doc) => {
                    const isDocSelected = selectedYear === doc.year;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleYearChange(doc.year)}
                        className={cn("relative cursor-pointer transition-all p-3 rounded-xl border",
                          isDocSelected ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-card hover:bg-muted/40"
                        )}
                      >
                        <div className={cn("absolute -left-[22px] top-[14px] size-3.5 rounded-full border-2 transition-all",
                          isDocSelected ? "bg-primary border-primary scale-110" : "bg-background border-muted-foreground/40"
                        )} />
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-foreground">{doc.title}</h4>
                          <span className="text-[9px] bg-muted border border-border px-1.5 py-0.5 rounded-full font-bold text-muted-foreground">{doc.year}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{doc.historicalContext || doc.description}</p>
                        {isDocSelected && (
                          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                            {doc.isAvailable ? (
                              <>
                                <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-primary/95 transition-all">📄 View PDF</a>
                                <a href={`${doc.pdfUrl}?download=1`} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/80 transition-all">
                                  <DownloadCloud className="size-3" /> Download
                                </a>
                              </>
                            ) : (
                              <div className="flex-1 flex flex-col space-y-2">
                                <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold px-2 py-1.5 rounded-lg text-center">⚠️ PDF Not Available (Archived)</span>
                                <Button size="xs" onClick={() => handleRequestDocument(doc.title, doc.year)} className="w-full text-[9px] font-bold">Request PDF Copy</Button>
                              </div>
                            )}
                            <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg font-bold hover:bg-muted/70">🔗 Source Portal</a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 border border-border bg-card rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground">Alert Subscriptions</h4>
                    <p className="text-[9px] text-muted-foreground">Subscribe to alerts when counties upload local updates.</p>
                  </div>
                  <Button size="sm" variant={isDocTracked ? "outline" : "default"} onClick={handleToggleTrackDoc} className="font-bold shrink-0 text-xs h-9 rounded-xl px-3">
                    {isDocTracked ? "Tracking" : "Track Stage"}
                  </Button>
                </div>

                {currentStageDocs.length > 0 ? (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <span>Auditable Documents ({currentStageDocs.length})</span>
                      <span>{selectedYear}</span>
                    </div>
                    {currentStageDocs.map((doc) => (
                      <div key={doc.id} className="p-4 border border-border bg-card rounded-xl space-y-3 shadow-xs animate-in slide-in-from-bottom-1 duration-200">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-black text-foreground truncate max-w-[200px] sm:max-w-xs">{doc.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")}</h4>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{doc.issuingBody} · {doc.financialYear}</p>
                          </div>
                          {doc.isCurrent && <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">Current</span>}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{doc.description}</p>
                        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/95 transition-all shadow-xs">📄 View</a>
                            <a href={doc.pdfUrl} download={doc.name}
                              className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-border bg-muted/20 text-foreground text-[10px] font-bold hover:bg-muted/50 transition-all">
                              <DownloadCloud className="size-3" /> Get
                            </a>
                            <button onClick={() => handleCopyShareLink(doc.pdfUrl)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-foreground transition-all" title="Share Document Link">
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
                  <div className="p-6 border border-dashed border-border bg-muted/15 rounded-xl text-center space-y-4">
                    <AlertCircle className="size-10 mx-auto text-muted-foreground/60" />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">No stage documents found for year {selectedYear}</h4>
                      <p className="text-[10px] text-muted-foreground max-w-xs mx-auto mt-1 leading-normal">The statutory document may not have been gazetted or uploaded for this financial year yet.</p>
                    </div>
                    <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
                      <Button size="sm" onClick={() => handleYearChange(2026)} className="rounded-xl text-xs font-bold">Reset to Current Year (2026)</Button>
                      <Button size="sm" variant="outline" onClick={() => handleRequestDocument(stage.documentName, selectedYear)} className="rounded-xl text-xs font-bold">Request Document from Authority</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Navigation footer: Back + Start on overview (step 0); Prev/Next on steps ── */}
      <footer className="z-10 flex h-14 shrink-0 items-center justify-center gap-4 border-t border-border bg-card px-4">
        {currentStep === 0 ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="min-w-[100px] gap-1 rounded-xl text-xs"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <span className="text-[9px] font-semibold text-muted-foreground">Overview</span>
            <Button
              size="sm"
              onClick={handleStartLearning}
              className="min-w-[100px] gap-1 rounded-xl text-xs"
            >
              Start <ArrowRight className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const nextVal = currentStep - 1;
                setCurrentStep(nextVal);
                localStorage.setItem(`stage_${stage.order}_current_step`, nextVal.toString());
                setShowTrivia(false);
              }}
              className="min-w-[100px] gap-1 rounded-xl text-xs"
            >
              <ArrowLeft className="size-4" /> Previous
            </Button>

            <div className="flex flex-col items-center gap-0.5">
              {progressDots()}
              <span className="text-[9px] font-semibold text-muted-foreground">
                {currentStep > stage.steps.length ? "Mastery" : `${currentStep} / ${stage.steps.length}`}
              </span>
            </div>

            {currentStep <= stage.steps.length ? (
              <Button
                size="sm"
                onClick={() => {
                  const nextVal = currentStep + 1;
                  setCurrentStep(nextVal);
                  localStorage.setItem(`stage_${stage.order}_current_step`, nextVal.toString());
                }}
                className="min-w-[100px] gap-1 rounded-xl text-xs"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (hasNext && onNextStage) {
                    onNextStage();
                  } else {
                    onClose();
                  }
                }}
                className="min-w-[100px] gap-1 rounded-xl text-xs"
              >
                Finish <CheckCircle2 className="size-4" />
              </Button>
            )}
          </>
        )}
      </footer>

    </div>
  );
}
