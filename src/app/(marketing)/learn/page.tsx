import Link from "next/link";
import { LmsPage, LmsSection } from "@/components/lms/lms-page";
import { CourseCard } from "@/components/lms/course-card";
import { AchievementCard } from "@/components/lms/achievement-card";
import { ContinueCard } from "@/components/lms/home/continue-card";
import { LMS_ACHIEVEMENTS, LMS_COURSES } from "@/data/lms/catalog";
import { LmsRoutes } from "@/data/lms/routes";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Learn | Budget Ndio Story",
  description: "Continue your civic learning journey.",
};

export default function LearnHomePage() {
  const recent = LMS_COURSES.slice(0, 2);
  const unlockedAchievements = LMS_ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 2);

  return (
    <LmsPage className="space-y-16 md:space-y-20">
      <header className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Good evening</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Welcome back</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Continue where you left off. Build civic confidence one focused lesson at a time.
        </p>
      </header>

      <ContinueCard courses={LMS_COURSES} />

      <LmsSection title="Continue where you left off" description="Courses you opened recently">
        <div className="grid gap-5 md:grid-cols-2">
          {recent.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </LmsSection>

      <LmsSection title="Continue exploring" description="Start with civic fundamentals">
        <div className="grid gap-5 md:grid-cols-2">
          {LMS_COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href={LmsRoutes.catalogue}>Browse all courses</Link>
        </Button>
      </LmsSection>

      <LmsSection title="Milestones">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
