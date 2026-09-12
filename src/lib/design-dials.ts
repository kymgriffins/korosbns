/**
 * Design dials for marketing surfaces (design-taste hard rules).
 * MOTION_INTENSITY > 4 means the page must actually animate.
 * Prefer 3 (static) over a half-built motion dial.
 */
export const MOTION_INTENSITY = 5;

export function motionEnabled(reduceMotion?: boolean | null): boolean {
  if (reduceMotion) return false;
  return MOTION_INTENSITY > 4;
}
