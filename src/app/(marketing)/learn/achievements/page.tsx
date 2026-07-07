import { LmsPage } from "@/components/lms/lms-page";
import { AchievementCard } from "@/components/lms/achievement-card";
import { LMS_ACHIEVEMENTS } from "@/data/lms/catalog";

export const metadata = {
  title: "Achievements | Learn",
};

export default function AchievementsPage() {
  const unlocked = LMS_ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked = LMS_ACHIEVEMENTS.filter((a) => !a.unlocked);

  return (
    <LmsPage className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          {unlocked.length} of {LMS_ACHIEVEMENTS.length} unlocked
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Unlocked</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {unlocked.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Locked</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {locked.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </LmsPage>
  );
}
