import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils";
import { MetadataRow } from "@/components/budget-hub/article/metadata-row";
import {
  formatHubDate,
  type HubContentItem,
} from "@/components/budget-hub/tokens/types";
import { Clock } from "lucide-react";

export function FeaturedCard({
  item,
  className,
}: {
  item: HubContentItem;
  className?: string;
}) {
  const metadata = [
    item.category ? { label: item.category } : null,
    item.readTime
      ? { icon: <Clock className="size-3.5" />, label: item.readTime }
      : null,
    item.publishedAt ? { label: formatHubDate(item.publishedAt) } : null,
  ].filter(Boolean) as { icon?: React.ReactNode; label: string }[];

  return (
    <Link
      href={item.href}
      className={cn(
        "budget-hub-card-hover group flex flex-col gap-5",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted sm:aspect-auto sm:h-96">
        <Image
          src={item.imageUrl || "/images/explainer-formulation.png"}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>
      <div className="space-y-3">
        <MetadataRow items={metadata} />
        <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-[var(--bh-accent-warm)] md:text-3xl">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
