"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RandomizedTextEffect } from '@/components/ui/text-randomized';
import Image from 'next/image';
import { APPLE_EASE } from '@/constants/motion';

const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Reduced duration as requested to avoid "burden"
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        clipPath: "inset(0 0 100% 0)",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: APPLE_EASE }}
                        >
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={180}
                                height={50}
                                className="h-10 w-auto md:h-12 opacity-80"
                                priority
                            />
                        </motion.div>

                        <div className="py-4">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white text-center leading-tight">
                                <RandomizedTextEffect text="BUDGET NDIO STORY" />
                            </h1>
                        </div>

                        <motion.div 
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="w-48 h-px bg-primary/40 origin-left"
                        />
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="g-mono text-[10px] uppercase tracking-[0.3em] text-white"
                        >
                            National Youth Initiative
                        </motion.p>
                    </div>

                    {/* Subtle grain effect for cinematic feel without heavy images */}
                    <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
