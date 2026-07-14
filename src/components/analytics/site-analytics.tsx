import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function envFlag(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  return !["0", "false", "off", "no"].includes(raw.toLowerCase());
}

/**
 * Optional Vercel-hosted collection scripts.
 * Default ON only when deployed on Vercel (`VERCEL=1`).
 * On a VPS, leave these off — BNS first-party tracker (PageviewBeacon) is enough.
 */
export function SiteAnalytics() {
  const onVercel = process.env.VERCEL === "1";
  const analyticsEnabled = envFlag("NEXT_PUBLIC_VERCEL_ANALYTICS", onVercel);
  const speedInsightsEnabled = envFlag("NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS", onVercel);

  return (
    <>
      {analyticsEnabled ? <Analytics /> : null}
      {speedInsightsEnabled ? <SpeedInsights /> : null}
    </>
  );
}
