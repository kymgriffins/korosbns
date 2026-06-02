"use client";

import React, { useEffect, useState, useMemo } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { AnonymousIdentityPicker } from "./anonymous-identity-picker";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { LearnDashboardPanel } from "./learn-dashboard-panel";
import { StageRoadmap } from "./stage-roadmap";
import { LearnDesktopDashboard } from "./learn-desktop-dashboard";
import { LearnModulesView } from "./learn-modules-view";

import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { Label } from "@/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { toast } from "sonner";
import {
  Sparkles, Flame, BookOpen,
  ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2,
  Volume2, Shield, Settings, Copy, Send, MessageSquare,
  Home, HelpCircle, ChevronRight, Globe, FileCheck, Award,
  Layers, ShieldAlert, Trash2, FileText, Users, Bell
} from "lucide-react";
import { cn } from "@/utils";
import { useLearn, type ActiveLesson } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { readProgress, clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import type { CivicModule, ChapterStep } from "@/types/learn";

// Translations dictionary for Global Language Toggle (EN / SW / Sheng)
const TRANSLATIONS = {
  EN: {
    dashboardTitle: "Civic Dashboard",
    dashboardSubtitle: "Track your budget learning journey and active county alerts.",
    stagesMastered: "Stages Mastered",
    sovereigns: "Sovereigns",
    streak: "Active Streak",
    roadmapTitle: "Map of the Budget Cycle",
    roadmapSubtitle: "Complete the stages to earn certificates & badges.",
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


export function LearnPathsHome() {
  const { isLoggedIn, user: authUser } = useAuth();
  const { civicModules, fetchCivicModules, activeLesson, setActiveLesson, updateCurrentStep, activeTab, setActiveTab, totalStages, modulesLoading } = useLearn();
  const stages = civicModules;
  const [wantsAnonymous, setWantsAnonymous] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);

  // Sync selectedStage ↔ activeLesson for sidebar curriculum rail
  useEffect(() => {
    if (selectedStage) {
      const completedStepIds: number[] = [];
      const p = readProgress(selectedStage.slug, selectedStage.order);
      for (const step of selectedStage.steps) {
        if (p.stepsCompleted[step.order]) {
          completedStepIds.push(step.order);
        }
      }
      setActiveLesson({
        stageId: selectedStage.slug,
        stageTitle: selectedStage.title,
        stageBadge: selectedStage.badge,
        stageOrder: selectedStage.order,
        currentStep: 0,
        totalSteps: selectedStage.steps.length,
        completedStepIds,
        stepTitles: selectedStage.steps.map((s) => ({ id: s.order, title: s.title })),
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

  const stageCardData = (stage: CivicModule) => ({
    id: stage.order,
    title: stage.title,
    badge: stage.badge,
    badgeName: stage.badgeName,
    documentName: stage.documentName,
    status: stage.status,
  });

  const handleResetProgress = () => {
    if (window.confirm("Reset all progress? This wipes profile & statistics.")) {
      localStorage.removeItem("bns_user_profile");
      clearAllModuleProgress(stages);
      setProfile(null);
      setSelectedStage(null);
      setActiveTab("home");
      toast.success("All profiles wiped.");
    }
  };

  // Get localized text matching user language setting
  const langKey = (profile?.language as "EN" | "SW" | "SH") || "EN";
  const text = TRANSLATIONS[langKey];

  const { data: leaderboardData } = useLeaderboard(20);
  const leaderboard = useMemo(() => {
    const entries = (leaderboardData?.results ?? [])
      .filter((e) => {
        const name = (e.name ?? "").trim().toLowerCase();
        return name && name !== "none" && name !== "true";
      })
      .map((e) => ({
        name: e.name ?? "Anonymous",
        svg: e.points,
        stages: e.badge_count,
        rank: e.rank,
        isUser: profile?.pseudoName?.toLowerCase() === (e.name ?? "").toLowerCase(),
      }));
    if (!entries.some((e) => e.isUser) && profile?.pseudoName) {
      entries.push({
        name: profile.pseudoName,
        svg: profile.sovereigns ?? 0,
        stages: profile.badges?.length ?? 0,
        rank: entries.length + 1,
        isUser: true,
      });
    }
    return entries.sort((a, b) => b.svg - a.svg).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [leaderboardData, profile]);

  const currentStageNum = profile ? (profile.stageProgress ? Math.max(...profile.stageProgress) : 1) : 1;
  const currentStage = stages.find(s => s.order === currentStageNum) || stages[0];

  if (loading || modulesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 p-6 text-center">
        <p className="text-muted-foreground">No learning modules available yet.</p>
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
    <div className="w-full h-full min-h-0 bg-background flex flex-col overflow-hidden">
      {/* MOBILE VIEW (Guarded by md:hidden) */}
      <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden bg-background md:hidden">
        
        {/* Global Sheng translation warning banner */}
        {!selectedStage && profile.language === "SH" && (
          <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
            {text.shengComingSoon}
          </div>
        )}

        {/* Hub tabs — sole scroll region when no lesson is open */}
        {!selectedStage ? (
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CIVIC DASHBOARD (HOME) */}
            {activeTab === "home" && (
              <LearnDashboardPanel
                text={text}
                profile={profile}
                currentStage={currentStage}
                totalStages={totalStages}
                onSelectStage={setSelectedStage}
              />
            )}

            {/* TAB 2: ROADMAP (LEARN) */}
            {activeTab === "learn" && (
              <StageRoadmap
                text={text}
                profile={profile}
                stages={stages.map(stageCardData)}
                onSelectStage={(s) => {
                  const full = stages.find(m => m.order === s.id);
                  if (full) setSelectedStage(full);
                }}
              />
            )}

            {/* TAB 3: DOCUMENTS — submission history & tracked docs */}
            {activeTab === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">Documents</h2>
                  <p className="text-xs text-muted-foreground">Your tracked budget documents and submitted commentaries.</p>
                </div>

                {/* Tracked documents placeholder */}
                {profile.trackedDocs?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tracked Documents</h3>
                    {profile.trackedDocs.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card text-xs shadow-xs">
                        <FileCheck className="size-4 text-primary shrink-0" />
                        <span className="font-bold text-foreground truncate">{typeof doc === "string" ? doc : doc.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submissions History Log */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Submitted Commentaries</h3>
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
                    <div className="text-center py-10 border border-dashed border-border rounded-2xl space-y-2">
                      <FileText className="size-8 text-muted-foreground/40 mx-auto" />
                      <p className="text-xs text-muted-foreground">No submissions yet.</p>
                      <p className="text-[10px] text-muted-foreground/60">Complete a learning stage and draft a memorandum to get started.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: CITIZEN PROFILE — richly populated */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pb-4"
              >
                {/* Hero ID Card */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60 p-5 text-primary-foreground shadow-lg">
                  <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-4">
                    <Award className="size-24" />
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="relative">
                      <BitmojiAvatar gender={profile.gender} size="lg" className="rounded-full border-2 border-white/30 shadow-md" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-0.5">Citizen Champion</p>
                      <h2 className="text-base font-black text-white leading-tight truncate">{profile.breakName}</h2>
                      <p className="text-[10px] text-white/80 font-semibold mt-0.5 truncate">{profile.county}{profile.ward ? ` · ${profile.ward}` : ""}</p>
                    </div>
                    <div className="ml-auto shrink-0 bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-center">
                      <p className="text-lg font-black text-white leading-none">{Math.floor((profile.sovereigns || 0) / 100) + 1}</p>
                      <p className="text-[8px] font-black text-white/80 uppercase tracking-wider">Level</p>
                    </div>
                  </div>
                  {/* XP bar */}
                  <div className="mt-4 relative">
                    <div className="flex justify-between text-[9px] text-white/70 font-bold mb-1">
                      <span>{profile.sovereigns || 0} XP</span>
                      <span>{(Math.floor((profile.sovereigns || 0) / 100) + 1) * 100} XP to next level</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/90 transition-all duration-700"
                        style={{ width: `${((profile.sovereigns || 0) % 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl border border-orange-500/20 bg-orange-500/8 text-center space-y-1">
                    <Flame className="size-4 fill-orange-500 text-orange-500 mx-auto" />
                    <p className="text-sm font-black text-orange-600">{profile.streakDays || 0}</p>
                    <p className="text-[8px] font-black text-orange-500/80 uppercase tracking-wider">Day Streak</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-primary/20 bg-primary/8 text-center space-y-1">
                    <Sparkles className="size-4 fill-primary text-primary mx-auto" />
                    <p className="text-sm font-black text-primary">{profile.sovereigns || 0}</p>
                    <p className="text-[8px] font-black text-primary/80 uppercase tracking-wider">Sovereigns</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 text-center space-y-1">
                    <Award className="size-4 text-emerald-600 mx-auto" />
                    <p className="text-sm font-black text-emerald-600">{profile.badges?.length || 0}</p>
                    <p className="text-[8px] font-black text-emerald-600/80 uppercase tracking-wider">Badges</p>
                  </div>
                </div>

                {/* Badge showcase */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Badge Collection ({profile.badges?.length || 0}/{stages.length})</h3>
                  <div className="grid grid-cols-4 gap-1.5">
                    {stages.map((stage) => {
                      const unlocked = profile.badges?.includes(stage.badge);
                      return (
                        <div key={stage.slug} className={`p-2 rounded-xl border text-center space-y-0.5 transition-all ${
                          unlocked
                            ? "bg-primary/5 border-primary/20 shadow-xs"
                            : "bg-muted/20 border-border opacity-35 grayscale"
                        }`}>
                          <div className="text-xl flex justify-center">{stage.badge}</div>
                          <p className="text-[8px] font-bold truncate leading-tight">{stage.badgeName}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Language settings */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Globe className="size-3.5" /> Language
                  </h3>
                  <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl text-xs">
                    {(["EN", "SW", "SH"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleUpdateProfile({ ...profile, language: lang })}
                        className={`py-1.5 font-bold rounded-lg transition-all ${
                          profile.language === lang
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {lang === "EN" ? "English" : lang === "SW" ? "Kiswahili" : "Sheng"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <button
                  onClick={handleResetProgress}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors"
                >
                  Reset All Progress
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        ) : (
          /* Lesson layer — fills bounded panel above embedded bottom nav */
          <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-background">
            <StageDetailDrawer key={selectedStage.slug}
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={stages.findIndex(s => s.slug === selectedStage.slug) < stages.length - 1}
              hasPrev={stages.findIndex(s => s.slug === selectedStage.slug) > 0}
              onPrevStage={() => {
                const idx = stages.findIndex(s => s.slug === selectedStage.slug);
                const prev = stages[idx - 1];
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.order);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.title} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const idx = stages.findIndex(s => s.slug === selectedStage.slug);
                const next = stages[idx + 1];
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.order);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.title} is locked.`);
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
            <StageDetailDrawer key={selectedStage.slug}
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={stages.findIndex(s => s.slug === selectedStage.slug) < stages.length - 1}
              hasPrev={stages.findIndex(s => s.slug === selectedStage.slug) > 0}
              onPrevStage={() => {
                const idx = stages.findIndex(s => s.slug === selectedStage.slug);
                const prev = stages[idx - 1];
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.order);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.title} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const idx = stages.findIndex(s => s.slug === selectedStage.slug);
                const next = stages[idx + 1];
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.order);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.title} is locked.`);
                    return;
                  }
                  setSelectedStage(next);
                }
              }}
            />
          </div>
        ) : (
          /* B) No Stage Selected View: Tab Content */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Left: Tab Content (scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab: Home */}
              {activeTab === "home" && (
                <LearnDesktopDashboard 
                  profile={profile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={setSelectedStage}
                  onNavigateToCurriculum={() => setActiveTab("learn")}
                />
              )}

              {/* Tab: Learn (Modules) */}
              {activeTab === "learn" && (
                <LearnModulesView
                  profile={profile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={setSelectedStage}
                />
              )}

              {/* Desktop Tab: Alerts — keeps its own tab on desktop */}
              {activeTab === "alerts" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.alertsTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.alertsSubtitle}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
                    {profile.participationLogs?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {profile.participationLogs.map((log: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs shadow-xs">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-foreground truncate max-w-[180px]">{log.documentName}</h4>
                              <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase">{log.method}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                            <div className="bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-[9px] leading-relaxed whitespace-pre-wrap truncate max-h-24">{log.draftText}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-border rounded-2xl space-y-3">
                        <Bell className="size-8 text-muted-foreground/30 mx-auto" />
                        <p className="text-sm text-muted-foreground">No commentaries submitted yet.</p>
                        <p className="text-xs text-muted-foreground/60">Complete a learning stage to draft and submit a memorandum.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Tab: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">Documents</h2>
                    <p className="text-xs text-muted-foreground">Budget documents you are tracking and your submitted commentaries.</p>
                  </div>
                  {profile.trackedDocs?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Tracked Documents</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profile.trackedDocs.map((doc: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-xs shadow-xs">
                            <FileCheck className="size-4 text-primary shrink-0" />
                            <span className="font-bold text-foreground truncate">{typeof doc === "string" ? doc : doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl space-y-3">
                    <FileText className="size-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground">No documents tracked yet.</p>
                    <p className="text-xs text-muted-foreground/60">Track budget documents during a learning stage to see them here.</p>
                  </div>
                </div>
              )}

              {/* Desktop Tab: Profile — rich Citizen ID card */}
              {activeTab === "profile" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Hero gradient card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60 p-8 text-primary-foreground shadow-lg">
                    <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-8">
                      <Award className="size-36" />
                    </div>
                    <div className="flex items-center gap-6 relative">
                      <BitmojiAvatar gender={profile.gender} size="xl" className="rounded-full border-2 border-white/30 shadow-xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-1">Citizen Champion</p>
                        <h2 className="text-2xl font-black text-white leading-tight">{profile.breakName}</h2>
                        <p className="text-sm text-white/80 font-semibold mt-1">{profile.county}{profile.ward ? ` · ${profile.ward}` : ""}</p>
                        {/* XP progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-white/70 font-bold mb-1">
                            <span>{profile.sovereigns || 0} XP earned</span>
                            <span>Level {Math.floor((profile.sovereigns || 0) / 100) + 1}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-white/90 transition-all duration-700"
                              style={{ width: `${((profile.sovereigns || 0) % 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-center shrink-0">
                        <p className="text-2xl font-black text-white">{Math.floor((profile.sovereigns || 0) / 100) + 1}</p>
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-wider">Level</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/8 text-center space-y-1.5">
                      <Flame className="size-5 fill-orange-500 text-orange-500 mx-auto" />
                      <p className="text-xl font-black text-orange-600">{profile.streakDays || 0}</p>
                      <p className="text-[9px] font-black text-orange-500/80 uppercase tracking-wider">Day Streak</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/8 text-center space-y-1.5">
                      <Sparkles className="size-5 fill-primary text-primary mx-auto" />
                      <p className="text-xl font-black text-primary">{profile.sovereigns || 0}</p>
                      <p className="text-[9px] font-black text-primary/80 uppercase tracking-wider">Sovereigns</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 text-center space-y-1.5">
                      <Award className="size-5 text-emerald-600 mx-auto" />
                      <p className="text-xl font-black text-emerald-600">{profile.badges?.length || 0}</p>
                      <p className="text-[9px] font-black text-emerald-600/80 uppercase tracking-wider">Badges</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/8 text-center space-y-1.5">
                      <MapPin className="size-5 text-sky-600 mx-auto" />
                      <p className="text-xl font-black text-sky-600">{profile.stageProgress?.length || 0}</p>
                      <p className="text-[9px] font-black text-sky-600/80 uppercase tracking-wider">Stages Active</p>
                    </div>
                  </div>

                  {/* Account info + Badge grid side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3 shadow-sm">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Details</h3>
                      <div className="space-y-2 text-xs">
                        {[{label:"County",value:profile.county},{label:"Ward",value:profile.ward||"Not specified"},{label:"Language",value:profile.language==="SW"?"Kiswahili":profile.language==="SH"?"Sheng":"English"},{label:"Phone",value:profile.phone||"Not linked"}].map(({label,value})=>(
                          <div key={label} className="flex justify-between items-center border-b border-border/30 pb-1.5 last:border-0">
                            <span className="text-muted-foreground font-semibold">{label}</span>
                            <span className="font-bold text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] text-muted-foreground flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        <span>DPA 2019 Consent Verified</span>
                      </div>
                    </div>
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3 shadow-sm">
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Badge Collection ({profile.badges?.length||0}/{stages.length})</h3>
                      <div className="grid grid-cols-4 gap-1.5">
                        {stages.map((stage)=>{
                          const unlocked=profile.badges?.includes(stage.badge);
                          return(
                            <div key={stage.slug} className={`p-1.5 rounded-xl border text-center space-y-0.5 ${
                              unlocked?"bg-primary/5 border-primary/20 shadow-xs":"bg-muted/20 border-border opacity-35 grayscale"
                            }`}>
                              <div className="text-lg flex justify-center">{stage.badge}</div>
                              <p className="text-[8px] font-bold truncate">{stage.badgeName}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="p-5 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{text.settingsTitle}</h3>
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5"><Globe className="size-3.5" /> {text.language}</p>
                      <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl text-xs">
                        {(["EN","SW","SH"] as const).map((lang)=>(
                          <button key={lang} onClick={()=>handleUpdateProfile({...profile,language:lang})}
                            className={`py-1.5 font-bold rounded-lg transition-all ${profile.language===lang?"bg-background text-foreground shadow-xs":"text-muted-foreground hover:text-foreground"}`}>
                            {lang==="EN"?"English":lang==="SW"?"Kiswahili":"Sheng"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div className="flex items-center justify-between text-xs">
                        <div><h4 className="font-bold">Push Notifications</h4><p className="text-[10px] text-muted-foreground">Open comment alerts.</p></div>
                        <input type="checkbox" checked={profile.notifications} onChange={(e)=>handleUpdateProfile({...profile,notifications:e.target.checked})} className="size-4" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div><h4 className="font-bold">WhatsApp Fallback</h4><p className="text-[10px] text-muted-foreground">SMS fallback if push fails.</p></div>
                        <input type="checkbox" checked={profile.whatsappFallback} onChange={(e)=>handleUpdateProfile({...profile,whatsappFallback:e.target.checked})} className="size-4" />
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <Button onClick={handleResetProgress} variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold text-xs h-9 px-4">
                        Reset All Progress
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
