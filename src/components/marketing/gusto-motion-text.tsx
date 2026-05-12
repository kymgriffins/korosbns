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
            className="inline-block text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground"
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
        offset: ["start 0.75", "end 0.25"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 90,
        damping: 32,
        restDelta: 0.001,
    });

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80svh] flex items-center justify-center w-full overflow-hidden bg-background py-32 md:py-48"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[50%] h-[min(100vw,800px)] w-[min(100vw,800px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[140px] dark:bg-primary/[0.05]" />
            </div>

            <Container size="ultra" className="relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-12"
                        >
                            <span className="g-eyebrow text-primary/40">The Mandate</span>
                        </motion.div>
                        
                        <div className="flex flex-col items-center gap-4">
                            {lines.map((line, lineIdx) => {
                                const wordsInLine = line.split(" ");
                                const lineWordStart = lines
                                    .slice(0, lineIdx)
                                    .flatMap((l) => l.split(" ")).length;
                                return (
                                    <div
                                        key={lineIdx}
                                        className="flex flex-wrap justify-center items-baseline gap-x-[0.3em]"
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
                </div>
            </Container>

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay bg-noise"
                aria-hidden
            />
        </section>
    );
};

export default GustoMotionText;
