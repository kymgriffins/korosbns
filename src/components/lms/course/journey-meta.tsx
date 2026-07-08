/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */
import { Clock, GraduationCap, Users, Award } from "lucide-react";
import type { LmsCourse } from "@/data/lms/types";
import { LMS_TYPE } from "@/constants/lms-design-tokens";
import { formatJourneyTime } from "./format-journey-time";
import { cn } from "@/utils";

type JourneyMetaProps = {
  course: LmsCourse;
  className?: string;
};

export function JourneyMeta({ course, className }: JourneyMetaProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground",
        LMS_TYPE.meta,
        className,
      )}
      aria-label="Journey details"
    >
      <li className="inline-flex items-center gap-2">
        <Clock className="size-4 shrink-0" aria-hidden />
        <span>{formatJourneyTime(course.durationMinutes)}</span>
      </li>
      <li className="inline-flex items-center gap-2">
        <GraduationCap className="size-4 shrink-0" aria-hidden />
        <span>{course.difficulty}</span>
      </li>
      {typeof course.citizensCompleted === "number" ? (
        <li className="inline-flex items-center gap-2">
          <Users className="size-4 shrink-0" aria-hidden />
          <span>{course.citizensCompleted.toLocaleString()} citizens completed</span>
        </li>
      ) : null}
      {course.awardsCertificate ? (
        <li className="inline-flex items-center gap-2">
          <Award className="size-4 shrink-0" aria-hidden />
          <span>Certificate available</span>
        </li>
      ) : null}
    </ul>
  );
}
