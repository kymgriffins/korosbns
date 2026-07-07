import { FileText, Link2 } from "lucide-react";
import type { LmsResource } from "@/data/lms/types";
import { cn } from "@/utils";

type ResourcesSectionProps = {
  resources: LmsResource[];
  className?: string;
};

export function ResourcesSection({ resources, className }: ResourcesSectionProps) {
  if (!resources.length) return null;

  return (
    <details className={cn("rounded-2xl border border-border/60 bg-card shadow-sm", className)}>
      <summary className="cursor-pointer px-5 py-4 text-sm font-semibold">Resources ({resources.length})</summary>
      <ul className="space-y-2 border-t border-border/60 px-3 py-3">
        {resources.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
              target={resource.kind === "link" ? "_blank" : undefined}
              rel={resource.kind === "link" ? "noopener noreferrer" : undefined}
            >
              {resource.kind === "pdf" ? (
                <FileText className="size-4 text-muted-foreground" />
              ) : (
                <Link2 className="size-4 text-muted-foreground" />
              )}
              <span className="font-medium">{resource.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
