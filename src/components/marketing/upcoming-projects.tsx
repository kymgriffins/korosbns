"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Users2, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils";
import { Button } from "../ui/button";

const UpcomingProjects = () => {
    return (
        <section id="engagement" className="w-full py-24 lg:py-40">
            <Wrapper>
                <div className="mx-auto max-w-4xl text-center mb-24">
                    <SectionBadge title="The Engagement" />
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mt-6"
                    >
                        From Online Outrage
                        <br />
                        <span className="text-muted-foreground italic">to Offline Action.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    {/* Town Halls - Large Feature Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={cn(
                            "md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                            "p-10 lg:p-14"
                        )}
                    >
                        <div className="relative z-10 md:max-w-[55%] h-full flex flex-col justify-center">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                                <CalendarDays className="size-3.5" />
                                47 Counties Active
                            </div>
                            <h3 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Town Halls</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                                Physical forums in every county where youth interrogate local budget estimates with duty bearers. We bring policy to the street.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["Direct dialogue", "Duty bearers", "Budget estimates"].map((tag) => (
                                    <span key={tag} className="px-4 py-1.5 rounded-full bg-foreground/5 text-[11px] font-bold uppercase tracking-wider text-foreground/60 border border-foreground/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Immersive Image integration */}
                        <div className="absolute right-0 bottom-0 top-0 w-full md:w-[45%] overflow-hidden pointer-events-none">
                             <Image 
                                 src="/images/towwnhallmay/129A3863.jpg" 
                                 alt="Town Hall" 
                                 fill 
                                 className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                             />
                             <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white dark:from-[#0A0A0A] to-transparent" />
                        </div>
                    </motion.article>

                    {/* Campus Hubs - Small Feature Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={cn(
                            "md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                            "p-10 flex flex-col justify-between"
                        )}
                    >
                        <div className="relative z-10">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                                <Users2 className="size-3.5" />
                                20 Universities
                            </div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Campus Hubs</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Permanent student chapters dedicated to fiscal analysis, debate, and peer-to-peer education.
                            </p>
                        </div>
                        
                        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent group/btn text-primary font-bold text-base mt-8">
                            Start leadership story
                            <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>

                        <div className="absolute -right-12 -bottom-12 size-48 bg-blue-500/5 blur-[5rem] rounded-full group-hover:bg-blue-500/10 transition-colors" />
                    </motion.article>

                    {/* Verification Hub - Wide Bottom Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={cn(
                            "md:col-span-12 group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A]",
                            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                            "p-10 lg:p-14 flex flex-col md:flex-row md:items-center justify-between gap-10"
                        )}
                    >
                        <div className="md:max-w-3xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-500">
                                <Rocket className="size-3.5" />
                                National Scale
                            </div>
                            <h3 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">Budget Verification Hub</h3>
                            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
                                A shared desk connecting youth, journalists, and experts to verify fiscal claims with hard evidence in real-time.
                            </p>
                        </div>
                        <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shrink-0">
                            Join challenge loop
                        </Button>
                    </motion.article>
                </div>

                <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
                    {["Start Learning", "Play Trivia"].map((label) => (
                        <Link
                            key={label}
                            href="/learn"
                            className="px-8 py-3 rounded-full border border-foreground/10 bg-white/5 backdrop-blur-sm text-sm font-bold text-foreground transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
};

export default UpcomingProjects;

