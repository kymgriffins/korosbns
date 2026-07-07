import Image from "next/image";
import Link from "next/link";
import { Clock, GraduationCap } from "lucide-react";
import type { LmsCourse } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";
import { getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/lms/progress-bar";

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
        className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[180px]">
            <Image src={course.heroImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center gap-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Continue learning</p>
            <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary">{course.title}</h3>
            <ProgressBar completed={completed} total={total} />
            <span className="text-sm font-medium text-primary">Resume →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
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
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
          </div>
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {course.durationMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="size-3.5" />
            {course.instructor}
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
