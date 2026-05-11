"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';
import { socialLinks } from '@/constants/links';
import { RandomizedTextEffect } from '@/components/ui/text-randomized';

const brandColors: Record<string, string> = {
    x: '#1DA1F2',
    linkedin: '#0077B5',
    whatsapp: '#25D366',
    youtube: '#FF0000',
    tiktok: '#ff0050', // TikTok pink/cyan vibe
    instagram: '#E4405F',
    facebook: '#1877F2'
};

const GustoPartingHero = () => {
    return (
        <section className="relative py-24 md:py-32 bg-zinc-950 overflow-hidden">
            <Container size="ultra">
                <div className="relative w-full rounded-[48px] md:rounded-[64px] overflow-hidden bg-black/40 border border-white/5 p-12 md:p-20">
                    {/* Layered Background */}
                    <div className="absolute inset-0 z-0">
                        <motion.div 
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.3, 0.2],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-8">
                            <motion.h2 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: APPLE_EASE }}
                                viewport={{ once: true }}
                                className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter"
                            >
                                <RandomizedTextEffect text="EVERY SHILLING" /> <br />
                                <span className="text-primary italic">
                                    <RandomizedTextEffect text="HAS A STORY." />
                                </span>
                            </motion.h2>
                        </div>
                        
                        <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: APPLE_EASE }}
                                viewport={{ once: true }}
                            >
                                <MagneticButton>
                                    Start Your Story
                                </MagneticButton>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                viewport={{ once: true }}
                                className="flex flex-wrap gap-x-8 gap-y-4 g-mono text-white/40 justify-start lg:justify-end"
                            >
                                {socialLinks.map((social) => (
                                    <a 
                                        key={social.label}
                                        href={social.href} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors duration-300"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = brandColors[social.icon] || 'var(--primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '';
                                        }}
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        mouseX.set((clientX - centerX) * 0.5);
        mouseY.set((clientY - centerY) * 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className="relative g-eyebrow px-12 py-6 bg-white text-black rounded-full transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
        >
            <span className="relative z-10">{children}</span>
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        layoutId="glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-primary blur-xl -z-10 opacity-40"
                    />
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default GustoPartingHero;
