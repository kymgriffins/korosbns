"use client";

import { useEffect, useState } from "react";
import { LearnDocumentsView } from "@/components/learn/learn-documents-view";
import { DashboardSkeleton } from "@/components/learn/dashboard-skeleton";
import { createGuestBrowseProfile, type LearnHubProfile } from "@/lib/learn-data";

export function LearnDocumentsPageClient() {
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bns_user_profile");
      setProfile(raw ? JSON.parse(raw) : createGuestBrowseProfile());
    } catch {
      setProfile(createGuestBrowseProfile());
    }
  }, []);

  if (!profile) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <LearnDocumentsView profile={profile} />
    </div>
  );
}
