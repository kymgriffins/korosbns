"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { useEffect, useState } from "react";
import { Users, BookOpen, FileText, Award } from "lucide-react";

type Metric = {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
};

const metrics: Metric[] = [
  {
    icon: <Users className="size-6" />,
    value: 50000,
    suffix: "+",
    label: "Citizens Reached",
  },
  {
    icon: <BookOpen className="size-6" />,
    value: 24,
    suffix: "+",
    label: "Learning Modules",
  },
  {
    icon: <FileText className="size-6" />,
    value: 150,
    suffix: "+",
    label: "Budget Documents Analyzed",
  },
  {
    icon: <Award className="size-6" />,
    value: 12,
    suffix: "",
    label: "County Partnerships",
  },
];

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ProjectImpactMetrics() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="flex flex-col items-center text-center p-6 rounded-xl border border-border/60 bg-card"
        >
          <div className="mb-3 text-primary">{metric.icon}</div>
          <div className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-1">
            <AnimatedCounter target={metric.value} suffix={metric.suffix} />
          </div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
