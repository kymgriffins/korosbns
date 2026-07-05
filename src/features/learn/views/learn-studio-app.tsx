"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLearn } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { useGamificationMe } from "@/hooks/use-gamification";
import { learnTabToHref } from "@/lib/learn-nav";
import type { CivicModule } from "@/types/learn";
import type { LearnHubLanguage, LearnHubProfile } from "@/lib/learn-data";
import { readProgress } from "@/lib/module-progress";
import { LearnStageReader } from "../reader/learn-stage-reader";
import { LearnHomeView } from "./learn-home-view";
import { LearnCurriculumView } from "./learn-curriculum-view";
import { LearnStudioLoading, LearnStudioError, LearnStudioEmpty } from "./learn-studio-states";
import { LearnAlertsView } from "./learn-alerts-view";
import { LearnProfileView } from "./learn-profile-view";
import { LearnForumView } from "./learn-forum-view";
import { LearnDocumentsView } from "./learn-documents-view";
import { StudioPage } from "../components/studio-page";
import { StudioPageHeader } from "../components/studio-page-header";
import { ProfileGlow } from "../illustrations/profile-glow";

function emptyGuestProfile(): LearnHubProfile {
  return {
    userId: "",
    breakName: "Guest",
    pseudoName: "guest",
    avatar_url: null,
    county: "Kenya",
    ward: "",
    language: "EN",
    notifications: false,
    whatsappFallback: false,
    phone: "",
    consentGranted: false,
    consentTimestamp: null,
    badges: [],
    stageProgress: [],
    streakDays: 0,
    lastActive: Date.now(),
    trackedDocs: [],
    sovereigns: 0,
  };
}

