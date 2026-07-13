"use client";

import { useEffect, useState, useMemo } from "react";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { LearnDashboardView } from "./learn-dashboard-view";
import { LearnModulesView } from "./learn-modules-view";
import { LearnDocumentsView } from "./learn-documents-view";
import { ProfileView } from "./profile-view";
import { AlertsView } from "./alerts-view";
import { ForumView } from "./forum-view";
import { DashboardSkeleton } from "./dashboard-skeleton";

import { Button } from "@/components/ui/button";
import {
  ShieldAlert, BookOpen
} from "lucide-react";
import { useLearn } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { type LearnHubLanguage, type LearnHubProfile } from "@/lib/learn-data";
import { learnTabToHref } from "@/lib/learn-nav";
import { readProgress, clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import type { CivicModule } from "@/types/learn";
import { TRANSLATIONS } from "@/constants/learn-translations";
import { safeArray, safeLen, safeMap } from "@/lib/safe-data";

export function LearnPathsHome() {
  const router = useRouter();
  const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();
  const { civicModules, activeLesson, setActiveLesson, activeTab, setActiveTab, totalStages, modulesLoading, modulesError, refreshModules } = useLearn();
  const stages = civicModules;
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);

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
    if (authLoading) return;

    if (isLoggedIn && authUser) {
      const stored = localStorage.getItem("bns_user_profile");
      let currentProfile: LearnHubProfile | null = null;
      if (stored) {
        try {
          currentProfile = JSON.parse(stored) as LearnHubProfile;
        } catch {
          currentProfile = null;
        }
      }

      if (!currentProfile || currentProfile.userId !== authUser.id) {
        const onboardingData = localStorage.getItem("bns_onboarding_profile");
        let preferences: Record<string, unknown> = {};
        if (onboardingData) {
          try {
            preferences = JSON.parse(onboardingData) as Record<string, unknown>;
          } catch {
            preferences = {};
          }
        }

        currentProfile = {
          userId: authUser.id || "",
          breakName: authUser.break_name || authUser.display_name || `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() || authUser.email || "Citizen",
          pseudoName: authUser.pseudo_name || authUser.display_name || `citizen_${String(authUser.id || "").slice(0, 5)}`,
          avatar_url: authUser.avatar_url || authUser.avatar || null,
          county: authUser.county || authUser.location || String(preferences.county ?? "") || "Kenya",
          ward: authUser.ward || String(preferences.ward ?? "") || "",
          language: (authUser.language_preference as LearnHubLanguage) || "EN" as const,
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
        localStorage.setItem("bns_user_profile", JSON.stringify(currentProfile));

        if (preferences.county || preferences.priorities) {
          import("@/hooks/use-profile").then(({ useUpdateProfile }) => {
            const { mutate } = useUpdateProfile();
            mutate({
              county: String(preferences.county ?? "") || authUser.county || "",
              ward: String(preferences.ward ?? "") || authUser.ward || "",
              budget_priorities: (Array.isArray(preferences.priorities) ? preferences.priorities : []) as string[],
              location: String(preferences.county ?? "") || authUser.location || "",
            });
          });
        }
        localStorage.removeItem("bns_onboarding_profile");
      }

      setProfile(currentProfile);
      setLoading(false);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isLoggedIn, authUser, authLoading]);

  const handleUpdateProfile = (updated: any) => {
    if (!isLoggedIn) return;
    setProfile(updated);
    localStorage.setItem("bns_user_profile", JSON.stringify(updated));
  };

  const handleResetProgress = () => {
    if (!isLoggedIn) return;
    if (window.confirm("Reset all progress?")) {
      localStorage.removeItem("bns_user_profile");
      clearAllModuleProgress(stages);
      setProfile(null);
      setSelectedStage(null);
      setActiveTab("home");
    }
  };

  const effectiveProfile: LearnHubProfile | null = profile;

  const langKey = (effectiveProfile?.language ?? "EN") as LearnHubLanguage;
  const text = TRANSLATIONS[langKey];

  const { data: leaderboardData } = useLeaderboard(20);

  const currentStageNum = effectiveProfile
    ? (effectiveProfile.stageProgress ? Math.max(...effectiveProfile.stageProgress) : 1)
    : 1;
  const currentStage = stages.find(s => s.order === currentStageNum) || stages[0];

  const handleSelectStage = (stage: CivicModule) => {
    setSelectedStage(stage);
  };

  const handlePrevStage = () => {
    if (!selectedStage) return;
    const idx = stages.findIndex(s => s.slug === selectedStage.slug);
    const prev = stages[idx - 1];
    if (prev) {
      setSelectedStage(prev);
    }
  };

  const handleNextStage = () => {
    if (!selectedStage) return;
    const idx = stages.findIndex(s => s.slug === selectedStage.slug);
    const next = stages[idx + 1];
    if (next) {
      setSelectedStage(next);
    }
  };

  const waitingForLoggedInProfile = isLoggedIn && !profile;

  if (authLoading || loading || modulesLoading || waitingForLoggedInProfile) {
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

  const activeProfile = effectiveProfile ?? { language: "EN" as const };

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
    <div className="w-full bg-background">
      {activeProfile.language === "SH" && (
        <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
          {text.shengComingSoon}
        </div>
      )}

      {selectedStage ? (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
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
        <div className="p-4 md:p-6">
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
                  onRefresh={refreshModules}
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
                <AlertsView profile={activeProfile} />
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <LearnDocumentsView profile={activeProfile} />
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
