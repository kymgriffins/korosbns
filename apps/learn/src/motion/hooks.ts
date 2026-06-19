"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function useReducedMotionSafe() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? !!prefersReduced : false;
}

export function useScrollReveal() {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" }
  };
}
