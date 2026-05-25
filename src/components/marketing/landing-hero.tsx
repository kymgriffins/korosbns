"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/ui/button';
import { ArrowRight, Sparkles, BarChart3, Users, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function LandingHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-black text-white px-6 md:px-16 pt-28 pb-12 md:pb-16"
        >
            {/* Background Image with parallax overlay */}
            <motion.div 
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black z-10" />
                <div 
                    className="w-full h-full bg-cover bg-center opacity-85 transition-opacity duration-500"
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/dn8lut2fc/image/upload/f_auto,q_auto,w_1920/v1/events/citizen-baraza')"
                    }}
                />
            </motion.div>

            {/* Empty top spacer to balance layout under header */}
            <div className="h-4 z-20 pointer-events-none" />

            {/* Core Content */}
            <motion.div 
                style={{ opacity }}
                className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-start text-left mt-auto mb-auto"
            >
                {/* Micro-badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
                >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Civic Movement</span>
                </motion.div>
                
                {/* Main Headline */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="gusto-heading mb-6 max-w-5xl tracking-[-0.03em] leading-[1.05]"
                >
                    Translating <span className="text-primary italic font-heading">numbers</span> <br />
                    into civic narratives.
                </motion.h1>

                {/* Subtitle / Description */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-base sm:text-lg text-white/70 max-w-2xl mb-10 leading-relaxed font-normal"
                >
                    Budget Ndio Story is a youth-led initiative in Kenya turning complex national budgets into clear, actionable stories for county engagement and democratic audit.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <Link href="/events" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold bg-white text-black hover:bg-white/90 gap-2">
                            Explore Events
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/about" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-bold border-white/20 text-white hover:bg-white/10">
                            How We Work
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bottom Row - Features & Stats Pills (Marwa Style) */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-white/10 mt-auto"
            >
                {/* Bottom Left feature details */}
                <div className="flex items-center gap-3 text-white/80">
                    <div className="flex -space-x-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <Landmark className="size-4 text-primary" />
                        </span>
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <BarChart3 className="size-4 text-primary" />
                        </span>
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <Users className="size-4 text-primary" />
                        </span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest">Youth-Led Fiscal Desks</span>
                </div>

                {/* Bottom Right statistics pills */}
                <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90">
                        1,000+ Citizens
                    </span>
                    <span className="px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90">
                        47 Counties
                    </span>
                    <span className="px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90">
                        KES 2B+ Tracked
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
