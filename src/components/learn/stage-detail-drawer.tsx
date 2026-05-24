"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";
import {
  Play, CheckCircle2, AlertCircle, Clock, ExternalLink,
  BookOpen, Trophy, ArrowRight, ArrowLeft, X, Sparkles, HelpCircle, RefreshCw,
  Volume2, VolumeX, FileText, Search, DownloadCloud
} from "lucide-react";

import { cn } from "@/utils";

interface Stage {
  id: number;
  title: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: "Published" | "Gazetted" | "Comment Open" | "Closed";
  chapters: {
    title: string;
    content: string;
  }[];
  videos: {
    title: string;
    duration: string;
    parts: number;
    youtubeId: string;
    transcript: string;
  }[];
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
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
  const [activeSubTab, setActiveSubTab] = useState<"video" | "article" | "quiz" | "tracker">("video");
  
  // Video status
  const [playingVideoIdx, setPlayingVideoIdx] = useState<number | null>(null);
  const [videoTimer, setVideoTimer] = useState(0); // tracks elapsed seconds watched
  const [videosCompleted, setVideosCompleted] = useState<boolean[]>([]);
  const [audioOnly, setAudioOnly] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  
  // YouTube API Player reference
  const playerRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const iframeId = `yt-player-${stage.id}`;

  // Article chapters read status
  const [readChapters, setReadChapters] = useState<boolean[]>([]);
  const [articleCompleted, setArticleCompleted] = useState(false);

  // Trivia states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0); // in seconds
  const [firstTry, setFirstTry] = useState(true);

  // Initial load for stage status
  useEffect(() => {
    // Reset states for current stage
    setPlayingVideoIdx(null);
    setVideoTimer(0);
    setAudioOnly(false);
    setShowTranscript(false);
    setTranscriptSearch("");
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setActiveSubTab("video");

    const vCompleted = stage.videos.map((_, i) => {
      return localStorage.getItem(`stage_${stage.id}_video_${i}`) === "true";
    });
    setVideosCompleted(vCompleted);

    const cRead = stage.chapters.map((_, i) => {
      return localStorage.getItem(`stage_${stage.id}_chapter_${i}`) === "true";
    });
    setReadChapters(cRead);
    setArticleCompleted(localStorage.getItem(`stage_${stage.id}_article`) === "true");

    const cooldownKey = `stage_${stage.id}_quiz_cooldown`;
    const storedCooldown = localStorage.getItem(cooldownKey);
    if (storedCooldown) {
      const diff = Math.floor((parseInt(storedCooldown) - Date.now()) / 1000);
      if (diff > 0) {
        setCooldownRemaining(diff);
      } else {
        setCooldownRemaining(0);
      }
    } else {
      setCooldownRemaining(0);
    }

    const attemptsKey = `stage_${stage.id}_quiz_attempts`;
    const attempts = parseInt(localStorage.getItem(attemptsKey) || "0");
    setFirstTry(attempts === 0);
  }, [stage.id, stage.videos, stage.chapters]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(`stage_${stage.id}_quiz_cooldown`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining, stage.id]);

