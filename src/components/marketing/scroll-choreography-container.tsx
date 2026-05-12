"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/utils";

interface ScrollChoreographyContainerProps {
    children: React.ReactNode;
    className?: string;
}

const ScrollChoreographyContainer = ({
    children,
    className,
}: ScrollChoreographyContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Interpolate background color or other global atmospheric properties
    // This can be expanded to handle theme-specific interpolations
    const backgroundOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 1]);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity: backgroundOpacity }}
            className={cn("relative w-full g-section-transition", className)}
        >
            {/* Ambient Overlays */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[60%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default ScrollChoreographyContainer;
