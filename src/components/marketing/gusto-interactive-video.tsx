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
            <Container size="ultra" className="py-14 md:py-20">
                <motion.section 
                    ref={sectionRef}
                    style={{ scale, opacity }}
                    className="relative w-full aspect-video md:h-[70vh] bg-zinc-900 overflow-hidden cursor-none rounded-[28px] md:rounded-[40px] group shadow-premium"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => setIsOpen(true)}
                >
                    {/* Custom Cursor */}
                    <AnimatePresence>
                        {isHovering && !isOpen && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                style={{
                                    position: 'fixed',
                                    left: mousePos.x,
                                    top: mousePos.y,
                                    x: '-50%',
                                    y: '-50%',
                                }}
                                className="z-50 pointer-events-none w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center mix-blend-difference"
                            >
                                <PlayIcon className="w-6 h-6 text-black fill-black" />
                                <span className="text-black text-[9px] font-bold tracking-widest mt-2 uppercase">Play Story</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-zinc-900/40 z-10 mix-blend-multiply group-hover:bg-zinc-900/20 transition-colors duration-700" />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        >
                            <source src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" type="video/mp4" />
                        </video>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-14 bg-linear-to-t from-black/80 to-transparent">
                        <motion.div 
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, ease: APPLE_EASE, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="max-w-2xl"
                        >
                            <span className="g-eyebrow text-primary mb-3 block">Action through Understanding</span>
                            <h2 className="g-headline text-white mb-4 text-3xl md:text-5xl">The Budget Mtaani Series</h2>
                            <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-lg">
                                Watch how we're changing the conversation on the streets of Nairobi. Translating fiscal outrage into collective understanding.
                            </p>
                        </motion.div>
                    </div>
                </motion.section>
            </Container>

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
