"use client";

import { useMemo } from "react";

const GAMIFIED_AGES = ["under_18", "18_25"];

export type ContentMode = "gamified" | "professional";

type ContentModeFeatures = {
  mode: ContentMode;
  showBadgeAnimations: boolean;
  showLeaderboards: boolean;
  showFunChallenges: boolean;
  showSubtleXp: boolean;
  showAchievementCertificates: boolean;
  useProfessionalStyling: boolean;
};

export function useContentMode(): ContentModeFeatures {
  const ageRange = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("bns_user_profile");
      if (!stored) return null;
      const profile = JSON.parse(stored);
      return profile.ageRange || null;
    } catch {
      return null;
    }
  }, []);

  return useMemo(() => {
    const isGamified = ageRange ? GAMIFIED_AGES.includes(ageRange) : true;

    return {
      mode: isGamified ? "gamified" : "professional",
      showBadgeAnimations: isGamified,
      showLeaderboards: isGamified,
      showFunChallenges: isGamified,
      showSubtleXp: !isGamified,
      showAchievementCertificates: !isGamified,
      useProfessionalStyling: !isGamified,
    };
  }, [ageRange]);
}
