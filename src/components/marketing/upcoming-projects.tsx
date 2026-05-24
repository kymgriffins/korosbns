"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/ui/section-badge";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Rocket, Users2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const projects = [
    {
        title: "Town Halls",
        timeline: "47 Counties",
        summary: "Physical forums in every county where youth interrogate local budget estimates with MPs and MCAs.",
        tags: ["Direct dialogue", "Duty bearers", "Budget estimates"],
        href: "/learn",
        cta: "Open civic brief",
    },
    {
        title: "Campus Hubs",
        timeline: "20 Universities",
        summary: "Permanent student chapters dedicated to fiscal analysis, debate, and peer-to-peer education.",
        tags: ["Student leaders", "Fiscal analysis", "Peer education"],
        href: "/learn",
        cta: "Start leadership story",
    },
    {
        title: "Budget Verification Hub",
        timeline: "National Scale",
        summary: "A shared desk connecting youth, journalists, and experts to verify fiscal claims with evidence.",
        tags: ["Fact-checking", "Open civic data", "Evidence-based"],
        href: "/challenges",
        cta: "Join challenge loop",
    },
];

const UpcomingProjects = () => {
    return (
        <section id="engagement" className="w-full py-24 md:py-48">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-4xl">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">The Engagement</span>
                        <h2 className="gusto-heading">From Online Outrage to <span className="italic font-serif text-primary">Offline Action</span>.</h2>
                    </div>
                    <p className="gusto-text max-w-sm mb-4">
                        Building permanent spaces for direct dialogue and peer-to-peer education across the country.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
                    {/* Town Halls - Large Feature Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-cardbox p-8 lg:p-10"
                    >
                        <div className="relative z-10 md:max-w-[60%]">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                                <CalendarDays className="size-3.5" />
                                47 Counties Active
                            </div>
                            <h3 className="text-2xl lg:text-4xl font-bold tracking-tight mb-4">Town Halls</h3>
                            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6">
                                Physical forums in every county where youth interrogate local budget estimates with MPs and MCAs. We bring the policy to the people.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {["Direct dialogue", "Duty bearers", "Budget estimates"].map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-foreground/5 text-xs font-medium border border-foreground/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href="/learn"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:bg-primary/90 hover:gap-3"
                            >
                                Open civic brief
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        {/* Background Image/Graphic for the large card */}
                        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 -z-0 pointer-events-none opacity-20 md:opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                             <Image 
                                 src="/images/towwnhallmay/129A3863.jpg" 
                                 alt="Town Hall" 
                                 fill 
                                 className="object-cover object-left md:object-center grayscale group-hover:grayscale-0 transition-all duration-700" 
                             />
                            <div className="absolute inset-0 bg-linear-to-l from-cardbox via-cardbox/20 to-transparent" />
                        </div>
                    </motion.article>

                    {/* Campus Hubs - Medium Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-cardbox p-8 flex flex-col justify-between"
                    >
                        <div className="relative z-10">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
                                <Users2 className="size-3.5" />
                                20 Universities
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Campus Hubs</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                Permanent student chapters dedicated to fiscal analysis, debate, and peer education.
                            </p>
                        </div>
                        
                        <Link
                            href="/learn"
                            className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2 transition-all"
                        >
                            Start leadership story
                            <ArrowRight className="size-4" />
                        </Link>

                        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors" />
                    </motion.article>

                    {/* Verification Hub - Small Wide Card */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-cardbox p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="md:max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-1.5 text-xs font-semibold text-teal-500">
                                <Rocket className="size-3.5" />
                                National Scale Launch
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Budget Verification Hub</h3>
                            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                                A shared desk connecting youth, journalists, and experts to verify fiscal claims with evidence. Fact-checking the national budget in real-time.
                            </p>
                        </div>
                        <Link
                            href="/challenges"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-foreground/10 rounded-2xl font-bold transition-all hover:bg-foreground/5 hover:border-primary/30"
                        >
                            Join challenge loop
                        </Link>
                    </motion.article>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/learn"
                        className="px-5 py-2.5 rounded-full border border-foreground/10 bg-background text-sm font-bold text-foreground/80 transition-all hover:bg-foreground/5 hover:scale-105 active:scale-95"
                    >
                        Start Learning
                    </Link>
                    <Link
                        href="/learn?story=budget-trivia"
                        className="px-5 py-2.5 rounded-full border border-foreground/10 bg-background text-sm font-bold text-foreground/80 transition-all hover:bg-foreground/5 hover:scale-105 active:scale-95"
                    >
                        Play Trivia
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default UpcomingProjects;

