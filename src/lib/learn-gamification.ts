/** Canonical gamification labels for the learn hub UI. */
export const SOVEREIGN_LABEL = "Sovereigns";
export const SOVEREIGN_SHORT = "SVG";

export type GamificationProfileSlice = {
  sovereigns?: number;
  streakDays?: number;
};

export type GamificationApiSlice = {
  points?: number;
  level?: number;
  streak_days?: number;
};

export function resolveGamification(
  profile?: GamificationProfileSlice | null,
  api?: GamificationApiSlice | null,
) {
  const points = api?.points ?? profile?.sovereigns ?? 0;
  const level = api?.level ?? Math.floor(points / 100) + 1;
  const xpIntoLevel = points % 100;
  const streak = api?.streak_days ?? profile?.streakDays ?? 0;
  return { points, level, xpIntoLevel, streak };
}

export function formatSovereigns(points: number, opts?: { short?: boolean }) {
  const label = opts?.short ? SOVEREIGN_SHORT : SOVEREIGN_LABEL;
  return `${points.toLocaleString()} ${label}`;
}

export function formatSovereignGain(amount: number) {
  return `+${amount} ${SOVEREIGN_SHORT}`;
}
