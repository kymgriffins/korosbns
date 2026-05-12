"use client";

import React, { useRef } from "react";
import type { MotionValue } from "motion/react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useReducedMotion,
} from "motion/react";
import Container from "@/components/ui/container";

const lines = [
    "Youths cannot lead",
    "what they do not",
    "understand.",
];

const TOTAL_WORDS = lines.flatMap((l) => l.split(" ")).length;

type AnimatedWordProps = {
    smoothProgress: MotionValue<number>;
    globalIndex: number;
    children: string;
    reducedMotion: boolean | null;
};

function AnimatedWord({
    smoothProgress,
    globalIndex,
    children,
    reducedMotion,
}: AnimatedWordProps) {
    const step = 0.72 / Math.max(TOTAL_WORDS, 1);
    const start = 0.06 + globalIndex * step;
    const end = Math.min(0.94, start + step * 1.05);

    const opacity = useTransform(
        smoothProgress,
        [start, end],
        reducedMotion ? [1, 1] : [0.18, 1],
    );
    const y = useTransform(
        smoothProgress,
        [start, end],
        reducedMotion ? [0, 0] : [10, 0],
    );

    return (
        <motion.span
            style={{ opacity, y }}
            className="inline-block text-[clamp(2rem,6.5vw,4.75rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-foreground md:text-[clamp(2.25rem,5.5vw,5rem)]"
        >
            {children}
        </motion.span>
    );
}

const GustoMotionText = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.75", "end 0.35"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 90,
        damping: 32,
        restDelta: 0.001,
    });

    const quoteOpacity = useTransform(
        smoothProgress,
        [0.45, 0.72],
        reducedMotion ? [1, 1] : [0, 1],
    );
    const quoteY = useTransform(
        smoothProgress,
        [0.45, 0.72],
        reducedMotion ? [0, 0] : [16, 0],
    );

    return (
        <section
            ref={containerRef}
            className="relative min-h-[125svh] w-full overflow-hidden bg-background py-28 md:py-36 lg:py-44"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[42%] h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[100px] dark:bg-primary/[0.09]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,transparent_0%,var(--background)_78%)] opacity-90 dark:opacity-95" />
            </div>

            <Container size="ultra" className="relative z-10">
                <div className="mx-auto max-w-[min(100%,920px)]">
                    {/* Reading indicator — vertical strip (no “dot” cap artifact at scale 0) */}
                    <div className="mb-14 flex items-stretch gap-8 md:gap-14 lg:gap-16">
                        <div
                            className="relative mt-1 w-[2px] shrink-0 self-stretch overflow-hidden rounded-full bg-border/80 md:w-[3px]"
                            aria-hidden
                        >
                            <motion.div
                                style={{
                                    scaleY: smoothProgress,
                                }}
                                className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-primary"
                            />
                        </div>

                        <div className="min-w-0 flex-1 space-y-5 md:space-y-6 lg:space-y-7">
                            <p className="g-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground md:text-[11px]">
                                Why this matters
                            </p>
                            {lines.map((line, lineIdx) => {
                                const wordsInLine = line.split(" ");
                                const lineWordStart = lines
                                    .slice(0, lineIdx)
                                    .flatMap((l) => l.split(" ")).length;
                                return (
                                    <div
                                        key={lineIdx}
                                        className="flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1 md:gap-x-[0.34em]"
                                    >
                                        {wordsInLine.map((word, wordIdx) => (
                                            <AnimatedWord
                                                key={`${lineIdx}-${wordIdx}-${word}`}
                                                smoothProgress={smoothProgress}
                                                globalIndex={lineWordStart + wordIdx}
                                                reducedMotion={reducedMotion}
                                            >
                                                {word}
                                            </AnimatedWord>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <motion.figure
                        style={{
                            opacity: quoteOpacity,
                            y: quoteY,
                        }}
                        className="border-t border-border/60 pt-14 md:pt-16"
                    >
                        <blockquote className="max-w-2xl text-pretty text-xl font-normal leading-relaxed text-foreground/90 md:text-2xl md:leading-snug">
                            <span className="text-primary/90">&ldquo;</span>
                            The energy of youth is an engine, but without the fuel of
                            knowledge, it runs in circles.
                            <span className="text-primary/90">&rdquo;</span>
                        </blockquote>
                        <figcaption className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground md:text-xs md:tracking-[0.32em]">
                            James Mutinda — Deep Dive Series
                        </figcaption>
                    </motion.figure>
                </div>
            </Container>

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay bg-noise"
                aria-hidden
            />
        </section>
    );
};

export default GustoMotionText;
