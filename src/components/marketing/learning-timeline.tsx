"use client";

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FileText, Users, Scale } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/ui/button';

interface LearningModule {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

const modules: LearningModule[] = [
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Constitution & Rights",
    description: "Understanding your constitutional rights to budget information, public participation, and fiscal accountability.",
    href: "/learn/constitution",
    color: "text-blue-500"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Budget Policy Statement",
    description: "Decoding the BPS: How national priorities translate into spending plans and what it means for you.",
    href: "/learn/budget-policy",
    color: "text-purple-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Public Participation",
    description: "Your voice matters. Learn how to engage in county budget forums, submit memoranda, and track outcomes.",
    href: "/learn/participation",
    color: "text-green-500"
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Accountability & Oversight",
    description: "Following the money: Tools and frameworks for tracking budget execution and demanding transparency.",
    href: "/learn/accountability",
    color: "text-orange-500"
  },
];

const LearningTimeline = () => {
  return (
    <section className="py-24 md:py-48 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(37,99,235,0.05),transparent_50%)]" />
      
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block"
          >
            Learning Pathways
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Your Journey to <span className="text-primary italic font-heading">Fiscal Literacy</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            A structured curriculum designed to transform complex budget documents into actionable civic knowledge.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 -translate-x-1/2" />
          
          {/* Vertical line - mobile */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />

          <div className="space-y-16 md:space-y-24">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 md:translate-x-0 z-10" />

                {/* Content card */}
                <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="bg-card border border-border/40 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className={`${module.color} mb-4`}>
                      {module.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{module.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {module.description}
                    </p>
                    <Link href={module.href}>
                      <Button variant="outline" className="rounded-full">
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Spacer for alternating layout on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 md:mt-32"
        >
          <Link href="/learn">
            <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold">
              Browse All Modules →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningTimeline;
