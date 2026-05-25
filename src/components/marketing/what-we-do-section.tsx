"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/ui/button';
import { ArrowRight } from 'lucide-react';

const WhatWeDoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for text reveal
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-48 bg-black text-white overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_70%)]" />
      
      <motion.div 
        style={{ opacity }}
        className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10"
      >
        {/* Animated headline */}
        <div className="mb-16 md:mb-24 overflow-hidden">
          <motion.h2 
            style={{ y: y1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8"
          >
            We turn <span className="text-primary italic font-heading">complex budgets</span>
          </motion.h2>
          <motion.h2 
            style={{ y: y2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1]"
          >
            into <span className="text-primary italic font-heading">civic action</span>.
          </motion.h2>
        </div>

        {/* Description grid */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">01. Decode</h3>
            <p className="text-white/70 leading-relaxed">
              We break down the Budget Policy Statement, County Fiscal Strategy Papers, 
              and appropriations bills into clear, accessible narratives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">02. Engage</h3>
            <p className="text-white/70 leading-relaxed">
              Through campus forums, barazas, and digital platforms, we create spaces 
              for citizens to participate in budget-making processes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">03. Track</h3>
            <p className="text-white/70 leading-relaxed">
              We monitor budget execution, flag discrepancies, and equip citizens 
              with tools to demand accountability from their representatives.
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 py-12 border-y border-white/10"
        >
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2">1,000+</div>
            <div className="text-white/60 text-sm uppercase tracking-widest">Citizens Engaged</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2">47</div>
            <div className="text-white/60 text-sm uppercase tracking-widest">Counties Reached</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2">KES 2B+</div>
            <div className="text-white/60 text-sm uppercase tracking-widest">Budget Tracked</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2">50+</div>
            <div className="text-white/60 text-sm uppercase tracking-widest">Events Hosted</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center"
        >
          <Link href="/about">
            <Button 
              size="lg" 
              className="rounded-full px-10 py-7 text-lg font-bold bg-white text-black hover:bg-white/90 gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/events">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-10 py-7 text-lg font-bold border-white/20 text-white hover:bg-white/10 gap-2"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhatWeDoSection;
