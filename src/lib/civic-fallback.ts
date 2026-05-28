import { getStageTakeaway } from "@/constants/stages-data";

/** Opt-in only: set NEXT_PUBLIC_CIVIC_FALLBACK=true to use bundled STAGES_DATA. */
export const USE_LOCAL_CIVIC_FALLBACK =
  process.env.NEXT_PUBLIC_CIVIC_FALLBACK === "true";

export type StepTakeaway = {
  type: "info" | "warning" | "tip";
  title: string;
  text: string;
};

export function getStepTakeaway(
  stageId: number,
  stepId: number,
  apiTakeaways?: StepTakeaway[],
): StepTakeaway | null {
  if (apiTakeaways?.length) {
    return apiTakeaways[0] ?? null;
  }
  if (!USE_LOCAL_CIVIC_FALLBACK) {
    return null;
  }
  return getStageTakeaway(stageId, stepId);
}
