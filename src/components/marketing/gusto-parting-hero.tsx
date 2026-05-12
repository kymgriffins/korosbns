"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../ui/button";
import Link from "next/link";
import Container from "@/components/ui/container";
import { APPLE_EASE } from "@/constants/motion";

const GustoPartingHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-background py-24 md:py-36"
        >
            <Container size="ultra" className="relative z-20">
                <motion.div
                    style={{ opacity, scale }}
                    className="flex flex-col items-center text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE }}
                        viewport={{ once: true }}
                        className="mb-10"
                    >
                        <span className="g-eyebrow tracking-[0.5em]">The Next Chapter</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="g-display mb-10 max-w-4xl text-foreground"
                    >
                        The story is yours <br />
                        <span className="text-primary/80">to write</span>.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mx-auto mb-16 max-w-xl text-pretty text-[17px] font-light leading-relaxed text-foreground/60 md:text-[20px]"
                    >
                        Join the generation turning fiscal transparency into democratic action. 
                        Understand the numbers. Control the narrative.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center gap-8"
                    >
                        <Link href="/join">
                            <Button
                                size="lg"
                                className="h-14 md:h-16 rounded-full bg-foreground px-12 text-[14px] font-bold uppercase tracking-widest text-background transition-all hover:scale-[1.02] hover:bg-foreground active:scale-[0.98]"
                            >
                                Enter the Story
                            </Button>
                        </Link>
                        <Link href="/donate" className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">
                            Support the movement
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Subtle background element */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay bg-noise" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-primary/5 blur-[120px] rounded-full" />
        </section>
    );
};

export default GustoPartingHero;
