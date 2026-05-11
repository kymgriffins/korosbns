"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayIcon } from 'lucide-react';

const GustoInteractiveVideo = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

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
            <section 
                ref={sectionRef}
                className="relative w-full aspect-video md:h-[80vh] bg-zinc-900 overflow-hidden cursor-none mx-auto max-w-[1400px] px-8 md:px-16 my-24 md:my-48 rounded-[2rem] md:rounded-[4rem] group"
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
                            transition={{ type: "spring", stiffness: 250, damping: 25 }}
                            style={{
                                position: 'fixed',
                                left: mousePos.x,
                                top: mousePos.y,
                                x: '-50%',
                                y: '-50%',
                            }}
                            className="z-50 pointer-events-none w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center mix-blend-difference"
                        >
                            <PlayIcon className="w-8 h-8 text-black fill-black" />
                            <span className="text-black text-[10px] font-bold tracking-widest mt-2 uppercase">Play</span>
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
                <div className="absolute bottom-12 left-0 right-0 z-20">
                    <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                        <div className="max-w-lg">
                            <h2 className="gusto-subheading text-white mb-4">The Budget Mtaani Series</h2>
                            <p className="text-white/60 text-sm md:text-base tracking-wide leading-relaxed">
                                Watch how we're changing the conversation on the streets of Nairobi. Translating outrage into understanding.
                            </p>
                        </div>
                    </div>
                </div>
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
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
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
                                className="absolute top-6 right-6 text-white/50 hover:text-white uppercase tracking-widest text-xs font-bold transition-colors"
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
