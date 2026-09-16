"use client";

import React from "react";
import { motion } from "motion/react";
import Wrapper from "../global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { AlertCircle, BookOpen, MessageSquareX, ShieldAlert } from "lucide-react";
import { cn } from "@/utils";
import { landingSectionsContent } from "@/content";

const disconnectIconMap: Record<string, React.ComponentType<{ className?: string }>> = { BookOpen, MessageSquareX, ShieldAlert, AlertCircle };

const cards = landingSectionsContent.disconnect.cards as Array<{ title: string; description: string; icon: string; color: string; bg: string }>;

const Disconnect = () => {
    return (
        <section id="disconnect" className="w-full py-12 lg:py-16 relative overflow-hidden">
            <Wrapper>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <SectionBadge title={landingSectionsContent.disconnect.badge} />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mt-4"
                    >
                        {landingSectionsContent.disconnect.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground mt-4 leading-relaxed"
                    >
                        {landingSectionsContent.disconnect.description}
                    </motion.p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 md:divide-x md:divide-border/50">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative py-2 md:px-6 first:md:pl-0 last:md:pr-0"
                        >
                            <div className="mb-3 flex items-center gap-2.5">
                                <div
                                    className={cn(
                                        "size-8 shrink-0 rounded-lg flex items-center justify-center",
                                        card.bg,
                                        card.color
                                    )}
                                >
                                    {(() => { const Icon = disconnectIconMap[card.icon as string] || BookOpen; return <Icon className="size-4" />; })()}
                                </div>
                                <h3 className="text-lg font-bold leading-tight">{card.title}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
};

export default Disconnect;
