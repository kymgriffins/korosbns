"use client";

import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import { team } from '@/constants';
import { useIsMobile } from '@/hooks';
import { motion, useScroll, useTransform } from 'motion/react';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';

const TeamCard = ({ member }: { member: any }) => {
    return (
        <div className="size-full relative cursor-pointer group">
            <div className="absolute -inset-1 bg-linear-to-tr from-primary/10 via-blue-500/5 to-transparent rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent rounded-[2.6rem] p-[1px] group-hover:rotate-1 transition-all duration-700">
                <div className="size-full bg-background rounded-[2.5rem]" />
            </div>
            <div className="relative size-full overflow-hidden rounded-[2.4rem] bg-[#0A0A0B] shadow-2xl border border-white/5">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                    sizes="(max-width: 768px) 300px, 620px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-6 lg:p-10 pt-32 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0 text-left">
                    <div className="relative z-20">
                        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-[1.1] text-balance">
                            {member.name}
                        </h3>
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,85,255,1)]" />
                                <p className="text-white/80 font-bold text-[10px] lg:text-[11px] uppercase tracking-[0.25em] whitespace-nowrap">
                                    {member.role}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 lg:gap-6 ml-2">
                                {member.socials?.x && (
                                    <Link 
                                        href={member.socials.x} 
                                        target="_blank" 
                                        className="text-white/30 hover:text-white transition-all duration-300 hover:scale-125 focus:outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Image 
                                            src="/icons/integrations/social-x.svg" 
                                            alt="X" 
                                            width={18} 
                                            height={18} 
                                            className="size-4 lg:size-5"
                                        />
                                    </Link>
                                )}
                                {member.socials?.linkedin && (
                                    <Link 
                                        href={member.socials.linkedin} 
                                        target="_blank" 
                                        className="text-white/30 hover:text-white transition-all duration-300 hover:scale-125 focus:outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Linkedin className="size-4 lg:size-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WallOfLove = () => {
    const isMobile = useIsMobile();
    const targetRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    useEffect(() => {
        const updateWidths = () => {
            if (scrollContentRef.current) {
                // Using a more aggressive measurement
                setScrollRange(scrollContentRef.current.scrollWidth);
                setViewportWidth(window.innerWidth);
            }
        };

        const timer = setTimeout(updateWidths, 800); // Higher delay for complex layout settlement
        window.addEventListener('resize', updateWidths);
        
        const observer = new ResizeObserver(updateWidths);
        if (scrollContentRef.current) observer.observe(scrollContentRef.current);

        return () => {
            window.removeEventListener('resize', updateWidths);
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    // Aggressive Displacement: We add a full 60% of viewport width to ensure Peculiar is centered
    const translateX = useTransform(
        scrollYProgress, 
        [0, 1], 
        [0, -(scrollRange - viewportWidth + (viewportWidth * 0.6))] 
    );

    const headerOpacity = useTransform(scrollYProgress, [0.01, 0.04], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0.01, 0.04], [0, -40]);
    const scrollerY = useTransform(scrollYProgress, [0.01, 0.1], [300, 0]);
    const zIndex = useTransform(scrollYProgress, [0.01, 0.06], [50, 200]);

    if (isMobile) {
        return (
            <section id="voices" className="w-full py-16 bg-background/50 overflow-hidden">
                <Wrapper>
                    <div className="flex flex-col items-center text-center mb-10 px-4">
                        <SectionBadge title="Leadership Team" />
                        <h2 className="title mt-4 text-3xl font-bold leading-tight px-2">
                            The Leadership <br /> Behind the Stories
                        </h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar px-6">
                        {team.map((member) => (
                            <div key={member.name} className="flex-none w-[300px] aspect-[9/15] snap-center">
                                <TeamCard member={member} />
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </section>
        );
    }

    return (
        <section ref={targetRef} id="voices" className="relative h-[800vh] w-full bg-background/50">
            <motion.div 
                style={{ zIndex }}
                className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-background"
            >
                <div className="hidden lg:block absolute -z-10 top-0 -right-1/4 size-1/3 bg-primary/20 rounded-full blur-[10rem]" />
                <div className="hidden lg:block absolute -z-10 bottom-0 -left-1/4 size-1/3 bg-primary/10 rounded-full blur-[10rem]" />

                <motion.div 
                    style={{ opacity: headerOpacity, y: headerY }}
                    className="absolute top-[8vh] inset-x-0 flex flex-col items-center text-center px-4 z-20 pointer-events-none"
                >
                    <SectionBadge title="Leadership Team" />
                    <h2 className="title mt-6 text-4xl lg:text-5xl font-extrabold tracking-tight">
                        The Leadership Behind the Stories
                    </h2>
                    <p className="desc mt-4 max-w-2xl mx-auto opacity-70">
                        Meet the visionaries leading the charge for transparency in Kenya.
                    </p>
                </motion.div>

                <motion.div 
                    style={{ y: scrollerY }}
                    className="relative w-full h-full flex items-center overflow-visible z-10"
                >
                    <motion.div 
                        ref={scrollContentRef}
                        style={{ x: translateX }} 
                        className="flex gap-16 px-[20vw] py-4 w-max h-full items-center"
                    >
                        {team.map((member) => (
                            <motion.div
                                key={member.name}
                                className="flex-none w-[350px] lg:w-[480px] xl:w-[520px] h-[85vh] lg:h-[90vh] relative"
                            >
                                <TeamCard member={member} />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                style={{ scaleX: scrollYProgress }} 
                                className="w-full h-full bg-primary origin-left" 
                            />
                        </div>
                        <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.6em] font-bold">
                            Leadership Gallery
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default WallOfLove;
