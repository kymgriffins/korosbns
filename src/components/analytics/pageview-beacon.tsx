"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { buildApiUrl } from "@/lib/api-url";

const SESSION_KEY = "bns_analytics_session";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
}

function trackPageview(path: string, referrer: string) {
  const payload = {
    event_name: "pageview",
    payload: {
      path,
      referrer: referrer || "",
      source: "beacon",
      session_id: getOrCreateSessionId(),
      href: typeof window !== "undefined" ? window.location.href : path,
    },
  };

  const endpoint = buildApiUrl("/track/event/");
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }
  } catch {
    /* fall through to fetch */
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => {
    /* never break navigation for analytics */
  });
}

/**
 * Global first-party pageview warehouse beacon.
 * Stores every route change into Django AnalyticsEvent immediately.
 */
export function PageviewBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    if (!path || path === lastPath.current) return;
    lastPath.current = path;
    trackPageview(path, typeof document !== "undefined" ? document.referrer : "");
  }, [pathname, searchParams]);

  return null;
}
