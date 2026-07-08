import Link from "next/link";
import { cn } from "@/utils";
import type { MetadataItem } from "@/components/budget-hub/tokens/types";

export function MetadataRow({
  items,
  className,
}: {
  items: MetadataItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {items.map((item, i) => {
        const content = (
          <span className="inline-flex items-center gap-1.5">
            {item.icon}
            {item.label}
          </span>
        );
        return item.href ? (
          <Link
            key={`${item.label}-${i}`}
            href={item.href}
            className="hover:text-foreground"
          >
            {content}
          </Link>
        ) : (
          <span key={`${item.label}-${i}`}>{content}</span>
        );
      })}
    </div>
  );
}
