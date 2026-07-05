"use client";

import { useEffect, useState } from "react";
import { LearnDocumentsView } from "@/features/learn/views/learn-documents-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";
import { type LearnHubProfile } from "@/lib/learn-data";

export function LearnDocumentsPageClient() {
  const [profile, setProfile] = useState<LearnHubProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bns_user_profile");
      setProfile(raw ? JSON.parse(raw) : null);
    } catch {
      setProfile(null);
    }
  }, []);

  if (!profile) {
    return <LearnStudioLoading />;
  }

  return (
    <div className="mx-auto h-[calc(100dvh-8rem)] max-w-5xl md:h-auto">
      <LearnDocumentsView profile={profile} />
    </div>
  );
}
