"use client";

import { useEffect, useState } from "react";
import { LearnDocumentsView } from "@/components/learn/learn-documents-view";
import { DashboardSkeleton } from "@/components/learn/dashboard-skeleton";

export function LearnDocumentsPageClient() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bns_user_profile");
      setProfile(raw ? JSON.parse(raw) : null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center min-h-[50vh]">
        <p className="text-sm font-bold text-foreground">Documents</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Set up your citizen profile on the dashboard to track documents and commentaries.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <LearnDocumentsView profile={profile} />
    </div>
  );
}