function profileFromAuthUser(authUser: NonNullable<ReturnType<typeof useAuth>["user"]>): LearnHubProfile {
  return {
    userId: authUser.id || "",
    breakName:
      authUser.break_name ||
      authUser.display_name ||
      `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() ||
      authUser.email ||
      "Citizen",
    pseudoName: authUser.pseudo_name || authUser.display_name || "citizen",
    avatar_url: authUser.avatar_url || authUser.avatar || null,
    county: authUser.county || "Kenya",
    ward: authUser.ward || "",
    language: (authUser.language_preference as LearnHubLanguage) || "EN",
    notifications: true,
    whatsappFallback: false,
    phone: "",
    consentGranted: false,
    consentTimestamp: null,
    badges: [],
    stageProgress: [],
    streakDays: 0,
    lastActive: Date.now(),
    trackedDocs: [],
    sovereigns: 0,
  };
}

export function LearnStudioApp() {
  const router = useRouter();
  const { isLoggedIn, user: authUser, loading: authLoading } = useAuth();
  const {
    civicModules: stages,
    activeTab,
    setActiveTab,
    setActiveLesson,
    modulesLoading,
    modulesError,
    refreshModules,
    gamification,
  } = useLearn();

  const [profile, setProfile] = useState<LearnHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<CivicModule | null>(null);
  const { data: gamificationMe } = useGamificationMe();

  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn && authUser) {
      const stored = localStorage.getItem("bns_user_profile");
      let current: LearnHubProfile | null = null;
      if (stored) {
        try {
          current = JSON.parse(stored) as LearnHubProfile;
        } catch {
          current = null;
        }
      }
      if (!current || current.userId !== authUser.id) {
        current = profileFromAuthUser(authUser);
        localStorage.setItem("bns_user_profile", JSON.stringify(current));
      }
      setProfile(current);
    } else {
      setProfile(emptyGuestProfile());
    }
    setLoading(false);
  }, [authLoading, isLoggedIn, authUser]);

  const currentStage = useMemo(() => {
    if (!stages.length) return null;
    let best: CivicModule | null = null;
    let bestProgress = -1;
    for (const stage of stages) {
      const p = readProgress(stage.slug, stage.order);
      const total = stage.steps?.length ?? 0;
      const done = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
      const pct = total ? done / total : 0;
      if (pct < 1 && pct > bestProgress) {
        bestProgress = pct;
        best = stage;
      }
    }
    return best ?? stages[0];
  }, [stages]);

  useEffect(() => {
    if (!selectedStage) {
      setActiveLesson(null);
      return;
    }
    const p = readProgress(selectedStage.slug, selectedStage.order);
    const completedStepIds: number[] = [];
    for (const step of selectedStage.steps ?? []) {
      if (p.stepsCompleted[step.order]) completedStepIds.push(step.order);
    }
    setActiveLesson({
      stageId: selectedStage.slug,
      stageTitle: selectedStage.title,
      stageBadge: selectedStage.badge,
      stageOrder: selectedStage.order,
      currentStep: 0,
      totalSteps: selectedStage.steps?.length ?? 0,
      completedStepIds,
      stepTitles: (selectedStage.steps ?? []).map((s) => ({ id: s.order, title: s.title })),
    });
  }, [selectedStage, setActiveLesson]);

  const waitingProfile = isLoggedIn && !profile;
  if (authLoading || loading || modulesLoading || waitingProfile) {
    return <LearnStudioLoading />;
  }
  if (modulesError) {
    return <LearnStudioError message={modulesError} onRetry={() => void refreshModules()} />;
  }
  if (!stages.length) {
    return <LearnStudioEmpty />;
  }

  const activeProfile = profile!;
  const points = gamificationMe?.points ?? gamification?.points ?? activeProfile.sovereigns ?? 0;
  const level = gamificationMe?.level ?? gamification?.level ?? 1;
  const streak = gamificationMe?.streak_days ?? activeProfile.streakDays ?? 0;

  if (selectedStage) {
    const idx = stages.findIndex((s) => s.slug === selectedStage.slug);
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background md:relative md:inset-auto md:z-auto md:min-h-0">
        <LearnStageReader
          stage={selectedStage}
          profile={activeProfile as unknown as Record<string, unknown>}
          onClose={() => setSelectedStage(null)}
          onUpdateProfile={(updated) => {
            const next = { ...activeProfile, ...updated } as LearnHubProfile;
            setProfile(next);
            localStorage.setItem("bns_user_profile", JSON.stringify(next));
          }}
          hasPrev={idx > 0}
          hasNext={idx < stages.length - 1}
          onPrevStage={() => idx > 0 && setSelectedStage(stages[idx - 1])}
          onNextStage={() => idx < stages.length - 1 && setSelectedStage(stages[idx + 1])}
        />
      </div>
    );
  }

  const openStage = (stage: CivicModule) => setSelectedStage(stage);

  if (activeTab === "learn") {
    return (
      <LearnCurriculumView
        stages={stages}
        currentStage={currentStage}
        onSelectStage={openStage}
        onRefresh={() => void refreshModules()}
      />
    );
  }

  if (activeTab === "profile") {
    return (
      <StudioPage width="default">
        <StudioPageHeader
          eyebrow="Account"
          title="You"
          description="Progress, badges, and learning preferences."
          illustration={<ProfileGlow className="h-24 w-32 opacity-90" />}
        />
        <LearnProfileView
          profile={activeProfile}
          stages={stages}
          onResetProgress={() => {
            localStorage.removeItem("bns_module_progress");
            window.location.reload();
          }}
          onUpdateProfile={(u) => {
            const next = { ...activeProfile, ...u };
            setProfile(next);
            localStorage.setItem("bns_user_profile", JSON.stringify(next));
          }}
        />
      </StudioPage>
    );
  }

  if (activeTab === "alerts") {
    return <LearnAlertsView profile={activeProfile} />;
  }

  if (activeTab === "documents") {
    return (
      <div className="mx-auto h-[calc(100dvh-8rem)] max-w-5xl md:h-auto">
        <LearnDocumentsView profile={activeProfile} />
      </div>
    );
  }

  if (activeTab === "forum") {
    return <LearnForumView />;
  }

  return (
    <LearnHomeView
      stages={stages}
      currentStage={currentStage}
      displayName={activeProfile.breakName || "Learner"}
      points={points}
      level={level}
      streak={streak}
      onContinue={() => currentStage && openStage(currentStage)}
      onBrowsePath={() => {
        setActiveTab("learn");
        router.push(learnTabToHref("learn"));
      }}
      onSelectStage={openStage}
    />
  );
}
