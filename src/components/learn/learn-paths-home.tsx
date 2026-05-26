"use client";

import React, { useEffect, useState } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { AnonymousIdentityPicker } from "./anonymous-identity-picker";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { StageDetailDrawer } from "./stage-detail-drawer";

import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { Label } from "@/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { toast } from "sonner";
import {
  Flame, Sparkles, BookOpen,
  ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2,
  Volume2, Shield, Settings, DownloadCloud, Copy, Send, MessageSquare,
  Home, HelpCircle, ChevronRight, Layers, Globe, FileCheck, Award
} from "lucide-react";
import { cn } from "@/utils";
import { useLearn, type ActiveLesson } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { STAGES_DATA, type StageData } from "@/constants/stages-data";
import { citizenApi } from "@/lib/api-client";

// Translations dictionary for Global Language Toggle (EN / SW / Sheng)
const TRANSLATIONS = {
  EN: {
    dashboardTitle: "Civic Dashboard",
    dashboardSubtitle: "Track your budget learning journey and active county alerts.",
    stagesMastered: "Stages Mastered",
    sovereigns: "Sovereigns",
    streak: "Active Streak",
    roadmapTitle: "Map of the Budget Cycle",
    roadmapSubtitle: "Complete the 8 sequential stages to earn certificates & badges.",
    alertsTitle: "Participation Alerts",
    alertsSubtitle: "Hyper-local alerts matching your county and tracked documents.",
    profileTitle: "Citizen Profile",
    profileSubtitle: "Review your public credentials and participation logs.",
    settingsTitle: "App Settings",
    language: "App Language",
    resetBtn: "Reset All Progress",
    trackBtn: "Tracked Documents",
    cachedBadge: "📶 Cached",
    quickJump: "Quick Jump to Stage",
    cacheAll: "Offline Cache",
    consentText: "DPA 2019 Consent Verified",
    streakDays: "Day Streak",
    shengComingSoon: ""
  },
  SW: {
    dashboardTitle: "Mpanilio wa Uraia",
    dashboardSubtitle: "Fuatilia safari yako ya masomo ya bajeti na alerts za kaunti.",
    stagesMastered: "Hatua Zilizokamilika",
    sovereigns: "Sovereigns (SVG)",
    streak: "Mfululizo wa Siku",
    roadmapTitle: "Ramani ya Mzunguko wa Bajeti",
    roadmapSubtitle: "Kamilisha hatua zote 8 ili upate tuzo na beji.",
    alertsTitle: "Taarifa za Ushiriki",
    alertsSubtitle: "Taarifa za ushiriki kulingana na kaunti yako na hati unazofuatilia.",
    profileTitle: "Wasifu wa Mwananchi",
    profileSubtitle: "Angalia historia yako ya ushiriki na beji zako.",
    settingsTitle: "Mipangilio",
    language: "Lugha ya Programu",
    resetBtn: "Futa Maendeleo Yote",
    trackBtn: "Hati Zinazofuatiliwa",
    cachedBadge: "📶 Imehifadhiwa",
    quickJump: "Rukia Haraka Hatua",
    cacheAll: "Hifadhi Nje ya Mtandao",
    consentText: "Idhini ya DPA 2019 Imethibitishwa",
    streakDays: "Mfululizo wa Siku",
    shengComingSoon: ""
  },
  SH: {
    dashboardTitle: "Dashboard ya Mraia",
    dashboardSubtitle: "Fuatilia maworks zako za bajeti na alert za kaunti.",
    stagesMastered: "Ma-stage Umewai",
    sovereigns: "Sovereigns (SVG)",
    streak: "Streak ya Siku",
    roadmapTitle: "Mchoro ya Budget Cycle",
    roadmapSubtitle: "Maliza ma-stage zote 8 upate ma-badge na heshima.",
    alertsTitle: "Alerts za Ushiriki",
    alertsSubtitle: "Alerts za county yako na mambo za bajeti zenye unafuatilia.",
    profileTitle: "Profile ya Raia",
    profileSubtitle: "Check heshima zako na list ya memoranda umetuma.",
    settingsTitle: "Settings za App",
    language: "Lugha ya App",
    resetBtn: "Futa Maendeleo Yote [Sheng coming soon]",
    trackBtn: "Ma-doc Unafuatilia",
    cachedBadge: "📶 Imehifadhiwa [Sheng coming soon]",
    quickJump: "Rukia Stage Haraka [Sheng coming soon]",
    cacheAll: "Hifadhi Nje ya Mtandao [Sheng coming soon]",
    consentText: "Idhini ya DPA 2019 [Sheng coming soon]",
    streakDays: "Streak ya Siku",
    shengComingSoon: "[Sheng translation coming soon]"
  }
};

