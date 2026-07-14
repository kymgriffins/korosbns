"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISIT_LOG_KEY = "bns_page_visits";
const API_BATCH_LIMIT = 10;

type VisitRecord = {
  path: string;
  entered_at: string;
  duration_seconds: number;
};

function getStoredVisits(): VisitRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VISIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeVisit(record: VisitRecord) {
  try {
    const visits = getStoredVisits();
    visits.push(record);
    while (visits.length > API_BATCH_LIMIT * 3) visits.shift();
    localStorage.setItem(VISIT_LOG_KEY, JSON.stringify(visits));
  } catch {
    /* storage full — silently drop */
  }
}

/** Local duration log. Sitewide DB warehouse is handled by PageviewBeacon. */
export function usePageView() {
  const pathname = usePathname();
  const startRef = useRef(Date.now());
  const pathRef = useRef(pathname);

  useEffect(() => {
    const prevPath = pathRef.current;
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);

    if (prevPath && elapsed > 0) {
      storeVisit({
        path: prevPath,
        entered_at: new Date(Date.now() - elapsed * 1000).toISOString(),
        duration_seconds: elapsed,
      });
    }

    startRef.current = Date.now();
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const elapsed = Math.round((Date.now() - startRef.current) / 1000);
      if (elapsed > 0) {
        storeVisit({
          path: pathname,
          entered_at: new Date(Date.now() - elapsed * 1000).toISOString(),
          duration_seconds: elapsed,
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);
}

export function getPageVisits(): VisitRecord[] {
  return getStoredVisits();
}

export function clearPageVisits() {
  localStorage.removeItem(VISIT_LOG_KEY);
}
