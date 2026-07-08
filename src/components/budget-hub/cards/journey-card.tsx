import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { HubContentItem } from "@/components/budget-hub/tokens/types";

export function JourneyCard({
  item,
  progress = 0,
  difficulty = "Beginner",
  className,
}: {
  item: HubContentItem;
  progress?: number;
  difficulty?: string;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "budget-hub-card-hover flex flex-col overflow-hidden rounded-xl bg-[var(--bh-surface)] ring-1 ring-[var(--bh-border)]",
        className,
      )}
    >
      <div className="relative aspect-[16/9] bg-muted">
        <Image
          src={item.imageUrl || "/images/explainer-formulation.png"}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge
          variant="outline"
          className="w-fit rounded-full text-[11px] font-medium"
        >
          {difficulty}
        </Badge>
        <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
        {item.excerpt ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.excerpt}
          </p>
        ) : null}
        {progress > 0 ? (
          <div className="mt-auto space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
