"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const LocalReadingGuide = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });
    
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/10 hidden lg:block">
            <motion.div
                className="absolute top-0 left-0 right-0 bg-primary origin-top h-full"
                style={{ scaleY }}
            />
        </div>
    );
};

export default LocalReadingGuide;
