import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { ProgressBar } from "@/components/lms/progress-bar";
import { CourseCard } from "@/components/lms/course-card";
import { LMS_COURSES } from "@/data/lms/catalog";
import { getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import { Flame, Award } from "lucide-react";

export const metadata = {
  title: "Progress | Learn",
};

export default function ProgressPage() {
  const totalLessons = LMS_COURSES.reduce((sum, c) => sum + getTotalLessons(c), 0);
  const completedLessons = LMS_COURSES.reduce((sum, c) => sum + getCompletedLessonsCount(c), 0);

  return (
    <LmsPage className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
        <p className="text-muted-foreground">Track milestones across your courses.</p>
      </header>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <ProgressBar completed={completedLessons} total={totalLessons} label="Overall progress" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <Flame className="mb-2 size-5 text-orange-500" />
          <p className="text-2xl font-semibold">3</p>
          <p className="text-sm text-muted-foreground">Day streak</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <Award className="mb-2 size-5 text-primary" />
          <p className="text-2xl font-semibold">2</p>
          <p className="text-sm text-muted-foreground">Certificates earned</p>
        </div>
      </div>

      <LmsSection title="Your courses">
        <div className="space-y-5">
          {LMS_COURSES.map((course) => (
            <div key={course.slug} className="space-y-3">
              <ProgressBar
                completed={getCompletedLessonsCount(course)}
                total={getTotalLessons(course)}
                label={course.title}
              />
              <CourseCard course={course} variant="continue" />
            </div>
          ))}
        </div>
      </LmsSection>
    </LmsPage>
  );
}
