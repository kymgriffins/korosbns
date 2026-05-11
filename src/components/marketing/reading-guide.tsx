"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const ReadingGuide = () => {
    const { scrollYProgress } = useScroll();
    
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed left-4 md:left-12 top-0 bottom-0 w-[2px] bg-primary/20 z-40 hidden lg:block"
        >
            <motion.div
                className="absolute top-0 left-0 right-0 bg-primary origin-top h-full"
                style={{ scaleY }}
            />
        </motion.div>
    );
};

export default ReadingGuide;
