import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LearningHubCardProps {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  meta?: string;
  disabled?: boolean;
}

export function LearningHubCard({ title, description, href, icon, badge: badgeText, meta, disabled }: LearningHubCardProps) {
  return (
    <Card className={cn("group relative flex flex-col", disabled && "pointer-events-none opacity-50")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
            <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
          </div>
          {badgeText && (
            <Badge variant="secondary" className="shrink-0 text-[10px] uppercase leading-none">
              {badgeText}
            </Badge>
          )}
        </div>
      </CardHeader>
      {description && (
        <CardContent className="pb-3">
          <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex items-center justify-between">
        {meta && <span className="text-[11px] text-muted-foreground">{meta}</span>}
        {!disabled && (
          <Link
            href={href}
            className="ml-auto text-[11px] font-medium text-primary hover:underline"
          >
            View
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
