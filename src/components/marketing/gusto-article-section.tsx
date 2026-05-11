"use client";

import React from 'react';
import { motion } from 'motion/react';
import Container from '../global/container';

const GustoArticleSection = () => {
    return (
        <section className="py-24 md:py-48 bg-white text-black overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">What we do</span>
                        <h2 className="gusto-heading mb-8">Translating numbers into <span className="italic font-serif text-primary">narratives</span>.</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <p className="gusto-text text-black/80 text-lg md:text-xl leading-relaxed">
                            Budget Ndio Story is a youth-led initiative in Kenya transforming complex national budgets into actionable narratives for democratic participation and fiscal literacy.
                        </p>
                        <p className="gusto-text text-black/80 text-lg md:text-xl leading-relaxed">
                            We believe that fiscal policy shouldn't be a black box. By using investigative storytelling, data visualization, and community engagement, we empower the next generation to take their place at the decision-making table.
                        </p>
                        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-black/10">
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold mb-2">50k+</h4>
                                <p className="text-xs uppercase tracking-widest text-black/50">Active Community</p>
                            </div>
                            <div>
                                <h4 className="text-3xl md:text-4xl font-bold mb-2">12+</h4>
                                <p className="text-xs uppercase tracking-widest text-black/50">County Chapters</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default GustoArticleSection;
