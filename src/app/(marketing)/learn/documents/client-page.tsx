"use client";

import { useEffect, useState } from "react";
import { LearnDocumentsView } from "@/components/learn/learn-documents-view";
import { type LearnHubProfile } from "@/lib/learn-data";

const GUEST_PROFILE: LearnHubProfile = {
  userId: "guest",
  breakName: "Citizen Guest",
  pseudoName: "Guest",
  county: "National",
  ward: "",
  language: "EN",
  notifications: false,
  whatsappFallback: false,
  phone: "",
  consentGranted: true,
  consentTimestamp: null,
  sovereigns: 0,
  stageProgress: [],
  streakDays: 0,
  lastActive: Date.now(),
  trackedDocs: [],
  badges: [],
  avatar_url: null,
  participationLogs: [],
  interests: [],
};

export function LearnDocumentsPageClient() {
  const [profile, setProfile] = useState<LearnHubProfile>(GUEST_PROFILE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bns_user_profile");
      if (raw) {
        setProfile({ ...GUEST_PROFILE, ...JSON.parse(raw) });
      }
    } catch {
      // Keep guest profile
    }
  }, []);

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <LearnDocumentsView profile={profile} />
    </div>
  );
}
