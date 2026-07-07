import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type LessonFooterProps = {
  prevHref?: string;
  nextHref?: string;
  className?: string;
};

export function LessonFooter({ prevHref, nextHref, className }: LessonFooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap gap-2">
        {prevHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={prevHref}>
              <ArrowLeft className="mr-1 size-4" />
              Previous
            </Link>
          </Button>
        ) : null}
        <Button variant="ghost" size="sm">
          <Download className="mr-1 size-4" />
          Resources
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="mr-1 size-4" />
          Discussion
        </Button>
        <Button variant="secondary" size="sm">
          <CheckCircle className="mr-1 size-4" />
          Mark complete
        </Button>
      </div>
      {nextHref ? (
        <Button asChild className="w-full sm:w-auto">
          <Link href={nextHref}>
            Next lesson
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      ) : null}
    </footer>
  );
}
