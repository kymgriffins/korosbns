"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MetadataRow } from "@/components/budget-hub/article/metadata-row";
import { formatHubDate } from "@/components/budget-hub/tokens/types";
import type { HubContentItem } from "@/components/budget-hub/tokens/types";
import { Clock } from "lucide-react";

export function BudgetHubHero({ featured }: { featured: HubContentItem }) {
  const metadata = [
    featured.category
      ? { label: featured.category }
      : null,
    featured.readTime
      ? { icon: <Clock className="size-3.5" />, label: featured.readTime }
      : null,
    featured.publishedAt
      ? { label: formatHubDate(featured.publishedAt) }
      : null,
  ].filter(Boolean) as { icon?: React.ReactNode; label: string }[];

  return (
    <section className="grid items-center gap-10 py-[var(--bh-section-y)] lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0, 1] }}
        className="flex flex-col gap-6"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--bh-accent-warm)]">
          Featured
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl md:leading-[1.08]">
          {featured.title}
        </h1>
        {featured.excerpt ? (
          <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            {featured.excerpt}
          </p>
        ) : null}
        <MetadataRow items={metadata} />
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            <Link href={featured.href}>Read story</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-11 rounded-full"
          >
            <Link href="/learn/articles">Browse all</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0, 1] }}
      >
        <Link href={featured.href} className="group block overflow-hidden rounded-2xl shadow-lg">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={featured.imageUrl || "/images/explainer-formulation.png"}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
