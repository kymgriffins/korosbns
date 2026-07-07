import type { LmsAchievement } from "@/data/lms/types";
import { cn } from "@/utils";

type AchievementCardProps = {
  achievement: LmsAchievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition-all duration-200",
        achievement.unlocked
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-muted/20 opacity-70",
      )}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden>
          {achievement.icon}
        </span>
        <div>
          <h3 className="font-semibold">{achievement.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {achievement.unlocked ? "Unlocked" : "Locked"}
          </p>
        </div>
      </div>
    </article>
  );
}
