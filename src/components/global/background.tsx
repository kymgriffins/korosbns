"use client";

import { motion } from "motion/react";

const Background = () => {
    return (
        <div className="w-full min-h-screen absolute top-0 left-0 z-0 overflow-hidden pointer-events-none">
            {/* Liquid Glows */}
            <motion.div 
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] size-[60rem] bg-primary/10 rounded-full blur-[120px] opacity-60" 
            />
            
            <motion.div 
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -80, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] size-[50rem] bg-blue-500/10 rounded-full blur-[100px] opacity-60" 
            />

            <motion.div 
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[40rem] bg-purple-500/5 rounded-full blur-[100px] opacity-40" 
            />

            {/* Subtle Grid */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    opacity: 0.2
                }}
            ></div>
        </div>
    )
};

export default Background;
