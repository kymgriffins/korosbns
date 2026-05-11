"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Routes } from '@/constants';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';
import NumberFlow from '@number-flow/react';

const GustoHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 150]); // Parallax effect

    return (
        <section 
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black pt-32 pb-20"
        >
            {/* Layer 1: Background Parallax Video */}
            <motion.div 
                style={{ scale, y: videoY }}
                className="absolute inset-0 z-0 overflow-hidden"
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 mix-blend-screen"
                >
                    <source src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
            </motion.div>

            {/* Subtle Grain Overlay */}
            <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none bg-noise mix-blend-overlay" />

            {/* Content Layers */}
            <Container size="ultra" className="relative z-20">
                <motion.div style={{ opacity }} className="flex flex-col items-center text-center">
                    {/* Layer 2: Refined Typography */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE }}
                        className="g-display text-white mb-8 max-w-4xl leading-[0.85] tracking-[-0.06em]"
                    >
                        Bridging youth energy <br />
                        <span className="text-primary">&</span> fiscal policy.
                    </motion.h1>

                    {/* Layer 3: Statement Copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.2 }}
                        className="text-white/50 text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto leading-relaxed"
                    >
                        Translating complex budgets into actionable narratives for the next generation of democratic participation.
                    </motion.p>

                    {/* Layer 4: CTA Cluster */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: APPLE_EASE, delay: 0.4 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24"
                    >
                        <Link href="/learn">
                            <Button size="lg" className="rounded-full px-10 h-16 text-lg bg-white text-black hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-premium font-bold">
                                Explore Stories
                                <ArrowRightIcon className="ml-3 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/research">
                            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-white/20 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                                Dive into Data
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Layer 5: Hero Stats (Individual Animations) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 pt-20 border-t border-white/5 w-full max-w-5xl">
                        {[
                            { label: "Active Members", value: 500, suffix: "+" },
                            { label: "Counties Reached", value: 12, suffix: "+" },
                            { label: "Stories Told", value: 150, suffix: "+" },
                            { label: "Reach", value: 20, suffix: "K+" }
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                                    <NumberFlow value={stat.value} />{stat.suffix}
                                </div>
                                <p className="g-mono text-[9px] text-white/30 tracking-[0.4em] uppercase whitespace-nowrap">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Container>

            {/* Bottom Section Depth */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-linear-to-t from-black to-transparent z-10" />
        </section>
    );
};

export default GustoHero;
