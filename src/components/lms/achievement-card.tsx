import type { LmsAchievement } from "@/data/lms/types";
import { cn } from "@/utils";

type AchievementCardProps = {
  achievement: LmsAchievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border p-4 shadow-sm transition-all duration-200",
        achievement.unlocked
          ? "border-border/60 bg-card"
          : "border-border/60 bg-muted/10 opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {achievement.icon}
        </span>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{achievement.title}</h3>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {achievement.unlocked ? "Unlocked" : "Locked"}
          </p>
        </div>
      </div>
    </article>
  );
}
