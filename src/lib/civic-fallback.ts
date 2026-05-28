/** Civic fallback is deprecated. All content comes from the API. */
export const USE_LOCAL_CIVIC_FALLBACK = false;

export function getStepTakeaway(
  _stageId: number,
  _stepId: number,
  apiTakeaways?: Array<{ type: string; title: string; text: string }>,
): { type: string; title: string; text: string } | null {
  if (apiTakeaways?.length) {
    return apiTakeaways[0] ?? null;
  }
  return null;
}
