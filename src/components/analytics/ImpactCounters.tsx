"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { useEffect, useState } from "react";
import { Users, BookOpen, ClipboardCheck, Brain } from "lucide-react";

type Props = {
  citizensReached: number;
  modulesCompleted: number;
  surveysResponded: number;
  quizAttempts: number;
};

function Counter({ target, label, icon }: { target: number; label: string; icon: React.ReactNode }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
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
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center text-center p-5 rounded-xl border border-border/60 bg-card"
    >
      <div className="mb-2 text-primary">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold font-heading tabular-nums">
        {count.toLocaleString()}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export function ImpactCounters({
  citizensReached,
  modulesCompleted,
  surveysResponded,
  quizAttempts,
}: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <Counter
        target={citizensReached}
        label="Citizens Reached"
        icon={<Users className="size-5" />}
      />
      <Counter
        target={modulesCompleted}
        label="Modules Completed"
        icon={<BookOpen className="size-5" />}
      />
      <Counter
        target={surveysResponded}
        label="Survey Responses"
        icon={<ClipboardCheck className="size-5" />}
      />
      <Counter
        target={quizAttempts}
        label="Quiz Attempts"
        icon={<Brain className="size-5" />}
      />
    </motion.div>
  );
}
