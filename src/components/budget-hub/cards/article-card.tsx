import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils";
import { MetadataRow } from "@/components/budget-hub/article/metadata-row";
import {
  formatHubDate,
  type HubContentItem,
} from "@/components/budget-hub/tokens/types";
import { Clock } from "lucide-react";

export function ArticleCard({
  item,
  className,
}: {
  item: HubContentItem;
  className?: string;
}) {
  const metadata = [
    item.readTime
      ? { icon: <Clock className="size-3.5" />, label: item.readTime }
      : null,
    item.publishedAt ? { label: formatHubDate(item.publishedAt) } : null,
  ].filter(Boolean) as { icon?: React.ReactNode; label: string }[];

  return (
    <article className={cn("group", className)}>
      <Link
        href={item.href}
        className="budget-hub-card-hover flex h-full flex-col gap-3"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.imageUrl || "/images/community-pulse.png"}
            alt=""
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {item.category ? (
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--bh-accent-warm)]">
              {item.category}
            </span>
          ) : null}
          <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--bh-accent-warm)]">
            {item.title}
          </h3>
          {item.excerpt ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.excerpt}
            </p>
          ) : null}
          <MetadataRow items={metadata} className="mt-auto pt-1" />
        </div>
      </Link>
    </article>
  );
}