  // Load YouTube Iframe API if not loaded
  useEffect(() => {
    if (playingVideoIdx === null) return;

    const loadYtScript = () => {
      if (document.getElementById("yt-iframe-api-script")) {
        initYtPlayer();
        return;
      }
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      // Bind callback
      (window as any).onYouTubeIframeAPIReady = () => {
        initYtPlayer();
      };
    };

    const initYtPlayer = () => {
      if (!(window as any).YT) return;
      
      // Cleanup previous player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }

      playerRef.current = new (window as any).YT.Player(iframeId, {
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
    };

    loadYtScript();

    return () => {
      stopWatchTimer();
    };
  }, [playingVideoIdx]);

  const startWatchTimer = () => {
    if (timerIntervalRef.current) return;
    timerIntervalRef.current = setInterval(() => {
      setVideoTimer((prev) => {
        // Enforce 90 seconds watch time (for demonstration / testing, speed up to complete at 90s, with a cheat button)
        if (prev >= 90) {
          stopWatchTimer();
          if (playingVideoIdx !== null) {
            handleVideoComplete(playingVideoIdx);
          }
          return 90;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopWatchTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleStartVideo = (idx: number) => {
    if (videosCompleted[idx]) {
      toast.info("You've already completed this video!");
      return;
    }
    setPlayingVideoIdx(idx);
    setVideoTimer(0);
  };

  const handleVideoComplete = (idx: number) => {
    setPlayingVideoIdx(null);
    stopWatchTimer();
    
    const newCompleted = [...videosCompleted];
    newCompleted[idx] = true;
    setVideosCompleted(newCompleted);
    localStorage.setItem(`stage_${stage.id}_video_${idx}`, "true");

    // Earn Sovereigns
    const earned = 10;
    const newSovereigns = profile.sovereigns + earned;
    
    // Check all 4 formats completed bonus (+15 SVG)
    let formatsBonus = 0;
    const allVideosDone = newCompleted.every(Boolean);
    const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
    const isQuizPassed = profile.badges?.includes(stage.badge);
    const formatsBonusKey = `stage_${stage.id}_formats_bonus_earned`;
    
    if (allVideosDone && articleCompleted && isDocTracked && isQuizPassed && !localStorage.getItem(formatsBonusKey)) {
      formatsBonus = 15;
      localStorage.setItem(formatsBonusKey, "true");
      toast.success("🔥 Stage Mastery: Completed all 4 formats! +15 Sovereigns Bonus!");
    }

    const updatedProfile = { 
      ...profile, 
      sovereigns: newSovereigns + formatsBonus 
    };
    onUpdateProfile(updatedProfile);
    toast.success(`Video Completed! +10 Sovereigns (SVG) earned.`);
  };

  const handleChapterRead = (idx: number) => {
    if (readChapters[idx]) return;
    const newRead = [...readChapters];
    newRead[idx] = true;
    setReadChapters(newRead);
    localStorage.setItem(`stage_${stage.id}_chapter_${idx}`, "true");

    // If all 4 chapters are read, complete the article format
    if (newRead.every(Boolean) && newRead.length === stage.chapters.length) {
      setArticleCompleted(true);
      localStorage.setItem(`stage_${stage.id}_article`, "true");
      
      const earned = 10;
      let formatsBonus = 0;
      const allVideosDone = videosCompleted.every(Boolean);
      const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
      const isQuizPassed = profile.badges?.includes(stage.badge);
      const formatsBonusKey = `stage_${stage.id}_formats_bonus_earned`;
      
      if (allVideosDone && isDocTracked && isQuizPassed && !localStorage.getItem(formatsBonusKey)) {
        formatsBonus = 15;
        localStorage.setItem(formatsBonusKey, "true");
        toast.success("🔥 Stage Mastery: Completed all 4 formats! +15 Sovereigns Bonus!");
      }

      const updatedProfile = { 
        ...profile, 
        sovereigns: profile.sovereigns + earned + formatsBonus 
      };
      onUpdateProfile(updatedProfile);
      toast.success(`Article Fully Read! +10 Sovereigns (SVG) earned.`);
    }
  };

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    if (quizSubmitted || cooldownRemaining > 0) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < stage.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    stage.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);

    const attemptsKey = `stage_${stage.id}_quiz_attempts`;
    const attempts = parseInt(localStorage.getItem(attemptsKey) || "0") + 1;
    localStorage.setItem(attemptsKey, attempts.toString());

    if (correctCount === stage.questions.length) {
      // 3/3 Mastery passed!
      const firstTryBonus = firstTry ? 10 : 0;
      const triviaPoints = 25 + firstTryBonus;
      let newSovereigns = profile.sovereigns + triviaPoints;

      // Add badge
      const newBadges = profile.badges ? [...profile.badges] : [];
      if (!newBadges.includes(stage.badge)) {
        newBadges.push(stage.badge);
      }

      // Unlock next stage progress
      const newProgress = [...profile.stageProgress];
      const nextStageId = stage.id + 1;
      if (nextStageId <= 8 && !newProgress.includes(nextStageId)) {
        newProgress.push(nextStageId);
      }

      // Check all 8 stages complete bonus (+100 SVG)
      let allStagesDoneBonus = 0;
      if (newProgress.length === 8 && newBadges.length === 8 && !profile.allStagesBonusEarned) {
        allStagesDoneBonus = 100;
        toast.success("🎉 Champion! Completed all 8 stages: +100 Sovereigns Bonus!");
      }

      // Check all 4 formats completed bonus (+15 SVG)
      const allVideosDone = videosCompleted.every(Boolean);
      const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
      let formatsBonus = 0;
      const formatsBonusKey = `stage_${stage.id}_formats_bonus_earned`;
      if (allVideosDone && articleCompleted && isDocTracked && !localStorage.getItem(formatsBonusKey)) {
        formatsBonus = 15;
        localStorage.setItem(formatsBonusKey, "true");
        toast.success("🔥 Stage Mastery: Completed all 4 formats! +15 Sovereigns Bonus!");
      }

      const updatedProfile = {
        ...profile,
        sovereigns: newSovereigns + allStagesDoneBonus + formatsBonus,
        stageProgress: newProgress,
        badges: newBadges,
        allStagesBonusEarned: allStagesDoneBonus > 0 ? true : profile.allStagesBonusEarned
      };

      onUpdateProfile(updatedProfile);
      toast.success(`Passed! Score: 3/3. Earned +${triviaPoints} SVG! ${stage.badge} Badge unlocked.`);
    } else {
      // Failed. Set 5 minute cooldown
      const cooldownTime = Date.now() + 5 * 60 * 1000;
      localStorage.setItem(`stage_${stage.id}_quiz_cooldown`, cooldownTime.toString());
      setCooldownRemaining(300);
      setFirstTry(false);
      toast.error(`Score: ${correctCount}/3. Mastery requires 3/3. 5-minute cooldown activated.`);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleResetCooldown = () => {
    localStorage.removeItem(`stage_${stage.id}_quiz_cooldown`);
    setCooldownRemaining(0);
    toast.success("Cooldown cleared! (Prototype testing shortcut)");
  };

  const handleCheatCompleteVideo = () => {
    if (playingVideoIdx !== null) {
      handleVideoComplete(playingVideoIdx);
    }
  };

  const handleToggleTrackDoc = () => {
    const tracked = profile.trackedDocs || [];
    let updatedTracked = [];

    if (tracked.includes(stage.documentName)) {
      updatedTracked = tracked.filter((d: string) => d !== stage.documentName);
      toast.info(`Stopped tracking ${stage.documentName}`);
    } else {
      updatedTracked = [...tracked, stage.documentName];
      toast.success(`Tracking ${stage.documentName}! You will receive alerts when counties upload files.`);

      // Check all 4 formats completed bonus (+15 SVG)
      const allVideosDone = videosCompleted.every(Boolean);
      const formatsBonusKey = `stage_${stage.id}_formats_bonus_earned`;
      const isQuizPassed = profile.badges?.includes(stage.badge);
      if (allVideosDone && articleCompleted && isQuizPassed && !localStorage.getItem(formatsBonusKey)) {
        const updatedProfile = {
          ...profile,
          trackedDocs: updatedTracked,
          sovereigns: profile.sovereigns + 15
        };
        localStorage.setItem(formatsBonusKey, "true");
        onUpdateProfile(updatedProfile);
        toast.success("🔥 Stage Mastery: Completed all 4 formats! +15 Sovereigns Bonus!");
        return;
      }
    }

    onUpdateProfile({
      ...profile,
      trackedDocs: updatedTracked
    });
  };

  const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
  const isCached = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bns_cached_stages") || "[]").includes(stage.id) : false;
  
  // Articles sequential read requirement: Trivia locks until all chapters read
  const allChaptersRead = readChapters.length > 0 && readChapters.every(Boolean);

  // Filtered transcript text search
  const activeVideo = playingVideoIdx !== null ? stage.videos[playingVideoIdx] : null;
  const filteredTranscript = activeVideo
    ? activeVideo.transcript.split("\n").filter(line => 
        line.toLowerCase().includes(transcriptSearch.toLowerCase())
      ).join("\n")
    : "";

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:max-w-xl md:mx-auto md:border-x border-border shadow-2xl">
      
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

      {/* Sub Tabs Navigation */}
      <div className="grid grid-cols-4 border-b border-border bg-muted/30">
        <button
          onClick={() => setActiveSubTab("video")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 ${activeSubTab === "video" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
        >
          <Play className="size-4" />
          <span>Videos</span>
        </button>
        <button
          onClick={() => setActiveSubTab("article")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 ${activeSubTab === "article" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
        >
          <BookOpen className="size-4" />
          <span>Article</span>
        </button>
        <button
          onClick={() => setActiveSubTab("quiz")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 ${activeSubTab === "quiz" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          title={!allChaptersRead ? "Chapters must be read first" : undefined}
        >
          <Trophy className="size-4" />
          <span>Trivia Gate</span>
        </button>
        <button
          onClick={() => setActiveSubTab("tracker")}
          className={`py-3 text-xs font-bold border-b-2 flex flex-col items-center gap-1 ${activeSubTab === "tracker" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
        >
          <Sparkles className="size-4" />
          <span>Tracker</span>
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* TAB 1: REAL YOUTUBE PLAYER */}
        {activeSubTab === "video" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm">🎥 Real Video Playlist</h3>
              <p className="text-[11px] text-muted-foreground">Watch our official channel budget guide lessons. Each video requires a 90-second min-watch time before completing.</p>
            </div>

            {playingVideoIdx !== null ? (
              <div className="space-y-4 p-4 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary truncate max-w-[200px]">{stage.videos[playingVideoIdx].title}</span>
                  <div className="flex items-center gap-2">
                    {/* Audio Only Mode Toggle */}
                    <button
                      onClick={() => setAudioOnly(!audioOnly)}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${audioOnly ? 'bg-primary/10 border-primary/20 text-primary' : 'border-border text-muted-foreground'}`}
                      title="Audio-only mode for low bandwidth"
                    >
                      {audioOnly ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                      <span className="hidden sm:inline">Audio Only</span>
                    </button>
                  </div>
                </div>

                {/* 16:9 Responsive Video player */}
                <div className={cn(
                  "relative aspect-video rounded-xl overflow-hidden bg-black",
                  audioOnly && "h-16 flex items-center justify-center bg-muted"
                )}>
                  {audioOnly ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Volume2 className="size-6 text-primary animate-pulse" />
                      <span className="text-[10px] text-muted-foreground mt-1">Audio-Only Mode Active (Bandwidth Saved)</span>
                    </div>
                  ) : (
                    <iframe
                      id={iframeId}
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${stage.videos[playingVideoIdx].youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                      title="Budget Ndio Story YouTube player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>

                {/* Min Watch Timer Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">Watch Duration required:</span>
                    <span className={videoTimer >= 90 ? "text-primary font-bold" : "text-muted-foreground animate-pulse"}>
                      {videoTimer}s / 90s
                    </span>
                  </div>
                  <Progress value={(videoTimer / 90) * 100} className="h-2 rounded-full" />
                </div>

                {/* Review Shortcut Helper */}
                <div className="flex flex-wrap gap-2 pt-2 justify-between">
                  <Button size="xs" variant="outline" onClick={handleCheatCompleteVideo} className="gap-1 text-xs text-muted-foreground">
                    ⏩ Complete Video (Shortcut)
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setPlayingVideoIdx(null)} className="text-destructive font-semibold">
                    Close Player
                  </Button>
                </div>

                {/* Accessible Transcript section */}
                <div className="border-t border-border pt-3 space-y-2">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="text-xs font-bold text-primary flex items-center gap-1 underline"
                  >
                    <FileText className="size-3.5" />
                    <span>{showTranscript ? "Hide Searchable Transcript" : "Show Searchable Transcript"}</span>
                  </button>

                  {showTranscript && (
                    <div className="space-y-2 border border-border/80 bg-muted/20 p-3 rounded-xl">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search transcript lines..."
                          value={transcriptSearch}
                          onChange={(e) => setTranscriptSearch(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-card text-xs focus-visible:outline-none"
                        />
                      </div>
                      <div className="max-h-28 overflow-y-auto font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-foreground/80 scrollbar-thin">
                        {filteredTranscript || "No matching transcript lines found."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {stage.videos.map((video, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${videosCompleted[idx] ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Part {idx + 1}</span>
                      <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{video.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {video.duration} min
                      </p>
                    </div>

                    {videosCompleted[idx] ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-primary shrink-0">
                        <CheckCircle2 className="size-4" /> Watched
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartVideo(idx)}
                        className="rounded-xl font-bold shrink-0 gap-1.5"
                      >
                        <Play className="size-3.5 fill-current" /> Watch
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARTICLE */}
        {activeSubTab === "article" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm">📝 BNS Explainer (Chapters)</h3>
              <p className="text-[11px] text-muted-foreground">Read each chapter of our guide. All 4 chapters must be read to unlock the Trivia Gate.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2 border-none">
              {stage.chapters.map((ch, idx) => {
                let contentText = ch.content;
                if (idx === 1 && profile.county) {
                  contentText = contentText.replace("[Selected County]", profile.county);
                }

                return (
                  <AccordionItem
                    key={idx}
                    value={`ch-${idx}`}
                    className="border border-border bg-card rounded-xl overflow-hidden px-4 py-0"
                  >
                    <AccordionTrigger
                      onClick={() => handleChapterRead(idx)}
                      className="hover:no-underline py-4 text-xs font-bold text-left flex justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {readChapters[idx] ? (
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                        ) : (
                          <div className="size-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        )}
                        <span>Chapter {idx + 1}: {ch.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs leading-relaxed text-foreground/80 border-t border-border pt-4 pb-4">
                      {contentText}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {articleCompleted && (
              <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>You've completed reading the BNS Article chapters! +10 SVG awarded.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRIVIA GATE */}
        {activeSubTab === "quiz" && (
          <div className="space-y-4">
            
            {/* sequential gate: read chapters first */}
            {!allChaptersRead ? (
              <div className="p-6 border border-border bg-card rounded-xl text-center space-y-4">
                <AlertCircle className="size-12 mx-auto text-muted-foreground/60" />
                <h4 className="font-bold text-sm">Trivia Gate Locked</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You must read all 4 chapters of the stage's **BNS Article** before the Trivia Gate opens. Complete the reading first!
                </p>
                <Button size="sm" onClick={() => setActiveSubTab("article")} className="rounded-xl">
                  Go to Article
                </Button>
              </div>
            ) : cooldownRemaining > 0 ? (
              <div className="p-5 rounded-xl border border-destructive/20 bg-destructive/5 text-center space-y-3">
                <Clock className="size-8 mx-auto text-destructive animate-pulse" />
                <h4 className="font-bold text-sm text-destructive">Cooldown Lock active</h4>
                <p className="text-xs text-muted-foreground">
                  Mastery quiz failed. Cooldown active to encourage review.
                </p>
                <div className="text-2xl font-black text-destructive">
                  {Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s
                </div>
                <div className="pt-2 flex justify-center gap-2">
                  <Button size="xs" variant="outline" onClick={handleResetCooldown} className="gap-1 text-xs text-muted-foreground">
                    <RefreshCw className="size-3" /> Clear Cooldown (Debug)
                  </Button>
                </div>
              </div>
            ) : profile.badges?.includes(stage.badge) ? (
              <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-3">
                <Trophy className="size-12 mx-auto text-primary" />
                <h4 className="font-bold text-base">Stage Mastered!</h4>
                <p className="text-xs text-muted-foreground">
                  You scored 3/3 and unlocked the **{stage.badgeName}** badge.
                </p>
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  {stage.badge} Unlocked
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" onClick={handleResetQuiz} className="rounded-xl font-bold">
                    Re-Attempt Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Trophy className="size-4.5 text-primary" /> Trivia Gate
                  </h3>
                  <p className="text-xs text-muted-foreground">Answer 3 questions to unlock the next stage. 3/3 score is required!</p>
                </div>

                {stage.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2.5 p-4 rounded-xl border border-border bg-card">
                    <h4 className="text-xs font-bold flex gap-1.5">
                      <span className="text-primary">{qIdx + 1}.</span>
                      <span>{q.question}</span>
                    </h4>
                    <div className="grid gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = q.answer === oIdx;
                        
                        let optionStyle = "border-border bg-muted/10";
                        if (isSelected) {
                          if (quizSubmitted) {
                            optionStyle = isCorrect
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "border-destructive bg-destructive/10 text-destructive";
                          } else {
                            optionStyle = "border-primary bg-primary/5 text-primary";
                          }
                        } else if (quizSubmitted && isCorrect) {
                          optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            disabled={quizSubmitted}
                            className={`w-full p-3 text-xs font-semibold text-left rounded-xl border transition-all hover:bg-muted/30 ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {quizSubmitted ? (
                  <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span>Quiz Results:</span>
                      <span className={quizScore === 3 ? "text-emerald-600" : "text-destructive"}>
                        {quizScore} / 3 Correct
                      </span>
                    </div>
                    {quizScore < 3 && (
                      <p className="text-muted-foreground leading-relaxed">
                        Mastery requires 3/3. Take this cooldown to review the article chapters and video links.
                      </p>
                    )}
                    {quizScore === 3 ? (
                      <div className="pt-2 text-center text-emerald-600 font-bold">
                        🎉 Passed! Score: 3/3. Badge unlocked.
                      </div>
                    ) : (
                      <Button onClick={handleResetQuiz} variant="outline" className="w-full rounded-xl h-11 font-bold">
                        Try again (after cooldown)
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button onClick={handleSubmitQuiz} className="w-full rounded-xl h-11 font-bold">
                    Submit Trivia Attempt
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOCUMENT TRACKER */}
        {activeSubTab === "tracker" && (
          <div className="space-y-4">
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
          </div>
        )}
      </div>

      {/* 🧭 Sequential Navigation Footer (Mobile-First Journey Flow) */}
      <footer className="sticky bottom-0 inset-x-0 h-16 border-t border-border bg-card flex items-center justify-between px-4 gap-2 z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevStage}
          disabled={!hasPrev}
          className="rounded-xl flex-1 gap-1"
        >
          <ArrowLeft className="size-4" /> Prev Stage
        </Button>

        <span className="text-[10px] font-black text-muted-foreground shrink-0 uppercase tracking-widest">
          Stage {stage.id} / 8
        </span>

        <Button
          size="sm"
          onClick={onNextStage}
          disabled={!hasNext || !profile.badges?.includes(stage.badge)}
          className="rounded-xl flex-1 gap-1"
        >
          Next Stage <ArrowRight className="size-4" />
        </Button>
      </footer>
    </div>
  );
}
