"use client";

import React from "react";
import { motion } from "motion/react";
import Wrapper from "../global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { AlertCircle, BookOpen, MessageSquareX, ShieldAlert } from "lucide-react";
import { cn } from "@/utils";

const cards = [
    {
        title: "Technical Barrier",
        description: "Complex treasury jargon makes the budget inaccessible to over 80% of the population, creating a wall between citizens and their money.",
        icon: BookOpen,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Digital Misinformation",
        description: "In the absence of clear data, misinformation spreads faster than facts on social media, leading to confusion and misguided outrage.",
        icon: MessageSquareX,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "The Resulting Crisis",
        description: "Political passion without fiscal literacy leads to protests without policy proposals—anger that lacks the answers for real change.",
        icon: ShieldAlert,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
    }
];

const Disconnect = () => {
    return (
        <section id="disconnect" className="w-full py-12 lg:py-16 relative overflow-hidden">
            <Wrapper>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <SectionBadge title="The Challenge" />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mt-4"
                    >
                        Kenya&apos;s youth are politically active but <span className="text-primary">fiscally excluded.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground mt-4 leading-relaxed"
                    >
                        The energy is there, but the literacy is missing. We are closing the gap between noise and impact.
                    </motion.p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-5 rounded-2xl border border-white/10 bg-white/2 hover:bg-white/5 transition-all duration-300"
                        >
                            <div className="mb-3 flex items-center gap-2.5">
                                <div
                                    className={cn(
                                        "size-8 shrink-0 rounded-lg flex items-center justify-center ring-1 ring-white/10",
                                        card.bg,
                                        card.color
                                    )}
                                >
                                    <card.icon className="size-4" />
                                </div>
                                <h3 className="text-lg font-bold leading-tight">{card.title}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {card.description}
                            </p>
                            
                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
};

export default Disconnect;