// STAGES_DATA imported from @/constants/stages-data

export function LearnPathsHome() {
  const { isLoggedIn, user: authUser } = useAuth();
  const [wantsAnonymous, setWantsAnonymous] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeTab, setActiveTab, setActiveLesson } = useLearn();

  const [selectedStage, setSelectedStage] = useState<any | null>(null);
  const [cachedStages, setCachedStages] = useState<number[]>([]);

  // Sync selectedStage ↔ activeLesson for sidebar curriculum rail
  useEffect(() => {
    if (selectedStage) {
      const completedStepIds: number[] = [];
      for (const step of selectedStage.steps) {
        const key = `stage_${selectedStage.id}_step_${step.id}_trivia_passed`;
        if (localStorage.getItem(key) === "true") {
          completedStepIds.push(step.id);
        }
      }
      setActiveLesson({
        stageId: selectedStage.id,
        stageTitle: selectedStage.title,
        stageBadge: selectedStage.badge,
        currentStep: 0,
        totalSteps: selectedStage.steps.length,
        completedStepIds,
        stepTitles: selectedStage.steps.map((s: any) => ({ id: s.id, title: s.title })),
      });
    } else {
      setActiveLesson(null);
    }
  }, [selectedStage, setActiveLesson]);

  // Load profile on mount or auth state change
  useEffect(() => {
    // If authenticated, sync bns_user_profile with auth data
    if (isLoggedIn && authUser) {
      const stored = localStorage.getItem("bns_user_profile");
      let currentProfile: any = null;
      if (stored) {
        try {
          currentProfile = JSON.parse(stored);
        } catch {
          currentProfile = null;
        }
      }
      
      // Auto-bridge authenticated user to progress profile if missing or mismatched
      if (!currentProfile || currentProfile.userId !== authUser.id) {
        const onboardingData = localStorage.getItem("bns_onboarding_profile");
        let preferences: any = {};
        if (onboardingData) {
          try {
            preferences = JSON.parse(onboardingData);
          } catch {
            preferences = {};
          }
        }
        
        currentProfile = {
          userId: authUser.id || `user_${Math.random().toString(36).substr(2, 9)}`,
          breakName: authUser.break_name || authUser.display_name || `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() || authUser.email || "Citizen",
          pseudoName: authUser.pseudo_name || authUser.display_name || `citizen_${String(authUser.id || "").slice(0, 5)}`,
          county: authUser.county || authUser.location || preferences.county || "Kenya",
          ward: authUser.ward || preferences.ward || "",
          language: authUser.language_preference || "EN" as const,
          notifications: authUser.notifications_enabled ?? true,
          whatsappFallback: authUser.whatsapp_fallback ?? false,
          phone: authUser.phone_number || "",
          consentGranted: authUser.dpa_consent_granted ?? true,
          consentTimestamp: authUser.dpa_consent_timestamp || new Date().toISOString(),
          sovereigns: currentProfile?.sovereigns || 0,
          stageProgress: currentProfile?.stageProgress || [1],
          streakDays: currentProfile?.streakDays || 0,
          lastActive: Date.now(),
          trackedDocs: currentProfile?.trackedDocs || [],
          badges: currentProfile?.badges || []
        };
        localStorage.setItem("bns_user_profile", JSON.stringify(currentProfile));

        // Sync stored onboarding data to backend if available
        if (preferences.county || preferences.priorities) {
          citizenApi.patchMe({
            county: preferences.county || authUser.county || "",
            ward: preferences.ward || authUser.ward || "",
            budget_priorities: preferences.priorities || [],
            location: preferences.county || authUser.location || "",
          }).catch(() => {});
        }
      }
      
      const streakDays = checkStreak(currentProfile);
      const updated = { ...currentProfile, streakDays, lastActive: Date.now() };
      setProfile(updated);
      localStorage.setItem("bns_user_profile", JSON.stringify(updated));
    } else {
      // If not logged in, load anonymous profile
      const stored = localStorage.getItem("bns_user_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const streakDays = checkStreak(parsed);
          const updated = { ...parsed, streakDays, lastActive: Date.now() };
          setProfile(updated);
          localStorage.setItem("bns_user_profile", JSON.stringify(updated));
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    }
    
    const storedCache = localStorage.getItem("bns_cached_stages");
    if (storedCache) {
      try {
        setCachedStages(JSON.parse(storedCache));
      } catch {
        setCachedStages([]);
      }
    }
    setLoading(false);
  }, [isLoggedIn, authUser]);

  const checkStreak = (userProfile: any) => {
    if (!userProfile.lastActive) return 0;
    const lastActiveDate = new Date(userProfile.lastActive);
    const today = new Date();
    lastActiveDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return userProfile.streakDays || 0;
    } else if (diffDays === 1) {
      return (userProfile.streakDays || 0) + 1;
    } else {
      return 0;
    }
  };

  const handleOnboardingComplete = (newProfile: any) => {
    setProfile(newProfile);
    setActiveTab("home");
    toast.success("Welcome aboard, Civic Champion!");
  };

  const handleUpdateProfile = (updated: any) => {
    setProfile(updated);
    localStorage.setItem("bns_user_profile", JSON.stringify(updated));
  };

  const handleToggleCache = (stageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let newCached = [...cachedStages];
    if (newCached.includes(stageId)) {
      newCached = newCached.filter(id => id !== stageId);
      toast.info("Removed stage from local cache.");
    } else {
      newCached.push(stageId);
      toast.success("Stage cached offline successfully!");
    }
    setCachedStages(newCached);
    localStorage.setItem("bns_cached_stages", JSON.stringify(newCached));
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset all progress? This wipes profile & statistics.")) {
      localStorage.removeItem("bns_user_profile");
      localStorage.removeItem("bns_cached_stages");
      for (let i = 1; i <= 8; i++) {
        localStorage.removeItem(`stage_${i}_article`);
        localStorage.removeItem(`stage_${i}_quiz_attempts`);
        localStorage.removeItem(`stage_${i}_quiz_cooldown`);
        localStorage.removeItem(`stage_${i}_current_step`);
        localStorage.removeItem(`stage_${i}_mastery_awarded`);
        for (let j = 0; j < 10; j++) {
          localStorage.removeItem(`stage_${i}_video_${j}`);
          localStorage.removeItem(`stage_${i}_chapter_${j}`);
          localStorage.removeItem(`stage_${i}_step_${j}_trivia_passed`);
          localStorage.removeItem(`stage_${i}_step_${j}_trivia_${j}_reward`);
        }
      }
      setProfile(null);
      setCachedStages([]);
      setSelectedStage(null);
      setActiveTab("home");
      toast.success("All profiles wiped.");
    }
  };

  // Get localized text matching user language setting
  const langKey = (profile?.language as "EN" | "SW" | "SH") || "EN";
  const text = TRANSLATIONS[langKey];

  // Leaderboard assembly sorting
  const leaderboard = [
    { name: "BudgetBreaker_Nairobi", svg: 850, stages: 8 },
    { name: "SovereignSeeker_Mombasa", svg: 720, stages: 6 },
    { name: "GavanaWatch_Kisumu", svg: 640, stages: 5 },
    { name: profile?.pseudoName || "You", svg: profile?.sovereigns || 0, stages: profile?.badges?.length || 0, isUser: true },
    { name: "MCA_Whisperer_Nakuru", svg: 310, stages: 3 },
    { name: "CitizenZero_Kiambu", svg: 150, stages: 1 }
  ].sort((a, b) => b.svg - a.svg).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const currentStageNum = profile ? (profile.stageProgress ? Math.max(...profile.stageProgress) : 1) : 1;
  const currentStage = STAGES_DATA.find(s => s.id === currentStageNum) || STAGES_DATA[0];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is not onboarded, ask if they want to register or continue as anonymous guest
  if (!profile) {
    if (!wantsAnonymous) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/20 min-h-[70vh]">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-xl space-y-6 text-center">
            <div className="space-y-2">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Sparkles className="size-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Citizen Learn Hub</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Welcome! Track Kenya's public finance, follow projects in your county, and take trivia gates to earn badges.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full rounded-xl h-11 font-bold">
                <Link href={Routes.JoinUs}>Sign Up / Join Movement</Link>
              </Button>
              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">or</span>
                <div className="h-px bg-border flex-1" />
              </div>
              <Button 
                onClick={() => setWantsAnonymous(true)} 
                variant="outline" 
                className="w-full rounded-xl h-11 font-bold border-border/85 bg-transparent"
              >
                Continue as Anonymous User
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              We never lock citizens out. Anonymous progress is stored locally on this device, but won't sync across other browsers.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <AnonymousIdentityPicker onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      {/* 📱 MOBILE VIEW (Guarded by md:hidden) */}
      <div className="w-full flex flex-col md:hidden relative pb-14 min-h-screen bg-background">
        
        {/* Global Sheng translation warning banner */}
        {profile.language === "SH" && (
          <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
            {text.shengComingSoon}
          </div>
        )}

        {/* Profile Header Summary */}
        <header className="sticky top-0 z-30 px-4 py-3 border-b border-border bg-card/95 backdrop-blur-md flex justify-between items-center gap-3">
          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center hover:opacity-80 transition-opacity" aria-label="Home">
            <img src="/logo.svg" alt="Budget Ndio Story" className="h-7 w-auto" />
          </a>

          {/* User Info */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <BitmojiAvatar gender={profile.gender} size="sm" className="shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs font-black text-foreground truncate">{profile.breakName}</h1>
              <p className="text-[10px] text-muted-foreground truncate">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black flex items-center gap-1">
              <Sparkles className="size-3 fill-primary" />
              <span>{profile.sovereigns}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold" title={text.streak}>
              <Flame className="size-3 fill-orange-500" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CIVIC DASHBOARD (HOME) */}
            {activeTab === "home" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.dashboardTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.dashboardSubtitle}</p>
                </div>

                {/* Progress Tracker Card */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span>Progress to Citizen Expert</span>
                    <span className="text-primary">{profile.badges?.length || 0} / 8 Stages Mastered</span>
                  </div>
                  <Progress value={((profile.badges?.length || 0) / 8) * 100} className="h-2 rounded-full" />
                  <p className="text-[10px] text-muted-foreground">Unlock all 8 badges by completing the trivia gates.</p>
                </div>

                {/* Current Active Stage Card */}
                <div className="p-4 border border-border bg-card rounded-2xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Stage</span>
                    <span className="text-[11px] text-primary font-bold">Stage {currentStage.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentStage.badge}</span>
                    <div>
                      <h4 className="text-sm font-black uppercase leading-tight">{currentStage.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{currentStage.documentName}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedStage(currentStage)}
                    className="w-full rounded-xl mt-2 font-bold"
                  >
                    Resume Learning
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ROADMAP (LEARN) */}
            {activeTab === "learn" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.roadmapTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.roadmapSubtitle}</p>
                </div>

                {/* Desktop Quick-Jump Stage Selector */}
                <div className="space-y-2">
                  <Label htmlFor="stageSelect" className="text-xs font-bold text-muted-foreground">{text.quickJump}</Label>
                  <select
                    id="stageSelect"
                    onChange={(e) => {
                      const selected = STAGES_DATA.find(s => s.id === parseInt(e.target.value));
                      if (selected) {
                        setSelectedStage(selected);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
                  >
                    <option value="">Select a stage...</option>
                    {STAGES_DATA.map((s) => {
                      const isCompleted = profile.badges?.includes(s.badge);
                      const isActive = profile.stageProgress?.includes(s.id);
                      return (
                        <option key={s.id} value={s.id}>
                          Stage {s.id}: {s.documentName} {isCompleted ? "✓" : isActive ? "▶" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Accordion Map Overview */}
                <Accordion type="single" collapsible className="w-full space-y-2 border-none">
                  <AccordionItem value="map-overview" className="border border-border bg-card rounded-xl overflow-hidden px-4">
                    <AccordionTrigger className="hover:no-underline py-3 text-xs font-bold flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Layers className="size-4 text-primary" />
                        <span>Overview: Map of the Budget Cycle</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border pt-3 pb-3">
                      <div className="grid grid-cols-2 gap-2">
                        {STAGES_DATA.map((s) => {
                          const done = profile.badges?.includes(s.badge);
                          const active = profile.stageProgress?.includes(s.id);
                          return (
                            <div key={s.id} className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${done ? 'border-primary/20 bg-primary/5' : active ? 'border-foreground/30 bg-card' : 'border-border opacity-40 bg-muted/20'}`}>
                              <span className="text-base">{s.badge}</span>
                              <div className="truncate">
                                <p className="font-bold truncate text-[10px] leading-tight">{s.badgeName}</p>
                                <p className="text-[9px] text-muted-foreground truncate">{s.documentName}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Vertical Visual Timeline (Roadmap) */}
                <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                  {STAGES_DATA.map((stage) => {
                    const isCompleted = profile.badges?.includes(stage.badge);
                    const isActive = profile.stageProgress?.includes(stage.id);
                    const isStageCached = cachedStages.includes(stage.id);
                    const offlineDisabled = false;

                    return (
                      <div
                        key={stage.id}
                        onClick={() => {
                          if (offlineDisabled) return;
                          setSelectedStage(stage);
                        }}
                        className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                            : isActive
                            ? "bg-card border-foreground/35 hover:border-foreground shadow-xs"
                            : "bg-muted/15 border-border hover:bg-muted/30"
                        } ${offlineDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Circle Timeline Index */}
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border z-10 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isActive
                              ? "bg-card border-foreground text-foreground"
                              : "bg-muted border-border text-muted-foreground"
                          }`}>
                            {isCompleted ? stage.badge : stage.id}
                          </div>

                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{stage.documentName}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", stage.status === "Comment Open" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-muted border-border text-muted-foreground")}>
                                {stage.status}
                              </span>
                              {isStageCached && (
                                <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  📶 Cached
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cache controls */}
                        {!offlineDisabled && (
                          <button
                            onClick={(e) => handleToggleCache(stage.id, e)}
                            className={`p-2 rounded-lg border hover:bg-muted shrink-0 ${isStageCached ? 'border-blue-500/20 text-blue-600 bg-blue-500/5' : 'border-border text-muted-foreground'}`}
                          >
                            <DownloadCloud className="size-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PARTICIPATION ALERTS */}
            {activeTab === "alerts" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.alertsTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.alertsSubtitle}</p>
                </div>

                {/* Submissions History Log */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
                  {profile.participationLogs?.length > 0 ? (
                    <div className="space-y-2.5">
                      {profile.participationLogs.map((log: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs shadow-xs">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-foreground leading-none">{log.documentName}</h4>
                            <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">
                              {log.method}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 font-mono text-[9px] leading-relaxed whitespace-pre-wrap truncate max-h-24">
                            {log.draftText}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
                      No commentaries submitted yet.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: CITIZEN PROFILE & SETTINGS */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.profileTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.profileSubtitle}</p>
                </div>

                {/* Profile Card */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <BitmojiAvatar gender={profile.gender} size="md" />
                    <div>
                      <h3 className="text-xs font-black text-foreground">{profile.breakName}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold leading-none mt-1">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetProgress}
                    className="w-full rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/95 transition-all text-xs h-10"
                  >
                    Reset All Progress
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Mobile Stage Detail Drawer (only rendered on mobile) */}
        {selectedStage && (
          <div className="md:hidden">
            <StageDetailDrawer
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={selectedStage.id < 8}
              hasPrev={selectedStage.id > 1}
              onPrevStage={() => {
                const prev = STAGES_DATA.find(s => s.id === selectedStage.id - 1);
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.id} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const next = STAGES_DATA.find(s => s.id === selectedStage.id + 1);
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.id} is locked.`);
                    return;
                  }
                  setSelectedStage(next);
                }
              }}
            />
          </div>
        )}

      </div>

      {/* 🖥️ DESKTOP VIEW (Guarded by hidden md:flex) */}
      <div className="hidden md:flex flex-1 w-full bg-background overflow-hidden h-screen">
        
        {selectedStage ? (
          /* A) Stage Selected View: full-width Stage Detail (stats panel hidden) */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <StageDetailDrawer
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={selectedStage.id < 8}
              hasPrev={selectedStage.id > 1}
              onPrevStage={() => {
                const prev = STAGES_DATA.find(s => s.id === selectedStage.id - 1);
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.id} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const next = STAGES_DATA.find(s => s.id === selectedStage.id + 1);
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.id} is locked.`);
                    return;
                  }
                  setSelectedStage(next);
                }
              }}
            />
          </div>
        ) : (
          /* B) No Stage Selected View: Tab Content + Stats Panel */
          <div className="flex-1 grid grid-cols-[1fr_320px] h-full overflow-hidden">
            
            {/* Left: Tab Content (scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab: Home */}
              {activeTab === "home" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Premium Hero Banner */}
                  <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground space-y-3 overflow-hidden shadow-sm">
                    <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center p-8 pointer-events-none select-none">
                      <Sparkles className="size-48" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">Kenya Civic Journey</span>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight max-w-xl">Master Your Civic Budget Rights &amp; Power</h2>
                    <p className="text-xs text-white/80 max-w-md">Learn where your taxes go, how budgets are formed, and draft your own comments to hold leaders accountable.</p>
                    <Button 
                      onClick={() => setActiveTab("learn")}
                      className="bg-white text-primary hover:bg-white/95 rounded-xl font-bold text-xs px-5 h-10 mt-2 shadow-sm"
                    >
                      Explore Learning Map
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Progress Card */}
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3.5 shadow-xs">
                      <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider">Overall Progress</h3>
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-black text-foreground">{profile.badges?.length || 0} / 8</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">STAGES MASTERED</span>
                      </div>
                      <Progress value={((profile.badges?.length || 0) / 8) * 100} className="h-2 rounded-full" />
                    </div>

                    {/* Active Stage Resumer */}
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3.5 shadow-xs flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Active Stage</span>
                        <h4 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5 mt-1">
                          <span className="text-lg">{currentStage.badge}</span>
                          {currentStage.title}
                        </h4>
                      </div>
                      <Button
                        onClick={() => setSelectedStage(currentStage)}
                        className="w-full rounded-xl font-bold mt-2 text-xs"
                      >
                        Resume Learning
                      </Button>
                    </div>
                  </div>

                  {/* Leaderboard */}
                  <div className="p-5 border border-border bg-card rounded-2xl space-y-4 shadow-xs">
                    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider">Civic Leaderboard</h3>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 3).map((item) => (
                        <div key={item.name} className={cn(
                          "flex items-center justify-between p-3 rounded-xl border text-xs",
                          item.isUser ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-border/50"
                        )}>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-muted-foreground w-4">{item.rank}</span>
                            <span className={cn("font-bold text-xs", item.isUser ? "text-primary text-xs" : "text-foreground text-xs")}>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground font-semibold">
                            <span>{item.stages} Badges</span>
                            <span className="text-foreground font-bold">{item.svg} SVG</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Learn (Roadmap) */}
              {activeTab === "learn" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.roadmapTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.roadmapSubtitle}</p>
                  </div>

                  {/* Premium Cards Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {STAGES_DATA.map((stage) => {
                      const isCompleted = profile.badges?.includes(stage.badge);
                      const isActive = profile.stageProgress?.includes(stage.id);
                      const isStageCached = cachedStages.includes(stage.id);
                      const offlineDisabled = false;

                      return (
                        <div
                          key={stage.id}
                          onClick={() => {
                            if (offlineDisabled) return;
                            setSelectedStage(stage);
                          }}
                          className={cn(
                            "relative flex flex-col justify-between p-5 rounded-2xl border transition-all select-none group cursor-pointer",
                            isCompleted
                              ? "bg-primary/4 border-primary/15 hover:bg-primary/8 shadow-xs"
                              : isActive
                              ? "bg-card border-foreground/30 hover:border-foreground shadow-sm"
                              : "bg-muted/10 border-border/80 hover:bg-muted/25",
                            offlineDisabled && "opacity-30 cursor-not-allowed"
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-2xl p-2 rounded-xl bg-card border border-border/60 shadow-2xs group-hover:scale-105 transition-transform duration-200">{stage.badge}</span>
                              <div className="flex items-center gap-1.5">
                                {isStageCached && (
                                  <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">
                                    📶 Cached
                                  </span>
                                )}
                                {isCompleted ? (
                                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Completed
                                  </span>
                                ) : isActive ? (
                                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-muted border border-border text-muted-foreground font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Available
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-0.5 font-bold leading-normal">{stage.documentName}</p>
                              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{stage.description}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{stage.status}</span>
                            {!offlineDisabled && (
                              <button
                                onClick={(e) => handleToggleCache(stage.id, e)}
                                className={cn(
                                  "p-1.5 rounded-lg border hover:bg-muted transition-colors",
                                  isStageCached ? "border-blue-500/20 text-blue-600 bg-blue-500/5" : "border-border text-muted-foreground"
                                )}
                                title="Cache Stage Offline"
                              >
                                <DownloadCloud className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Alerts */}
              {activeTab === "alerts" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.alertsTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.alertsSubtitle}</p>
                  </div>

                  {/* Logged Submissions */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
                    {profile.participationLogs?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {profile.participationLogs.map((log: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs shadow-xs">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-foreground truncate max-w-[180px]">{log.documentName}</h4>
                              <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                {log.method}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                            <div className="bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-[9px] leading-relaxed whitespace-pre-wrap truncate max-h-24">
                              {log.draftText}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">
                        No commentaries submitted yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.profileTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.profileSubtitle}</p>
                  </div>

                  {/* Profile Details Card */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <BitmojiAvatar gender={profile.gender} size="lg" className="border border-primary/20 shadow-xs rounded-full" />
                      <div>
                        <h3 className="text-base font-black text-foreground">{profile.breakName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 font-bold">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
                      </div>
                    </div>
                    <Button onClick={handleResetProgress} variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold text-xs h-10 px-4">
                      Reset All Progress
                    </Button>
                  </div>
                  
                  {/* Account Information */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground font-semibold">County:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.county}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Ward:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.ward || "Not Specified"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Language:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.language === 'SW' ? 'Kiswahili' : profile.language === 'SH' ? 'Sheng' : 'English'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Phone:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.phone || "Not Linked"}</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-3 text-[9px] text-muted-foreground flex items-center gap-1.5 justify-center">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>{text.consentText} ({new Date(profile.consentTimestamp).toLocaleDateString()})</span>
                    </div>
                  </div>

                  {/* Unlocked Badges */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unlocked Badges ({profile.badges?.length || 0}/8)</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {STAGES_DATA.map((stage) => {
                        const unlocked = profile.badges?.includes(stage.badge);
                        return (
                          <div
                            key={stage.id}
                            className={`p-2.5 rounded-xl border text-center space-y-1 shadow-xs ${unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border opacity-40'}`}
                          >
                            <div className="text-xl flex justify-center">{stage.badge}</div>
                            <p className="text-[9px] font-bold truncate">{stage.badgeName}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Global Settings & Language Selector */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{text.settingsTitle}</h3>
                    <div className="space-y-4">
                      {/* Language Selection */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                          <Globe className="size-4" />
                          <span>{text.language}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl text-xs">
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "EN" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "EN" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "SW" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "SW" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            Kiswahili
                          </button>
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "SH" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "SH" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            Sheng
                          </button>
                        </div>
                      </div>

                      {/* Notifications Toggle */}
                      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                        <div>
                          <h4 className="font-bold">Push Notifications</h4>
                          <p className="text-[10px] text-muted-foreground">Receive open comment alerts.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.notifications}
                          onChange={(e) => handleUpdateProfile({ ...profile, notifications: e.target.checked })}
                          className="size-4"
                        />
                      </div>

                      {/* WhatsApp Fallback Toggle */}
                      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                        <div>
                          <h4 className="font-bold">SMS / WhatsApp alerts fallback</h4>
                          <p className="text-[10px] text-muted-foreground">Alert fallback if push notifications fail.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.whatsappFallback}
                          onChange={(e) => handleUpdateProfile({ ...profile, whatsappFallback: e.target.checked })}
                          className="size-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Persistent Stats Panel */}
            <aside className="w-80 border-l border-border bg-card/25 p-6 flex flex-col gap-6 overflow-y-auto select-none">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Good Morning</p>
                <h3 className="text-base font-black text-foreground flex items-center gap-2 mt-0.5">
                  <BitmojiAvatar gender={profile.gender} size="sm" />
                  {profile.breakName} 🔥
                </h3>
              </div>

              {/* Donut progress ring */}
              <div className="flex flex-col items-center justify-center p-4 border border-border bg-card/40 rounded-2xl gap-3">
                <div className="relative size-28 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle cx="56" cy="56" r="46" className="stroke-muted fill-none" strokeWidth="6" />
                    <circle cx="56" cy="56" r="46" className="stroke-primary fill-none transition-all duration-500" strokeWidth="6"
                      strokeDasharray="289"
                      strokeDashoffset={289 - (289 * (profile.badges?.length || 0)) / 8}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black leading-none">{Math.round(((profile.badges?.length || 0) / 8) * 100)}%</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5 tracking-wider">Progress</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium text-center">Master all 8 stages to unlock your Citizen Certificate.</p>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-500/8 border border-orange-500/15 rounded-xl text-center">
                  <Flame className="size-5 fill-orange-500 text-orange-500 mx-auto" />
                  <span className="block text-sm font-black text-orange-600 mt-1">{profile.streakDays} Days</span>
                  <span className="text-[8px] font-black text-orange-500/80 uppercase tracking-wider mt-0.5">Streak</span>
                </div>
                <div className="p-3 bg-primary/8 border border-primary/15 rounded-xl text-center">
                  <Sparkles className="size-5 fill-primary text-primary mx-auto" />
                  <span className="block text-sm font-black text-primary mt-1">{profile.sovereigns} SVG</span>
                  <span className="text-[8px] font-black text-primary/80 uppercase tracking-wider mt-0.5">Sovereigns</span>
                </div>
              </div>

              {/* Badges Box */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Unlocked Badges ({profile.badges?.length || 0})</h4>
                {profile.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((b: string, i: number) => (
                      <span key={i} className="text-xl p-2 rounded-xl bg-card border border-border shadow-2xs" title={b}>{b}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic bg-muted/20 p-3 rounded-lg text-center border border-border/50">No badges unlocked yet. Start learning to earn badges!</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

    </div>
  );
}
