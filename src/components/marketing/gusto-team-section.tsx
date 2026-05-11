"use client";

import React from 'react';
import { motion } from 'motion/react';
import { team } from '@/constants/team';
import Image from 'next/image';
import Container from '../global/container';

const GustoTeamSection = () => {
    return (
        <section className="py-24 md:py-48 bg-background overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">Our Team</span>
                        <h2 className="gusto-heading">Meet the minds behind the <span className="italic font-serif">story</span>.</h2>
                    </div>
                    <p className="gusto-text max-w-sm mb-4">
                        A diverse group of researchers, storytellers, and strategists dedicated to fiscal transparency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {team.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-900">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                            <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-4">{member.role}</p>
                            <p className="text-foreground/60 text-sm leading-relaxed line-clamp-3">
                                {member.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GustoTeamSection;
