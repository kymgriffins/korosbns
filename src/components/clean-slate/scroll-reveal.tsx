"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export function ScrollReveal({ children, className, delay = 0, style }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn("cs-reveal", className)} style={style}>
      {children}
    </div>
  );
}
