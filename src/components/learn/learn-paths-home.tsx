"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { LearnDashboardView } from "./learn-dashboard-view";
import { LearnModulesView } from "./learn-modules-view";
import { LearnDocumentsView } from "./learn-documents-view";
import { ProfileView } from "./profile-view";
import { AlertsView } from "./alerts-view";
import { ForumView } from "./forum-view";
import { DashboardSkeleton } from "./dashboard-skeleton";

import { Button } from "@/components/ui/button";
import { ShieldAlert, BookOpen } from "lucide-react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { type LearnHubLanguage, type LearnHubProfile } from "@/lib/learn-data";
import { learnTabToHref } from "@/lib/learn-nav";
import { readProgress, clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import type { CivicModule } from "@/types/learn";
import { TRANSLATIONS } from "@/constants/learn-translations";
import { safeArray, safeLen, safeMap } from "@/lib/safe-data";

const MODULES_REQUIRED: LearnTab[] = ["home", "learn", "profile"];

type Props = {
  /** Route-driven tab — source of truth for which view to show (no query-param lag). */
  tab: LearnTab;
};

export function LearnPathsHome({ tab }: Props) {
  const router = useRouter();
  const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();
  const {
    civicModules,
    setActiveLesson,
    setActiveTab,
    modulesLoading,
    modulesError,
    refreshModules,
  } = useLearn();
  const stages = civicModules;
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);

  // Sync hub chrome (mobile nav highlight) immediately — before paint.
  useLayoutEffect(() => {
    setActiveTab(tab);
  }, [tab, setActiveTab]);

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
  }, [tab]);

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
          breakName:
            authUser.break_name ||
            authUser.display_name ||
            `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() ||
            authUser.email ||
            "Citizen",
          pseudoName:
            authUser.pseudo_name ||
            authUser.display_name ||
            `citizen_${String(authUser.id || "").slice(0, 5)}`,
          avatar_url: authUser.avatar_url || authUser.avatar || null,
          county: authUser.county || authUser.location || String(preferences.county ?? "") || "Kenya",
          ward: authUser.ward || String(preferences.ward ?? "") || "",
          language: (authUser.language_preference as LearnHubLanguage) || ("EN" as const),
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
          badges: currentProfile?.badges || [],
        };
        localStorage.setItem("bns_user_profile", JSON.stringify(currentProfile));

        if (preferences.county || preferences.priorities) {
          import("@/hooks/use-profile").then(({ useUpdateProfile }) => {
            const { mutate } = useUpdateProfile();
            mutate({
              county: String(preferences.county ?? "") || authUser.county || "",
              ward: String(preferences.ward ?? "") || authUser.ward || "",
              budget_priorities: (Array.isArray(preferences.priorities)
                ? preferences.priorities
                : []) as string[],
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

  const handleUpdateProfile = (updated: LearnHubProfile | Record<string, unknown>) => {
    if (!isLoggedIn) return;
    const next = updated as LearnHubProfile;
    setProfile(next);
    localStorage.setItem("bns_user_profile", JSON.stringify(next));
  };

  const handleResetProgress = () => {
    if (!isLoggedIn) return;
    if (window.confirm("Reset all progress?")) {
      localStorage.removeItem("bns_user_profile");
      clearAllModuleProgress(stages);
      setProfile(null);
      setSelectedStage(null);
      router.push(learnTabToHref("home"));
    }
  };

  const effectiveProfile = profile;
  const langKey = (effectiveProfile?.language ?? "EN") as LearnHubLanguage;
  const text = TRANSLATIONS[langKey];
  const { data: leaderboardData } = useLeaderboard(20);

  const currentStageNum = effectiveProfile
    ? effectiveProfile.stageProgress
      ? Math.max(...effectiveProfile.stageProgress)
      : 1
    : 1;
  const currentStage = stages.find((s) => s.order === currentStageNum) || stages[0];

  const handleSelectStage = (stage: CivicModule) => {
    setSelectedStage(stage);
  };

  const handlePrevStage = () => {
    if (!selectedStage) return;
    const idx = stages.findIndex((s) => s.slug === selectedStage.slug);
    const prev = stages[idx - 1];
    if (prev) setSelectedStage(prev);
  };

  const handleNextStage = () => {
    if (!selectedStage) return;
    const idx = stages.findIndex((s) => s.slug === selectedStage.slug);
    const next = stages[idx + 1];
    if (next) setSelectedStage(next);
  };

  const needsModules = MODULES_REQUIRED.includes(tab);
  const waitingForLoggedInProfile = isLoggedIn && !profile && tab !== "forum";

  // Forum never waits on modules/profile — same snappiness as Content routes.
  if (tab === "forum") {
    return (
      <div className="w-full bg-background">
        <ForumView />
      </div>
    );
  }

  if (authLoading || loading || waitingForLoggedInProfile || (needsModules && modulesLoading)) {
    return <DashboardSkeleton />;
  }

  if (needsModules && modulesError && !stages.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center min-h-[50vh]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <p className="text-sm font-bold text-foreground">Failed to load modules</p>
        <p className="max-w-xs text-xs text-muted-foreground">{modulesError}</p>
        <Button
          onClick={refreshModules}
          variant="outline"
          size="sm"
          className="mt-2 rounded-lg text-xs font-bold focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const activeProfile = effectiveProfile ?? { language: "EN" as const };

  if (needsModules && !stages.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center min-h-[50vh]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
          <BookOpen className="size-6" />
        </div>
        <p className="text-sm font-bold text-muted-foreground">No learning modules available yet.</p>
      </div>
    );
  }

  if (selectedStage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
        <StageDetailDrawer
          key={selectedStage.slug}
          stage={selectedStage}
          profile={activeProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setSelectedStage(null)}
          hasNext={stages.findIndex((s) => s.slug === selectedStage.slug) < stages.length - 1}
          hasPrev={stages.findIndex((s) => s.slug === selectedStage.slug) > 0}
          onPrevStage={handlePrevStage}
          onNextStage={handleNextStage}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {activeProfile.language === "SH" && (
        <div className="w-full border-b border-amber-500/20 bg-amber-500/15 px-4 py-1 text-center text-[10px] font-semibold text-amber-600">
          {text.shengComingSoon}
        </div>
      )}

      <div className="min-w-0">
        {tab === "home" && currentStage && (
          <LearnDashboardView
            profile={activeProfile}
            stages={stages}
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
            onNavigateToCurriculum={() => router.push(learnTabToHref("learn"))}
            onNavigateToForum={() => router.push(learnTabToHref("forum"))}
            leaderboard={leaderboardData?.results}
          />
        )}

        {tab === "learn" && currentStage && (
          <LearnModulesView
            profile={activeProfile}
            stages={stages}
            currentStage={currentStage}
            onSelectStage={handleSelectStage}
            onRefresh={refreshModules}
          />
        )}

        {tab === "alerts" && <AlertsView profile={activeProfile} />}

        {tab === "documents" && <LearnDocumentsView profile={activeProfile} />}

        {tab === "profile" && (
          <div className="space-y-4 pb-4 md:pb-0">
            <ProfileView
              profile={activeProfile}
              stages={stages}
              onResetProgress={handleResetProgress}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
}
