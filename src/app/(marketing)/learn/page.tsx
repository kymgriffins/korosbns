import Link from "next/link";
import { Flame, Target } from "lucide-react";
import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { CourseCard } from "@/components/lms/course-card";
import { AchievementCard } from "@/components/lms/achievement-card";
import { LMS_ACHIEVEMENTS, LMS_COURSES } from "@/data/lms/catalog";
import { LmsRoutes } from "@/data/lms/routes";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Learn | Budget Ndio Story",
  description: "Continue your civic learning journey.",
};

export default function LearnHomePage() {
  const continueCourse = LMS_COURSES[0];
  const recent = LMS_COURSES.slice(0, 2);
  const unlockedAchievements = LMS_ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 2);

  return (
    <LmsPage className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Your learning journey</h1>
        <p className="max-w-2xl text-muted-foreground">
          Pick up where you left off. Every lesson is designed for mobile-first, distraction-free civic education.
        </p>
      </header>

      {continueCourse ? <CourseCard course={continueCourse} variant="continue" /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
              <Flame className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Daily goal</p>
              <p className="font-semibold">15 min today</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">3 day streak</p>
              <p className="font-semibold">Keep it going</p>
            </div>
          </div>
        </div>
      </div>

      <LmsSection title="Recently viewed" description="Courses you opened recently">
        <div className="grid gap-5 md:grid-cols-2">
          {recent.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </LmsSection>

      <LmsSection title="Recommended" description="Start with civic fundamentals">
        <div className="grid gap-5 md:grid-cols-2">
          {LMS_COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href={LmsRoutes.catalogue}>Browse all courses</Link>
        </Button>
      </LmsSection>

      <LmsSection title="Recent achievements">
        <div className="grid gap-4 md:grid-cols-2">
          {unlockedAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
        <Button asChild variant="ghost" className="mt-2">
          <Link href={LmsRoutes.achievements}>View all achievements</Link>
        </Button>
      </LmsSection>
    </LmsPage>
  );
}
