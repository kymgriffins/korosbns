"use client";

import { capabilities, stats, AVATAR_ITEMS } from '@/constants/capabilities';
import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { cn } from '@/utils';
import { Button } from "../ui/button";
import Image from "next/image";

const Capibilities = () => {
    return (
        <section id="capabilities" className="w-full py-24 lg:py-40 relative overflow-hidden">
            <Wrapper>
                <div className="flex flex-col items-center text-center mb-20">
                    <SectionBadge title="Content Engine" />
                    <motion.h2
                        className="text-5xl md:text-7xl font-bold tracking-tight mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        High-quality production.
                        <br />
                        <span className="text-muted-foreground">Meeting youth where they are.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
                    {/* Large Featured Card */}
                    <motion.div
                        className={cn(
                            "lg:col-span-8 relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                            "p-10 lg:p-12 flex flex-col justify-between"
                        )}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <div className="max-w-md relative z-10">
                            <h3 className="text-3xl font-bold mb-4">{capabilities[0].title}</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {capabilities[0].description}
                            </p>
                        </div>

                        <div className="mt-12 relative h-[300px] w-full">
                            <Image
                                src={capabilities[0].illustration}
                                alt={capabilities[0].title}
                                fill
                                className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>

                    {/* Side Card */}
                    <motion.div
                        className={cn(
                            "lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                            "p-10 flex flex-col justify-between"
                        )}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{capabilities[1].title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {capabilities[1].description}
                            </p>
                        </div>

                        <div className="mt-8 relative h-[200px] w-full">
                            <Image
                                src={capabilities[1].illustration}
                                alt={capabilities[1].title}
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </motion.div>

                    {/* Bottom Row */}
                    {capabilities.slice(2, 4).map((cap, idx) => (
                        <motion.div
                            key={cap.title}
                            className={cn(
                                "lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                                "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                                "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                                "p-10 flex flex-col justify-between"
                            )}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-4">{cap.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {cap.description}
                                </p>
                            </div>
                            <div className="mt-8 relative h-[180px] w-full">
                                <Image
                                    src={cap.illustration}
                                    alt={cap.title}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Stats Card */}
                    <motion.div
                        className={cn(
                            "lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] bg-primary p-10 text-primary-foreground flex flex-col justify-between"
                        )}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div>
                            <div className="flex mb-6">
                                <AnimatedTooltip items={AVATAR_ITEMS} />
                            </div>
                            <h3 className="text-4xl font-bold mb-2">
                                {stats[0]?.value} {stats[0]?.label}
                            </h3>
                            <p className="text-primary-foreground/80 font-medium">
                                Active youth using BNS platforms daily.
                            </p>
                        </div>
                        <Button variant="white" size="lg" className="rounded-full mt-10 group/btn">
                            Join the collective
                            <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default Capibilities;
