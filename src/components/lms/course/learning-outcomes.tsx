/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */
import { Check } from "lucide-react";
import type { LmsCourse } from "@/data/lms/types";
import { LMS_TYPE } from "@/constants/lms-design-tokens";
import { resolveLearningOutcomes } from "./format-journey-time";
import { cn } from "@/utils";

type LearningOutcomesProps = {
  course: LmsCourse;
  journeyComplete?: boolean;
  className?: string;
};

export function LearningOutcomes({
  course,
  journeyComplete = false,
  className,
}: LearningOutcomesProps) {
  const outcomes = resolveLearningOutcomes(course);
  if (outcomes.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)} aria-labelledby="learning-outcomes-heading">
      <h2 id="learning-outcomes-heading" className={cn(LMS_TYPE.h3, "font-semibold tracking-tight")}>
        What you’ll learn
      </h2>
      <ul className="max-w-prose space-y-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-2">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                journeyComplete ? "text-emerald-600" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span className={cn(LMS_TYPE.body, "text-muted-foreground")}>{outcome}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
