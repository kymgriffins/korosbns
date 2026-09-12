"use client";

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils';
import { computeBadgeClasses, type DesignTokens } from '@/lib/design-tokens';

interface Props {
  title?: string;
  className?: string;
  tokens?: DesignTokens | null;
  showDot?: boolean;
}

const SectionBadge = ({ title, className, tokens, showDot }: Props) => {
  const badgeCls = computeBadgeClasses(tokens);
  const displayDot = showDot ?? tokens?.badges?.showDot ?? true;

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
          badgeCls,
          "relative z-0 overflow-hidden",
          className
        )}
        transition={{ duration: 0.2 }}
      >
        {displayDot && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
        <span>{title}</span>
      </motion.div>
    </motion.div>
  );
};

export default SectionBadge;
