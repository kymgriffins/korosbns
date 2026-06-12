"use client";

import { useEffect, useRef } from "react";

const POLL_INTERVAL_MS = 5000;

export function EmailHookPoller() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch("/api/email-hooks/notify", { method: "POST" });
        if (!res.ok) {
          console.warn("[EmailHookPoller] poll failed", res.status);
        }
      } catch {
      }
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
