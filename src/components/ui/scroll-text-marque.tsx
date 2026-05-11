"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { wrap } from "motion/react";
import { cn } from "@/utils";

interface ScrollBaseAnimationProps {
  children: string;
  baseVelocity?: number;
  clasname?: string;
  scrollDependent?: boolean;
}

export default function ScrollBaseAnimation({
  children,
  baseVelocity = 100,
  clasname,
  scrollDependent = false,
}: ScrollBaseAnimationProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Split text to allow for accenting specific words
  const words = children.split(" ");

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className={cn("flex whitespace-nowrap flex-nowrap", clasname)} style={{ x }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex items-center">
             {words.map((word, idx) => (
                <span 
                    key={idx} 
                    className={cn(
                        "mr-8",
                        word.toLowerCase() === "story" ? "text-primary" : "text-inherit"
                    )}
                >
                    {word}
                </span>
             ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
