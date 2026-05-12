"use client";

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils';

interface Props {
    title?: string;
    className?: string;
}

const SectionBadge = ({ title, className }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block relative z-0 select-none"
        >

            <motion.div
                className={cn(
                    "relative z-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
                    "bg-surface-0 border border-border-default text-text-3 shadow-sm",
                    className
                )}
            >
                {title}
            </motion.div>
        </motion.div>
    );
};

export default SectionBadge;
