"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "@/utils";
import Image from "next/image";
import { Shield, Database, Activity } from "lucide-react";

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
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-background">
      <div className="container px-4 mx-auto text-center z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live Oversight
          </span>
          
          <h1 className="text-6xl md:text-[10rem] font-bold tracking-[-0.06em] leading-[0.85] mb-12">
            Your Money.<br />
            <span className="text-white/30">Their Playground.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground mb-12 font-medium tracking-tight">
            We translate dry fiscal data into stories that demand action. Real-time tracking of every public shilling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="h-16 px-12 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-primary/20">
              Start Auditing
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image 
          src="/images/towwnhallmay/129A3912.jpg" 
          alt="Town Hall" 
          fill 
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </motion.div>

      <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-xl border-t border-white/5 py-5 overflow-hidden z-30">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-12 px-12">
              <span className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase">{item}</span>
              <span className="text-white/10 text-xs">/</span>
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
        stiffness: 80, 
        damping: 20,
        delay: index * 0.1 
      }}
      className={cn(
        "p-12 rounded-[3rem] transition-all duration-700 group",
        index === 0 
          ? "bg-primary/10 border-primary/20 md:col-span-2" 
          : "bg-white/[0.02] border-white/5 md:col-span-1"
      )}
    >
      <div className="size-16 mb-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
        <Icon className="size-8" />
      </div>
      <h3 className={cn(
        "font-bold tracking-tight mb-6",
        index === 0 ? "text-4xl" : "text-2xl"
      )}>{title}</h3>
      <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export const ProblemSection = () => {
  const problems = [
    { title: "Ghost Projects.", desc: "Multi-billion infrastructure that exists only in gazettes while communities suffer. We expose the disconnect between budget allocation and ground reality.", icon: Shield },
    { title: "Inflationary Padding", desc: "Systemic overpricing that drains public coffers.", icon: Database },
    { title: "Opaque Debt", desc: "Hidden loans with secret terms.", icon: Activity },
  ];

  return (
    <section className="py-40 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mb-32">
          <h2 className="text-5xl md:text-[7rem] font-bold tracking-[-0.05em] leading-[0.9] mb-12">
            The Crisis of <br />
            <span className="text-primary italic">Oversight.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Complexity is a weapon used against public participation. We provide the intelligence to fight back.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <ProblemCard key={i} title={p.title} desc={p.desc} index={i} icon={p.icon} />
          ))}
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
        <div className="relative p-12 lg:p-24 rounded-[4rem] bg-white/[0.01] border border-white/5 overflow-hidden">
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-primary/20 shadow-[0_0_30px_var(--primary)] z-20" 
          />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="text-5xl md:text-[6rem] font-bold tracking-[-0.05em] leading-[0.9] mb-12">
                The Truth <br />
                <span className="text-primary">Protocol.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-16">
                Zero-trust fiscal oversight. Every claim is cross-referenced with official records and ground-truth reporting.
              </p>
              <div className="space-y-8">
                {["Blockchain Verification", "Zero-Trust Protocol", "Citizen Audit"].map((item, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group">
              <Image 
                src="/images/towwnhallmay/129A4056.jpg" 
                alt="Verification" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- TOWN HALL GALLERY ---
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
      <div className="container px-4 mx-auto mb-32">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-[8rem] font-bold tracking-[-0.06em] leading-[0.85] mb-12">
            Movement <br />
            <span className="text-primary">Momentum.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl">
            From campus hubs to community centers. Real face-to-face accountability across 47 counties.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 h-[900px]">
        <div className="md:col-span-9 relative rounded-[4rem] overflow-hidden group">
          <Image src={images[2]} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-16 left-16">
            <h3 className="text-5xl font-bold tracking-tight">County Budget Analysis Hub</h3>
            <p className="text-primary font-bold uppercase tracking-widest mt-4">Nairobi Session #08</p>
          </div>
        </div>
        
        <div className="md:col-span-3 relative rounded-[4rem] overflow-hidden group">
          <Image src={images[4]} alt="Town Hall" fill className="object-cover grayscale group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </section>
  );
};

// --- CTA SECTION ---
export const CTASection = () => {
  return (
    <section className="py-60 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 grayscale mix-blend-multiply pointer-events-none">
            <Image src="/images/towwnhallmay/129A3863.jpg" alt="Town Hall" fill className="object-cover" />
        </div>

      <div className="container px-4 mx-auto text-center relative z-10">
        <h2 className="text-6xl md:text-[10rem] font-bold tracking-[-0.06em] leading-[0.85] mb-16">
          Join the<br />Collective.
        </h2>
        <div className="flex justify-center">
            <button className="h-24 px-20 bg-black text-white text-2xl font-bold rounded-full hover:scale-105 transition-transform shadow-3xl">
                Become an Auditor
            </button>
        </div>
        <p className="mt-16 text-xl font-medium opacity-60 tracking-tight max-w-xl mx-auto">
          Translate dry budget numbers into stories that demand justice. Your oversight starts today.
        </p>
      </div>
    </section>
  );
};
