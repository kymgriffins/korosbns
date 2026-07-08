import Image from "next/image";
import Link from "next/link";
import { Clock, GraduationCap } from "lucide-react";
import type { LmsCourse } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";
import { getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/lms/progress-bar";
import { LMS_RADIUS } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

type CourseCardProps = {
  course: LmsCourse;
  variant?: "grid" | "continue";
};

export function CourseCard({ course, variant = "grid" }: CourseCardProps) {
  const total = getTotalLessons(course);
  const completed = getCompletedLessonsCount(course);
  const href = LmsRoutes.course(course.slug);

  if (variant === "continue") {
    return (
      <Link
        href={href}
        className={cn(
          "group block overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          LMS_RADIUS.card,
        )}
      >
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[180px]">
            <Image src={course.heroImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Continue learning</p>
            <h3 className="text-xl font-semibold tracking-tight">{course.title}</h3>
            <ProgressBar completed={completed} total={total} />
            <span className="text-sm font-medium text-foreground">Resume →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ljp-surface">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={course.heroImage}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={LMS_RADIUS.badge}>
              {course.category}
            </Badge>
            <Badge variant="outline" className={LMS_RADIUS.badge}>
              {course.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ProgressBar completed={completed} total={total} />
          <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {course.durationMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="size-3.5" />
            {course.instructor}
          </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
