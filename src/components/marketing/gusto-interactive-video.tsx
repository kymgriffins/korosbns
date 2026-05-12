"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { PlayIcon } from 'lucide-react';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';

const GustoInteractiveVideo = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center center"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <section className="relative w-full pt-12 md:pt-24 pb-0 md:pb-0 px-4 md:px-10 overflow-hidden bg-background">
                <motion.div
                    ref={sectionRef}
                    style={{ scale, opacity }}
                    className="relative w-full aspect-video md:h-[90vh] bg-zinc-900 overflow-hidden group rounded-[32px] md:rounded-[48px] shadow-2xl"
                    onClick={() => setIsOpen(true)}
                >

                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-zinc-900/40 z-10 mix-blend-multiply group-hover:bg-zinc-900/10 transition-colors duration-1000" />
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] object-top"
                            >
                                <source src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" type="video/mp4" />
                            </video>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-16 bg-linear-to-t from-black/80 via-black/20 to-transparent">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: APPLE_EASE }}
                                viewport={{ once: true }}
                                className="max-w-3xl"
                            >
                                <span className="g-eyebrow text-primary/90 mb-4 block">Action through Understanding</span>
                                <h2 className="g-display text-white mb-6 text-3xl md:text-6xl drop-shadow-2xl">The Budget Mtaani <br className="hidden md:block" /> Series</h2>
                                <p className="text-white/60 text-[15px] md:text-[18px] font-light leading-relaxed max-w-xl">
                                    Watch how we're changing the conversation on the streets of Nairobi. Translating fiscal outrage into collective understanding.
                                </p>
                            </motion.div>
                        </div>
                        </motion.div>
            </section>

            {/* Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-4 md:p-12"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-premium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                src="https://www.youtube.com/embed/fD3yW78uDkY?autoplay=1"
                                title="Budget Mtaani Series Part 1"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors"
                            >
                                Close [esc]
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GustoInteractiveVideo;
