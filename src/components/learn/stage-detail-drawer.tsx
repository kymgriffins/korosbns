"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";
import { Textarea } from "@/ui/textarea";
import {
  Play, Pause, CheckCircle2, AlertCircle, Clock, ExternalLink,
  BookOpen, Trophy, ArrowRight, ArrowLeft, X, Sparkles, HelpCircle, RefreshCw,
  Volume2, VolumeX, FileText, Search, DownloadCloud, Award, Lock, FileCheck
} from "lucide-react";
import { cn } from "@/utils";

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
  // Tabs Navigation: learn (Guided Journey) or documents (Tracker)
  const [activeSubTab, setActiveSubTab] = useState<"learn" | "documents">("learn");

  // Step state (0: Overview, 1..N: Steps, N+1: Mastery)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Active delivery format
  const [activeFormat, setActiveFormat] = useState<"video" | "audio" | "text">("video");

  // Video watch timer
  const [videoTimer, setVideoTimer] = useState<number>(0);

  // Simulated audio player
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioTimer, setAudioTimer] = useState<number>(0);
  const audioIntervalRef = useRef<any>(null);

  // Gating & completion flag for current step
  const [contentConsumed, setContentConsumed] = useState<boolean>(false);

  // Trivia Dialog state
  const [showTriviaDialog, setShowTriviaDialog] = useState<boolean>(false);
  const [activeTriviaIdx, setActiveTriviaIdx] = useState<number>(0);
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState<boolean>(false);
  const [triviaCooldown, setTriviaCooldown] = useState<number>(0);
  const [reflectionText, setReflectionText] = useState<string>("");

  // Search inside transcript
  const [transcriptSearch, setTranscriptSearch] = useState<string>("");
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // YouTube references
  const playerRef = useRef<any>(null);
  const videoTimerRef = useRef<any>(null);
  const iframeId = `yt-player-${stage.id}-${currentStep}`;

  // Load state when stage.id changes
  useEffect(() => {
    setActiveSubTab("learn");
    
    const storedStep = localStorage.getItem(`stage_${stage.id}_current_step`);
    const initialStep = storedStep ? parseInt(storedStep, 10) : 0;
    setCurrentStep(initialStep);
    
    // reset format and tracking states
    setActiveFormat("video");
    setVideoTimer(0);
    setAudioPlaying(false);
    setAudioTimer(0);
    setContentConsumed(false);
    setShowTriviaDialog(false);
    setActiveTriviaIdx(0);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
    setTriviaCooldown(0);
    setReflectionText("");
    setTranscriptSearch("");
    setShowTranscript(false);
  }, [stage.id]);

  // Load state when currentStep or stage.id changes
  useEffect(() => {
    if (currentStep < 1 || currentStep > stage.steps.length) {
      setVideoTimer(0);
      setAudioTimer(0);
      setAudioPlaying(false);
      setContentConsumed(false);
      return;
    }

    const step = stage.steps[currentStep - 1];
    
    // Check if trivia is already passed
    const triviaPassed = localStorage.getItem(`stage_${stage.id}_step_${step.id}_trivia_passed`) === "true";
    setContentConsumed(triviaPassed);
    
    // Reset step states
    setVideoTimer(0);
    setAudioTimer(0);
    setAudioPlaying(false);
    setActiveTriviaIdx(0);
    setSelectedTriviaAnswer(null);
    setTriviaSubmitted(false);
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

  // Simulated audio player ticking
  useEffect(() => {
    if (audioPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioTimer((prev) => {
          if (prev >= 15) {
            clearInterval(audioIntervalRef.current);
            setAudioPlaying(false);
            setContentConsumed(true);
            toast.success("🎧 Simulated audio lesson completed! You can now take the step trivia.");
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [audioPlaying]);

  // YouTube Iframe Player API loading and handling
  useEffect(() => {
    if (activeSubTab !== "learn" || currentStep < 1 || currentStep > stage.steps.length) return;
    const step = stage.steps[currentStep - 1];
    if (activeFormat !== "video" || !step.youtubeId) return;

    let player: any = null;

    const initYtPlayer = () => {
      if (!(window as any).YT || !(window as any).YT.Player) return;
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }

      player = new (window as any).YT.Player(iframeId, {
        events: {
          onStateChange: (event: any) => {
            // event.data: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              startWatchTimer();
            } else {
              stopWatchTimer();
            }
          }
        }
      });
      playerRef.current = player;
    };

    const loadYtScript = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        initYtPlayer();
        return;
      }
      if (document.getElementById("yt-iframe-api-script")) {
        const checkYt = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkYt);
            initYtPlayer();
          }
        }, 100);
        return;
      }
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        initYtPlayer();
      };
    };

    loadYtScript();

    return () => {
      stopWatchTimer();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.error("Error destroying player on cleanup:", e);
        }
      }
    };
  }, [currentStep, activeFormat, activeSubTab, stage.id]);

  const startWatchTimer = () => {
    if (videoTimerRef.current) return;
    videoTimerRef.current = setInterval(() => {
      setVideoTimer((prev) => {
        if (prev >= 90) {
          stopWatchTimer();
          setContentConsumed(true);
          toast.success("🎥 Video watch completed! You can now take the step trivia.");
          return 90;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopWatchTimer = () => {
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
  };

  // Skip timer and complete content for video
  const handleCheatCompleteVideo = () => {
    stopWatchTimer();
    setVideoTimer(90);
    setContentConsumed(true);
    toast.success("⏩ Video watch completed (Debug Shortcut)!");
  };

  // Skip timer and complete content for audio
  const handleCheatCompleteAudio = () => {
    setAudioTimer(15);
    setAudioPlaying(false);
    setContentConsumed(true);
    toast.success("⏩ Audio listen completed (Debug Shortcut)!");
  };

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
      setShowTriviaDialog(false);
      toast.success("Step Trivia Passed! Next Step unlocked.");
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

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:max-w-xl md:mx-auto md:border-x border-border shadow-2xl overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-10 w-full h-14 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl flex items-center">{stage.badge}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black tracking-tight uppercase leading-none">{stage.title}</h2>
              {isCached && (
                <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-extrabold px-1 rounded-full flex items-center gap-0.5">
                  📶 Cached
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stage.badgeName} Badge</p>
          </div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onClose} className="rounded-full">
          <X className="size-5" />
        </Button>
      </header>

      {/* Sub Tabs Navigation: Exactly Two Tabs */}
      <div className="grid grid-cols-2 border-b border-border bg-muted/30">
        <button
          onClick={() => setActiveSubTab("learn")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 transition-all ${activeSubTab === "learn" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
        >
          <BookOpen className="size-4" />
          <span>Learn (Guided Journey)</span>
        </button>
        <button
          onClick={() => setActiveSubTab("documents")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 transition-all ${activeSubTab === "documents" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
        >
          <FileCheck className="size-4" />
          <span>Documents (Tracker)</span>
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 relative">
        
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

                {/* Format Toggle Group */}
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
                  {activeFormat === "video" && (
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe
                          id={iframeId}
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${stage.steps[currentStep - 1].youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                          title="Budget Ndio Story Step Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-muted-foreground">Watch requirement:</span>
                          <span className={videoTimer >= 90 ? "text-primary font-bold" : "text-muted-foreground animate-pulse"}>
                            {videoTimer}s / 90s
                          </span>
                        </div>
                        <Progress value={(videoTimer / 90) * 100} className="h-1.5 rounded-full" />
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border">
                        <Button size="xs" variant="outline" onClick={handleCheatCompleteVideo} className="text-[10px] text-muted-foreground font-semibold gap-1">
                          ⏩ Complete Watch (Shortcut)
                        </Button>
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
                        
                        <div className="w-full flex items-center gap-3">
                          <Button
                            size="icon-sm"
                            onClick={() => setAudioPlaying(!audioPlaying)}
                            className="rounded-full shadow-xs shrink-0"
                          >
                            {audioPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                          </Button>
                          <div className="flex-1 space-y-1">
                            <Progress value={(audioTimer / 15) * 100} className="h-1.5 rounded-full" />
                            <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                              <span>0:{audioTimer.toString().padStart(2, '0')}</span>
                              <span>0:15</span>
                            </div>
                          </div>
                        </div>

                        <Button size="xs" variant="outline" onClick={handleCheatCompleteAudio} className="text-[10px] text-muted-foreground font-semibold gap-1">
                          ⏩ Complete Audio (Shortcut)
                        </Button>
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
                    <div className="space-y-4">
                      <div className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans bg-muted/10 p-2 rounded-lg max-h-60 overflow-y-auto border border-border/40">
                        {getPersonalizedText(stage.steps[currentStep - 1].text)}
                      </div>
                      <div className="border-t border-border pt-3 flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => setContentConsumed(true)}
                          className="rounded-xl font-black text-xs gap-1"
                        >
                          I've Read This Chapter <CheckCircle2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Gated Step Progress */}
                <div className="mt-4">
                  {isStepTriviaPassed(stage.steps[currentStep - 1].id) ? (
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-bold">Step Trivia Completed!</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        You've unlocked this step's trivia gates and earned sovereigns. Tap the footer button to progress.
                      </p>
                    </div>
                  ) : contentConsumed ? (
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="size-5 text-primary shrink-0" />
                        <h4 className="text-xs font-bold text-foreground">Step Trivia Unlocked!</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Lesson materials consumed successfully. Take the short trivia check to unlock the next guided step.
                      </p>
                      <Button
                        onClick={() => {
                          setActiveTriviaIdx(0);
                          setSelectedTriviaAnswer(null);
                          setTriviaSubmitted(false);
                          setReflectionText("");
                          setShowTriviaDialog(true);
                        }}
                        className="w-full h-10 rounded-xl font-bold text-xs gap-1.5"
                      >
                        <Sparkles className="size-4" /> Start Step Trivia Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-muted-foreground/15 bg-muted/20 flex items-start gap-3">
                      <Lock className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-muted-foreground">Lesson Gated</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          Consume the step lesson material above using any format (Video/Audio/Text) to open the trivia challenge.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STAGE MASTERY PAGE */}
            {currentStep === stage.steps.length + 1 && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 animate-in zoom-in-95 duration-500">
                <div className="relative">
                  {/* Glowing halo */}
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
            {/* STATUTORY DOCUMENT TRACKER TAB */}
            <div className="space-y-1">
              <h3 className="font-bold text-sm">📄 Statutory Tracker</h3>
              <p className="text-[11px] text-muted-foreground">Verify official sources, review historical archives, and subscribe to county comment windows.</p>
            </div>

            <div className="p-4 border border-border bg-card rounded-xl space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-sm">{stage.documentName}</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Auditable Official Document</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${stage.status === 'Comment Open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-muted border-border text-muted-foreground'}`}>
                  {stage.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground font-semibold">Official Link:</span>
                  <a
                    href={stage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline font-bold mt-1"
                  >
                    Source Portal <ExternalLink className="size-3" />
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold">Historical Archive:</span>
                  <p className="font-bold text-foreground mt-1">{stage.archive} → 2026</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={handleToggleTrackDoc}
                  variant={isDocTracked ? "outline" : "default"}
                  className="w-full rounded-xl h-11 font-bold gap-2"
                >
                  {isDocTracked ? (
                    <>
                      <CheckCircle2 className="size-4 text-primary" /> Stop Tracking Document
                    </>
                  ) : (
                    <>
                      <Clock className="size-4" /> Track This Document
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Tracking adds this statutory template to your alert queue to notify you when your county opens comments.
                </p>
              </div>
            </div>

            {/* Custom local BPS PDF file embed for BPS Stage */}
            {stage.id === 2 && (
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <div>
                    <h4 className="text-xs font-bold">2026 BPS Summary Document</h4>
                    <p className="text-[10px] text-muted-foreground">Local PDF Document</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Read the official 2026 Budget Policy Statement Summary. This file contains division of revenue formulas, tax reform directions, and MSME Hustler Fund ceilings.
                </p>
                <a
                  href="/BPS_2026_Summary.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 px-4 h-11 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-xs hover:bg-primary/95 transition-all"
                >
                  <DownloadCloud className="size-4" /> Open BPS 2026 Summary PDF
                </a>
              </div>
            )}

          </div>
        )}
      </div>

      {/* POPUP TRIVIA MODAL DIALOG */}
      {showTriviaDialog && currentStep >= 1 && currentStep <= stage.steps.length && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col p-4 overflow-y-auto animate-in slide-in-from-bottom duration-300">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-primary">
              <Trophy className="size-4.5" />
              <span className="text-xs font-black uppercase">
                Challenge {activeTriviaIdx + 1} of {stage.steps[currentStep - 1].trivia.length}
              </span>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setShowTriviaDialog(false)}
              className="rounded-full"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 space-y-5">
            {(() => {
              const step = stage.steps[currentStep - 1];
              const q = step.trivia[activeTriviaIdx];
              
              if (q.type === "multiple-choice") {
                return (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-foreground">{q.question}</h4>

                    {/* Cooldown Timer Alert */}
                    {triviaCooldown > 0 && (
                      <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-xl text-center space-y-2">
                        <Clock className="size-5 text-destructive mx-auto animate-pulse" />
                        <p className="text-[11px] font-bold text-destructive">Anti-guessing Cooldown Active</p>
                        <p className="text-[10px] text-muted-foreground">Please review the chapter text. Lock releases in:</p>
                        <div className="text-lg font-black text-destructive font-mono">
                          {Math.floor(triviaCooldown / 60)}m {triviaCooldown % 60}s
                        </div>
                        <Button size="xs" variant="outline" onClick={handleClearCooldown} className="text-[9px] text-muted-foreground gap-1">
                          <RefreshCw className="size-3" /> Clear Cooldown (Debug Bypass)
                        </Button>
                      </div>
                    )}

                    {/* MCQ Options */}
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

                    {/* Explanatory Context Card */}
                    {triviaSubmitted && (
                      <div className={cn(
                        "p-4 rounded-xl border text-xs leading-normal animate-in zoom-in-95 duration-200",
                        selectedTriviaAnswer === q.answer
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                          : "border-destructive/20 bg-destructive/5 text-destructive"
                      )}>
                        <h5 className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                          {selectedTriviaAnswer === q.answer ? (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-600" /> Lesson Mastered!
                            </>
                          ) : (
                            <>
                              <AlertCircle className="size-4 text-destructive" /> Incorrect Choice
                            </>
                          )}
                        </h5>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              } else {
                
                // REFLECTION QUESTION
                return (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-foreground">{q.question}</h4>

                    {q.options && q.options.length > 0 && (
                      <div className="grid gap-2">
                        {q.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReflectionText(opt)}
                            className={cn(
                              "w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all active:scale-[0.99]",
                              reflectionText === opt ? "border-primary bg-primary/5 text-primary font-bold" : "border-border bg-card"
                            )}
                            disabled={triviaSubmitted}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Sentiment Reflection:</label>
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
                        className="w-full h-11 rounded-xl font-bold text-xs"
                      >
                        Submit Reflection
                      </Button>
                    )}

                    {triviaSubmitted && (
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 text-xs leading-normal animate-in zoom-in-95 duration-200">
                        <h5 className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                          <CheckCircle2 className="size-4 text-emerald-600" /> Reflection Logged
                        </h5>
                        <p>Thank you! Your civic opinion has been recorded to generate hyper-local public memoranda feedback.</p>
                      </div>
                    )}
                  </div>
                );
              }
            })()}
          </div>

          {/* Modal Action Footer */}
          <div className="border-t border-border pt-4 mt-6">
            {triviaSubmitted ? (
              selectedTriviaAnswer === stage.steps[currentStep - 1].trivia[activeTriviaIdx].answer ||
              stage.steps[currentStep - 1].trivia[activeTriviaIdx].type === "reflection" ? (
                <Button
                  onClick={handleNextTriviaQuestion}
                  className="w-full h-11 rounded-xl font-bold text-xs gap-1.5 text-primary-foreground bg-primary"
                >
                  {activeTriviaIdx < stage.steps[currentStep - 1].trivia.length - 1 ? (
                    <>
                      Next Challenge <ArrowRight className="size-4" />
                    </>
                  ) : (
                    <>
                      Complete Trivia Check <CheckCircle2 className="size-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedTriviaAnswer(null);
                    setTriviaSubmitted(false);
                  }}
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold text-xs"
                  disabled={triviaCooldown > 0}
                >
                  Try Challenge Again
                </Button>
              )
            ) : (
              <p className="text-[10px] text-muted-foreground text-center">
                Answer this query correctly to unlock progress.
              </p>
            )}
          </div>

        </div>
      )}

      {/* 🧭 Sequential Navigation Footer (Mobile-First Journey Flow) */}
      {currentStep > 0 && (
        <footer className="sticky bottom-0 inset-x-0 h-16 border-t border-border bg-card flex items-center justify-between px-4 gap-2 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const nextVal = currentStep - 1;
              setCurrentStep(nextVal);
              localStorage.setItem(`stage_${stage.id}_current_step`, nextVal.toString());
            }}
            className="rounded-xl flex-1 gap-1 text-xs"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          <span className="text-[10px] font-black text-muted-foreground shrink-0 uppercase tracking-widest">
            {currentStep > stage.steps.length ? "Mastery" : `Step ${currentStep} / ${stage.steps.length}`}
          </span>

          {currentStep <= stage.steps.length ? (
            <Button
              size="sm"
              onClick={() => {
                const nextVal = currentStep + 1;
                setCurrentStep(nextVal);
                localStorage.setItem(`stage_${stage.id}_current_step`, nextVal.toString());
              }}
              disabled={!isStepTriviaPassed(stage.steps[currentStep - 1].id)}
              className="rounded-xl flex-1 gap-1 text-xs"
            >
              Next <ArrowRight className="size-4" />
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
              className="rounded-xl flex-1 gap-1 text-xs"
            >
              Finish <CheckCircle2 className="size-4" />
            </Button>
          )}
        </footer>
      )}
    </div>
  );
}
