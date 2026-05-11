"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';

const GustoMotionText = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Using a more focused offset to ensure animation happens while section is primarily in viewport
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.2"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001
    });

    const lines = [
        "Youths cannot lead",
        "what they do not",
        "understand."
    ];

    // Total words across all lines to calculate global progress mapping
    const allWords = lines.flatMap(line => line.split(" "));
    const totalWords = allWords.length;

    return (
        <section 
            ref={containerRef}
            className="relative min-h-[180svh] w-full bg-background overflow-hidden flex flex-col items-center justify-center py-48"
        >
            {/* Cinematic Background Treatment */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vw] bg-primary/5 rounded-full blur-[140px] opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.03)_100%)]" />
            </div>

            <Container size="ultra" className="relative z-10 grid grid-cols-12 gap-8 md:gap-12 items-center">
                
                {/* LEFT: Editorial Reading Progress Line */}
                <div className="hidden lg:block col-span-1 relative h-[500px]">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-foreground/5 rounded-full">
                        <motion.div 
                            style={{ scaleY: smoothProgress }}
                            className="absolute top-0 left-0 w-full bg-primary origin-top shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] rounded-full"
                        />
                    </div>
                </div>

                {/* CENTER/RIGHT: The Narrative Typography */}
                <div className="col-span-12 lg:col-span-11 lg:pl-16">
                    <div className="space-y-6 md:space-y-8">
                        {lines.map((line, lineIdx) => {
                            const wordsInLine = line.split(" ");
                            const previousLinesWords = lines.slice(0, lineIdx).flatMap(l => l.split(" ")).length;

                            return (
                                <div key={lineIdx} className="flex flex-wrap items-center gap-x-[0.35em] md:gap-x-[0.45em]">
                                    {wordsInLine.map((word, wordIdx) => {
                                        const globalIndex = previousLinesWords + wordIdx;
                                        
                                        // Refined Mapping: 
                                        // Start at 0.05, Finish entirely by 0.85 to ensure user sees everything before exiting
                                        const step = 0.8 / totalWords;
                                        const start = 0.05 + (globalIndex * step);
                                        const end = start + (step * 0.8);

                                        const opacity = useTransform(smoothProgress, [start, end], [0.12, 1]);
                                        const y = useTransform(smoothProgress, [start, end], [24, 0]);
                                        const filter = useTransform(smoothProgress, [start, end], ["blur(12px)", "blur(0px)"]);

                                        return (
                                            <motion.span
                                                key={wordIdx}
                                                style={{ opacity, y, filter }}
                                                className="gusto-heading inline-block text-[11vw] md:text-[9vw] leading-[0.85] tracking-tightest text-foreground"
                                            >
                                                {word}
                                            </motion.span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Sub-Manifesto & Attribution */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="mt-32 max-w-3xl border-l-2 border-primary/20 pl-10 space-y-8"
                    >
                        <p className="text-2xl md:text-4xl text-muted-foreground font-light leading-relaxed">
                            "The energy of youth is an engine, but without the fuel of knowledge, it runs in circles."
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="h-px w-16 bg-primary/40" />
                            <span className="g-mono text-primary text-sm md:text-base uppercase tracking-[0.4em] font-bold">
                                James Mutinda — Deep Dive Series
                            </span>
                        </div>
                    </motion.div>
                </div>
            </Container>

            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://res.cloudinary.com/dn8lut2fc/image/upload/v1739265738/grain_m9u9u6.png')]" />
        </section>
    );
};

export default GustoMotionText;
