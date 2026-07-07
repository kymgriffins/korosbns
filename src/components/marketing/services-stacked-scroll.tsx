"use client";

/**
 * Stacked scroll cards — motion-only (no Lenis).
 * Pattern inspired by Olivier Larose: https://www.youtube.com/@olivierlarose1
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "@/components/shadcn-space/blocks/services-02/services";

const CARD_ACCENTS = [
  "hsl(var(--primary) / 0.14)",
  "hsl(var(--muted))",
  "hsl(var(--primary) / 0.09)",
  "hsl(var(--card))",
];

interface ServicesStackedScrollProps {
  data: ServiceItem[];
}

export default function ServicesStackedScroll({ data }: ServicesStackedScrollProps) {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const step = data.length > 1 ? 1 / (data.length - 1) : 1;

  return (
    <section ref={container} className="relative bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 md:px-6 lg:px-8">
        <Badge variant="outline" className="mb-3 border-border text-muted-foreground">
          Stacked scroll preview
        </Badge>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Same services data as above — compare sticky reveal vs stacked cards while scrolling.
        </p>
      </div>

      <div className="relative w-full">
        {data.map((item, i) => {
          const targetScale = 1 - (data.length - i) * 0.05;
          return (
            <StackedServiceCard
              key={item.heading}
              index={i}
              item={item}
              progress={scrollYProgress}
              range={[i * step, 1]}
              targetScale={targetScale}
              accent={CARD_ACCENTS[i % CARD_ACCENTS.length]}
            />
          );
        })}
      </div>
    </section>
  );
}

interface StackedServiceCardProps {
  index: number;
  item: ServiceItem;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  accent: string;
}

function StackedServiceCard({
  index,
  item,
  progress,
  range,
  targetScale,
  accent,
}: StackedServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(cardProgress, [0, 1], [1.35, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky top-0 flex h-screen items-center justify-center px-4 md:px-6"
    >
      <motion.div
        style={{
          backgroundColor: accent,
          scale,
          top: `calc(-4vh + ${index * 22}px)`,
        }}
        className="relative -top-[20%] flex h-[min(520px,78vh)] w-full max-w-5xl origin-top flex-col overflow-hidden rounded-2xl border border-border/70 p-5 shadow-lg sm:p-8 lg:flex-row lg:gap-10"
      >
        <div className="flex w-full flex-col justify-center gap-4 lg:w-[42%]">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {item.heading}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {item.descp}
          </p>
          {item.statLabel && item.statValue ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.statLabel}
              </span>
              <span className="text-sm font-semibold text-foreground">{item.statValue}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={item.ctaHref ?? "/contact"}>
              <Button size="sm" className="rounded-full gap-1.5">
                {item.ctaLabel ?? "Learn more"}
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
            {item.secondaryCtaHref ? (
              <Link href={item.secondaryCtaHref}>
                <Button size="sm" variant="outline" className="rounded-full">
                  {item.secondaryCtaLabel ?? "Details"}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative mt-5 h-52 w-full overflow-hidden rounded-xl border border-border/60 lg:mt-0 lg:h-auto lg:flex-1">
          <motion.div className="relative h-full w-full" style={{ scale: imageScale }}>
            <Image
              src={item.image}
              alt={item.heading}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
