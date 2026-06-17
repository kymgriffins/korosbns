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
import { ForumView } from "./forum-view";
import { DashboardSkeleton } from "./dashboard-skeleton";

import { Button } from "@/ui/button";
import { toast } from "sonner";
import {
  Sparkles, ShieldAlert, BookOpen
} from "lucide-react";
import { useLearn } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { useUpdateProfile } from "@/hooks/use-profile";
import { learnHubApi } from "@/lib/learn-hub";
import { createGuestBrowseProfile, type LearnHubProfile } from "@/lib/learn-data";
import { learnTabToHref } from "@/lib/learn-nav";
import { readProgress, clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import type { CivicModule } from "@/types/learn";
import { TRANSLATIONS } from "@/constants/learn-translations";
import { safeArray, safeLen, safeMap } from "@/lib/safe-data";

function saveProfile(profile: any) {
  localStorage.setItem("bns_user_profile", JSON.stringify(profile));
  window.dispatchEvent(new Event("bns-profile-updated"));
}


export function LearnPathsHome() {
  const router = useRouter();
  const { isLoggedIn, user: authUser } = useAuth();
  const { civicModules, fetchCivicModules, activeLesson, setActiveLesson, updateCurrentStep, activeTab, setActiveTab, totalStages, modulesLoading, modulesError, refreshModules } = useLearn();
  const stages = civicModules;
  const [wantsAnonymous, setWantsAnonymous] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (selectedStage) {
      const completedStepIds: number[] = [];
      const p = readProgress(selectedStage.slug, selectedStage.order);
      for (const step of safeArray(selectedStage.steps)) {
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
        totalSteps: safeLen(selectedStage.steps),
        completedStepIds,
        stepTitles: safeMap(selectedStage.steps, (s) => ({ id: s.order, title: s.title })),
      });
    } else {
      setActiveLesson(null);
    }
  }, [selectedStage, setActiveLesson]);

  useEffect(() => {
    setSelectedStage(null);
  }, [activeTab]);

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
          consentGranted: authUser.dpa_consent_granted ?? false,
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
          updateProfileMutation.mutate({
            county: preferences.county || authUser.county || "",
            ward: preferences.ward || authUser.ward || "",
            budget_priorities: preferences.priorities || [],
            location: preferences.county || authUser.location || "",
          });
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

  useEffect(() => {
    if (!profile || loading) return;
    const today = new Date().toDateString();
    const lastShown = sessionStorage.getItem("bns_streak_toast");
    if (profile.streakDays > 0 && lastShown !== today) {
      const timer = setTimeout(() => {
        if (profile.streakDays >= 7) {
          toast("Inferno Streak! 🔥", { description: `${profile.streakDays}-day streak! You're unstoppable.`, duration: 5000 });
        } else if (profile.streakDays >= 3) {
          toast("Hot Streak! 🔥", { description: `${profile.streakDays}-day streak! Keep showing up.`, duration: 5000 });
        } else {
          toast(`${profile.streakDays}-day streak!`, { description: "Come back tomorrow to keep it alive.", duration: 4000 });
        }
        sessionStorage.setItem("bns_streak_toast", today);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profile, loading]);

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

  const canBrowseWithoutProfile = stages.length > 0;
  const effectiveProfile: LearnHubProfile | null =
    profile ?? (canBrowseWithoutProfile ? createGuestBrowseProfile() : null);

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
        isUser: effectiveProfile?.pseudoName?.toLowerCase() === (e.name ?? "").toLowerCase(),
      }));
    if (!entries.some((e) => e.isUser) && effectiveProfile?.pseudoName && !effectiveProfile.isGuestBrowse) {
      entries.push({
        name: effectiveProfile.pseudoName,
        svg: effectiveProfile.sovereigns ?? 0,
        stages: effectiveProfile.badges?.length ?? 0,
        rank: entries.length + 1,
        isUser: true,
      });
    }
    return entries.sort((a, b) => b.svg - a.svg).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [leaderboardData, effectiveProfile]);

  const currentStageNum = effectiveProfile
    ? (effectiveProfile.stageProgress ? Math.max(...effectiveProfile.stageProgress) : 1)
    : 1;
  const currentStage = stages.find(s => s.order === currentStageNum) || stages[0];

  const isStageAccessibleByServer = (stage: CivicModule): boolean => {
    if (stage.is_locked !== undefined) return !stage.is_locked;
    return true;
  };

  const isStageAccessible = (stage: CivicModule): boolean => {
    if (!effectiveProfile) return isStageAccessibleByServer(stage);
    if (isStageAccessibleByServer(stage)) return true;
    return !!(
      effectiveProfile.stageProgress?.includes(stage.order) ||
      effectiveProfile.badges?.includes(stage.badge)
    );
  };

  const handleSelectStage = (stage: CivicModule) => {
    if (stage.is_locked === true) {
      toast.error(`Stage ${stage.title} is locked.`);
      return;
    }
    setSelectedStage(stage);
  };

  const handlePrevStage = () => {
    if (!selectedStage) return;
    const idx = stages.findIndex(s => s.slug === selectedStage.slug);
    const prev = stages[idx - 1];
    if (prev) {
      if (!isStageAccessible(prev)) {
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
      if (!isStageAccessible(next)) {
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
        <Button onClick={refreshModules} variant="outline" size="sm" className="mt-2 rounded-lg text-xs font-bold focus-visible:ring-2 focus-visible:ring-ring">
          Try Again
        </Button>
      </div>
    );
  }

  const showOnboardingGate = !profile && !canBrowseWithoutProfile;

  if (showOnboardingGate) {
    if (!wantsAnonymous) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 min-h-[70vh]">
          <div className="w-full max-w-md p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg space-y-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
            <div className="relative space-y-2">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto ring-1 ring-primary/20">
                <Sparkles className="size-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Citizen Learn Hub</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Welcome! Track Kenya's public finance, follow projects in your county, and take trivia gates to earn badges.
              </p>
            </div>

            <div className="relative space-y-3">
              <Button asChild className="w-full rounded-xl h-11 font-bold focus-visible:ring-2 focus-visible:ring-ring">
                <Link href={Routes.JoinUs}>Join the Movement</Link>
              </Button>
              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">or</span>
                <div className="h-px bg-border flex-1" />
              </div>
              <Button
                onClick={() => setWantsAnonymous(true)}
                variant="outline"
                className="w-full rounded-xl h-11 font-bold"
              >
                Continue as Anonymous User
              </Button>
            </div>

            <p className="relative text-[10px] text-muted-foreground leading-relaxed">
              <Link href={Routes.Login} className="text-primary font-bold hover:underline focus-visible:ring-2 focus-visible:ring-ring">Already a user? Login</Link>
              <span className="block mt-1.5">Anonymous progress is stored locally on this device, but won't sync across other browsers.</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <AnonymousIdentityPicker onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (!effectiveProfile) {
    return null;
  }

  const activeProfile = effectiveProfile;
  const showGuestBanner = !profile && canBrowseWithoutProfile && !wantsAnonymous;

  if (!stages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 p-6 text-center">
        <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground mx-auto">
          <BookOpen className="size-6" />
        </div>
        <p className="text-sm font-bold text-muted-foreground">No learning modules available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-0 bg-background flex flex-col overflow-hidden">
      {showGuestBanner && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2 text-xs">
          <span className="text-muted-foreground">
            Browse modules from our live catalog. Save progress by continuing anonymously or signing in.
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-bold" onClick={() => setWantsAnonymous(true)}>
              Continue as guest
            </Button>
            <Button size="sm" className="h-8 rounded-lg text-xs font-bold" asChild>
              <Link href={Routes.Login}>Sign in</Link>
            </Button>
          </div>
        </div>
      )}

      {!selectedStage && activeProfile.language === "SH" && (
        <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
          {text.shengComingSoon}
        </div>
      )}

      {selectedStage ? (
        <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-background md:relative md:inset-auto">
          <StageDetailDrawer key={selectedStage.slug}
            stage={selectedStage}
            profile={activeProfile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setSelectedStage(null)}
            hasNext={stages.findIndex(s => s.slug === selectedStage.slug) < stages.length - 1}
            hasPrev={stages.findIndex(s => s.slug === selectedStage.slug) > 0}
            onPrevStage={handlePrevStage}
            onNextStage={handleNextStage}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6">
          <AnimatePresence mode="popLayout">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <LearnDashboardView
                  profile={activeProfile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={handleSelectStage}
                  onNavigateToCurriculum={() => router.push(learnTabToHref("learn"))}
                  onNavigateToForum={() => router.push(learnTabToHref("forum"))}
                  leaderboard={leaderboardData?.results}
                />
              </motion.div>
            )}

            {activeTab === "learn" && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <LearnModulesView
                  profile={activeProfile}
                  stages={stages}
                  currentStage={currentStage}
                  onSelectStage={handleSelectStage}
                />
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <AlertsView profile={profile} />
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="h-[calc(100dvh-120px)] md:h-auto"
              >
                <LearnDocumentsView profile={profile} />
              </motion.div>
            )}

            {activeTab === "forum" && (
              <motion.div
                key="forum"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <ForumView />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="space-y-4 pb-4 md:pb-0"
              >
                <ProfileView
                  profile={activeProfile}
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
