"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLearn } from "@/contexts/learn-context";
import { learnTabFromLocation } from "@/lib/learn-nav";

/** Keeps LearnProvider activeTab in sync with hub routes / query params. */
export function LearnTabSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setActiveTab } = useLearn();

  useEffect(() => {
    const tab = learnTabFromLocation(pathname, searchParams.get("tab"));
    if (tab !== null) {
      setActiveTab(tab);
    }
  }, [pathname, searchParams, setActiveTab]);

  return null;
}
