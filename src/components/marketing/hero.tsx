"use client";

import React from 'react';
import Wrapper from '../global/wrapper';
import { Button } from '../ui/button';
import { team } from '@/constants/team';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/utils';
import Balancer from 'react-wrap-balancer';
import Image from "next/image";
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    const description = "A youth-led initiative bridging the gap between Kenya's energy and national fiscal policy through immersive storytelling.";

    return (
        <section className="relative w-full pt-20 lg:pt-32 pb-20 overflow-hidden">
            {/* Background Liquid Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] size-[60rem] bg-primary/10 rounded-full blur-[12rem] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] size-[50rem] bg-blue-500/10 rounded-full blur-[10rem]" />
            </div>

            <Wrapper className="relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 backdrop-blur-md border border-foreground/10 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Fiscal Literacy 2026
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-[-0.04em] leading-[0.95] font-heading max-w-5xl">
                        <Balancer>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="block"
                            >
                                Bridging youth energy
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="block bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent"
                            >
                                & fiscal policy.
                            </motion.span>
                        </Balancer>
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-muted-foreground mt-8 max-w-2xl leading-relaxed"
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center gap-4 mt-12"
                    >
                        <Link href="/learn">
                            <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Explore stories
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                        <Link href="/research">
                            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base font-bold backdrop-blur-sm bg-white/5 border-foreground/10 hover:bg-white/10 transition-all">
                                Dive into data
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Spotlight / Immersive Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-24 relative group"
                >
                    <div className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden border border-foreground/10 shadow-2xl shadow-black/50">
                        <Image 
                            src="/images/towwnhallmay/129A3863.jpg"
                            alt="BNS Town Hall Meeting"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
                            <div className="max-w-md">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                    Impact Spotlight
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    The 2026 Budget Town Hall: Mapping Youth Priorities
                                </h3>
                            </div>
                            <Button variant="white" size="lg" className="rounded-full group/btn">
                                <Play className="mr-2 size-4 fill-current" />
                                Watch Briefing
                                <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 size-48 bg-primary/20 rounded-full blur-[5rem] -z-10 group-hover:bg-primary/30 transition-colors" />
                    <div className="absolute -bottom-12 -left-12 size-48 bg-blue-500/20 rounded-full blur-[5rem] -z-10" />
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default Hero;

