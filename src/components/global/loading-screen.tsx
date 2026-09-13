"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

type LoadingScreenProps = {
  /** CMS: global splash off by default — omit/false skips mount chrome. */
  enabled?: boolean;
  /** Soft minimum duration before exit (ms). 0 = natural GSAP timeline. */
  minMs?: number;
};

const LoadingScreen = ({ enabled = false, minMs = 0 }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(enabled);

  const overlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const overlay = overlayRef.current;
    const progressBar = progressBarRef.current;
    const progressFill = progressFillRef.current;
    const logo = logoRef.current;

    if (!overlay || !progressBar || !progressFill || !logo) return;

    const started = performance.now();

    const tl = gsap.timeline({
      onComplete: () => {
        const elapsed = performance.now() - started;
        const wait = Math.max(0, (minMs || 0) - elapsed);
        window.setTimeout(() => {
          setIsLoading(false);
        }, wait);
      },
    });

    tl.set(overlay, { opacity: 1 })
      .set(progressBar, { opacity: 0, y: 20 })
      .set(logo, { opacity: 0, scale: 0.8, filter: "blur(10px)" })
      .set(progressFill, { scaleX: 0, transformOrigin: "left" })
      .to(logo, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      })
      .to(
        progressBar,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2",
      )
      .to(progressFill, {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to([logo, progressBar], {
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power2.inOut",
      })
      .to(
        overlay,
        {
          y: "-100%",
          duration: 1,
          ease: "expo.inOut",
        },
        "-=0.2",
      );

    return () => {
      tl.kill();
    };
  }, [enabled, minMs]);

  if (!enabled || !isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-background opacity-100 [will-change:transform]"
    >
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          ref={logoRef}
          className="flex justify-center opacity-0 [will-change:transform,opacity,filter]"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={180}
            height={50}
            className="h-12 w-auto md:h-16"
            priority
          />
        </div>

        <div
          ref={progressBarRef}
          className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-foreground/10 opacity-0 backdrop-blur-sm md:w-48 [will-change:transform,opacity]"
        >
          <div
            ref={progressFillRef}
            className="h-full origin-left scale-x-0 rounded-full bg-primary [will-change:transform]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
