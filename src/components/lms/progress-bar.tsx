import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";

type ProgressBarProps = {
  completed: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ completed, total, label, className }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label ?? `${completed} / ${total} Lessons`}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
