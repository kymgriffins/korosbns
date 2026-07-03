"use client";

import { useEffect, useState } from "react";
import { LearnDashboardView } from "./learn-dashboard-view";
import { LearnModulesView } from "./learn-modules-view";
import { LearnDocumentsView } from "./learn-documents-view";
import { ProfileView } from "./profile-view";
import { AlertsView } from "./alerts-view";
import { ForumView } from "./forum-view";
import { DashboardSkeleton } from "./dashboard-skeleton";

import { Button } from "@/components/ui/button";
import { ShieldAlert, BookOpen } from "lucide-react";
import { useLearn } from "@/contexts/learn-context";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { type LearnHubLanguage, type LearnHubProfile } from "@/lib/learn-data";
import { learnTabToHref } from "@/lib/learn-nav";
import { clearAllModuleProgress } from "@/lib/module-progress";
import { useLeaderboard } from "@/hooks/use-gamification";
import { TRANSLATIONS } from "@/constants/learn-translations";
import { LearnTabPresence } from "./learn-motion";

export function LearnPathsHome() {
  const router = useRouter();
  const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();
  const { civicModules, activeTab, setActiveTab, modulesLoading, modulesError, refreshModules } = useLearn();
  const stages = civicModules;
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdateProfile = (updated: LearnHubProfile) => {
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

  const waitingForLoggedInProfile = isLoggedIn && !profile;

  if (authLoading || loading || modulesLoading || waitingForLoggedInProfile) {
    return <DashboardSkeleton />;
  }

  if (modulesError) {
    return (
      <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <p className="text-sm font-bold text-foreground">Modules didn&apos;t load</p>
        <p className="max-w-xs text-xs text-muted-foreground">Check your connection and try again.</p>
        <Button onClick={refreshModules} variant="outline" size="sm" className="mt-2 rounded-lg text-xs font-bold">
          Try again
        </Button>
      </div>
    );
  }

  const activeProfile = effectiveProfile ?? { language: "EN" as const };

  if (!stages.length) {
    return (
      <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
          <BookOpen className="size-6" />
        </div>
        <p className="text-sm font-bold text-muted-foreground">No learning modules available yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      {activeProfile.language === "SH" && (
        <div className="w-full border-b border-amber-500/20 bg-amber-500/15 px-4 py-1 text-center text-[10px] font-semibold text-amber-600">
          {text.shengComingSoon}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <LearnTabPresence activeTab={activeTab}>
          {(tab) => (
            <>
              {tab === "home" && (
                <LearnDashboardView
                  profile={activeProfile}
                  stages={stages}
                  currentStage={currentStage}
                  onNavigateToCurriculum={() => router.push(learnTabToHref("learn"))}
                  onNavigateToForum={() => router.push(learnTabToHref("forum"))}
                  leaderboard={leaderboardData?.results}
                />
              )}

              {tab === "learn" && (
                <LearnModulesView
                  profile={activeProfile}
                  stages={stages}
                  currentStage={currentStage}
                  onRefresh={refreshModules}
                />
              )}

              {tab === "alerts" && <AlertsView profile={activeProfile} />}

              {tab === "documents" && (
                <div className="h-[calc(100dvh-120px)] md:h-auto">
                  <LearnDocumentsView profile={activeProfile} />
                </div>
              )}

              {tab === "forum" && <ForumView />}

              {tab === "profile" && (
                <ProfileView
                  profile={activeProfile}
                  stages={stages}
                  onResetProgress={handleResetProgress}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </>
          )}
        </LearnTabPresence>
      </div>
    </div>
  );
}
