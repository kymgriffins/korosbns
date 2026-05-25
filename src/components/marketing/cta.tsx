"use client";

import Wrapper from '@/components/global/wrapper';
import { Button } from '@/ui/button';
import { Routes } from '@/constants';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ease } from '@/motion/variants';

const Cta = () => {
    return (
        <section className="w-full py-16 lg:pt-24 relative overflow-hidden">
            <Wrapper>
                <div className="relative max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: ease.expo }}
                        className="relative rounded-3xl overflow-visible z-0"
                    >
                        {/* Grid background */}
                        <div className="absolute inset-0 -z-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(128, 128, 128, 0.08) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(128, 128, 128, 0.08) 1px, transparent 1px)
                                `,
                                backgroundSize: '48px 48px'
                            }}
                        />

                        {/* Radial mask */}
                        <div
                            className="absolute inset-0 -z-10 bg-background"
                            style={{
                                maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 40%, white 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 40%, white 70%)'
                            }}
                        />

                        {/* Ambient glow */}
                        <motion.div
                            animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-3/4 rounded-full bg-primary/20 blur-[6rem]"
                        />

                        <div className="relative z-40 flex flex-col items-center text-center py-16 lg:py-20 px-6">
                            {/* Logo — clean hover, no jitter */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.15, ease: ease.expo }}
                                whileHover={{ scale: 1.06 }}
                                className="relative mt-0 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-primary/40 rounded-2xl blur-2xl"
                                />
                                <Image
                                    src="/logo.svg"
                                    alt="Logo"
                                    width={140}
                                    height={40}
                                    className="h-8 w-auto"
                                />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.25, ease: ease.expo }}
                                className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-[1.2] mt-8 max-w-3xl"
                            >
                                The clearest way to
                                <br />
                                watch the budget
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.35, ease: ease.expo }}
                                className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl"
                            >
                                Join thousands of young Kenyans tracking spending <br /> and demanding accountability today
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.45, ease: ease.expo }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-6"
                            >
                                <Link href="/learn">
                                    <Button size="lg" className="text-base">
                                        Start Learning
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default Cta;
