import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function envFlag(name: string, fallback = true): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  return !["0", "false", "off", "no"].includes(raw.toLowerCase());
}

/**
 * Web Analytics + Speed Insights for the citizen app.
 * Turn on both features in the Vercel project dashboard.
 * Optional toggles: NEXT_PUBLIC_VERCEL_ANALYTICS, NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS.
 *
 * Admin traffic charts use Django-synced Vercel Query API data
 * (VERCEL_API_TOKEN / VERCEL_PROJECT_ID / VERCEL_TEAM_ID on bnske).
 */
export function SiteAnalytics() {
  const analyticsEnabled = envFlag("NEXT_PUBLIC_VERCEL_ANALYTICS", true);
  const speedInsightsEnabled = envFlag("NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS", true);

  return (
    <>
      {analyticsEnabled ? <Analytics /> : null}
      {speedInsightsEnabled ? <SpeedInsights /> : null}
    </>
  );
}
