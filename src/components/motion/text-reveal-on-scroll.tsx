"use client";

import React, { useRef, useMemo, useEffect, useState, startTransition } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";

export type TextRevealMode = "word" | "character" | "sentence";

export interface TextRevealOnScrollProps {
  /** Text content to reveal progressively as the user scrolls */
  text: string;
  /** HTML tag to render as wrapper */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "blockquote" | "div";
  /** Reveal granularity: word by word (default), character by character, or sentence by sentence */
  mode?: TextRevealMode;
  /** Alias for mode */
  splitBy?: TextRevealMode;
  /** Alias for mode */
  by?: TextRevealMode;
  /** Dimmed/inactive opacity or color before scroll reaches the token */
  mutedOpacity?: number;
  /** Primary text color */
  color?: string;
  /** If false, once text is illuminated it stays illuminated when scrolling back up */
  replay?: boolean;
  /** Balance text wrapping (using CSS text-wrap: balance) */
  balance?: boolean;
  /** Optional spring physics tuning */
  transition?: {
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  /** Viewport scroll trigger offset: [when start begins, when completion ends] */
  offset?: ["start end" | "start center" | "start 85%" | "start 90%", "end center" | "end start" | "end 35%" | "end 50%"];
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

interface RevealTokenProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  mutedOpacity: number;
}

function RevealToken({
  children,
  progress,
  range,
  mutedOpacity,
}: RevealTokenProps) {
  const opacity = useTransform(progress, range, [mutedOpacity, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block transition-opacity duration-75"
    >
      {children}
    </motion.span>
  );
}

function toSpringOptions(transition?: {
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}) {
  const hasSpring =
    typeof transition?.stiffness === "number" ||
    typeof transition?.damping === "number" ||
    typeof transition?.mass === "number";

  if (!hasSpring && typeof transition?.duration === "number") {
    const duration = Math.max(transition.duration, 0.05);
    return {
      stiffness: 170 / (duration * duration),
      damping: 26 / duration,
      mass: 1,
      restDelta: 0.001,
    };
  }

  return {
    stiffness: typeof transition?.stiffness === "number" ? transition.stiffness : 110,
    damping: typeof transition?.damping === "number" ? transition.damping : 28,
    mass: typeof transition?.mass === "number" ? transition.mass : 1,
    restDelta: 0.001,
  };
}

export function TextRevealOnScroll({
  text,
  as: Component = "p",
  mode,
  splitBy,
  by,
  mutedOpacity = 0.22,
  color,
  replay = true,
  balance = true,
  transition,
  offset = ["start 85%", "end 35%"],
  className = "",
  style,
}: TextRevealOnScrollProps) {
  const activeMode: TextRevealMode = mode || splitBy || by || "word";
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    startTransition(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    });

    const handler = (e: MediaQueryListEvent) => {
      startTransition(() => {
        setPrefersReducedMotion(e.matches);
      });
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const maxProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > maxProgress.get()) {
      maxProgress.set(latest);
    }
  });

  const sourceProgress = replay ? scrollYProgress : maxProgress;
  const springProgress = useSpring(sourceProgress, toSpringOptions(transition));

  // Split tokens based on activeMode
  const { tokens, totalValids } = useMemo(() => {
    if (!text) return { tokens: [], totalValids: 0 };

    let items: string[] = [];
    if (activeMode === "character") {
      items = text.split("");
    } else if (activeMode === "word") {
      items = text.match(/([\S]+|\s+)/g) || [];
    } else if (activeMode === "sentence") {
      items = text.match(/[^.!?\n]+(?:[.!?]+)?|\n|\s+/g) || [];
    }

    let valids = 0;
    items.forEach((item) => {
      if (item.trim().length > 0) valids++;
    });

    return { tokens: items, totalValids: valids };
  }, [text, activeMode]);

  // Reduced motion or empty text fallback
  if (prefersReducedMotion || !text) {
    const ComponentTag = Component as any;
    return (
      <ComponentTag
        className={className}
        style={{
          ...style,
          color,
          textWrap: balance ? "balance" : "wrap",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </ComponentTag>
    );
  }

  let currentIdx = 0;
  const renderedTokens = tokens.map((itemStr, idx) => {
    // Preserve spaces and linebreaks without animating them
    if (itemStr.trim().length === 0 && itemStr !== "\n") {
      return (
        <React.Fragment key={`${mode}-space-${idx}`}>
          {itemStr}
        </React.Fragment>
      );
    }

    if (itemStr === "\n") {
      return <br key={`${mode}-br-${idx}`} />;
    }

    const start = currentIdx / Math.max(totalValids, 1);
    const end = (currentIdx + 1) / Math.max(totalValids, 1);
    currentIdx++;

    return (
      <RevealToken
        key={`${mode}-${idx}`}
        progress={springProgress}
        range={[start, end]}
        mutedOpacity={mutedOpacity}
      >
        {itemStr}
      </RevealToken>
    );
  });

  const ComponentTag = Component as any;
  const isSemanticHeading =
    Component === "h1" ||
    Component === "h2" ||
    Component === "h3" ||
    Component === "h4";

  return (
    <ComponentTag
      ref={containerRef}
      role={isSemanticHeading ? undefined : "region"}
      aria-label={text}
      className={className}
      style={{
        ...style,
        color,
        textWrap: balance ? "balance" : "wrap",
        whiteSpace: "pre-wrap",
      }}
    >
      <span aria-hidden="true">{renderedTokens}</span>
    </ComponentTag>
  );
}
