import { LmsPage } from "@/components/lms/lms-page";
import { CourseDetailSkeleton } from "@/components/lms/course/course-detail-skeleton";

/** SIC-CAP-004 §11 — route-level loading / slow network */
export default function CourseDetailLoading() {
  return (
    <LmsPage>
      <CourseDetailSkeleton />
    </LmsPage>
  );
}
