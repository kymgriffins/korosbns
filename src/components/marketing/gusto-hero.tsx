"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/container";
import { APPLE_EASE } from "@/constants/motion";
import NumberFlow from "@number-flow/react";

const GustoHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 120]);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-900 pt-28 pb-24 sm:pt-32"
        >
            {/* Background video — brighter, readable scene */}
            <motion.div
                style={{ scale, y: videoY }}
                className="absolute inset-0 z-0 overflow-hidden"
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-[0.65] saturate-[1.05]"
                >
                    <source
                        src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Lift shadows: avoid crushing to black */}
                <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/25 to-black/55" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(0,0,0,0.35)_0%,transparent_55%)]" />
            </motion.div>

            <div
                className="pointer-events-none absolute inset-0 z-[5] opacity-[0.04] mix-blend-overlay bg-noise"
                aria-hidden
            />

            <Container size="ultra" className="relative z-20">
                <motion.div style={{ opacity }} className="flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE }}
                        className="g-display mb-8 max-w-4xl text-balance tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
                    >
                        Bridging youth energy <br />
                        <span className="text-primary">&</span> fiscal policy.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.15 }}
                        className="mx-auto mb-14 max-w-2xl text-pretty text-lg font-normal leading-relaxed text-white/88 md:text-xl md:leading-relaxed"
                    >
                        Translating complex budgets into actionable narratives for the next
                        generation of democratic participation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.3 }}
                        className="mb-20 flex w-full max-w-lg flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5"
                    >
                        <Link href="/learn" className="sm:inline-flex">
                            <Button
                                size="lg"
                                className="h-14 w-full rounded-full bg-white px-10 text-base font-semibold text-neutral-950 shadow-lg shadow-black/20 transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98] sm:h-14 sm:w-auto"
                            >
                                Explore Stories
                                <ArrowRightIcon className="ml-2 size-5" />
                            </Button>
                        </Link>
                        <Link href="/research" className="sm:inline-flex">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 w-full rounded-full border-white/40 bg-white/12 px-10 text-base font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/22 hover:text-white active:scale-[0.98] sm:h-14 sm:w-auto"
                            >
                                Dive into Data
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid w-full max-w-5xl grid-cols-2 gap-10 border-t border-white/15 pt-14 md:grid-cols-4 md:gap-16 md:pt-16">
                        {[
                            { label: "Active Members", value: 500, suffix: "+" },
                            { label: "Counties Reached", value: 12, suffix: "+" },
                            { label: "Stories Told", value: 150, suffix: "+" },
                            { label: "Reach", value: 20, suffix: "K+" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45 + i * 0.08 }}
                                className="flex flex-col items-center"
                            >
                                <div className="mb-2 text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
                                    <NumberFlow value={stat.value} />
                                    {stat.suffix}
                                </div>
                                <p className="g-mono whitespace-nowrap text-[10px] uppercase tracking-[0.35em] text-white/55 md:text-[11px] md:tracking-[0.4em]">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Container>

            {/* Bottom fade into next section — shorter, softer */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t from-background to-transparent" />
        </section>
    );
};

export default GustoHero;
