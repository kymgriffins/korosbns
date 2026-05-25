"use client";

import React from 'react';
import { motion } from 'motion/react';
import { team } from '@/constants/team';
import Image from 'next/image';

export default function LandingTeam() {
    return (
        <section className="py-20 md:py-36 bg-background overflow-hidden border-t border-border/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-16">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-24 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Our Team</span>
                        <h2 className="gusto-heading">Meet the minds behind the <span className="italic font-heading">story</span>.</h2>
                    </div>
                    <p className="text-foreground/60 max-w-sm text-sm leading-relaxed">
                        A dedicated group of researchers, storytellers, and tech innovators working together to bring transparency to Kenya's public budgets.
                    </p>
                </div>

                {/* ── DESKTOP GRID LAYOUT (Visible on tablet & desktop) ── */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {team.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-900 border border-border/40 shadow-md">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-104"
                                    sizes="(max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 tracking-tight">{member.name}</h3>
                            <p className="text-primary text-xs uppercase tracking-widest font-bold mb-4">{member.role}</p>
                            <p className="text-foreground/70 text-sm leading-relaxed">
                                {member.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* ── MOBILE STACKING CARDS LAYOUT (Visible on mobile only) ── */}
                <div className="flex md:hidden flex-col relative w-full pt-4">
                    {team.map((member, i) => (
                        <div 
                            key={member.name}
                            className="sticky w-full"
                            style={{
                                top: `calc(90px + ${i * 18}px)`,
                                paddingBottom: "24px" // space between stacks
                            }}
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="w-full bg-card border border-border/80 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 bg-cardbox"
                                style={{
                                    // slight shadow variance to separate layered stack
                                    boxShadow: `0 20px 40px -15px rgba(0, 0, 0, ${0.2 + i * 0.05})`
                                }}
                            >
                                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border/20">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="100vw"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-0.5 tracking-tight">{member.name}</h3>
                                    <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-2.5">{member.role}</p>
                                    <p className="text-foreground/80 text-xs leading-relaxed">
                                        {member.description}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
