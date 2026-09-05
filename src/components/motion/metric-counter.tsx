"use client";

import NumberFlow from "@number-flow/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/utils";

interface MetricCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * MetricCounter
 * Scroll-triggered numeric tick-up using @number-flow/react.
 * Avoids layout thrashing with fluid tabular-nums transitions.
 */
export function MetricCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      setCurrentValue(value);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className={cn("inline-flex items-baseline tabular-nums", className)}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <NumberFlow
        value={currentValue}
        format={{
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }}
      />
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}
