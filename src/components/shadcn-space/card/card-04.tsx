"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView?: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5 });
      return controls.stop;
    }
  }, [value, isInView]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

interface WelcomeCardProps {
  name?: string;
  sovereigns?: number;
  streak?: number;
  className?: string;
}

const WelcomeCard = ({
  name = "Citizen",
  sovereigns = 0,
  streak = 0,
  className,
}: WelcomeCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={className}>
      <Card className="p-7 bg-primary text-primary-foreground pb-0 w-full relative overflow-hidden rounded-2xl border-none shadow-md">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT SIDE */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-between pb-6">
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h5 className="text-lg font-bold text-white">Welcome back, {name}!</h5>
            </div>

            {/* COUNTERS */}
            <div className="flex w-full mt-6 gap-6">
              <div className="border-e border-white/25 pe-6">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Sovereigns</p>
                <h2 className="text-white text-3xl font-black tracking-tight">
                  <AnimatedCounter
                    value={sovereigns}
                    isInView={isInView}
                    suffix=" SVG"
                  />
                </h2>
              </div>

              <div className="ps-2">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Streak</p>
                <h2 className="text-white text-3xl font-black tracking-tight">
                  <AnimatedCounter
                    value={streak}
                    isInView={isInView}
                    suffix=" Days"
                  />
                </h2>
              </div>
            </div>
          </div>

          {/* IMAGE RIGHT */}
          <div className="hidden md:block md:col-span-4 mt-auto ms-auto">
            <img
              src="https://images.shadcnspace.com/assets/backgrounds/welcome-bg-1.png"
              alt="welcome illustration"
              className="-mb-1 max-w-[130px] h-auto object-contain opacity-90"
              width={1024}
              height={195}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeCard;
