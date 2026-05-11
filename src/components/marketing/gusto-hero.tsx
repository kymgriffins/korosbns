"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Routes } from '@/constants';

const GustoHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black"
        >
            {/* Background Video */}
            <motion.div 
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-zinc-900/40 z-10 mix-blend-multiply" />
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover grayscale opacity-80"
                >
                    <source src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" type="video/mp4" />
                    {/* Fallback if video fails */}
                    <div className="w-full h-full bg-zinc-900" />
                </video>
            </motion.div>

            {/* Content */}
            <motion.div 
                style={{ opacity }}
                className="relative z-20 text-center px-4 max-w-6xl mx-auto"
            >
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-block text-white/70 uppercase tracking-[0.3em] text-sm mb-6"
                >
                    Fiscal Literacy & Democratic Participation
                </motion.span>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="gusto-heading text-white mb-8"
                >
                    Bridging the gap between <br />
                    <span className="text-primary italic font-serif">youth energy</span> & fiscal policy.
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <Link href="/learn">
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-white/90">
                            Explore Stories
                            <ArrowRightIcon className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/research">
                        <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10">
                            Dive into Data
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            >
                <span className="text-white/40 text-xs uppercase tracking-widest mb-2">Scroll</span>
                <div className="w-[1px] h-12 bg-linear-to-b from-white/40 to-transparent" />
            </motion.div>
        </section>
    );
};

export default GustoHero;
