"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const GustoMotionText = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const lines = [
        "Youths cannot lead",
        "what they do not",
        "understand."
    ];

    return (
        <section 
            ref={containerRef}
            className="relative py-48 md:py-96 bg-background px-8 md:px-16 overflow-hidden flex flex-col justify-center"
        >
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="space-y-4 md:space-y-8">
                    {lines.map((line, lineIdx) => {
                        const words = line.split(" ");
                        return (
                            <div key={lineIdx} className="flex flex-wrap items-center gap-x-[0.2em] md:gap-x-[0.3em]">
                                {words.map((word, i) => {
                                    const totalIndex = lineIdx * 10 + i;
                                    const start = totalIndex / 20;
                                    
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    const opacity = useTransform(scrollYProgress, [start * 0.5, start * 0.5 + 0.1], [0.05, 1]);
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    const x = useTransform(scrollYProgress, [start * 0.5, start * 0.5 + 0.1], [-40, 0]);
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    const filter = useTransform(scrollYProgress, [start * 0.5, start * 0.5 + 0.1], ["blur(10px)", "blur(0px)"]);

                                    const isHighlight = word.toLowerCase() === "outrage" || word.toLowerCase() === "action.";

                                    return (
                                        <motion.span
                                            key={i}
                                            style={{ opacity, x, filter }}
                                            className={`gusto-heading inline-block text-[10vw] md:text-[8vw] leading-[0.9] tracking-tighter ${isHighlight ? 'text-primary italic font-serif' : 'text-foreground'}`}
                                        >
                                            {word}
                                        </motion.span>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 max-w-2xl"
                >
                    <p className="text-xl md:text-2xl text-foreground/50 leading-relaxed font-light mb-6">
                        "The energy of youth is a engine, but without the fuel of knowledge, it runs in circles. Youths cannot lead what they do not understand."
                    </p>
                    <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">— James Mutinda, Deep Dive Series</span>
                </motion.div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-10 blur-[150px] pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/40 rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-600/30 rounded-full" 
                />
            </div>
        </section>
    );
};

export default GustoMotionText;
