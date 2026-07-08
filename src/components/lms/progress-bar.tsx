/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * contracts: sic-cap-004@1.0.0,ref-comp-004@1.0.0
 * decision: progress_bar_owns_success_fill — accent green only for meaningful progress (not global Progress)
 */
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { LMS_COLORS, LMS_MOTION, LMS_TYPE } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

type ProgressBarProps = {
  completed: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ completed, total, label, className }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("flex items-center justify-between", LMS_TYPE.caption)}>
        <span className="font-medium text-foreground">
          {label ?? `${completed} of ${total} lessons`}
        </span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <ProgressPrimitive.Root
        value={pct}
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50"
        aria-label={label ?? `${completed} of ${total} lessons`}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 transition-all"
          style={{
            transform: `translateX(-${100 - pct}%)`,
            backgroundColor: LMS_COLORS.reference.success,
            transitionDuration: `${LMS_MOTION.accordionMs}ms`,
          }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
