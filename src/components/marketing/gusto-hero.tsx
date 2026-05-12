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
            className="relative flex min-h-[100svh] w-full items-end justify-start overflow-hidden bg-neutral-900 pb-[max(4rem,env(safe-area-inset-bottom))] md:items-center md:justify-center md:pb-[var(--space-6)] pt-[var(--space-hero)]"
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
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.6] saturate-[1.05] object-[68%_top] md:object-center scale-[1.2] md:scale-100 animate-slow-zoom"
                >
                    <source
                        src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Stronger Cinematic Bottom Gradient for Readability */}
                <div className="absolute inset-0 bg-black/40 md:bg-black/55" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 md:via-black/40 to-black/10 md:to-black/20" />
            </motion.div>

            <div
                className="pointer-events-none absolute inset-0 z-[5] opacity-[0.03] mix-blend-overlay bg-noise"
                aria-hidden
            />

            <Container size="ultra" className="relative z-20 px-6 md:px-10">
                <motion.div style={{ opacity }} className="flex flex-col items-start text-left md:items-center md:text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: APPLE_EASE }}
                        className="mb-6"
                    >
                        <span className="g-eyebrow text-white/70 tracking-[0.35em] text-[11px] uppercase block">The Budget Story</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.1 }}
                        className="g-display mb-8 max-w-5xl text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.3)] text-[3.2rem] md:text-clamp(2.6rem, 8vw, 6.5rem) leading-[0.9] tracking-[-0.05em]"
                    >
                        <span className="md:hidden">
                            Youth cannot lead <br />
                            what they do not <br />
                            understand.
                        </span>
                        <span className="hidden md:block">
                            Youth cannot lead <br />
                            <span className="text-primary">&</span> fiscal policy.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
                        className="mx-auto mb-12 max-w-[22rem] md:max-w-xl text-pretty text-[15px] font-light leading-relaxed text-white/80 md:text-[19px] md:leading-relaxed px-6"
                    >
                        Building civic participation through
                        documentary storytelling and field journalism.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-8 md:px-0"
                    >
                        <Link href="/learn" className="w-full md:w-auto">
                            <Button
                                size="lg"
                                className="h-12 w-full md:w-auto rounded-full bg-white px-10 text-[13px] font-bold uppercase tracking-wider text-neutral-950 shadow-xl transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
                            >
                                Explore Stories
                            </Button>
                        </Link>
                        <Link href="/research" className="w-full md:w-auto">
                            <Button
                                size="lg"
                                className="h-12 w-full md:w-auto rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-10 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Dive into Data
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Bottom fade into next section — shorter, softer */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-background to-transparent" />
        </section>
    );
};

export default GustoHero;
