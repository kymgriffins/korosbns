"use client";

import { useEffect, useState, useMemo } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { AnonymousIdentityPicker } from "./anonymous-identity-picker";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { LearnDashboardView } from "./learn-dashboard-view";
import { LearnModulesView } from "./learn-modules-view";
import { LearnDocumentsView } from "./learn-documents-view";
import { ProfileView } from "./profile-view";
import { AlertsView } from "./alerts-view";
import { DashboardSkeleton } from "./dashboard-skeleton";

import { Button } from "@/ui/button";
import { toast } from "sonner";
import {
  Sparkles, ShieldAlert
} from "lucide-react";
import { useLearn } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import { readProgress, clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import type { CivicModule } from "@/types/learn";

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

function saveProfile(profile: any) {
  localStorage.setItem("bns_user_profile", JSON.stringify(profile));
  window.dispatchEvent(new Event("bns-profile-updated"));
}


export function LearnPathsHome() {
  const { isLoggedIn, user: authUser } = useAuth();
  const { civicModules, fetchCivicModules, activeLesson, setActiveLesson, updateCurrentStep, activeTab, setActiveTab, totalStages, modulesLoading, modulesError, refreshModules } = useLearn();
  const stages = civicModules;
  const [wantsAnonymous, setWantsAnonymous] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);

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

  useEffect(() => {
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
          avatar_url: authUser.avatar_url || authUser.avatar || null,
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
        saveProfile(currentProfile);

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
      saveProfile(updated);
    } else {
      const stored = localStorage.getItem("bns_user_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const streakDays = checkStreak(parsed);
          const updated = { ...parsed, streakDays, lastActive: Date.now() };
          setProfile(updated);
          saveProfile(updated);
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
    saveProfile(updated);
  };

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

  const handlePrevStage = () => {
    if (!selectedStage) return;
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
  };

  const handleNextStage = () => {
    if (!selectedStage) return;
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
  };

  if (loading || modulesLoading) {
    return <DashboardSkeleton />;
  }

  if (modulesError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 p-6 text-center">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <p className="text-sm font-bold text-foreground">Failed to load modules</p>
        <p className="text-xs text-muted-foreground max-w-xs">{modulesError}</p>
        <Button onClick={refreshModules} variant="outline" size="sm" className="mt-2 rounded-lg text-xs font-bold">
          Try Again
        </Button>
      </div>
    );
  }

  if (!stages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">No learning modules available yet.</p>
      </div>
    );
  }

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
              <Button asChild className="w-full rounded-xl h-11 font-bold focus-visible:ring-2 focus-visible:ring-primary/50">
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
                className="w-full rounded-xl h-11 font-bold border-border/85 bg-transparent focus-visible:ring-2 focus-visible:ring-primary/50"
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
      {/* Sheng translation warning banner */}
      {!selectedStage && profile.language === "SH" && (
        <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
          {text.shengComingSoon}
        </div>
      )}

      {/* Lesson layer — when stage is selected, it fills the view */}
      {selectedStage ? (
        <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-background md:relative md:inset-auto">
          <StageDetailDrawer key={selectedStage.slug}
            stage={selectedStage}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setSelectedStage(null)}
            hasNext={stages.findIndex(s => s.slug === selectedStage.slug) < stages.length - 1}
            hasPrev={stages.findIndex(s => s.slug === selectedStage.slug) > 0}
            onPrevStage={handlePrevStage}
            onNextStage={handleNextStage}
          />
        </div>
      ) : (
        /* Tab Content — single responsive layout */
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <LearnDashboardView
                  profile={profile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={setSelectedStage}
                  onNavigateToCurriculum={() => setActiveTab("learn")}
                  leaderboard={leaderboardData?.results}
                />
              </motion.div>
            )}

            {activeTab === "learn" && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[calc(100dvh-120px)] md:h-auto"
              >
                <LearnModulesView
                  profile={profile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={setSelectedStage}
                />
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertsView profile={profile} />
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[calc(100dvh-120px)] md:h-auto"
              >
                <LearnDocumentsView profile={profile} />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pb-4 md:pb-0"
              >
                <ProfileView
                  profile={profile}
                  stages={stages}
                  onResetProgress={handleResetProgress}
                  onUpdateProfile={handleUpdateProfile}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
