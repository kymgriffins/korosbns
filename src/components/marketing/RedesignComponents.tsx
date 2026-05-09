"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "@/utils";
import Image from "next/image";
import { ArrowRight, Shield, Database, Users, Activity } from "lucide-react";

// --- REFINED APPLE HERO (CONFRONTATION) ---
export const HeroSection = () => {
  const tickerItems = [
    "FISCAL EMERGENCY",
    "DEBT CEILING BREACHED",
    "BUDGET NDIO STORY",
    "CITIZEN OVERSIGHT REQUIRED",
    "TRANSPARENCY NOW",
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-background">
      <div className="container px-4 mx-auto text-center z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live Oversight Active
          </span>
          
          <h1 className="text-6xl md:text-[9rem] font-bold tracking-[-0.05em] leading-[0.9] mb-12">
            Your Money.<br />
            <span className="text-muted-foreground">Their Playground?</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground mb-12 font-medium tracking-tight">
            We track every shilling in real-time, translating dry fiscal data into stories that demand action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-14 px-10 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform">
              Start Auditing
            </button>
            <button className="h-14 px-10 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
              View Evidence
            </button>
          </div>
        </motion.div>
      </div>

      {/* Featured Town Hall Image - Integrated into background */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image 
          src="/images/towwnhallmay/129A3912.jpg" 
          alt="Town Hall" 
          fill 
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
      </motion.div>

      {/* High-End Ticker */}
      <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md border-t border-white/5 py-4 overflow-hidden z-30">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <span className="text-primary font-bold text-[10px] tracking-widest uppercase">{item}</span>
              <span className="text-white/20 text-xs font-mono">2024_Q2_DATA</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PROBLEM SECTION (CRISIS) ---
const ProblemCard = ({ title, desc, index, icon: Icon }: { title: string; desc: string; index: number; icon: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        delay: index * 0.1 
      }}
      className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all group"
    >
      <div className="size-16 mb-8 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
        <Icon className="size-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export default function RedesignPage() {
    return null; // This file is just for exports
}

export const ProblemSection = () => {
  const problems = [
    { title: "Ghost Projects", desc: "Multi-billion infrastructure that exists only in gazettes while communities suffer.", icon: Shield },
    { title: "Inflationary Padding", desc: "Systemic overpricing that drains public coffers into private hands.", icon: Database },
    { title: "Opaque Debt", desc: "Hidden loans with secret terms taken in the name of your future.", icon: Activity },
  ];

  return (
    <section className="py-40 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mb-24">
          <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-8">
            The Crisis of <span className="text-primary">Oversight.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
            The system was designed to be opaque. We've built the tools to make it crystal clear.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <ProblemCard key={i} title={p.title} desc={p.desc} index={i} icon={p.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- STRATEGY SECTION (CLARITY) ---
const Counter = ({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
      <div className="text-6xl md:text-8xl font-bold text-primary mb-4 tracking-tighter tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

export const StrategySection = () => {
  return (
    <section className="py-40 bg-black">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Counter value={150} label="Verified Data Points" />
          <Counter value={42} label="Policy Briefs Published" />
          <Counter value={12000} label="Active Citizens" />
        </div>
      </div>
    </section>
  );
};

// --- VERIFICATION HUB ---
export const VerificationHub = () => {
  return (
    <section className="py-40 bg-background relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="relative p-12 lg:p-24 rounded-[3rem] bg-white/[0.02] border border-white/10 overflow-hidden">
          {/* Scan Line Animation */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-primary/40 shadow-[0_0_20px_var(--primary)] z-20" 
          />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-8">
                The Truth <span className="text-primary">Protocol.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
                Every claim is cross-referenced with official gazettes, parliamentary Hansards, and ground-truth reporting. Data you can trust.
              </p>
              <div className="space-y-6">
                {["Blockchain Verified", "Zero-Trust Protocol", "Citizen Audited"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5">
              <Image 
                src="/images/towwnhallmay/129A4056.jpg" 
                alt="Verification process" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- TOWN HALL GALLERY (ALL IMAGES) ---
export const TownHallSection = () => {
  const images = [
    "/images/towwnhallmay/129A3863.jpg",
    "/images/towwnhallmay/129A3912.jpg",
    "/images/towwnhallmay/129A3923.jpg",
    "/images/towwnhallmay/129A4056.jpg",
    "/images/towwnhallmay/129A4094.jpg",
  ];

  return (
    <section className="py-40 bg-black">
      <div className="container px-4 mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-8">
              Town Hall <span className="text-primary">Momentum.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              From campus hubs to community centers. Real face-to-face accountability across 47 counties.
            </p>
          </div>
          <button className="h-14 px-8 border border-white/10 rounded-full font-bold hover:bg-white/5 transition-colors">
            View All Events
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 h-[800px]">
        {/* Large Featured */}
        <div className="md:col-span-8 relative rounded-[2rem] overflow-hidden group">
          <Image src={images[2]} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-10 left-10">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Featured Session</span>
            <h3 className="text-3xl font-bold mt-2">County Budget Analysis, Nairobi Hub</h3>
          </div>
        </div>
        
        {/* Side Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
            <Image src={images[0]} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
            <Image src={images[4]} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mt-4 h-[300px]">
        {images.slice(1, 5).map((src, i) => (
          <div key={i} className="relative rounded-[2rem] overflow-hidden group">
            <Image src={src} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-110 transition-transform duration-700" />
          </div>
        ))}
      </div>
    </section>
  );
};

// --- CTA SECTION ---
export const CTASection = () => {
  return (
    <section className="py-40 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Image of a Town Hall - subtle */}
        <div className="absolute inset-0 opacity-20 grayscale mix-blend-multiply pointer-events-none">
            <Image src="/images/towwnhallmay/129A3863.jpg" alt="Town Hall background" fill className="object-cover" />
        </div>

      <div className="container px-4 mx-auto text-center relative z-10">
        <h2 className="text-6xl md:text-9xl font-bold tracking-[-0.05em] mb-12">
          Ready to Change<br />the Narrative?
        </h2>
        <p className="max-w-2xl mx-auto text-2xl font-medium mb-16 opacity-90 tracking-tight">
          The budget isn't just numbers. It's the story of our lives. Join the movement and write the next chapter.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="h-20 px-16 bg-black text-white text-xl font-bold rounded-full hover:scale-105 transition-transform">
                Join the Collective
            </button>
            <button className="h-20 px-16 border-2 border-black/20 text-black text-xl font-bold rounded-full hover:bg-black/5 transition-colors">
                Read the Manifesto
            </button>
        </div>
      </div>
    </section>
  );
};
