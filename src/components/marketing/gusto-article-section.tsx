"use client";

import React from 'react';
import { motion } from 'motion/react';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';



const GustoArticleSection = () => {
    return (
        <section className="py-24 md:py-32 bg-white text-black overflow-hidden relative">
            <Container size="ultra">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-24 items-start relative">


                    {/* Left Column (7/12) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: APPLE_EASE }}
                        className="lg:col-span-7"
                    >
                        <span className="g-eyebrow mb-4 block text-primary">Mission & Impact</span>
                        <h2 className="g-headline mb-8 text-black tracking-[-0.03em]">
                            Translating numbers into <span className="text-primary">narratives</span>.
                        </h2>
                        <div className="h-px w-full bg-black/5 mb-8" />
                        
                        <div className="grid grid-cols-2 gap-8 mt-10">
                            {[
                                { label: "Active Community", value: "50k+" },
                                { label: "County Chapters", value: "12+" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: APPLE_EASE, delay: 0.3 + (i * 0.06) }}
                                >
                                    <h4 className="text-4xl md:text-5xl font-black mb-1 text-black tracking-tighter">{item.value}</h4>
                                    <p className="g-mono text-[11px] text-black/40">{item.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column (5/12) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15, ease: APPLE_EASE }}
                        className="lg:col-span-5 lg:pt-16 space-y-6"
                    >
                        <p className="text-lg md:text-xl font-light leading-relaxed text-black/70">
                            Budget Ndio Story is a youth-led initiative transforming complex national budgets into actionable narratives. 
                        </p>
                        <p className="text-lg md:text-xl font-light leading-relaxed text-black/70">
                            We use storytelling and data to empower the next generation of leaders.
                        </p>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default GustoArticleSection;
