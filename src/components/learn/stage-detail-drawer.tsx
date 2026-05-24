"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { toast } from "sonner";
import {
  Play, CheckCircle2, AlertCircle, Clock, ExternalLink,
  BookOpen, Trophy, ArrowRight, X, Sparkles, HelpCircle, RefreshCw
} from "lucide-react";

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
}

export function StageDetailDrawer({ stage, profile, onClose, onUpdateProfile }: StageDetailDrawerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"video" | "article" | "quiz" | "tracker">("video");
  
  // Video status
  const [playingVideoIdx, setPlayingVideoIdx] = useState<number | null>(null);
  const [videoTimer, setVideoTimer] = useState(0);
  const [videosCompleted, setVideosCompleted] = useState<boolean[]>(
    stage.videos.map((_, i) => {
      const stageKey = `stage_${stage.id}_video_${i}`;
      return typeof window !== "undefined" ? localStorage.getItem(stageKey) === "true" : false;
    })
  );
  
  // Article chapters read status
  const [readChapters, setReadChapters] = useState<boolean[]>(
    stage.chapters.map((_, i) => {
      const stageKey = `stage_${stage.id}_chapter_${i}`;
      return typeof window !== "undefined" ? localStorage.getItem(stageKey) === "true" : false;
    })
  );
  const [articleCompleted, setArticleCompleted] = useState(
    typeof window !== "undefined" ? localStorage.getItem(`stage_${stage.id}_article`) === "true" : false
  );

  // Trivia states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0); // in seconds
  const [firstTry, setFirstTry] = useState(true);

  // Load cooldown and first-try status
  useEffect(() => {
    const cooldownKey = `stage_${stage.id}_quiz_cooldown`;
    const storedCooldown = localStorage.getItem(cooldownKey);
    if (storedCooldown) {
      const diff = Math.floor((parseInt(storedCooldown) - Date.now()) / 1000);
      if (diff > 0) {
        setCooldownRemaining(diff);
      }
    }

    const attemptsKey = `stage_${stage.id}_quiz_attempts`;
    const attempts = parseInt(localStorage.getItem(attemptsKey) || "0");
    if (attempts > 0) {
      setFirstTry(false);
    }
  }, [stage.id]);

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

  // Video play timer simulator
  useEffect(() => {
    if (playingVideoIdx === null) return;
    const interval = setInterval(() => {
      setVideoTimer((prev) => {
        // Video completed at 5 seconds (simulated 90s for validation, fast for testing)
        if (prev >= 5) {
          clearInterval(interval);
          handleVideoComplete(playingVideoIdx);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playingVideoIdx]);

  const handleStartVideo = (idx: number) => {
    if (videosCompleted[idx]) {
      toast.info("You've already completed this video!");
      return;
    }
    setPlayingVideoIdx(idx);
    setVideoTimer(0);
    toast.success(`Playing: ${stage.videos[idx].title}. Watch for 5 seconds to earn Sovereigns.`);
  };

  const handleVideoComplete = (idx: number) => {
    setPlayingVideoIdx(null);
    const newCompleted = [...videosCompleted];
    newCompleted[idx] = true;
    setVideosCompleted(newCompleted);
    localStorage.setItem(`stage_${stage.id}_video_${idx}`, "true");

    // Earn Sovereigns
    const earned = 10;
    const newSovereigns = profile.sovereigns + earned;
    const updatedProfile = { ...profile, sovereigns: newSovereigns };
    onUpdateProfile(updatedProfile);
    toast.success(`Video Completed! +10 Sovereigns (SVG) earned.`);

    // Check if all videos & articles are complete for Stage Bonus
    checkStageFormatsBonus(newCompleted, articleCompleted);
  };

  const handleChapterRead = (idx: number) => {
    if (readChapters[idx]) return;
    const newRead = [...readChapters];
    newRead[idx] = true;
    setReadChapters(newRead);
    localStorage.setItem(`stage_${stage.id}_chapter_${idx}`, "true");

    // If all chapters are read, complete the article format
    if (newRead.every(Boolean)) {
      setArticleCompleted(true);
      localStorage.setItem(`stage_${stage.id}_article`, "true");
      
      const earned = 10;
      const newSovereigns = profile.sovereigns + earned;
      const updatedProfile = { ...profile, sovereigns: newSovereigns };
      onUpdateProfile(updatedProfile);
      toast.success(`Article Fully Read! +10 Sovereigns (SVG) earned.`);
      
      checkStageFormatsBonus(videosCompleted, true);
    }
  };

  const checkStageFormatsBonus = (completedVideos: boolean[], isArticleComplete: boolean) => {
    // Stage formats = Videos (all) + Article + Quiz + Doc Tracker
    // Currently check if Video + Article formats are complete (for bonus trigger later when quiz completes)
    const videosAllDone = completedVideos.every(Boolean);
    const isDocTracked = profile.trackedDocs?.includes(stage.documentName);
    
    // We award a bonus (+15 SVG) if they complete all 4 formats. 
    // This is checked also on quiz completion and doc tracking.
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

  const handleToggleTrackDoc = () => {
    const tracked = profile.trackedDocs || [];
    let updatedTracked = [];
    let isTracking = false;

    if (tracked.includes(stage.documentName)) {
      updatedTracked = tracked.filter((d: string) => d !== stage.documentName);
      toast.info(`Stopped tracking ${stage.documentName}`);
    } else {
      updatedTracked = [...tracked, stage.documentName];
      isTracking = true;
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

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:max-w-xl md:mx-auto md:border-x border-border shadow-2xl">
      {/* Drawer Header */}
      <header className="sticky top-0 z-10 w-full h-14 border-b border-border bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{stage.badge}</span>
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase leading-none">{stage.title}</h2>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* TAB 1: VIDEOS */}
        {activeSubTab === "video" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base">🎥 Stage Playlist</h3>
              <p className="text-xs text-muted-foreground">Watch these short tutorials on public finance guidelines. Each completed video awards +10 SVG.</p>
            </div>

            {playingVideoIdx !== null && (
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl text-center space-y-3">
                <AlertCircle className="size-8 mx-auto text-primary animate-pulse" />
                <p className="text-sm font-semibold">Watching Video: {stage.videos[playingVideoIdx].title}</p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(videoTimer / 5) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">Simulating 90s watch time... ({videoTimer}s / 5s)</p>
                <Button size="sm" variant="ghost" onClick={() => setPlayingVideoIdx(null)} className="text-destructive font-semibold">
                  Cancel Playback
                </Button>
              </div>
            )}

            <div className="grid gap-3">
              {stage.videos.map((video, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${videosCompleted[idx] ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Part {idx + 1}</span>
                    <h4 className="text-sm font-bold">{video.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {video.duration} min
                    </p>
                  </div>

                  {videosCompleted[idx] ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <CheckCircle2 className="size-4" /> Completed
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStartVideo(idx)}
                      disabled={playingVideoIdx !== null}
                      className="rounded-xl font-bold shrink-0 gap-1.5"
                    >
                      <Play className="size-3.5 fill-current" /> Play
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLE */}
        {activeSubTab === "article" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base">📝 BNS Explainer</h3>
              <p className="text-xs text-muted-foreground">Read each chapter of our citizen-friendly guide. Read all chapters to earn +10 SVG.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2 border-none">
              {stage.chapters.map((ch, idx) => {
                // County personalization
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
                      className="hover:no-underline py-4 text-sm font-bold text-left flex justify-between"
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
                    <AccordionContent className="text-sm leading-relaxed text-foreground/80 border-t border-border pt-4 pb-4">
                      {contentText}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {articleCompleted && (
              <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>You've completed reading the BNS Article format! +10 SVG awarded.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRIVIA GATE */}
        {activeSubTab === "quiz" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <Trophy className="size-5 text-primary" /> Trivia Gate
              </h3>
              <p className="text-xs text-muted-foreground">Answer 3 questions to unlock the next stage and win the badge. 100% score (3/3) is required!</p>
            </div>

            {cooldownRemaining > 0 ? (
              <div className="p-5 rounded-xl border border-destructive/20 bg-destructive/5 text-center space-y-3">
                <Clock className="size-8 mx-auto text-destructive animate-pulse" />
                <h4 className="font-bold text-sm text-destructive">Trivia Gate Locked</h4>
                <p className="text-xs text-muted-foreground">
                  You failed to secure 3/3 score. A cooldown is active to discourage random guessing.
                </p>
                <div className="text-2xl font-black tracking-tight text-destructive">
                  {Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s
                </div>
                <div className="pt-2">
                  <Button size="xs" variant="outline" onClick={handleResetCooldown} className="gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="size-3" /> Clear Cooldown (Debug)
                  </Button>
                </div>
              </div>
            ) : profile.badges?.includes(stage.badge) ? (
              <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-3">
                <Trophy className="size-12 mx-auto text-primary" />
                <h4 className="font-bold text-lg">Stage Mastered!</h4>
                <p className="text-xs text-muted-foreground">
                  You scored 3/3 and unlocked the **{stage.badgeName}** badge.
                </p>
                <div className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  {stage.badge} Unlocked
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" onClick={handleResetQuiz} className="rounded-xl font-bold">
                    Re-Attempt Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {stage.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2.5 p-4 rounded-xl border border-border bg-card">
                    <h4 className="text-sm font-bold flex gap-1.5">
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
                            className={`w-full p-3 text-xs font-medium text-left rounded-xl border transition-all hover:bg-muted/30 ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {quizSubmitted ? (
                  <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span>Quiz Results:</span>
                      <span className={quizScore === 3 ? "text-emerald-600" : "text-destructive"}>
                        {quizScore} / 3 Correct
                      </span>
                    </div>
                    {quizScore < 3 && (
                      <p className="text-xs text-muted-foreground">
                        You didn't score 3/3. Take this time to review the article chapters and video links during the 5-minute cooldown.
                      </p>
                    )}
                    {quizScore === 3 ? (
                      <Button onClick={onClose} className="w-full rounded-xl h-11 font-bold">
                        Continue to next stage
                      </Button>
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
              <h3 className="font-bold text-base">📄 Government Document Tracker</h3>
              <p className="text-xs text-muted-foreground">Verify official sources, review historical archives, and subscribe to county comment windows.</p>
            </div>

            <div className="p-5 border border-border bg-card rounded-xl space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-sm">{stage.documentName}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Auditable Official Gazette</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.status === 'Comment Open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : stage.status === 'Gazetted' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' : 'bg-muted border-border text-muted-foreground'}`}>
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
    </div>
  );
}
