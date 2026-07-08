/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: sic-cap-004@1.0.0
 */
import Link from "next/link";
import { LmsRoutes } from "@/data/lms/routes";
import { LMS_TYPE } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

type JourneyBreadcrumbProps = {
  title: string;
  className?: string;
};

export function JourneyBreadcrumb({ title, className }: JourneyBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(LMS_TYPE.caption, "text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href={LmsRoutes.home} className="hover:text-foreground">
            Learn
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li className="font-medium text-foreground">{title}</li>
      </ol>
    </nav>
  );
}
