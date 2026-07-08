/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */
import { LMS_LAYOUT, LMS_RADIUS } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("animate-pulse bg-muted/60", className)} style={style} />;
}

/** SIC-CAP-004 §11 — hero 60/40 shell + 3 module skeletons */
export function CourseDetailSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading journey">
      <Bone className="h-4 w-48 rounded" />

      <div
        className={cn(
          "overflow-hidden border border-border/60 bg-card shadow-sm",
          LMS_RADIUS.cardLg,
        )}
      >
        <div className="grid gap-0 lg:grid-cols-[3fr_2fr]">
          <Bone
            className="aspect-[16/10] w-full lg:aspect-auto"
            style={{ minHeight: LMS_LAYOUT.heroDesktopMinHeight }}
          />
          <div className="space-y-4 p-6 lg:p-8">
            <div className="flex gap-2">
              <Bone className="h-6 w-24 rounded-full" />
              <Bone className="h-6 w-20 rounded-full" />
            </div>
            <Bone className="h-10 w-3/4 rounded" />
            <Bone className="h-4 w-full rounded" />
            <Bone className="h-4 w-2/3 rounded" />
            <Bone className="h-2 w-full rounded-full" />
            <Bone className={cn("h-11 w-full sm:w-40", LMS_RADIUS.button)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Bone className="h-8 w-56 rounded" />
        <Bone className="h-4 w-full max-w-prose rounded" />
        <Bone className="h-4 w-5/6 max-w-prose rounded" />
      </div>

      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Bone key={i} className={cn("h-24 w-full", LMS_RADIUS.card)} />
        ))}
      </div>
    </div>
  );
}
