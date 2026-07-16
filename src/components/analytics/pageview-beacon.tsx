"use client";

/**
 * BNS first-party site tracker — VPS-ready, no third party required.
 *
 * Every SPA route change (and page leave duration) is POSTed to Django
 * `POST /api/v1/track/event/` and stored in AnalyticsEvent forever.
 * Admin `/dashboard/analytics` rolls these into day snapshots.
 */

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { buildApiUrl } from "@/lib/api-url";

const VISITOR_KEY = "bns_vid";
const SESSION_KEY = "bns_sid";

function envEnabled(name: string, fallback = true): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  return !["0", "false", "off", "no"].includes(raw.toLowerCase());
}

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `bns-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getOrCreate(storage: Storage, key: string): string {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = uuid();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return uuid();
  }
}

function visitorId(): string {
  if (typeof window === "undefined") return "";
  return getOrCreate(window.localStorage, VISITOR_KEY);
}

function sessionId(): string {
  if (typeof window === "undefined") return "";
  return getOrCreate(window.sessionStorage, SESSION_KEY);
}

const GEO_KEY = "bns_geo";

type GeoLocation = {
  country: string;
  country_code: string;
  region: string;
  city: string;
};

function cachedGeo(): GeoLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GEO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeGeo(geo: GeoLocation) {
  try {
    sessionStorage.setItem(GEO_KEY, JSON.stringify(geo));
  } catch {
    /* noop */
  }
}

let geoPromise: Promise<GeoLocation | null> | null = null;

function fetchGeo(): Promise<GeoLocation | null> {
  if (geoPromise) return geoPromise;
  geoPromise = fetch("https://ip-api.com/json/?fields=country,countryCode,regionName,city", {
    signal: AbortSignal.timeout(5000),
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data: Record<string, unknown> | null) => {
      if (!data || !data.countryCode) return null;
      const geo: GeoLocation = {
        country: String(data.country || ""),
        country_code: String(data.countryCode || ""),
        region: String(data.regionName || ""),
        city: String(data.city || ""),
      };
      storeGeo(geo);
      return geo;
    })
    .catch(() => null);
  return geoPromise;
}

function deviceHints() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {};
  }
  const ua = navigator.userAgent || "";
  let device_type = "Desktop";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) device_type = "Mobile";
  else if (/iPad|Tablet/i.test(ua)) device_type = "Tablet";

  let os_name = "Unknown";
  if (/Windows/i.test(ua)) os_name = "Windows";
  else if (/Android/i.test(ua)) os_name = "Android";
  else if (/iPhone|iPad|iPod|Mac OS/i.test(ua) && /Mobile/i.test(ua)) os_name = "iOS";
  else if (/Mac OS/i.test(ua)) os_name = "Mac";
  else if (/Linux/i.test(ua)) os_name = "Linux";

  let browser_name = "Unknown";
  if (/Edg\//i.test(ua)) browser_name = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser_name = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser_name = "Safari";
  else if (/Firefox\//i.test(ua)) browser_name = "Firefox";

  return {
    device_type,
    os_name,
    browser_name,
    language: navigator.language || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  };
}

function postEvent(event_name: string, payload: Record<string, unknown>) {
  const body = JSON.stringify({
    event_name,
    payload: {
      ...payload,
      source: "bns-tracker",
      visitor_id: visitorId(),
      session_id: sessionId(),
    },
  });
  const endpoint = buildApiUrl("/track/event/");

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }
  } catch {
    /* fall through */
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => undefined);
}

function geoHints(): Record<string, unknown> {
  const geo = cachedGeo();
  if (!geo) return {};
  return {
    country: geo.country,
    country_code: geo.country_code,
    county: geo.region,
    town: geo.city,
  };
}

function trackPageview(path: string, referrer: string) {
  postEvent("pageview", {
    path,
    referrer: referrer || "",
    href: typeof window !== "undefined" ? window.location.href : path,
    ...deviceHints(),
    ...geoHints(),
  });
}

function trackPageleave(path: string, durationSeconds: number) {
  if (durationSeconds < 1) return;
  postEvent("pageleave", {
    path,
    duration_seconds: durationSeconds,
    ...deviceHints(),
    ...geoHints(),
  });
}

/**
 * First-party sitewide tracker. Primary analytics for VPS / self-host.
 * Toggle with NEXT_PUBLIC_BNS_ANALYTICS (default on).
 */
export function PageviewBeacon() {
  const enabled = envEnabled("NEXT_PUBLIC_BNS_ANALYTICS", true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>("");
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) return;

    if (!cachedGeo()) void fetchGeo();

    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    if (!path) return;

    const prev = lastPath.current;
    const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
    if (prev && prev !== path) {
      trackPageleave(prev, elapsed);
    }

    if (path !== lastPath.current) {
      lastPath.current = path;
      startedAt.current = Date.now();
      trackPageview(path, typeof document !== "undefined" ? document.referrer : "");
    }
  }, [pathname, searchParams, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onLeave = () => {
      const path = lastPath.current;
      if (!path) return;
      const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
      trackPageleave(path, elapsed);
    };

    window.addEventListener("pagehide", onLeave);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [enabled]);

  return null;
}
