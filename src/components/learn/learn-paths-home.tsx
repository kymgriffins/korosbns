"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { SyllabusLibraryHome } from "./syllabus-library-home";
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
import { clearAllModuleProgress } from "@/lib/module-progress";
import { recommendModules } from "@/lib/recommend-modules";
import { TRANSLATIONS } from "@/constants/learn-translations";
import { useMemo } from "react";
import {
  readHubProfile,
  writeHubProfile,
  clearHubProfile,
  readOnboardingDraft,
  clearOnboardingDraft,
} from "@/lib/profile-local-storage";
import { flushAllOfflineCitizenData } from "@/lib/sync-profile";

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
    modulesOffline,
    refreshModules,
  } = useLearn();
  const stages = civicModules;
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync hub chrome (mobile nav highlight) immediately — before paint.
  useLayoutEffect(() => {
    setActiveTab(tab);
  }, [tab, setActiveTab]);

  useEffect(() => {
    setActiveLesson(null);
  }, [tab, setActiveLesson]);

  useEffect(() => {
    if (authLoading) return;

    if (isLoggedIn && authUser) {
      let currentProfile = readHubProfile<LearnHubProfile>();
      if (currentProfile && currentProfile.userId !== authUser.id) {
        currentProfile = null;
      }

      if (!currentProfile) {
        const preferences = readOnboardingDraft() ?? {};
        const nextProfile: LearnHubProfile = {
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
          county:
            authUser.county ||
            authUser.location ||
            preferences.county ||
            "Kenya",
          ward: authUser.ward || preferences.ward || "",
          language: (authUser.language_preference as LearnHubLanguage) || ("EN" as const),
          ageRange: authUser.age_range || preferences.ageRange || undefined,
          educationLevel:
            authUser.education_level || preferences.educationLevel || undefined,
          interests: preferences.priorities,
          notifications: authUser.notifications_enabled ?? true,
          whatsappFallback: authUser.whatsapp_fallback ?? false,
          phone: authUser.phone_number || "",
          consentGranted: authUser.dpa_consent_granted ?? false,
          consentTimestamp: authUser.dpa_consent_timestamp || new Date().toISOString(),
          sovereigns: 0,
          stageProgress: [1],
          streakDays: 0,
          lastActive: Date.now(),
          trackedDocs: [],
          badges: [],
        };
        writeHubProfile(nextProfile as unknown as Record<string, unknown>);
        setProfile(nextProfile);

        void flushAllOfflineCitizenData(undefined, {
          breakName: nextProfile.breakName,
          pseudoName: nextProfile.pseudoName,
          county: nextProfile.county,
          ward: nextProfile.ward,
          language: nextProfile.language,
          ageRange: nextProfile.ageRange,
          educationLevel: nextProfile.educationLevel,
          priorities: preferences.priorities,
        }).then((result) => {
          if (result.profile === "synced") clearOnboardingDraft();
        });
      } else {
        setProfile(currentProfile);
        void flushAllOfflineCitizenData();
      }

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
    writeHubProfile(next as unknown as Record<string, unknown>);
  };

  const handleResetProgress = () => {
    if (!isLoggedIn) return;
    if (window.confirm("Reset all progress?")) {
      clearHubProfile();
      clearAllModuleProgress(stages);
      setProfile(null);
      router.push(learnTabToHref("home"));
    }
  };

  const effectiveProfile = profile;
  const langKey = (effectiveProfile?.language ?? "EN") as LearnHubLanguage;
  const text = TRANSLATIONS[langKey];

  const recommended = useMemo(() => {
    if (!isLoggedIn || !effectiveProfile) return [];
    return recommendModules(stages, {
      county: effectiveProfile.county,
      language: effectiveProfile.language,
      ageRange: effectiveProfile.ageRange,
      interests: effectiveProfile.interests,
    });
  }, [isLoggedIn, effectiveProfile, stages]);

  const currentStageNum = effectiveProfile
    ? effectiveProfile.stageProgress
      ? Math.max(...effectiveProfile.stageProgress)
      : 1
    : 1;
  const currentStage = stages.find((s) => s.order === currentStageNum) || stages[0];

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
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
          <ShieldAlert className="size-6" />
        </div>
        <p className="text-sm font-bold text-foreground">Modules temporarily unavailable</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          {modulesError} We usually show an offline catalogue — if you still see this,
          retry in a moment.
        </p>
        <Button
          onClick={refreshModules}
          variant="outline"
          size="sm"
          className="mt-2 rounded-lg text-xs font-bold focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
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

  return (
    <div className="w-full bg-background">
      {/* Offline banner intentionally suppressed — fallback catalogue is seamless to the user. */}

      {activeProfile.language === "SH" && (
        <div className="w-full border-b border-amber-500/20 bg-amber-500/15 px-4 py-1 text-center text-[10px] font-semibold text-amber-600">
          {text.shengComingSoon}
        </div>
      )}

      <div className="min-w-0">
        {tab === "home" && (
          <SyllabusLibraryHome
            stages={stages}
            recommended={isLoggedIn ? recommended : []}
            greeting={
              isLoggedIn && effectiveProfile?.county
                ? `Welcome back — recommendations for ${effectiveProfile.county} and your learning path.`
                : isLoggedIn
                  ? "Welcome back — a free syllabus with picks based on your profile."
                  : undefined
            }
          />
        )}

        {tab === "learn" && currentStage && (
          <LearnModulesView
            profile={activeProfile}
            stages={stages}
            currentStage={currentStage}
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
