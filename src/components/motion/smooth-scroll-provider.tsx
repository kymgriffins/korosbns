"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/motion/gsap/use-prefers-reduced-motion";

function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Ensure ScrollTrigger updates with Lenis scroll
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(updateTicker);
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: !prefersReduced,
        syncTouch: false, // Keep native feel on touch devices
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
